import fs from "fs";
import path from "path";

function getPostUrls() {
  return fs.readdirSync('content/articles')
    .flatMap(directory => fs.readdirSync(path.join('content/articles', directory)).map(file => path.join('content/articles/', directory, file)))
    .map(file => {
      const slug = path.basename(file).replace(/\.md$/, "");
      const postDate = path.basename(path.dirname(file));

      return `/articles/${postDate}/${slug}`;
    });
}

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