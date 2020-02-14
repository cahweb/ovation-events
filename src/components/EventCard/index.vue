<template>
    <div class="event-card" 
        ref="card"
        :style="minHeight"
    >
        <a :href="url" target="_blank">
            <div class="d-flex flex-column justify-content-around">
                <entry-image 
                    :src="info.productionLogoLink"
                    :name="info.productionName"
                    @imgDone="imgLoadDone"
                >
                </entry-image>
                <div v-if="info.productionLogoLink == ''" class="placeholder"></div>
                <div class="event-info d-flex flex-column justify-content-between">
                    <div class="title-desc d-flex flex-column justify-content-between align-items-center">
                        
                        <h5 class="font-condensed event-title"
                            :class="{'with-blurb': blurb}"
                            :style="titleFontSize"
                            ref="title"
                        >
                            {{ displayTitle }}
                        </h5>
                        <h6 v-show="displaySubtitle"
                            class="font-condensed event-subtitle"
                            :class="{'with-blurb': blurb}"
                            :style="subtitleFontSize"
                            ref="subtitle"
                        >
                            {{ displaySubtitle }}
                        </h6>
                        <div v-if="blurb" v-html="simpleDesc" class="blurb"></div>
                    </div>
                    <div class="divider"></div>
                    <p class="date-range"><strong v-html="dateRange"></strong></p>
                    <p class="location">{{ info.productionVenue.name }}</p>
                    <div class="divider"></div>
                    <button 
                        type="button" 
                        class="btn btn-primary btn-block"
                    >
                        View Event
                    </button>
                </div>
            </div>
        </a>
    </div>
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>