import { load } from 'js-yaml'

const FRONT_MATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

export function parseFrontMatter(markdown) {
  const match = FRONT_MATTER_REGEX.exec(markdown)
  if (!match) {
    return { data: {}, content: markdown }
  }
  const [, yamlContent] = match
  let data = {}
  try {
    data = load(yamlContent) || {}
  } catch (err) {
    console.error('Failed to parse front matter:', err)
  }
  const content = markdown.slice(match[0].length)
  return { data, content }
}