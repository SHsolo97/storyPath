#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

async function main() {
  const [, , inputPathArg] = process.argv
  if (!inputPathArg) {
    console.error('Usage: node validate-story.mjs <path-to-story-json>')
    process.exit(2)
  }
  const cwd = process.cwd()
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const repoRoot = path.resolve(scriptDir, '..')
  const schemaPath = path.resolve(repoRoot, 'schemas', 'story.schema.json')
  const dataPath = path.isAbsolute(inputPathArg)
    ? inputPathArg
    : path.resolve(cwd, inputPathArg)

  const [schemaRaw, dataRaw] = await Promise.all([
    readFile(schemaPath, 'utf8'),
    readFile(dataPath, 'utf8')
  ])

  const schema = JSON.parse(schemaRaw)
  const data = JSON.parse(dataRaw)

  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const valid = validate(data)

  if (valid) {
    console.log('OK: Story JSON is valid against schema.')
    process.exit(0)
  } else {
    console.error('INVALID: Schema validation failed.')
    for (const err of validate.errors ?? []) {
      console.error(`- ${err.instancePath} ${err.message}`)
      if (err.params) console.error(`  params: ${JSON.stringify(err.params)}`)
    }
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('ERROR:', e)
  process.exit(1)
})
