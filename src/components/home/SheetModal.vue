<template>
  <!-- moved to <body> so a widget can open it without inheriting the widget's scaling or wiggle -->
  <Teleport to="body">
  <div class="sheet-backdrop home-surface" @click.self="emit('close')">
    <div
      ref="panel"
      class="sheet"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      tabindex="-1"
      @keydown.esc.stop="emit('close')"
    >
      <header class="sheet-head">
        <h2 class="sheet-title">{{ title }}</h2>
        <button class="sheet-close" type="button" aria-label="Close" @click="emit('close')">
          <X :size="18" :stroke-width="2.4" aria-hidden="true" />
        </button>
      </header>
      <div class="sheet-body">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="sheet-foot">
        <slot name="footer" />
      </footer>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import { X } from 'lucide-vue-next';

defineProps<{ title: string }>();
const emit = defineEmits<{ close: [] }>();

const panel = useTemplateRef<HTMLDivElement>('panel');
let previousFocus: HTMLElement | null = null;
let previousOverflow = '';

onMounted(() => {
  // remember what was focused, lock the page behind the sheet, and move focus into it
  previousFocus = document.activeElement as HTMLElement | null;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  panel.value?.focus();
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow;
  previousFocus?.focus?.();
});
</script>

<style scoped>
.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.45);
  animation: sheet-fade 0.18s ease;
}

.sheet {
  box-sizing: border-box;
  width: 100%;
  max-width: 560px;
  max-height: min(680px, calc(100vh - 32px));
  max-height: min(680px, calc(100dvh - 32px));
  display: flex;
  flex-direction: column;
  background: var(--secondaryBackground);
  color: var(--primary);
  border: 1px solid var(--w-line);
  border-radius: 24px;
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.6);
  outline: none;
  animation: sheet-rise 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sheet-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 14px 10px 20px;
}

.sheet-title {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
}

.sheet-close {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--w-soft);
  color: var(--primary);
  cursor: pointer;
}

.sheet-close:hover {
  background: var(--w-line);
}

.sheet-close:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.sheet-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 20px 18px;
  -webkit-overflow-scrolling: touch;
}

.sheet-foot {
  flex: none;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--w-line);
}

@keyframes sheet-fade {
  from { opacity: 0; }
}

@keyframes sheet-rise {
  from { opacity: 0; transform: translateY(18px) scale(0.98); }
}

/* on phones the sheet slides up from the bottom edge */
@media (max-width: 599.9px) {
  .sheet-backdrop {
    align-items: flex-end;
    padding: 0;
  }

  .sheet {
    max-width: none;
    max-height: 86vh;
    max-height: 86dvh;
    border-radius: 24px 24px 0 0;
    border-bottom: none;
    padding-bottom: env(safe-area-inset-bottom);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sheet-backdrop,
  .sheet {
    animation: none;
  }
}
</style>
