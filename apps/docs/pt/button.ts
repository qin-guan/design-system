import type { ButtonPassThroughOptions } from 'primevue/button'
import { cva } from 'cva'

type ColorScheme = | 'main' | 'success' | 'warning' | 'critical' | 'neutral' | 'inverse' | 'sub'

/**
 * Shoudl whitelist for color flexibility in theme ie. new color in theme but it's not here so can pass using colorScheme
 */

/**
 * Ref: https://github.com/opengovsg/design-system/blob/f9a9d23e94d4193d180ef514f1632ed2082ad3b8/react/src/theme/components/Button.ts
 *
 * For reduced complexity, only colors with stories are implemented currently
 *
 * OGP -> PrimeVue
 * Default -> No severity
 * Critical -> Danger
 * Success -> Success
 * Neutral -> Info
 * Inverse -> ???
 * Secondary -> Secondary
 * Warning -> Help
 */
const button = cva({
  base: [
    // Transitions
    'transition-common',
    // Default Chakra button styles
    'inline-flex appearance-none items-center justify-center select-none relative align-middle line-height-[1.5rem] ',
    // Text styles
    'font-sans typography-subhead-1 whitespace-prewrap',
    // Border
    'rounded-DEFAULT border border-[1px] border-solid px-[15px] py-[9px]',
    // Disabled
    'disabled:bg-interaction-support-disabled disabled:border-interaction-support-disabled disabled:opacity-10 disabled:text-interaction-support-disabled-content',
    // Focus visible styles
    'focus-visible:shadow-none! focus-visible:outline-offset-[0.125rem] focus-visible:outline-[2px] focus-visible:outline-solid outline-offset-[0.125rem] outline-[2px] outline-solid outline-transparent',
  ],
  defaultVariants: {
    severity: 'main',
    outlined: false,
  },
  variants: {
    severity: {
      main: 'focus-visible:outline-interaction-main',
      success: 'focus-visible:outline-green-800',
      warning: 'focus-visible:outline-interaction-warning-active',
      critical: 'focus-visible:outline-interaction-critical-active',
      neutral: 'focus-visible:outline-blue-800',
      inverse: 'focus-visible:outline-white',
      secondary: 'focus-visible:outline-brand-secondary-800',
    } satisfies Record<ColorScheme, string>,
    outlined: {
      true: 'text-base-content-inverse border',
      false: 'text-base-content-inverse',
    },
    size: {
      small: 'h-8 typography-subhead-1 min-h-[2.5rem] min-w-[2.5rem]',
      default: 'typography-subhead-1 min-h-[2.75rem] min-w-[2.75rem]',
      large: 'typography-subhead-1 min-h-[3rem] min-w-[3rem]',
    },
  },
  compoundVariants: [
    {
      severity: 'default',
      outlined: false,
      class: [
        'bg-interaction-main active:bg-interaction-main-active hover:interaction-main-hover',
        'border-interaction-main active:border-interaction-main-active hover:border-interaction-main-hover',
      ],
    },
    {
      severity: 'default',
      outlined: true,
      class: [
        'border-interaction-main active:bg-interaction-tinted-main-active hover:bg-interaction-tinted-main-hover',
        'text-interaction-main',
      ],
    },
    {
      severity: 'danger',
      outlined: false,
      class: [
        'bg-interaction-critical active:bg-interaction-critical-active hover:bg-interaction-critical-hover',
        'border-interaction-critical active:border-interaction-critical-active hover:border-interaction-critical-hover',
      ],
    },
    { severity: 'danger', outlined: true, class: '' },
    { severity: 'success', outlined: false, class: '' },
    { severity: 'success', outlined: true, class: '' },
    { severity: 'info', outlined: false, class: '' },
    { severity: 'info', outlined: true, class: '' },
    { severity: 'inverse', outlined: false, class: '' },
    { severity: 'inverse', outlined: true, class: '' },
    { severity: 'secondary', outlined: false, class: '' },
    { severity: 'secondary', outlined: true, class: '' },
    { severity: 'help', outlined: false, class: '' },
    { severity: 'help', outlined: true, class: '' },
  ],
})

declare module 'primevue/button' {
  export interface ButtonProps {
    /**
     * @deprecated Use `colorScheme` prop instead
     */
    severity?: string
    colorScheme?: 'main' | 'success' | 'critical' | 'inverse' | 'sub'
  }
}

const options: ButtonPassThroughOptions = {
  root({ props }) {
    return {
      class: button({
        outlined: props.outlined,
        size: props.size ?? 'default',
        severity: props.severity ?? 'default',
      }),
    }
  },
}

export default options
