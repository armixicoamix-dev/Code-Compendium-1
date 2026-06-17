import { useState } from "react";
import { usePWA } from "@/hooks/usePWA";
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
import type { Course } from "@/App";
import { Button } from "@/components/ui/button";
import { PyCode } from "@/components/PyCode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Layers,
  Lightbulb,
  Sparkles,
  Trophy,
  Lock,
  Rocket,
  ShieldCheck,
  CreditCard,
  Terminal,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  Star,
  Download,
  Wifi,
  WifiOff,
  Loader2,
  Globe,
  Database,
} from "lucide-react";

const HERO_SNIPPET = `from abc import ABC, abstractmethod
import math


class Shape(ABC):
    """Контракт любой геометрической фигуры."""

    @abstractmethod
    def area(self) -> float: ...


class Circle(Shape):
    def __init__(self, r: float):
        self.r = r

    def area(self) -> float:
        return math.pi * self.r ** 2


class Square(Shape):
    def __init__(self, side: float):
        self.side = side

    def area(self) -> float:
        return self.side ** 2


shapes: list[Shape] = [Circle(3), Square(4)]
print(sum(s.area() for s in shapes))`;

const ADMIN_LOGIN = "Armix";
const ADMIN_PASSWORD = "Wwewwe228775";

const COURSE_META: Record<
  Course,
  { label: string; rounds: typeof ROUNDS; total: number }
> = {
  main:     { label: "ООП — основной курс",      rounds: ROUNDS,          total: TOTAL_ROUNDS },
  prep:     { label: "Подготовка к ООП",          rounds: PREP_ROUNDS,     total: PREP_TOTAL_ROUNDS },
  junior:   { label: "Python Junior",             rounds: JUNIOR_ROUNDS,   total: JUNIOR_TOTAL_ROUNDS },
  middle:   { label: "Python Middle",             rounds: MIDDLE_ROUNDS,   total: MIDDLE_TOTAL_ROUNDS },
  senior:   { label: "Python Senior",             rounds: SENIOR_ROUNDS,   total: SENIOR_TOTAL_ROUNDS },
  flask:    { label: "Flask — веб-разработка",    rounds: FLASK_ROUNDS,    total: FLASK_TOTAL_ROUNDS },
  fastapi:  { label: "FastAPI — современный API", rounds: FASTAPI_ROUNDS,  total: FASTAPI_TOTAL_ROUNDS },
  web:      { label: "HTML/CSS/JS",               rounds: HTML_ROUNDS,     total: HTML_TOTAL_ROUNDS },
  sql:      { label: "SQLite — базы данных",      rounds: SQL_ROUNDS,      total: SQL_TOTAL_ROUNDS },
  postgres: { label: "PostgreSQL — продвинутый",  rounds: POSTGRES_ROUNDS, total: POSTGRES_TOTAL_ROUNDS },
};

