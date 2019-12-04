<template>
    <div class="d-flex flex-row">
        <div class="scroll-control">
            <div 
                class="scroll-left float-left d-flex align-items-center justify-content-center"
                @click="smoothScroll(-scrollInterval)" 
            >
                <h1 class="scroll-button font-condensed text-primary">&lt;</h1>
            </div>
            <div 
                class="scroll-right float-right d-flex align-items-center justify-content-center"
                @click="smoothScroll(scrollInterval)" 
            >
                <h1 class="scroll-button font-condensed text-primary">&gt;</h1>
            </div>
        </div>
        <div class="scrollbox d-flex flex-row">
            <event-card 
                v-for="event in eventList" 
                :key="event.performanceId" 
                :info="event">
            </event-card>
        </div>
    </div>
</template>

<script src="./script.js"></script>
<style scoped lang="scss" src="./style.scss"></style>