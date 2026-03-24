<template>
  <div class="card-preview">
    <slot />
  </div>
</template>

<style scoped>
@reference "@/styles/tailwind.css";

.card-preview {
  width: 300px;
  background: #f5f5f0;
  padding: 18px 14px 24px;
  border-radius: 14px;
}
</style>
