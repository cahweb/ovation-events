<template>
    <div class="d-flex flex-row">
        <div class="scroll-control">
            <div class="scroll-left float-left d-flex align-items-center justify-content-center">
                <div class="scroll-button text-primary d-flex justify-content-center align-items-center"
                    :class="{'click-down': isLButtonDown}"
                    @click="smoothScroll(-scrollInterval)"
                    @mousedown="clickRespDown('left')" 
                    @mouseup="clickRespUp('left')"
                >
                    <fa-icon icon="angle-left"></fa-icon>
                </div>
            </div>
            <div class="scroll-right float-right d-flex align-items-center justify-content-center">
                <div class="scroll-button text-primary d-flex justify-content-center align-items-center"
                    :class="{'click-down': isRButtonDown}"
                    @click="smoothScroll(scrollInterval)"
                    @mousedown="clickRespDown('right')" 
                    @mouseup="clickRespUp('right')"
                >
                    <fa-icon icon="angle-right"></fa-icon>
                </div>
            </div>
        </div>
        <div class="scrollbox d-flex flex-row align-items-center">
            <event-card 
                v-for="event in eventList" 
                :key="event.performanceId" 
                :info="event"
                @cardLoad="cardLoad()"
            >
            </event-card>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>