import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { glossary, lessons, levels } from './curriculum'
import { chapters } from './chapters'
import { emptyEvidence, mastery, validateProgress } from '../lib/progress'

describe('curriculum integrity', () => {
  it('covers every level with uniquely identified lessons', () => {
    expect(new Set(lessons.map(lesson => lesson.id)).size).toBe(lessons.length)
    expect(levels).toHaveLength(16)
    levels.forEach((_, index) => expect(lessons.some(lesson => lesson.level === index)).toBe(true))
  })
  it('renders every equation and links every glossary term', () => {
    lessons.forEach(lesson => {
      expect(() => katex.renderToString(lesson.equation, { throwOnError: true })).not.toThrow()
      expect(lesson.options[lesson.answer]).toBeTruthy()
      expect(lesson.summary.length).toBeGreaterThan(80)
    })
    glossary.forEach(entry => expect(lessons.some(lesson => lesson.id === entry.lesson)).toBe(true))
  })
  it('runs every supplied JavaScript example without error', () => {
    lessons.forEach(lesson => expect(() => new Function('console', lesson.code)({ log: () => {} })).not.toThrow())
  })
  it('renders chapter equations and resolves prerequisite links', () => {
    Object.entries(chapters).forEach(([id, chapter]) => {
      expect(lessons.some(lesson => lesson.id === id)).toBe(true)
      ;[...chapter.prerequisites, chapter.next].forEach(link => expect(lessons.some(lesson => lesson.id === link)).toBe(true))
      chapter.sections.forEach(section => {
        if (section.equation) expect(() => katex.renderToString(section.equation!, { throwOnError: true })).not.toThrow()
        if (section.question) expect(section.answer).toBeTruthy()
      })
      if (chapter.implementation?.language === 'JavaScript') expect(() => new Function('console', chapter.implementation!.code)({ log: () => {} })).not.toThrow()
    })
  })
})

describe('evidence-based mastery', () => {
  it('never awards mastery for opening a page or practice alone', () => {
    expect(mastery()).toBe('Not started')
    expect(mastery({ ...emptyEvidence, practiced: true })).toBe('Practicing')
    expect(mastery({ ...emptyEvidence, correct: true })).toBe('Understood')
    expect(mastery({ attempts: 1, correct: true, practiced: true, challenge: true })).toBe('Mastered')
  })
  it('rejects malformed stored evidence', () => {
    expect(validateProgress(null)).toEqual({})
    expect(validateProgress({ neuron: { correct: 'yes' } })).toEqual({})
    expect(validateProgress({ neuron: emptyEvidence })).toEqual({ neuron: emptyEvidence })
  })
})