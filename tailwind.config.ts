import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        qfc: {
          cyan: '#22d3ee',
          blue: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}

export default config
