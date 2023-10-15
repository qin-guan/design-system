import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { Command } from 'commander'
import { join, parse } from 'pathe'
import { StyleDictionary } from '../utils/style-dictionary'
import { $ } from 'execa'
import { consola } from 'consola'

export const generate = new Command()
  .name('generate')
  .description('generate tailwind theme from design tokens')
  .argument('file', 'path to design tokens file')
  .action(async (file) => {
    const tokens = JSON.parse(await readFile(file, 'utf-8'))

    const tokensPath = join(parse(file).dir, 'tokens')
    const rawTokensPath = join(tokensPath, 'raw')
    if (!existsSync(rawTokensPath))
      await mkdir(rawTokensPath, { recursive: true })

    await Promise.all(
      Object.keys(tokens).map(async (key) => {
        const token = tokens[key]
        await writeFile(join(rawTokensPath, `${key}.json`), JSON.stringify(token, null, 2), 'utf8')
      }),
    )

    const transformedTokensPath = join(tokensPath, 'transformed')
    const cmd = `npx token-transformer ${rawTokensPath} --theme --themeOutputPath=${transformedTokensPath}`

    consola.info('Running command: ', cmd)

    await $({ stdio: 'inherit' })`npx token-transformer ${rawTokensPath} --theme --themeOutputPath=${transformedTokensPath}`

    consola.box('Build started...');

    // PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS
    // 
    const files = await readdir(transformedTokensPath)

    files.map((theme) => {
      consola.log(`\nProcessing: [${theme}]`)

      StyleDictionary
        .extend({
          source: [
            join(transformedTokensPath, theme),
          ],
          platforms: {
            web: {
              transforms: [
                'attribute/cti',
                'name/cti/kebab',
                'size/pxToRem',
                'ogp/box-shadow',
                'ogp/typography',
                'ogp/typography/px-to-rem',
                'ogp/typography/font-weight',
                'ogp/typography/letter-spacing',
                'ogp/color',
                'ogp/spacing',
              ],
              buildPath: `output/`,
              files: [
                {
                  destination: `${theme}/root.css`,
                  format: 'css/ogp',
                  options: {
                    selector: `.${theme}-theme`,
                  }
                },
                {
                  destination: `${theme}/tailwind.config.js`,
                  format: 'tailwind/ogp',
                  options: {
                    file
                  }
                },
              ],
            },
          },
        })
        .buildPlatform('web')

      consola.log('\nEnd processing')
    })

    consola.log('\n==============================================')
    consola.log('\nBuild completed!')
  })
