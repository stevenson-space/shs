import type { Preview } from "@storybook/vue3-vite";
import "../src/styles/tailwind.css";
import { setup } from "@storybook/vue3";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";

setup((app) => {
  app.component("font-awesome-icon", FontAwesomeIcon);
  app.use(createPinia());
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: { template: "<div/>" } }],
  });
  app.use(router);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
