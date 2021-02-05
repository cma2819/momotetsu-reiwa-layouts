<template>
  <canvas
    :style="{
      position: 'absolute',
      top: 0,
      left: 0
    }"
    width="1920"
    height="1080"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ClipPath } from './types';

@Component
export default class ClippedCanvas extends Vue {
  @Prop(Array)
  readonly clipPaths!: ClipPath[];

  @Prop(String)
  readonly backgroundImage!: string;

  ctx?: CanvasRenderingContext2D;
  mounted(): void {
    const element = this.$el as HTMLCanvasElement;
    const ctx = element.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
    }
    const background = new Image();
    background.src = this.backgroundImage;
    background.addEventListener('load', () => {
      this.draw(background);
    })
  }

  draw(bg: HTMLImageElement): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.drawImage(bg, 0, 0);
    this.ctx.globalCompositeOperation = 'xor';
    this.clipPaths?.forEach((clipPath) => {
      this.ctx?.fillRect(
        clipPath.x,
        clipPath.y,
        clipPath.width,
        clipPath.height
      );
    });
  }
}
</script>
