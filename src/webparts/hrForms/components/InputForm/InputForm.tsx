import * as React from 'react'
import { useNavigate } from 'react-router-dom'

const InputForm = () => {

    const navigate = useNavigate();

  return (
    <div>
        <button onClick={()=> navigate('/')}>Back</button>
    </div>
  )
}

export default InputForm