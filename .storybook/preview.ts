import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date:  /Date$/i,
      },
    },
    backgrounds: {
      default: 'page',
      values: [
        { name: 'page',  value: '#f0ede8' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark',  value: '#1a1a1a' },
      ],
    },
  },
}

export default preview
