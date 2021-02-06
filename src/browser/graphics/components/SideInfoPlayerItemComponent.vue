<template>
  <v-sheet :color="theme">
    <v-container>
      <v-row
        dense
        align="end"
      >
        <v-col
          class="font-weight-bold"
          cols="auto"
        >
          <side-info-rank
            :rank="player.status.rank"
            :color="theme"
          ></side-info-rank>
        </v-col>
        <v-col></v-col>
        <v-col
          v-if="poorWith"
          cols="auto"
        >
          貧
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="auto">
          <v-avatar color="white">
            <img
              v-if="player.thumbnail"
              :src="player.thumbnail"
            >
            <span
              v-else
              :style="{ color: 'black' }"
            >
              {{ player.name[0] }}
            </span>
          </v-avatar>
        </v-col>
        <v-col
          class="font-weight-bold ml-2"
        >
          {{ player.name }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="text-right">
          {{ yenString }}
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Player, Poor } from '../../../nodecg/generated';

import SideInfoRank from './SideInfoRankComponent.vue';
import DefaultIconImage from '../img/peach.png';

@Component({
  components: {
    SideInfoRank
  }
})
export default class SideInfoPlayerItem extends Vue {

  @Prop(Object)
  player!: Player;

  @Prop(Number)
  index!: number;

  @Prop(Object)
  poor?: Poor;

  get theme(): string {
    const themes = ['first', 'second', 'third', 'fourth'];

    return themes[this.index];
  }

  get poorWith(): boolean {
    if (!this.poor) {
      return false;
    }

    return this.poor.with === this.index;
  }

  get place(): string {
    const places: {[k: number]: string} = {
      1: '1st',
      2: '2nd',
      3: '3rd',
      4: '4th',
    }

    return places[this.player.status.rank];
  }

  get yenString(): string {
    const isMinus = (this.player.status.kiloYens < 0);
    const absKYens = Math.abs(this.player.status.kiloYens);
    const cho = Math.floor(absKYens / 1_000_000_000);
    const oku = Math.floor((absKYens / 100_000) % 10_000);
    const man = (absKYens / 10) % 10_000;
    return `${isMinus ? '-' : ''}${cho ? cho + '兆' : ''}${oku ? oku + '億' : ''}${man ? `${man}万` : ''}円`;
  }

  get defaultIconImageUri(): string {
    return DefaultIconImage;
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
