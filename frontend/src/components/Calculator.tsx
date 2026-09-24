import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Minus,
  X,
  Divide,
  Equal,
  Delete,
  Percent,
  Square,
  Sigma,
  Calculator as CalcIcon,
  AlertCircle,
} from 'lucide-react'
import { calculate, type Op } from '../api'

type OpSymbol = '+' | '-' | '*' | '/' | '^' | '%' | 'sqrt'

const OP_MAP: Record<string, Op> = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div',
  '^': 'pow',
  '%': 'percent',
  'sqrt': 'sqrt',
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [pending, setPending] = useState<{ a: number; op: OpSymbol } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setDisplay('0')
    setExpression('')
    setPending(null)
    setError(null)
  }

  const inputDigit = (d: string) => {
    setError(null)
    setDisplay((prev) => (prev === '0' ? d : prev + d))
  }

  const inputDot = () => {
    setError(null)
    setDisplay((prev) => (prev.includes('.') ? prev : prev + '.'))
  }

  const del = () => {
    setError(null)
    setDisplay((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)))
  }

  const doOp = async (op: OpSymbol) => {
    setError(null)
    const a = parseFloat(display)

    if (op === 'sqrt') {
      try {
        const r = await calculate(a, 0, 'sqrt')
        setExpression(r.expression)
        setDisplay(formatNumber(r.result))
      } catch (e) {
        setError((e as Error).message)
      }
      return
    }

    if (pending) {
      try {
        const r = await calculate(pending.a, a, OP_MAP[pending.op])
        setDisplay(formatNumber(r.result))
        setPending({ a: r.result, op })
        setExpression(formatNumber(r.result) + ' ' + op)
      } catch (e) {
        setError((e as Error).message)
      }
    } else {
      setPending({ a, op })
      setExpression(formatNumber(a) + ' ' + op)
      setDisplay('0')
    }
  }

  const equals = async () => {
    setError(null)
    if (!pending) return
    const b = parseFloat(display)
    try {
      const r = await calculate(pending.a, b, OP_MAP[pending.op])
      setExpression(formatNumber(pending.a) + ' ' + pending.op + ' ' + formatNumber(b) + ' =')
      setDisplay(formatNumber(r.result))
      setPending(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <motion.div
      className='calc'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className='calc-title'>
        <CalcIcon size={16} />
        Python Calculator
      </div>

      <div className='display'>
        <div className='expression'>{expression || ' '}</div>
        <AnimatePresence mode='wait'>
          <motion.div
            key={display}
            className='value'
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {display}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {error && (
            <motion.div
              className='error'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle size={13} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className='buttons'>
        <Btn onClick={reset} label='C' />
        <Btn onClick={del} icon={<Delete size={18} />} />
        <Btn onClick={() => doOp('%')} icon={<Percent size={18} />} className='op' />
        <Btn onClick={() => doOp('/')} icon={<Divide size={18} />} className='op' />

        <Btn onClick={() => inputDigit('7')} label='7' />
        <Btn onClick={() => inputDigit('8')} label='8' />
        <Btn onClick={() => inputDigit('9')} label='9' />
        <Btn onClick={() => doOp('*')} icon={<X size={18} />} className='op' />

        <Btn onClick={() => inputDigit('4')} label='4' />
        <Btn onClick={() => inputDigit('5')} label='5' />
        <Btn onClick={() => inputDigit('6')} label='6' />
        <Btn onClick={() => doOp('-')} icon={<Minus size={18} />} className='op' />

        <Btn onClick={() => inputDigit('1')} label='1' />
        <Btn onClick={() => inputDigit('2')} label='2' />
        <Btn onClick={() => inputDigit('3')} label='3' />
        <Btn onClick={() => doOp('+')} icon={<Plus size={18} />} className='op' />

        <Btn onClick={() => doOp('sqrt')} icon={<Square size={16} />} className='op' />
        <Btn onClick={() => inputDigit('0')} label='0' />
        <Btn onClick={inputDot} label='.' />
        <Btn onClick={() => doOp('^')} icon={<Sigma size={18} />} className='op' />

        <Btn onClick={equals} icon={<Equal size={20} />} className='eq wide' />
      </div>
    </motion.div>
  )
}

function Btn({
  onClick,
  label,
  icon,
  className = '',
}: {
  onClick: () => void
  label?: string
  icon?: ReactNode
  className?: string
}) {
  return (
    <motion.button
      className={'btn ' + className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {icon || label}
    </motion.button>
  )
}

function formatNumber(n: number): string {
  if (!isFinite(n)) return 'Error'
  const rounded = parseFloat(n.toPrecision(12))
  return rounded.toString()
}
