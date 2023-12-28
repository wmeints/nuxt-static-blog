<template>
    <ContentDoc v-slot="{ doc }">
      <div class="container mx-auto">
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
<style>
.prose :first-child {
  @apply mt-8;
}

.prose h1 a {
  text-decoration: none;
}

.prose h1 a:hover {
  text-decoration: underline;
}

.prose h2 a {
  text-decoration: none;
}

.prose h2 a:hover {
  text-decoration: underline;
}

.prose h3 a {
  text-decoration: none;
}

.prose h3 a:hover {
  text-decoration: underline;
}
</style>