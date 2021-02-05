<template>
  <v-container>
    <v-row
      dense
      align="start"
    >
      <v-col cols="auto">
        {{ statusYearString }}年目
      </v-col>
      <v-col
        :style="{
          fontSize: '2em',
        }"
        class="text-center font-weight-bold"
      >
        {{ statusMonthString }}月
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <div
          class="text-right px-2"
          :style="{
            borderTop: '2px solid white'
          }"
        >
          {{ ruleYear }}年<span v-if="isDuel">決戦！</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SideInfoYm extends Vue {

  @Prop(Number)
  readonly ruleYear!: number;
  @Prop(Boolean)
  readonly isDuel!: boolean;
  @Prop(Number)
  readonly statusYear!: number;
  @Prop(Number)
  readonly statusMonth!: number;

  get statusYearString(): string {
    return '' + (this.statusYear + 1);
  }

  get statusMonthString(): string {
    return '' + (((this.statusMonth + 3) % 12) + 1);
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
