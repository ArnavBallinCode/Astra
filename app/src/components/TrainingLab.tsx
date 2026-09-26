import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, SkipForward, Square } from 'lucide-react'
import type * as TensorFlow from '@tensorflow/tfjs'
import { Slider } from './Labs'

function makeDataset(kind: string) {
  if (kind === 'xor') return { inputs: [[-1, -1], [-1, 1], [1, -1], [1, 1]], labels: [[0], [1], [1], [0]] }
  const inputs: number[][] = [], labels: number[][] = []
  for (let index = 0; index < 120; index++) {
    const label = index % 2, angle = (index / 120) * Math.PI * 2, jitter = Math.sin(index * 73) * 0.07
    if (kind === 'circles') { const radius = (label ? 0.85 : 0.35) + jitter; inputs.push([Math.cos(angle) * radius, Math.sin(angle) * radius]) }
    else if (kind === 'spirals') { const radius = 0.1 + 0.85 * index / 120; const phase = radius * 5 + label * Math.PI; inputs.push([radius * Math.cos(phase), radius * Math.sin(phase)]) }
    else { const phase = (index / 120) * Math.PI; inputs.push([(Math.cos(phase) + label * 0.8 - 0.4) * 0.7, (Math.sin(phase) * (label ? -1 : 1) + label * 0.4 - 0.2 + jitter) * 0.8]) }
    labels.push([label])
  }
  return { inputs, labels }
}

