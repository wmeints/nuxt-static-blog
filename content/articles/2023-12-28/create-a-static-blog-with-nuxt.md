---
title: "Building a static blog with Nuxt"
---

As many know, I like to use my personal blog site for all sorts of experiments. I converted it from Wordpress
to Ghost, and then to pure ASP.NET Core. This time I'm exploring the option to turn the whole thing into a static
website with Nuxt. 
<!-- more -->

I tried several frameworks to build a static blog site. I tested Next.JS, Sveltekit, and Nuxt. All of these are
awesome to build full-stack applications with. They're flexible, and very productive. However, not all of them
are as easy to work with for static websites. That's why I settled on Nuxt, a framework that has the best options
for building a static website so far.

Please feel free to look at [the code on Github][EXAMPLE_REPO] to follow along.

## Getting started

Nuxt is a framework on top of Vue. It adds extra functionality to turn Vue from a client-side framework into a
fully featured website building tool. Vue is a Javascript component framework that allows you to build single-page
applications, enrich existing applications, and server-side rendered applications when you host on NodeJS.

Vue has a component model where a single component is hosted in a single file. The content of each component file
is split in three parts: The template, a script section to control behavior, and a style section to control the looks.

It's very flexible, because it doesn't prescribe a lot of things besides the component structure. Nuxt adds a few more 
requirements on top, but it only adds to the productivity aspect. 

Let's explore Nuxt by building a static blog site!

To set up the static blog site, I followed these steps:

1. Create a new project by executing `npx nuxi@latest init <project-name>`.
2. Follow the instructions to set up the project. I recommend using TypeScript.

To render content on the blog I used the [Content module][CONTENT_MODULE] for Nuxt. This module allows you to write
markdown content in a separate folder that can then be rendered on the website using Vue components.

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

After installing the Tailwind CSS components, I generated a new configuration file for the Tailwind CSS framework
using the following command:

```bash
npx tailwindcss init
```

Once the configuration was created, I modified it to include the typography addon. This is what I got
as the configuration file after adding the typography addon:

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

With the configuration in place it was time to start adding some content into the website. 

## Rendering content

To write content for my new static blog site, I'm going to write markdown files in the `content/articles` folder
of my project directory. For example, I can create a file `content/articles/2023-12-28/create-a-static-blog-with-nuxt.md` to
get a page `/articles/2023-12-28/create-a-static-blog-with-nuxt/` after running the build. 

To test things out, I added a basic blog post with the following content:

```markdown
---
title: Create a static blog with nuxt
---

This is a sample blog post.
```

To render the content I needed to set up a page that's going to load the markdown file and render it. 
It turns out that this works best if you use a page structure that mirrors the structure in the `content` directory. 
For me that meant, I had to create a Vue component in the file `pages/articles/[...slug].vue`.

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
* Then, I rendered some container divs to provide a nice layout for my blog content.
* Finally, I added a `<ContentRenderer>` component instance that refers to the `doc` 
  variable to render the content of the markdown file. 

Note that I rendered the `title` property from the front-matter section in the markdown file separately.

At this point, the website didn't render as expected because I didn't use page rendering. I had to modify
`app.vue` to look like this:

```vue
<template>
    <NuxtPage />
</template>
<script setup lang="ts">
useHead({
    titleTemplate: '%s - My website'
})
</script>
```

The template refers to a `NuxtPage` component that will load the `[...slug].vue` page I made for the website.
After this modification I got the content to render.

I also added a title template so that the blog post title is rendered in the `<title>` element of the HTML page.

With the content rendering setup, I figured that it was time to see how the build would work.

## Generating static content

You can host Nuxt websites on NodeJS or as static websites. I'm using the latter option because I don't need any server
interaction. All content is the same for everyone who visits my website. 

To generate a static website from a Nuxt application you can use the command:

```bash
npm run generate
```

After the build is completed, you can find the output in the `.output/public` directory. This is where I got suprprised.

