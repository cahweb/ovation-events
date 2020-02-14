<template>
    <div class="app">
        <div v-if="eventList.length">
            <div v-if="format == ''"
                class="d-flex flex-row justify-content-center"
            >
                <div class="load-gif"></div>
            </div>
            <div v-else>
                <div v-if="format == 'card'">
                    <scroll-box></scroll-box>
                </div>
                <div v-else class="d-flex flex-column">
                    <event-entry
                        v-for="event in eventList"
                        :key="event.productionId"
                        :info="event">
                    </event-entry>
                </div>
            </div>
        </div>
        <div v-else-if="ajaxError">
            <div class="alert alert-warning col-9 col-md-6 mx-auto mt-5">
                <p class="h6 mb-3"><strong>Network Error</strong></p>
                <p>It looks like your browser refused to allow the ticketed event information to load. This commonly happens in Google Chrome while using the Privacy Badger extension (or other, similar extensions/plugins on different browsers). If this is the case, please allow traffic from api.ovationtix.com and web.ovationtix.com in order to display the list of events.</p>
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>