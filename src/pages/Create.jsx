// pages/Create.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Plus} from "lucide-react";
import {useAuthStore} from "../store/authStore";
import Notification from "./components/notification";
import {
  CREATE_CSS,
  ChipPicker,
  ChoiceGroup,
  ClassPreview,
  ContinueButton,
  GeneratingState,
  IntroOverview,
  LargeInput,
  ProgressCompact,
  ProgressRail,
  QuestionStep,
  ReviewSummary,
  StepTransition,
  TagInput,
  TeacherCard,
  splitList as list,
} from "./Createui";


const COPY = {
  railTitle: "Configure timetable",
  railSubtitle: "New schedule",
  intro: {
    title: "Let's set up your timetable.",
    lead: "A few short questions about your school. Protiba uses your answers to generate the schedule.",
    why: "This information is saved and is used to curate your timetable later.",
    items: [
      {label: "Institution", desc: "Your school's name"},
      {label: "Subjects", desc: "What your school teaches"},
      {label: "Classes", desc: "How your classes are structured"},
      {label: "Teachers", desc: "Who teaches what, and where"},
    ],
    button: "Get started",
  },
  institution: {
    title: "What's your institution called?",
    lead: "Tell us the name of the school you're creating this timetable for.",
    why: "This information is saved and is used to curate your timetable later.",
    placeholder: "e.g. Nyeri High School",
    button: "Save & continue",
  },
  subjects: {
    title: "What subjects are taught at your institution?",
    lead: "Type a subject and press Enter. Add as many as you need.",
    why: "This information is saved and is used to curate your timetable later.",
    placeholder: "e.g. Mathematics",
    hint: "You can also paste a comma-separated list.",
    button: "Continue to classes",
  },
  classType: {
    title: "What do you call your classes?",
    lead: "Pick the word your school uses for a year group.",
    why: "This information is saved and is used to curate your timetable later.",
    button: "Continue",
  },
  minLevel: {
    title: "What's the lowest level?",
    lead: (type) => `The first level you teach. For example, ${type || "Form"} 1.`,
    why: "This information is saved and is used to curate your timetable later.",
    placeholder: "1",
    button: "Continue",
  },
  maxLevel: {
    title: "And the highest level?",
    lead: "The last level you teach.",
    why: "This information is saved and is used to curate your timetable later.",
    placeholder: "6",
    button: "Continue",
  },
  sections: {
    title: "Do your classes have sections?",
    lead: "Sections or streams, like A, B and C. Leave this blank if each level is a single class.",
    why: "This information is saved and is used to curate your timetable later.",
    placeholder: "e.g. A",
    hint: "Letters are converted to uppercase.",
    buttonWith: "Continue to teachers",
    buttonWithout: "Continue without sections",
  },
  teacherName: {
    titleFirst: "Let's add your first teacher.",
    titleNext: (n) => `Now teacher ${n}.`,
    lead: "What's their name?",
    why: "This information is saved and is used to curate your timetable later.",
    placeholder: "e.g. Mr. Kamau",
    button: "Continue",
  },
  teacherSubjects: {
    title: (name) => `What does ${name} teach?`,
    lead: "Choose every subject they teach.",
    why: "This information is saved and is used to curate your timetable later.",
    empty: "There are no subjects yet. Go back and add some first.",
    button: "Continue",
  },
  teacherClasses: {
    title: (name) => `Which classes does ${name} teach?`,
    lead: "Choose every class they're responsible for.",
    why: "This information is saved and is used to curate your timetable later.",
    empty: "There are no classes yet. Go back and set up your classes first.",
    button: "Add teacher",
  },
  another: {
    title: "Add another teacher?",
    lead: (n) => `You've added ${n} ${n === 1 ? "teacher" : "teachers"} so far.`,
    why: "This information is saved and is used to curate your timetable later.",
    addButton: "Add another teacher",
    button: "Review configuration",
  },
  review: {
    title: "Review your timetable setup",
    lead: "Check everything below. You can edit any section before saving.",
    why: "This information is saved and is used to curate your timetable later.",
    button: "Save configuration",
  },
  saveAndReview: "Save & review",
  resumed: "Welcome back. We've restored your progress from this device.",
  startOverConfirm:
    "Start over? This clears the progress saved on this device.",
};

