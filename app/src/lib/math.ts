export type Activation = 'sigmoid' | 'tanh' | 'relu' | 'linear' | 'leaky-relu' | 'elu' | 'gelu' | 'silu'

export const dot = (left: number[], right: number[]) => left.reduce((sum, value, index) => sum + value * right[index], 0)
export const sigmoid = (value: number) => 1 / (1 + Math.exp(-value))
export function activate(value: number, kind: Activation): number {
  switch (kind) {
    case 'sigmoid': return sigmoid(value)
    case 'tanh': return Math.tanh(value)
    case 'relu': return Math.max(0, value)
    case 'leaky-relu': return value >= 0 ? value : value * 0.01
    case 'elu': return value >= 0 ? value : Math.expm1(value)
    case 'gelu': return 0.5 * value * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (value + 0.044715 * value ** 3)))
    case 'silu': return value * sigmoid(value)
    default: return value
  }
}
export function softmax(logits: number[], temperature = 1) {
  if (temperature <= 0) throw new Error('Temperature must be positive')
  const maximum = Math.max(...logits)
  const exponentials = logits.map(value => Math.exp((value - maximum) / temperature))
  const total = exponentials.reduce((sum, value) => sum + value, 0)
  return exponentials.map(value => value / total)
}
export function neuron(inputs: number[], weights: number[], bias: number, activation: Activation = 'sigmoid') {
  const products = inputs.map((value, index) => value * weights[index])
  const weightedSum = dot(inputs, weights) + bias
  return { products, weightedSum, output: activate(weightedSum, activation) }
}
export function neuronGradients(inputs: number[], weights: number[], bias: number, target: number) {
  const { output } = neuron(inputs, weights, bias)
  const loss = (output - target) ** 2
  const upstream = 2 * (output - target)
  const local = output * (1 - output)
  const biasGradient = upstream * local
  return { output, loss, upstream, local, biasGradient, weights: inputs.map(value => biasGradient * value) }
}
export function attention(queries: number[][], keys: number[][], values: number[][], causal = false) {
  const scores = queries.map((query, row) => keys.map((key, column) => causal && column > row ? -Infinity : dot(query, key) / Math.sqrt(query.length)))
  const weights = scores.map(row => softmax(row))
  const output = weights.map(row => values[0].map((_, dimension) => row.reduce((sum, weight, index) => sum + weight * values[index][dimension], 0)))
  return { scores, weights, output }
}
export function convolve(image: number[][], kernel: number[][], row: number, column: number) {
  const products = kernel.flatMap((values, vertical) => values.map((weight, horizontal) => weight * (image[row + vertical]?.[column + horizontal] ?? 0)))
  return { products, value: products.reduce((sum, value) => sum + value, 0) }
}
export const lossSurface = (position: number) => 0.35 * position ** 2 + Math.sin(position * 2) + 1.6
export const lossGradient = (position: number) => 0.7 * position + 2 * Math.cos(position * 2)
export function optimizerStep(position: number, learningRate: number, velocity = 0, momentum = 0) {
  const nextVelocity = momentum * velocity + lossGradient(position)
  return { position: position - learningRate * nextVelocity, velocity: nextVelocity }
}
export function cosine(left: number[], right: number[]) {
  const denominator = Math.sqrt(dot(left, left) * dot(right, right))
  return denominator ? dot(left, right) / denominator : 0
}