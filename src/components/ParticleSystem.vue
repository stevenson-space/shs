<template>
  <div
    ref="wrap"
    class="particle-wrap"
    :class="{ 'events-all': interaction }"
  >
    <img
      v-for="(img, index) in images"
      :key="index"
      :src="img"
      class="particle_image"
      style="display:none"
      @load="onImageLoad"
    />
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, useTemplateRef } from 'vue';

const { speed = 1, interaction = false, size = 7, count = 20, opacity = 1, color = '#ffffff', windPower = 0, images } = defineProps<{
  speed?: number;
  interaction?: boolean;
  size?: number;
  count?: number;
  opacity?: number;
  color?: string;
  windPower?: number;
  images: string[];
}>();

let particles: any[] = [];
let imageItems: any[] = [];
const particleCount = ref(0);

let canvasNode: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let imageNum = 0;
let imagesLoaded = 0;
let reqId: number | null = null;

const canvasEl = useTemplateRef<HTMLCanvasElement>('canvas');
const wrap = useTemplateRef<HTMLDivElement>('wrap');

watch(() => count, () => {
  particleCount.value = count;
  init();
});

watch(() => speed, () => {
  init();
});

watch(() => images, () => {
  imagesLoaded = 0;
  init();
  nextTick(() => {
    collectImages();
  });
});

onMounted(() => {
  particleCount.value = count;
  init();
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(reqId!);
  window.removeEventListener('resize', resize);
});

function resize(): void {
  setCanvasSize();
}

function setCanvasSize(): void {
  const dpr = window.devicePixelRatio || 1;
  canvasNode!.width = window.innerWidth * dpr;
  canvasNode!.height = window.innerHeight * dpr;
  ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function onImageLoad(): void {
  imagesLoaded++;
  collectImages();
}

function collectImages(): void {
  imageItems = Array.from(
    wrap.value?.querySelectorAll('.particle_image') ?? [],
  );
  imageNum = imageItems.length;
}

function init(): void {
  cancelAnimationFrame(reqId!);

  canvasNode = canvasEl.value!;
  ctx = canvasNode.getContext('2d')!;
  setCanvasSize();

  particles = [];

  for (let i = 0; i < particleCount.value; i++) {
    reset(
      {
        x: Math.random() * canvasNode.width,
        y: Math.random() * canvasNode.height,
      },
      true,
    );
  }

  animate();
  nextTick(() => {
    collectImages();
  });
}

function reset(particle: any, first = false): void {
  if (!first) {
    particle.x = windPower >= 0
      ? Math.random() * canvasNode!.width * 0.8
      : Math.random() * canvasNode!.width * 1.2;
    particle.y = -30;
  }

  particle.size = Math.random() * 3 + size;

  const baseSpeed = Math.max(0, speed);
  particle.speed = Math.random() * 0.1 + baseSpeed * 0.3;
  particle.velY = particle.speed;

  // base horizontal drift + wind bias
  const speedInfluence = baseSpeed * 0.2;
  particle.baseVelX = (Math.random() - 0.5) * (0.4 + speedInfluence);
  particle.velX = particle.baseVelX;

  // wobble params
  particle.wobble = Math.random() * Math.PI * 2;
  particle.wobbleSpeed = Math.random() * 0.02 + 0.01;
  particle.wobbleStrength = Math.random() * 0.4 + 0.2;

  particle.opacity = Math.min(
    1,
    Math.random() * 0.5 + opacity,
  );

  if (first) particles.push(particle);
}

function animate(): void {
  ctx!.clearRect(0, 0, canvasNode!.width, canvasNode!.height);

  // normalize wind so small values still feel directional
  const wind = windPower * 0.10;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.wobble += p.wobbleSpeed;

    // wind-influenced horizontal movement
    const windPush = wind * (1 + p.size / 10);

    // wobble reduced slightly when wind is strong
    const wobbleX = Math.sin(p.wobble)
      * p.wobbleStrength
      * (1 - Math.min(Math.abs(wind), 1));

    p.x += p.velX + windPush + wobbleX;

    // tilt the fall slightly in wind direction
    p.y += p.velY + Math.abs(wind) * 0.1;

    if (
      p.y > canvasNode!.height + 60
      || p.x < -60
      || p.x > canvasNode!.width + 60
    ) {
      reset(p);
    }

    if (imageNum > 0) {
      const img = imageItems[i % imageNum];
      if (img?.naturalWidth) {
        const w = p.size * 2;
        const h = w * (img.naturalHeight / img.naturalWidth);
        ctx!.globalAlpha = p.opacity;
        ctx!.drawImage(img, p.x, p.y, w, h);
        ctx!.globalAlpha = 1;
      }
    } else {
      ctx!.fillStyle = color;
      ctx!.globalAlpha = p.opacity;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.globalAlpha = 1;
    }
  }

  reqId = requestAnimationFrame(animate);
}
</script>

<style lang="scss" scoped>
.particle-wrap {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }

  &.events-all canvas {
    pointer-events: auto;
  }

}
</style>
