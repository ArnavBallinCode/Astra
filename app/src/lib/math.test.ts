import { describe, expect, it } from 'vitest'
import { attention, convolve, cosine, lossSurface, neuron, neuronGradients, optimizerStep, softmax } from './math'

describe('the values rendered in interactive labs', () => {
  it('computes the exact neuron from the course brief', () => {
    const result = neuron([0.7, 0.2, 0.9], [0.4, -0.7, 0.2], 0.1)
    expect(result.weightedSum).toBeCloseTo(0.42)
    expect(result.output).toBeCloseTo(0.603483)
  })
  it('matches analytical backpropagation to finite differences', () => {
    const inputs = [0.7, 0.2, 0.9], weights = [0.4, -0.7, 0.2], epsilon = 1e-5
    const gradients = neuronGradients(inputs, weights, 0.1, 1)
    weights.forEach((_, index) => {
      const upper = weights.map((value, column) => value + (column === index ? epsilon : 0))
      const lower = weights.map((value, column) => value - (column === index ? epsilon : 0))
      const numerical = ((neuron(inputs, upper, 0.1).output - 1) ** 2 - (neuron(inputs, lower, 0.1).output - 1) ** 2) / (2 * epsilon)
      expect(gradients.weights[index]).toBeCloseTo(numerical, 6)
    })
  })
  it('keeps softmax finite and normalized for large logits', () => {
    const probabilities = softmax([1000, 1001, 1002])
    expect(probabilities.every(Number.isFinite)).toBe(true)
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1)
    expect(softmax([1, 2, 3], 2)[2]).toBeLessThan(softmax([1, 2, 3], 0.5)[2])
  })
  it('applies causal masking before softmax', () => {
    const result = attention([[1, 0], [0, 1]], [[1, 0], [0, 1]], [[2, 3], [4, 5]], true)
    expect(result.weights[0]).toEqual([1, 0])
    expect(result.output[0]).toEqual([2, 3])
  })
  it('accumulates convolution and descends the real loss', () => {
    expect(convolve([[1, 2], [3, 4]], [[1, -1], [0, 2]], 0, 0).value).toBe(7)
    expect(lossSurface(optimizerStep(2, 0.05).position)).toBeLessThan(lossSurface(2))
    expect(cosine([1, 0], [0, 1])).toBe(0)
  })
})