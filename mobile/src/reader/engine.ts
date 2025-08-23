// Reader state engine for branching stories
// Inputs: story object (from content service), current state {chapterId, nodeId, variables}
// Outputs: next state after applying a choice; evaluate conditions/effects

export type Story = {
  id: string
  title: string
  chapters: Chapter[]
}

export type Chapter = {
  id: string
  index: number
  title: string
  premium?: boolean
  nodes?: Node[]
}

export type Node = {
  id: string
  text?: string
  choices?: Choice[]
  next?: string // default next node id
  condition?: Expr
  effects?: Effect[]
}

export type Choice = {
  id: string
  label: string
  to: string
  condition?: Expr
  effects?: Effect[]
}

export type State = {
  chapterId: string
  nodeId: string
  variables: Record<string, any>
}

export type Expr = {
  op: 'gt' | 'lt' | 'eq' | 'neq' | 'gte' | 'lte' | 'and' | 'or'
  left?: Expr | Value
  right?: Expr | Value
}

export type Value = { var?: string; const?: any }

export type Effect =
  | { type: 'set'; key: string; value: any }
  | { type: 'inc'; key: string; by: number }
  | { type: 'dec'; key: string; by: number }

export function evalValue(v: Value, vars: Record<string, any>) {
  if ('const' in v) return (v as any).const
  if ('var' in v) return vars[(v as any).var]
  return undefined
}

export function evalExpr(
  expr: Expr | undefined,
  vars: Record<string, any>
): boolean {
  if (!expr) return true
  const val = (x: any) =>
    typeof x === 'object' && (x.var !== undefined || x.const !== undefined)
      ? evalValue(x as any, vars)
      : x
  const left: any = expr.left
    ? (expr.left as any).op
      ? evalExpr(expr.left as Expr, vars)
      : val(expr.left)
    : undefined
  const right: any = expr.right
    ? (expr.right as any).op
      ? evalExpr(expr.right as Expr, vars)
      : val(expr.right)
    : undefined
  switch (expr.op) {
    case 'gt':
      return left > right
    case 'lt':
      return left < right
    case 'eq':
      return left === right
    case 'neq':
      return left !== right
    case 'gte':
      return left >= right
    case 'lte':
      return left <= right
    case 'and':
      return Boolean(left) && Boolean(right)
    case 'or':
      return Boolean(left) || Boolean(right)
    default:
      return false
  }
}

export function applyEffects(
  effects: Effect[] | undefined,
  vars: Record<string, any>
): Record<string, any> {
  if (!effects || effects.length === 0) return vars
  const next = { ...vars }
  for (const e of effects) {
    if (e.type === 'set') next[e.key] = e.value
    else if (e.type === 'inc') next[e.key] = (next[e.key] ?? 0) + e.by
    else if (e.type === 'dec') next[e.key] = (next[e.key] ?? 0) - e.by
  }
  return next
}

export function findChapter(
  story: Story,
  chapterId: string
): Chapter | undefined {
  return story.chapters.find((c) => c.id === chapterId)
}

export function findNode(chapter: Chapter, nodeId: string): Node | undefined {
  return (chapter.nodes || []).find((n) => n.id === nodeId)
}

export function advance(
  story: Story,
  state: State,
  choiceId?: string
): State | null {
  const chapter = findChapter(story, state.chapterId)
  if (!chapter) return null
  const node = findNode(chapter, state.nodeId)
  if (!node) return null

  // Node-level condition
  if (!evalExpr(node.condition, state.variables)) {
    // skip to default next if condition fails
    if (node.next) return { ...state, nodeId: node.next }
    return state
  }

  let vars = applyEffects(node.effects, state.variables)

  if (choiceId) {
    const choice = (node.choices || []).find((c) => c.id === choiceId)
    if (!choice) return state
    if (!evalExpr(choice.condition, vars)) return state
    vars = applyEffects(choice.effects, vars)
    return { ...state, nodeId: choice.to, variables: vars }
  }

  if (node.next) return { ...state, nodeId: node.next, variables: vars }
  return state
}
