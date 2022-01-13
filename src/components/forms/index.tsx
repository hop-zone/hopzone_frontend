import React, {
  DetailedHTMLProps,
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import TextInput from './TextInput'

export enum InputTypes {
  PASSWORD = 'password',
  TEXT = 'text',
  EMAIL = 'email',
}

export interface FormItem {
  id: string
  value: string
  label: string
  type: InputTypes
  required?: boolean
  isFaulty?: boolean
  error?: string
}

interface FormProps {
  items: FormItem[]
  setItems: React.Dispatch<React.SetStateAction<FormItem[]>>
  submitting?: boolean
  setSubmitting?: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (items: FormItem[]) => void
}

const Form: FunctionComponent<FormProps> = ({
  items,
  setItems,
  submitting,
  setSubmitting,
  onSubmit,
}) => {

  const isValidEmail = (item: FormItem) => {
    const re = /\S+@\S+\.\S+/
    return re.test(item.value)
  }

  const isEmpty = (item: FormItem) => {
    if (item.required) {    
      if (!(item.value.toString().trim().length > 0)) {
        return true
      }
    }
    return false
  }

  const formHasErrors = (formItems: FormItem[]) => {

    let hasError = false;
    const newItems: FormItem[] = formItems.map(item => {
      const newItem = { ...item }

      if (isEmpty(newItem)) {
        hasError = true
        newItem.isFaulty = true
        newItem.error = 'Required'
        return newItem
      } else {
        if (item.type == InputTypes.EMAIL) {
          if (!isValidEmail(newItem)) {
            hasError = true
            newItem.isFaulty = true
            newItem.error = 'Invalid Email'
            return newItem
          }
        }
      }

      newItem.isFaulty = false
      newItem.error = undefined

      return newItem
    })

    setItems(newItems)
    return hasError
  }

  const handleFormItemChange = (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const newItems = [...items]

    const index = items.findIndex(item => item.id == target.id)

    newItems[index] = { ...newItems[index], value: target.value }

    setItems(newItems)
  }

  const handleEnterKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      const target = e.target as HTMLElement
      if (e.key === 'Enter' && target.tagName !== 'TEXTAREA') {
        if (setSubmitting) setSubmitting(true)
      }
    },
    [],
  )

  useEffect(() => {
    function handleSubmit() {
      if (formHasErrors(items)) {
        console.log('form has errors')
      } else {
        onSubmit(items)
      }
      if (setSubmitting) setSubmitting(false)
    }

    if (submitting) handleSubmit()
  }, [submitting])

  return (
    <form noValidate onKeyPress={handleEnterKeyPress}>
      {items.map(item => {
        return (
          <TextInput
            key={item.id}
            id={item.id}
            title={item.label}
            isPassword={item.type == InputTypes.PASSWORD ? true : false}
            onChange={handleFormItemChange}
            value={item.value}
            hasError={item.isFaulty}
            errorMsg={item.error}
          />
        )
      })}
    </form>
  )
}

export default Form
