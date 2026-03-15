<template>
  <div class="base-card">
    <div v-if="label || showFlag || showMenu" class="eyebrow">
      <span class="eyebrow-label">{{ label }}</span>
      <div class="eyebrow-right">
        <button v-if="showFlag" type="button" class="icon-btn" aria-label="Flag" @click="emit('flag')">
          <Flag :size="12" :stroke-width="2.2" />
        </button>
        <button v-if="showMenu" type="button" class="icon-btn" aria-label="More options" @click="emit('menu')">
          <Ellipsis :size="14" :stroke-width="2" />
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Flag, Ellipsis } from 'lucide-vue-next'

const {
  label,
  showMenu = false,
  showFlag = false,
} = defineProps<{
  label?: string
  showMenu?: boolean
  showFlag?: boolean
}>()

const emit = defineEmits<{
  flag: []
  menu: []
}>()
</script>

<style scoped>
@reference "tailwindcss";

.base-card {
  @apply relative overflow-hidden rounded-[14px] border-[0.5px] border-white/90 bg-background p-3;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06);
}

.eyebrow {
  @apply mb-[7px] flex items-center justify-between;
}

.eyebrow-label {
  @apply text-[9px] font-semibold uppercase leading-none tracking-[0.06em] text-black/[0.38];
}

.eyebrow-right {
  @apply flex items-center gap-0.5;
}

.icon-btn {
  @apply flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-black/[0.38] transition-[background,color] duration-150 hover:bg-black/[0.06] hover:text-black/60 active:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current;
  -webkit-tap-highlight-color: transparent;
}
</style>
