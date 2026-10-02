import katex from 'katex'
import { ArrowRight, BookOpen, Lightbulb } from 'lucide-react'
import { chapters } from '../data/chapters'
import { lessons } from '../data/curriculum'
import './ChapterReader.css'

const references: [string, string][][] = [
  [['Mathematics for Machine Learning', 'https://mml-book.github.io/'], ['Seeing Theory: probability', 'https://seeing-theory.brown.edu/']],
  [['An Introduction to Statistical Learning', 'https://www.statlearning.com/'], ['Scikit-learn user guide', 'https://scikit-learn.org/stable/user_guide.html']],
  [['Neural Networks and Deep Learning', 'http://neuralnetworksanddeeplearning.com/'], ['Deep Learning: feedforward networks', 'https://www.deeplearningbook.org/contents/mlp.html']],
  [['Dive into Deep Learning: optimization', 'https://d2l.ai/chapter_optimization/index.html'], ['PyTorch autograd', 'https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html']],
  [['CS231n: convolutional networks', 'https://cs231n.github.io/convolutional-networks/'], ['Deep Residual Learning', 'https://arxiv.org/abs/1512.03385']],
  [['Dive into Deep Learning: modern recurrent networks', 'https://d2l.ai/chapter_recurrent-modern/index.html']],
  [['Speech and Language Processing', 'https://web.stanford.edu/~jurafsky/slp3/'], ['SentencePiece', 'https://github.com/google/sentencepiece']],
  [['Attention Is All You Need', 'https://arxiv.org/abs/1706.03762'], ['The Annotated Transformer', 'https://nlp.seas.harvard.edu/annotated-transformer/']],
  [['The Annotated Transformer', 'https://nlp.seas.harvard.edu/annotated-transformer/'], ['RoFormer: rotary position embeddings', 'https://arxiv.org/abs/2104.09864']],
  [['Language Models are Few-Shot Learners', 'https://arxiv.org/abs/2005.14165'], ['LoRA', 'https://arxiv.org/abs/2106.09685'], ['QLoRA', 'https://arxiv.org/abs/2305.14314']],
  [['Denoising Diffusion Probabilistic Models', 'https://arxiv.org/abs/2006.11239'], ['Reinforcement Learning: An Introduction', 'http://incompleteideas.net/book/the-book-2nd.html'], ['Direct Preference Optimization', 'https://arxiv.org/abs/2305.18290']],
  [['Retrieval-Augmented Generation', 'https://arxiv.org/abs/2005.11401'], ['FAISS documentation', 'https://faiss.ai/'], ['OWASP: LLM application security', 'https://genai.owasp.org/']],
  [['CLIP', 'https://arxiv.org/abs/2103.00020'], ['An Image is Worth 16x16 Words', 'https://arxiv.org/abs/2010.11929']],
  [['Scikit-learn model evaluation', 'https://scikit-learn.org/stable/modules/model_evaluation.html'], ['MLflow documentation', 'https://mlflow.org/docs/latest/'], ['Axiomatic Attribution for Deep Networks', 'https://arxiv.org/abs/1703.01365']],
  [['vLLM documentation', 'https://docs.vllm.ai/'], ['FlashAttention', 'https://arxiv.org/abs/2205.14135'], ['PyTorch distributed overview', 'https://docs.pytorch.org/tutorials/beginner/dist_overview.html']],
  [['Training Compute-Optimal Large Language Models', 'https://arxiv.org/abs/2203.15556'], ['Mamba', 'https://arxiv.org/abs/2312.00752'], ['Switch Transformers', 'https://arxiv.org/abs/2101.03961']],
]

export default function ChapterReader({ lessonId }: { lessonId: string }) {
  const chapter = chapters[lessonId]
  const lesson = lessons.find(entry => entry.id === lessonId)!
  if (!chapter) return <div className="reading-section"><h2>{lesson.title}</h2><p>{lesson.summary}</p><div className="math-block" dangerouslySetInnerHTML={{ __html: katex.renderToString(lesson.equation, { displayMode: true, throwOnError: false }) }} /><h3>Worked example</h3><p>{lesson.example}</p><h3>Common mistake</h3><p>{lesson.misconception}</p></div>
  return <article className="chapter-reader">
    <header className="chapter-start"><h2>Learning objectives</h2><ul>{chapter.objectives.map(objective => <li key={objective}>{objective}</li>)}</ul><div className="chapter-prerequisites"><BookOpen size={16} /><span>Prerequisites:</span>{chapter.prerequisites.length ? chapter.prerequisites.map(id => <a key={id} href={`#/lesson/${id}`}>{lessons.find(entry => entry.id === id)?.title ?? id}</a>) : <span>No machine learning knowledge needed.</span>}</div></header>
    <nav className="chapter-contents" aria-label="Chapter contents">{chapter.sections.map((section, index) => <button key={section.title} onClick={() => document.getElementById(`chapter-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</button>)}</nav>
    {chapter.sections.map((section, index) => <section className="chapter-section" id={`chapter-section-${index}`} key={section.title}><div className="chapter-section-heading"><span className="section-number">{String(index + 1).padStart(2, '0')}</span><h2>{section.title}</h2></div>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.equation && <div className="math-block" dangerouslySetInnerHTML={{ __html: katex.renderToString(section.equation, { displayMode: true, throwOnError: false, trust: false }) }} />}{section.example && <div className="worked-example"><span className="eyebrow">WORKED EXAMPLE</span><p>{section.example}</p></div>}{section.question && <div className="chapter-checkpoint"><h3>Pause and reason</h3><p>{section.question}</p><details><summary>Reveal the reasoning</summary><p>{section.answer}</p></details></div>}</section>)}
    {chapter.implementation && <section className="chapter-section"><h2>From equations to implementation</h2><p>{chapter.implementation.explanation}</p><details className="chapter-implementation"><summary>Implementation source</summary><pre className="chapter-code" aria-label={`${chapter.implementation.language} implementation`}><code>{chapter.implementation.code}</code></pre></details></section>}
    <section className="chapter-section"><div className="chapter-section-heading"><Lightbulb size={21} /><h2>Where this appears in practice</h2></div><p>{chapter.application}</p><h3>Try it yourself</h3><p>{chapter.experiment}</p><div className="callout"><Lightbulb size={20} /><div><h4>A common misconception</h4><p>{lesson.misconception}</p></div></div></section>
    <section className="chapter-section chapter-references"><h2>Further reading</h2><ul>{references[lesson.level].map(([title, url]) => <li key={url}><a href={url} target="_blank" rel="noreferrer">{title}<ArrowRight size={14} /></a></li>)}</ul></section>
    <a className="chapter-next" href={`#/lesson/${chapter.next}`}><span><small>{lessonId === 'research' ? 'REVISIT THE FOUNDATIONS' : 'NEXT CHAPTER'}</small>{lessons.find(entry => entry.id === chapter.next)?.title ?? chapter.next}</span><ArrowRight size={20} /></a>
  </article>
}