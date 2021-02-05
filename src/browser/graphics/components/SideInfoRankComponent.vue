<template>
  <div>
    <v-avatar v-if="rank===1" size="36" tile color="white">
      <div class="px-2">
      <v-icon :color="color">
        fas fa-crown
      </v-icon>
      </div>
    </v-avatar>
    <span>{{ rank }}</span><span>{{ ordinal }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class SideInfoYm extends Vue {

  @Prop(Number)
  readonly rank!: number;

  @Prop(String)
  readonly color!: string;

  get ordinal(): string {
    const ordinals: {[k: number]: string} = {
      1: 'st',
      2: 'nd',
      3: 'rd',
      4: 'th'
    }

    return ordinals[this.rank];
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
