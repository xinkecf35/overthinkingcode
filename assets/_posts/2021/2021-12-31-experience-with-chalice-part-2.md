---
title: 'Hitting the Limits of Simple: Working with AWS Chalice Part 2'
date: 2021-12-31
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

This blog post is a continuation of a previous blog post titled 
["Hitting the Limits of Simple: Working with AWS Chalice Part 1"][1].
If you haven't read that post already, I suggest reading it for the full
context. The TL;DR is we have jammed Chalice and Please together to get it to
produce a deployment package along with infrastructure to deploy; we need to
deploy that infrastructure now.

## Disclaimer

So like in the previous post, let me start with a disclaimer that is me trying
to stay within the set of tooling that my company already has for deploying
projects to AWS. You probably don't need to get this deep though I'll cover
that particular subject at the end. With that out of the way, let's continue.

## Terraform Integration and Limitations

A key selling point about Chalice is that it can do a one-touch deployment of
whatever you need to your AWS account based on your code. In my case, that means
all the resource definitions needed to deploy Lambda and API Gateway.

However, if you want, you can tell Chalice to produce the deployment package and
the IaC without actually applying them to your account. A nice touch is that you
can select between CloudFormation or Terraform for the generated IaC.

However, a Lambda function and API Gateway an app does not make. Like many apps,
we needed a database and thus wanted to add more resource definitions. And this
is where things start to break down.

If you're using CloudFormation, you can ask Chalice to merge a CloudFormation
template to include additional resources and reference them throughout the
template. However, if you're using Terraform, as we elected to do, you're pretty
much on your own.

On top of that, it's difficult to override specific settings of the resources it
does define. Where I work, all deployed resources must be tagged with metadata
for inventory and governance purposes. Additionally, we wanted to be able to
apply specific tags to certain resources to take advantage of some already
present automation in our account.

In short, we needed to do two things:

1. Apply this Terraform along with other Terraform we need to define the resources we need
2. Modify the generated Terraform to assign the metadata we need

## "Hacking" the Generated Terraform

So, to get the generated code in line with what I needed, I needed to tweak the
Terraform that Chalice produces. An important note is that the Terraform Chalice
produces is not in the HCL you would write in but the Terraform JSON
representation that Hashicorp supports specifically for programmatic usage.

On review of the generated IaC, I concluded I only really needed to do two things:

1. Delete AWS provider definition from the IaC
2. Delete `aws_api_gateway_deployment` resource

The first deletion is needed since I already have a provider definition with my
other Terraform code. Terraform gets upset if it sees duplicate provider
definitions in the same module, so I got rid of the generated in favor of the
one I already have. The difference in my provider definition versus the generated one
was the `default_tags` [argument][2].

The second one is a little more involved. The `aws_api_gateway_deployment` is
needed to tell API Gateway when to push a new version of your API. One of the
things the `aws_api_gateway_deployment` resource definition can do is create an
API Gateway stage resource that represents the published version of your API.
However, if you elect to create the stage via the `aws_api_gateway_deployment`
resource, you cannot manage that resource directly with all the
possible arguments.

So to tag the required stage resource and on the recommendation of the AWS
provider [docs][3], I created a separate `aws_api_gateway_stage` resource.
However, since I can not control what Chalice generates and you can not have
identically named resources, I deleted the API Gateway deployment resource so I
do not have that additional headache.

The deletion process was done by a small Python script that reads the
JSON file, deletes the relevant key-value pairs, and writes the result back out.
So not terribly hacky besides needing to do so in the first place.

However, we now needed to define those resources somewhere else.

### Augmenting Chalice with our Resources

Anyone who has worked with API Gateway and Terraform knows that getting rid of
the deployment resource means you do not have a deployed API anymore. However,
it would be an unmaintainable nightmare if I were to ask the Python script to
add the missing definitions as well. Thankfully, a different option does exist.

For the uninitiated, it's important to know that Terraform does not care about
where definitions live relative to the directory structure. Terraform
functionally merges all the definitions when Terraform walks over the module
root directory and determines the changes to the resource graph it needs to
apply. Thus, the solution is pretty anti-climatic: we added more Terraform files
we needed with the additional resources along with the generated file. As for
referencing the generated definitions, we can use the regular syntax:

For example:

```
resource "aws_aws_gateway_deployment" {
    ...
    rest_api_id = aws_api_gateway.rest_api.rest_api_id  # Taken from generated TF
    ...
}
```

