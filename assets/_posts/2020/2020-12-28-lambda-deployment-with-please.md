---
title: 'Building Python Lambda Functions with Please: Abusing PEX Files for Fun and Profit'
date: 2020-12-28
author: Xinke Chen
tags:
  - Lambda
  - Please
  - Build Tool
  - Python
  - AWS
  - Pip
  - PEX
  - Tips
  - Function as a Service
---

So recently for my work, I had the opportunity to explore a build tool called
[Please][1] for adoption into projects that my team work on. Now I am not going
to discuss the reasons why we're adopting a build tool or even more generally
why you should in the first place because the reasons are boring and
well covered elsewhere. Instead, I am going to cover a specific aspect and
application of using Please because I feel it's a little entertaining and fun to
discuss how to bend a build tool to do what you want it to.

## Building an AWS Lambda Deployment Package
So in case you're not familiar with [Lambda][2], it's basically AWS's Function
as a Service, so called "serverless", offering where you upload your code and
AWS manages all the infrastructure related items for you. If you're more
familiar with other cloud vendors, Lambda is similar to Azure Functions or
Google Cloud Platform Cloud Functions. No fiddling with VM instances,
autoscaling, no installation of software packages and provisioning, just write
your code, upload, and deploy.  Now the nice thing about Lambda, and why it's
all the hotness now, is that's it's pretty cost-effective and easy to deal with.
If your application can tolerate cold starts and millions of requests per hour
(which in that case you probably just get servers/VMs anyway), it is quite a
convenient product.

Now the way you get code into Lambda, at least for Python, is basically a ZIP
archive of all your code and dependencies for Lambda to use, which AWS refers to
as a deployment package. To make a deployment packages is a pretty
straightforward process: write your code, get your dependencies, dump them all
into a folder with `pip install -t`, compress into a ZIP archive, upload to
either S3 or the AWS Cloud9 IDE and deploy. Of course, there's a a couple more
steps involved in actually getting the function mounted and ran by AWS, but
that's all from the coding side.

## Why Please in the first place?
With the brief discussion about Lambda covered, let's jump into the actual core
of this article and talk about Please, the build tool that I am exploring and
experimenting with.

So the reason I am on this path is that it's part of an effort by my team to
bring an application to AWS. As such, some automation is required, and as such
the need to setup a CI pipeline with Jenkins to build, test, and deploy to AWS
was needed, and thusly resulted in me dealing with Jenkins. And here's my
uninformed, hasty opinion on Jenkins and specifically Jenkinsfiles: I hate it. 

Now, my opinion on Jenkins it's probably just a factor of my immediately
available resources to me and some mild laziness, but the fact that every
mistake and syntax error I make can only really be checked by either committing
and triggering a build on the Jenkins server or manually editing changes in the
browser to replay became annoying very quickly. Not to mention, the
documentation on scripting the pipeline seem to be buried underneath a mountain
of verbosity. It is not a good sign when the accepted answer on StackOverflow to
the question ["How can I test a Jenkinsfile locally?"][3] is resounding "you
can't". Granted, the next most popular answer describes how to use Docker to
setup a Jenkins agent to test, but good lord that's less than ideal. At the
moment, I have no desire to learn how to provision a Jenkins server in order to
check if my pipeline syntax works. 

I am also aware of the [linting][4] plugin, but the requirement of needing the
correct API endpoints/URIs to setup the plugin is also aggravating. And even if
all the above were non-issues, it also means any build automation I defined
would only really work on Jenkins, and as someone who is obsessive about having
the ability and option to run an application the same way on my local machine as
in production, that prospect did not sit well.

And so, I volunteered to explore Please and see how we could adopt Please into
our processes. Now, I won't go into depth as to why Please is the option
selected, but boils down to a few other teams were already using it, and there's
already CI pipelines predefined that used Please as the primary means of
automating builds. In short, I would not have to touch Jenkins again, which as
far as I am concerned right now, a big win.

## Dependency Management with Please
For those new to build tools in general, here's a important thing to know about
Please and it's cousins like Bazel, Buck, and Pants: you have to define all
dependencies upfront. **All of them**. So not only do you have to define the
dependencies that you're explicitly using, you also have to include the implicit
dependencies that those explicit dependencies rely on. And as of the time of
writing, Please does not let you input something say like a `Pipfile.lock` and
have Please autogenerate the rules (might be a fun project to try to do that).
Now the reason for this is pretty straightforward: explicit dependencies and
versioning allow for hermetic and deterministic builds. In effect, at least for
Please, by explicitly defining the dependencies and not pulling dependencies
from your machines's `site-packages` or local builds, we can be more sure that
our builds are reproducible and less "works on my machine" annoyances that can
pop up. 

So to accomplish the above task, I found `pip show` to be very useful in
figuring out the needed dependencies. Alternatively, if you're using something
like `pipenv`, you could also just use `pipenv graph` and it will helpfully
produce a graph structure of all the packages your application uses. In my case,
the task didn't take too long, and was done in fairly short order.