const SAVED = {
  institution: "Institution saved",
  subjects: "Subjects saved",
  classType: "Class type saved",
  minLevel: "Lowest level saved",
  maxLevel: "Highest level saved",
  sections: "Class sections saved",
  teacherName: "Name saved",
  teacherSubjects: "Subjects saved",
  teacherClasses: "Teacher added",
};

/* ═════════════════════════════════════════════════════════════════════════
   Wizard definition
   ═════════════════════════════════════════════════════════════════════════ */
const STEP_ORDER = [
  "intro",
  "institution",
  "subjects",
  "classType",
  "minLevel",
  "maxLevel",
  "sections",
  "teacherName",
  "teacherSubjects",
  "teacherClasses",
  "another",
  "review",
  "generate",
];

const PHASES = [
  {id: "institution", label: "Institution", steps: ["institution"], doneOn: "institution"},
  {id: "subjects", label: "Subjects", steps: ["subjects"], doneOn: "subjects"},
  {
    id: "classes",
    label: "Classes",
    steps: ["classType", "minLevel", "maxLevel", "sections"],
    doneOn: "sections",
  },
  {
    id: "teachers",
    label: "Teachers",
    steps: ["teacherName", "teacherSubjects", "teacherClasses", "another"],
    doneOn: "another",
  },
  {id: "review", label: "Review", steps: ["review", "generate"], doneOn: null},
];

const TEACHER_STEPS = new Set(["teacherName", "teacherSubjects", "teacherClasses"]);
const REVIEW_SHORTCUT = new Set(["institution", "subjects", "sections"]);
const EDIT_ENTRY = new Set(["institution", "subjects", "classType", "another"]);
const CLASS_TYPE_OPTIONS = ["Grade", "Class", "Form"];

function getNext(step, fromReview) {
  if (fromReview && REVIEW_SHORTCUT.has(step)) return "review";
  return STEP_ORDER[STEP_ORDER.indexOf(step) + 1];
}

function getPrev(step, state) {
  if (state.fromReview && EDIT_ENTRY.has(step)) return "review";
  if (step === "teacherName") {
    return state.completed.includes("teacherClasses") ? "another" : "sections";
  }
  return STEP_ORDER[STEP_ORDER.indexOf(step) - 1];
}

/* ═════════════════════════════════════════════════════════════════════════
   Data helpers
   ═════════════════════════════════════════════════════════════════════════ */
const uid = () => Math.random().toString(36).slice(2, 9);
const newTeacher = () => ({id: uid(), name: "", subjects: "", classes: ""});
const emptyForm = () => ({
  schoolName: "",
  subjectName: "",
  minLevel: "",
  maxLevel: "",
  classTypes: "",
  classLabels: "",
  teachers: [newTeacher()],
});
const initState = () => ({
  step: "intro",
  direction: 1,
  completed: [],
  teacherIndex: 0,
  fromReview: false,
  formData: emptyForm(),
});

function generateClassOptions(form) {
  const options = [];
  const min = parseInt(form.minLevel) || 0;
  const max = parseInt(form.maxLevel) || 0;
  const labels = form.classLabels
    .split(",")
    .map((l) => l.trim().toUpperCase())
    .filter(Boolean);
  if (min && max && min <= max && form.classTypes) {
    for (let level = min; level <= max; level++) {
      if (labels.length > 0)
        labels.forEach((label) => options.push(`${form.classTypes} ${level}${label}`));
      else options.push(`${form.classTypes} ${level}`);
    }
  }
  return options;
}

function reconcile(form) {
  const subjects = list(form.subjectName);
  const classes = generateClassOptions(form);
  return {
    ...form,
    teachers: form.teachers.map((t) => ({
      ...t,
      subjects: list(t.subjects).filter((s) => subjects.includes(s)).join(", "),
      classes: list(t.classes).filter((c) => classes.includes(c)).join(", "),
    })),
  };
}

const isLevel = (v) => /^\d+$/.test(String(v)) && parseInt(v, 10) >= 1;
const LEVEL_MESSAGE = "Enter a whole number, 1 or higher.";

