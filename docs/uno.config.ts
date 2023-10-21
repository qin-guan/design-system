import { defineConfig } from 'unocss'
import * as theme from './theme'

const safeListComponents = {
  button: (colorsAsRegex) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex}})-400`)
  }]
}

export default defineConfig({
  content: {
    pipeline: {
      include: [
        './pt/**/*.ts'
      ]
    }
  },
  theme,
})
