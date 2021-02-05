<template>
  <v-snackbar
    v-model="active"
    :color="error ? 'warning' : 'primary'"
  >
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { messageModule } from '../../plugin/message';

@Component
export default class MessageAlert extends Vue {

  get message(): string {
    return messageModule.alertMessage;
  }

  get active(): boolean {
    return messageModule.isActive;
  }

  get error(): boolean {
    return messageModule.isError;
  }
}
</script>
