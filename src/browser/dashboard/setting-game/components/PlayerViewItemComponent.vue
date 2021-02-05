<template>
  <v-card
    class="my-2"
    :color="playerColor"
  >
    <v-card-title>
      {{ player.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ player.id }}
    </v-card-subtitle>
    <v-card-actions>
      <v-row align="center">
        <v-col cols="auto">
          <v-dialog
            v-model="dialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                class="ma-2"
                fab
                outlined
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small>
                  fas fa-edit
                </v-icon>
              </v-btn>
            </template>
            <player-view-item-edit
              v-model="dialog"
              :player="player"
            ></player-view-item-edit>
          </v-dialog>
          <v-btn
            icon
            class="ma-2"
            fab
            outlined
            small
          >
            <v-icon
              small
              @click="deletePlayer"
            >
              fas fa-times
            </v-icon>
          </v-btn>
        </v-col>
        <v-col
          v-if="player.discord"
          cols="auto"
        >
          <player-view-discord :player="player"></player-view-discord>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
/* global nodecg */
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Player } from '../../../../nodecg/generated';

import PlayerViewItemEdit from './PlayerViewItemEditComponent.vue';
import PlayerViewDiscord from './PlayerViewDiscordComponent.vue'

@Component({
  components: {
    PlayerViewItemEdit,
    PlayerViewDiscord,
  }
})
export default class PlayerViewItemComponent extends Vue {

  dialog = false;

  @Prop(Object)
  readonly player!: Player;

  @Prop(Number)
  readonly index!: number;

  get playerColor(): string {
    const themes = ['first', 'second', 'third', 'fourth'];

    return themes[this.index];
  }

  @Emit()
  deletePlayer(): void {
    nodecg.sendMessage('player:remove-player', this.player.id);
  }
}
</script>
