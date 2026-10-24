import { db } from "@/lib/db";
import { highlightCode } from "@/lib/highlight";
import { parseInlineBold } from "@/lib/markdown-lite";
import { PortfolioClient } from "@/components/public/PortfolioClient";
import { ContactForm } from "@/components/public/ContactForm";

import { Navbar } from "@/components/public/Navbar";

export const revalidate = 3600; // on-demand revalidation is primary via revalidatePath

export default async function HomePage() {
  const [
    settings,
    hero,
    about,
    facts,
    projectsRaw,
    techs,
    processSteps,
    stats,
    contactInfo,
    socialLinks,
  ] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: 1 } }),
    db.hero.findUnique({ where: { id: 1 } }),
    db.about.findUnique({ where: { id: 1 } }),
    db.fact.findMany({ orderBy: { order: "asc" } }),
    db.project.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.tech.findMany({ orderBy: { order: "asc" } }),
    db.processStep.findMany({ orderBy: { order: "asc" } }),
    db.stat.findMany({ orderBy: { order: "asc" } }),
    db.contactInfo.findUnique({ where: { id: 1 } }),
    db.socialLink.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
  ]);

  // Parse hero roles and highlight code
  const roles: string[] = hero?.roles ? JSON.parse(hero.roles) : [];
  const heroHighlightedCode = hero?.codeText
    ? await highlightCode(hero.codeText, hero.codeLang || "dart")
    : "";

  // Parse about paragraphs
  const aboutParagraphs: string[] = about?.paragraphs ? JSON.parse(about.paragraphs) : [];

  // Parse and highlight projects code
  const projects = await Promise.all(
    projectsRaw.map(async (pj) => {
      const features: string[] = pj.features ? JSON.parse(pj.features) : [];
      const tags: string[] = pj.tags ? JSON.parse(pj.tags) : [];
      const highlighted = pj.codeText
        ? await highlightCode(pj.codeText, pj.codeLang || "dart")
        : "";
      return {
        ...pj,
        features,
        tags,
        highlightedCode: highlighted,
      };
    })
  );

  const marqueeTechs = techs.map((t) => t.name);
  const duplicatedTechs = [...marqueeTechs, ...marqueeTechs];

  return (
    <>
      <PortfolioClient roles={roles} heroCodeSnippet={heroHighlightedCode} />

      {/* Responsive Nav */}
      <Navbar />

      {/* Hero */}
      {hero && (
        <header className="hero" id="top">
          <div className="w">
            <div>
              {settings?.showBadge && (
                <div className="hi fade">
                  <i></i>
                  {settings.availableBadge}
                </div>
              )}
              <h1>
                <span className="ln">
                  <span>{hero.line1}</span>
                </span>
                <span className="ln">
                  <span>{hero.line2}</span>
                </span>
                <span className="ln">
                  <span>{hero.line3}</span>
                </span>
              </h1>
              <div className="role fade" id="role" aria-live="off"></div>
              <p className="lead fade d2">{hero.lead}</p>
              <div className="row fade d2">
                <a className="btn p" href={hero.cta1Href}>
                  {hero.cta1Label} <span className="ar">→</span>
                </a>
                <a className="btn" href={hero.cta2Href}>
                  {hero.cta2Label}
                </a>
              </div>
            </div>
            <div className="term fade d2" aria-hidden="true">
              <div className="tb">
                <i></i>
                <i></i>
                <i></i>
                <span>{hero.codeFile}</span>
              </div>
              <pre id="code"></pre>
            </div>
          </div>
        </header>
      )}

      {/* Tech Marquee */}
      {marqueeTechs.length > 0 && (
        <div className="mq" aria-hidden="true">
          <div className="mt" id="mt">
            {duplicatedTechs.map((tech, i) => (
              <span key={i}>{tech}</span>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      {about && (
        <section className="s" id="about">
          <div className="w about">
            <div className="rv">
              <div className="tag">{about.tag}</div>
              <h2>{about.heading}</h2>
              {aboutParagraphs.map((para, i) => (
                <p
                  key={i}
                  dangerouslySetInnerHTML={{ __html: parseInlineBold(para) }}
                />
              ))}
            </div>
            {facts.length > 0 && (
              <div className="facts rv">
                {facts.map((fact) => (
                  <div className="fact" key={fact.id}>
                    <span>{fact.label}</span>
                    <b>{fact.value}</b>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Selected work */}
      {projects.length > 0 && (
        <section className="s" id="work" style={{ paddingTop: "40px" }}>
          <div className="w">
            <div className="ph rv">
              <div>
                <div className="tag">Selected work</div>
                <h2>Products people use every day.</h2>
              </div>
              <p>Real apps with real users. Scroll to see each one.</p>
            </div>
            <div className="stk">
              {projects.map((pj, i) => (
                <article
                  className="pj"
                  style={{ "--i": i } as React.CSSProperties}
                  key={pj.id}
                >
                  <div>
                    <h3>{pj.name}</h3>
                    <p className="ds">{pj.description}</p>
                    {pj.features.length > 0 && (
                      <ul>
                        {pj.features.map((feat, fi) => (
                          <li key={fi}>{feat}</li>
                        ))}
                      </ul>
                    )}
                    {pj.tags.length > 0 && (
                      <div className="tgs">
                        {pj.tags.map((tag, ti) => (
                          <span key={ti}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {pj.codeText && (
                    <div className="term" aria-hidden="true">
                      <div className="tb">
                        <i></i>
                        <i></i>
                        <i></i>
                        <span>{pj.codeFile || "code"}</span>
                      </div>
                      <pre
                        dangerouslySetInnerHTML={{ __html: pj.highlightedCode }}
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How I work (Process) */}
      {processSteps.length > 0 && (
        <section className="s" id="process" style={{ paddingTop: "40px" }}>
          <div className="w">
            <div className="ph rv">
              <div>
                <div className="tag">How I work</div>
                <h2>From idea to live release.</h2>
              </div>
              <p>A simple process that keeps projects clear and on time.</p>
            </div>
            <div className="proc">
              {processSteps.map((step, i) => (
                <div className="st rv" key={step.id}>
                  <em>{i + 1}</em>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Numbers */}
      {stats.length > 0 && (
        <section className="nums">
          <div className="w ng">
            {stats.map((st) => (
              <div key={st.id}>
                <b data-n={st.value} data-s={st.suffix}>
                  0
                </b>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact & Footer */}
      {contactInfo && (
        <section className="end" id="contact">
          <div className="w">
            <h2 className="rv">{contactInfo.heading}</h2>
            <a className="mail" href={`mailto:${contactInfo.email}`}>
              {contactInfo.email}
            </a>
            <div className="lk">
              {socialLinks.map((link) => (
                <a
                  className="btn"
                  href={link.url}
                  key={link.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
              <a className="btn p" href={`mailto:${contactInfo.email}`}>
                Send message <span className="ar">→</span>
              </a>
            </div>

            <ContactForm />

            <div className="ft">
              <span>{contactInfo.footerLeft}</span>
              <span>{contactInfo.footerRight}</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
