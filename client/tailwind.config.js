/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Ocean palette
				ocean: {
					'50': '#006466',
					'100': '#065a60',
					'200': '#0b525b',
					'300': '#144552',
					'400': '#1b3a4b',
					'500': '#212f45',
					'600': '#272640',
					'700': '#312244',
					'800': '#3e1f47',
					'900': '#4d194d',
				},
				// New color palettes
				platinum: {
					DEFAULT: '#d8e2dc',
					'100': '#26332b',
					'200': '#4b6656',
					'300': '#739781',
					'400': '#a6bdaf',
					'500': '#d8e2dc',
					'600': '#e1e8e4',
					'700': '#e8eeeb',
					'800': '#f0f4f1',
					'900': '#f7f9f8'
				},
				champagne: {
					DEFAULT: '#ffe5d9',
					'100': '#5f1e00',
					'200': '#be3c00',
					'300': '#ff651e',
					'400': '#ffa67c',
					'500': '#ffe5d9',
					'600': '#ffebe2',
					'700': '#fff0ea',
					'800': '#fff5f1',
					'900': '#fffaf8'
				},
				pink: {
					DEFAULT: '#ffcad4',
					'100': '#5c0011',
					'200': '#b80022',
					'300': '#ff143f',
					'400': '#ff708a',
					'500': '#ffcad4',
					'600': '#ffd6de',
					'700': '#ffe0e6',
					'800': '#ffebee',
					'900': '#fff5f7'
				},
				cherry: {
					DEFAULT: '#f4acb7',
					'100': '#4a0a13',
					'200': '#941327',
					'300': '#de1d3a',
					'400': '#eb6478',
					'500': '#f4acb7',
					'600': '#f7bec6',
					'700': '#f9ced5',
					'800': '#fbdfe3',
					'900': '#fdeff1'
				},
				mountbatten: {
					DEFAULT: '#9d8189',
					'100': '#20191b',
					'200': '#413236',
					'300': '#614b51',
					'400': '#81636c',
					'500': '#9d8189',
					'600': '#b19aa0',
					'700': '#c4b3b8',
					'800': '#d8ccd0',
					'900': '#ebe6e7'
				}
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					from: { transform: 'translateX(100%)' },
					to: { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out'
			},
			perspective: {
				'1000': '1000px',
				'2000': '2000px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
}


