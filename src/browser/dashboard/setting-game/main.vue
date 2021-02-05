<template>
  <v-app :style="{minHeight: '520px'}">
    <div class="my-2">
      <setting-view></setting-view>
    </div>
    <div class="my-2">
      <player-view></player-view>
    </div>
    <message-alert></message-alert>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import SettingView from './components/SettingView.vue';
import PlayerView from './components/PlayerView.vue';
import MessageAlert from '../components/MessageAlertComponent.vue';

@Component({
  components: {
    SettingView,
    PlayerView,
    MessageAlert,
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
