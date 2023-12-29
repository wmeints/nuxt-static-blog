<template>
    <div class="container mx-auto">
        <div class="max-w-2xl mx-auto">
            <main>
                <article>
                    <h1 class="text-4xl font-bold">Recent Posts</h1>
                    <ul class="mt-8">
                        <li v-for="post in recentPosts">
                            <ArticleCard :title="post.title" :description="post.description" :url="post._path" />
                        </li>
                    </ul>
                </article>
            </main>
        </div>
    </div>
</template>
<script setup lang="ts">
const { data: recentPosts } = await useAsyncData("home", () =>
    queryContent("articles").only(["title","description", "_path"]).sort({ age: -1 }).limit(3).find(),
);
</script>
