import Page from '../components/Page'
import { Btn, Mascot } from '../components/ui'

export default function NotFound() {
  return (
    <Page title="Lost" cta={false}>
      <section className="nf t-amber">
        <Mascot className="nf__mascot" animated ink="#000" band="#fff" />
        <h1 className="display">Um… <span className="italic">404.</span></h1>
        <p className="lede">Even champions lose their place sometimes. Take a breath and try again.</p>
        <Btn to="/" variant="black">Back to the stage</Btn>
      </section>
    </Page>
  )
}
