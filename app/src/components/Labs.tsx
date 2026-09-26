import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Check, ChevronRight, Eye, Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import type { LabKind } from '../data/curriculum'
import { activate, attention, convolve, cosine, dot, lossGradient, lossSurface, neuron, neuronGradients, optimizerStep, softmax } from '../lib/math'
import type { Activation } from '../lib/math'

const TrainingLab = lazy(() => import('./TrainingLab'))
type Props = { onPractice: () => void }
const format = (value: number) => Number.isFinite(value) ? value.toFixed(3) : '-inf'

export function Slider({ label, value, onChange, min = -2, max = 2, step = 0.05 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return <label className="slider-control"><span>{label}<output>{Number.isInteger(step) ? value : value.toFixed(2)}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>
}

function Internal({ children }: { children: React.ReactNode }) {
  return <details className="internal"><summary><Eye size={15} /> Show internal computation <ChevronRight size={15} /></summary><div className="internal-content">{children}</div></details>
}

export function NeuronLab({ onPractice }: Props) {
  const [inputs, setInputs] = useState([0.7, 0.2, 0.9])
  const [weights, setWeights] = useState([0.4, -0.7, 0.2])
  const [bias, setBias] = useState(0.1)
  const [activation, setActivation] = useState<Activation>('sigmoid')
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const result = neuron(inputs, weights, bias, activation)
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setStage(previous => {
      if (previous >= 4) { setPlaying(false); return 4 }
      return previous + 1
    }), 650)
    return () => clearInterval(timer)
  }, [playing])
  const reset = () => { setInputs([0.7, 0.2, 0.9]); setWeights([0.4, -0.7, 0.2]); setBias(0.1); setStage(0); setPlaying(false); setActivation('sigmoid') }
  return <div className="neuron-lab">
    <div className="lab-toolbar"><span className="lab-label"><span className="live-dot" /> NEURON PLAYGROUND</span><div className="toolbar-actions"><span className="shape-badge">3 inputs · 1 neuron</span><button className="icon-button" onClick={reset} title="Reset neuron" aria-label="Reset neuron"><RotateCcw size={15} /></button></div></div>
    <div className="neuron-workspace">
      <div className="neuron-diagram">
        <div className="diagram-caption"><span>INPUTS</span><span>WEIGHTED SUM</span><span>ACTIVATION</span><span>OUTPUT</span></div>
        <svg viewBox="0 0 760 300" role="img" aria-label={`Neuron: weighted sum ${format(result.weightedSum)}, ${activation} output ${format(result.output)}`}>
          <defs><pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.7" fill="#ffffff" opacity="0.09" /></pattern><filter id="node-glow"><feGaussianBlur stdDeviation="3" /></filter></defs>
          <rect width="760" height="300" fill="url(#dots)" />
          {inputs.map((value, index) => {
            const vertical = 60 + index * 90
            return <g key={index}>
              <path className={stage >= 1 ? 'signal-line active' : 'signal-line'} d={`M 115 ${vertical} C 205 ${vertical}, 238 150, 325 150`} stroke={weights[index] >= 0 ? '#66d6b1' : '#eaa9a4'} strokeWidth={1.3 + Math.abs(weights[index]) * 1.7} fill="none" />
              <circle cx="85" cy={vertical} r="29" fill="#233832" stroke="#68c4a5" strokeWidth="1.2" />
              <text x="85" y={vertical + 5} textAnchor="middle" fill="#edfff7" fontSize="15" fontFamily="monospace">{value.toFixed(1)}</text>
              <text x="34" y={vertical + 4} fill="#a5b4ac" fontSize="12">x{index + 1}</text>
              <rect x="174" y={vertical - 15} width="72" height="27" rx="5" fill="#252e2b" stroke="#46504b" />
              <text x="210" y={vertical + 3} textAnchor="middle" fill={weights[index] >= 0 ? '#a5e7ce' : '#eaa9a4'} fontSize="12" fontFamily="monospace">w{index + 1} {weights[index].toFixed(1)}</text>
            </g>
          })}
          <path className={stage >= 2 ? 'signal-line active' : 'signal-line'} d="M 379 150 L 478 150" stroke="#79d0b1" strokeWidth="2" />
          <path className={stage >= 3 ? 'signal-line active' : 'signal-line'} d="M 554 150 L 654 150" stroke="#79d0b1" strokeWidth="2" />
          <circle cx="352" cy="150" r="33" fill="#2a4037" stroke={stage >= 2 ? '#b9ff9d' : '#70bf9f'} strokeWidth="1.5" />
          <text x="352" y="160" textAnchor="middle" fill="#c1f2d6" fontSize="29">Σ</text>
          <path d="M 352 223 L 352 187" stroke="#85968d" strokeDasharray="3 4" />
          <rect x="315" y="224" width="74" height="26" rx="5" fill="#31352c" stroke="#727a55" />
          <text x="352" y="241" textAnchor="middle" fill="#dedfb5" fontSize="12">b = {bias.toFixed(1)}</text>
          <text x="426" y="134" textAnchor="middle" fill="#b9c7bf" fontSize="12">{format(result.weightedSum)}</text>
          <rect x="478" y="115" width="76" height="70" rx="9" fill="#283b31" stroke={stage >= 3 ? '#b9ff9d' : '#6b8d77'} />
          <path d={Array.from({ length: 41 }, (_, index) => { const horizontal = -4 + index / 5; return `${index ? 'L' : 'M'}${489 + index * 1.35},${170 - Math.min(1, Math.max(0, activate(horizontal, activation))) * 40}` }).join(' ')} stroke="#bce599" strokeWidth="2" fill="none" />
          <text x="516" y="210" textAnchor="middle" fill="#aebfb3" fontSize="12">{activation}</text>
          <circle cx="680" cy="150" r="34" fill={stage >= 4 ? '#c4f19e' : '#bde797'} />
          <text x="680" y="156" textAnchor="middle" fill="#213a24" fontSize="17" fontWeight="600" fontFamily="monospace">{result.output.toFixed(2)}</text>
          <text x="680" y="211" textAnchor="middle" fill="#c1d4bf" fontSize="12">prediction</text>
        </svg>
        <div className="diagram-footer"><span><i className="legend-dot green" /> Positive weight <i className="legend-dot coral" /> Negative weight</span><span>z = <strong data-testid="weighted-sum">{result.weightedSum.toFixed(2)}</strong></span></div>
      </div>
      <div className="neuron-settings"><h4>Make it your neuron</h4><p>Small changes. Different decisions.</p><label className="field-label">Activation function<select value={activation} onChange={event => { setActivation(event.target.value as Activation); onPractice() }}>{(['sigmoid', 'tanh', 'relu', 'leaky-relu', 'elu', 'gelu', 'silu', 'linear'] as Activation[]).map(kind => <option key={kind} value={kind}>{kind === 'relu' ? 'ReLU' : kind.charAt(0).toUpperCase() + kind.slice(1)}</option>)}</select></label>{weights.map((weight, index) => <Slider key={index} label={`Weight ${index + 1}`} value={weight} onChange={value => { setWeights(previous => previous.map((entry, column) => column === index ? value : entry)); onPractice() }} />)}<Slider label="Bias" value={bias} onChange={value => { setBias(value); onPractice() }} /></div>
    </div>
    <div className="lab-bottom"><div className="input-editors">{inputs.map((value, index) => <label key={index}>x{index + 1}<input type="number" step="0.1" min="-5" max="5" aria-label={`Input ${index + 1}`} value={value} onChange={event => { const next = Number(event.target.value); setInputs(inputs.map((entry, column) => column === index ? Math.max(-5, Math.min(5, next)) : entry)); onPractice() }} /></label>)}</div><div className="toolbar-actions"><button className="text-button" onClick={() => { setStage(previous => Math.min(previous + 1, 4)); onPractice() }}><SkipForward size={15} /> Step</button><button className="primary-button" onClick={() => { if (playing) setPlaying(false); else { setStage(0); setPlaying(true); onPractice() } }}>{playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause' : 'Forward pass'}</button></div></div>
    <Internal><div className="calculation-steps">{result.products.map((product, index) => <div key={index}><span>Multiply {index + 1}</span><code>{inputs[index].toFixed(2)} × {weights[index].toFixed(2)} = {product.toFixed(4)}</code></div>)}<div><span>Add bias</span><code>{result.products.map(format).join(' + ')} + {bias.toFixed(2)} = {format(result.weightedSum)}</code></div><div><span>Apply {activation}</span><code>{activation}({format(result.weightedSum)}) = {result.output.toFixed(6)}</code></div></div></Internal>
  </div>
}

