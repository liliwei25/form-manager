import { Conditional } from '@/types/conditional'
import { Form } from '@/types/form'

export const getAllConditionals = (form: Form): Conditional[] => {
  return form.pages.flatMap(({ conditionals }) => conditionals ?? [])
}
