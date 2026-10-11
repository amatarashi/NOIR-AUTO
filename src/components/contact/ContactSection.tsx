import { Container } from "../Container";
import { Section } from "../Section";
import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../motion/Reveal";
import { IconCircle } from "../ui/Button";
import { ContactForm } from "./ContactForm";
import { SOCIALS } from "@/data/socials";
import { ADDRESS, BRAND_NAME, EMAIL, PHONE_HREF, PHONE_NUMBER, WORK_HOURS } from "@/lib/constants";

const POOLS =
  "radial-gradient(55% 50% at 20% 35%, rgba(255,255,255,0.06) 0%, transparent 65%), radial-gradient(40% 40% at 90% 70%, rgba(154,163,178,0.07) 0%, transparent 70%)";

/** Monochrome schematic "map" placeholder: thin street lines + pulsing salon marker. */
function MapSchematic() {
  return (
    <div role="img" aria-label={`Карта проезда: ${ADDRESS}`} className="glass relative aspect-[16/10] overflow-hidden rounded-lg">
      <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="#26272C" strokeLinecap="round">
          <path d="M-10 62h340M-10 138h340M70-10v220M232-10v220" strokeWidth="6" />
          <path d="M-10 168L330 18" strokeWidth="9" />
          <path d="M-10 100h120M150 100h180M150-10v110M110 100v110M190 138v72M270 62v76M20 62v76" strokeWidth="2" />
          <path d="M-10 30h80M232 170h98M70 30h162" strokeWidth="1.2" />
        </g>
        <g stroke="#34363C" strokeWidth="1">
          <rect x="84" y="74" width="54" height="22" rx="3" />
          <rect x="196" y="108" width="28" height="22" rx="3" />
          <rect x="244" y="74" width="20" height="56" rx="3" />
        </g>
        <circle className="map-pulse" cx="160" cy="118" r="9" stroke="#F4F4F2" strokeWidth="1.2" />
        <circle cx="160" cy="118" r="4.5" fill="#F4F4F2" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }} />
      </svg>
      <span className="chip absolute bottom-3 left-3" aria-hidden="true">
        {BRAND_NAME}
      </span>
    </div>
  );
}

export function ContactSection() {
  return (
    <Section id="contacts" tone="void-to-onyx" pools={POOLS} aria-labelledby="contacts-title">
      <Container>
        <SectionHeading
          num="07"
          eyebrow="Контакты"
          id="contacts-title"
          before={"Оставьте заявку —"}
          accent="свяжемся"
          after="в ближайшее время"
          subtitle="Расскажите немного о себе, мы подберём подходящую модель и запишем на тест-драйв."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-6">
          <Reveal className="glass rounded-xl px-5 py-8 sm:p-8 md:p-10 lg:col-span-7">
            <ContactForm />
          </Reveal>

          <Reveal variant="text" delay={120} className="flex min-w-0 flex-col gap-9 lg:col-span-5 lg:pl-10 lg:pt-3">
            <div className="flex flex-col gap-3">
              <span className="eyebrow">Телефон</span>
              <a href={`tel:${PHONE_HREF}`} className="phone-link self-start text-h3 font-light tabular-nums">
                {PHONE_NUMBER}
              </a>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
              <div>
                <dt className="eyebrow mb-2.5">Адрес</dt>
                <dd className="text-body-lg text-ink-secondary">{ADDRESS}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-2.5">Режим работы</dt>
                <dd className="text-body-lg text-ink-secondary">{WORK_HOURS}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-2.5">Email</dt>
                <dd className="text-body-lg">
                  <a href={`mailto:${EMAIL}`} className="text-ink-secondary transition-colors duration-240 hover:text-ink-primary">
                    {EMAIL}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="flex gap-3">
              {SOCIALS.map((social) => (
                <IconCircle key={social.label} href={social.href} aria-label={social.label}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {social.icon}
                  </svg>
                </IconCircle>
              ))}
            </div>

            <MapSchematic />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
