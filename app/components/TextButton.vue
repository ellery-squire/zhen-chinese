<template>
    <NuxtLink class="text-button" :to="props.toPage">
        {{ props.text }}
    </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
    toPage?: string,
    text?: string
}>()
</script>

<style lang="scss">
a.text-button {
    position: relative;
    border: 3px solid var(--text-secondary);
    padding: 30px;
    max-width: fit-content;
    font-weight: 300;
    font-size: 30px;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        right: 100%;
        background-color: var(--accent-crimson);
        transition: var(--trans-fast);
        z-index: -1;
    }

    &:hover {
        border: 3px solid var(--accent-crimson);
        color: var(--text-primary);

        &::after {
            right: 0;
        }
    }
}
</style>