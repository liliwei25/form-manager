import { Form } from '@/types/form'
import { Page } from '@/types/page'
import { Question } from '@/types/question'
import { Response } from '@/types/response'
import { ResponseValue } from '@/types/response-value'
import { ValidationType } from '@/types/validation-type'

import { getAllConditionals } from '@/utils/conditionals/get-all-conditionals'
import { getConditionalsForPage } from '@/utils/conditionals/get-conditionals-for-page'
import { evaluateCondition } from '@/utils/conditions/evaluate-condition'

type FormManagerOptions = {
  onResponsesChange?: (responses: Response) => void
  onErrorsChange?: (errors: Map<string, string[]>) => void
  onProgressChange?: (progress: number) => void
}

export class FormManager {
  private readonly form: Form
  private currentPageIndex: number
  private responses: Response
  private errors: Map<string, string[]>
  private progress: number
  private readonly options: FormManagerOptions

  constructor(form: Form, initialResponses: Response = {}, options: FormManagerOptions = {}) {
    this.form = form
    this.currentPageIndex = 0
    this.responses = initialResponses
    this.errors = new Map()
    this.progress = 0
    this.options = options
    this.validateAllQuestions()
    this.updateProgress()
  }

  // Navigation Methods
  public getCurrentPage(): Page {
    return this.form.pages[this.currentPageIndex]
  }

  public hasNextPage(): boolean {
    return (
      this.currentPageIndex < this.form.pages.length - 1 &&
      this.isCurrentPageValid() &&
      this.hasNextVisiblePage()
    )
  }

  public hasPreviousPage(): boolean {
    return this.currentPageIndex > 0
  }

  public goToNextPage(): boolean {
    if (!this.hasNextPage()) return false

    const nextIndex = this.findNextVisiblePageIndex()
    if (nextIndex === -1) return false

    this.currentPageIndex = nextIndex
    return true
  }

  public goToPreviousPage(): boolean {
    if (!this.hasPreviousPage()) return false

    const previousIndex = this.findPreviousVisiblePageIndex()
    if (previousIndex === -1) return false

    this.currentPageIndex = previousIndex
    return true
  }

  public setResponse(questionId: string, value: ResponseValue): void {
    this.responses = { ...this.responses, [questionId]: value }
    this.validateQuestion(this.findQuestionById(questionId))
    this.updateProgress()
    this.options.onResponsesChange?.(this.responses)
  }

  public getResponse(questionId: string): ResponseValue {
    return this.responses[questionId]
  }

  public getAllResponses(): Response {
    return { ...this.responses }
  }

  public getErrors(questionId: string): string[] {
    return this.errors.get(questionId) || []
  }

  public getAllErrors(): Record<string, string[]> {
    return Array.from(this.errors.entries()).reduce(
      (map, [questionId, errors]) => {
        map[questionId] = errors
        return map
      },
      {} as Record<string, string[]>
    )
  }

  public isPageVisible(pageId: string): boolean {
    const conditionals = getConditionalsForPage(getAllConditionals(this.form), pageId)
    if (conditionals.length === 0) return true

    return !conditionals.some(({ condition }) => evaluateCondition(condition, this.responses))
  }

  public getProgress(): number {
    return this.progress
  }

  public isComplete(): boolean {
    return this.getProgress() === 100
  }

  private findQuestionById(questionId: string): Question | undefined {
    for (const page of this.form.pages) {
      const question = page.questions.find((q) => q.id === questionId)
      if (question) return question
    }
    return undefined
  }

  private validateQuestion(question?: Question): boolean {
    if (!question) return true

    const errors: string[] = []
    const value = this.responses[question.id]

    if (question.isRequired && (!value || (Array.isArray(value) && value.length === 0))) {
      errors.push('This field is required')
    }

    if (question.validations?.length && value) {
      for (const validation of question.validations) {
        let isValid = true
        const numValue = typeof value === 'number' ? value : Number(value)

        switch (validation.type) {
          case ValidationType.MIN:
            isValid = !isNaN(numValue) && numValue >= Number(validation.value)
            break
          case ValidationType.MAX:
            isValid = !isNaN(numValue) && numValue <= Number(validation.value)
            break
          case ValidationType.MIN_LENGTH:
            isValid = String(value).length >= Number(validation.value)
            break
          case ValidationType.MAX_LENGTH:
            isValid = String(value).length <= Number(validation.value)
            break
          case ValidationType.PATTERN:
            isValid = new RegExp(String(validation.value)).test(String(value))
            break
          case ValidationType.EMAIL:
            isValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value))
            break
          case ValidationType.URL:
            isValid = /^https?:\/\/\S+$/.test(String(value))
            break
        }

        if (!isValid) {
          errors.push(validation.message || `Validation failed: ${validation.type}`)
        }
      }
    }

    const newErrors = new Map(this.errors)
    newErrors.set(question.id, errors)
    this.errors = newErrors
    this.options.onErrorsChange?.(this.errors)
    return errors.length === 0
  }

  private validateAllQuestions(): void {
    this.form.pages.forEach(page => {
      page.questions.forEach(question => {
        this.validateQuestion(question)
      })
    })
  }

  private updateProgress(): void {
    const totalAnswerable = this.getTotalAnswerableQuestions()
    if (totalAnswerable === 0) {
      this.progress = 0
    } else {
      const answered = this.getAnsweredQuestionCount()
      this.progress = (answered / totalAnswerable) * 100
    }
    this.options.onProgressChange?.(this.progress)
  }

  private isCurrentPageValid(): boolean {
    return this.getCurrentPage().questions.every((q) => this.validateQuestion(q))
  }

  private hasNextVisiblePage(): boolean {
    return this.findNextVisiblePageIndex() !== -1
  }

  private findNextVisiblePageIndex(): number {
    for (let i = this.currentPageIndex + 1; i < this.form.pages.length; i++) {
      if (this.isPageVisible(this.form.pages[i].id)) {
        return i
      }
    }
    return -1
  }

  private findPreviousVisiblePageIndex(): number {
    for (let i = this.currentPageIndex - 1; i >= 0; i--) {
      if (this.isPageVisible(this.form.pages[i].id)) {
        return i
      }
    }
    return -1
  }

  private getTotalAnswerableQuestions(): number {
    return this.form.pages.reduce((total, page) => {
      if (!this.isPageVisible(page.id)) return total
      return total + page.questions.length
    }, 0)
  }

  private getAnsweredQuestionCount(): number {
    return this.form.pages.reduce((total, page) => {
      if (!this.isPageVisible(page.id)) return total
      return (
        total +
        page.questions.filter((q) => this.responses[q.id] && this.getErrors(q.id).length === 0)
          .length
      )
    }, 0)
  }
}
