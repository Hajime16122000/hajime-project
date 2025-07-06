<template>
    <button class="btn">
        <slot />
    </button>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.btn {
    padding: 6px 12px;
    min-width: 128px;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
</style>