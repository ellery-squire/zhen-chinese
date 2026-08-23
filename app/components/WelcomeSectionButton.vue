<script setup lang="ts">
const props = defineProps<{
    zhTitle?: string,
    enTitle?: string,
    toPage?: string
}>()
</script>


<template>
    <NuxtLink :to="props.toPage" class="welcome-section-button">
        <p class="zh-title font-zh">{{ props.zhTitle }}</p>
        <p class="en-title">{{ props.enTitle }}</p>
    </NuxtLink>
</template>



<style lang="scss" scoped>
a.welcome-section-button {
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: var(--text-primary);
    padding: 80px;
    border: 3px solid var(--text-secondary);
    transition: var(--trans-fast);

    &::after{
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        top: 100%;
        z-index: -1;
        background-color: var(--accent-crimson);
        transition: var(--trans-fast);
    }

    &:hover {
        border: 3px solid var(--accent-crimson);
        &::after {
            top: 0;
        }
    }

    .zh-title {
        font-weight: 100;
        font-size: 140px;
        // -webkit-text-stroke: 1px var(--text-primary);
        // stroke: 1px var(--text-primary);
        margin-bottom: 100px;
    }

    .en-title {
        font-size: 50px;
        font-weight: 500;
    }
}
</style>