function VectorLab({ onPractice }: Props) {
  const [left, setLeft] = useState([2, 1]), [right, setRight] = useState([1, 3])
  const dragging = useRef<number | null>(null)
  const change = (index: number, values: number[]) => { (index ? setRight : setLeft)(values); onPractice() }
  return <div className="generic-lab two-column-lab"><svg className="coordinate-plot" viewBox="0 0 400 360" aria-label="Draggable two-dimensional vectors" onPointerMove={event => { if (dragging.current === null) return; const bounds = event.currentTarget.getBoundingClientRect(); change(dragging.current, [Math.round(((event.clientX - bounds.left) / bounds.width * 400 - 200) / 32 * 10) / 10, Math.round((180 - (event.clientY - bounds.top) / bounds.height * 360) / 32 * 10) / 10]) }} onPointerUp={() => { dragging.current = null }} onPointerCancel={() => { dragging.current = null }}>
    {Array.from({ length: 11 }, (_, index) => <g key={index}><line x1={40 + index * 32} y1="20" x2={40 + index * 32} y2="340" className="gridline" /><line x1="40" y1={20 + index * 32} x2="360" y2={20 + index * 32} className="gridline" /></g>)}<line x1="15" x2="385" y1="180" y2="180" className="axis" /><line x1="200" x2="200" y1="10" y2="350" className="axis" />
    {[left, right].map((vector, index) => <g key={index}><line x1="200" y1="180" x2={200 + vector[0] * 32} y2={180 - vector[1] * 32} stroke={index ? '#e49778' : '#23876d'} strokeWidth="3" /><circle cx={200 + vector[0] * 32} cy={180 - vector[1] * 32} r="9" fill={index ? '#e49778' : '#23876d'} style={{ cursor: 'grab' }} onPointerDown={event => { dragging.current = index; event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId) }} /><text x={210 + vector[0] * 32} y={170 - vector[1] * 32} className="plot-label">{index ? 'b' : 'a'}</text></g>)}
    </svg><div><h3>Direction meets magnitude</h3>{[left, right].map((vector, index) => <div key={index}>{vector.map((value, axis) => <Slider key={axis} label={`${index ? 'b' : 'a'}${axis + 1}`} value={value} min={-4} max={4} step={0.1} onChange={next => change(index, vector.map((entry, dimension) => dimension === axis ? next : entry))} />)}</div>)}<div className="result-pair"><span>Dot product <strong>{format(dot(left, right))}</strong></span><span>Cosine similarity <strong>{Math.hypot(...left) && Math.hypot(...right) ? format(cosine(left, right)) : 'undefined'}</strong></span></div></div></div>
}

