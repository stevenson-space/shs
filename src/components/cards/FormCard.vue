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

const { name, title } = defineProps<{ name: string; title?: string }>();

async function onSubmit(event: Event): Promise<void> {
  event.preventDefault();
  const dataToSubmit: { name: string; value: string }[] = [];
  new FormData(event.currentTarget as HTMLFormElement).forEach((value, name) => {
    if (name !== '') {
      const stringValue = value instanceof File ? value.name : value;
      if (stringValue !== '') dataToSubmit.push({ name, value: stringValue });
    }
  });

  // Change to localhost to test forms locally
  try {
    const response = await fetch('https://email-backend.stevenson-space.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (response.ok) {
      alert("Submitted successfully! We'll follow up soon.");
    } else {
      console.error('Submission failed:', response.status, response.statusText);
      alert('Submission failed. Please try again later.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Submission failed. Please try again later.');
  }
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
