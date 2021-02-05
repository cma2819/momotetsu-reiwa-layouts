<template>
  <div>
    <v-row dense>
      <v-col
        cols="auto"
      >
        <v-text-field
          v-model.number="years"
          label="プレイ年数"
          suffix="年"
          type="number"
          min="1"
          max="100"
          :disabled="isDuel"
        >
        </v-text-field>
      </v-col>
      <v-col
        cols="auto"
      >
        <v-switch
          v-model="isDuel"
          label="3年決戦！"
        ></v-switch>
      </v-col>
      <v-col>
        <v-radio-group
          v-model="players"
          row
        >
          <v-radio
            label="3人"
            :value="3"
          >
          </v-radio>
          <v-radio
            label="4人"
            :value="4"
          >
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row
      dense
      justify="end"
    >
      <v-btn
        block
        :disabled="!canSubmitSetting"
        @click="submitSetting"
      >
        ゲーム設定を反映
      </v-btn>
    </v-row>
  </div>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component, Watch, Emit } from 'vue-property-decorator';

@Component
export default class SettingView extends Vue {

  isDuel = false;
  years = 1;
  players = 3;

  created(): void {
    nodecg.Replicant('game').on('change', (newVal) => {
      this.isDuel = newVal.rule.isDuel;
      this.years = newVal.rule.years;
      this.players = newVal.rule.players;
    });
  }

  get canSubmitSetting(): boolean {

    if (this.years < 1 || this.years > 100) {
      return false;
    }

    if (this.players !== 3 && this.players !== 4) {
      return false;
    }

    return true;
  }

  @Emit()
  submitSetting(): void {

    if (!this.canSubmitSetting) {
      return;
    }

    nodecg.sendMessage('game:edit-rule', {
      years: this.years,
      isDuel: this.isDuel,
      players: this.players
    });
  }

  @Watch('isDuel')
  onChangeIsDuel(val: boolean): void {
    if (val) {
      this.years = 3;
    }
  }
}
</script>
