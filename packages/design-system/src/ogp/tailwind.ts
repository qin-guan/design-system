type DefaultColor = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>

export interface Config {
  theme: {
    extend: {
      colors: {
        blue: DefaultColor,
        orange: DefaultColor,
        base: {
          canvas: Record<'DEFAULT' | 'alt' | 'brand-subtle' | 'backdrop' | 'inverse' | 'overlay', string>
          content: Record<'DEFAULT' | 'light' | 'light2' | 'strong' | 'medium' | 'brand' | 'inverse', string>
          divider: Record<'subtle' | 'medium' | 'strong' | 'inverse' | 'brand', string>
        },
        interaction: {
          main: Record<'DEFAULT' | 'hover' | 'active', string>
          "main-subtle": Record<'DEFAULT' | 'hover' | 'active', string>
          sub: Record<'DEFAULT' | 'hover' | 'active', string>
          "sub-subtle": Record<'DEFAULT' | 'hover' | 'active', string>
          warning: Record<'DEFAULT' | 'hover' | 'active', string>
          "warning-subtle": Record<'DEFAULT' | 'hover' | 'active', string>
          success: Record<'DEFAULT' | 'hover' | 'active', string>
          "success-subtle": Record<'DEFAULT' | 'hover' | 'active', string>
          neutral: Record<'DEFAULT' | 'hover' | 'active', string>
          "neutral-subtle": Record<'DEFAULT' | 'hover' | 'active', string>
          muted: {
            main: Record<'hover' | 'active', string>
            sub: Record<'hover' | 'active', string>
            critical: Record<'hover' | 'active', string>
            neutral: Record<'hover' | 'active', string>
          }
          tinted: {
            main: Record<'hover' | 'active', string>
            sub: Record<'hover' | 'active', string>
            critical: Record<'hover' | 'active', string>
            neutral: Record<'hover' | 'active', string>
            inverse: Record<'hover' | 'active', string>
          }
          support: Record<
            'selected' | 'unselected' | 'unselected-strong' |
            'disabled' | 'disabled-content' | 'placeholder',
            string
          >
          links: Record<
            'DEFAULT' | 'hover' |
            'neutral-default' | 'neutral-hover' |
            'inverse-default' | 'inverse-hover',
            string
          >
        }
        utility: {
          feedback: Record<
            'info' | 'info-subtle' |
            'warning' | 'warning-subtle' |
            'success' | 'success-subtle' |
            'critical' | 'critical-subtle',
            string
          >
          "focus-default": string
          "focus-inverse": string
          "ui": string
          "ui-clear": string
        }
      },
      spacing: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14, string>
      borderRadius: Record<'DEFAULT' | 'circle', string>
      boxShadow: Record<'sm' | 'md', string>
      borderWidth: Record<'DEFAULT' | 'focus', string>
      lineHeight: Record<3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14, string>
      fontWeight: Record<'light' | 'normal' | 'medium' | 'semibold' | 'bold', string>
    }
  }
}
