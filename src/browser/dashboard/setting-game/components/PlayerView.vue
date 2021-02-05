<template>
  <div>
    <v-row dense>
      <v-col>
        <player-view-item
          v-for="(player, index) in players"
          :key="player.id"
          :player="player"
          :index="index"
        ></player-view-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-dialog
          v-model="editDialog"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              :disabled="!canAddPlayer"
              v-bind="attrs"
              v-on="on"
            >
              プレイヤーを追加
            </v-btn>
          </template>
          <player-view-item-edit
            v-model="editDialog"
          ></player-view-item-edit>
        </v-dialog>
      </v-col>
      <v-col cols="auto">
        <v-dialog
          v-model="orderDialog"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              プレイ順の設定
            </v-btn>
          </template>
          <player-view-order-setting
            v-model="orderDialog"
            :is-visible="orderDialog"
            :players="players"
          ></player-view-order-setting>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component } from 'vue-property-decorator';
import clone from 'clone';
import { Player } from '../../../../nodecg/generated';

import PlayerViewItem from './PlayerViewItemComponent.vue';
import PlayerViewItemEdit from './PlayerViewItemEditComponent.vue';
import PlayerViewOrderSetting from './PlayerViewOrderSettingComponent.vue';

@Component({
  components: {
    PlayerViewItem,
    PlayerViewItemEdit,
    PlayerViewOrderSetting,
  }
})
export default class PlayerView extends Vue {

  editDialog = false;
  orderDialog = false;
  players: Player[] = [];

  rulePlayer = 0;

  created(): void {
    nodecg.Replicant('players').on('change', (newVal) => {
      this.players = clone(newVal);
    });
    nodecg.Replicant('game').on('change', (newVal) => {
      this.rulePlayer = newVal.rule.players;
    });
  }

  get canAddPlayer(): boolean {
    return this.players.length < this.rulePlayer;
  }

}
</script>
