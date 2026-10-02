class Value {
  constructor(data, parents = [], backward = () => {}) {
    this.data = data;
    this.grad = 0;
    this.parents = parents;
    this.propagate = backward;
  }
  add(other) {
    const right = other instanceof Value ? other : new Value(other);
    const result = new Value(this.data + right.data, [this, right], () => {
      this.grad += result.grad;
      right.grad += result.grad;
    });
    return result;
  }
  mul(other) {
    const right = other instanceof Value ? other : new Value(other);
    const result = new Value(this.data * right.data, [this, right], () => {
      this.grad += right.data * result.grad;
      right.grad += this.data * result.grad;
    });
    return result;
  }
  pow(power) {
    const result = new Value(this.data ** power, [this], () => {
      this.grad += power * this.data ** (power - 1) * result.grad;
    });
    return result;
  }
  exp() {
    const result = new Value(Math.exp(this.data), [this], () => {
      this.grad += result.data * result.grad;
    });
    return result;
  }
  log() {
    const result = new Value(Math.log(this.data), [this], () => {
      this.grad += result.grad / this.data;
    });
    return result;
  }
  relu() {
    const result = new Value(Math.max(0, this.data), [this], () => {
      this.grad += (this.data > 0 ? 1 : 0) * result.grad;
    });
    return result;
  }
  backward() {
    const order = [], visited = new Set();
    const visit = node => {
      if (visited.has(node)) return;
      visited.add(node);
      node.parents.forEach(visit);
      order.push(node);
    };
    visit(this);
    order.forEach(node => { node.grad = 0; });
    this.grad = 1;
    order.reverse().forEach(node => node.propagate());
  }
}

let seed = 42;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const sum = values => values.reduce((total, value) => total.add(value), new Value(0));
const dot = (left, right) => sum(left.map((value, index) => value.mul(right[index])));
const add = (left, right) => left.map((value, index) => value.add(right[index]));
const softmax = scores => {
  const maximum = Math.max(...scores.map(value => value.data));
  const exponentials = scores.map(value => value.add(-maximum).exp());
  const inverseTotal = sum(exponentials).pow(-1);
  return exponentials.map(value => value.mul(inverseTotal));
};
const parameters = [];
const parameter = data => {
  const value = new Value(data);
  parameters.push(value);
  return value;
};
const matrix = (rows, columns) => Array.from({ length: rows }, () =>
  Array.from({ length: columns }, () => parameter((random() * 2 - 1) / Math.sqrt(columns))));
const linear = (input, weights) => weights.map(row => dot(row, input));
const width = 8, heads = 2, headWidth = width / heads, context = 8;
const text = 'the cat sat. the dog sat. the cat slept. ';
const vocabulary = [...new Set(text)].sort();
const ids = [...text].map(token => vocabulary.indexOf(token));
const embeddings = matrix(vocabulary.length, width);
const positions = matrix(context, width);
const queryWeights = matrix(width, width);
const keyWeights = matrix(width, width);
const valueWeights = matrix(width, width);
const outputWeights = matrix(width, width);
const expandWeights = matrix(width * 2, width);
const contractWeights = matrix(width, width * 2);
const normalization = () => ({
  scale: Array.from({ length: width }, () => parameter(1)),
  bias: Array.from({ length: width }, () => parameter(0))
});
const firstNorm = normalization(), secondNorm = normalization(), finalNorm = normalization();
const norm = (input, weights) => {
  const mean = sum(input).mul(1 / width);
  const centered = input.map(value => value.add(mean.mul(-1)));
  const variance = sum(centered.map(value => value.pow(2))).mul(1 / width);
  const inverseDeviation = variance.add(0.00001).pow(-0.5);
  return centered.map((value, index) => value.mul(inverseDeviation)
    .mul(weights.scale[index]).add(weights.bias[index]));
};
const forward = tokens => {
  if (!tokens.length || tokens.length > context) throw Error('Use 1 to 8 input tokens');
  const hidden = tokens.map((id, position) => add(embeddings[id], positions[position]));
  const normalized = hidden.map(row => norm(row, firstNorm));
  const queries = normalized.map(row => linear(row, queryWeights));
  const keys = normalized.map(row => linear(row, keyWeights));
  const values = normalized.map(row => linear(row, valueWeights));
  return hidden.map((residual, position) => {
    const concatenated = [];
    for (let head = 0; head < heads; head++) {
      const offset = head * headWidth;
      const query = queries[position].slice(offset, offset + headWidth);
      const scores = keys.slice(0, position + 1).map(key =>
        dot(query, key.slice(offset, offset + headWidth)).mul(1 / Math.sqrt(headWidth)));
      const weights = softmax(scores);
      for (let coordinate = 0; coordinate < headWidth; coordinate++) {
        concatenated.push(sum(weights.map((weight, source) =>
          weight.mul(values[source][offset + coordinate]))));
      }
    }
    const afterAttention = add(residual, linear(concatenated, outputWeights));
    const expanded = linear(norm(afterAttention, secondNorm), expandWeights).map(value => value.relu());
    const afterMlp = add(afterAttention, linear(expanded, contractWeights));
    return linear(norm(afterMlp, finalNorm), embeddings);
  });
};

const prefix = ids.slice(0, context);
const original = forward(prefix)[0].map(value => value.data);
const changedFuture = [...prefix];
changedFuture[context - 1] = (changedFuture[context - 1] + 1) % vocabulary.length;
const causalError = Math.max(...forward(changedFuture)[0].map((value, index) => Math.abs(value.data - original[index])));
console.log({ parameters: parameters.length, vocabulary: vocabulary.length, causalError });

const firstMoment = parameters.map(() => 0), secondMoment = parameters.map(() => 0);
for (let step = 1; step <= 12; step++) {
  const start = Math.floor(random() * (ids.length - context));
  const logits = forward(ids.slice(start, start + context));
  const losses = logits.map((row, position) => {
    const maximum = Math.max(...row.map(value => value.data));
    const logNormalizer = sum(row.map(value => value.add(-maximum).exp())).log().add(maximum);
    return logNormalizer.add(row[ids[start + position + 1]].mul(-1));
  });
  const loss = sum(losses).mul(1 / context);
  loss.backward();
  const gradientNorm = Math.hypot(...parameters.map(value => value.grad));
  const clip = Math.min(1, 1 / Math.max(gradientNorm, 1e-12));
  parameters.forEach((value, index) => {
    const gradient = value.grad * clip;
    firstMoment[index] = 0.9 * firstMoment[index] + 0.1 * gradient;
    secondMoment[index] = 0.999 * secondMoment[index] + 0.001 * gradient ** 2;
    const correctedMean = firstMoment[index] / (1 - 0.9 ** step);
    const correctedVariance = secondMoment[index] / (1 - 0.999 ** step);
    value.data -= 0.02 * correctedMean / (Math.sqrt(correctedVariance) + 1e-8);
  });
  if (step === 1 || step % 4 === 0) console.log({ step, trainingLoss: loss.data, gradientNorm });
}

const generated = [...'the '].map(token => vocabulary.indexOf(token));
for (let step = 0; step < 24; step++) {
  const logits = forward(generated.slice(-context)).at(-1);
  const probabilities = softmax(logits).map(value => value.data);
  let threshold = random(), selected = probabilities.length - 1;
  for (let index = 0; index < probabilities.length; index++) {
    threshold -= probabilities[index];
    if (threshold <= 0) { selected = index; break; }
  }
  generated.push(selected);
}
console.log('Tiny trained sample (not a pretrained assistant):', generated.map(id => vocabulary[id]).join(''));