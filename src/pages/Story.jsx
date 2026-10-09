import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {motion, useInView, useReducedMotion} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════════════
   Motion tokens — one place for every duration, curve and offset on the page.
   Entrances: ease-out. State changes: ease-in-out. Small interactions are fast,
   storytelling transitions are slower.
   ═══════════════════════════════════════════════════════════════════════════ */
const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN_OUT = [0.65, 0, 0.35, 1];
const DURATION = {fast: 0.2, base: 0.5, slow: 0.7};
const OFFSET = 14;

const heroContainer = {
  hidden: {},
  show: {transition: {staggerChildren: 0.09, delayChildren: 0.05}},
};
const heroItem = {
  hidden: {opacity: 0, y: OFFSET},
  show: {
    opacity: 1,
    y: 0,
    transition: {duration: DURATION.base, ease: EASE_OUT},
  },
};

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const Icon = {
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6v4l2.5 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Conflict: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3L17 15H3L10 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 9v3M10 13.5v.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Chart: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="11" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.5" y="7" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="3" width="3" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

/* ─── Reveal: scroll-triggered entrance, once, reduced-motion safe ──────── */
const Reveal = ({children, delay = 0, className = "", as = "div"}) => {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduced ? false : {opacity: 0, y: OFFSET}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "0px 0px -80px 0px"}}
      transition={{duration: DURATION.base, ease: EASE_OUT, delay}}
    >
      {children}
    </Tag>
  );
};

/* ─── Content ───────────────────────────────────────────────────────────── */
const timelineData = [
  {
    month: "June",
    year: 2025,
    title: "The first idea",
    description:
      "We saw school teams spend weeks building timetables by hand. That sparked the idea for Protiba.",
  },
  {
    month: "July",
    year: 2025,
    title: "Building the engine",
    description:
      "We began building the scheduling engine and teaching it to spot clashes between classes, teachers and rooms.",
  },
  {
    month: "August",
    year: 2025,
    title: "The first prototype",
    description:
      "The first working screens made timetable planning easier to follow, even if you are not a tech expert.",
  },
  {
    month: "September",
    year: 2025,
    title: "Making it usable",
    description:
      "The dashboard and timetable views took shape, with a focus on keeping everyday tasks clear and quick.",
  },
  {
    month: "October",
    year: 2025,
    title: "Connecting the pieces",
    description:
      "We connected the app to the services it needs to save school data and build schedules.",
  },
  {
    month: "November",
    year: 2025,
    title: "Learning from schools",
    description:
      "Educators tried sample schedules and shared what worked. Their feedback helped us improve the product.",
  },
  {
    month: "Now",
    year: null,
    title: "Getting ready to launch",
    description:
      "We are polishing Protiba and preparing to bring it to more schools.",
  },
];

const problems = [
  "Building a timetable by hand can take weeks each term.",
  "One clash can affect teachers and students.",
  "A last-minute change can disrupt the whole week.",
  "Rooms and teachers can be left underused.",
];

const credits = [
  {
    name: "Robert Kirimi",
    role: "Support and encouragement",
    description:
      "My father believed in this idea from the start. His support helped me keep going through the hard parts.",
    initial: "RK",
  },
  {
    name: "Zeno Rocha",
    role: "Product inspiration",
    description:
      "Zeno's work at Resend inspired the care we put into Protiba's design and developer experience.",
    initial: "ZR",
  },
  {
    name: "Early Testers",
    role: "Early feedback",
    description:
      "Thank you to every educator and administrator who tried Protiba early and helped us make it more useful.",
    initial: "🙏",
  },
];

const heroFacts = [
  ["2025", "Started"],
  ["1", "Builder"],
  ["Kenya", "Made in"],
];

/* ─── Shared timetable data (illustrative) ──────────────────────────────── */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["08:00", "08:40", "09:20", "10:20"];

const SUBJECTS = {
  Mathematics: {short: "Maths", tone: "math"},
  English: {short: "Eng", tone: "lang"},
  Kiswahili: {short: "Kisw", tone: "lang"},
  Chemistry: {short: "Chem", tone: "sci"},
  Biology: {short: "Bio", tone: "sci"},
  Physics: {short: "Phys", tone: "sci"},
  History: {short: "Hist", tone: "hum"},
  Geography: {short: "Geo", tone: "hum"},
};

// SCHEDULE[day][period]
const SCHEDULE = [
  ["Mathematics", "English", "Chemistry", "Kiswahili"],
  ["Biology", "Mathematics", "History", "English"],
  ["English", "Physics", "Mathematics", "Geography"],
  ["Kiswahili", "Chemistry", "English", "Mathematics"],
  ["Mathematics", "Biology", "Geography", "History"],
];

