import PageIntro from "../components/ui/PageIntro.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Button from "../components/Button.jsx";
import { ValueCard } from "../components/cards/MarketingCards.jsx";
import { ABOUT, BRAND } from "../data/site.js";
import "./Static.css";

export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="OUR STORY"
        title="Welcome to Kapresco"
        description="More than a coffee shop — a preskong space in Mati City built for comfort, connection, and chill."
        image={ABOUT.heroImage}
      />

      {/* ---- Intro ---- */}
      <section className="section about-intro">
        <div className="container">
          <div className="about-intro__layout">
            <div className="about-intro__copy">
              <p className="about-intro__lead">{ABOUT.introTitle}</p>
              <p className="about-intro__body">{ABOUT.introBody}</p>
              <div className="about-intro__actions">
                <Button to="/menu" variant="gold">
                  Explore Our Menu
                </Button>
                <Button to="/contact" variant="outline">
                  Visit Kapresco
                </Button>
              </div>
            </div>

            <ul className="about-facts">
              <li>
                <span className="about-facts__value">{BRAND.address}</span>
                <span className="about-facts__label">Home base</span>
              </li>
              <li>
                <span className="about-facts__value">{BRAND.hours[0].value}</span>
                <span className="about-facts__label">Mon–Sat hours</span>
              </li>
              <li>
                <span className="about-facts__value">₱89.00</span>
                <span className="about-facts__label">Starting price</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Story ---- */}
      <section className="section about-story">
        <div className="container">
          <div className="about-split">
            <div className="about-split__media">
              <img src="/images/image-3-22762982.png" alt="A cozy corner at Kapresco" loading="lazy" />
            </div>
            <div className="about-split__copy">
              <p className="about-eyebrow">OUR BEGINNINGS</p>
              <h2>{ABOUT.storyTitle}</h2>
              <p>{ABOUT.storyBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Mission / Vision ---- */}
      <section className="section about-mission">
        <div className="container">
          <div className="grid grid--2 about-mission__grid">
            <article className="mission-card">
              <span className="mission-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="12" cy="12" r="0.6" fill="currentColor" />
                </svg>
              </span>
              <h2>{ABOUT.missionTitle}</h2>
              <p>{ABOUT.missionBody}</p>
            </article>

            <article className="mission-card">
              <span className="mission-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <h2>{ABOUT.visionTitle}</h2>
              <p>{ABOUT.visionBody}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ---- Core values ---- */}
      <section className="section section--values" id="values">
        <div className="container">
          <SectionHeading title={ABOUT.valuesTitle} />
          <div className="grid grid--2 about-values__grid">
            {ABOUT.values.map((v) => (
              <ValueCard key={v.title} icon={v.icon} iconSize={v.iconSize} title={v.title} description={v.body} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Team ---- */}
      <section className="section about-team" id="team">
        <div className="container">
          <SectionHeading title={ABOUT.teamTitle} description={ABOUT.teamBody} />

          {/* Figma layout: Row 1 = Mark, Ella (2-up, 384px each, 20px gap) */}
          <div className="about-team__row about-team__row--2">
            {ABOUT.team.slice(0, 2).map((member) => (
              <article key={member.name} className="team-card">
                <img src={member.image} alt={member.name} loading="lazy" className="team-card__photo" />
                <div className="team-card__body">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__text">{member.body}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Figma layout: Row 2 = Rhea, Paolo, Jenny (3-up in 1192px) */}
          <div className="about-team__row about-team__row--3">
            {ABOUT.team.slice(2).map((member) => (
              <article key={member.name} className="team-card">
                <img src={member.image} alt={member.name} loading="lazy" className="team-card__photo" />
                <div className="team-card__body">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__text">{member.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