export function Welcome({
  onStart,
  onStartPrep,
  onStartJunior,
  onStartMiddle,
  onStartSenior,
  onStartFlask,
  onStartFastapi,
  onStartWeb,
  onStartSql,
  onStartPostgres,
  onAdminJump,
  onFlashcards,
  onPlayground,
  onHtmlPlayground,
  onSqlPlayground,
}: {
  onStart: () => void;
  onStartPrep: () => void;
  onStartJunior: () => void;
  onStartMiddle: () => void;
  onStartSenior: () => void;
  onStartFlask: () => void;
  onStartFastapi: () => void;
  onStartWeb: () => void;
  onStartSql: () => void;
  onStartPostgres: () => void;
  onAdminJump: (course: Course, roundNumber: number) => void;
  onFlashcards: () => void;
  onPlayground: () => void;
  onHtmlPlayground: () => void;
  onSqlPlayground: () => void;
}) {
  const totalFills = ROUNDS.reduce(
    (a, r) =>
      a +
      r.fills.reduce((s, f) => s + f.answers.length, 0) +
      (r.fillLines?.reduce((s, f) => s + f.blanks.length, 0) ?? 0),
    0,
  );
  const totalEx = ROUNDS.reduce(
    (a, r) =>
      a +
      r.fills.length +
      r.questions.length +
      r.writes.length +
      (r.fillLines?.length ?? 0),
    0,
  );

  const { status: offlineStatus, cacheForOffline, isOnline, cacheProgress, cachePct } = usePWA();

  const [adminOpen, setAdminOpen] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course>("main");
  const [selectedRound, setSelectedRound] = useState(1);
  const [showAdminPass, setShowAdminPass] = useState(false);

  const activeMeta = COURSE_META[selectedCourse];

  const tryLogin = () => {
    if (login.trim() === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setAuthError(null);
    } else {
      setAuthError("Неверный логин или пароль");
    }
  };

  const closeAdmin = () => {
    setAdminOpen(false);
    setLogin("");
    setPassword("");
    setAuthError(null);
    setAuthed(false);
    setSelectedCourse("main");
    setSelectedRound(1);
  };

  const confirmJump = () => {
    onAdminJump(selectedCourse, selectedRound);
    closeAdmin();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background glow orbs */}
      <div
        className="glow-orb"
        style={{
          width: 700,
          height: 700,
          left: "-200px",
          top: "-280px",
          background: "radial-gradient(circle, hsl(217 91% 65% / 0.50), transparent 70%)",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 550,
          height: 550,
          right: "-150px",
          top: "120px",
          background: "radial-gradient(circle, hsl(280 90% 70% / 0.40), transparent 70%)",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 400,
          height: 400,
          left: "30%",
          bottom: "100px",
          background: "radial-gradient(circle, hsl(160 84% 55% / 0.15), transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-4 mb-10 sm:mb-14">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center flex-shrink-0"
              style={{ boxShadow: "0 8px 24px -8px hsl(217 91% 65% / 0.6), 0 0 0 1px hsl(217 91% 65% / 0.3)" }}
            >
              <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                Интерактивный тренажёр
              </div>
              <div className="font-bold tracking-tight text-sm sm:text-base">Python · OOP Mastery</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* ── Offline cache button ── */}
            {offlineStatus === "ready" ? (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 cursor-default"
                title="Все ресурсы сохранены — приложение работает без интернета"
              >
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                <span className="hidden sm:inline">{isOnline ? "Офлайн-режим готов" : "Офлайн"}</span>
                <CheckCircle2 className="h-3 w-3" />
              </div>
            ) : offlineStatus === "caching" ? (
              <div
                className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-sky-400 bg-sky-500/10 border border-sky-500/25 max-w-[160px] sm:max-w-[220px] overflow-hidden"
                title={cacheProgress}
              >
                {/* progress fill */}
                <div
                  className="absolute inset-0 bg-sky-500/10 transition-all duration-500"
                  style={{ width: `${cachePct}%` }}
                />
                <Loader2 className="h-3 w-3 animate-spin flex-shrink-0 relative z-10" />
                <span className="relative z-10 truncate hidden sm:inline">{cacheProgress || "Загрузка…"}</span>
                <span className="relative z-10 flex-shrink-0 text-sky-300">{cachePct}%</span>
              </div>
            ) : offlineStatus === "error" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={cacheForOffline}
                disabled={!isOnline}
                className="gap-1.5 h-8 px-2.5 text-xs text-rose-400 hover:text-rose-300"
                title="Ошибка — нажми снова для повторной попытки"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Повтор</span>
              </Button>
            ) : offlineStatus !== "unknown" ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={cacheForOffline}
                disabled={!isOnline}
                className="gap-1.5 h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
                title={
                  isOnline
                    ? "Сохранить Python, Flask и все упражнения для работы без интернета"
                    : "Нет соединения — подключись к интернету чтобы сохранить"
                }
              >
                {isOnline ? (
                  <Download className="h-3.5 w-3.5" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Сохранить офлайн</span>
              </Button>
            ) : null}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdminOpen(true)}
              data-testid="button-admin"
              className="gap-2 touch-target"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Админ</span>
            </Button>
          </div>
        </div>

        {/* ── Hero section ── */}
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center mb-14 sm:mb-20">
          <div className="animate-float-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              {TOTAL_ROUNDS} раундов · от классов до архитектуры
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.04] mb-5">
              Освой{" "}
              <span className="text-gradient">ООП в Python</span>
              <br />
              <span className="text-foreground/90">за пару кликов!</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              {totalEx} заданий, {totalFills}+ пропусков в реальном коде, тесты с открытым
              ответом и задачи на написание классов с нуля. После {TOTAL_ROUNDS} раундов —
              итоговая оценка от 1 до 12 и финальный проект для учителя.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
              <Button
                size="lg"
                onClick={onStart}
                className="h-12 px-7 text-base font-semibold touch-target"
                data-testid="button-start"
                style={{ boxShadow: "0 8px 32px -8px hsl(217 91% 65% / 0.65), 0 0 0 1px hsl(217 91% 65% / 0.4)" }}
              >
                Начать обучение
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="text-sm text-muted-foreground hidden sm:block">
                ~90 мин · прогресс в сессии
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-sm text-muted-foreground">
              {[
                { num: String(TOTAL_ROUNDS), label: "раундов" },
                { num: String(totalEx), label: "заданий" },
                { num: `${totalFills}+`, label: "пропусков" },
                { num: "12", label: "макс. оценка" },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline gap-1.5">
                  <span className="stat-hero-num">{s.num}</span>
                  <span className="text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code preview */}
          <div className="relative animate-float-up delay-200">
            <div
              className="absolute -inset-6 rounded-3xl opacity-50 blur-2xl pointer-events-none"
              style={{ background: "linear-gradient(135deg, hsl(217 91% 65% / 0.4), hsl(280 90% 70% / 0.3))" }}
            />
            <div className="relative">
              <PyCode code={HERO_SNIPPET} filename="shapes.py" />
            </div>
          </div>
        </div>

        {/* ── Admin credentials (публичная панель) ── */}
        <div className="mb-10 sm:mb-12 animate-float-up delay-100">
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{ boxShadow: "0 0 0 1px hsl(38 95% 60% / 0.08), inset 0 1px 0 hsl(38 95% 60% / 0.08)" }}
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 grid place-items-center flex-shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-2">
                Данные для Админ-режима
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Логин:</span>
                  <code className="font-mono font-bold text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                    {ADMIN_LOGIN}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Пароль:</span>
                  <code className="font-mono font-bold text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                    {showAdminPass ? ADMIN_PASSWORD : "•".repeat(ADMIN_PASSWORD.length)}
                  </code>
                  <button
                    type="button"
                    onClick={() => setShowAdminPass((v) => !v)}
                    className="text-muted-foreground hover:text-foreground transition-colors touch-target flex items-center"
                    title={showAdminPass ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showAdminPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdminOpen(true)}
              className="gap-2 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60 flex-shrink-0 touch-target"
            >
              <Lock className="h-3.5 w-3.5" />
              Войти
            </Button>
          </div>
        </div>

        {/* ── Интерактивные режимы ── */}
        <div className="mb-12 sm:mb-14 animate-float-up delay-150">
          <div className="section-label mb-4">Интерактивные режимы</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Flashcards */}
            <div
              className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 flex flex-col cursor-pointer group"
              onClick={onFlashcards}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onFlashcards()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary grid place-items-center group-hover:bg-primary/25 transition-colors flex-shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-base">Флэшкарты</div>
                  <div className="text-xs text-muted-foreground">20 карточек · ключевые концепции</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Вопросы и ответы по Python и ООП — от основ до паттернов. Каждая с примером
                кода. Перемешай, отметь «Знаю» / «Не знаю», повтори слабые места.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                <CreditCard className="h-4 w-4" />
                Открыть флэшкарты
                <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Playground */}
            <div
              className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 flex flex-col cursor-pointer group"
              onClick={onPlayground}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onPlayground()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/15 text-emerald-400 grid place-items-center group-hover:bg-emerald-500/25 transition-colors flex-shrink-0">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-base">Python Playground</div>
                  <div className="text-xs text-muted-foreground">8 примеров · IDE в браузере</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Пиши и запускай Python прямо в браузере. Встроенные примеры: ООП, декораторы,
                генераторы, dataclasses. Tab = 4 пробела, Enter = авто-отступ.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 group-hover:gap-3 transition-all">
                <Terminal className="h-4 w-4" />
                Открыть Playground
                <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* HTML/CSS/JS Playground */}
            <div
              className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 flex flex-col cursor-pointer group"
              onClick={onHtmlPlayground}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onHtmlPlayground()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-orange-500/15 text-orange-400 grid place-items-center group-hover:bg-orange-500/25 transition-colors flex-shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-base">HTML/CSS/JS Редактор</div>
                  <div className="text-xs text-muted-foreground">Live preview · ZIP · Методичка</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Полноценный редактор HTML, CSS и JavaScript прямо в браузере. Живой предпросмотр,
                консоль, скачивание проекта архивом и подробная методичка с примерами.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-orange-400 group-hover:gap-3 transition-all">
                <Globe className="h-4 w-4" />
                Открыть Редактор
                <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* SQL Playground */}
            <div
              className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 flex flex-col cursor-pointer group"
              onClick={onSqlPlayground}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSqlPlayground()}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-cyan-500/15 text-cyan-400 grid place-items-center group-hover:bg-cyan-500/25 transition-colors flex-shrink-0">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-base">SQL Playground</div>
                  <div className="text-xs text-muted-foreground">SQLite в браузере · JOIN · GROUP BY</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Интерактивный SQL-редактор с готовой базой данных (users, products, orders).
                Пиши и выполняй SQL-запросы прямо в браузере — без установки, со справочником.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-400 group-hover:gap-3 transition-all">
                <Database className="h-4 w-4" />
                Открыть SQL Playground
                <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Основные курсы ── */}
        <div className="mb-12 sm:mb-14 animate-float-up delay-200">
          <div className="section-label mb-4">Основные курсы</div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Main OOP course */}
            <div className="surface-card rounded-2xl overflow-hidden flex flex-col group hover:border-primary/40 transition-colors">
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary grid place-items-center flex-shrink-0">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-base">Основной курс — ООП</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {TOTAL_ROUNDS} раундов · от первых классов до архитектуры
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  Если фундамент Python уже есть — строй классы, наследование, dunder-методы
                  и архитектурные паттерны. Полный цикл от `class Cat:` до метаклассов.
                </p>
                <Button
                  onClick={onStart}
                  className="w-full touch-target"
                  data-testid="button-start-main"
                  style={{ boxShadow: "0 4px 16px -4px hsl(217 91% 65% / 0.4)" }}
                >
                  Начать ООП-курс
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Prep course */}
            <div className="surface-card rounded-2xl overflow-hidden flex flex-col group hover:border-accent/40 transition-colors">
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-11 w-11 rounded-xl bg-accent/15 text-accent grid place-items-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-base">Подготовка к ООП</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {PREP_TOTAL_ROUNDS} раундов · Python с нуля до ООП
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  Освежи базу перед ООП: типы, функции, коллекции, генераторы,
                  контекст-менеджеры. С отдельной оценкой за подготовку.
                </p>
                <Button
                  variant="outline"
                  onClick={onStartPrep}
                  className="w-full touch-target"
                  data-testid="button-start-prep"
                >
                  Подготовка к ООП
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Junior → Middle → Senior ── */}
        <div className="mb-12 sm:mb-16 animate-float-up delay-200">
          <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="section-label mb-1">Полный путь разработчика</div>
              <div className="text-xl sm:text-2xl font-bold">Junior → Middle → Senior</div>
              <div className="text-sm text-muted-foreground mt-1">
                Три отдельных курса по 7 раундов — каждый со своей оценкой 1–12.
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Junior */}
            <div className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 flex flex-col group hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/15 text-emerald-400 grid place-items-center flex-shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">Python Junior</div>
                  <div className="text-xs text-muted-foreground">{JUNIOR_TOTAL_ROUNDS} раундов · база</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Переменные, типы, ветвление, циклы, строки, списки, функции, словари.
                Если только начинаешь — стартуй здесь.
              </p>
              <Button
                onClick={onStartJunior}
                size="sm"
                className="w-full touch-target bg-emerald-600 hover:bg-emerald-500 text-white border-0"
                data-testid="button-start-junior"
              >
                Начать Junior
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Middle */}
            <div className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 flex flex-col group hover:border-sky-500/40 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-sky-500/15 text-sky-400 grid place-items-center flex-shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">Python Middle</div>
                  <div className="text-xs text-muted-foreground">{MIDDLE_TOTAL_ROUNDS} раундов · идиомы</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Comprehensions, файлы, исключения, модули, декораторы,
                генераторы, типизация и dataclasses.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onStartMiddle}
                className="w-full touch-target border-sky-500/40 text-sky-400 hover:bg-sky-500/10"
                data-testid="button-start-middle"
              >
                Начать Middle
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Senior */}
            <div className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 flex flex-col group hover:border-fuchsia-500/40 transition-colors sm:col-span-2 md:col-span-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-fuchsia-500/15 text-fuchsia-400 grid place-items-center flex-shrink-0">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">Python Senior</div>
                  <div className="text-xs text-muted-foreground">{SENIOR_TOTAL_ROUNDS} раундов · продвинутый</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                MRO/super, метаклассы, дескрипторы, threading, asyncio,
                профилирование, pytest, SOLID и паттерны.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onStartSenior}
                className="w-full touch-target border-fuchsia-500/40 text-fuchsia-400 hover:bg-fuchsia-500/10"
                data-testid="button-start-senior"
              >
                Начать Senior
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* HTML/CSS/JS course card */}
          <div className="mt-4">
            <div className="card-web-featured rounded-2xl overflow-hidden group">
              <div
                className="h-0.5 w-full"
                style={{ background: "linear-gradient(to right, hsl(213 90% 55%), hsl(170 80% 50%), hsl(280 80% 60% / 0.5))" }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="h-12 w-12 rounded-xl grid place-items-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(213 90% 55% / 0.20), hsl(170 80% 50% / 0.15))",
                      border: "1px solid hsl(213 90% 55% / 0.30)",
                    }}
                  >
                    <Globe className="h-5 w-5" style={{ color: "hsl(213 90% 68%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-2 flex-wrap mb-0.5">
                      <span>HTML · CSS · JavaScript</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "hsl(213 90% 55% / 0.18)",
                          color: "hsl(213 90% 70%)",
                          border: "1px solid hsl(213 90% 55% / 0.30)",
                        }}
                      >
                        Курс с раундами
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {HTML_TOTAL_ROUNDS} раундов · семантика, Flexbox, Grid, DOM, async/await, LocalStorage
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                      Освой веб-разработку с нуля: структура HTML5, адаптивные макеты на Flexbox и Grid,
                      интерактивность на JS и работа с API через fetch.
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                      {["<header>", "flex / grid", "querySelector", "fetch", "localStorage"].map((tag) => (
                        <code
                          key={tag}
                          className="text-xs font-mono"
                          style={{ color: "hsl(213 90% 68%)" }}
                        >
                          {tag}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onStartWeb}
                  className="w-full sm:w-auto flex-shrink-0 touch-target font-semibold"
                  data-testid="button-start-web"
                  style={{
                    background: "linear-gradient(135deg, hsl(213 80% 45%), hsl(170 70% 40%))",
                    border: "none",
                    boxShadow: "0 4px 18px -4px hsl(213 80% 45% / 0.50)",
                    color: "white",
                  }}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Начать HTML/CSS/JS
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Flask — featured card */}
          <div className="mt-4">
            <div className="card-flask-featured rounded-2xl overflow-hidden group">
              {/* top accent stripe */}
              <div
                className="h-0.5 w-full"
                style={{ background: "linear-gradient(to right, hsl(38 95% 60%), hsl(25 80% 55%), hsl(280 90% 65% / 0.4))" }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="h-12 w-12 rounded-xl grid place-items-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(38 95% 60% / 0.22), hsl(25 80% 55% / 0.18))",
                      border: "1px solid hsl(25 80% 55% / 0.32)",
                    }}
                  >
                    <Zap className="h-5 w-5" style={{ color: "hsl(38 95% 68%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-2 flex-wrap mb-0.5">
                      <span>Flask — веб-разработка</span>
                      <span className="badge-new badge-new--orange">Бонус-курс</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {FLASK_TOTAL_ROUNDS} раундов · маршруты, шаблоны, формы, SQLAlchemy, REST API
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                      Создай полноценное веб-приложение с нуля: маршруты и view-функции,
                      Jinja2-шаблоны, WTForms, SQLAlchemy и REST-эндпоинты.
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                      {["@app.route", "render_template", "request.form", "SQLAlchemy", "jsonify"].map((tag) => (
                        <code
                          key={tag}
                          className="text-xs font-mono"
                          style={{ color: "hsl(38 95% 62%)" }}
                        >
                          {tag}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onStartFlask}
                  className="w-full sm:w-auto flex-shrink-0 touch-target font-semibold"
                  style={{
                    background: "linear-gradient(135deg, hsl(25 80% 48%), hsl(38 95% 50%))",
                    border: "none",
                    boxShadow: "0 4px 18px -4px hsl(25 80% 48% / 0.55)",
                    color: "white",
                  }}
                  data-testid="button-start-flask"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Начать Flask
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* FastAPI — featured card */}
          <div className="mt-4">
            <div
              className="rounded-2xl overflow-hidden group"
              style={{ background: "hsl(220 30% 10% / 0.85)", border: "1px solid hsl(265 90% 65% / 0.28)" }}
            >
              <div
                className="h-0.5 w-full"
                style={{ background: "linear-gradient(to right, hsl(265 90% 65%), hsl(195 90% 55%), hsl(265 90% 65% / 0.3))" }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="h-12 w-12 rounded-xl grid place-items-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(265 90% 65% / 0.22), hsl(195 90% 55% / 0.18))",
                      border: "1px solid hsl(265 90% 65% / 0.35)",
                    }}
                  >
                    <Rocket className="h-5 w-5" style={{ color: "hsl(265 90% 72%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-2 flex-wrap mb-0.5">
                      <span>FastAPI — современный REST API</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "hsl(265 90% 65% / 0.18)", color: "hsl(265 90% 72%)", border: "1px solid hsl(265 90% 65% / 0.35)" }}
                      >
                        Бонус-курс
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {FASTAPI_TOTAL_ROUNDS} раундов · Pydantic, Depends, SQLAlchemy, JWT, тесты
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                      Создай production-ready API: маршруты и параметры, Pydantic-схемы,
                      система зависимостей Depends, аутентификация JWT, SQLAlchemy, middleware, тесты.
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                      {["BaseModel", "Depends()", "APIRouter", "OAuth2", "TestClient"].map((tag) => (
                        <code
                          key={tag}
                          className="text-xs font-mono"
                          style={{ color: "hsl(265 90% 72%)" }}
                        >
                          {tag}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onStartFastapi}
                  className="w-full sm:w-auto flex-shrink-0 touch-target font-semibold"
                  style={{
                    background: "linear-gradient(135deg, hsl(265 90% 55%), hsl(195 90% 50%))",
                    border: "none",
                    boxShadow: "0 4px 18px -4px hsl(265 90% 55% / 0.55)",
                    color: "white",
                  }}
                  data-testid="button-start-fastapi"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Начать FastAPI
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* ── SQL section label ── */}
          <div className="section-label mt-10 mb-4">Курсы по базам данных</div>

          {/* SQLite course card */}
          <div>
            <div className="surface-card rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div
                className="h-0.5 w-full"
                style={{ background: "linear-gradient(to right, hsl(160 84% 45%), hsl(160 84% 35%), hsl(160 84% 55% / 0.3))" }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="h-12 w-12 rounded-xl grid place-items-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(160 84% 45% / 0.20), hsl(160 84% 35% / 0.15))",
                      border: "1px solid hsl(160 84% 45% / 0.30)",
                    }}
                  >
                    <Database className="h-5 w-5" style={{ color: "hsl(160 84% 55%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-2 flex-wrap mb-0.5">
                      <span>SQLite · Базы данных с нуля</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "hsl(160 84% 45% / 0.18)",
                          color: "hsl(160 84% 60%)",
                          border: "1px solid hsl(160 84% 45% / 0.30)",
                        }}
                      >
                        {SQL_TOTAL_ROUNDS} раундов
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      SELECT, WHERE, JOIN, GROUP BY, транзакции, Python + sqlite3
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                      Освой SQL с нуля через Python: создай базу, делай запросы, фильтруй,
                      сортируй, соединяй таблицы — всё прямо в браузере через Pyodide.
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                      {["SELECT", "WHERE", "JOIN", "GROUP BY", "import sqlite3"].map((tag) => (
                        <code
                          key={tag}
                          className="text-xs font-mono"
                          style={{ color: "hsl(160 84% 55%)" }}
                        >
                          {tag}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onStartSql}
                  className="w-full sm:w-auto flex-shrink-0 touch-target font-semibold"
                  data-testid="button-start-sql"
                  style={{
                    background: "linear-gradient(135deg, hsl(160 84% 35%), hsl(160 84% 45%))",
                    border: "none",
                    boxShadow: "0 4px 18px -4px hsl(160 84% 40% / 0.55)",
                    color: "white",
                  }}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Начать SQLite
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* PostgreSQL course card */}
          <div className="mt-4">
            <div className="surface-card rounded-2xl overflow-hidden group hover:border-sky-500/40 transition-colors">
              <div
                className="h-0.5 w-full"
                style={{ background: "linear-gradient(to right, hsl(199 89% 48%), hsl(217 91% 60%), hsl(280 80% 60% / 0.4))" }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 sm:p-6">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="h-12 w-12 rounded-xl grid place-items-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(199 89% 48% / 0.20), hsl(217 91% 60% / 0.15))",
                      border: "1px solid hsl(199 89% 48% / 0.30)",
                    }}
                  >
                    <Database className="h-5 w-5" style={{ color: "hsl(199 89% 60%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold flex items-center gap-2 flex-wrap mb-0.5">
                      <span>PostgreSQL · Продвинутые базы данных</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "hsl(199 89% 48% / 0.18)",
                          color: "hsl(199 89% 65%)",
                          border: "1px solid hsl(199 89% 48% / 0.30)",
                        }}
                      >
                        {POSTGRES_TOTAL_ROUNDS} раундов
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Индексы, Window Functions, CTE, JSON, транзакции, Drizzle ORM
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                      Продвинутый PostgreSQL: оконные функции, рекурсивные CTE, JSONB,
                      оптимизация запросов, индексы и работа через Python psycopg2.
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                      {["WINDOW", "WITH RECURSIVE", "JSONB", "INDEX", "psycopg2"].map((tag) => (
                        <code
                          key={tag}
                          className="text-xs font-mono"
                          style={{ color: "hsl(199 89% 60%)" }}
                        >
                          {tag}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onStartPostgres}
                  className="w-full sm:w-auto flex-shrink-0 touch-target font-semibold"
                  data-testid="button-start-postgres"
                  style={{
                    background: "linear-gradient(135deg, hsl(199 89% 38%), hsl(217 91% 50%))",
                    border: "none",
                    boxShadow: "0 4px 18px -4px hsl(199 89% 45% / 0.55)",
                    color: "white",
                  }}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Начать PostgreSQL
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <hr className="section-divider mb-12 sm:mb-16" />

        {/* ── Feature cards ── */}
        <div className="mb-12 sm:mb-16 animate-float-up delay-300">
          <div className="section-label mb-5">Почему этот тренажёр работает</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Code2,
                title: "Реальный код, не огрызки",
                text: "Десятки строк, классы 60–100 строк, реальные паттерны — никакого учебного псевдокода.",
                color: "primary",
              },
              {
                icon: Lightbulb,
                title: "Подсказки без ответов",
                text: "К каждому пропуску — своя подсказка, которая подтолкнёт, но не выдаст решение.",
                color: "accent",
              },
              {
                icon: BookOpen,
                title: "Открытые вопросы",
                text: "Никаких готовых вариантов — пишешь сам и сразу проверяешь понимание.",
                color: "primary",
              },
              {
                icon: Zap,
                title: "IDE прямо в браузере",
                text: "Пиши Python-код с подсветкой синтаксиса и запускай через Pyodide — без установки.",
                color: "accent",
              },
              {
                icon: Trophy,
                title: "Оценка 1–12",
                text: "В конце каждого курса — итоговый балл по школьной шкале с развёрнутым описанием.",
                color: "primary",
              },
              {
                icon: GraduationCap,
                title: "Финал + методичка",
                text: "Большой финальный проект для учителя и подробные методички перед каждым раундом.",
                color: "accent",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="surface-card surface-card-hover rounded-2xl p-5 sm:p-6 group"
              >
                <div
                  className={`h-11 w-11 rounded-xl grid place-items-center mb-4 transition-colors ${
                    c.color === "primary"
                      ? "bg-primary/15 text-primary group-hover:bg-primary/25"
                      : "bg-accent/15 text-accent group-hover:bg-accent/25"
                  }`}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="font-semibold mb-1.5 text-sm sm:text-base">{c.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{c.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Программа курса ── */}
        <div className="surface-card rounded-2xl p-5 sm:p-7 mb-10 animate-float-up delay-300">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
            <div>
              <div className="section-label mb-1">Программа основного курса</div>
              <div className="text-xl sm:text-2xl font-bold">
                {TOTAL_ROUNDS} раундов с нарастающей сложностью
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-mono bg-muted/40 px-2.5 py-1 rounded-lg">
              ≈ {totalEx} заданий
            </div>
          </div>
          <div className="space-y-1.5">
            {ROUNDS.map((r) => {
              const fillLinesCount = r.fillLines?.length ?? 0;
              const count = r.fills.length + r.questions.length + r.writes.length + fillLinesCount;
              const totalBlanksRound = r.fills.reduce((s, f) => s + f.answers.length, 0);
              return (
                <div
                  key={r.number}
                  className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all cursor-default"
                >
                  <div className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-mono font-bold grid place-items-center text-sm border border-primary/20">
                    {r.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="font-semibold text-sm">{r.title}</div>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25 font-semibold hidden sm:inline">
                        {r.level}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {count} заданий · {totalBlanksRound} пропусков
                      {fillLinesCount > 0 && ` · ${fillLinesCount} блочных`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quick-start CTA ── */}
        <div className="text-center pb-8 animate-float-up delay-400">
          <p className="text-muted-foreground text-sm mb-5">
            Готов начать? Выбери курс выше или жми кнопку — и вперёд!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              onClick={onStart}
              className="h-12 px-8 text-base font-semibold touch-target"
              style={{ boxShadow: "0 8px 32px -8px hsl(217 91% 65% / 0.6), 0 0 0 1px hsl(217 91% 65% / 0.4)" }}
            >
              Начать ООП-курс
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onFlashcards}
              className="h-12 px-6 text-base touch-target"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Флэшкарты
            </Button>
          </div>
        </div>
      </div>

      {/* ── Admin Dialog ── */}
      <Dialog open={adminOpen} onOpenChange={(v) => { if (!v) closeAdmin(); }}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Панель администратора</DialogTitle>
            <DialogDescription>
              Введите данные для входа. Логин и пароль показаны на главной странице.
            </DialogDescription>
          </DialogHeader>

          {!authed ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="admin-login">Логин</Label>
                <Input
                  id="admin-login"
                  placeholder="Логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tryLogin()}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-pass">Пароль</Label>
                <Input
                  id="admin-pass"
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && tryLogin()}
                  className="h-11"
                />
              </div>
              {authError && (
                <div className="text-sm text-destructive flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  {authError}
                </div>
              )}
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={closeAdmin} className="touch-target">
                  Отмена
                </Button>
                <Button onClick={tryLogin} className="touch-target">
                  Войти
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center gap-3 text-sm text-emerald-400">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                Вход выполнен успешно!
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Курс</Label>
                  <select
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value as Course);
                      setSelectedRound(1);
                    }}
                  >
                    {(Object.entries(COURSE_META) as [Course, typeof COURSE_META[Course]][]).map(
                      ([key, meta]) => (
                        <option key={key} value={key}>{meta.label}</option>
                      ),
                    )}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Раунд (1–{activeMeta.total})</Label>
                  <select
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={selectedRound}
                    onChange={(e) => setSelectedRound(Number(e.target.value))}
                  >
                    {activeMeta.rounds.map((r) => (
                      <option key={r.number} value={r.number}>
                        Раунд {r.number} — {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-xl bg-muted/30 border border-border/50 p-3 text-xs text-muted-foreground leading-relaxed">
                Прогресс до выбранного раунда будет помечен как пройденный (без баллов).
                Результаты этих раундов не учитываются в итоговой оценке.
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={closeAdmin} className="touch-target">
                  Отмена
                </Button>
                <Button onClick={confirmJump} className="touch-target">
                  <Star className="mr-2 h-4 w-4" />
                  Перейти к раунду {selectedRound}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
