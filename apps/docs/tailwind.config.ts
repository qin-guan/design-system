import type { Config } from 'tailwindcss'
import * as theme from '~/theme/theme'

// const safelist = {
//   button(colorsAsRegex: string) {
//     return [
//       {
//         pattern: new RegExp(`bg-${colorsAsRegex}-main`),
//         variant: '',
//       },
//     ]
//   },
// }

export default <Partial<Config>>{
  theme: {
    extend: {
      ...theme,
    },
  },
}
