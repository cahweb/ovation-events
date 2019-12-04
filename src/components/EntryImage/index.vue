<template>
    <img v-show="hasSrc" :src="src" :alt="name" :title="name" :class="{ 'mr-3': isThumb, 'float-left': isThumb, thumb: isThumb, invisible: !hasSrc, card: isCard }">
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>