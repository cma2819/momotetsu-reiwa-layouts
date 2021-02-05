<template>
  <v-container>
    <v-row dense>
      <v-col
        v-for="(player, index) in players"
        :key="player.id"
        cols="12"
        :style="{
          fontSize: '26px'
        }"
      >
        <side-info-player-item
          :player="player"
          :index="index"
          :poor="poor"
        ></side-info-player-item>
      </v-col>
    </v-row>
    <v-row
      class="mr-1"
      dense
      :style="{
        fontSize: '22px'
      }"
    >
      <v-col class="text-right">
        {{ settleYear }}年目開始時点
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Player, Poor } from '../../../nodecg/generated';

import SideInfoPlayerItem from './SideInfoPlayerItemComponent.vue';

@Component({
  components: {
    SideInfoPlayerItem,
  }
})
export default class SideInfoPlayerList extends Vue {

  @Prop(Array)
  readonly players!: Player[];

  @Prop(Object)
  readonly poor!: Poor;

  @Prop(Number)
  readonly settleYear!: number;

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
