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

In writing, the frequent advice and refrain is to "show, don't tell". In that
sprit, I figured I'll show what this blog's focus and philosophy is by writing
on why and how I built this blog, and hopefully elucidate the thinking behind
"Overthinking Code".

## Requirements

So the personal reasons as to why I created this blog are the following:

- Create a personal brand,
- Do something between graduation and the start of work
- learn something new and stay sharp on technical skills

For the blog itself, I had a number of requirements I wanted if I was going to
build the blog up from scratch and not use something like WordPress,
Squarespace, or even a blog starter made by someone else. To that end, I had the
following list of criteria that the blog had to satisfy:

- Static site generation
- Be in a language and framework I want to work in
- Markdown-based formatting
- Little to none server-side infrastructure; no external CMS APIs, no GraphQL

So as you can see, it not a very long list of requirements but it is specific. I
believe that a blog shouldn't necessarily need a full fat database or query
layer to present and manage content. I can see the need for a full featured CMS
if you have lots of content or have many authors, but for a personal blog, it's
overkill and bloat. The maintenance alone would pretty much guarantee that I
would not want to write content often for the blog. Beyond that, a static
website is cacheable and better for SEO compared against an SPA-based solution
or Wordpress-based site with no caching configured. Now a plain HTML website
would accomplish these things but writing long form HTML markup sucks, so a site
generator that can use Markdown is something I am willing to maintain if it
means I actually want to write content.

Given the requirements, I realize that I have effectively described a
Jekyll-powered website but without Jekyll. I never worked with Ruby before, and
given some of the functionality I wanted, potentially needing to learn Ruby
along the way would probably have resulted in me not finishing this project in
the time frame that I wanted. As a result, I primarily started looking at
JavaScript based frameworks; so projects like Hugo, Gatsby, and what not. Now, I
probably should admit I was biased towards anything that used Vue just because
I've extensively worked with Vue. So with that in mind, two projects ended up on
my short list, [Nuxt][1] and [Vuepress][2]. Initially, I tried starting with
Vuepress because it's focus on documentation and blog websites. It ticked all
the right boxes, and it seemed to have the best and fastest shot at actually
accomplishing what I want.

However, I ultimately settled on Nuxt for a couple reasons. One issue was
Vuepress' philosophy "convention is better than configuration". Had I not a very
specific vision of what I wanted the site to be, I think I would've used
Vuepress. However, due to other things I wanted to do, like use SCSS instead of
Stylus, and a more structured `posts` directory structure, it looked like I was
going to spend a lot more time trying to rip things out than were I to start
from scratch. The other issue was just the age of the project. By being a much
younger product, it was harder to find examples on how to configure the theme
system or documentation on how to more concretely work with it. At this point, I
pivoted towards using Nuxt and was a lot happier in that I was able to get what
I wanted a lot faster than it seemed probable had I decided to continue with
Vuepress.

## Problems and Issues Encountered

According to the Git commit history, the building of the infrastructure took a
little under two months. During that time, I ran into a few issues during that
time, and I figure I highlight one or two here as it might be useful to someone
else.

### Route Generation

