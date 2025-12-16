<template>
  <div
    ref="wrap"
    class="particle-wrap"
    :class="{ 'events-all': interaction, hide: toHide }"
  >
    <img
      v-for="(img, index) in images"
      :key="index"
      :src="img"
      class="particle_image"
      style="display:none"
      @load="onImageLoad"
    />
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: "ParticleSystem",

  props: {
    speed: { type: Number, default: 1 },
    interaction: { type: Boolean, default: false },
    size: { type: Number, default: 7 },
    count: { type: Number, default: 20 },
    opacity: { type: Number, default: 1 },
    color: { type: String, default: "#ffffff" },

    windPower: { type: Number, default: 0 },

    images: { type: Array, required: true },
  },

  data() {
    return {
      particles: [],
      canvas: null,
      ctx: null,
      particleCount: 0,
      imageItems: [],
      imageNum: 0,
      imagesLoaded: 0,
      reqId: null,
      mX: -100,
      mY: -100,
      toHide: false,
    };
  },

  mounted() {
    this.particleCount = this.count;
    this.init();
    window.addEventListener("resize", this.resize);
  },

  beforeUnmount() {
    cancelAnimationFrame(this.reqId);
    window.removeEventListener("resize", this.resize);
  },

  watch: {
    count() {
      this.particleCount = this.count;
      this.init();
    },
    images() {
      this.imagesLoaded = 0;
      this.init();
    },
  },

  methods: {
    resize() {
      this.setCanvasSize();
    },

    setCanvasSize() {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    onImageLoad() {
      this.imagesLoaded++;
      if (this.imagesLoaded === this.images.length) {
        this.collectImages();
      }
    },

    collectImages() {
      this.imageItems = Array.from(
        this.$el.querySelectorAll(".particle_image")
      );
      this.imageNum = this.imageItems.length;
    },

    init() {
      cancelAnimationFrame(this.reqId);

      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.setCanvasSize();

      this.particles = [];

      for (let i = 0; i < this.particleCount; i++) {
        this.reset(
          {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
          },
          true
        );
      }

      this.animate();
    },

    reset(particle, first = false) {
      if (!first) {
        particle.x =
          this.windPower >= 0
            ? Math.random() * this.canvas.width * 0.8
            : Math.random() * this.canvas.width * 1.2;
        particle.y = -30;
      }

      particle.size = Math.random() * 3 + this.size;

      particle.speed = Math.random() * 0.1 + this.speed * 0.3;
      particle.velY = particle.speed;

      // base horizontal drift + wind bias
      particle.baseVelX = (Math.random() - 0.5) * 0.4;
      particle.velX = particle.baseVelX;

      // wobble params
      particle.wobble = Math.random() * Math.PI * 2;
      particle.wobbleSpeed = Math.random() * 0.02 + 0.01;
      particle.wobbleStrength = Math.random() * 0.4 + 0.2;

      particle.opacity = Math.min(
        1,
        Math.random() * 0.5 + this.opacity
      );

      if (first) this.particles.push(particle);
    },

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // normalize wind so small values still feel directional
      const wind = this.windPower * 0.10;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.wobble += p.wobbleSpeed;

        // wind-influenced horizontal movement
        const windPush = wind * (1 + p.size / 10);

        // wobble reduced slightly when wind is strong
        const wobbleX =
          Math.sin(p.wobble) *
          p.wobbleStrength *
          (1 - Math.min(Math.abs(wind), 1));

        p.x += p.velX + windPush + wobbleX;

        // tilt the fall slightly in wind direction
        p.y += p.velY + Math.abs(wind) * 0.1;

        if (
          p.y > this.canvas.height + 60 ||
          p.x < -60 ||
          p.x > this.canvas.width + 60
        ) {
          this.reset(p);
        }

        if (this.imageNum > 0) {
          const img = this.imageItems[i % this.imageNum];
          if (img?.naturalWidth) {
            const w = p.size * 2;
            const h = w * (img.naturalHeight / img.naturalWidth);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.drawImage(img, p.x, p.y, w, h);
            this.ctx.globalAlpha = 1;
          }
        } else {
          this.ctx.fillStyle = this.color;
          this.ctx.globalAlpha = p.opacity;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.globalAlpha = 1;
        }
      }

      this.reqId = requestAnimationFrame(this.animate);
    },
  },
};
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

  &.hide {
    opacity: 0;
    transition: opacity 1s;
  }
}
</style>
