import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Terminal, Download } from 'lucide-react'

export default function CodeLab({ initialCode, title, onRun }: { initialCode: string; title: string; onRun: () => void }) {
  const [code, setCode] = useState(initialCode), [output, setOutput] = useState<string[]>([]), [running, setRunning] = useState(false), [documentSource, setDocumentSource] = useState('')
  const frame = useRef<HTMLIFrameElement>(null), timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== 'astra-result') return
      setOutput(event.data.lines); setRunning(false); clearTimeout(timeout.current)
    }
    window.addEventListener('message', listener)
    return () => { window.removeEventListener('message', listener); clearTimeout(timeout.current) }
  }, [])
  const run = () => {
    if (running) return
    setRunning(true); setOutput([]); onRun()
    const workerSource = `self.onmessage = function(event) { const lines = []; const console = { log: (...values) => lines.push(values.map(value => typeof value === 'string' ? value : JSON.stringify(value, null, 2)).join(' ')) }; try { new Function('console', event.data)(console); self.postMessage(lines.length ? lines : ['Completed without output.']); } catch(error) { self.postMessage(['Error: ' + error.message]); } };`
    const safeCode = JSON.stringify(code).replace(/</g, '\\u003c')
    setDocumentSource(`<html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none';"></head><body><script>const worker = new Worker(URL.createObjectURL(new Blob([${JSON.stringify(workerSource)}], { type: 'text/javascript' }))); const send = lines => parent.postMessage({ type: 'astra-result', lines }, '*'); const timeout = setTimeout(() => { worker.terminate(); send(['Stopped: execution exceeded 2 seconds.']); }, 2000); worker.onmessage = event => { clearTimeout(timeout); send(event.data); worker.terminate(); }; worker.onerror = event => { clearTimeout(timeout); send(['Error: ' + event.message]); worker.terminate(); }; worker.postMessage(${safeCode});<\/script></body></html>`)
    timeout.current = setTimeout(() => { setRunning(false); setOutput(['Execution timed out. Reset and try again.']); setDocumentSource('') }, 4000)
  }
  const download = () => { const link = document.createElement('a'), url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' })); link.href = url; link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.js`; link.click(); URL.revokeObjectURL(url) }
  return <div className="code-lab"><div className="code-toolbar"><span><Terminal size={15} /> experiment.js</span><div className="toolbar-actions"><span className="shape-badge">JavaScript · isolated worker</span><button className="icon-button" aria-label="Download code" title="Download code" onClick={download}><Download size={15} /></button><button className="icon-button" aria-label="Reset code" title="Reset code" onClick={() => { clearTimeout(timeout.current); setDocumentSource(''); setRunning(false); setCode(initialCode); setOutput([]) }}><RotateCcw size={15} /></button><button className="primary-button" disabled={running} onClick={run}><Play size={14} />{running ? 'Running...' : 'Run code'}</button></div></div><div className="code-editor"><div aria-hidden="true" className="line-numbers">{code.split('\n').map((_, index) => <span key={index}>{index + 1}</span>)}</div><textarea spellCheck={false} aria-label="JavaScript code editor" value={code} onChange={event => setCode(event.target.value)} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); run() } }} /></div><div className="code-output"><span className="eyebrow">CONSOLE</span><pre aria-live="polite">{output.length ? output.join('\n') : 'Ready.'}</pre></div><iframe key={documentSource} ref={frame} title="Isolated code execution" sandbox="allow-scripts" srcDoc={documentSource} hidden /></div>
}