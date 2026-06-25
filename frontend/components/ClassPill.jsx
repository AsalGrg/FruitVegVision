import React from 'react'

const ClassPill = ({ CLASS = '', COLOR = { bg: '', border: '' }, staturate = true }) => {

  return (
    <div
      style={{
        "--pill-bg": COLOR.bg,
        "--pill-border": COLOR.border,
      }}
      className={`relative
    inline
    border-l
    border-r
    ${staturate ?
          'text-[var(--pill-border)] before:border-[var(--pill-border)] after:border-[var(--pill-border)]'
          : 'text-black/80 before:border-black/88 after:border-black/88 '}
    box-border
    p-1
   
    flex justify-center
    after:absolute
    after:inset-0
    after:left-[50%]
    after:top-[50%]
    after:border-t
    after:border-b
    after:w-[112%]
    after:h-[80%]
    after:translate-x-[-50%]
    after:translate-y-[-50%]
    after:border-[var(--pill-border)]

    `}
    >
      {CLASS.trim()}
    </div>
  )
}

export default ClassPill
