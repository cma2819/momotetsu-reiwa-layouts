<template>
  <v-app>
    <clipped-canvas
      v-if="backgroundUri"
      :background-image="backgroundUri"
      :clip-paths="[{x: 0, y: 0, width: 1632, height: 918}]"
    ></clipped-canvas>

    <div
      :style="{
        position: 'absolute',
        top: '918px',
        left: '0px',
        height: '162px',
        width: '1632px',
        fontSize: '28px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }"
    >
      <info-bar></info-bar>
    </div>
    <div
      :style="{
        position: 'absolute',
        top: '0px',
        left: '1632px',
        height: '918px',
        width: '288px',
        fontSize: '28px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }"
    >
      <side-info></side-info>
    </div>
  </v-app>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component } from 'vue-property-decorator';

import ClippedCanvas from './components/ClippedCanvas.vue';
import InfoBar from './components/InfoBar.vue';
import SideInfo from './components/SideInfo.vue';

@Component({
  components: {
    ClippedCanvas,
    InfoBar,
    SideInfo,
  }
})
export default class App extends Vue {
  backgroundUri = '';

  created(): void {
    nodecg.Replicant('assets:background').on('change', (newVal) => {
      if (newVal.length > 0) {
        this.backgroundUri = newVal[0].url;
      }
    });
  }
}
</script>

<style scoped>
  * {
    font-family: 'Kosugi Maru', sans-serif;
  }
  :root {
    overflow: hidden;
  }
  .view-transition-enter-active {
    transition: all .5s;
  }

  .view-transition-enter, .view-transition-leave {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
