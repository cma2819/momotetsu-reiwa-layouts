<template>
  <v-row
    :style="{ height: '100%' }"
    align="center"
    justify="center"
    no-gutters
  >
    <v-col cols="auto">
      <div class="mx-2">
        現在の目的地は
      </div>
    </v-col>
    <v-col cols="auto">
      <v-img
        v-if="goal.isCardShop"
        max-height="100"
        max-width="100"
        :src="cardShopImageUri"
        contain
      ></v-img>
      <v-img
        v-else
        max-height="100"
        max-width="100"
        :src="stationImageUri"
        contain
      ></v-img>
    </v-col>
    <v-col cols="auto">
      <div
        class="mx-2 font-weight-bold"
        :style="{
          fontSize: '2em'
        }"
      >
        {{ goal.name }}
      </div>
    </v-col>
    <v-col cols="auto">
      <div class="mx-2">
        です
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component } from 'vue-property-decorator';
import { Goal } from '../../../nodecg/generated';

import stationImage from '../img/station.png';
import cardShopImage from '../img/card.png';

@Component
export default class InfoBar extends Vue {
  goal: Goal = {
    name: '',
    isCardShop: false,
  };

  created(): void {
    nodecg.Replicant('game').on('change', (newVal) => {
      this.goal = newVal.status.goal
    });
  }

  get stationImageUri(): string {
    return stationImage;
  }

  get cardShopImageUri(): string {
    return cardShopImage;
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
