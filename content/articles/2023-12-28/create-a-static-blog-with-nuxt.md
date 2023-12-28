---
title: "Building a static blog with Nuxt"
---

Welcome to this static blog website. This post is a sample post that explains how this static website was created. 
Although you don't need to follow these steps anymore, since you're already up and running, I recommend reading
this post because it explains a couple of important choices I made when designing this setup.

## Getting started

The basis for this blog is Nuxt, a framework on top of Vue. It adds extra functionality to turn Vue from a client-side
framework into a fully featured website building tool. To set up the static blog site, I followed these steps:

1. Create a new project by executing `npx nuxi@latest init <project-name>`.
2. Follow the instructions to set up the project. I recommend using TypeScript.

Since this is a static blog we need tools to write content easily. [The content module][CONTENT_MODULE] provided by
Nuxt makes it easier to write content in Markdown and later render it to HTML.

I added the content module to the website using this command:

```bash
npx nuxi@latest module add @nuxt/content
```

Content is nice, but we'll need to style that content to make it readable. For that I prefer to use Tailwind CSS with
the typography addon. To add Tailwind CSS to the blog site, I used these commands:

```bash
npx nuxi@latest module add @nuxtjs/tailwindcss
npm install -D @tailwindcss/typography
```

After installing the Tailwind CSS components, we'll need to generate a configuration file. I used the following command
to generate the configuration for Tailwind CSS:

```bash
npx tailwindcss init
```

Once the configuration is created, I modified it to include the typograph addon. After modification, this is what I got
as the configuration file:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
```

With the configuration in place it's time to generate static content on the website.

## Rendering content

There are many ways to create a blog website. You can use Wordpress, Ghost, or any of the other pre-made website
tools. These tools allow you to edit content from their admin panel and you don't need to worry about editing code. 
Unless of course you want to modify something in the website tool itself.

The alternative, the static website offers other interesting perks. You can write code to your hearts desire. Which
can you can also interpret as a negative. You write content on your computer, run a generator, and deploy the result.
The advantage here is that you get a static website that's super hard to modify by hackers. It's also super fast.

I prefer the static route for obvious reasons, I'm a software engineer, I know how to code. I also like the security and
performance aspect. But it does make things a little more complicated when you want to publish content quickly.

To write content for the static blog site, we need to add markdown files in the `content` directory. For example, when
you create a file `content/articles/2023-12-28/create-a-static-blog-with-nuxt.md` You'll end up with
a page `/articles/2023-12-28/create-a-static-blog-with-nuxt/` when you run the build. 

To test things out, I added a basic blog post with the following content:

```markdown
---
title: Create a static blog with nuxt
---

This is a sample blog post.
```

To render the content we'll need to set up a page that's going to load the markdown file. It's easiest if you use a page
structure that mirrors the structure in the `content` directory. For me that meant, I had to create a
file `pages/articles/[...slug].vue`.

The `[...slug]` part makes it so that any segment in the url after `/articles` is matched and leads to this page.

To render markdown content, I then created a new template that looks like this:

```vue
<template>
    <ContentDoc v-slot="{ doc }">
      <div class="container mx-auto px-8">
        <div class="max-w-2xl mx-auto">
          <main>
            <article>
              <h1 class="text-4xl font-bold">{{ doc.title }}</h1>
              <div class="flex flex-col">
                <div class="prose dark:prose-invert prose-sm lg:prose-lg max-w-none">
                  <ContentRenderer :value="doc" />
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </ContentDoc>
</template>
```

The template contains a `<ContentDoc>` component that's responsible for rendering the markdown. The component
automatically loads markdown content from the `content` directory because the URL matches the directory structure
in the `content` directory. 

Using the `<ContentDoc/>` component without any children or attributes uses the default rendering logic. This is
fine if you don't care about the looks of your post. I however, prefer a little more finesse.

I modified the rendering by following these steps:

* First, I added a `v-slot` attribute to expose the document under the variable `doc` within the scope of 
  the `ContentDoc` component. 
* Then, I rendered some container divs and added a `<ContentRenderer>` component instance that refers to the `doc` 
  variable to render the content of the markdown file. 

Note that I rendered the `title` property from the front-matter section in the markdown file separately.

To verify that everything works, we can run the website with `npm run dev` and navigate
to `https://localhost:3000/articles/2023-12-28/create-a-static-blog-with-nuxt`.

Note that at this point, the website doesn't render as expected because I didn't use page rendering. I had to modify
`app.vue` to look like this:

```vue

```

## Generating static content



```bash
npm run generate
```

After the build is completed, you can find the output in the `.output/public` directory. 

To get the static site generation to work, I use the [Content module][CONTENT_MODULE] for Nuxt. This module 
allows you to write blog posts under `content/articles/[date]/[slug].md`. Where of course you'll need to replace `[date]`
with the actual date and `[slug]` with a sensible url-encoded string for the post title.

The content for the post is rendered by a page `pages/articles/[...slug].vue`. This page works by loading the content
from the right folder and rendering it into HTML. Feel free to checkout the [Content module][CONTENT_RENDERING] docs 
to learn more on how to customize content rendering.

By default, Nuxt will crawl your website for content that needs to be pre-rendered into static content. 
This excludes pages with a dynamic URL such as the one we're using for our blog posts. 
To fix it, I've extended the config in `nuxt.config.js` to pre-crawl the blog posts and add them to the list of 
pre-rendered pages.

## Keeping things readable

This gist includes a couple of components and Tailwind CSS to help you produce a sensible layout for your blog.
I prefer to use the tailwind CSS typography addon to get a nice [vertical rythm][VERTICAL_RYTHM].

Ideally you want to also limit the length of the lines in your prose to 65 characters. I'm not using
quite that hard a limit. Instead I'm keeping the content container nice and narrow so everything is nice to read.

[VERTICAL_RYTHM]: https://imperavi.com/books/ui-typography/principles/vertical-rhythm/#:~:text=Vertical%20rhythm%20is%20typography%20built,%2C%20integrity%2C%20and%20design%20quality.
[CONTENT_MODULE]: https://content.nuxt.com/
[CONTENT_RENDERING]: https://content.nuxt.com/usage/render