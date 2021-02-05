<template>
  <v-card
    class="my-2 pa-2"
    :color="theme"
  >
    <v-card-text>
      <v-row align="center">
        <v-col>
          {{ player.name }}
        </v-col>
        <v-col cols="auto">
          <v-btn
            small
            fab
            @click="attach"
          >
            <v-icon
              v-if="order < 0"
              small
            >
              fas fa-minus
            </v-icon>
            <span v-else>
              {{ order + 1 }}
            </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Player } from '../../../../nodecg/generated';

@Component
export default class PlayerViewOrderItemComponent extends Vue {

  @Prop(Object)
  readonly player!: Player;

  @Prop(Function)
  readonly attachAction!: Function;

  @Prop(Number)
  readonly order!: number;

  closeDialog(): void {
    this.$emit('input', false);
  }

  get theme(): string {
    const themes = ['first', 'second', 'third', 'fourth'];

    if (this.order < 0) {
      return 'secondary';
    }

    return themes[this.order];
  }

  @Emit()
  attach(): void {
    this.attachAction(this.player.id);
  }
}
</script>
