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
        v-if="!id"
        color="#7289DA"
        :href="discordAuthUri"
        target="_blank"
        :disabled="!discordAuthUri"
        @click="onOpenDiscord"
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

  discordAuthUri: string|null = null;

  created(): void {
    if (this.player) {
      this.id = this.player.id;
      this.name = this.player.name;
    }
    nodecg.sendMessage('discord:auth-uri')
    .then((uri) => {
      this.discordAuthUri = uri;
    })
    .catch((err) => {
      messageModule.activate({ message: err, error: true });
    });
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
  @Emit()
  onOpenDiscord(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.$emit('input', false);
  }
}
</script>
