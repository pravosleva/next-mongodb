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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return { formData, handleInputChange, resetForm }
}
