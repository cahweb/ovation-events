<template>
    <img v-show="hasSrc" 
        :src="src" 
        :alt="name" 
        :title="name" 
        :class="{ 'mr-4': isThumb, 'float-left': isThumb, thumb: isThumb, invisible: !hasSrc, 'entry-image-card': isCard, 'img-IE': (isIE && isThumb) }" 
        @load="doneLoad()" 
        ref="img"
    >
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>