<template>
  <v-sheet
    class="pa-2"
    color="#7289DA"
    elevation="2"
    rounded
  >
    <v-avatar>
      <img
        :src="player.thumbnail"
        :alt="player.discord.avatar"
      >
    </v-avatar>
    {{ `${player.discord.username}#${player.discord.discriminator}` }}
  </v-sheet>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Player } from '../../../../nodecg/generated';

@Component
export default class PlayerViewDiscord extends Vue {

  @Prop(Object)
  readonly player?: Player;
}

</script>
