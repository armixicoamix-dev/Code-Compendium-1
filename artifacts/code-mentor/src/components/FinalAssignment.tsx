import { useState } from "react";
import {
  ASSIGNMENT_OVERVIEW,
  FINAL_ASSIGNMENT,
  FINAL_WALKTHROUGH,
  METHODOLOGY,
} from "@/data/methodology";
import { PyCode } from "@/components/PyCode";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CornerDownRight,
  GraduationCap,
  Home,
  Layers,
  Lightbulb,
  Network,
  Printer,
  Sparkles,
  Target,
  Terminal,
} from "lucide-react";

export function FinalAssignment({
  onBack,
  onHome,
}: {
  onBack: () => void;
  onHome?: () => void;
}) {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8 -ml-2">
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 hover-elevate px-2 py-1 rounded"
            data-testid="button-back-to-results"
          >
            <ArrowLeft className="h-4 w-4" />
            К итогам
          </button>
          {onHome && (
            <button
              onClick={onHome}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 hover-elevate px-2 py-1 rounded"
              data-testid="button-home-final"
            >
              <Home className="h-4 w-4" />
              На главную
            </button>
          )}
        </div>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium mb-4">
            <GraduationCap className="h-3.5 w-3.5" />
            Финальное задание
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {FINAL_ASSIGNMENT.title}
          </h1>
        </div>

        <div className="rounded-xl border bg-card p-6 mb-6">
          <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">
            {FINAL_ASSIGNMENT.description}
          </p>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden mb-8">
          <div className="px-6 py-4 border-b bg-muted/30">
            <div className="font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Что должна уметь программа
            </div>
          </div>
          <ol className="divide-y">
            {FINAL_ASSIGNMENT.requirements.map((req, i) => (
              <li key={i} className="px-6 py-3.5 flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono grid place-items-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{req}</span>
              </li>
            ))}
          </ol>
        </div>

        {!showMethodology ? (
          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
            <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
            <div className="text-lg font-semibold mb-1">
              Открой методичку — там МЕГА подробное руководство
            </div>
            <div className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              На каждом из 8 шагов разобрано, ЧТО делать, ЗАЧЕМ делать, какие концепции
              задействованы и какой результат должна выдавать программа. Готового кода
              в методичке НЕТ — только подробные инструкции и каркасы для самостоятельного
              написания.
            </div>
            <Button
              size="lg"
              onClick={() => setShowMethodology(true)}
              className="h-12 px-8"
              data-testid="button-show-methodology"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Открыть методичку
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Методичка
                  </div>
                  <div className="font-semibold">Подробное руководство по реализации</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()} data-testid="button-print">
                <Printer className="mr-2 h-4 w-4" />
                Распечатать
              </Button>
            </div>

            <div className="rounded-lg border-l-4 border-amber-500 bg-amber-500/5 px-4 py-3 text-sm">
              <span className="font-medium text-amber-700 dark:text-amber-400">Важно: </span>
              ниже — инструкции, разбор концепций и каркасы для самостоятельной работы, а
              не готовый код. Каждую строку ты пишешь сам, опираясь на эти описания.
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b bg-gradient-to-r from-accent/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-accent/15 text-accent grid place-items-center">
                    <Network className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-accent font-semibold">
                      Шаг 0
                    </div>
                    <h3 className="font-semibold text-lg">{ASSIGNMENT_OVERVIEW.title}</h3>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {ASSIGNMENT_OVERVIEW.description}
                </p>
                <div className="rounded-lg bg-muted/50 border border-border/50 px-4 py-3 font-mono text-xs leading-loose overflow-x-auto">
                  {ASSIGNMENT_OVERVIEW.diagram.map((line, i) => (
                    <div key={i} className="whitespace-pre text-foreground/85">
                      {line}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                    Почему именно так спроектировано
                  </div>
                  <ul className="space-y-2">
                    {ASSIGNMENT_OVERVIEW.whyThisDesign.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                        <CornerDownRight className="h-3.5 w-3.5 text-accent mt-1 flex-shrink-0" />
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {METHODOLOGY.map((step, i) => (
                <div key={i} className="rounded-xl border bg-card overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold font-mono grid place-items-center text-sm">
                        {i + 1}
                      </div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                    </div>
                  </div>
                  <div className="px-6 py-5 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded-md bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                        <Target className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                          Цель шага
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{step.goal}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-400 grid place-items-center flex-shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                          Действия — что писать
                        </div>
                        <ol className="space-y-2">
                          {step.steps.map((s, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm leading-relaxed">
                              <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span className="text-foreground/90">{s}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {step.concepts && step.concepts.length > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-md bg-accent/15 text-accent grid place-items-center flex-shrink-0">
                          <Layers className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                            Что значит каждая концепция
                          </div>
                          <div className="space-y-3">
                            {step.concepts.map((c, j) => (
                              <div key={j} className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
                                <div className="font-mono text-sm font-semibold text-accent mb-1">
                                  {c.name}
                                </div>
                                <div className="text-sm text-foreground/90 mb-1.5 leading-relaxed">
                                  {c.what}
                                </div>
                                <div className="text-xs text-foreground/70 leading-relaxed whitespace-pre-line">
                                  {c.details}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step.skeleton && (
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-md bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                            Каркас — структура для подражания (НЕ копировать дословно)
                          </div>
                          <PyCode code={step.skeleton} filename="school.py" />
                        </div>
                      </div>
                    )}

                    {step.expectedOutput && (
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-md bg-muted text-foreground/70 grid place-items-center flex-shrink-0">
                          <Terminal className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-2">
                            Что должна напечатать программа
                          </div>
                          <pre className="text-xs leading-relaxed font-mono text-foreground/85 bg-muted/40 border border-border/40 rounded-lg px-4 py-3 overflow-x-auto whitespace-pre-wrap">
                            {step.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    )}

                    {step.tip && (
                      <div className="rounded-md bg-accent/10 border border-accent/20 px-4 py-3 text-sm flex items-start gap-2.5">
                        <Lightbulb className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-accent">Совет: </span>
                          <span className="text-foreground/85">{step.tip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
              <div className="px-6 py-4 border-b border-primary/20 bg-primary/10">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">
                      Завершающая сводка
                    </div>
                    <h3 className="font-semibold text-lg">{FINAL_WALKTHROUGH.title}</h3>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {FINAL_WALKTHROUGH.description}
                </p>
                <div className="space-y-3">
                  {FINAL_WALKTHROUGH.sections.map((s, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card/50 px-4 py-3">
                      <div className="font-semibold text-sm text-primary mb-1.5">{s.heading}</div>
                      <p className="text-sm text-foreground/85 leading-relaxed">{s.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
              <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <div className="font-semibold text-lg mb-1">Готово!</div>
              <div className="text-sm text-muted-foreground max-w-lg mx-auto">
                Если ты прошёл все 8 шагов и твоя программа работает — задание готово к
                сдаче. Покажи учителю и расскажи, какие принципы ООП ты применил в
                каждом классе. Удачи!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