/* ─── Scene 2: the scheduling problem ───────────────────────────────────── */
const TEACHER_WEEK = [
  [["F1E"], null, ["F2E"], null, ["F1W"]],
  [null, ["F1W"], ["F1E", "F2W"], ["F2E"], null],
  [["F2W"], null, null, ["F1E"], ["F2E"]],
];
const TEACHER_SLOTS = ["08:00", "08:40", "09:20"];

const ConflictDemo = () => {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, amount: 0.5});
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setFlagged(true);
      return undefined;
    }
    const t = setTimeout(() => setFlagged(true), 900);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  return (
    <figure className="frame frame--compact" ref={ref}>
      <div className="frame__bar">
        <span className="frame__title">Mr. Otieno · Mathematics</span>
        <span className="frame__tag">Illustrative example</span>
      </div>
      <div className="frame__body">
        <div className="mini" aria-hidden="true">
          <div className="mini__corner" />
          {DAYS.map((d) => (
            <div key={d} className="mini__day">
              {d}
            </div>
          ))}
          {TEACHER_SLOTS.map((time, r) => (
            <React.Fragment key={time}>
              <div className="mini__time">{time}</div>
              {TEACHER_WEEK[r].map((cell, d) => {
                const clash = cell && cell.length > 1;
                return (
                  <div
                    key={`${r}-${d}`}
                    className={[
                      "mini__cell",
                      cell ? "mini__cell--on" : "",
                      clash ? "mini__cell--clash" : "",
                      clash && flagged ? "is-flagged" : "",
                    ].join(" ")}
                  >
                    {cell && cell.map((c) => <span key={c}>{c}</span>)}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <figcaption className={`mini__caption ${flagged ? "is-on" : ""}`}>
          <Icon.Conflict />
          <span>
            Mr. Otieno is assigned to two classes at 08:40 on Wednesday.
          </span>
        </figcaption>
      </div>
    </figure>
  );
};

/* ─── Scene 3 + 4: how it works, and the result ─────────────────────────── */
const STEPS = [
  {
    title: "Add classes and subjects",
    body: "Add your classes, streams and subjects.",
  },
  {
    title: "Assign teachers and rooms",
    body: "Choose who teaches each subject and where lessons take place.",
  },
  {
    title: "Generate the timetable",
    body: "Protiba fits lessons into the school week.",
  },
  {
    title: "Review the week",
    body: "Check the weekly plan and make sure it works for your school.",
  },
];

const INPUTS = [
  {label: "Classes", from: 0, items: ["Form 1 East", "Form 1 West", "Form 2 East"]},
  {label: "Subjects", from: 0, items: ["Mathematics", "English", "Chemistry", "Biology"]},
  {label: "Teachers", from: 1, items: ["Ms. Wanjiru", "Mr. Otieno", "Ms. Achieng"]},
  {label: "Rooms", from: 1, items: ["Lab 1", "Room 4", "Room 7"]},
];

const STATUS = [
  "Classes and subjects are ready.",
  "Teachers and rooms are assigned.",
  "Adding lessons to the week.",
  "Example timetable ready, with no double-bookings.",
];

const TimetableGrid = ({filled}) => {
  const reduced = useReducedMotion();
  return (
    <div className="tt" aria-hidden="true">
      <div className="tt__corner" />
      {DAYS.map((d) => (
        <div key={d} className="tt__day">
          {d}
        </div>
      ))}
      {TIMES.map((time, r) => (
        <React.Fragment key={time}>
          <div className="tt__time">{time}</div>
          {DAYS.map((day, d) => {
            const name = SCHEDULE[d][r];
            const meta = SUBJECTS[name];
            const order = r * DAYS.length + d;
            return (
              <div key={day} className="tt__slot">
                <motion.div
                  className={`lesson lesson--${meta.tone}`}
                  initial={false}
                  animate={{opacity: filled ? 1 : 0, scale: filled ? 1 : 0.96}}
                  transition={
                    reduced
                      ? {duration: 0}
                      : {
                          duration: DURATION.fast + 0.1,
                          ease: EASE_OUT,
                          delay: filled ? order * 0.035 : 0,
                        }
                  }
                >
                  <span className="lesson__full">{name}</span>
                  <span className="lesson__short">{meta.short}</span>
                </motion.div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

const HowItWorks = () => {
  const reduced = useReducedMotion();
  const frameRef = useRef(null);
  const inView = useInView(frameRef, {once: true, margin: "0px 0px -20% 0px"});
  const [stage, setStage] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setStage(3);
      return undefined;
    }
    timers.current = [1600, 3400, 5200].map((ms, i) =>
      setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.current.forEach(clearTimeout);
  }, [inView, reduced]);

  const choose = (i) => {
    timers.current.forEach(clearTimeout);
    setStage(i);
  };

  return (
    <div className="how">
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              className={`step ${i === stage ? "is-active" : ""} ${i < stage ? "is-done" : ""}`}
              aria-current={i === stage ? "step" : undefined}
              onClick={() => choose(i)}
            >
              <span className="step__num">
                {i < stage ? <Icon.Check /> : i + 1}
              </span>
              <span className="step__text">
                <span className="step__title">{s.title}</span>
                <span className="step__body">{s.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="frame" ref={frameRef}>
        <div className="frame__bar">
          <span className="frame__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="frame__title">Protiba · Timetable</span>
          <span className="frame__tag">Illustrative demo</span>
        </div>
        <div className="frame__body">
          <div className="inputs">
            {INPUTS.map((g) => (
              <div
                key={g.label}
                className={`inputs__group ${stage >= g.from ? "is-active" : ""}`}
              >
                <span className="inputs__label">{g.label}</span>
                <div className="inputs__chips">
                  {g.items.map((it) => (
                    <span key={it} className="chip">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="tt__head">
            <span>Form 1 East</span>
            <span>Week view</span>
          </div>
          <TimetableGrid filled={stage >= 2} />

          <motion.p
            key={stage}
            className={`frame__status ${stage === 3 ? "is-done" : ""}`}
            initial={reduced ? false : {opacity: 0, y: 4}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: DURATION.fast, ease: EASE_IN_OUT}}
            aria-live="polite"
          >
            {stage === 3 && <Icon.Check />}
            {STATUS[stage]}
          </motion.p>
        </div>
      </div>

      <p className="sr-only">
        A sample Form 1 East weekly timetable, Monday to Friday, with four
        lessons per day, shown as an illustration of the generated result.
      </p>
    </div>
  );
};

/* ─── Scene 5: features with small purposeful visuals ───────────────────── */
const FvGenerate = () => {
  const cells = [
    "math", "lang", "sci", "hum", "lang",
    "sci", "math", "hum", "lang", "math",
    "lang", "sci", "math", "hum", "sci",
  ];
  return (
    <div className="fv" aria-hidden="true">
      <p className="fv__label">Form 1 East · one week</p>
      <div className="fv__grid">
        {cells.map((t, i) => (
          <span key={i} className={`fv__cell lesson--${t}`} />
        ))}
      </div>
    </div>
  );
};

const FvConflict = () => (
  <div className="fv" aria-hidden="true">
    <p className="fv__label">Example</p>
    <div className="fv__list">
      <div className="fv__item fv__item--warn">
        <Icon.Conflict />
        <span>
          <strong>Detected</strong> · Mr. Kamau is assigned to two classes at
          09:20 on Thursday.
        </span>
      </div>
      <div className="fv__item fv__item--ok">
        <Icon.Check />
        <span>
          <strong>Avoided</strong> · Each lesson is placed in a slot with no
          overlap.
        </span>
      </div>
    </div>
  </div>
);

const ROOMS = [
  ["Lab 1", [1, 1, 0, 1, 1]],
  ["Room 4", [1, 1, 1, 1, 0]],
  ["Room 7", [0, 1, 1, 0, 1]],
];

const FvResources = () => (
  <div className="fv" aria-hidden="true">
    <p className="fv__label">Room use across a week · example</p>
    <div className="fv__rooms">
      {ROOMS.map(([name, days]) => (
        <div key={name} className="fv__room">
          <span className="fv__room-name">{name}</span>
          <span className="fv__room-days">
            {days.map((on, i) => (
              <i key={i} className={on ? "is-on" : ""} />
            ))}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const FEATURES = [
  {
    icon: Icon.Clock,
    title: "Automated scheduling",
    description:
      "Create a timetable from your classes, subjects, teachers and rooms instead of starting from scratch.",
    benefit: "Less time lost to spreadsheets and rework at the start of every term.",
    Visual: FvGenerate,
  },
  {
    icon: Icon.Conflict,
    title: "Conflict resolution",
    description:
      "Protiba checks for clashes, like a teacher or room booked for two lessons at once.",
    benefit: "Catch timetable clashes before teachers and students rely on the plan.",
    Visual: FvConflict,
  },
  {
    icon: Icon.Chart,
    title: "Resource optimization",
    description:
      "Plan the use of classrooms, teachers and facilities across the school week.",
    benefit: "Make better use of rooms and labs throughout the week.",
    Visual: FvResources,
  },
];

/* ─── Timeline item ─────────────────────────────────────────────────────── */
const TimelineItem = ({milestone, index}) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="timeline__item"
      initial={reduced ? false : {opacity: 0, y: OFFSET}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "0px 0px -60px 0px"}}
      transition={{duration: DURATION.base, ease: EASE_OUT}}
    >
      <div className="timeline__content">
        <div className="timeline__month">
          {milestone.month}
          {milestone.year ? ` ${milestone.year}` : ""}
        </div>
        <h3 className="timeline__title">{milestone.title}</h3>
        <p className="timeline__desc">{milestone.description}</p>
      </div>
      <div className="timeline__node" aria-hidden="true">
        <div className="timeline__node-inner">{index + 1}</div>
      </div>
      <div className="timeline__spacer" />
    </motion.div>
  );
};

/* ─── Page ──────────────────────────────────────────────────────────────── */
const Story = () => {
  const reduced = useReducedMotion();
  const heroInitial = reduced ? "show" : "hidden";

  return (
    <>
      <style>{css}</style>
      <div className="story-root">
        {/* Hero */}
        <section className="hero">
          <div className="hero__bg" aria-hidden="true" />
          <motion.div
            className="hero__inner"
            variants={heroContainer}
            initial={heroInitial}
            animate="show"
          >
            <motion.div variants={heroItem} className="pill">
              <span className="pill__dot" />
              Company story
            </motion.div>
            <motion.h1 variants={heroItem} className="hero__title">
              Made for the people
              <br />
              <span className="hero__accent">who keep schools running.</span>
            </motion.h1>
            <motion.p variants={heroItem} className="hero__subtitle">
              We saw school teams spending weeks building timetables by hand.
              Protiba helps turn classes, teachers and rooms into a workable
              schedule in minutes.
            </motion.p>
            <motion.dl variants={heroItem} className="facts">
              {heroFacts.map(([v, l]) => (
                <div key={l} className="facts__item">
                  <dd className="facts__value">{v}</dd>
                  <dt className="facts__label">{l}</dt>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </section>

        {/* Scene 2 — The problem */}
        <section className="section">
          <div className="container split">
            <div className="split__text">
              <Reveal>
                <div className="eyebrow">The problem</div>
                <h2 className="title">
                  Making a school timetable
                  <br />
                  is a lot to juggle.
                </h2>
                <p className="body">
                  Classes, subjects, teachers and rooms all need to fit
                  together. Doing it by hand takes time away from supporting
                  teachers and students.
                </p>
              </Reveal>
              <ul className="problems">
                {problems.map((p, i) => (
                  <Reveal key={p} as="li" className="problem" delay={i * 0.06}>
                    <span className="problem__mark" aria-hidden="true" />
                    <span>{p}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
            <Reveal delay={0.1} className="split__visual">
              <ConflictDemo />
            </Reveal>
          </div>
        </section>

        {/* Scene 3 + 4 — How it works, and the result */}
        <section className="section section--tinted">
          <div className="container">
            <Reveal className="head">
              <div className="eyebrow">How it works</div>
              <h2 className="title">From school data to a weekly timetable.</h2>
              <p className="body body--centered">
                Follow a sample school as Protiba builds a weekly timetable.
              </p>
            </Reveal>
            <HowItWorks />
          </div>
        </section>

        {/* Scene 5 — Features */}
        <section className="section">
          <div className="container">
            <Reveal className="head">
              <div className="eyebrow">Why it matters</div>
              <h2 className="title">Tools for the everyday work of running a school.</h2>
            </Reveal>
            <div className="features">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={`feature ${i % 2 ? "feature--flip" : ""}`}
                >
                  <Reveal className="feature__text">
                    <div className="feature__icon">
                      <f.icon />
                    </div>
                    <h3 className="feature__title">{f.title}</h3>
                    <p className="feature__desc">{f.description}</p>
                    <p className="feature__benefit">{f.benefit}</p>
                  </Reveal>
                  <Reveal delay={0.08} className="feature__visual">
                    <f.Visual />
                </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section section--tinted">
          <div className="container">
            <Reveal className="head">
              <div className="eyebrow">The journey</div>
              <h2 className="title">How Protiba came together.</h2>
            </Reveal>
            <div className="timeline">
              <div className="timeline__line" aria-hidden="true" />
              {timelineData.map((m, i) => (
                <TimelineItem key={m.title} milestone={m} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Credits */}
        <section className="section">
          <div className="container">
            <Reveal className="head">
              <div className="eyebrow">Gratitude</div>
              <h2 className="title">None of this happens alone.</h2>
              <p className="body body--centered">
                Protiba grew with help from people who shared their time,
                ideas and honest feedback.
              </p>
            </Reveal>
            <div className="credits">
              {credits.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.08}>
                  <div className="credit">
                    <div className="credit__avatar">{c.initial}</div>
                    <h3 className="credit__name">{c.name}</h3>
                    <p className="credit__role">{c.role}</p>
                    <p className="credit__desc">{c.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Scene 6 — Invitation */}
        <section className="cta">
          <Reveal className="cta__inner">
            <div className="eyebrow eyebrow--center">Ready when you are</div>
            <h2 className="cta__title">
              Make timetable season easier.
            </h2>
                <p className="cta__body">
              Add your classes, teachers and rooms, then see them come
              together in a weekly timetable.
            </p>
            <div className="cta__actions">
              <Link to="/signup" className="btn btn--primary">
                Set up your school <Icon.Arrow />
              </Link>
              <Link to="/" className="btn btn--ghost">
                View demo
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
};


const css = `
  .story-root {
    /* colour */
    --bg: var(--ui-bg, #f8f8f8);
    --surface: var(--ui-surface, #ffffff);
    --surface-2: var(--ui-surface-muted, #f5f5f5);
    --border: var(--ui-border-subtle, rgba(43, 43, 43, 0.06));
    --text: var(--ui-text, #2b2b2b);
    --text-2: var(--ui-text-muted, #6e6e6e);
    --text-3: var(--ui-text-subtle, #858585);
    --accent: var(--ui-secondary, #2b9c5a);
    --warn: var(--ui-warning, #f59e0b);
    --danger: var(--ui-danger, #ef4444);

    /* layout */
    --w: 1040px;
    --pad: clamp(20px, 5vw, 32px);
    --section-y: clamp(72px, 10vw, 112px);

    /* shape */
    --r-sm: 8px;
    --r-md: 12px;
    --r-lg: 16px;
    --btn-h: 44px;
    --shadow-sm: 0 1px 2px rgba(20, 24, 22, 0.04);
    --shadow-md: 0 16px 40px -16px rgba(20, 24, 22, 0.16);

    /* motion (CSS-side) */
    --ease: cubic-bezier(0.22, 1, 0.36, 1);
    --t-fast: 160ms;
    --t-base: 260ms;

    font-family: var(--ui-font-sans, "Avenir Next", "Nunito Sans", "Trebuchet MS", system-ui, sans-serif);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
  }
  @media (prefers-reduced-motion: reduce) {
    .story-root { --t-fast: 0ms; --t-base: 0ms; }
  }

  .story-root *, .story-root *::before, .story-root *::after { box-sizing: border-box; }
  .story-root h1, .story-root h2, .story-root h3, .story-root p,
  .story-root ul, .story-root ol, .story-root dl, .story-root dd,
  .story-root figure { margin: 0; }
  .story-root ul, .story-root ol { padding: 0; list-style: none; }
  .story-root :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .story-root .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }

  /* ── Lesson tones (shared by timetable + feature visuals) ── */
  .lesson--sci  { background: #e8f3ec; border-color: #cfe5d8; color: #1e5a3d; }
  .lesson--lang { background: #f1efea; border-color: #e2dfd7; color: #4a4d49; }
  .lesson--hum  { background: #f8efe0; border-color: #eddcb9; color: #7a5a1d; }
  .lesson--math { background: #e9eef5; border-color: #d3dceb; color: #35496b; }

  /* ── Layout primitives ── */
  .section { padding: var(--section-y) var(--pad); }
  .section--tinted { background: var(--surface-2); border-block: 1px solid var(--border); }
  .container { max-width: var(--w); margin: 0 auto; }
  .head { text-align: center; max-width: 640px; margin: 0 auto clamp(40px, 6vw, 64px); }

  .eyebrow {
    display: inline-block;
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 14px;
  }
  .eyebrow--center { display: block; text-align: center; }
  .title {
    font-size: clamp(26px, 3.6vw, 38px);
    font-weight: 700; letter-spacing: 0; line-height: 1.15;
    color: var(--text);
    margin-bottom: 16px;
    text-wrap: balance;
  }
  .body { font-size: 16px; line-height: 1.7; color: var(--text-2); max-width: 52ch; }
  .body--centered { margin-inline: auto; }

  /* ── Hero ── */
  .hero {
    position: relative;
    padding: clamp(96px, 14vw, 160px) var(--pad) clamp(72px, 10vw, 112px);
    text-align: center;
  }
  .hero__bg {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 70% 50% at 50% 0%,
      color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%);
  }
  .hero__inner { position: relative; max-width: 760px; margin: 0 auto; }
  .pill {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--border));
    padding: 6px 14px; border-radius: 999px;
    margin-bottom: 24px;
  }
  .pill__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  .hero__title {
    font-size: clamp(36px, 5.4vw, 60px);
    font-weight: 800; letter-spacing: 0; line-height: 1.08;
    margin-bottom: 22px;
    text-wrap: balance;
  }
  .hero__accent { color: var(--accent); }
  .hero__subtitle {
    font-size: clamp(16px, 2vw, 18px); line-height: 1.65; color: var(--text-2);
    max-width: 520px; margin: 0 auto 36px;
  }
  .facts {
    display: inline-flex; flex-wrap: wrap; justify-content: center;
    background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--r-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .facts__item {
    display: flex; flex-direction: column-reverse; align-items: center;
    flex: 1 1 130px; padding: 18px 28px;
    border-right: 1px solid var(--border);
  }
  .facts__item:last-child { border-right: 0; }
  .facts__value { font-size: 22px; font-weight: 700; letter-spacing: 0; }
  .facts__label {
    font-size: 11px; font-weight: 500; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;
  }

  /* ── Problem ── */
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 7vw, 72px); align-items: center; }
  .problems { display: grid; gap: 12px; margin-top: 28px; }
  .problem { display: flex; gap: 12px; align-items: flex-start; font-size: 15px; line-height: 1.6; color: var(--text-2); }
  .problem__mark {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--warn); flex-shrink: 0; margin-top: 9px;
  }

  /* ── Product frame (shared) ── */
  .frame {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    min-width: 0;
  }
  .frame__bar {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
  }
  .frame__dots { display: inline-flex; gap: 5px; }
  .frame__dots i { width: 8px; height: 8px; border-radius: 50%; background: var(--border); display: block; }
  .frame__title { font-size: 12px; font-weight: 500; color: var(--text-2); }
  .frame__tag {
    margin-left: auto;
    font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--text-3);
  }
  .frame__body { padding: 16px; }
  .frame--compact .frame__body { padding: 16px 16px 14px; }

  /* ── Mini teacher week (problem) ── */
  .mini {
    display: grid;
    grid-template-columns: 40px repeat(5, minmax(0, 1fr));
    gap: 5px;
  }
  .mini__day, .tt__day {
    font-size: 11px; font-weight: 600; color: var(--text-3);
    text-align: center; padding-bottom: 2px;
  }
  .mini__time, .tt__time {
    font-size: 10px; color: var(--text-3);
    display: flex; align-items: center;
    font-variant-numeric: tabular-nums;
  }
  .mini__cell {
    min-height: 44px;
    border-radius: 6px;
    border: 1px dashed var(--border);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px;
    font-size: 10.5px; font-weight: 600; color: #35496b;
    transition: background var(--t-base) var(--ease), border-color var(--t-base) var(--ease);
  }
  .mini__cell--on { background: #e9eef5; border: 1px solid #d3dceb; }
  .mini__cell--clash.is-flagged {
    background: color-mix(in srgb, var(--danger) 9%, var(--surface));
    border-color: color-mix(in srgb, var(--danger) 45%, var(--border));
    color: var(--danger);
  }
  .mini__caption {
    display: flex; align-items: flex-start; gap: 10px;
    margin-top: 14px; min-height: 40px;
    font-size: 13px; line-height: 1.5; color: var(--danger);
    opacity: 0; transform: translateY(4px);
    transition: opacity var(--t-base) var(--ease), transform var(--t-base) var(--ease);
  }
  .mini__caption svg { flex-shrink: 0; margin-top: 1px; }
  .mini__caption.is-on { opacity: 1; transform: none; }

  /* ── How it works ── */
  .how { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 56px); align-items: start; }
  .steps { display: grid; gap: 4px; }
  .step {
    width: 100%; text-align: left; font: inherit; color: inherit;
    display: flex; gap: 14px; align-items: flex-start;
    padding: 14px 16px;
    background: transparent;
    border: 1px solid transparent; border-radius: var(--r-md);
    cursor: pointer;
    opacity: 0.55;
    transition: opacity var(--t-base) var(--ease), background var(--t-base) var(--ease), border-color var(--t-base) var(--ease);
  }
  .step:hover { opacity: 0.85; }
  .step.is-done { opacity: 0.75; }
  .step.is-active { opacity: 1; background: var(--surface); border-color: var(--border); box-shadow: var(--shadow-sm); }
  .step__num {
    width: 26px; height: 26px; flex-shrink: 0;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
    color: var(--text-2);
    background: var(--surface); border: 1px solid var(--border);
    transition: background var(--t-base) var(--ease), color var(--t-base) var(--ease), border-color var(--t-base) var(--ease);
  }
  .step.is-active .step__num, .step.is-done .step__num { background: var(--accent); border-color: var(--accent); color: #fff; }
  .step__text { display: grid; gap: 4px; }
  .step__title { font-size: 15px; font-weight: 600; letter-spacing: 0; }
  .step__body { font-size: 13.5px; line-height: 1.55; color: var(--text-2); }

  .inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; margin-bottom: 16px; }
  .inputs__group { opacity: 0.35; transition: opacity var(--t-base) var(--ease); min-width: 0; }
  .inputs__group.is-active { opacity: 1; }
  .inputs__label {
    display: block; font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-3); margin-bottom: 6px;
  }
  .inputs__chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip {
    font-size: 11px; color: var(--text-2);
    background: var(--surface-2); border: 1px solid var(--border);
    padding: 3px 8px; border-radius: 6px; white-space: nowrap;
  }

  .tt__head {
    display: flex; justify-content: space-between;
    font-size: 11px; font-weight: 600; color: var(--text-3);
    padding-top: 14px; margin-bottom: 8px;
    border-top: 1px solid var(--border);
  }
  .tt { display: grid; grid-template-columns: 40px repeat(5, minmax(0, 1fr)); gap: 5px; }
  .tt__slot { border-radius: 6px; border: 1px dashed var(--border); min-height: 38px; }
  .lesson {
    height: 100%; min-height: 36px;
    border: 1px solid; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px;
    font-size: 11px; font-weight: 600; text-align: center; line-height: 1.2;
  }
  .lesson__short { display: none; }

  .frame__status {
    display: flex; align-items: center; gap: 8px;
    min-height: 40px; margin-top: 14px; padding-top: 14px;
    border-top: 1px solid var(--border);
    font-size: 13px; color: var(--text-2);
  }
  .frame__status.is-done { color: var(--accent); font-weight: 500; }

  /* ── Features ── */
  .features { display: grid; }
  .feature {
    display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 72px); align-items: center;
    padding-block: clamp(32px, 5vw, 56px);
    border-top: 1px solid var(--border);
  }
  .feature:first-child { border-top: 0; padding-top: 0; }
  .feature--flip .feature__text { order: 2; }
  .feature__icon {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--border));
    margin-bottom: 18px;
  }
  .feature__title { font-size: 22px; font-weight: 700; letter-spacing: 0; margin-bottom: 10px; }
  .feature__desc { font-size: 15px; line-height: 1.65; color: var(--text-2); margin-bottom: 14px; max-width: 46ch; }
  .feature__benefit { font-size: 14px; line-height: 1.6; font-weight: 500; color: var(--text); max-width: 46ch; }

  .fv {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 20px; box-shadow: var(--shadow-sm);
  }
  .fv__label {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-3); margin-bottom: 14px;
  }
  .fv__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
  .fv__cell { height: 30px; border-radius: 6px; border: 1px solid; }
  .fv__list { display: grid; gap: 8px; }
  .fv__item {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 12px 14px; font-size: 13px; line-height: 1.5; color: var(--text-2);
    border: 1px solid var(--border); border-radius: var(--r-md);
  }
  .fv__item svg { flex-shrink: 0; margin-top: 1px; }
  .fv__item strong { color: var(--text); font-weight: 600; }
  .fv__item--warn {
    color: var(--warn);
    background: color-mix(in srgb, var(--warn) 7%, var(--surface));
    border-color: color-mix(in srgb, var(--warn) 30%, var(--border));
  }
  .fv__item--warn span { color: var(--text-2); }
  .fv__item--ok {
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 7%, var(--surface));
    border-color: color-mix(in srgb, var(--accent) 25%, var(--border));
  }
  .fv__item--ok span { color: var(--text-2); }
  .fv__rooms { display: grid; gap: 10px; }
  .fv__room { display: grid; grid-template-columns: 64px 1fr; gap: 12px; align-items: center; }
  .fv__room-name { font-size: 12px; font-weight: 500; color: var(--text-2); }
  .fv__room-days { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; }
  .fv__room-days i {
    height: 22px; border-radius: 5px; display: block;
    background: var(--surface-2); border: 1px dashed var(--border);
  }
  .fv__room-days i.is-on {
    background: color-mix(in srgb, var(--accent) 14%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
  }

  /* ── Timeline ── */
  .timeline { position: relative; max-width: 760px; margin: 0 auto; padding: 8px 0; }
  .timeline__line {
    position: absolute; left: 20px; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 8%, var(--border) 92%, transparent);
  }
  .timeline__item {
    display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 20px;
    margin-bottom: 24px; align-items: start;
  }
  .timeline__item:last-child { margin-bottom: 0; }
  .timeline__item .timeline__content { grid-column: 2; grid-row: 1; text-align: left; }
  .timeline__item .timeline__node { grid-column: 1; grid-row: 1; }
  .timeline__item .timeline__spacer { display: none; }
  .timeline__node { display: flex; align-items: center; justify-content: center; z-index: 1; }
  .timeline__node-inner {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--surface); border: 2px solid var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--accent);
  }
  .timeline__content {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 20px 22px;
    transition: border-color var(--t-base) var(--ease);
  }
  .timeline__content:hover { border-color: color-mix(in srgb, var(--accent) 30%, var(--border)); }
  .timeline__month {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--accent); margin-bottom: 6px;
  }
  .timeline__title { font-size: 17px; font-weight: 700; letter-spacing: 0; margin-bottom: 8px; }
  .timeline__desc { font-size: 14px; line-height: 1.65; color: var(--text-2); }

  /* ── Credits ── */
  .credits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .credit {
    height: 100%;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 28px 24px;
  }
  .credit__avatar {
    width: 48px; height: 48px; border-radius: 12px;
    background: var(--surface-2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 700; color: var(--accent);
    margin-bottom: 16px; letter-spacing: 0;
  }
  .credit__name { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .credit__role {
    font-size: 12px; font-weight: 600; color: var(--accent);
    margin-bottom: 12px;
  }
  .credit__desc { font-size: 13.5px; line-height: 1.65; color: var(--text-2); }

  /* ── CTA ── */
  .cta { padding: clamp(80px, 12vw, 128px) var(--pad); text-align: center; }
  .cta__inner { max-width: 600px; margin: 0 auto; }
  .cta__title {
    font-size: clamp(30px, 4.4vw, 46px); font-weight: 800;
    letter-spacing: 0; line-height: 1.1; margin-bottom: 16px;
    text-wrap: balance;
  }
  .cta__body { font-size: 16px; line-height: 1.65; color: var(--text-2); margin: 0 auto 36px; max-width: 48ch; }
  .cta__actions { display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    height: var(--btn-h); padding: 0 22px;
    border-radius: var(--r-md);
    font: inherit; font-size: 14px; font-weight: 600; text-decoration: none;
    transition: background var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease),
      color var(--t-fast) var(--ease), transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease);
  }
  .btn--primary {
    background: var(--accent); color: #fff; border: 1px solid var(--accent);
    box-shadow: 0 1px 2px rgba(20, 24, 22, 0.12);
  }
  .btn--primary:hover {
    background: color-mix(in srgb, var(--accent) 88%, #000);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px -6px color-mix(in srgb, var(--accent) 55%, transparent);
  }
  .btn--ghost { background: var(--surface); color: var(--text-2); border: 1px solid var(--border); }
  .btn--ghost:hover { color: var(--text); border-color: color-mix(in srgb, var(--text) 25%, var(--border)); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .how { grid-template-columns: 1fr; }
    .split { grid-template-columns: 1fr; }
    .feature, .feature--flip { grid-template-columns: 1fr; gap: 28px; }
    .feature--flip .feature__text { order: 0; }
    .credits { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .timeline__line { left: 15px; }
    .timeline__item { grid-template-columns: 32px minmax(0, 1fr); gap: 12px; }
    .timeline__content { padding: 16px; }
  }
  @media (max-width: 520px) {
    .facts { display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; }
    .facts__item { padding: 14px 8px; }
    .inputs { grid-template-columns: 1fr; }
    .frame__body { padding: 12px; }
    .mini, .tt { grid-template-columns: 34px repeat(5, minmax(0, 1fr)); gap: 4px; }
    .lesson { font-size: 10px; padding: 0 2px; }
    .lesson__full { display: none; }
    .lesson__short { display: inline; }
    .cta__actions .btn { width: 100%; }
  }
`;

export default Story;