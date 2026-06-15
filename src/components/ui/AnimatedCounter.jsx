import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

export function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2, className }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp start={0} end={end} duration={duration} suffix={suffix} prefix={prefix} />
      ) : (
        `0${suffix}`
      )}
    </span>
  )
}
