<template>
  <v-card class="pa-2">
    <v-card-subtitle v-if="id">
      ID: {{ id }}
    </v-card-subtitle>
    <v-card-actions>
      <v-text-field
        v-model="name"
        label="プレイヤー名"
        outlined
        hide-details
      ></v-text-field>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        color="#7289DA"
        :disabled="discordAuthorized"
      >
        Discord連携
      </v-btn>
      <v-btn @click="submitEdit">
        {{ id ? 'プレイヤー情報を変更' : 'プレイヤー情報を追加' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Player } from '../../../../nodecg/generated';
import { messageModule } from '../../../plugin/message';

@Component
export default class PlayerViewItemEditComponent extends Vue {

  @Prop(Object)
  readonly player?: Player;

  id = '';
  name = '';

  created(): void {
    if (this.player) {
      this.id = this.player.id;
      this.name = this.player.name;
    }
  }

  get discordAuthorized(): boolean {
    return (!!this.player?.discord);
  }

  @Emit()
  submitEdit(): void {
    if (!this.id) {
      nodecg.sendMessage('player:add-player', this.name)
        .then(() => {
          this.closeDialog();
        })
        .catch((message) => {
          messageModule.activate({
            message,
            error: true
          });
        })
    } else {
      nodecg.sendMessage('player:edit-player', Object.assign(
        {},
        this.player,
        { name: this.name }
      ))
        .then(() => {
          this.closeDialog();
        })
        .catch((message) => {
          messageModule.activate({
            message,
            error: true
          });
        });
    }
  }

  closeDialog(): void {
    this.$emit('input', false);
  }
}
</script>
