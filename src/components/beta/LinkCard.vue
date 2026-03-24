<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : 'button'"
    :href="href"
    :target="favicon ? '_blank' : undefined"
    :rel="favicon ? 'noopener noreferrer' : undefined"
    class="link-card"
    :class="{ 'is-inverted': inverted }"
    @click="href ? undefined : emit('click')"
  >
    <div class="icon-area">
      <div v-if="favicon" class="favicon" :style="{ backgroundImage: `url(${favicon})` }" role="img" :aria-label="label" />
      <component v-else :is="icon" :size="42" :stroke-width="1.75" />
    </div>
    <span class="label" :class="{ 'is-muted': favicon }">{{ label }}</span>
    <button type="button" class="menu-btn" aria-label="More options" @click.prevent.stop="emit('menu')">
      <Ellipsis :size="14" :stroke-width="2" />
    </button>
  </component>
</template>

<script setup lang="ts">
import { type Component, onMounted } from 'vue'
import { Ellipsis } from 'lucide-vue-next'

const {
  label,
  inverted = false,
  icon,
  favicon,
  href,
} = defineProps<{
  label: string
  inverted?: boolean
  icon?: Component
  favicon?: string
  href?: string
}>()

const emit = defineEmits<{
  click: []
  menu: []
}>()

onMounted(() => {
  if (icon && favicon) {
    console.warn('[LinkCard] Both "icon" and "favicon" were provided. Use one or the other.')
  }
  if (!icon && !favicon) {
    console.warn('[LinkCard] Neither "icon" nor "favicon" was provided. One is required.')
  }
})
</script>

<style scoped>
@reference "@/styles/tailwind.css";

.link-card {
  @apply flex flex-col items-center justify-center overflow-hidden relative cursor-pointer;
  @apply focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current;
  border-radius: 14px;
  padding: 14px 12px 12px;
  gap: 6px;
  text-decoration: none;
  transition: transform 0.1s;
  background: var(--background, #fff);
  border: 0.5px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  color: var(--accent);
}

.link-card.is-inverted {
  background: var(--accent);
  border: none;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.92);
}

.link-card:active:not(:has(.menu-btn:active)) {
  transform: scale(0.95);
}

.icon-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
}

.favicon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background-size: 36px 36px;
  background-position: center;
  background-repeat: no-repeat;
}

.label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.3;
}

.label.is-muted {
  color: rgba(0, 0, 0, 0.5);
}

.menu-btn {
  position: absolute;
  top: 5px;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  color: rgba(0, 0, 0, 0.3);
  transition: background 0.15s, color 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.is-inverted .menu-btn {
  color: rgba(255, 255, 255, 0.5);
}

.menu-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.6);
}

.is-inverted .menu-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
}
</style>
