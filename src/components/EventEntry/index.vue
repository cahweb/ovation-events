<template>
    <a :href="url" 
        class="d-flex flex-row justify-content-center mb-0"
    >
        <div class="event-entry py-3 px-2">
            <entry-image
                :src="info.productionLogoLink"
                :name="info.productionName"
                v-if="format == 'thumb'"
            >
            </entry-image>
            <div v-if="emptyImage" class="placeholder"></div>
            <div class=".event-info">
                <h5 v-html="dateRange"></h5>
                <h4 class="font-condensed">{{ info.productionName }}</h4>
                <div v-html="simpleDesc" class="desc"></div>
            </div>
        </div>
    </a>
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>