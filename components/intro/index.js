import { useMediaQuery } from '@darkroom.engineering/hamo'
import cn from 'clsx'
import { useStore } from 'lib/store'
import { useEffect, useState } from 'react'
import s from './intro.module.scss'

export const Intro = () => {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [isLoaded, setIsLoaded] = useState(false)
  const [scroll, setScroll] = useState(false)
  const introOut = useStore(({ introOut }) => introOut)
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut)
  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isMobile) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
      return
    }

    if (!scroll) {
      document.documentElement.classList.toggle('intro', true)
    }

    if (!lenis) return
    if (scroll) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
    } else {
      setTimeout(() => {
        lenis.stop()
      }, 0)

      document.documentElement.classList.toggle('intro', true)
    }
  }, [scroll, lenis, isMobile])

  return (
    <div
      className={cn(s.wrapper, isLoaded && s.out)}
      onTransitionEnd={(e) => {
        e.target.classList.forEach((value) => {
          if (value.includes('out')) {
            setScroll(true)
          }
          if (value.includes('show')) {
            setIntroOut(true)
          }
        })
      }}
    >
      <div className={cn(isLoaded && s.relative)}>
        <LNS isLoaded={isLoaded} fill={'var(--black)'} />
        <EI
          isLoaded={isLoaded}
          fill={'var(--black)'}
          className={cn(introOut && s.translate)}
        />
      </div>
    </div>
  )
}

// export const Title = ({ className }) => {
//   const introOut = useStore(({ introOut }) => introOut)

//   return (
//     <div className={className}>
//       <LNS fill={'var(--pink)'} />
//       <EI
//         fill={'var(--pink)'}
//         className={cn(introOut && s.translate, s.mobile)}
//       />
//     </div>
//   )
// }
export const Title = ({ className }) => {
  const introOut = useStore(({ introOut }) => introOut)

  return (
    <div className={className}>
      <span 
        className={cn(introOut && s.translate, s.mobile)}
        style={{ color: 'var(--pink)', fontWeight: 'bold', fontSize: '7rem', }}
      >
        FINSURE
      </span>
    </div>
  )
}



const LNS = ({ isLoaded, className, fill }) => {
  console.log(isLoaded)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1360 336"
      className={cn(s.lns, className)}
    >
      <g fill={fill}>
      </g>
    </svg>
  )
}

const EI = ({ isLoaded, className, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1360 336"
      className={cn(s.ei, className)}
    >
      <g fill={fill}>
        <path
          style={{ '--index': 5 }}
          className={cn(s.start, isLoaded && s.show)}
         
        />
        <path
          className={cn(s.start, isLoaded && s.show)}
          style={{ '--index': 4 }}
          
        />
      </g>
    </svg>
  )
}