function MatrixLab({ onPractice }: Props) {
  const [matrix, setMatrix] = useState([1, 2, 3, 4]), [vector, setVector] = useState([2, 1]), [row, setRow] = useState(0)
  const output = [dot(matrix.slice(0, 2), vector), dot(matrix.slice(2), vector)]
  return <div className="generic-lab"><div className="matrix-equation"><div className="editable-matrix">{matrix.map((value, index) => <input aria-label={`Matrix row ${Math.floor(index / 2) + 1} column ${index % 2 + 1}`} key={index} type="number" value={value} onChange={event => { setMatrix(matrix.map((entry, column) => column === index ? Number(event.target.value) : entry)); onPractice() }} className={Math.floor(index / 2) === row ? 'selected' : ''} />)}</div><span>×</span><div className="editable-vector">{vector.map((value, index) => <input aria-label={`Vector component ${index + 1}`} key={index} type="number" value={value} onChange={event => { setVector(vector.map((entry, column) => column === index ? Number(event.target.value) : entry)); onPractice() }} />)}</div><span>=</span><div className="matrix-result">{output.map((value, index) => <button className={index === row ? 'selected' : ''} key={index} onClick={() => { setRow(index); onPractice() }}>{format(value)}</button>)}</div></div><div className="formula-strip">Row {row + 1}: ({matrix[row * 2]} × {vector[0]}) + ({matrix[row * 2 + 1]} × {vector[1]}) = <strong>{output[row]}</strong></div><p className="lab-note">A (2 × 2) transformation maps a (2 × 1) vector to a (2 × 1) result. Select an output to inspect its dot product.</p></div>
}

function GradientLab({ onPractice }: Props) {
  const [position, setPosition] = useState(3.5), [rate, setRate] = useState(0.1), [momentum, setMomentum] = useState(0), [velocity, setVelocity] = useState(0), [path, setPath] = useState<number[]>([])
  const point = (value: number) => `${250 + value * 48},${290 - lossSurface(value) * 24}`
  const step = () => { const next = optimizerStep(position, rate, velocity, momentum); setPath([...path, position]); setPosition(Math.max(-4.8, Math.min(4.8, next.position))); setVelocity(next.velocity); onPractice() }
  return <div className="generic-lab two-column-lab"><div><svg className="loss-plot" viewBox="0 0 500 320" role="img" aria-label="Loss curve and gradient descent trajectory">{[1, 3, 5, 7, 9].map(value => <g key={value}><line x1="20" x2="480" y1={290 - value * 24} y2={290 - value * 24} className="gridline" /><text x="4" y={294 - value * 24} className="plot-label">{value}</text></g>)}<path d={Array.from({ length: 101 }, (_, index) => `${index ? 'L' : 'M'}${point(-4.8 + index * 0.096)}`).join(' ')} stroke="#318c71" fill="none" strokeWidth="3" />{path.map((value, index) => <circle key={index} cx={250 + value * 48} cy={290 - lossSurface(value) * 24} r="3" fill="#dda080" />)}<line x1={250 + (position - 0.65) * 48} x2={250 + (position + 0.65) * 48} y1={290 - (lossSurface(position) - 0.65 * lossGradient(position)) * 24} y2={290 - (lossSurface(position) + 0.65 * lossGradient(position)) * 24} stroke="#e49778" strokeWidth="2" /><circle cx={250 + position * 48} cy={290 - lossSurface(position) * 24} r="8" fill="#28775f" stroke="#fff" strokeWidth="3" /></svg><div className="formula-strip">L(θ) = 0.35θ² + sin(2θ) + 1.6</div></div><div><h3>Every step has a direction</h3><Slider label="Position" value={position} min={-4.5} max={4.5} onChange={value => { setPosition(value); setPath([]); setVelocity(0); onPractice() }} /><Slider label="Learning rate" value={rate} min={0.01} max={0.9} step={0.01} onChange={setRate} /><Slider label="Momentum" value={momentum} min={0} max={0.95} onChange={setMomentum} /><div className="result-pair"><span>Loss<strong>{format(lossSurface(position))}</strong></span><span>Gradient<strong>{format(lossGradient(position))}</strong></span></div><button className="primary-button" onClick={step}><SkipForward size={15} /> Take one step</button><p className="lab-note">Position is bounded to the plotted interval [-4.8, 4.8]. {path.length} steps taken.</p></div></div>
}

