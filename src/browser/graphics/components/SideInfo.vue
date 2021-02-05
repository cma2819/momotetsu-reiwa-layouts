<template>
  <v-container
    v-if="game && players"
  >
    <v-row
      :style="{
        height: '100%',
      }"
    >
      <side-info-ym
        :rule-year="game.rule.years"
        :is-duel="game.rule.isDuel"
        :status-year="game.status.year"
        :status-month="game.status.month"
      ></side-info-ym>
      <side-info-player-list
        :players="players"
        :poor="game.status.poor"
        :settle-year="game.status.settleYear"
      ></side-info-player-list>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/* global nodecg */
import clone from 'clone';
import { Vue, Component } from 'vue-property-decorator';
import { Game, Players } from '../../../nodecg/replicants';

import SideInfoYm from './SideInfoYmComponent.vue';
import SideInfoPlayerList from './SideInfoPlayerListComponent.vue';

@Component({
  components: {
    SideInfoYm,
    SideInfoPlayerList,
  }
})
export default class SideInfo extends Vue {
  game: Game|null = null;
  players: Players|null = null;

  created(): void {
    nodecg.Replicant('game').on('change', (newVal) => {
      this.game = newVal;
    });
    nodecg.Replicant('players').on('change', (newVal) => {
      this.players = clone(newVal);
    })
  }
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