export default function TrainingLab({ onPractice }: { onPractice: () => void }) {
  const [dataset, setDataset] = useState('xor'), [units, setUnits] = useState(6), [layers, setLayers] = useState(1), [rate, setRate] = useState(0.03), [activation, setActivation] = useState<'tanh' | 'relu' | 'sigmoid'>('tanh'), [optimizer, setOptimizer] = useState('adam')
  const [epoch, setEpoch] = useState(0), [losses, setLosses] = useState<number[]>([]), [accuracy, setAccuracy] = useState(0), [boundary, setBoundary] = useState<number[]>([]), [running, setRunning] = useState(false), [error, setError] = useState('')
  const model = useRef<TensorFlow.Sequential | null>(null), trainer = useRef<TensorFlow.Optimizer | null>(null), stop = useRef(false), mounted = useRef(true), busy = useRef(false)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; stop.current = true; if (!busy.current) { model.current?.dispose(); trainer.current?.dispose(); model.current = null; trainer.current = null } } }, [])
  const reset = () => { model.current?.dispose(); trainer.current?.dispose(); model.current = null; trainer.current = null; setEpoch(0); setLosses([]); setBoundary([]); setAccuracy(0) }
  const data = makeDataset(dataset)
  const train = async (iterations: number) => {
    if (busy.current) return
    busy.current = true; stop.current = false; setRunning(true); setError('')
    let inputs: TensorFlow.Tensor2D | undefined, labels: TensorFlow.Tensor2D | undefined
    try {
      const tensorflow = await import('@tensorflow/tfjs')
      await tensorflow.ready()
      if (!mounted.current) return
      if (!model.current) {
        const network = tensorflow.sequential()
        for (let index = 0; index < layers; index++) network.add(tensorflow.layers.dense({ units, activation, ...(index === 0 ? { inputShape: [2] } : {}), kernelInitializer: tensorflow.initializers.glorotNormal({ seed: 42 + index }) }))
        network.add(tensorflow.layers.dense({ units: 1, activation: 'sigmoid', kernelInitializer: tensorflow.initializers.glorotNormal({ seed: 99 }) }))
        trainer.current = optimizer === 'adam' ? tensorflow.train.adam(rate) : tensorflow.train.sgd(rate)
        network.compile({ optimizer: trainer.current, loss: 'binaryCrossentropy', metrics: ['accuracy'] }); model.current = network
      }
      inputs = tensorflow.tensor2d(data.inputs); labels = tensorflow.tensor2d(data.labels)
      for (let iteration = 0; iteration < iterations && !stop.current; iteration++) {
        const history = await model.current.fit(inputs, labels, { epochs: 1, batchSize: data.inputs.length, shuffle: false, verbose: 0 })
        if (!mounted.current) break
        setEpoch(previous => previous + 1); setLosses(previous => [...previous, Number(history.history.loss[0])]); setAccuracy(Number(history.history.acc[0])); onPractice()
        if (iteration % 5 === 0 || iteration === iterations - 1) {
          const grid = Array.from({ length: 900 }, (_, index) => [-1.2 + (index % 30) / 29 * 2.4, 1.2 - Math.floor(index / 30) / 29 * 2.4])
          const predictions = tensorflow.tidy(() => { const tensor = tensorflow.tensor2d(grid); return Array.from((model.current!.predict(tensor) as TensorFlow.Tensor).dataSync()) })
          setBoundary(predictions); await tensorflow.nextFrame()
        }
      }
    } catch (cause) { if (mounted.current) setError(cause instanceof Error ? cause.message : 'Training failed') }
    finally { inputs?.dispose(); labels?.dispose(); busy.current = false; if (mounted.current) setRunning(false); else { model.current?.dispose(); trainer.current?.dispose(); model.current = null; trainer.current = null } }
  }
  return <div className="generic-lab training-lab"><div className="lab-action-row"><span className="lab-label"><span className="live-dot" /> LOCAL TENSORFLOW.JS TRAINING</span><span className="shape-badge">2 → {Array.from({ length: layers }, () => units).join(' → ')} → 1</span></div><div className="two-column-lab"><div><svg viewBox="0 0 330 330" className="decision-boundary" role="img" aria-label={`Decision boundary after ${epoch} training epochs`}><rect width="330" height="330" fill="#eff1eb" />{boundary.map((probability, index) => <rect key={index} x={(index % 30) * 11} y={Math.floor(index / 30) * 11} width="11.1" height="11.1" fill={`rgb(${Math.round(235 - probability * 139)}, ${Math.round(179 + probability * 8)}, ${Math.round(150 + probability * 13)})`} />)}{data.inputs.map(([horizontal, vertical], index) => <circle key={index} cx={(horizontal + 1.2) / 2.4 * 330} cy={(1.2 - vertical) / 2.4 * 330} r={dataset === 'xor' ? 7 : 3.5} stroke="#fff" strokeWidth="1.3" fill={data.labels[index][0] ? '#17654e' : '#b66448'} />)}</svg><div className="result-pair"><span>Epoch<strong>{epoch}</strong></span><span>Loss<strong>{losses.at(-1)?.toFixed(4) ?? '—'}</strong></span><span>Training accuracy<strong>{epoch ? `${(accuracy * 100).toFixed(0)}%` : '—'}</strong></span></div></div><div><fieldset disabled={running}><label className="field-label">Dataset<select value={dataset} onChange={event => { reset(); setDataset(event.target.value) }}><option value="xor">XOR · 4 examples</option><option value="circles">Circles · 120 examples</option><option value="moons">Moons · 120 examples</option><option value="spirals">Spirals · 120 examples</option></select></label><Slider label="Hidden neurons" value={units} min={2} max={16} step={1} onChange={value => { reset(); setUnits(value) }} /><Slider label="Hidden layers" value={layers} min={1} max={3} step={1} onChange={value => { reset(); setLayers(value) }} /><Slider label="Learning rate" value={rate} min={0.005} max={0.1} step={0.005} onChange={value => { reset(); setRate(value) }} /><div className="two-column-lab"><label className="field-label">Activation<select value={activation} onChange={event => { reset(); setActivation(event.target.value as typeof activation) }}><option>tanh</option><option>relu</option><option>sigmoid</option></select></label><label className="field-label">Optimizer<select value={optimizer} onChange={event => { reset(); setOptimizer(event.target.value) }}><option value="adam">Adam</option><option value="sgd">SGD</option></select></label></div></fieldset><div className="lab-action-row"><button className="primary-button" onClick={() => running ? (stop.current = true) : void train(100)}>{running ? <Square size={14} /> : <Play size={14} />}{running ? 'Stop' : 'Train 100 epochs'}</button><button className="icon-button" title="Train one iteration" aria-label="Train one iteration" disabled={running} onClick={() => void train(1)}><SkipForward size={17} /></button><button className="icon-button" title="Reset network" aria-label="Reset network" disabled={running} onClick={reset}><RotateCcw size={16} /></button></div>{losses.length > 1 && <svg className="training-loss" viewBox="0 0 250 75" role="img" aria-label="Training loss history"><path fill="none" stroke="#328568" strokeWidth="2" d={losses.map((value, index) => `${index ? 'L' : 'M'}${index / Math.max(1, losses.length - 1) * 250},${70 - Math.min(1, value / Math.max(...losses)) * 65}`).join(' ')} /></svg>}</div></div>{error && <p className="error-message" role="alert">{error}</p>}<p className="lab-note">Actual forward passes, binary cross entropy, automatic differentiation, and optimizer updates. Full-batch training; accuracy is measured on training examples, not a held-out test set.</p></div>
}