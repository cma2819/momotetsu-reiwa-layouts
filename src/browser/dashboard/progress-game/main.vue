<template>
  <v-app :style="{minHeight: '520px'}">
    <progress-head></progress-head>
    <player-status-list></player-status-list>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import ProgressHead from './components/ProgressHeadComponent.vue';
import PlayerStatusList from './components/PlayerStatusListComponent.vue';

@Component({
  components: {
    ProgressHead,
    PlayerStatusList,
  }
})
export default class App extends Vue {
}
</script>

<style scoped>
  .view-transition-enter-active {
    transition: all .5s;
  }

  .view-transition-enter, .view-transition-leave {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