function ProbabilityLab({ onPractice }: Props) {
  const [logits, setLogits] = useState([2, 1, 0]), [temperature, setTemperature] = useState(1)
  const probabilities = softmax(logits, temperature), entropy = -probabilities.reduce((sum, value) => sum + (value ? value * Math.log(value) : 0), 0)
  return <div className="generic-lab two-column-lab"><div className="probability-bars">{probabilities.map((value, index) => <div key={index}><span>Class {index + 1}</span><div className="bar-track"><div style={{ width: `${value * 100}%`, background: ['#418f73', '#e2a285', '#94a8bf'][index] }} /></div><strong>{(value * 100).toFixed(1)}%</strong></div>)}<div className="result-pair"><span>Entropy<strong>{format(entropy)} nats</strong></span><span>Cross entropy, class 1<strong>{format(-Math.log(probabilities[0]))}</strong></span></div></div><div>{logits.map((value, index) => <Slider key={index} label={`Logit ${index + 1}`} value={value} min={-5} max={5} onChange={next => { setLogits(logits.map((entry, column) => column === index ? next : entry)); onPractice() }} />)}<Slider label="Temperature" value={temperature} min={0.1} max={3} onChange={value => { setTemperature(value); onPractice() }} /></div></div>
}

function BackpropLab({ onPractice }: Props) {
  const [weight, setWeight] = useState(0.4), [target, setTarget] = useState(1), [step, setStep] = useState(0)
  const result = neuronGradients([0.7, 0.2, 0.9], [weight, -0.7, 0.2], 0.1, target)
  return <div className="generic-lab"><div className="computation-flow">{[['Inputs', '0.7, 0.2, 0.9'], ['Weighted sum', format(neuron([0.7, 0.2, 0.9], [weight, -0.7, 0.2], 0.1).weightedSum)], ['Sigmoid', format(result.output)], ['Squared error', format(result.loss)]].map(([label, value], index) => <div className={3 - index <= step ? 'flow-node active' : 'flow-node'} key={label}><small>{label}</small><strong>{value}</strong>{index < 3 && <ArrowRight className="flow-arrow" size={18} />}</div>)}</div><div className="gradient-chain"><span>∂L/∂w₁</span><span>=</span><span className={step >= 0 ? 'highlight' : ''}>{format(result.upstream)}<small>2(y − target)</small></span><span>×</span><span className={step >= 1 ? 'highlight' : ''}>{format(result.local)}<small>y(1 − y)</small></span><span>×</span><span className={step >= 2 ? 'highlight' : ''}>0.700<small>x₁</small></span><span>=</span><strong>{format(result.weights[0])}</strong></div><div className="two-column-lab"><Slider label="Weight 1" value={weight} onChange={value => { setWeight(value); onPractice() }} /><Slider label="Target" value={target} min={0} max={1} onChange={setTarget} /></div><div className="lab-action-row"><button className="secondary-button" onClick={() => { setStep(previous => (previous + 1) % 4); onPractice() }}><SkipForward size={15} /> Trace gradient backward</button><button className="primary-button" onClick={() => { setWeight(previous => previous - 0.1 * result.weights[0]); onPractice() }}>Update weight <ArrowRight size={15} /></button></div><p className="lab-note">Learning rate = 0.1. Gradients are exact derivatives of the displayed squared error.</p></div>
}

function ConvolutionLab({ onPractice }: Props) {
  const image = [[0, 0, 1, 1, 0], [0, 1, 1, 1, 0], [0, 1, 0, 1, 0], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]]
  const [position, setPosition] = useState(0), [kind, setKind] = useState('edge')
  const kernels: Record<string, number[][]> = { edge: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], sharpen: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], blur: [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]] }
  const kernel = kernels[kind], row = Math.floor(position / 3), column = position % 3, result = convolve(image, kernel, row, column)
  return <div className="generic-lab"><div className="lab-action-row"><label className="field-label">Kernel<select value={kind} onChange={event => { setKind(event.target.value); onPractice() }}><option value="edge">Vertical edge</option><option value="sharpen">Sharpen</option><option value="blur">Box blur</option></select></label><button className="primary-button" onClick={() => { setPosition((position + 1) % 9); onPractice() }}><SkipForward size={15} /> Move kernel</button></div><div className="convolution-grids"><div><h4>Input · 5 × 5</h4><div className="pixel-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>{image.flatMap((values, vertical) => values.map((value, horizontal) => <span key={`${vertical}-${horizontal}`} className={vertical >= row && vertical < row + 3 && horizontal >= column && horizontal < column + 3 ? 'in-kernel' : ''} style={{ backgroundColor: value ? '#8ebfa6' : '#e7eee8' }}>{value}</span>))}</div></div><span>×</span><div><h4>Kernel · 3 × 3</h4><div className="pixel-grid">{kernel.flat().map((value, index) => <span key={index}>{format(value)}</span>)}</div></div><ArrowRight size={22} /><div><h4>Feature map · 3 × 3</h4><div className="pixel-grid">{Array.from({ length: 9 }, (_, index) => <button className={position === index ? 'selected' : ''} key={index} onClick={() => { setPosition(index); onPractice() }}>{format(convolve(image, kernel, Math.floor(index / 3), index % 3).value)}</button>)}</div></div></div><Internal><p>{result.products.map(format).join(' + ')} = <strong>{format(result.value)}</strong></p><p>Output row {row + 1}, column {column + 1}. Stride 1, no padding, one channel.</p></Internal></div>
}

