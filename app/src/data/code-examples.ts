const attentionTools = `const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);
const project = (rows, weights) => rows.map(row => weights[0].map((_, column) => dot(row, weights.map(weight => weight[column]))));
const softmax = scores => {
  const maximum = Math.max(...scores);
  const exps = scores.map(score => Math.exp(score - maximum));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map(value => value / total);
};
const attention = (queries, keys, values, causal = false) => queries.map((query, position) => {
  const scores = keys.map((key, index) => causal && index > position ? -Infinity : dot(query, key) / Math.sqrt(query.length));
  const weights = softmax(scores);
  return { weights, output: values[0].map((_, column) => weights.reduce((sum, weight, index) => sum + weight * values[index][column], 0)) };
});
`;

export const codeExamples: Record<string, string> = {
  functions: `const weight = 2, bias = 1;
const predict = input => weight * input + bias;
const inputs = [-2, -1, 0, 1, 2];
console.log(inputs.map(input => ({ input, output: predict(input) })));
const slope = (predict(3.1) - predict(3)) / 0.1;
console.log({ slope, composedAffine: 3 * (2 * 4 + 1) - 2 });`,
  calculus: `const objective = input => (3 * input) ** 2;
const input = 2, epsilon = 0.0001;
const intermediate = 3 * input;
const localLossGradient = 2 * intermediate;
const localInputGradient = 3;
console.log({ analytical: localLossGradient * localInputGradient,
  numerical: (objective(input + epsilon) - objective(input - epsilon)) / (2 * epsilon) });`,
  bayes: `const prevalence = 0.01, sensitivity = 0.9, falsePositiveRate = 0.1;
const truePositiveProbability = prevalence * sensitivity;
const falsePositiveProbability = (1 - prevalence) * falsePositiveRate;
console.log({ posterior: truePositiveProbability / (truePositiveProbability + falsePositiveProbability),
  truePositivesPer10000: truePositiveProbability * 10000,
  falsePositivesPer10000: falsePositiveProbability * 10000 });`,
  regression: `const inputs = [1, 2], targets = [3, 5];
let weight = 1, bias = 1;
const rate = 0.1;
for (let step = 0; step < 10; step++) {
  const residuals = inputs.map((input, index) => weight * input + bias - targets[index]);
  const loss = residuals.reduce((sum, error) => sum + error ** 2, 0) / inputs.length;
  const weightGradient = 2 * residuals.reduce((sum, error, index) => sum + error * inputs[index], 0) / inputs.length;
  const biasGradient = 2 * residuals.reduce((sum, error) => sum + error, 0) / inputs.length;
  console.log({ step, weight, bias, loss, weightGradient, biasGradient });
  weight -= rate * weightGradient;
  bias -= rate * biasGradient;
}`, 
  classifiers: `const sigmoid = score => 1 / (1 + Math.exp(-score));
const points = [{ feature: 0, label: 0 }, { feature: 1, label: 0 }, { feature: 3, label: 1 }, { feature: 4, label: 1 }];
const query = 2.8, neighbors = 3;
const nearest = [...points].sort((left, right) => Math.abs(left.feature - query) - Math.abs(right.feature - query)).slice(0, neighbors);
const probability = sigmoid(query - 2);
console.log({ nearest, neighborVote: nearest.reduce((sum, point) => sum + point.label, 0) / neighbors,
  logisticProbability: probability, positiveHingeLoss: Math.max(0, 1 - (query - 2)),
  wordLogLikelihoodRatio: Math.log(0.3 / 0.01) });`,
  trees: `const labels = [0, 0, 1, 0, 1, 1, 0, 1];
const gini = group => {
  if (!group.length) return 0;
  const positive = group.reduce((sum, label) => sum + label, 0) / group.length;
  return 1 - positive ** 2 - (1 - positive) ** 2;
};
const candidates = Array.from({ length: labels.length - 1 }, (_, index) => {
  const split = index + 1, left = labels.slice(0, split), right = labels.slice(split);
  const gain = gini(labels) - left.length / labels.length * gini(left) - right.length / labels.length * gini(right);
  return { split, gain };
});
console.log({ parentImpurity: gini(labels), candidates, best: candidates.reduce((best, candidate) => candidate.gain > best.gain ? candidate : best) });`,
  clustering: `const points = [1, 2, 8, 9];
let centers = [1, 8];
for (let iteration = 0; iteration < 4; iteration++) {
  const assignments = points.map(point => Math.abs(point - centers[0]) <= Math.abs(point - centers[1]) ? 0 : 1);
  centers = centers.map((center, cluster) => {
    const members = points.filter((_, index) => assignments[index] === cluster);
    return members.length ? members.reduce((sum, point) => sum + point, 0) / members.length : center;
  });
  const objective = points.reduce((sum, point, index) => sum + (point - centers[assignments[index]]) ** 2, 0);
  console.log({ iteration, centers, assignments, objective });
}`, 
  activations: `const sigmoid = value => 1 / (1 + Math.exp(-value));
console.log([-2, -1, 0, 1, 2].map(input => ({ input,
  sigmoid: sigmoid(input), sigmoidDerivative: sigmoid(input) * (1 - sigmoid(input)),
  tanh: Math.tanh(input), tanhDerivative: 1 - Math.tanh(input) ** 2,
  relu: Math.max(0, input), reluDerivativeConvention: input > 0 ? 1 : 0,
  leakyRelu: input > 0 ? input : 0.01 * input,
  elu: input > 0 ? input : Math.expm1(input), silu: input * sigmoid(input),
  geluApproximation: 0.5 * input * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (input + 0.044715 * input ** 3)))
})));`,
  mlp: `const input = [1, 2], weights = [[1, -1], [0.5, 1]], biases = [0, 0.5];
const preActivation = weights.map((row, index) => row.reduce((sum, value, coordinate) => sum + value * input[coordinate], biases[index]));
const hidden = preActivation.map(value => Math.max(0, value));
const prediction = 2 * hidden[0] - hidden[1] + 0.2;
const target = 1, outputDelta = prediction - target;
const hiddenDelta = [2, -1].map((weight, index) => outputDelta * weight * (preActivation[index] > 0 ? 1 : 0));
console.log({ preActivation, hidden, prediction, loss: 0.5 * (prediction - target) ** 2,
  outputWeightGradient: hidden.map(value => value * outputDelta),
  hiddenWeightGradient: hiddenDelta.map(delta => input.map(value => value * delta)) });`,
  losses: `const residual = 4, threshold = 1;
const probabilities = [0.7, 0.2, 0.1], targetId = 1;
console.log({ mse: residual ** 2, mae: Math.abs(residual),
  huber: Math.abs(residual) <= threshold ? 0.5 * residual ** 2 : threshold * (Math.abs(residual) - 0.5 * threshold),
  crossEntropy: -Math.log(probabilities[targetId]),
  logitGradient: probabilities.map((probability, index) => probability - Number(index === targetId)),
  triplet: Math.max(0, 0.5 ** 2 - 0.6 ** 2 + 0.2),
  cosineLoss: 1 - 0.8 });`,
  optimizers: `let weight = 2, momentum = 0, mean = 0, variance = 0, squaredSum = 0;
const rate = 0.1, beta1 = 0.9, beta2 = 0.999;
for (let step = 1; step <= 5; step++) {
  const gradient = 2 * weight;
  momentum = 0.9 * momentum + gradient;
  squaredSum += gradient ** 2;
  mean = beta1 * mean + (1 - beta1) * gradient;
  variance = beta2 * variance + (1 - beta2) * gradient ** 2;
  const adamDirection = (mean / (1 - beta1 ** step)) / (Math.sqrt(variance / (1 - beta2 ** step)) + 1e-8);
  console.log({ step, weight, gradient, sgdDirection: gradient, momentumDirection: momentum,
    adagradDirection: gradient / (Math.sqrt(squaredSum) + 1e-8), adamDirection });
  weight -= rate * adamDirection;
}`, 
  training: `const inputs = [[0, 0], [0, 1], [1, 0], [1, 1]], targets = [0, 1, 1, 0];
const hiddenWeights = [[0.5, -0.3], [-0.4, 0.8], [0.7, 0.2], [-0.2, -0.6]];
const hiddenBias = [0.1, -0.1, 0.2, 0.3];
const outputWeights = [0.6, -0.5, 0.4, 0.3];
let outputBias = 0;
const sigmoid = value => 1 / (1 + Math.exp(-value));
for (let epoch = 0; epoch < 1200; epoch++) {
  const weightGradient = hiddenWeights.map(row => row.map(() => 0));
  const biasGradient = hiddenBias.map(() => 0), outputGradient = outputWeights.map(() => 0);
  let finalBiasGradient = 0, loss = 0;
  inputs.forEach((input, example) => {
    const hidden = hiddenWeights.map((row, index) => Math.tanh(row[0] * input[0] + row[1] * input[1] + hiddenBias[index]));
    const logit = hidden.reduce((sum, value, index) => sum + value * outputWeights[index], outputBias);
    const probability = sigmoid(logit), delta = (probability - targets[example]) / inputs.length;
    loss += (Math.max(logit, 0) - logit * targets[example] + Math.log1p(Math.exp(-Math.abs(logit)))) / inputs.length;
    hidden.forEach((value, index) => {
      outputGradient[index] += delta * value;
      const local = delta * outputWeights[index] * (1 - value ** 2);
      biasGradient[index] += local;
      input.forEach((feature, coordinate) => { weightGradient[index][coordinate] += local * feature; });
    });
    finalBiasGradient += delta;
  });
  hiddenWeights.forEach((row, index) => {
    row.forEach((_, coordinate) => { row[coordinate] -= 0.3 * weightGradient[index][coordinate]; });
    hiddenBias[index] -= 0.3 * biasGradient[index];
    outputWeights[index] -= 0.3 * outputGradient[index];
  });
  outputBias -= 0.3 * finalBiasGradient;
  if (epoch % 300 === 0) console.log({ epoch, loss });
}
console.log(inputs.map(input => {
  const hidden = hiddenWeights.map((row, index) => Math.tanh(row[0] * input[0] + row[1] * input[1] + hiddenBias[index]));
  return { input, probability: sigmoid(hidden.reduce((sum, value, index) => sum + value * outputWeights[index], outputBias)) };
}));`,
  vision: `const intersection = (left, right) => Math.max(0, Math.min(left[2], right[2]) - Math.max(left[0], right[0])) * Math.max(0, Math.min(left[3], right[3]) - Math.max(left[1], right[1]));
const area = box => (box[2] - box[0]) * (box[3] - box[1]);
const predicted = [0, 0, 4, 5], target = [2, 0, 8, 5];
const overlap = intersection(predicted, target);
console.log({ intersection: overlap, union: area(predicted) + area(target) - overlap,
  IoU: overlap / (area(predicted) + area(target) - overlap),
  pooling: { max: Math.max(1, 3, 2, 0), average: (1 + 3 + 2 + 0) / 4 } });`,
  residuals: `const input = [1, -2], correction = [0.5, 0.5];
const residual = input.map((value, index) => value + correction[index]);
console.log({ residual, concatenated: [...input, ...correction],
  postActivation: residual.map(value => Math.max(0, value)),
  scalarDerivativeWhenBranchIsNegativeIdentity: 1 - 1 });`,
  rnn: `const run = sequence => {
  let state = 0;
  return sequence.map((input, step) => {
    const previous = state;
    state = Math.tanh(input + 0.5 * previous);
    return { step, input, previous, state, localStateDerivative: 0.5 * (1 - state ** 2) };
  });
};
console.log({ forwardOrder: run([1, 0]), reverseOrder: run([0, 1]) });`,
  vanishing: `console.log([10, 50, 100].map(steps => ({ steps,
  shrinking: 0.9 ** steps, expanding: 1.1 ** steps, retained: 0.99 ** steps })));
const gradient = [30, 40], threshold = 5;
const factor = Math.min(1, threshold / Math.hypot(...gradient));
console.log({ clipped: gradient.map(value => value * factor) });`,
  lstm: `const sigmoid = value => 1 / (1 + Math.exp(-value));
let cell = 0, hidden = 0;
console.log([1, 0, -1].map(input => {
  const forget = sigmoid(input * 0.2 + hidden * 0.3 + 1);
  const write = sigmoid(input * 0.5 - hidden * 0.2);
  const candidate = Math.tanh(input * 0.8 + hidden * 0.1);
  const output = sigmoid(input * 0.3 + hidden * 0.4);
  const previousCell = cell;
  cell = forget * cell + write * candidate;
  hidden = output * Math.tanh(cell);
  return { input, forget, write, candidate, output, previousCell, cell, hidden };
}));`,
  gru: `const sigmoid = value => 1 / (1 + Math.exp(-value));
let hidden = 0.6;
console.log([1, 0, -1].map(input => {
  const previous = hidden;
  const retain = sigmoid(0.3 * input + 0.5 * previous);
  const reset = sigmoid(-0.4 * input + 0.2 * previous);
  const candidate = Math.tanh(0.8 * input + 0.6 * reset * previous);
  hidden = retain * previous + (1 - retain) * candidate;
  return { input, retain, reset, candidate, previous, hidden };
}));`,
  bpe: `let words = ['low', 'low', 'lower'].map(word => [...word]);
const merges = [];
for (let step = 0; step < 3; step++) {
  const counts = new Map();
  words.forEach(word => word.slice(0, -1).forEach((symbol, index) => {
    const pair = JSON.stringify([symbol, word[index + 1]]);
    counts.set(pair, (counts.get(pair) || 0) + 1);
  }));
  const best = [...counts].sort((left, right) => right[1] - left[1])[0];
  if (!best) break;
  const [left, right] = JSON.parse(best[0]);
  merges.push({ left, right, count: best[1] });
  words = words.map(word => {
    const result = [];
    for (let index = 0; index < word.length; index++) {
      if (word[index] === left && word[index + 1] === right) { result.push(left + right); index++; }
      else result.push(word[index]);
    }
    return result;
  });
}
console.log({ merges, words });`,
  embeddings: `const vocabulary = ['cat', 'dog', 'sat'];
const table = [[0.2, -0.1], [0.3, 0.4], [-0.2, 0.5]];
const centerId = 0, contextId = 2, rate = 0.1;
const center = [...table[centerId]], context = [...table[contextId]];
const score = center.reduce((sum, value, index) => sum + value * context[index], 0);
const probability = 1 / (1 + Math.exp(-score));
const delta = probability - 1;
table[centerId] = center.map((value, index) => value - rate * delta * context[index]);
table[contextId] = context.map((value, index) => value - rate * delta * center[index]);
console.log({ positivePair: [vocabulary[centerId], vocabulary[contextId]], score, loss: -Math.log(probability), updatedTable: table });`,
  'self-attention': attentionTools + `const input = [[1, 0], [0, 1], [1, 1]];
const queries = project(input, [[1, 0], [0, 1]]);
const keys = project(input, [[0.5, 0], [0, 1]]);
const values = project(input, [[2, 0], [0, 3]]);
console.log({ queries, keys, values, causalOutputs: attention(queries, keys, values, true) });`,
  'multi-head': attentionTools + `const input = [[1, 0], [0, 1], [1, 1]];
const firstProjection = project(input, [[1], [0]]);
const secondProjection = project(input, [[0], [1]]);
const first = attention(firstProjection, firstProjection, firstProjection, true);
const second = attention(secondProjection, secondProjection, secondProjection, true);
const concatenated = first.map((entry, index) => [...entry.output, ...second[index].output]);
console.log({ first, second, concatenated, projected: project(concatenated, [[1, 0.5], [-0.5, 1]]) });`,
  transformer: attentionTools + `const norm = row => {
  const mean = row.reduce((sum, value) => sum + value, 0) / row.length;
  const variance = row.reduce((sum, value) => sum + (value - mean) ** 2, 0) / row.length;
  return row.map(value => (value - mean) / Math.sqrt(variance + 1e-5));
};
const input = [[1, 0], [0, 2], [1, 3]];
const normalized = input.map(norm);
const mixed = attention(normalized, normalized, normalized, true);
const residual = input.map((row, index) => row.map((value, column) => value + mixed[index].output[column]));
const expanded = project(residual.map(norm), [[1, -1, 0.5, 0], [0, 1, -0.5, 1]]).map(row => row.map(value => Math.max(0, value)));
const feedForward = project(expanded, [[1, 0], [0, 1], [0.5, 0.5], [-0.5, 0.5]]);
console.log({ input, normalized, attention: mixed, residual, expanded,
  output: residual.map((row, index) => row.map((value, column) => value + feedForward[index][column])) });`,
  positions: `const rotate = (vector, angle) => [vector[0] * Math.cos(angle) - vector[1] * Math.sin(angle), vector[0] * Math.sin(angle) + vector[1] * Math.cos(angle)];
const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);
const query = [1, 0], key = [0.6, 0.8];
console.log({ original: dot(query, key), bothRotated: dot(rotate(query, 0.7), rotate(key, 0.7)),
  differentPositions: dot(rotate(query, 0.7), rotate(key, 1.4)),
  sineCosineAtPositions: [0, 1, 2].map(position => [Math.sin(position), Math.cos(position)]) });`,
  normalization: `const compare = input => {
  const mean = input.reduce((sum, value) => sum + value, 0) / input.length;
  const variance = input.reduce((sum, value) => sum + (value - mean) ** 2, 0) / input.length;
  const meanSquare = input.reduce((sum, value) => sum + value ** 2, 0) / input.length;
  return { input, mean, variance, layerNorm: input.map(value => (value - mean) / Math.sqrt(variance + 1e-5)),
    rmsNorm: input.map(value => value / Math.sqrt(meanSquare + 1e-5)) };
};
console.log([compare([1, 3]), compare([11, 13])]);`,
  sampling: `const probabilities = [0.6, 0.25, 0.1, 0.05], threshold = 0.8;
let mass = 0;
const retained = [];
for (let index = 0; index < probabilities.length; index++) {
  retained.push({ token: index, probability: probabilities[index] });
  mass += probabilities[index];
  if (mass >= threshold) break;
}
console.log({ retainedMass: mass, nucleus: retained.map(entry => ({ ...entry, probability: entry.probability / mass })) });`,
  pretraining: `const tokens = [0, 3, 5, 2, 1];
const inputs = tokens.slice(0, -1), targets = tokens.slice(1);
const mask = inputs.map((_, query) => inputs.map((_, key) => key <= query ? 0 : '-Infinity'));
const fullParameters = 1024 * 1024, rank = 8;
console.log({ inputs, targets, causalMask: mask, effectiveBatch: 4 * 8,
  fullParameters, adapterParameters: rank * (1024 + 1024) });`,
  compression: `const values = [0.04, 0.26, -0.18, 1.7], scale = 0.1, minimum = -8, maximum = 7;
const quantized = values.map(value => Math.min(maximum, Math.max(minimum, Math.round(value / scale))));
const restored = quantized.map(value => value * scale);
console.log({ values, quantized, restored,
  meanSquaredError: values.reduce((sum, value, index) => sum + (value - restored[index]) ** 2, 0) / values.length,
  billionWeights4BitGB: 1e9 * 4 / 8 / 1e9 });`,
  reinforcement: `const rewards = [1, 2, 3], discount = 0.9;
const totalReturn = rewards.reduce((sum, reward, index) => sum + discount ** index * reward, 0);
const currentQ = 2, reward = 1, nextQ = 3, rate = 0.1;
console.log({ totalReturn, nonterminalTarget: reward + discount * nextQ,
  updatedQ: currentQ + rate * (reward + discount * nextQ - currentQ),
  terminalUpdate: currentQ + rate * (reward - currentQ) });`,
  alignment: `const beta = 0.1;
const preferredPolicyLogP = -4, rejectedPolicyLogP = -7;
const preferredReferenceLogP = -5, rejectedReferenceLogP = -6;
const margin = beta * ((preferredPolicyLogP - preferredReferenceLogP) - (rejectedPolicyLogP - rejectedReferenceLogP));
const preferenceProbability = 1 / (1 + Math.exp(-margin));
console.log({ margin, preferenceProbability, dpoLoss: -Math.log(preferenceProbability) });`,
  agents: `const allowedTools = { search: ({ query }) => {
  if (typeof query !== 'string' || query.length > 200) throw Error('Invalid query');
  return ['Local result for: ' + query];
} };
const proposed = [{ name: 'search', arguments: { query: 'causal attention' } }, { name: 'delete', arguments: {} }];
const observations = proposed.map(action => {
  if (!Object.hasOwn(allowedTools, action.name)) return { denied: action.name };
  return { tool: action.name, result: allowedTools[action.name](action.arguments) };
});
console.log({ observations, stopped: true, executedExternalActions: 0 });`,
  multimodal: `const imageVector = [1, 0.5], captions = [{ text: 'a bicycle', vector: [0.9, 0.4] }, { text: 'a cup', vector: [-0.2, 1] }];
const cosine = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0) / (Math.hypot(...left) * Math.hypot(...right));
console.log({ toyScores: captions.map(caption => ({ text: caption.text, similarity: cosine(imageVector, caption.vector) })),
  patchTokens16: (224 / 16) ** 2, patchTokens8: (224 / 8) ** 2 });`,
  evaluation: `const targets = [1, 1, 0, 0, 1, 0], scores = [0.9, 0.6, 0.7, 0.1, 0.4, 0.2];
console.log([0.3, 0.5, 0.8].map(threshold => {
  const predicted = scores.map(score => Number(score >= threshold));
  const truePositive = predicted.filter((label, index) => label === 1 && targets[index] === 1).length;
  const predictedPositive = predicted.filter(label => label === 1).length;
  const actualPositive = targets.filter(label => label === 1).length;
  const precision = predictedPositive ? truePositive / predictedPositive : 0;
  const recall = truePositive / actualPositive;
  return { threshold, precision, recall, f1: precision + recall ? 2 * precision * recall / (precision + recall) : 0 };
}));`,
  interpretability: `const input = [2, 3], baseline = [0, 0], steps = 100;
const predict = vector => vector[0] ** 2 + 3 * vector[1];
const gradient = vector => [2 * vector[0], 3];
const attribution = input.map((value, coordinate) => {
  let averageGradient = 0;
  for (let step = 0; step < steps; step++) {
    const fraction = (step + 0.5) / steps;
    const point = input.map((entry, index) => baseline[index] + fraction * (entry - baseline[index]));
    averageGradient += gradient(point)[coordinate] / steps;
  }
  return (value - baseline[coordinate]) * averageGradient;
});
console.log({ attribution, sum: attribution.reduce((sum, value) => sum + value, 0),
  outputDifference: predict(input) - predict(baseline) });`,
  mlops: `const baseline = { accuracy: 0.91, p95LatencyMs: 100, schema: 'v1' };
const candidates = [{ version: 'model-a', accuracy: 0.92, p95LatencyMs: 110, schema: 'v1' },
  { version: 'model-b', accuracy: 0.94, p95LatencyMs: 300, schema: 'v2' }];
console.log(candidates.map(candidate => ({ version: candidate.version,
  passes: candidate.accuracy >= baseline.accuracy && candidate.p95LatencyMs <= 150 && candidate.schema === baseline.schema,
  rollbackVersion: 'baseline', simulatedReleaseOnly: true })));`,
  serving: `const weightGB = 14, bandwidthGBps = 700;
const systems = [{ name: 'fast prefill', firstTokenMs: 100, laterTokenMs: 40 }, { name: 'fast decode', firstTokenMs: 500, laterTokenMs: 10 }];
console.log({ weightReadLowerBoundMs: weightGB / bandwidthGBps * 1000,
  latency: systems.map(system => ({ name: system.name,
    tenTokensMs: system.firstTokenMs + 9 * system.laterTokenMs,
    thousandTokensMs: system.firstTokenMs + 999 * system.laterTokenMs })) });`,
  distributed: `const workers = [{ gradients: [1, 3] }, { gradients: [5] }];
const means = workers.map(worker => worker.gradients.reduce((sum, value) => sum + value, 0) / worker.gradients.length);
const totalExamples = workers.reduce((sum, worker) => sum + worker.gradients.length, 0);
const weightedMean = workers.reduce((sum, worker, index) => sum + means[index] * worker.gradients.length, 0) / totalExamples;
console.log({ incorrectEqualWorkerMean: means.reduce((sum, value) => sum + value, 0) / means.length,
  correctGlobalMean: weightedMean, effectiveBatch: 4 * 8 * 16 });`,
  scaling: `const routerWeights = [0.5, 0.3, 0.15, 0.05], expertOutputs = [2, 6, -1, 8];
const selected = routerWeights.map((weight, index) => ({ weight, index })).sort((left, right) => right.weight - left.weight).slice(0, 2);
const mass = selected.reduce((sum, entry) => sum + entry.weight, 0);
console.log({ selected, renormalizedMixture: selected.reduce((sum, entry) => sum + entry.weight / mass * expertOutputs[entry.index], 0),
  denseTrainingFlopsEstimate: 6 * 100e6 * 1e9, activeExperts: selected.length, totalExperts: expertOutputs.length });`,
  research: `const baselineScores = [0.71, 0.73, 0.70, 0.74, 0.72];
const candidateScores = [0.72, 0.75, 0.71, 0.73, 0.74];
const differences = candidateScores.map((value, index) => value - baselineScores[index]);
const mean = differences.reduce((sum, value) => sum + value, 0) / differences.length;
const sampleVariance = differences.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (differences.length - 1);
console.log({ pairedDifferences: differences, meanGain: mean, standardError: Math.sqrt(sampleVariance / differences.length),
  caveat: 'Five paired runs illustrate uncertainty; this is not evidence of universal superiority.' });`,
}