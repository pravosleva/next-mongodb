import { useState } from 'react'

type TProps = {
  [key: string]: any
}

export const useForm = (initialState = {}): TProps => {
  const [formData, setFormData] = useState<{ [key: string]: any }>(initialState)
  const resetForm = () => {
    setFormData(initialState)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.type) {
      case 'checkbox':
        setFormData({
          ...formData,
          [e.target.name]: e.target.checked,
        })
        break
      default:
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        })
        break
    }
  }

  const setValue = (key: string, value: any) => {
    setFormData((data) => {
      // eslint-disable-next-line no-console
      // console.log('old data:')
      // eslint-disable-next-line no-console
      // console.log(data)
      return {
        ...data,
        [key]: value,
      }
    })
  }

  return { formData, handleInputChange, resetForm, setValue }
}
