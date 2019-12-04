<template>
    <div class="app">
        <div v-if="appHeading == '' || format == ''"
            class="d-flex flex-row justify-content-center"
        >
            <div class="load-gif"></div>
        </div>
        <div v-else>
            <h2 class="heading-underline mb-5"
                v-html="appHeading"></h2>
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
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>