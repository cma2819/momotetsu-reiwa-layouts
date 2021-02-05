<template>
  <div>
    <v-card>
      <v-card-text>
        <v-row align="end">
          <v-col cols="auto">
            目的地
          </v-col>
          <v-col>
            <v-text-field
              v-model="goal.name"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-switch
              v-model="goal.isCardShop"
              label="カード売り場？"
              hide-details
            ></v-switch>
          </v-col>
          <v-col>
            <v-btn
              color="primary"
              :disabled="!validateGoal"
              @click="submitGoal"
            >
              目的地設定
            </v-btn>
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="auto">
            進捗
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click="prev"
            >
              <v-icon>fas fa-caret-left</v-icon>
              前月
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              size="3"
              class="text-center"
              suffix="年目"
              :value="yearString"
              hide-details
              readonly
            >
            </v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-text-field
              size="3"
              class="text-center"
              suffix="月"
              :value="monthString"
              hide-details
              readonly
            >
            </v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click="next"
            >
              翌月
              <v-icon>fas fa-caret-right</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="warning"
              @click="reset"
            >
              進捗をリセット
            </v-btn>
          </v-col>
        </v-row>
        <v-row align="end">
          <v-col cols="auto">
            貧乏神
          </v-col>
          <v-col>
            <v-select
              v-model="poor"
              :items="poorItems"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click="changePoor"
            >
              貧乏神変更
            </v-btn>
          </v-col>
          <v-col></v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component, Emit } from 'vue-property-decorator';
import { Goal, PoorType } from '../../../../nodecg/generated';

@Component
export default class ProgressHeadComponent extends Vue {
  year = 0;
  month = 0;

  goal: Goal = {
    name: '',
    isCardShop: false,
  };
  poor: PoorType|null = null;

  created(): void {
    nodecg.Replicant('game').on('change', (newVal) => {
      this.year = newVal.status.year;
      this.month = newVal.status.month;
      this.goal = Object.assign(
        {},
        this.goal,
        newVal.status.goal
      );
      this.poor = newVal.status.poor?.type || null;
    });
  }

  get yearString(): string {
    return (this.year + 1).toString();
  }

  get monthString(): string {
    return (((this.month + 3) % 12) + 1).toString();
  }

  get poorItems(): {
    text: string;
    value: PoorType|null;
  }[] {
    return [
      { text: '-', value: null },
      { text: '貧乏神', value: 'normal'},
      { text: 'ミニボンビー', value: 'mini'},
      { text: 'ポコン', value: 'hurricane'},
      { text: 'ビッグボンビー', value: 'big'},
      { text: 'キングボンビー', value: 'king'},
      { text: 'デストロイ号', value: 'destroy'},
    ];
  }

  get validateGoal(): boolean {
    return !!(this.goal.name);
  }

  @Emit()
  next(): void {
    nodecg.sendMessage('game:next-month');
  }

  @Emit()
  prev(): void {
    nodecg.sendMessage('game:prev-month');
  }

  @Emit()
  reset(): void {
    nodecg.sendMessage('game:reset');
  }

  @Emit()
  changePoor(): void {
    if (this.poor) {
      nodecg.sendMessage('game:change-poor', this.poor);
    } else {
      nodecg.sendMessage('game:leave-poor');
    }
  }

  @Emit()
  submitGoal(): void {
    if (!this.validateGoal) {
      return;
    }

    nodecg.sendMessage('game:set-goal', this.goal);
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
