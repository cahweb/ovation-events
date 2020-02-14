<template>
    <a :href="url" 
        target="_blank"
        class="d-flex justify-content-center mb-0"
    >
        <div class="d-flex event-entry py-3 px-2 vertical-md-down horizontal-lg-up">
            <entry-image
                :src="info.productionLogoLink"
                :name="info.productionName"
                v-if="format == 'thumb'"
            >
            </entry-image>
            <div v-if="emptyImage" class="placeholder"></div>
            <div class="event-info">
                <h5 v-html="dateRange"></h5>
                <h4 class="font-condensed">{{ info.productionName }}</h4>
                <h6>{{ `${info.productionVenue.name}, ${info.productionVenue.location}` }}</h6>
                <div v-html="simpleDesc" class="desc"></div>
            </div>
        </div>
    </a>
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>