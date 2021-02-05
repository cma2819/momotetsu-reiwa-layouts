<template>
  <div>
    <div
      class="my-2 pa-2"
    >
      <player-status-item
        v-for="(player, index) in players"
        :key="player.id"
        :player="player"
        :index="index"
        :poor="poor"
      ></player-status-item>
    </div>
    <v-row
      dense
      align="end"
      justify="end"
    >
      <v-col cols="auto">
        <v-text-field
          v-model.number="settleYear"
          min="1"
          max="100"
          step="1"
          type="number"
          size="3"
          suffix="年目時点で"
          hide-details
          :rules="[yearValidation]"
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          :disabled="!validation"
          @click="submitSettlement"
        >
          総資産を設定
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
/* global nodecg */
import clone from 'clone';
import { Vue, Component, Emit } from 'vue-property-decorator';
import { Player, Poor } from '../../../../nodecg/generated';

import PlayerStatusItem from './PlayerStatusItemComponent.vue';

@Component({
  components: {
    PlayerStatusItem
  }
})
export default class PlayerStatusListComponent extends Vue {

  players: Player[] = [];
  settleYear = 0;
  poor: Poor|null = null;

  created(): void {
    nodecg.Replicant('players').on('change', (newVal) => {
      this.players = clone(newVal);
    });
    nodecg.Replicant('game').on('change', (newVal) => {
      this.settleYear = newVal.status.settleYear;
      this.poor = newVal.status.poor;
    });
  }

  yearValidation(v: number): boolean {
    return (v <= 100) && (v > 0) && (v % 1 === 0);
  }

  get validateSettleYear(): boolean {
    return (this.settleYear <= 100) && (this.settleYear > 0) && (this.settleYear % 1 === 0);
  }

  get validation(): boolean {
    if (!this.validateSettleYear) {
      return false;
    }

    return !this.players.map((player) => {
      return (player.status.millions < 100000000)
      && (player.status.millions > -100000000)
      && (player.status.millions % 1 === 0);
    }).includes(false);

  }

  @Emit()
  submitSettlement(): void {
    nodecg.sendMessage('player:settle-millions', this.players.map(player => player.status.millions))
      .then(() => {
        nodecg.sendMessage('game:settlement', this.settleYear);
      });
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
