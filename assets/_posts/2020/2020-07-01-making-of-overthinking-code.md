---
title: The Making of Overthinking Code
date: 2020-07-02
author: Xinke Chen
tags:
  - meta
  - Nuxt
  - Vue
  - markdown
  - JavaScript
  - NodeJS
---

In writing, one is always told to "show it, don't tell it" in some form or
another So in that sprit, I figure I'll show what this blog is all about by
writing on why and how I built this blog and the decisions I made along the way.

## Requirements

So beyond the personal reasons as to why I created this blog (personal branding,
something to do after after graduation, learn something new), I had a number of
requirements I wanted if I was going to build the blog up from scratch and not
use something like WordPress, Squarespace, or even a blog theme made by someone
else. To that end, I settled on the following list of things that the blog had
to have:

- Static site generation
- Language and Framework I've used before or;
- Be in a Language and Framework I want to work in
- Markdown-based formatting
- Little to none server infrastructure; no APIs, no GraphQL

So as you can see, it not a very long but specific list of requirements. I
believed that a blog shouldn't need a full fat database or query layer to
present and manage content. I can see the need for a full feature CMS if you
have lots of content or have many authors, but for a personal blog, it's
overkill and bloat. The maintenance alone would pretty much guarantee that I
wouldn't want to write content often for it. Not to mention, a static website is
cacheable, fast to deliver, and better for SEO. Now a plain HTML website would
accomplish these things but writing long form HTML markup does suck, so a site
generator that can used Markdown is something I am willing to maintain if it
means I actually want to write content.

Essentially, I wanted a Jekyll-powered website but without Jekyll. I never
worked with Ruby and given some of the funcionallity I wanted, potentially
needing to learn Ruby on the fly would result in me not finishing this project
in the time frame I want. As a result, I primarily started looking at JavaScript
based frameworks; so projects like Hugo, Gatsby, and what not. Now, I probably
should admit I was biased towards anything that used Vue just because I've
extensively worked with Vue. So very quickly, two projects ended up on my short
list, [Nuxt][1] and [Vuepress][2]. Initially, I tried to starting with Vuepress
because it's focus is on documentation and blog websites. It ticked all the
right boxes, and it seemed to have the best shot at actually accomplishing what
I want.

However, I ultimately settled on Nuxt for a couple reasons. One issue is
Vuepress' belief 'convention is better than configuration'. Had I not a specific
vision of what I wanted the site to be, I think I would've liked Vuepress.
However, due to another things I wanted to do, like use SCSS instead of Stylus,
a more structured `posts` directory structure, it looked like I was going to
spend a lot more time trying to rip things out than were I to start from
scratch. The other issue was just simply the age of the project. By being a much
younger product, it was harder to find examples on how to configure the theme
system or documentation on how to more concretely work with it. At this point, I
pivoted towards using Nuxt and was a lot happier in that I was able to get what
I wanted a lot faster than it seemed were I to continue with Vuepress.

## Problems and Issues Encountered

According to the Git commit history, the building of the infrastructure took a
little under two months. During that time, I ran into a few issues as one of
might expect, and I figure I highlight one or two here as it might be useful to
someone else.

### Route Generation

So I started this project prior to Nuxt version 2.13. If you're never played
with Nuxt, this version is signficant as this version now has crawler built in
and will generate routes for you. Prior to this version, any routes that has
dynamic route parameters would not be generated and thereby not be rendered.
Fortunately, in the Nuxt configuration, you can specify dynamic routes, either
static with an array of strings or more interestingly a promise, and Nuxt will
dutifully render those routes for you. This approach, as covered in the
[docs][3] and in blog posts [here][4] and [here][5] this is not a terribly novel
or difficult idea to implement. Now the key differences I have with these
approaches is one, I do not want to dump every single post I will ever make into
a single directory, and two, I want my route slugs to have a little more
structure. So something like `2020/07/making-overthinking-code`.

 Now I will not add the code inline here as it's kind of long and it's mostly a
 straightforward exercise in either using `fs` or `glob` to read the contents of
 a directory plus a couple of regular expressions. Being a masochist, I went
 with slightly less nested directory structure in where I only group files by
 year, and I have a RegEx pull the month out of the filename since I put the
 date of publication into the filename as well as the frontmatter. If you're
 curious on how this all goes down, here's a [link][6] to that code. Final thing
 to do is to tell the auto-generated Vue Router created by Nuxt to actually
 navigate to the correct component/page when given the route, something like
 this:
 ``` JavaScript
// Extending Router Config in nuxt.config.js
 router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/posts/:year/:month/:slug',
        component: resolve(__dirname, 'pages/posts/_post.vue'),
      });
    },
  },
 ```

