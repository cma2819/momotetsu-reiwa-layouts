<template>
  <v-sheet :color="theme">
    <v-container>
      <v-row dense>
        <v-col
          class="font-weight-bold"
          cols="auto"
        >
          {{ place }}
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
        <v-col
          class="ml-2"
          :style="{
            fontSize: '1.5em'
          }"
        >
          {{ player.name }}
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="text-right">
          {{ millionString }}
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Player, Poor } from '../../../nodecg/generated';

@Component
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

  get millionString(): string {
    const isMinus = (this.player.status.millions < 0);
    const absMillions = Math.abs(this.player.status.millions);
    const cho = Math.floor(absMillions / 100000);
    const oku = Math.floor((absMillions / 100) % 10000);
    const million = absMillions % 100;
    return `${isMinus ? '-' : ''}${cho ? cho + '兆' : ''}${oku ? oku + '億' : ''}${million}00万円`;
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
