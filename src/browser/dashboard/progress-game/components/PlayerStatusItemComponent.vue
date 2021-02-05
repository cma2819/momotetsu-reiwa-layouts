<template>
  <div>
    <v-card
      class="my-2"
    >
      <v-card-text>
        <v-row align="center">
          <v-col cols="auto">
            {{ place }}
            <v-icon :color="theme">
              fas fa-caret-right
            </v-icon>
          </v-col>
          <v-col>
            {{ player.name }}
          </v-col>
          <v-col>
            <v-checkbox
              label="貧"
              color="indigo"
              hide-details
              :disabled="!poor"
              :input-value="poorWith"
              @click="changePoor"
            ></v-checkbox>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              v-model.number="player.status.millions"
              dense
              outlined
              type="number"
              max="99999999"
              min="-99999999"
              size="12"
              label="総資産"
              suffix="百万円"
              hide-details
              :rules="[settleValidation]"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Player, Poor } from '../../../../nodecg/generated';

@Component
export default class PlayerStatusListComponent extends Vue {

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

  settleValidation(v: string): boolean {

    return v !== ''
      && (parseInt(v) < 100000000)
      && (parseInt(v) > -100000000)
      && (parseFloat(v) % 1 === 0);
  }

  @Emit()
  changePoor(): void {
    nodecg.sendMessage('game:poor-to', this.index);
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
