import _StyleDictionary from "style-dictionary"
import tinycolor from 'tinycolor2'
import { isObject, camelCase, kebabCase, omit } from 'lodash-es'

import { fontWeightToNumber, percentToEm, pxToRem } from '../utils/fns'

// Convert shadow to css format.
_StyleDictionary.registerTransform({
  name: 'ogp/box-shadow',
  type: 'value',
  matcher: prop => prop.type === 'boxShadow',
  transformer(prop) {
    // destructure shadow values from original token value
    const { x, y, blur, spread, color, alpha } = prop.original.value

    // convert hex code to rgba string
    const shadowColor = tinycolor(color)
    if (alpha)
      shadowColor.setAlpha(alpha)

    shadowColor.toRgbString()

    return `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`
  },
})

// Convert textStyles to ChakraUI object.
_StyleDictionary.registerTransform({
  name: 'ogp/typography',
  type: 'value',
  matcher: prop => prop.type === 'typography',
  transformer: (token) => {
    return {
      fontFamily: token.value.fontFamily,
      textTransform: token.value.textCase === 'none' ? undefined : token.value.textCase,
      textDecoration: token.value.textDecoration === 'none' ? undefined : token.value.textDecoration,
      fontSize: pxToRem(token.value.fontSize),
      fontWeight: fontWeightToNumber(token.value.fontWeight),
      lineHeight: pxToRem(token.value.lineHeight),
      letterSpacing: percentToEm(token.value.letterSpacing),
    }
  },
})

_StyleDictionary.registerTransform({
  name: 'ogp/typography/px-to-rem',
  type: 'value',
  matcher: prop => ['lineHeights', 'spacing', 'fontSizes'].includes(prop.type),
  transformer: token => pxToRem(token.value),
})

_StyleDictionary.registerTransform({
  name: 'ogp/typography/font-weight',
  type: 'value',
  matcher: prop => prop.type === 'fontWeights',
  transformer: token => fontWeightToNumber(token.value),
})

_StyleDictionary.registerTransform({
  name: 'ogp/typography/letter-spacing',
  type: 'value',
  matcher: prop => prop.type === 'letterSpacing',
  transformer: token => percentToEm(token.value),
})

// Convert shadow to css format.
_StyleDictionary.registerTransform({
  name: 'ogp/color',
  type: 'value',
  matcher: prop => prop.type === 'color',
  transformer(token) {
    const color = tinycolor(token.value)
    if (color.getAlpha() === 1)
      return token.value
    return color.toRgbString()
  },
})

_StyleDictionary.registerTransform({
  name: 'ogp/spacing',
  type: 'value',
  matcher(prop) {
    // You can be more specific here if you only want 'em' units for font sizes
    return ['fontSizes', 'spacing', 'borderRadius', 'borderWidth', 'sizing'].includes(prop.attributes?.category ?? '')
  },
  transformer(prop) {
    // You can also modify the value here if you want to convert pixels to ems
    return `${Number.parseFloat(prop.original.value)}px`
  },
})

_StyleDictionary.registerFormat({
  name: 'css/ogp',
  formatter({ dictionary, options }) {
    const css = [
      '@tailwind base;',
      '@tailwind components;',
      '@tailwind utilities;',
      `:root {`
    ]

    const prefixedCss = []

    for (const prop of dictionary.allProperties) {
      if (isObject(prop.value)) {
        prefixedCss.push(
          ` .${prop.name} {`,
          Object.keys(prop.value).filter(key => !!prop.value[key]).map(key => `    ${kebabCase(key)}: ${prop.value[key]};`).join('\n'),
          ' }'
        )
      } else {
        css.push(`  --${kebabCase(prop.path.join('-'))}: ${prop.value};`)
      }
    }

    css.push('}')

    css.push(...prefixedCss)

    return css.join('\n')
  },
})

_StyleDictionary.registerFormat({
  name: 'tailwind/ogp',
  formatter({ dictionary, options }) {
    // Recursively replace all nested objects with "value" key with the value of the "value" key.
    const replaceNestedObjects = (obj: TransformedTokens) => {
      Object.keys(obj).forEach((key) => {
        if (isObject(obj[key]) && obj[key].value !== undefined) {
          if (key === 'default') {
            obj['DEFAULT'] = `var(--${kebabCase(obj[key].path.join('-'))})`
            delete obj['default']
          }
          else {
            obj[key] = `var(--${kebabCase(obj[key].path.join('-'))})`
          }
        }
        else if (isObject(obj[key])) {
          replaceNestedObjects(obj[key])
        }
      })
    }

    const { fileHeader } = _StyleDictionary.formatHelpers

    replaceNestedObjects(dictionary.tokens)

    try {
      dictionary.tokens = {
        ...dictionary.tokens,
        ...(
          dictionary.tokens.typography && Object.keys(dictionary.tokens['typography']).filter(key =>
            key === 'fontFamily' ||
            key === 'lineHeights' ||
            key === 'fontWeights' ||
            key === 'fontSizes' ||
            key === 'letterSpacings' ||
            key === 'textTransforms').reduce((acc, key) => ({
              ...acc,
              [key]: dictionary.tokens['typography'][key]
            }), {})
        ),
      }
    } catch (e) {
      console.log(dictionary.tokens)
    }

    delete dictionary.tokens['typography']

    const output = [
      fileHeader({ file: options.file })
    ]

    const tokens = Object.keys(dictionary.tokens)

    output.push(
      `/** @type {import('tailwindcss').Config} */`,
      'module.exports = {',
      ' theme: {',
      '   extend: {',
    )

    function resolveKey(k) {
      if (k === 'color') return 'colors'
      if (k === 'shadow') return 'boxShadow'
      if (k === 'fontFamilies') return 'fontFamily'
      if (k === 'fontWeights') return 'fontWeight'
      if (k === 'lineHeights') return 'lineHeight'
      return k
    }

    output.push(
      ...tokens.map((key) => `${camelCase(resolveKey(key))}: ${JSON.stringify(dictionary.tokens[key], undefined, 4)},`),
      '',
      '',
    )

    output.push(
      '  },',
      ' },',
      ' plugins: []',
      '}',
    )

    // output += `${tokens
    //     .map((key) => {
    //       return `const ${camelCase(key)} = ${JSON.stringify(
    //         dictionary.tokens[key],
    //         undefined,
    //         4,
    //       )}`
    //     })
    //     .join('\n\n')
    //   }\n\n`
    //   + `export const ${options.exportName
    //   } = {\n${Object.keys(dictionary.tokens)
    //     .map(k => `  ${camelCase(k)}`)
    //     .join(', \n')
    //   }\n};\n`

    // Output the dictionary as a file.
    return output.join('\n')
    const contents = [
    ]

    let theme = {}
    for (const prop of dictionary.allProperties) {
      theme = prop.path.reduceRight((acc, currentVal) => {
        return {
          [currentVal]: acc,
        }
      }, theme)
    }

    console.log(theme)


    return contents.join('\n')
  },
})

export const StyleDictionary = _StyleDictionary