function MemoryLab({ onPractice }: Props) {
  const [forget, setForget] = useState(0.9), [input, setInput] = useState(0.2), [output, setOutput] = useState(0.7), [old, setOld] = useState(0.8), [candidate, setCandidate] = useState(-0.5), [length, setLength] = useState(10)
  const cell = forget * old + input * candidate, hidden = output * Math.tanh(cell)
  const slider = (label: string, value: number, setter: (value: number) => void, min = 0, max = 1) => <Slider label={label} value={value} min={min} max={max} onChange={next => { setter(next); onPractice() }} />
  return <div className="generic-lab"><div className="memory-track"><div><small>Old memory</small><strong>{format(old)}</strong></div><span>× {forget.toFixed(2)}</span><ArrowRight /><div className="active"><small>New cell state</small><strong>{format(cell)}</strong></div><span>tanh × {output.toFixed(2)}</span><ArrowRight /><div><small>Hidden state</small><strong>{format(hidden)}</strong></div></div><div className="three-column-lab">{slider('Forget gate', forget, setForget)}{slider('Input gate', input, setInput)}{slider('Output gate', output, setOutput)}{slider('Previous cell', old, setOld, -2, 2)}{slider('Candidate state', candidate, setCandidate, -1, 1)}<Slider label="Sequence length" value={length} min={1} max={100} step={1} onChange={value => { setLength(value); onPractice() }} /></div><div className="formula-strip">c = {format(forget * old)} + {format(input * candidate)} = {format(cell)}<br />Direct cell-path gradient across {length} constant gates: {forget.toFixed(2)}<sup>{length}</sup> = {(forget ** length).toExponential(3)}</div><p className="lab-note">This isolates the direct cell-state path with fixed gates. A complete LSTM also has gradient paths through the learned gates.</p></div>
}

function TokenizerLab({ onPractice }: Props) {
  const [text, setText] = useState('The cat is sleeping.'), [mode, setMode] = useState('words'), [merges, setMerges] = useState<string[][]>([]), [units, setUnits] = useState<string[][] | null>(null)
  const base = text.toLowerCase().match(/\w+|[^\s\w]/g) ?? []
  const tokens = mode === 'characters' ? [...text] : mode === 'bpe' ? (units ?? base.map(word => [...word])).flat() : base
  const vocabulary = [...new Set(tokens)]
  const merge = () => {
    const words = units ?? base.map(word => [...word]), counts = new Map<string, number>()
    words.forEach(word => word.slice(0, -1).forEach((symbol, index) => { const pair = JSON.stringify([symbol, word[index + 1]]); counts.set(pair, (counts.get(pair) ?? 0) + 1) }))
    const best = [...counts].sort((left, right) => right[1] - left[1])[0]
    if (!best) return
    const [left, right] = JSON.parse(best[0]) as string[]
    setUnits(words.map(word => { const next: string[] = []; for (let index = 0; index < word.length; index++) { if (word[index] === left && word[index + 1] === right) { next.push(left + right); index++ } else next.push(word[index]) } return next }))
    setMerges([...merges, [left, right]]); onPractice()
  }
  return <div className="generic-lab"><label className="field-label">Text<textarea value={text} maxLength={300} onChange={event => { setText(event.target.value); setUnits(null); setMerges([]); onPractice() }} /></label><div className="lab-action-row"><div className="segmented">{['words', 'characters', 'bpe'].map(kind => <button className={mode === kind ? 'active' : ''} key={kind} onClick={() => { setMode(kind); onPractice() }}>{kind === 'bpe' ? 'Toy BPE' : kind}</button>)}</div>{mode === 'bpe' && <button className="primary-button" onClick={merge} disabled={!!units && units.every(word => word.length <= 1)}><SkipForward size={15} /> Merge most frequent pair</button>}</div><div className="token-stream">{tokens.map((token, index) => <div key={index} className={`token token-${index % 4}`}><span>{token === ' ' ? 'space' : token}</span><small>ID {vocabulary.indexOf(token)}</small></div>)}</div><p className="lab-note">{tokens.length} tokens · {vocabulary.length} unique IDs. IDs are local to this toy vocabulary, not GPT token IDs.</p>{merges.length > 0 && <div className="formula-strip">Merge history: {merges.map(pair => `${pair[0]} + ${pair[1]} → ${pair.join('')}`).join(' · ')}</div>}</div>
}