So I started this project prior to Nuxt version 2.13. If you're never played
with Nuxt, this version is significant as this version introduced a crawler and
will during the build process generate routes for you. Prior to this version,
any routes that has dynamic route parameters would not be generated and thereby
not be rendered. Fortunately, in the Nuxt configuration you can specify routes,
either statically with an array of strings or more interestingly, a promise, and
Nuxt will dutifully render those routes for you. This approach, as covered in
the [docs][3] and in blog posts [here][4] and [here][5] is not a terribly novel
or difficult idea to implement. Now the key differences I have with the
aforementioned approaches is one, I do not want to dump every single post I will
ever make into a single directory, and two, I want my route slugs to have a
structured hierarchy, something like this:
`2020/07/making-of-overthinking-code`.

 Now, I will not add the code inline here as it's kind of long and it's mostly a
 straightforward exercise in either using `fs` or `glob` to read the contents of
 a directory plus a couple of regular expressions. Being a masochist, I went
 with slightly less nested directory structure in where I only group files by
 year, and I use a regular expression pull the month out of the filename since I
 put the date of publication into the filename. If you're curious on how this
 all goes down, here's a [link][6] to that code. Final thing to do is to tell
 the auto-generated Vue Router created by Nuxt to actually navigate to the
 correct component/page when given the route, something like this:

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
nested directory structure (unless I am writing 100+ posts a year, it did not
seem worth it), I created a new problem: I now don't have a convenient method of
importing files anymore. By divorcing the url/route from the actual directory
path, I no longer have an useful path/reference to the content. Of course,
nothing a simple dictionary can not fix. Seeing as I am already generating the
routes from the file directory structure, it wasn't much more to map routes to
the actual paths to the files and content.

The solution of just using a dictionary/map largely worked except for one small
thing: you couldn't navigate backwards. Specifically, how and where I was using
the dictionary resulted in not being to navigate backwards. My plan was just to
load the map in `asyncData`, lookup the route in the map, fetch the file at the
path provided and go on from there. Unfortunately, while this solution worked
while navigating links forward on the site, due to way that the Nuxt component
lifecycle worked, the relevant code executed client side, which is a problem,
considering the construction of the route to file-path map is very much a
server-side only operation. As a result, I had problems with nonexistent modules
not being available and thereby halting the rendering of the app, because, you
know, the module the code imports is not available client-side.

So after trying a number of quick fixes that did not solve the issue, I decided
to check the [Vue-SSR][7] (Server Side Rendering) documentation to see if it had
any useful suggestions, seeing as Nuxt is built on top of Vue and Vue-SSR.
Thankfully, this hunch proved to be the case. As stated in their [Data
Pre-Fetching and State][8] section:

> The asynchronous data from our components needs to be available before we
> mount the client side app - otherwise the client app would render using
> different state and the hydration would fail.

After reading the section further, I decided at this point to move all of the
route to content code to a Vuex store. The best part, since Nuxt integrates Vuex
for you as well, there's even a special Vuex action, `nuxtServerInit` that Nuxt
calls for to allow populate and mutate data upon the Nuxt Server starting up.
After bringing that all over, the problem resolved itself, server-side code
safely staying on the server-side. Bonus was that it made doing other things
later on easier, like a site-wide dark mode toggle 😀.

## Final Thoughts and Future Follow Up.

All in all, it's been  a fairly fun experience, even with some of the bumps
along the way. There are a few more infrastructure items to handle, but those
will require more time to evaluate and implement. A big item is a contact form,
or more accurately, a contact form that doesn't result in mail getting marked
spam and results in loads of junk mail from bots. I also may or may not do a
small follow up in terms of design or more specifically styling the website
since a good bit of frontend web development is styling. Only thing I will say
right now is that Flexbox is a god send, best thing since sliced bread. Only
final note is given all the work done in handling content, I have a feeling that
I might ultimately need to concede and use a database to manage all the content
anyway. Though, knowing myself, I probably still try to enforce the no active
server-side processes besides the web server, and I'll try to use SQLite instead
of something more sensible like Postgres or Mongo.

[1]: https://nuxtjs.org/
[2]: https://vuepress.vuejs.org/
[3]: https://nuxtjs.org/api/configuration-generate#routes
[4]: https://regenrek.com/posts/create-a-frontmatter-markdown-powered-blog-with-nuxt.js/
[5]: https://nirebu.com/blog/building-my-static-blog-with-nuxtjs-and-markdown-beginner
[6]: https://github.com/xinkecf35/overthinkingcode/blob/29feb8df0e3de15c34bd1ed89b992d3aa7aa9efa/plugins/content-utils.js
[7]: https://ssr.vuejs.org/
[8]: https://ssr.vuejs.org/guide/data.html