function validateStep(step, form, teacherIndex) {
  const teacher = form.teachers[teacherIndex];
  switch (step) {
    case "institution":
      return form.schoolName.trim() ? null : "Enter your school's name to continue.";
    case "subjects":
      return list(form.subjectName).length ? null : "Add at least one subject to continue.";
    case "classType":
      return CLASS_TYPE_OPTIONS.includes(form.classTypes)
        ? null
        : "Choose how your classes are named.";
    case "minLevel":
      return isLevel(form.minLevel) ? null : LEVEL_MESSAGE;
    case "maxLevel":
      if (!isLevel(form.maxLevel)) return LEVEL_MESSAGE;
      if (parseInt(form.maxLevel, 10) < parseInt(form.minLevel, 10))
        return `The highest level can't be lower than ${form.minLevel}.`;
      return null;
    case "teacherName":
      return teacher?.name.trim() ? null : "Enter the teacher's name to continue.";
    case "teacherSubjects":
      return list(teacher?.subjects).length ? null : "Choose at least one subject.";
    case "teacherClasses":
      return list(teacher?.classes).length ? null : "Choose at least one class.";
    default:
      return null;
  }
}

const STEP_LABEL = {
  institution: "Institution",
  subjects: "Subjects",
  classType: "Class type",
  minLevel: "Lowest level",
  maxLevel: "Highest level",
};

function collectIssues(form) {
  const issues = [];
  ["institution", "subjects", "classType", "minLevel", "maxLevel"].forEach((step) => {
    const message = validateStep(step, form, 0);
    if (message) issues.push({step, teacherIndex: 0, message: `${STEP_LABEL[step]}: ${message}`});
  });
  const real = form.teachers
    .map((t, i) => ({t, i}))
    .filter(({t}) => t.name.trim() || t.subjects.trim() || t.classes.trim());
  if (real.length === 0) {
    issues.push({step: "teacherName", teacherIndex: 0, message: "Add at least one teacher."});
  }
  real.forEach(({t, i}) => {
    const who = t.name.trim() || `Teacher ${i + 1}`;
    ["teacherName", "teacherSubjects", "teacherClasses"].forEach((step) => {
      const message = validateStep(step, form, i);
      if (message) issues.push({step, teacherIndex: i, message: `${who}: ${message}`});
    });
  });
  return issues;
}

/* ═════════════════════════════════════════════════════════════════════════
   Draft persistence
   Browser-local only (localStorage). The server is only contacted by the
   final completeOnboarding() call, so "saved" always means "on this device".
   ═════════════════════════════════════════════════════════════════════════ */
const DRAFT_KEY = "protiba:timetable-draft";
const DRAFT_VERSION = 1;

const isPristine = (s) => {
  const f = s.formData;
  return (
    s.step === "intro" &&
    !f.schoolName &&
    !f.subjectName &&
    !f.minLevel &&
    !f.maxLevel &&
    !f.classTypes &&
    !f.classLabels &&
    f.teachers.every((t) => !t.name && !t.subjects && !t.classes)
  );
};

function saveDraft(s) {
  if (isPristine(s)) return true;
  try {
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        v: DRAFT_VERSION,
        step: s.step === "generate" ? "review" : s.step,
        completed: s.completed,
        teacherIndex: s.teacherIndex,
        fromReview: s.fromReview,
        formData: s.formData,
        savedAt: Date.now(),
      }),
    );
    return true;
  } catch {
    return false;
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* nothing to clear */
  }
}

function loadDraft() {
  const fresh = {state: initState(), restored: false};
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return fresh;
    const d = JSON.parse(raw);
    if (!d || d.v !== DRAFT_VERSION || typeof d.formData !== "object") return fresh;

    const str = (v) => (typeof v === "string" ? v : "");
    const teachers =
      Array.isArray(d.formData.teachers) && d.formData.teachers.length
        ? d.formData.teachers.map((t) => ({
            id: str(t?.id) || uid(),
            name: str(t?.name),
            subjects: str(t?.subjects),
            classes: str(t?.classes),
          }))
        : [newTeacher()];
    const formData = {
      schoolName: str(d.formData.schoolName),
      subjectName: str(d.formData.subjectName),
      minLevel: str(d.formData.minLevel),
      maxLevel: str(d.formData.maxLevel),
      classTypes: str(d.formData.classTypes),
      classLabels: str(d.formData.classLabels),
      teachers,
    };

    let step = STEP_ORDER.includes(d.step) ? d.step : "intro";
    if (step === "generate") step = "review";
    const state = {
      step,
      direction: 1,
      completed: Array.isArray(d.completed)
        ? d.completed.filter((s) => STEP_ORDER.includes(s))
        : [],
      teacherIndex: Math.min(Math.max(Number(d.teacherIndex) || 0, 0), teachers.length - 1),
      fromReview: Boolean(d.fromReview),
      formData,
    };
    return {state, restored: !isPristine(state)};
  } catch {
    return fresh;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "replace":
      return action.state;
    case "field":
      return {...state, formData: {...state.formData, [action.name]: action.value}};
    case "teacherField":
      return {
        ...state,
        formData: {
          ...state.formData,
          teachers: state.formData.teachers.map((t, i) =>
            i === action.index ? {...t, [action.field]: action.value} : t,
          ),
        },
      };
    default:
      return state;
  }
}

