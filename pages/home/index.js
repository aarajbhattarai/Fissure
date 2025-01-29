import { useFrame, useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Button } from 'components/button'
import { Card } from 'components/card'
import { Title } from 'components/intro'
// import { Link } from 'components/link'
import { ListItem } from 'components/list-item'
import { projects } from 'content/projects'
import { useScroll } from 'hooks/use-scroll'
import { Layout } from 'layouts/default'
import { button, useControls } from 'leva'
import { clamp, mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useIntersection, useWindowSize } from 'react-use'
import s from './home.module.scss'

// const SFDR = dynamic(() => import('icons/sfdr.svg'), { ssr: false })
// const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })

const Parallax = dynamic(
  () => import('components/parallax').then((mod) => mod.Parallax),
  { ssr: false }
)

// const AppearTitle = dynamic(
//   () => import('components/appear-title').then((mod) => mod.AppearTitle),
//   { ssr: false }
// )

const HorizontalSlides = dynamic(
  () =>
    import('components/horizontal-slides').then((mod) => mod.HorizontalSlides),
  { ssr: false }
)

const FeatureCards = dynamic(
  () => import('components/feature-cards').then((mod) => mod.FeatureCards),
  { ssr: false }
)

const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const HeroTextIn = ({ children, introOut }) => {
  return (
    <div className={cn(s['hide-text'], introOut && s['show-text'])}>
      {children}
    </div>
  )
}

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState()
  const zoomRef = useRef(null)
  const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
  const { height: windowHeight } = useWindowSize()
  const introOut = useStore(({ introOut }) => introOut)

  const [theme, setTheme] = useState('dark')
  const lenis = useStore(({ lenis }) => lenis)

  useControls(
    'lenis',
    () => ({
      stop: button(() => {
        lenis.stop()
      }),
      start: button(() => {
        lenis.start()
      }),
    }),
    [lenis]
  )

  useControls(
    'scrollTo',
    () => ({
      immediate: button(() => {
        lenis.scrollTo(30000, { immediate: true })
      }),
      smoothDuration: button(() => {
        lenis.scrollTo(30000, { lock: true, duration: 10 })
      }),
      smooth: button(() => {
        lenis.scrollTo(30000)
      }),
      forceScrollTo: button(() => {
        lenis.scrollTo(30000, { force: true })
      }),
    }),
    [lenis]
  )

  useEffect(() => {
    if (!lenis) return

    function onClassNameChange(lenis) {
      console.log(lenis.className)
    }

    lenis.on('className change', onClassNameChange)

    return () => {
      lenis.off('className change', onClassNameChange)
    }
  }, [lenis])

  useScroll(({ scroll }) => {
    setHasScrolled(scroll > 10)
    if (!zoomWrapperRect.top) return

    const start = zoomWrapperRect.top + windowHeight * 0.5
    const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
    const center = 0.6
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
    setTheme(progress2 === 1 ? 'light' : 'dark')

    zoomRef.current.style.setProperty('--progress1', progress1)
    zoomRef.current.style.setProperty('--progress2', progress2)

    if (progress === 1) {
      zoomRef.current.style.setProperty('background-color', 'currentColor')
    } else {
      zoomRef.current.style.removeProperty('background-color')
    }
  })

  const [whyRectRef, whyRect] = useRect()
  const [cardsRectRef, cardsRect] = useRect()
  const [whiteRectRef, whiteRect] = useRect()
  const [featuresRectRef, featuresRect] = useRect()
  const [inuseRectRef, inuseRect] = useRect()

  const addThreshold = useStore(({ addThreshold }) => addThreshold)

  useEffect(() => {
    addThreshold({ id: 'top', value: 0 })
  }, [])

  useEffect(() => {
    const top = whyRect.top - windowHeight / 2
    addThreshold({ id: 'why-start', value: top })
    addThreshold({
      id: 'why-end',
      value: top + whyRect.height,
    })
  }, [whyRect])

  useEffect(() => {
    const top = cardsRect.top - windowHeight / 2
    addThreshold({ id: 'cards-start', value: top })
    addThreshold({ id: 'cards-end', value: top + cardsRect.height })
    addThreshold({
      id: 'red-end',
      value: top + cardsRect.height + windowHeight,
    })
  }, [cardsRect])

  useEffect(() => {
    const top = whiteRect.top - windowHeight
    addThreshold({ id: 'light-start', value: top })
  }, [whiteRect])

  useEffect(() => {
    const top = featuresRect.top
    addThreshold({ id: 'features', value: top })
  }, [featuresRect])

  useEffect(() => {
    const top = inuseRect.top
    addThreshold({ id: 'in-use', value: top })
  }, [inuseRect])

  useEffect(() => {
    const top = lenis?.limit
    addThreshold({ id: 'end', value: top })
  }, [lenis?.limit])

  useScroll((e) => {
    console.log(window.scrollY, e.scroll, e.isScrolling, e.velocity, e.isLocked)
  })

  useFrame(() => {
    console.log('frame', window.scrollY, lenis?.scroll, lenis?.isScrolling)
  }, 1)

  const inUseRef = useRef()

  const [visible, setIsVisible] = useState(false)
  const intersection = useIntersection(inUseRef, {
    threshold: 0.2,
  })
  useEffect(() => {
    if (intersection?.isIntersecting) {
      setIsVisible(true)
    }
  }, [intersection])

  return (
    <Layout
      theme={theme}
      seo={{
        title: 'Finsure',
        description: 'Revolutionize Enterprise Intelligence with Finsure AI',
      }}
      className={s.home}
    >
      <div className={s.canvas}>
        <WebGL />
      </div>

      <section className={s.hero}>
        <div className="layout-grid-inner">
          <Title className={s.title} />
          {/* <SFDR className={cn(s.icon, introOut && s.show)} /> */}
          <span className={cn(s.sub)}>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('h3', s.subtitle)}>
                Transform Data into Intelligence
              </h2>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('p-xs', s.tm)}>
                AI with Human-level knowledge for your enterprise data.
                Get actionable insights from your database just by asking questions
              </h2>
            </HeroTextIn>
          </span>
        </div>

        <div className={cn(s.bottom, 'layout-grid')}>
          <div
            className={cn(
              'hide-on-mobile',
              s['scroll-hint'],
              hasScrolled && s.hide,
              introOut && s.show
            )}
          >
            <div className={s.text}>
              <HeroTextIn introOut={introOut}>
                <p>scroll</p>
              </HeroTextIn>
              <HeroTextIn introOut={introOut}>
                <p> to explore</p>
              </HeroTextIn>
            </div>
          </div>
          <h1 className={cn(s.description, 'p-s')}>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">
                Powering Intelligent Solutions Across Industries
              </p>
            </HeroTextIn>
            {/* <HeroTextIn introOut={introOut}>
              <p className="p-s">fresh out of https://finsure.refobe.com</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">website designed by Studio Freight</p>
            </HeroTextIn> */}
          </h1>
          <Button
            className={cn(s.cta, introOut && s.in)}
            arrow
            href="https://www.refobe.com/contact-us"
          >
            Try Finsure
          </Button>
        </div>
      </section>
      <section className={s.why} data-lenis-scroll-snap-align="start">
        <div className="layout-grid">
          <h2 className={cn(s.sticky, 'h2')}>
            {/* <AppearTitle> */}
            AI with Human-level Cognition on enterprise data
            {/* </AppearTitle> */}
          </h2>
          <aside className={s.features} ref={whyRectRef}>
            <div className={s.feature}>
              <p className="p">
                Transform how you interact with your enterprise data using
                Finsure. 
                <br /> <br />
                Our AI-powered platform enables you to build
                intelligent applications and agents that deliver secure,
                scalable, and human-like cognition—unlocking actionable insights
                from structured and unstructured data in real-time.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                AI-Powered Data Insights: From Complexity to Clarity
              </h3>
              <p className="p">
                Imagine you’re a bank manager tasked with analyzing terabytes of
                transaction data to detect fraud. Traditional methods mean hours
                of manual work and missed patterns. 
                <br /> <br />
                Finsure simplifies this
                complexity by using AI to uncover trends, anomalies, and
                insights you might never see otherwise. It turns overwhelming
                data into actionable clarity, enabling you to make decisions
                faster and with confidence.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Human-Like Cognition Across All Enterprise Data
              </h3>
              <p className="p">
                Think of asking a colleague for a quick answer to a pressing
                question, like "What were last quarter's top revenue-generating
                services?"
                <br /> <br />
                Now imagine asking Finsure the same question—it
                understands your intent, scans through millions of structured
                and unstructured data points (reports, emails, logs), and gives
                you the precise answer in seconds.
                <br /> <br />
                 It feels as if you’re
                speaking to a human but with the speed and accuracy of AI.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Scalable RAG-Based Solutions for Every Business
              </h3>
              <p className="p">
                Whether you’re a startup managing customer data or a global
                financial institution analyzing decades of records, Finsure
                adapts to your needs. 
                <br /> <br />
                With Retrieval-Augmented Generation (RAG)
                technology, it delivers accurate answers in real-time by
                blending advanced retrieval methods with AI generation. This
                means your business can scale without worrying about data
                overload—Finsure grows with you and ensures performance is never
                compromised.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <section className={s.rethink}>
        <div className={cn('layout-grid', s.pre)}>
          <div className={s.highlight} data-lenis-scroll-snap-align="start">
            <Parallax speed={-0.5}>
              <p className="h2">
                {/* <AppearTitle> */}
                Clarity. Cognition. Confidence.
                {/* </AppearTitle> */}
              </p>
            </Parallax>
          </div>
        </div>
        <div className={s.cards} ref={cardsRectRef}>
          <HorizontalSlides>
            <Card
              className={s.card}
              number="01"
              text="Analyze Massive Data Sets Instantly"
            />
            <Card
              className={s.card}
              number="02"
              text="Get Precise Answers in Real-Time through natural language."
            />
            <Card
              className={s.card}
              number="03"
              text="Turn Complexity Into Simplicity"
            />
            <Card
              className={s.card}
              number="04"
              text="Transform Structured & Unstructured Data"
            />
            <Card
              className={s.card}
              number="05"
              text="Empower Smarter, Faster Decisions"
            />
            <Card
              className={s.card}
              number="06"
              text="Automate Compliance & Reporting"
            />
            <Card
              className={s.card}
              number="07"
              text="Boost Productivity Across Teams"
            />
            <Card
              className={s.card}
              number="08"
              text="Deliver Financial Insights Effortlessly"
            />
            <Card
              className={s.card}
              number="09"
              text="Scale AI Across Enterprise Systems"
            />
          </HorizontalSlides>
        </div>
      </section>
      <section
        ref={(node) => {
          zoomWrapperRectRef(node)
          zoomRef.current = node
        }}
        className={s.solution}
      >
        <div className={s.inner}>
          <div className={s.zoom}>
            <h2 className={cn(s.first, 'h1 vh')}>
              Driving Innovation
              <br />
              <span className="contrast">With ai agents</span>
            </h2>
            <h2 className={cn(s.enter, 'h3 vh')}>
               Data
              <br/>Decisions
            </h2>
            <h2 className={cn(s.second, 'h1 vh')}>On Enterprise Data</h2>
          </div>
        </div>
      </section>
      <section className={cn('theme-light', s.featuring)} ref={whiteRectRef}>
        <div className={s.inner}>
          <div className={cn('layout-block', s.intro)}>
            <p className="p-l">
              Finsure is not just a tool—it’s a transformation engine. Designed
              with the modern enterprise in mind, it harnesses advanced AI
              technologies to empower teams with instant insights and seamless
              interactions.
              <br />
              <br />
              Finsure doesn’t just analyze your data—it creates value from it.
            </p>
          </div>
        </div>
        <section ref={featuresRectRef}>
          <FeatureCards />
        </section>
      </section>
      <section
        ref={(node) => {
          inuseRectRef(node)
          inUseRef.current = node
        }}
        className={cn('theme-light', s['in-use'], visible && s.visible)}
      >
        <div className="layout-grid">
          <aside className={s.title}>
            <p className="h3">
              {/* <AppearTitle> */}
              Know
              <br />
              <span className="contrast">more about Finsure</span>
              {/* </AppearTitle> */}
            </p>
          </aside>
          <ul className={s.list}>
            {projects.map(({ title, source, href }, i) => (
              <li key={i}>
                <ListItem
                  title={title}
                  source={source}
                  href={href}
                  index={i}
                  visible={visible}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      id: 'home',
    }, // will be passed to the page component as props
  }
}