const toyEmbeddings: Record<string, number[]> = { The: [1, 0], cat: [0.2, 1], sat: [0.8, 0.6], dog: [0.4, 0.9], slept: [0.6, 0.8] }
export function AttentionLab({ onPractice }: Props) {
  const [tokens, setTokens] = useState(['The', 'cat', 'sat']), [causal, setCausal] = useState(true), [selected, setSelected] = useState([1, 0]), [scale, setScale] = useState(1)
  const embeddings = tokens.map(token => toyEmbeddings[token]), queries = embeddings.map(vector => [vector[0] * scale, vector[1] * scale]), keys = embeddings, values = embeddings.map(vector => [vector[0] * 2, vector[1] * 3])
  const result = attention(queries, keys, values, causal), [row, column] = selected
  return <div className="generic-lab"><div className="lab-action-row"><div className="token-selects">{tokens.map((token, index) => <select key={index} aria-label={`Token ${index + 1}`} value={token} onChange={event => { setTokens(tokens.map((value, position) => position === index ? event.target.value : value)); onPractice() }}>{Object.keys(toyEmbeddings).map(word => <option key={word}>{word}</option>)}</select>)}</div><label className="checkbox-label"><input type="checkbox" checked={causal} onChange={event => { setCausal(event.target.checked); onPractice() }} /> Causal mask</label></div><div className="two-column-lab"><div className="attention-grid" style={{ gridTemplateColumns: '65px repeat(3, 1fr)' }}><span>Q ↓ K →</span>{tokens.map((token, index) => <strong key={index}>{token}</strong>)}{result.weights.map((weights, vertical) => <div className="matrix-row" key={vertical}><strong>{tokens[vertical]}</strong>{weights.map((weight, horizontal) => <button key={horizontal} title={`Query ${tokens[vertical]}, key ${tokens[horizontal]}: ${format(weight)}`} className={row === vertical && column === horizontal ? 'inspected' : ''} style={{ background: `rgba(49, 139, 105, ${0.07 + weight * 0.7})` }} onClick={() => { setSelected([vertical, horizontal]); onPractice() }}>{causal && horizontal > vertical ? 'masked' : weight.toFixed(3)}</button>)}</div>)}</div><div><h3>Inspect a relationship</h3><p><strong>{tokens[row]}</strong> queries <strong>{tokens[column]}</strong></p><div className="formula-strip">Q = [{queries[row].map(format).join(', ')}]<br />K = [{keys[column].map(format).join(', ')}]<br />Q · K / √2 = {format(result.scores[row][column])}<br />Attention weight = {format(result.weights[row][column])}</div><Slider label="Query scale" value={scale} min={0.1} max={4} onChange={value => { setScale(value); onPractice() }} /></div></div><Internal><p>Toy embeddings use 2 dimensions. WQ = scale × I, WK = I, WV = diag(2, 3). These fixed projections demonstrate the operation, not a pretrained language model.</p>{result.output.map((vector, index) => <div key={index} className="formula-strip">{tokens[index]} output = [{vector.map(format).join(', ')}]<br />{result.weights[index].map((weight, position) => `${format(weight)} × [${values[position].map(format).join(', ')}]`).join(' + ')}</div>)}</Internal></div>
}

export function GenerationLab({ onPractice }: Props) {
  const [temperature, setTemperature] = useState(1), [topK, setTopK] = useState(5), [generated, setGenerated] = useState<string[]>([])
  const words = ['sat', 'slept', 'ran', 'purred', 'jumped'], logits = [2.4, 1.8, 1.1, 0.6, -0.2]
  const probabilities = softmax(logits.map((value, index) => index < topK ? value : -Infinity), temperature)
  const sample = () => { const random = Math.random(); let accumulated = 0; const selected = probabilities.findIndex(value => { accumulated += value; return random < accumulated }); setGenerated([...generated, words[selected < 0 ? topK - 1 : selected]]); onPractice() }
  return <div className="generic-lab two-column-lab"><div><div className="generation-prompt">The cat <span>{generated.join(' ') || '...'}</span><span className="typing-cursor" /></div><div className="probability-bars">{probabilities.map((value, index) => <div key={index}><span>{words[index]}</span><div className="bar-track"><div style={{ width: `${value * 100}%` }} /></div><strong>{(value * 100).toFixed(1)}%</strong></div>)}</div><p className="lab-note">Fixed toy logits isolate decoding behavior. Repeated samples do not come from a trained autoregressive language model.</p></div><div><Slider label="Temperature" value={temperature} min={0.1} max={3} onChange={value => { setTemperature(value); onPractice() }} /><Slider label="Top-k" value={topK} min={1} max={5} step={1} onChange={value => { setTopK(value); onPractice() }} /><div className="lab-action-row"><button className="primary-button" onClick={sample} disabled={generated.length >= 20}><Play size={14} /> Sample a token</button><button className="icon-button" title="Clear tokens" aria-label="Clear tokens" onClick={() => setGenerated([])}><RotateCcw size={15} /></button></div></div></div>
}

