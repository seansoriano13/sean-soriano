import { TOOLBOX } from '../data/content'

export default function Toolbox() {
  return (
    <section id="toolbox" className="section toolbox" aria-labelledby="toolbox-title">
      <header className="section-head">
        <span className="section-index" data-reveal>
          (04)
        </span>
        <h2 id="toolbox-title" className="section-title" data-split>
          Toolbox
        </h2>
        <p className="section-sub" data-reveal>
          Every tool named in the Work above, by the layer it sits in.
        </p>
      </header>

      <div className="toolbox-grid">
        {TOOLBOX.map((group) => (
          <div key={group.layer} className="toolbox-group" data-reveal>
            <h3 className="note-label">{group.layer}</h3>
            <ul className="toolbox-tools">
              {group.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
