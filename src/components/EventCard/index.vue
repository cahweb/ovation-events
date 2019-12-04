<template>
    <div class="event-card">
        <a :href="url">
            <div class="d-flex flex-column justify-content-between">
                <entry-image 
                    :src="info.productionLogoLink"
                    :name="info.productionName"
                >
                </entry-image>
                <div v-if="info.productionLogoLink == ''" class="placeholder"></div>
                <div class="event-info d-flex flex-column justify-content-between">
                    <h4 class="mb-3 font-condensed">{{ info.productionName }}</h4>
                    <div class="divider"></div>
                    <p><strong v-html="dateRange"></strong></p>
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