/* ═════════════════════════════════════════════════════════════════════════
   Page
   ═════════════════════════════════════════════════════════════════════════ */
const Create = () => {
  const {isLoading: authLoading, completeOnboarding} = useAuthStore();

  const [initial] = useState(loadDraft);
  const [state, dispatch] = useReducer(reducer, initial.state);
  const [error, setError] = useState(null);
  const [errorToken, setErrorToken] = useState(0);
  const [confirmation, setConfirmation] = useState(null);
  const [draftStatus, setDraftStatus] = useState("idle"); // idle | saved | error
  const [resumed, setResumed] = useState(initial.restored);
  const [gen, setGen] = useState("idle"); // idle | working | done | error
  const [localError, setLocalError] = useState(null);

  const primaryRef = useRef(null);
  const tagRef = useRef(null);
  const mounted = useRef(true);
  const firstRender = useRef(true);

  const {step, formData, teacherIndex, direction} = state;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────
  const subjectOptions = useMemo(() => list(formData.subjectName), [formData.subjectName]);
  const classOptions = useMemo(() => generateClassOptions(formData), [formData]);
  const teacher = formData.teachers[teacherIndex] || formData.teachers[0];
  const teacherLabel = teacher?.name.trim() || "this teacher";
  const issues = useMemo(() => collectIssues(formData), [formData]);

  // ── Persistence ────────────────────────────────────────────────────────
  const persist = useCallback((s) => {
    const ok = saveDraft(s);
    if (!isPristine(s)) setDraftStatus(ok ? "saved" : "error");
    return ok;
  }, []);

  // Autosave shortly after typing stops.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = setTimeout(() => persist(state), 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.formData]);

  // Confirmation + resume notices fade on their own.
  useEffect(() => {
    if (!confirmation) return;
    const id = setTimeout(() => setConfirmation(null), 2600);
    return () => clearTimeout(id);
  }, [confirmation]);
  useEffect(() => {
    if (!resumed) return;
    const id = setTimeout(() => setResumed(false), 6000);
    return () => clearTimeout(id);
  }, [resumed]);

  // ── Transitions ────────────────────────────────────────────────────────
  const transition = (partial, savedMessage) => {
    const next = {...state, ...partial};
    dispatch({type: "replace", state: next});
    const ok = persist(next);
    setConfirmation(savedMessage && ok ? {text: savedMessage, id: Date.now()} : null);
    setError(null);
    setResumed(false);
  };

  const advance = (patchForm = {}) => {
    const form = {...formData, ...patchForm};
    const message = validateStep(step, form, teacherIndex);
    if (message) {
      setError(message);
      setErrorToken((n) => n + 1);
      return;
    }
    const nextStep = getNext(step, state.fromReview);
    transition(
      {
        formData: reconcile(form),
        step: nextStep,
        direction: 1,
        completed: state.completed.includes(step) ? state.completed : [...state.completed, step],
        fromReview: nextStep === "review" ? false : state.fromReview,
      },
      SAVED[step],
    );
  };

  const goBack = () => {
    const partial = {step: getPrev(step, state), direction: -1};
    if (step === "another") partial.teacherIndex = formData.teachers.length - 1;
    if (step === "teacherName" && teacherIndex > 0) {
      // Backing out of a brand-new, still-empty teacher discards it.
      const t = formData.teachers[teacherIndex];
      const blank = t && !t.name.trim() && !t.subjects.trim() && !t.classes.trim();
      if (blank && teacherIndex === formData.teachers.length - 1) {
        partial.formData = {...formData, teachers: formData.teachers.slice(0, -1)};
        partial.teacherIndex = teacherIndex - 1;
      }
    }
    transition(partial);
  };

  const addTeacher = () => {
    const form = reconcile(formData);
    transition({
      formData: {...form, teachers: [...form.teachers, newTeacher()]},
      teacherIndex: form.teachers.length,
      step: "teacherName",
      direction: 1,
    });
  };

  const editTeacher = (index) =>
    transition({step: "teacherName", teacherIndex: index, direction: 1});

  const removeTeacher = (index) => {
    if (formData.teachers.length < 2) return;
    transition({
      formData: {...formData, teachers: formData.teachers.filter((_, i) => i !== index)},
      teacherIndex: 0,
    });
  };

  const jumpEdit = (target) =>
    transition({step: target, direction: -1, fromReview: true, teacherIndex: 0});

  const fixIssue = (issue) =>
    transition({
      step: issue.step,
      teacherIndex: issue.teacherIndex,
      direction: -1,
      fromReview: true,
    });

  const startOver = () => {
    if (!window.confirm(COPY.startOverConfirm)) return;
    clearDraft();
    dispatch({type: "replace", state: {...initState(), direction: -1}});
    setDraftStatus("idle");
    setConfirmation(null);
    setError(null);
    setResumed(false);
    setGen("idle");
  };

  // ── Final submission ───────────────────────────────────────────────────
  const runGenerate = async (form) => {
    setLocalError(null);
    setGen("working");

    // Skip an untouched blank teacher; everything else is sent as entered.
    const teachers = form.teachers
      .filter((t) => t.name.trim() || t.subjects.trim() || t.classes.trim())
      .map((t) => ({
        name: t.name,
        subjects: list(t.subjects),
        classes: list(t.classes),
      }));

    try {
      // ONE request. The server validates everything and saves the school,
      // subjects, classes and teachers together — all or nothing.
      await completeOnboarding(
        {
          school: {name: form.schoolName},
          subjects: list(form.subjectName),
          classes: {
            type: form.classTypes,
            minLevel: form.minLevel,
            maxLevel: form.maxLevel,
            labels: list(form.classLabels),
          },
          teachers,
        },
        {
          beforeSessionUpdate: () =>
            new Promise((resolve) => {
              if (mounted.current) setGen("done");
              window.setTimeout(resolve, 1800);
            }),
        },
      );
      clearDraft();
    } catch (err) {
      console.error("School setup failed:", err);
      if (mounted.current) {
        setLocalError(err.message || "Something went wrong. Please try again.");
        setGen("error");
      }
    }
  };

  const generate = () => {
    if (gen === "working" || collectIssues(formData).length > 0) return;
    transition({step: "generate", direction: 1});
    runGenerate(formData);
  };

  // ── Field handlers ─────────────────────────────────────────────────────
  const setField = (name, value) => {
    dispatch({type: "field", name, value});
    if (error) setError(null);
  };

  const setTeacherList = (field, options, values) => {
    dispatch({
      type: "teacherField",
      index: teacherIndex,
      field,
      value: options.filter((o) => values.includes(o)).join(", "),
    });
    if (error) setError(null);
  };

  const toggleTeacherItem = (field, options, item) => {
    const current = list(teacher?.[field]);
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item];
    setTeacherList(field, options, next);
  };

  // ── Progress ───────────────────────────────────────────────────────────
  const phaseIndex = PHASES.findIndex((p) => p.steps.includes(step));
  const phases = PHASES.map((p, i) => ({
    id: p.id,
    label: p.label,
    state:
      (p.doneOn && state.completed.includes(p.doneOn)) || i < phaseIndex
        ? "done"
        : i === phaseIndex
          ? "current"
          : "upcoming",
  }));
  const reviewAt = STEP_ORDER.indexOf("review");
  const fraction = Math.min(1, STEP_ORDER.indexOf(step) / reviewAt);
  const eyebrow =
    phaseIndex < 0
      ? "Welcome"
      : `Step ${phaseIndex + 1} of ${PHASES.length} · ${PHASES[phaseIndex].label}` +
        (TEACHER_STEPS.has(step) ? ` · Teacher ${teacherIndex + 1}` : "");

  const nextIsReview = getNext(step, state.fromReview) === "review";
  const saved = confirmation?.text;

  // ── Steps ──────────────────────────────────────────────────────────────
  const base = {
    eyebrow,
    saved,
    errorToken,
    onBack: step === "intro" ? undefined : goBack,
  };

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <QuestionStep
            {...base}
            title={COPY.intro.title}
            lead={COPY.intro.lead}
            why={COPY.intro.why}
            onSubmit={() => advance()}
            actions={<ContinueButton>{COPY.intro.button}</ContinueButton>}
          >
            <IntroOverview items={COPY.intro.items} />
          </QuestionStep>
        );

      case "institution":
        return (
          <QuestionStep
            {...base}
            title={COPY.institution.title}
            lead={COPY.institution.lead}
            why={COPY.institution.why}
            focusRef={primaryRef}
            autoFocus
            onSubmit={() => advance()}
            actions={
              <ContinueButton>
                {nextIsReview ? COPY.saveAndReview : COPY.institution.button}
              </ContinueButton>
            }
          >
            <LargeInput
              ref={primaryRef}
              id="cr-school"
              label="School name"
              value={formData.schoolName}
              onChange={(e) => setField("schoolName", e.target.value)}
              placeholder={COPY.institution.placeholder}
              error={error}
              autoCapitalize="words"
            />
          </QuestionStep>
        );

      case "subjects":
        return (
          <QuestionStep
            {...base}
            title={COPY.subjects.title}
            lead={COPY.subjects.lead}
            why={COPY.subjects.why}
            focusRef={tagRef}
            autoFocus
            onSubmit={() =>
              advance({subjectName: tagRef.current?.commit() ?? formData.subjectName})
            }
            actions={
              <ContinueButton>
                {nextIsReview ? COPY.saveAndReview : COPY.subjects.button}
              </ContinueButton>
            }
          >
            <TagInput
              ref={tagRef}
              id="cr-subjects"
              label="Subjects"
              value={formData.subjectName}
              onChange={(v) => setField("subjectName", v)}
              placeholder={COPY.subjects.placeholder}
              hint={COPY.subjects.hint}
              error={error}
            />
          </QuestionStep>
        );

      case "classType":
        return (
          <QuestionStep
            {...base}
            title={COPY.classType.title}
            lead={COPY.classType.lead}
            why={COPY.classType.why}
            focusRef={primaryRef}
            onSubmit={() => advance()}
            actions={<ContinueButton>{COPY.classType.button}</ContinueButton>}
          >
            <ChoiceGroup
              ref={primaryRef}
              name="cr-class-type"
              legend="Class type"
              options={CLASS_TYPE_OPTIONS}
              value={formData.classTypes}
              onChange={(v) => setField("classTypes", v)}
              describe={(o) => `e.g. ${o} 1`}
              error={error}
            />
          </QuestionStep>
        );

      case "minLevel":
        return (
          <QuestionStep
            {...base}
            title={COPY.minLevel.title}
            lead={COPY.minLevel.lead(formData.classTypes)}
            why={COPY.minLevel.why}
            focusRef={primaryRef}
            autoFocus
            onSubmit={() => advance()}
            actions={<ContinueButton>{COPY.minLevel.button}</ContinueButton>}
          >
            <LargeInput
              ref={primaryRef}
              id="cr-min"
              label="Lowest level"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={formData.minLevel}
              onChange={(e) => setField("minLevel", e.target.value.replace(/\D/g, ""))}
              placeholder={COPY.minLevel.placeholder}
              error={error}
            />
          </QuestionStep>
        );

      case "maxLevel":
        return (
          <QuestionStep
            {...base}
            title={COPY.maxLevel.title}
            lead={COPY.maxLevel.lead}
            why={COPY.maxLevel.why}
            focusRef={primaryRef}
            autoFocus
            onSubmit={() => advance()}
            actions={<ContinueButton>{COPY.maxLevel.button}</ContinueButton>}
          >
            <LargeInput
              ref={primaryRef}
              id="cr-max"
              label="Highest level"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={formData.maxLevel}
              onChange={(e) => setField("maxLevel", e.target.value.replace(/\D/g, ""))}
              placeholder={COPY.maxLevel.placeholder}
              error={error}
            />
            <ClassPreview classes={classOptions} />
          </QuestionStep>
        );

      case "sections": {
        const hasLabels = list(formData.classLabels).length > 0;
        return (
          <QuestionStep
            {...base}
            optional
            title={COPY.sections.title}
            lead={COPY.sections.lead}
            why={COPY.sections.why}
            focusRef={tagRef}
            autoFocus
            onSubmit={() =>
              advance({classLabels: tagRef.current?.commit() ?? formData.classLabels})
            }
            actions={
              <ContinueButton>
                {nextIsReview
                  ? COPY.saveAndReview
                  : hasLabels
                    ? COPY.sections.buttonWith
                    : COPY.sections.buttonWithout}
              </ContinueButton>
            }
          >
            <TagInput
              ref={tagRef}
              id="cr-sections"
              label="Section labels"
              value={formData.classLabels}
              onChange={(v) => setField("classLabels", v)}
              transform={(s) => s.toUpperCase()}
              placeholder={COPY.sections.placeholder}
              hint={COPY.sections.hint}
              error={error}
            />
            <ClassPreview classes={classOptions} />
          </QuestionStep>
        );
      }

      case "teacherName":
        return (
          <QuestionStep
            {...base}
            title={
              teacherIndex === 0
                ? COPY.teacherName.titleFirst
                : COPY.teacherName.titleNext(teacherIndex + 1)
            }
            lead={COPY.teacherName.lead}
            why={COPY.teacherName.why}
            focusRef={primaryRef}
            autoFocus
            onSubmit={() => advance()}
            actions={<ContinueButton>{COPY.teacherName.button}</ContinueButton>}
          >
            <LargeInput
              ref={primaryRef}
              id="cr-teacher-name"
              label="Teacher name"
              value={teacher?.name || ""}
              onChange={(e) => {
                dispatch({
                  type: "teacherField",
                  index: teacherIndex,
                  field: "name",
                  value: e.target.value,
                });
                if (error) setError(null);
              }}
              placeholder={COPY.teacherName.placeholder}
              error={error}
              autoCapitalize="words"
            />
          </QuestionStep>
        );

      case "teacherSubjects":
        return (
          <QuestionStep
            {...base}
            title={COPY.teacherSubjects.title(teacherLabel)}
            lead={COPY.teacherSubjects.lead}
            why={COPY.teacherSubjects.why}
            focusRef={primaryRef}
            onSubmit={() => advance()}
            actions={<ContinueButton>{COPY.teacherSubjects.button}</ContinueButton>}
          >
            <ChipPicker
              ref={primaryRef}
              id="cr-teacher-subjects"
              label={`Subjects for ${teacherLabel}`}
              options={subjectOptions}
              selected={list(teacher?.subjects)}
              onToggle={(s) => toggleTeacherItem("subjects", subjectOptions, s)}
              onSetAll={(all) => setTeacherList("subjects", subjectOptions, all)}
              error={error}
              emptyMessage={COPY.teacherSubjects.empty}
            />
          </QuestionStep>
        );

      case "teacherClasses":
        return (
          <QuestionStep
            {...base}
            title={COPY.teacherClasses.title(teacherLabel)}
            lead={COPY.teacherClasses.lead}
            why={COPY.teacherClasses.why}
            focusRef={primaryRef}
            onSubmit={() => advance()}
            actions={<ContinueButton>{COPY.teacherClasses.button}</ContinueButton>}
          >
            <ChipPicker
              ref={primaryRef}
              id="cr-teacher-classes"
              label={`Classes for ${teacherLabel}`}
              options={classOptions}
              selected={list(teacher?.classes)}
              onToggle={(c) => toggleTeacherItem("classes", classOptions, c)}
              onSetAll={(all) => setTeacherList("classes", classOptions, all)}
              error={error}
              emptyMessage={COPY.teacherClasses.empty}
            />
          </QuestionStep>
        );

      case "another": {
        const done = formData.teachers.filter((t) => t.name.trim());
        return (
          <QuestionStep
            {...base}
            title={COPY.another.title}
            lead={COPY.another.lead(done.length)}
            why={COPY.another.why}
            onSubmit={() => advance()}
            actions={
              <>
                <ContinueButton type="button" secondary icon={null} onClick={addTeacher}>
                  <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
                  {COPY.another.addButton}
                </ContinueButton>
                <ContinueButton>{COPY.another.button}</ContinueButton>
              </>
            }
          >
            <ul className="cr__teachers" style={{listStyle: "none", margin: 0, padding: 0}}>
              <AnimatePresence initial={false}>
                {formData.teachers.map((t, i) =>
                  t.name.trim() ? (
                    <TeacherCard
                      key={t.id}
                      teacher={t}
                      canRemove={formData.teachers.length > 1}
                      onEdit={() => editTeacher(i)}
                      onRemove={() => removeTeacher(i)}
                    />
                  ) : null,
                )}
              </AnimatePresence>
            </ul>
          </QuestionStep>
        );
      }

      case "review": {
        const labels = list(formData.classLabels).map((l) => l.toUpperCase());
        const min = formData.minLevel;
        const max = formData.maxLevel;
        const teachers = formData.teachers.filter((t) => t.name.trim());
        const rows = [
          {
            id: "institution",
            label: "Institution",
            value: formData.schoolName || "Not set",
            onEdit: () => jumpEdit("institution"),
          },
          {
            id: "subjects",
            label: "Subjects",
            value: `${subjectOptions.length} ${
              subjectOptions.length === 1 ? "subject" : "subjects"
            }`,
            sub: subjectOptions.join(", "),
            onEdit: () => jumpEdit("subjects"),
          },
          {
            id: "classes",
            label: "Classes",
            value: `${classOptions.length} ${classOptions.length === 1 ? "class" : "classes"}`,
            sub: `${formData.classTypes || "—"} ${min || "?"}${
              max && max !== min ? `–${max}` : ""
            } · ${
              labels.length ? `Sections ${labels.join(", ")}` : "No sections"
            }`,
            onEdit: () => jumpEdit("classType"),
          },
          {
            id: "teachers",
            label: "Teachers",
            value: `${teachers.length} ${teachers.length === 1 ? "teacher" : "teachers"}`,
            sub: teachers.map((t) => t.name.trim()).join(", "),
            onEdit: () => jumpEdit("another"),
          },
        ];
        return (
          <QuestionStep
            {...base}
            title={COPY.review.title}
            lead={COPY.review.lead}
            why={COPY.review.why}
            onSubmit={generate}
            actions={
              <ContinueButton disabled={issues.length > 0}>
                {COPY.review.button}
              </ContinueButton>
            }
          >
            <ReviewSummary rows={rows} issues={issues} onFix={fixIssue} />
          </QuestionStep>
        );
      }

      case "generate":
        return (
          <GeneratingState
            status={gen === "idle" ? "working" : gen}
            onRetry={() => runGenerate(formData)}
            onBack={() => {
              setGen("idle");
              setLocalError(null);
              transition({step: "review", direction: -1});
            }}
          />
        );

      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="cr" style={{display: "grid", placeItems: "center"}}>
        <style>{CREATE_CSS}</style>
        <span
          className="cr__spinner"
          style={{margin: 0}}
          aria-label="Loading"
          role="status"
        />
      </div>
    );
  }

  return (
    <main className="cr">
      <style>{CREATE_CSS}</style>

      <div className="cr__shell">
        <ProgressRail
          title={COPY.railTitle}
          subtitle={COPY.railSubtitle}
          phases={phases}
          status={draftStatus}
          onRetry={() => persist(state)}
          canStartOver={!isPristine(state) && step !== "generate"}
          onStartOver={startOver}
        />

        <div className="cr__main">
          <ProgressCompact
            position={phaseIndex + 1}
            total={PHASES.length}
            label={phaseIndex < 0 ? "Getting started" : PHASES[phaseIndex].label}
            fraction={fraction}
            status={draftStatus}
            onRetry={() => persist(state)}
          />

          <div className="cr__stage">
            <p className="cr__sr" role="status" aria-live="polite">
              {phaseIndex < 0
                ? "Getting started"
                : `Step ${phaseIndex + 1} of ${PHASES.length}: ${PHASES[phaseIndex].label}`}
            </p>

            <AnimatePresence>
              {resumed && (
                <motion.p
                  className="cr__notice"
                  initial={{opacity: 0, y: -6}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -6}}
                  transition={{duration: 0.25}}
                >
                  {COPY.resumed}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {gen === "error" && localError && (
                <motion.div
                  initial={{opacity: 0, y: -8}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  style={{marginBottom: 20}}
                >
                  <Notification
                    message={localError}
                    type="error"
                    duration={8000}
                    onClose={() => setLocalError(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <StepTransition
              stepKey={step === "teacherName" ? `${step}-${teacherIndex}` : step}
              direction={direction}
            >
              {renderStep()}
            </StepTransition>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Create;