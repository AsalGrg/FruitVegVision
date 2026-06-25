import React from 'react'

const Buttons = ({text, type="primary"}) => {
  return (
    <button
    className={`${type=='primary'? 'bg-black text-warm-white': 'bg-transparent border border-black'}
    font-semibold
    rounded-sm
    px-6 py-2
    `}
    >
        {text}
    </button>
  )
}

export default Buttons