import { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './**/*.{html,js,vue,ts,md}',
    './.vitepress/**/*.{html,js,vue,ts,md}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

