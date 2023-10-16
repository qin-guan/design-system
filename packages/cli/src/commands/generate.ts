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
    const cmd = `pnpm dlx token-transformer ${rawTokensPath} --theme --themeOutputPath=${transformedTokensPath}`

    consola.info('Running command: ', cmd)

    await $({ stdio: 'inherit' })`pnpm dlx token-transformer ${rawTokensPath} --theme --themeOutputPath=${transformedTokensPath}`

    consola.box('Build started...');

    const files = (await readdir(transformedTokensPath)).map((file) => {
      return {
        path: file,
        name: parse(file).name
      }
    })

    files.forEach(({ path, name }) => {
      consola.log(`\nProcessing: [${name}]`)

      StyleDictionary
        .extend({
          source: [
            join(transformedTokensPath, path),
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
                  destination: `${name}/root.css`,
                  format: 'css/ogp',
                },
                {
                  destination: `${name}/theme.js`,
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

    await $({ stdio: 'inherit' })`pnpm dlx prettier ./output --write`

    consola.log('\n==============================================')
    consola.log('\nBuild completed!')
  })
