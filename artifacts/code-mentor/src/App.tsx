import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ROUNDS, TOTAL_ROUNDS } from "@/data/curriculum";
import { PREP_ROUNDS, PREP_TOTAL_ROUNDS } from "@/data/prep-curriculum";
import { JUNIOR_ROUNDS, JUNIOR_TOTAL_ROUNDS } from "@/data/junior-curriculum";
import { MIDDLE_ROUNDS, MIDDLE_TOTAL_ROUNDS } from "@/data/middle-curriculum";
import { SENIOR_ROUNDS, SENIOR_TOTAL_ROUNDS } from "@/data/senior-curriculum";
import { FLASK_ROUNDS, FLASK_TOTAL_ROUNDS } from "@/data/flask-curriculum";
import { FASTAPI_ROUNDS, FASTAPI_TOTAL_ROUNDS } from "@/data/fastapi-curriculum";
import { HTML_ROUNDS, HTML_TOTAL_ROUNDS } from "@/data/html-curriculum";
import { SQL_ROUNDS, SQL_TOTAL_ROUNDS } from "@/data/sql-curriculum";
import { POSTGRES_ROUNDS, POSTGRES_TOTAL_ROUNDS } from "@/data/postgres-curriculum";
import { Welcome } from "@/components/Welcome";
import { RoundIntro } from "@/components/RoundIntro";
import { RoundView, RoundResult } from "@/components/RoundView";
import { RoundSummary } from "@/components/RoundSummary";
import { Results } from "@/components/Results";
import { FinalAssignment } from "@/components/FinalAssignment";
import { FlashcardMode } from "@/components/FlashcardMode";
import { CodePlayground } from "@/components/CodePlayground";
import { HtmlPlayground } from "@/components/HtmlPlayground";
import { SqlPlayground } from "@/components/SqlPlayground";
import { computeRunningGrade } from "@/lib/runningGrade";

export type Course = "main" | "prep" | "junior" | "middle" | "senior" | "flask" | "fastapi" | "web" | "sql" | "postgres";

type Phase =
  | { kind: "welcome" }
  | { kind: "flashcards" }
  | { kind: "playground" }
  | { kind: "html-playground" }
  | { kind: "sql-playground" }
  | { kind: "intro"; course: Course; roundIndex: number }
  | { kind: "play"; course: Course; roundIndex: number }
  | { kind: "summary"; course: Course; roundIndex: number; result: RoundResult }
  | { kind: "results"; course: Course }
  | { kind: "assignment" };

const STORAGE_KEY = "python-oop-trainer-state-v7";

interface PersistedState {
  phase: Phase;
  perRound: RoundResult[];
  prepPerRound: RoundResult[];
  juniorPerRound: RoundResult[];
  middlePerRound: RoundResult[];
  seniorPerRound: RoundResult[];
  flaskPerRound: RoundResult[];
  fastapiPerRound: RoundResult[];
  webPerRound: RoundResult[];
  sqlPerRound: RoundResult[];
  postgresPerRound: RoundResult[];
}

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignore
  }
  return {};
}

