export type SampleStory = {
  id: string
  title: string
  chapters: SampleChapter[]
}

export type SampleChapter = {
  id: string
  index: number
  title: string
  premium?: boolean
  assets?: string[]
  nodes: SampleNode[]
}

export type Choice = {
  id: string
  text: string
  target: string
  effects?: Effect[]
}

export type SampleNode =
  | { id: string; type: 'image'; image: string }
  | { id: string; type: 'dialogue'; speaker?: string; text?: string }
  | { id: string; type: 'choice'; choices: Choice[] }
  | { id: string; type: 'set'; effects: Effect[] }
  | { id: string; type: 'jump'; target: string }

export type Effect = { var: string; op: 'set' | 'inc' | 'dec'; value: any }

export type State = {
  chapterId: string
  nodeId: string
  variables: Record<string, any>
}

export function findChapter(story: SampleStory, chapterId: string) {
  return story.chapters.find((c) => c.id === chapterId)
}

export function findNode(ch: SampleChapter, nodeId: string) {
  return ch.nodes.find((n) => n.id === nodeId)
}

export function nextSequentialNodeId(ch: SampleChapter, nodeId: string) {
  const idx = ch.nodes.findIndex((n) => n.id === nodeId)
  if (idx < 0) return undefined
  return ch.nodes[idx + 1]?.id
}

export function applyEffects(
  effects: Effect[] | undefined,
  vars: Record<string, any>
) {
  if (!effects || effects.length === 0) return vars
  const next = { ...vars }
  for (const e of effects) {
    if (e.op === 'set') next[e.var] = e.value
    if (e.op === 'inc') next[e.var] = (next[e.var] ?? 0) + Number(e.value || 0)
    if (e.op === 'dec') next[e.var] = (next[e.var] ?? 0) - Number(e.value || 0)
  }
  return next
}

export function step(
  story: SampleStory,
  state: State,
  choiceId?: string
): State | null {
  const ch = findChapter(story, state.chapterId)
  if (!ch) return null
  const node = findNode(ch, state.nodeId)
  if (!node) return null

  switch (node.type) {
    case 'dialogue': {
      const nextId = nextSequentialNodeId(ch, node.id)
      return nextId ? { ...state, nodeId: nextId } : state
    }
    case 'image': {
      const nextId = nextSequentialNodeId(ch, node.id)
      return nextId ? { ...state, nodeId: nextId } : state
    }
    case 'set': {
      const vars = applyEffects(node.effects, state.variables)
      const nextId = nextSequentialNodeId(ch, node.id)
      return nextId
        ? { ...state, nodeId: nextId, variables: vars }
        : { ...state, variables: vars }
    }
    case 'jump': {
      return { ...state, nodeId: node.target }
    }
    case 'choice': {
      if (!choiceId) return state
      const choice = node.choices.find((c) => c.id === choiceId)
      if (!choice) return state
      const vars = applyEffects(choice.effects, state.variables)
      return { ...state, nodeId: choice.target, variables: vars }
    }
    default:
      return state
  }
}