By default, Nuxt will crawl your website for content that needs to be pre-rendered into static content. 
This excludes pages with a dynamic URL such as the one I'm using for my blog posts. I didn't know this, so I ended up
with a very empty website. My sample content wasn't rendering at all.

To fix it, I extended the config in `nuxt.config.js` to pre-crawl the blog posts and add them to the list of 
pre-rendered pages. 

First, I added a new function to `nuxt.config.ts` to pre-crawl the content of my blog:

```typescript
function getPostUrls() {
  return fs.readdirSync('content/articles')
    .flatMap(directory => fs.readdirSync(path.join('content/articles', directory))
      .map(file => path.join('content/articles/', directory, file))
    )
    .map(file => {
      const slug = path.basename(file).replace(/\.md$/, "");
      const postDate = path.basename(path.dirname(file));

      return `/articles/${postDate}/${slug}`;
    });
}
```

The function reads all sub-directories from the `content/articles` folder and then the files from those sub-directories.
I then map the file locations to a URL structure. The output of the function is a long list of URLs to my articles.

After adding the pre-crawl function, I modified the configuration to look like this:

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  generate: {
    routes: [
      '/about',
      '/',
      ...getPostUrls()
    ]
  },
  modules: ["@nuxt/content", "@nuxtjs/tailwindcss"]
})
```

The generate section lists a routes property that contains the homepage, the about page, and the output
of the `getPostUrls` function.

Now when I run the build, the output includes all of the blog posts in the website even if they're not
linked anywhere. 

## Building a sitemap

In the previous section I modified the configuration to render blogposts without linking to them anywhere. Later, I figured
that I needed a sitemap for my website to be found properly on Google. Luckily, there's a module for that too.

First, I setup the `nuxt-simple-sitemap` module:

```bash
npx nuxi@latest module add nuxt-simple-sitemap
```

Then, I added the following content to my configuration file to make the sitemap work correctly:

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  site: {
    url: 'https://fizzylogic.nl',
  },
  generate: {
    routes: [
      '/about',
      '/',
      ...getPostUrls()
    ]
  },
  modules: ["@nuxt/content", "@nuxtjs/tailwindcss", "nuxt-simple-sitemap"]
})
```

Now when I run the build, I get a new file `sitemap.xml` which contains all the content in my blog.

## Linking to posts from the homepage

My blog is easier to index with a sitemap, but I also want my homepage to list the latest blog posts so humans can come and visit. 
For this, I needed to write a little bit more code. In my homepage component located under `pages/index.vue` I'm listing the latest posts using this fragment:

```vue
<script lang="ts" setup>
const { data: latestPosts } = await useAsyncData('home', () => queryContent('articles').only(['_path', 'title']).sort({ age: -1 }).limit(3).find());
</script>
```

This fragment uses the `queryContent` function to search for content in the `content/articles` folder. I only want the title and the path to the article.
The list should be sorted by age where the newest content is displayed first. Finally, I only want three items in the list for now.

## Summary

In this post we've covered quite a bit of ground. Getting started with Nuxt doesn't take a whole lot of time, but you'll find yourself exploring quite a few
docs before you can start creating a working static blog site. This guide will help you get things going in the right direction a lot faster than
exploring all the docs in Nuxt. 

I found the whole process quite fun to be honest because it's something different from C# and Python. I'm not done yet, because I need to import my old content
and then setup a pipeline to incorporate some AI where it makes sense. For example, I'd like to automatically attach tags and categories to my content.

Overall a fun project for the holidays. I hope you enjoyed this read!

[VERTICAL_RYTHM]: https://imperavi.com/books/ui-typography/principles/vertical-rhythm/#:~:text=Vertical%20rhythm%20is%20typography%20built,%2C%20integrity%2C%20and%20design%20quality.
[CONTENT_MODULE]: https://content.nuxt.com/
[CONTENT_RENDERING]: https://content.nuxt.com/usage/render
[EXAMPLE_REPO]: https://github.com/wmeints/nuxt-static-blog