function App() {
  const persisted = loadPersisted();

  const [phase, setPhase] = useState<Phase>(
    persisted.phase ?? { kind: "welcome" },
  );
  const [perRound, setPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.perRound) ? persisted.perRound : [],
  );
  const [prepPerRound, setPrepPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.prepPerRound) ? persisted.prepPerRound : [],
  );
  const [juniorPerRound, setJuniorPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.juniorPerRound) ? persisted.juniorPerRound : [],
  );
  const [middlePerRound, setMiddlePerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.middlePerRound) ? persisted.middlePerRound : [],
  );
  const [seniorPerRound, setSeniorPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.seniorPerRound) ? persisted.seniorPerRound : [],
  );
  const [flaskPerRound, setFlaskPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.flaskPerRound) ? persisted.flaskPerRound : [],
  );
  const [fastapiPerRound, setFastapiPerRound] = useState<RoundResult[]>(
    Array.isArray((persisted as any).fastapiPerRound) ? (persisted as any).fastapiPerRound : [],
  );
  const [webPerRound, setWebPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.webPerRound) ? persisted.webPerRound : [],
  );
  const [sqlPerRound, setSqlPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.sqlPerRound) ? persisted.sqlPerRound : [],
  );
  const [postgresPerRound, setPostgresPerRound] = useState<RoundResult[]>(
    Array.isArray(persisted.postgresPerRound) ? persisted.postgresPerRound : [],
  );

  useEffect(() => {
    try {
      const safePhase =
        phase.kind === "flashcards" ||
        phase.kind === "playground" ||
        phase.kind === "html-playground"
          ? { kind: "welcome" as const }
          : phase;
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          phase: safePhase,
          perRound,
          prepPerRound,
          juniorPerRound,
          middlePerRound,
          seniorPerRound,
          flaskPerRound,
          fastapiPerRound,
          webPerRound,
          sqlPerRound,
          postgresPerRound,
        } satisfies PersistedState),
      );
    } catch {
      // ignore
    }
  }, [phase, perRound, prepPerRound, juniorPerRound, middlePerRound, seniorPerRound, flaskPerRound, fastapiPerRound, webPerRound, sqlPerRound, postgresPerRound]);

  const roundsFor = (course: Course) => {
    switch (course) {
      case "prep": return PREP_ROUNDS;
      case "junior": return JUNIOR_ROUNDS;
      case "middle": return MIDDLE_ROUNDS;
      case "senior": return SENIOR_ROUNDS;
      case "flask": return FLASK_ROUNDS;
      case "fastapi": return FASTAPI_ROUNDS;
      case "web": return HTML_ROUNDS;
      case "sql": return SQL_ROUNDS;
      case "postgres": return POSTGRES_ROUNDS;
      default: return ROUNDS;
    }
  };

  const totalFor = (course: Course) => {
    switch (course) {
      case "prep": return PREP_TOTAL_ROUNDS;
      case "junior": return JUNIOR_TOTAL_ROUNDS;
      case "middle": return MIDDLE_TOTAL_ROUNDS;
      case "senior": return SENIOR_TOTAL_ROUNDS;
      case "flask": return FLASK_TOTAL_ROUNDS;
      case "fastapi": return FASTAPI_TOTAL_ROUNDS;
      case "web": return HTML_TOTAL_ROUNDS;
      case "sql": return SQL_TOTAL_ROUNDS;
      case "postgres": return POSTGRES_TOTAL_ROUNDS;
      default: return TOTAL_ROUNDS;
    }
  };

  const resultsFor = (course: Course): RoundResult[] => {
    switch (course) {
      case "prep": return prepPerRound;
      case "junior": return juniorPerRound;
      case "middle": return middlePerRound;
      case "senior": return seniorPerRound;
      case "flask": return flaskPerRound;
      case "fastapi": return fastapiPerRound;
      case "web": return webPerRound;
      case "sql": return sqlPerRound;
      case "postgres": return postgresPerRound;
      default: return perRound;
    }
  };

  const setResultsFor = (
    course: Course,
    updater: (prev: RoundResult[]) => RoundResult[],
  ) => {
    switch (course) {
      case "prep": setPrepPerRound(updater); break;
      case "junior": setJuniorPerRound(updater); break;
      case "middle": setMiddlePerRound(updater); break;
      case "senior": setSeniorPerRound(updater); break;
      case "flask": setFlaskPerRound(updater); break;
      case "fastapi": setFastapiPerRound(updater); break;
      case "web": setWebPerRound(updater); break;
      case "sql": setSqlPerRound(updater); break;
      case "postgres": setPostgresPerRound(updater); break;
      default: setPerRound(updater);
    }
  };

  const startCourse = (course: Course) => {
    setResultsFor(course, () => []);
    setPhase({ kind: "intro", course, roundIndex: 0 });
  };

  const adminJump = (course: Course, roundNumber: number) => {
    const total = totalFor(course);
    const targetIdx = Math.max(0, Math.min(total - 1, roundNumber - 1));
    const skipped: RoundResult[] = Array.from({ length: targetIdx }, () => ({
      earned: 0,
      max: 0,
      hintsRevealed: 0,
      perExercise: [],
      skipped: true,
    }));
    setResultsFor(course, () => skipped);
    setPhase({ kind: "intro", course, roundIndex: targetIdx });
  };

  const startRound = (course: Course, roundIndex: number) => {
    setPhase({ kind: "play", course, roundIndex });
  };

  const finishRound = (course: Course, roundIndex: number, result: RoundResult) => {
    setResultsFor(course, (prev) => {
      const next = [...prev];
      next[roundIndex] = result;
      return next;
    });
    setPhase({ kind: "summary", course, roundIndex, result });
  };

  const continueAfterSummary = (course: Course, roundIndex: number) => {
    if (roundIndex + 1 < roundsFor(course).length) {
      setPhase({ kind: "intro", course, roundIndex: roundIndex + 1 });
    } else {
      setPhase({ kind: "results", course });
    }
  };

  const goHome = () => setPhase({ kind: "welcome" });

  const restart = () => {
    setPerRound([]);
    setPrepPerRound([]);
    setJuniorPerRound([]);
    setMiddlePerRound([]);
    setSeniorPerRound([]);
    setFlaskPerRound([]);
    setFastapiPerRound([]);
    setWebPerRound([]);
    setSqlPerRound([]);
    setPostgresPerRound([]);
    setPhase({ kind: "welcome" });
  };

  const courseLabel = (course: Course): string => {
    switch (course) {
      case "prep": return "Подготовка к ООП завершена";
      case "junior": return "Курс Python Junior завершён";
      case "middle": return "Курс Python Middle завершён";
      case "senior": return "Курс Python Senior завершён";
      case "flask": return "Курс Flask завершён";
      case "fastapi": return "Курс FastAPI завершён";
      case "web": return "Курс HTML/CSS/JS завершён";
      case "sql": return "Курс SQLite завершён";
      case "postgres": return "Курс PostgreSQL завершён";
      default: return "Курс ООП завершён";
    }
  };

  return (
    <TooltipProvider>
      {phase.kind === "welcome" && (
        <Welcome
          onStart={() => startCourse("main")}
          onStartPrep={() => startCourse("prep")}
          onStartJunior={() => startCourse("junior")}
          onStartMiddle={() => startCourse("middle")}
          onStartSenior={() => startCourse("senior")}
          onStartFlask={() => startCourse("flask")}
          onStartFastapi={() => startCourse("fastapi")}
          onStartWeb={() => startCourse("web")}
          onStartSql={() => startCourse("sql")}
          onStartPostgres={() => startCourse("postgres")}
          onAdminJump={adminJump}
          onFlashcards={() => setPhase({ kind: "flashcards" })}
          onPlayground={() => setPhase({ kind: "playground" })}
          onHtmlPlayground={() => setPhase({ kind: "html-playground" })}
          onSqlPlayground={() => setPhase({ kind: "sql-playground" })}
        />
      )}

      {phase.kind === "flashcards" && (
        <FlashcardMode onHome={goHome} />
      )}

      {phase.kind === "playground" && (
        <CodePlayground onHome={goHome} />
      )}

      {phase.kind === "html-playground" && (
        <HtmlPlayground onHome={goHome} />
      )}

      {phase.kind === "sql-playground" && (
        <SqlPlayground onHome={goHome} />
      )}

      {phase.kind === "intro" && (
        <RoundIntro
          round={roundsFor(phase.course)[phase.roundIndex]}
          totalRounds={totalFor(phase.course)}
          onStart={() => startRound(phase.course, phase.roundIndex)}
          onHome={goHome}
          runningGrade={computeRunningGrade(
            resultsFor(phase.course).slice(0, phase.roundIndex),
          )}
        />
      )}

      {phase.kind === "play" && (
        <RoundView
          round={roundsFor(phase.course)[phase.roundIndex]}
          totalRounds={totalFor(phase.course)}
          onFinish={(result) => finishRound(phase.course, phase.roundIndex, result)}
          onHome={goHome}
          runningGrade={computeRunningGrade(
            resultsFor(phase.course).slice(0, phase.roundIndex),
          )}
        />
      )}

      {phase.kind === "summary" && (
        <RoundSummary
          round={roundsFor(phase.course)[phase.roundIndex]}
          totalRounds={totalFor(phase.course)}
          result={phase.result}
          isLast={phase.roundIndex + 1 >= roundsFor(phase.course).length}
          onNext={() => continueAfterSummary(phase.course, phase.roundIndex)}
          onHome={goHome}
          runningGrade={computeRunningGrade(
            (() => {
              const slice = resultsFor(phase.course).slice(0, phase.roundIndex + 1);
              slice[phase.roundIndex] = phase.result;
              return slice;
            })(),
          )}
        />
      )}

      {phase.kind === "results" && (
        <Results
          perRound={resultsFor(phase.course)}
          rounds={roundsFor(phase.course)}
          totalRounds={totalFor(phase.course)}
          courseLabel={courseLabel(phase.course)}
          continueLabel={phase.course === "main" ? "К финальному заданию" : undefined}
          hideContinue={phase.course !== "main"}
          onContinue={() => setPhase({ kind: "assignment" })}
          onRestart={restart}
        />
      )}

      {phase.kind === "assignment" && (
        <FinalAssignment
          onBack={() => setPhase({ kind: "results", course: "main" })}
          onHome={goHome}
        />
      )}

      <Toaster />
    </TooltipProvider>
  );
}

export default App;