### Fetching And Rendering Content

I mentioned before that I was a masochist. Well, in wanting to have a less
nested directory structure (unless I am writing 50 posts a year, did not seem
worth it) I created a new problem: I now don't have a convenient of importing
files anymore. By divorcing the url/route from the actual directory path, I now
don't have an useful path/reference to the content. Of course, nothing a simple
dictionary can not fix. Seeing as I am already generating the routes from the
file directory structure, it wasn't much more to map routes to the actual paths
to the files.

The solution of just using a dictionary largely worked except for one small
thing: you couldn't navigate backwards. Initially, my plan was just to load the
map in `asyncData`, lookup the route in the map, fetch the file at path provided
and go on from there. Unfortunately, while this solution worked while killing on
links forwards on the site, due to way that Nuxt component lifecycle worked
with, it execute the code client side, which is a problem, considering the
construction of the route to file path map is very much a server-side only
operation. As you can probably guess now, I had problems with nonexistent
modules not being available and thereby halting the rendering of the app,
because, you know, the module it is asking is not available client-side. 

So after trying a number of quick fixes that did not solve the issue, I decided
to check the [Vue-SSR] documentation to see if it had any useful suggestions,
seeing as Nuxt is built on top of this. Thankfully, this prove to be the case.
As stated in their [Data Pre-Fetching and State][8] section: 

> The asynchronous data from our components needs to be available before we
> mount the client side app - otherwise the client app would render using
> different state and the hydration would fail.

After reading the section further, I decided at this point to move all of route
to content code to a Vuex store. The best part, since Nuxt integrates Vuex
for you as well, there's even a special Vuex action, `nuxtServerInit` that
Nuxt calls for to allow populate and mutate data upon the Nuxt Server starting 
up. After bringing that all over, the problem resolved itself, server-side
code safely staying on the server-side. Bonus was that it made doing other things
later on easier, like a site-wide Dark Mode toggle 😀.

## Final Thoughts and Future Follow Up.

All in all, it's a fairly fun experience, even with some of bumps along the way.
There are a few more infrastruture items to handle but those will require more
time to evaluate and implement, like a contact form, or more accurately, a contact
form that doesn't result in mail getting marked spam and results in loads of junk
mail from bots. I may or may not do a small follow up in terms of design or more
specifally styling the website since a good bit of frontend web development is
that. Only thing I will say right now is that Flexbox is a god send, best thing
since sliced bread. Only final note is that now this is all done for now, I
have a feeling that I might ultimately need to concede and use a database to
manage all the content anyway. Though, knowing me, I probably still try to enforce
no active server-side processes besizes the web server and I'll try to use SQLite
instead of something more sensible like Postgres or Mongo. 

[1]: https://nuxtjs.org/
[2]: https://vuepress.vuejs.org/
[3]: https://nuxtjs.org/api/configuration-generate#routes
[4]: https://regenrek.com/posts/create-a-frontmatter-markdown-powered-blog-with-nuxt.js/
[5]: https://nirebu.com/blog/building-my-static-blog-with-nuxtjs-and-markdown-beginner
[6]: https://github.com/xinkecf35/overthinkingcode/blob/29feb8df0e3de15c34bd1ed89b992d3aa7aa9efa/plugins/content-utils.js
[7]: https://ssr.vuejs.org/
[8]: https://ssr.vuejs.org/guide/data.html