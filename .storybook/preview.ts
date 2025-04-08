import type { Preview } from '@storybook/react'
import '../src/styles/tailwind.css'; // make sure this path is correct

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;