<template>
  <v-card class="pa-2">
    <v-card-subtitle>
      プレイ順を変更します.
    </v-card-subtitle>
    <v-card-text>
      <player-view-order-item
        v-for="player in players"
        :key="player.id"
        :player="player"
        :attach-action="attachOrder"
        :order="orderOf(player.id)"
      ></player-view-order-item>
    </v-card-text>
    <v-card-actions>
      <v-btn
        block
        color="primary"
        :disabled="!canSubmit"
        @click="submitOrder"
      >
        決定
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { Player } from '../../../../nodecg/generated';
import PlayerViewOrderItem from './PlayerViewOrderItemComponent.vue';

@Component({
  components: {
    PlayerViewOrderItem
  }
})
export default class PlayerViewOrderSettingComponent extends Vue {

  @Prop(Array)
  readonly players!: Player[];

  @Prop(Boolean)
  readonly isVisible!: boolean;

  orders: string[] = [];

  @Watch('isVisible')
  onChangeDialog(val: boolean): void {
    if (val) {
      this.orders = [];
    }
  }

  get canSubmit(): boolean {
    return this.orders.length === this.players.length;
  }

  orderOf(index: string): number {
    return this.orders.indexOf(index);
  }

  attachOrder(id: string): number {

    if (this.orders.indexOf(id) >= 0) {
      this.orders = this.orders.filter(order => order !== id);
    } else {
      this.orders.push(id);
    }

    return this.orders.indexOf(id);
  }

  @Emit()
  submitOrder(): void {
    nodecg.sendMessage('player:reorder-players', this.orders)
      .then(() => {
        this.closeDialog();
      });
  }

  closeDialog(): void {
    this.$emit('input', false);
  }

}
</script>
