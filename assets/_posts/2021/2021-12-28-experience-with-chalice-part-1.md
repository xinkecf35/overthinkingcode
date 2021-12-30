---
title: 'Hitting the Limits of Simple: Working with AWS Chalice Part 1'
date: 2021-12-28
author: Xinke Chen
tags:
  - Python
  - Terraform
  - CICD
  - AWS
  - Lambda
  - DevOps
  - Please
  - Build Tool
  - Pip
  - Function as a Service
---

Recently for my day job I have been working on a serverless application that
utilizes a framework called Chalice. The promise is that you write your code and
will turn that into deployed infrastructure on AWS. I figured it might be fun to
cover some of that experience, specifically the experience of trying to jam it
within the context of a larger build environment and reflections on the outcome
with Chalice.

## Disclaimer

Let's get something out of the way: if you're just a web developer/application
developer who has no interest or requirements to do specific things with your
infrastructure, even resource tagging, then Chalice is probably sufficient.
You can legitimately write your app code, ask Chalice to deploy everything, and
never have to care about the specifics of how Chalice got your app into your AWS
account. With an extensive decorator-driven API and support for most items
underneath the sun, Chalice truly does offer a zero-touch deployment.

It is that just under the specific ecosystem and set of tooling that exists in
my environment (for better or for worst) that I needed to do more than what
Chalice can nominally do out of the box.

But if you want any amount of control over what Chalice specifically creates,
you should reconsider whether or not Chalice will expedite your workflows.

## Duct Taping Chalice to Please

One interesting aspect, and probably the one thing that has made this both
easier and harder is that I needed to get Chalice running with Please, the build
tool that my company uses to build and deploy most software projects deploying
to AWS. Now, it just being a Python package you grab with `pip`, it should be
straightforward: Get Please to download said package and then use it in the
build rules.

Alas, it was not quite that simple as Please does not yet natively allow one to
consume a pip package as a tool/executable. Of course, one could just install it
to the build agent or a virtualenv and call it a day, but that goes very much
against what I wanted to do. In keeping with the spirit of Please, I wanted to
make Chalice hermetically available in my build environment.

### Hacking our way towards a Chalice Tool

Fortunately, Please has pretty decent Python rules, and thus I was able to hack
my way towards a solution. Ultimately, what I did was first have Please to pull
and download the Chalice package, and introspected the wheel to look at the
entry point specification. From there, I created a `python_binary` rule where
the only contents were the Chalice library as defined with a `pip_library` rule
and a `main.py` file that imports the relevant function to invoke the Chalice
CLI.

One thing of note is that I needed to set `zip_unsafe` as Chalice performs
filesystem operations to work, and thus doesn't behave well if it is not first extracted
from the PEX produced by the `python_binary` rule.

```Python
# The chalice binary main file. Note how it's just import of a module & function
# More info. can be found at https://packaging.python.org/en/latest/specifications/entry-points/
import re
import sys
from chalice.cli import main

if __main__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
    sys.exit(main())
```

```Python
# The Chalice tool rule definition.
# This file is placed under the tools/BUILD relative to project root
python_binary(
    name = "chalice-tool",
    main = "chalice-tool.py",  # see above
    zip_safe = False,
    deps = [
        "//third_party/python:chalice"  # Assumes Chalice is defined appropriately there
    ],
)
```

### Vendoring Python Packages for Chalice

One other big hurdle to manage was to get Python packages into the package that
Chalice makes. After all, what non-trivial piece of software doesn't rely on
third-party dependencies? Alas, this was easier said than done. While getting
the packages downloaded with Please is trivial, using the downloaded artifacts
less so. The issue is that the artifacts outputted are zip archives of the
packages. The reason why is to serve as an optimization to make the
construction of PEX files with `python_binary` faster.

Chalice, which is a build tool in it's own right, expects in most cases that you
would feed it a requirements file and let it download the packages you need for
your app. The naive thing would have been to maintain a separate file and have
Please not manage these particular packages, but I wasn't satisfied and wanted
only my BUILD files to contain the definitions of the dependencies.

So I initially explored getting the file to be produced by Please. The kind
folks behind Please told me about how I could use [pre-build functions][1] and
[`get_labels`][2] to inject all relevant rules and metadata into a `genrule` for
to produce a requirements file since the `pip_library` haves labels attached
that make that approach possible. And while I got this to work, I realized that
this setup involved me downloading the packages twice which is obviously
sub-optimal.

