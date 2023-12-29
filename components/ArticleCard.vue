<template>
    <div class="card shadow">
        <div class="card-body">
            <h2 class="card-title">{{ title }}</h2>
            <p>{{ description }}</p>
            <div class="card-actions justify-end">
                <NuxtLink :to="`${url}`">Read more</NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    title: string;
    description: string;
    url: string;
}>();
</script>