import katex from 'katex'
import { ArrowRight, BookOpen, Lightbulb } from 'lucide-react'
import { chapters } from '../data/chapters'
import { lessons } from '../data/curriculum'
import './ChapterReader.css'

export default function ChapterReader({ lessonId }: { lessonId: string }) {
  const chapter = chapters[lessonId]
  const lesson = lessons.find(entry => entry.id === lessonId)!
  if (!chapter) return <div className="reading-section"><h2>{lesson.title}</h2><p>{lesson.summary}</p><div className="math-block" dangerouslySetInnerHTML={{ __html: katex.renderToString(lesson.equation, { displayMode: true, throwOnError: false }) }} /><h3>Worked example</h3><p>{lesson.example}</p><h3>Common mistake</h3><p>{lesson.misconception}</p></div>
  return <article className="chapter-reader">
    <header className="chapter-start"><h2>Learning objectives</h2><ul>{chapter.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul><div className="chapter-prerequisites"><BookOpen size={16} /><span>Prerequisites:</span>{chapter.prerequisites.length ? chapter.prerequisites.map(id => <a key={id} href={`#/lesson/${id}`}>{lessons.find(entry => entry.id === id)?.title ?? id}</a>) : <span>No machine learning knowledge needed.</span>}</div></header>
    <nav className="chapter-contents" aria-label="Chapter contents">{chapter.sections.map((section, index) => <button key={section.title} onClick={() => document.getElementById(`chapter-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</button>)}</nav>
    {chapter.sections.map((section, index) => <section className="chapter-section" id={`chapter-section-${index}`} key={section.title}><div className="chapter-section-heading"><span className="section-number">{String(index + 1).padStart(2, '0')}</span><h2>{section.title}</h2></div>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.equation && <div className="math-block" dangerouslySetInnerHTML={{ __html: katex.renderToString(section.equation, { displayMode: true, throwOnError: false, trust: false }) }} />}{section.example && <div className="worked-example"><span className="eyebrow">WORKED EXAMPLE</span><p>{section.example}</p></div>}{section.question && <div className="chapter-checkpoint"><h3>Pause and reason</h3><p>{section.question}</p><details><summary>Reveal the reasoning</summary><p>{section.answer}</p></details></div>}</section>)}
    {chapter.implementation && <section className="chapter-section"><h2>From equations to implementation</h2><p>{chapter.implementation.explanation}</p><pre className="chapter-code" aria-label={`${chapter.implementation.language} implementation`}><code>{chapter.implementation.code}</code></pre></section>}
    <section className="chapter-section"><div className="chapter-section-heading"><Lightbulb size={21} /><h2>Where this appears in practice</h2></div><p>{chapter.application}</p><h3>Try it yourself</h3><p>{chapter.experiment}</p><div className="callout"><Lightbulb size={20} /><div><h4>A common misconception</h4><p>{lesson.misconception}</p></div></div></section>
    <a className="chapter-next" href={`#/lesson/${chapter.next}`}><span><small>NEXT CHAPTER</small>{lessons.find(entry => entry.id === chapter.next)?.title ?? chapter.next}</span><ArrowRight size={20} /></a>
  </article>
}