While I was thinking about this, I recalled while skimming the Chalice [app
packaging][3] documentation that they supported the "vendoring" of packages. The
particular thing that caught my eye was that how they talked about you could use
this to include internal packages or wheels you could not get with pip. I
realized that if I could get Please to place the wheels it fetches into a vendor
directory, Chalice would be able to use the packages for creating the deployment
package, and I would not need to download it twice.

The real trick for me now was how to do without going nuts listing every
dependency needed for the app. Fortunately, `genrule` has an argument called
`needs_transitive_deps` which does what you think it does: it pulls in not only
the explicit dependencies for your build rule but also all the implicit ones
that the explicit dependencies need. Fun fact, this is similar to how
`python_binary` is internally [defined]][5] so that it pulls all the
dependencies it needs. You still have to define the dependencies in the build
graph, but at least you do not have to enumerate them all.

However, as I wrote on a previous blog [post][4], Please internally zips up the
wheels you get via `pip_library` which placed as-is into the directory doesn't
do much of anything. In fact, when I was putting this together, I forgot about
this fact and was confused when the final app was unable to import anything.
A quick inspection of what Chalice produced revealed, and I quickly whipped up a
`genrule` which looks like the following:

```Python
vendored_package_list = [
  "//third_party/python:pg8000",
  "//third_party/python:requests".
]

# Creates the vendor directory with all my needed dependenecies:
genrule(
    name = "vendored-deps",
    srcs = vendored_package_list,
    outs = [
        "vendor"
    ],
    cmd = [
        "mkdir vendor tmp",  # creates the output needed + a working directory to unzip into
        "cd third_party/python",  # convenience thing
        # inline Bash script to extract all the wheels and move their contents into a vendor directory
        "for z in *.whl; do unzip -d $TMPDIR/tmp/$z; cp -R $TMPDIR/tmp/$z/third_party/python/. $TMPDIR/vendor/; done"
    ],
    needs_transitive_deps = True,
    deps = vendored_package_list
)
```

### Producing the Deployment Package

Now that I had my supporting infrastructure out of the way, it was time for to
produce the deployment package. Compared to the previous steps, this part was
pretty mundane with just a few caveats.

One caveat is that Chalice very inflexible about where the configuration file is
placed, so you better define your BUILD file and relevant rules in the place that
is expected.

```
# Expected directory structure
chalice-app/
├─ .chalice/
│  ├─ config.json
├─ BUILD
```

Another is that since Chalice needs to import your app as part of the packaging
process, you want to make sure you do not have code that connects to an external
database or the like happen as soon as it imports. There is a
`AWS_CHALICE_CLI_MODE` environment variable that is set when Chalice is running
in packaging mode which you can [use][6] to exclude that code.

Altogether, this is what the rule looks like:

```Python
genrule(
    name = "chalice-app",
    srcs = [
        ":app-srcs" # filegroup that collects all my Python source files,
        ":vendored-deps"
    ],
    outs = [
        "deployment.zip", # hardcoded
        "chalice.tf.json", #hardcoded
    ],
    cmd = [
        "cd base_dir", # change directory into where all the project files relative the project root
        "$TOOL --debug package --pkg-format terraform ./", # more or less takes the standard Chalice CLI arguments
        "python3 hack-chalice-tf.py chalice.tf.json", # Some post-processing
        "mv deployment.zip ../deployment.zip",
        "mv chalice.tf.json ../chalice.tf.json",
    ]
    tools = ["//tools:chalice-tool],
    deps = [
        ":app-srcs",
        ":vendored-deps"
    ],
)
```

Big win here is that the Chalice usage is the exact same way as you
would in your preferred shell.

## Wrapping Up for Now

Now, the astute among you will have noticed I have yet to talk about actually
deploying any of this. Or the fact there's a file called `hack-chalice-tf.py`
present in the above rule, but I do not elaborate on why it's there. In short,
that's a whole other story that I will tell next time. A tiny spoiler is it has
to do with how Chalice produces infrastructure to deploy. But I'll cover that in
the next post.

[1]: https://please.build/post_build.html
[2]: https://please.build/lexicon.html#get_labels
[3]: https://aws.github.io/chalice/topics/packaging.html#rd-party-packages
[4]: https://overthinkingcode.net/posts/2020/12/lambda-deployment-with-please
[5]: https://github.com/thought-machine/please/blob/8e1682170ca5c25abe2a19583d9d6b91b5c6427d/rules/python_rules.build_defs#L189
[6]: https://aws.github.io/chalice/topics/packaging.html#environment-variables