function RagLab({ onPractice }: Props) {
  const [query, setQuery] = useState('How does attention use values?')
  const [documents, setDocuments] = useState('Attention compares queries and keys to weight values.\nBackpropagation computes gradients to update neural network weights.\nToken embeddings map token IDs to learned vectors.\nKV cache stores keys and values from earlier tokens.')
  const [retrieved, setRetrieved] = useState(false)
  const chunks = documents.split('\n').filter(Boolean), terms = [...new Set(`${query} ${documents}`.toLowerCase().match(/[a-z]+/g) ?? [])]
  const encode = (text: string) => { const words = text.toLowerCase().match(/[a-z]+/g) ?? []; return terms.map(term => words.filter(word => word === term).length) }
  const ranked = chunks.map((text, index) => ({ text, index, score: cosine(encode(query), encode(text)) })).sort((left, right) => right.score - left.score).slice(0, 3)
  return <div className="generic-lab"><label className="field-label">Source documents · one chunk per line<textarea rows={4} value={documents} maxLength={4000} onChange={event => { setDocuments(event.target.value); setRetrieved(false) }} /></label><div className="search-row"><input aria-label="Retrieval query" value={query} onChange={event => { setQuery(event.target.value); setRetrieved(false) }} /><button className="primary-button" onClick={() => { setRetrieved(true); onPractice() }}>Retrieve <ArrowRight size={15} /></button></div>{retrieved && <div className="retrieval-results">{ranked.map(result => <div key={result.index}><span>Source {result.index + 1} <strong>{result.score.toFixed(3)}</strong></span><p>{result.text}</p></div>)}<details><summary>Assembled context</summary><pre>{`Answer using only the sources below; say when evidence is missing.\n\n${ranked.filter(result => result.score > 0).map(result => `[${result.index + 1}] ${result.text}`).join('\n')}\n\nQuestion: ${query}`}</pre></details></div>}<p className="lab-note">Local bag-of-words cosine retrieval. This assembles a grounded prompt; no remote LLM is called and no answer is fabricated.</p></div>
}

function DiffusionLab({ onPractice }: Props) {
  const [noise, setNoise] = useState(0.35)
  const pixels = Array.from({ length: 256 }, (_, index) => { const horizontal = index % 16 - 7.5, vertical = Math.floor(index / 16) - 7.5; const clean = Math.hypot(horizontal, vertical) < 5 && Math.hypot(horizontal, vertical) > 2.4 ? 0.8 : -0.8; const uniform1 = Math.max(0.00001, (Math.sin(index * 127.1 + 31.7) * 43758.5453) % 1 + 1) % 1; const uniform2 = Math.abs(Math.sin(index * 269.5 + 17.2) * 43758.5453) % 1; const gaussian = Math.sqrt(-2 * Math.log(Math.max(0.00001, uniform1))) * Math.cos(2 * Math.PI * uniform2); const value = Math.sqrt(1 - noise) * clean + Math.sqrt(noise) * gaussian; return Math.max(0, Math.min(255, (value + 1) * 127.5)) })
  return <div className="generic-lab two-column-lab"><div className="diffusion-image" role="img" aria-label={`A ring image with ${Math.round(noise * 100)} percent noise variance`}>{pixels.map((value, index) => <span key={index} style={{ background: `rgb(${value}, ${value}, ${value})` }} />)}</div><div><h3>Structure becomes noise</h3><Slider label="Noise variance" value={noise} min={0} max={1} step={0.01} onChange={value => { setNoise(value); onPractice() }} /><p>The same fixed noise sample is mixed with a tiny ring image. At zero, the image is intact. At one, only noise remains.</p><div className="formula-strip">signal coefficient = {format(Math.sqrt(1 - noise))}<br />noise coefficient = {format(Math.sqrt(noise))}</div><p className="lab-note">Forward diffusion only. Moving the slider backward reveals the known clean image; it does not run a learned denoiser.</p></div></div>
}

