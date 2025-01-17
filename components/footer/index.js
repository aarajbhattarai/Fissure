import cn from 'clsx'
import { Button } from 'components/button'
// import { Link } from 'components/link'
import dynamic from 'next/dynamic'
import s from './footer.module.scss'

const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })

export const Footer = () => {
  return (
    <footer className={cn('theme-light', s.footer)}>
      <div className={cn(s.top, 'layout-grid hide-on-mobile')}>
        <p className={cn(s['first-line'], 'h1')}>
        Data Intelligence <br />
          <span className="contrast"> Across Domains</span>
        </p>
        <div className={s['shameless-plug']}>
          <p className="h4">Remember Us For</p>
          <p className="p-s">
            Artificial Intelligence <br /> Data Analytics <br /> Web Development<br />App Development<br/> Digital Marketing
          </p>
        </div>
        {/* <p className={cn(s['last-line'], 'h1')}>
          & open to <span className="hide-on-desktop">&nbsp;</span> features{' '}
          <br /> or sponsors
        </p> */}
        <Button
          className={s.cta}
          arrow
          href="https://www.refobe.com/contact-us"
        >
          Let's schedule a meeting
        </Button>
      </div>
      <div className={cn(s.top, 'layout-block hide-on-desktop')}>
        {/* <div className={s['shameless-plug']}>
          <p className="h4">Studio Freight</p>
          <p className="p-s">
            An independent creative <br /> studio built on principle
          </p>
        </div> */}
        <p className={cn(s['first-line'], 'h1')}>
          Let's <br />
          <span className="contrast">Analyze Your Data</span>
        </p>
      </div>
      <div className={s.bottom}>
        <div className={s.links}></div>
        <p className={cn('p-xs', s.tm)}>
          <span>©</span> {new Date().getFullYear()} Refobe LLC
        </p>
        <Button
          className={cn(s.cta, 'hide-on-desktop')}
          arrow
          href="https://github.com/darkroomengineering/Finsure"
        >
          Schedule a Meeting
        </Button>
      </div>
    </footer>
  )
}