## Building the Lambda Functions with Please
### An Introduction to PEX Files
Once the dependencies were all defined, the next step was pretty simple and that
was to get Please to produce a "binary" of the Lambda function. With Please,
this is done in a pretty neat way by basically creating something called PEX
file, or Python Executable. A product out of Twitter, it's a way to, as the [PEX
docs][11] put it, to create a self contained Python application in the same
spirit as virtualenv. You feed it the dependencies you need, your code, and it
all get bundled up in a nice little file with a `.pex` extension. There's just
one small problem: Lambda doesn't use PEX files.

### A Small Hiccup
In an ideal world, Lambda functions would be able to just use PEX files and we
would be done. Alas, that's not the world we live in (yet) and as such the work
continues. Now, in a process of figuring out if there was a neat way to make PEX
files work on Lambda, it so happens that [Pants][6] had an answer for this in a
neat little package called [Lambdex][7]. Lambdex neat little selling point is
that it adds the necessary things into the PEX file needed for Lambda to find
the right entry-point and execute your code. 

So I quickly gave it a whir, installed Lambdex, built the binary, and tried it
out...

to find out it didn't quite work. Ran into a `ModuleNotFound` error. So cue some
head scratching and research. I found out a little later after I did my ultimate
and arguably more "fun" solution was that Please organized the internal
structure in a slightly different way from expected by Lambdex, and as such
Lambdex's module resolution didn't quite work. It also turned out that along
with modifying the PEX file, it appeared that the binary also needed the `pex`
library packaged in order to bootstrap the application, which was problematic
because I had a 1MB maximum compressed size (Note: it's only this tiny because I
am dealing with [Lambda@Edge][8]). However, prior me was now annoyed and all he
wanted in the moment was just a darn ZIP archive without too much extra hassle.

But here's the thing, it turns out I already had a ZIP archive.

### PEP 441 (Alternatively, Abusing PEX files)
Now, I should probably state that I am not first one in my organization to use
Please to make a Lambda Deployment Package. Some prior art from other teams
showed that they were using the [`genrule`][10] build rule to make their
deployment packages. However, the ugly part, and the part I had hoped to avoid
by using Lambdex was the means they were handling dependencies. You see, Please
outputs Python packages collected from `pip` as wheels, not as plain modules
with source files. So in order to use them in the manner that Lambda
expects,they were uncompressing every wheel and moving them into a ZIP archive
manually. To me that approach was sufficiently inelegant and annoying enough
prompted the investigation with Lambdex.

However, remembering the aforementioned work did give me an idea, what happens
if I unzip a PEX file? Upon trying that out, to my pleasant surprise, it worked
and I had all the original source files. Organized in a specific directory
structure by Please that mirrored the project, but still, I had everything
there, dependencies and all. Upon reading more about PEX, I learned that PEX are
part of a somewhat little known specification, at least according to
[PEP441][5], of Python ZIP Applications. In essence, a PEX file is just a
self-extracting ZIP archive of Python files and modules with a top level
`__main__.py` at the root of the archive.

Now, I don't really care about the PEX file, I just wanted a Lambda Deployment
Package. However, with Please so conveniently creating this neat little archive
with everything already in it, just in the "wrong" places, I said "screw it" and
extracted the PEX file, copied what I needed to the correct places (really, just
flattening the directory structure), recompressed the code into a new ZIP
archive, and called it a day. 

Of course, I did check if this new package worked by utilizing the [AWS SAM][12]
tool you can use to build and test Lambda functions locally by extracting the
files from the ultimate ZIP archive I made and mounted said files for SAM to
run. And wouldn't you know, it worked just fine 😁. A quick upload to AWS also
confirmed that this little technique worked.

## Conclusions
So this little exploration of using Please to automate the builds of Lambda
Functions has been somewhat fun and surprisingly engaging. Of course, the
extracting of the PEX file to make a Lambda Deployment Package is probably a
little convoluted, and relies on knowing the  internal structure of the PEX
files a little too much, even it does mirror the project directory layout.
Still, a darn sight better than manually trying to get Python wheels into a
similar package.

As for doing it the "proper" way, I may still explore trying to get Lambdex to
work within Please. Better yet, might even define a Lambda specific build rule
and contribute it to the third party build rules that Please has, so called
[Pleasings][9] But that's a story for another time.

[1]:https://please.build/
[2]:https://aws.amazon.com/lambda/
[3]:https://stackoverflow.com/questions/36309063/how-can-i-test-a-change-made-to-jenkinsfile-locally
[4]:https://plugins.jenkins.io/jenkinslint/
[5]:https://www.Python.org/dev/peps/pep-0441/
[6]:https://www.pantsbuild.org/docs/awslambda-Python
[7]:https://github.com/wickman/lambdex
[8]:https://aws.amazon.com/lambda/edge/
[9]:https://please.build/pleasings.html
[10]:https://please.build/lexicon.html#misc
[11]:https://pex.readthedocs.io/en/latest/
[12]:https://aws.amazon.com/serverless/sam/