export function CacheLab({ onPractice }: Props) {
  const [tokens, setTokens] = useState(4), [layers, setLayers] = useState(12), [precision, setPrecision] = useState(2)
  const bytes = 2 * layers * tokens * 12 * 64 * precision
  return <div className="generic-lab"><div className="cache-grid">{Array.from({ length: Math.min(tokens, 24) }, (_, index) => <div key={index} className={index === tokens - 1 ? 'new-token' : ''}><small>t{index + 1}</small><span>K{index + 1}</span><span>V{index + 1}</span>{index < tokens - 1 ? <Check size={12} /> : <span className="live-dot" />}</div>)}</div><div className="three-column-lab"><Slider label="Sequence tokens" value={tokens} min={1} max={2048} step={1} onChange={value => { setTokens(value); onPractice() }} /><Slider label="Transformer layers" value={layers} min={1} max={48} step={1} onChange={value => { setLayers(value); onPractice() }} /><label className="field-label">Cache precision<select value={precision} onChange={event => { setPrecision(Number(event.target.value)); onPractice() }}><option value={4}>FP32 · 4 bytes</option><option value={2}>FP16 / BF16 · 2 bytes</option><option value={1}>INT8 · 1 byte</option></select></label></div><div className="result-pair"><span>KV memory, one sequence<strong>{(bytes / 1024 ** 2).toFixed(2)} MiB</strong></span><span>Prior positions reused per layer<strong>{tokens - 1}</strong></span></div><button className="primary-button" disabled={tokens >= 2048} onClick={() => { setTokens(tokens + 1); onPractice() }}><SkipForward size={15} /> Decode next token</button><Internal><p>2 (K and V) × {layers} layers × {tokens} tokens × 12 KV heads × 64 dimensions × {precision} bytes = {bytes.toLocaleString()} bytes.</p><p>At most 24 cache entries are drawn. Quantization metadata and allocator overhead are excluded.</p></Internal></div>
}

const components: Record<Exclude<LabKind, 'training'>, React.ComponentType<Props>> = { neuron: NeuronLab, vectors: VectorLab, matrix: MatrixLab, gradient: GradientLab, probability: ProbabilityLab, backprop: BackpropLab, convolution: ConvolutionLab, memory: MemoryLab, tokenizer: TokenizerLab, attention: AttentionLab, generation: GenerationLab, rag: RagLab, diffusion: DiffusionLab, cache: CacheLab }
export default function Lab({ kind, onPractice }: Props & { kind: LabKind }) {
  if (kind === 'training') return <Suspense fallback={<div className="loading-state">Loading the training laboratory...</div>}><TrainingLab onPractice={onPractice} /></Suspense>
  const Component = components[kind]
  return <Component onPractice={onPractice} />
}

export function TokenTrace({ onPractice }: Props) {
  const [stage, setStage] = useState(0)
  const embedding = [0.2, 1], attended = attention([[0.2, 1]], [[1, 0], [0.2, 1]], [[2, 0], [0.4, 3]]).output[0]
  const residual = embedding.map((value, index) => value + attended[index])
  const mean = (residual[0] + residual[1]) / 2, variance = residual.reduce((sum, value) => sum + (value - mean) ** 2, 0) / 2
  const norm = residual.map(value => (value - mean) / Math.sqrt(variance + 1e-5)), ffn = norm.map(value => Math.max(0, value)), final = norm.map((value, index) => value + ffn[index])
  const logits = [dot(final, [0, 1]), dot(final, [1, 0]), dot(final, [0.5, 0.5])], probabilities = softmax(logits)
  const steps = [
    ['Token', 'cat', 'The second token in the toy prompt "The cat".'], ['Vocabulary lookup', 'ID = 1', 'The ID is an index, not a measurement.'], ['Embedding', `[${embedding.join(', ')}]`, 'Row 1 of our fixed two-dimensional embedding table.'], ['Q, K, V', 'Q = [0.2, 1]', 'WQ = WK = I. WV = diag(2, 3). The query sees both prior and current tokens.'], ['Attention output', `[${attended.map(format).join(', ')}]`, 'Scaled query-key scores, softmax weights, then a weighted sum of values.'], ['Residual + LayerNorm', `[${norm.map(format).join(', ')}]`, 'Add the original embedding, subtract the mean, and divide by standard deviation.'], ['FFN + residual', `[${final.map(format).join(', ')}]`, 'Toy FFN with identity matrices and ReLU, plus a residual path.'], ['LM head', `[${logits.map(format).join(', ')}]`, 'Three explicit output projections produce logits for sat, slept, and ran.'], ['Next-token probabilities', probabilities.map((value, index) => `${['sat', 'slept', 'ran'][index]} ${(value * 100).toFixed(1)}%`).join(' · '), 'Softmax normalizes the logits. These are computed toy probabilities, not pretrained predictions.'],
  ]
  return <div className="token-trace"><p className="eyebrow">ONE TOKEN. EVERY TRANSFORMATION.</p><h1>Follow the word <span className="accent-text">cat.</span></h1><p className="page-description">A numerical, single-head, two-dimensional teaching model. Fixed weights, no position encoding, one post-norm block.</p><div className="trace-controls"><button className="secondary-button" disabled={stage === 0} onClick={() => setStage(stage - 1)}>Previous</button><span>{stage + 1} / {steps.length}</span><button className="primary-button" disabled={stage === steps.length - 1} onClick={() => { setStage(stage + 1); onPractice() }}>Next operation <ArrowRight size={16} /></button></div><div className="trace-steps">{steps.map(([label, value, explanation], index) => <div key={label} className={`trace-step ${index === stage ? 'current' : ''} ${index > stage ? 'pending' : ''}`}><button onClick={() => { setStage(index); onPractice() }}><span>{String(index + 1).padStart(2, '0')}</span><h3>{label}</h3><code>{value}</code></button>{index === stage && <p>{explanation}</p>}{index < steps.length - 1 && <ArrowDown size={16} />}</div>)}</div></div>
}