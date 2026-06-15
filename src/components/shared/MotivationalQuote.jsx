import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useMemo } from 'react'
import { quotes } from '../../lib/quotes'

const getQuoteIndex = (value) => {
  if (!value) return 0
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % quotes.length
  }
  return hash
}

export function MotivationalQuote({ session }) {
  const quote = useMemo(() => {
    const key = session?.user?.id || session?.user?.email || 'guest'
    return quotes[getQuoteIndex(key)]
  }, [session])

  const [text, author] = quote.includes(' — ') ? quote.split(' — ') : [quote, '']

  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass-card relative overflow-hidden border-l-2 border-l-royal/50 p-5 transition duration-300 hover:border-fuchsia-400 hover:bg-white/10"
    >
      <Quote className="absolute top-3 right-3 w-8 h-8 text-royal/10" />
      <p className="text-xs uppercase tracking-[0.25em] text-royal-light mb-3 font-semibold">
        Quote of the Day:
      </p>
      <p className="text-slate italic text-base leading-relaxed relative z-10">
        &ldquo;{text}&rdquo;
      </p>
      {author && (
        <p className="mt-4 text-sm text-royal-light font-medium relative z-10">
          — {author}
        </p>
      )}
    </motion.blockquote>
  )
}
