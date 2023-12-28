<template>
    <PageContainer>
        <ArticleContainer>
            <main>
                <article>
                    <h1 class="text-4xl font-bold">About</h1>
                    <div class="flex flex-col">
                        <div class="prose dark:prose-invert prose-sm lg:prose-lg max-w-none">
                            <p class="text-lg">Your biography should be listed here</p>
                        </div>
                    </div>
                </article>
            </main>
        </ArticleContainer>
    </PageContainer>
</template>
<script setup lang="ts">
useHead({
    title: 'About'
})
</script>