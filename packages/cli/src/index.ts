#!/usr/bin/env node

import process from 'node:process'

import { Command } from 'commander'
import { getPackageInfo } from './utils/get-package-info'
import { generate } from './commands/generate'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main() {
  const packageInfo = await getPackageInfo()

  const program = new Command()
    .name('@qinguan/design-system-cli')
    .description('generate tokens')
    .version(
      packageInfo.version || '1.0.0',
      '-v, --version',
      'display the version number',
    )

  program
    .addCommand(generate)

  program.parse()
}

main()
