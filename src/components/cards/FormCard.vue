<template>
  <card class="form-card">
    <div class="container">
      <div class="title">{{ title }}</div>
      <!-- manually handle submitting, so we can emit an 'submit' event -->
      <form @submit="onSubmit" :name="name">
        <slot />
      </form>
    </div>
  </card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue';

const { name, title } = defineProps<{ name: string; title?: string }>()

async function onSubmit(event: Event): Promise<void> {
  event.preventDefault();
  const dataToSubmit = [];
  for (const element of (event.target as HTMLFormElement).elements) {
    if ((element as HTMLInputElement).name !== '' && (element as HTMLInputElement).value !== '') {
      dataToSubmit.push({ name: (element as HTMLInputElement).name, value: (element as HTMLInputElement).value });
    }
  }

  // Change to localhost to test forms locally
  await fetch('https://email-backend.stevenson-space.workers.dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataToSubmit),
  }).catch((error) => {
    console.error('Error:', error);
  });

  alert("Submitted successfully! We'll follow up soon.");
}
</script>

<style lang="sass" scoped>

.form-card
  // span the full width of the grid
  grid-column: 1/-1

.container
  text-align: center
  width: 100%

  .title
    background-color: var(--accent)
    color: var(--background)
    font-size: 1.1em
    font-weight: bold
    line-height: 45px

  form
    display: flex
    flex-flow: column nowrap
    justify-content: center
    align-items: center
    width: 100%

</style>
