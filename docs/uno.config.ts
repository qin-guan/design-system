import { defineConfig } from 'unocss'
import * as theme from './theme'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        './pt/**/*.ts',
      ],
    },
  },
  theme,
})