We more or less looked at what Chalice produced, repeated definitions verbatim and
layered our changes on it.

Furthermore, after a colleague perused the Github issues for Chalice, we learned
that quite a few values from the Chalice configuration and Python code get
inserted [verbatim][4] into the Terraform JSON output from Chalice. So if you
wanted to reference values from your Terraform into the generated Terraform
produced by Chalice, you can do something like this in your
`.chalice/config.json` file:

```JSON
{
    "environment_variables": {
        "ENV": "${var.environment}",
        "DB_HOST": "${aws_rds_cluster.database_cluster.cluster_endpoint}"
    }
}
```

As you can see, Terraform variables references work as normal. One quick note
that you should wrap all variables with the string interpolation syntax instead
of leaving it bare.

Once this was all complete, integration with the rest of our Terraform was
straightforward if maybe a little odd. I won't cover the specifics, beyond
mentioning that we use Please to package the Terraform and shell scripts we use
to invoke Terragrunt and Terraform to deploy our infrastructure. Mechanically,
we just added another source and dependency to our deploy utility `sh_binary`
rule.

## Was It All Worth It?

It's been a few months since we completed all the legwork, and so far the code
still works. We have any added a few more tools like we did Chalice in form of
the Flake8 and Black so at least the pattern described in Part 1 is not hard to
extend.

However, and with the benefit of hindsight, if asked the question of whether we
would go with Chalice again, the answer seems to be mostly no.

Now, this answer is caveated by the fact that we wanted to stay within a
specific company ecosystem. Had we been more willing to ditch our existing
tooling, I suspect we would be more effusive about Chalice. In effect, doing it
halfway instead of fully committing meant we did not get the full benefit.

As a framework, I find it difficult to say if Chalice is worth it. Sure, it gets
the job done, and honestly, it brings you like 80-90 percent of what you might
want. With the decorator-based API, a Flask developer can be comfortable in
Chalice. But if one is comfortable with Flask, you might just want to reach for
something like [flask-apispec][5]. You don't get the auto-generated IaC feature
of Chalice, but if you can get an OpenAPI specification generated, you are most
of the way there. Chalice internally does the same with passing an OpenAPI
specification to define the integrations. If you can figure out how to
incorporate the API Gateway [extensions][6], you're there.

As for the Lambda function and deployment package, Chalice, by default, creates
a single zip file with everything in it. Procedurally, that process is not hard
to do on your own. After all, if you're able to understand what I did in Part 1,
you can figure out how to produce that file without Chalice. As far the
integration with AWS Lambda and the event handler, it's just a matter of
translating the event from AWS into something Flask can use ala
[serverless-express][8] for Node.JS and [apex/gateway][9]

If you still want a Chalice experience but with more control/features,
[Zappa][7] does look promising. At the minimum, it advertises being able to work
with WSGI apps which is pretty promising. And it certainly has more fun features
out of the box. If I was looking again, I think I might reach for Zappa over
Chalice.

But taking a step back and reflecting on the overall experience, at this point,
it feels like it should be better. At the moment, it feels like we are still
trying to figure out how to build non-trivially sized apps with serverless
architectures. I've seen teams manually craft APIs with Terraform resources
directly, and I have my direct experience of trying to use a framework. Both
options have not been fantastic to the point where I would want to repeat it
with no changes. 

Not that is to say I want to ditch AWS Lambda. I have briefly worked with EC2
and it's API; I can say I vastly prefer this. It's definitely useful not to
think especially hard about availability zones and other concerns. Compared to
Kubernetes, AWS Lambda certainly has less complexity in the required
infrastructure as code to define an entire service.


In short, in the biggest software engineering and development cliche summary
possible, the answer is that it depends. It's a question of how much time you
want to spend on your automation, how much you want to optimally leverage
Lambda, and whether or not serverless make sense for you. And that's before we
talk about the exotic solutions like packaging containers for AWS Lambda or
ditching AWS Lambda for AWS ECS and AWS Fargate. But that's a discussion for
another time.

[1]: https://overthinkingcode.net/posts/2021/12/experience-with-chalice-part-1
[2]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs#default_tags
[3]: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_deployment
[4]: https://github.com/aws/chalice/issues/1533#issuecomment-728810971
[5]: https://github.com/jmcarp/flask-apispec
[6]: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-swagger-extensions.html
[7]: https://github.com/zappa/Zappa
[8]: https://github.com/vendia/serverless-express
[9]: https://github.com/apex/gateway
