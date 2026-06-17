export interface ExerciseExplanation {
  /** Overall summary of what this exercise teaches and why */
  summary: string;
  /** Bulleted key insights / what each important part means */
  keyPoints: string[];
  /** Common mistakes/edge cases learners trip on */
  pitfalls?: string[];
  /** Optional real-world relevance / where this pattern is used */
  realWorld?: string;
}

export interface CodeFillExercise {
  type: "fill";
  id: string;
  title: string;
  description: string;
  /** Code with {{i}} markers for blanks, where i is the index */
  code: string;
  /** Correct answers per blank index. Each blank can have multiple acceptable answers. */
  answers: string[][];
  /** Hint per blank index — must be a hint, not the answer */
  hints: string[];
  /** Detailed explanation shown after the user checks their answers (attached at module load). */
  explanation?: ExerciseExplanation;
  /** "python" (default) shows Python runner; "web" hides it and labels file correctly */
  language?: "python" | "web";
}

export interface QuestionExercise {
  type: "question";
  id: string;
  title: string;
  question: string;
  /** Optional code snippet shown above the question */
  code?: string;
  /** Acceptable answers (case-insensitive, trimmed). Multiple variants allowed. */
  answers: string[];
  hint: string;
  explanation: string;
}

export interface WriteFromScratchExercise {
  type: "write";
  id: string;
  title: string;
  task: string;
  /** Hints — each is a step of guidance, NEVER the full code */
  hints: string[];
  /** Required substrings/keywords that must appear in the answer (case-sensitive). */
  required: string[];
  /** Minimum number of non-empty lines in the solution */
  minLines: number;
  /**
   * "python"    — default; shows Python editor + Pyodide runner
   * "web"       — shows HTML/CSS/JS editors + live preview (no Python runner)
   * "flask-web" — shows Python editor + HTML/CSS/JS editors; JS fetch() routes through Pyodide Flask
   */
  language?: "python" | "web" | "flask-web";
  /** Detailed explanation shown after the user checks their solution (attached at module load). */
  explanation?: ExerciseExplanation;
  /** ID of a WEB_DOCS section to highlight in the Методичка tab when this exercise is active. */
  docRef?: string;
}

/** A single missing line/block inside a CodeFillLinesExercise. */
export interface LineBlank {
  /** Approximate number of code lines the user is expected to write (used for textarea sizing). */
  lines: number;
  /** Required substrings — partial credit for finding each (case-sensitive). */
  required: string[];
  /** Optional substrings that should NOT appear (e.g., wrong patterns). */
  forbidden?: string[];
  /** Hint text shown on demand. */
  hint: string;
  /** Reference solution (one possible correct answer) shown after check. */
  reference: string;
  /** Optional placeholder shown inside the textarea. */
  placeholder?: string;
}

/**
 * Advanced exercise type: code with FULL LINES or BLOCKS missing,
 * marked by `{{LINE:N}}`. The user types real Python lines, not just words.
 * Each blank is graded by required-keyword coverage — partial credit allowed.
 */
export interface CodeFillLinesExercise {
  type: "fill-lines";
  id: string;
  title: string;
  description: string;
  /** Code containing one `{{LINE:N}}` per blank, sitting on its own line. */
  code: string;
  /** Per-blank specs (indexed by N). */
  blanks: LineBlank[];
  explanation?: ExerciseExplanation;
}

export type Exercise =
  | CodeFillExercise
  | QuestionExercise
  | WriteFromScratchExercise
  | CodeFillLinesExercise;

/**
 * Один раздел методички. Может быть просто текстовым, может содержать
 * пример кода, может — список «что запомнить» и «частые грабли».
 *
 * Параграфы в `body` разделяются двойным переводом строки (\n\n).
 * Внутри `body` поддерживается «лёгкий» markdown:
 *   - **жирный**          → <strong>жирный</strong>
 *   - `моноширинный`      → <code>моноширинный</code>
 *   - строки, начинающиеся с `- ` или `• `, рендерятся как буллеты
 */
export interface LessonSection {
  /** Заголовок раздела (h3-уровень). */
  heading: string;
  /** Краткий лозунг под заголовком (1 строка). */
  tagline?: string;
  /** Основной текст раздела (несколько абзацев, разделённых \n\n). */
  body: string;
  /** Опциональный пример Python-кода. */
  code?: string;
  /** Опциональная житейская аналогия — отдельный выделенный блок. */
  analogy?: string;
  /** «Что важно запомнить» — список буллетов. */
  keyTakeaways?: string[];
  /** «Где обычно ломается» — список частых ошибок/мифов. */
  pitfalls?: string[];
}

/**
 * Полная методичка перед раундом — то, что ученик читает ДО заданий.
 * Здесь кратко, но строго объясняется ВСЁ необходимое для прохождения.
 */
export interface RoundLesson {
  /** Полный заголовок методички — обычно длиннее, чем заголовок раунда. */
  title: string;
  /** Аннотация: 2-3 предложения, что узнаем и зачем. */
  summary: string;
  /** Примерное время чтения в минутах. */
  readingMinutes: number;
  /** Разделы методички — основное содержимое. */
  sections: LessonSection[];
  /** Финальная шпаргалка: 4-8 коротких пунктов «что точно нужно помнить». */
  cheatSheet?: string[];
}

export interface Round {
  number: number;
  title: string;
  level:
    | "Начальный"
    | "Начальный → Средний"
    | "Средний"
    | "Средний → Сложный"
    | "Сложный"
    | "Сложный → Эксперт"
    | "Эксперт"
    | "Архитектор";
  intro: string;
  fills: CodeFillExercise[];
  questions: QuestionExercise[];
  writes: WriteFromScratchExercise[];
  /** Optional new-style exercises: filling missing LINES/BLOCKS. Present in advanced rounds (6-10). */
  fillLines?: CodeFillLinesExercise[];
  /** Подробная методичка перед раундом. Привязывается из ./lessons.ts. */
  lesson?: RoundLesson;
}

// ---------------------------------------------------------------------------
// ROUND 1 — Начальный: первые классы, __init__, методы экземпляра
// ---------------------------------------------------------------------------

const round1: Round = {
  number: 1,
  title: "Знакомство с классами",
  level: "Начальный",
  intro:
    "Начинаем с фундамента: что такое класс, как устроен экземпляр, для чего нужен self, как работает __init__ и чем атрибут отличается от метода. Здесь закладывается мышление, на котором стоит вся остальная ООП.",
  fills: [
    {
      type: "fill",
      id: "r1-f1",
      title: "Класс Cat — атрибуты и поведение",
      description:
        "Заверши класс Cat. У него три атрибута, четыре метода поведения и сцена в самом низу: создаём двух кошек и заставляем их проявлять характер. Заполни все пропуски.",
      code: `# Класс кошки с состоянием и поведением
{{0}} Cat:
    """Простейший класс домашнего животного."""

    def {{1}}(self, name, age, breed):
        # сохраняем входные параметры в атрибуты экземпляра
        {{2}}.name = name
        self.{{3}} = age
        self.breed = {{4}}
        self.{{5}} = False        # сыта ли (изначально нет)
        self.mood = "neutral"

    def meow(self):
        print(f"{self.{{6}}} говорит: мяу!")

    def feed(self, food):
        print(f"{self.name} ест {food}")
        {{7}}.is_full = True
        self.mood = "happy"

    def play(self):
        if self.is_full:
            print(f"{self.name} играет с клубком")
            self.{{8}} = "excited"
        else:
            print(f"{self.name} слишком голоден, чтобы играть")

    def describe(self):
        return (
            f"Это {self.{{9}}}, порода {self.breed}, "
            f"возраст {self.age}, настроение: {self.{{10}}}"
        )


# === Сцена ===
barsik = {{11}}("Барсик", 3, "британец")
murka = Cat({{12}}, 2, "сиамская")

barsik.meow()
barsik.feed("корм")
barsik.{{13}}()                       # должен играть, он сыт

murka.{{14}}()                        # пока ничего не делал — голодный
murka.play()                         # должен отказаться играть

print(barsik.{{15}}())
print(murka.describe())
`,
      answers: [
        ["class"],
        ["__init__"],
        ["self"],
        ["age"],
        ["breed"],
        ["is_full"],
        ["name"],
        ["self"],
        ["mood"],
        ["name"],
        ["mood"],
        ["Cat"],
        ['"Мурка"', "'Мурка'"],
        ["play"],
        ["meow"],
        ["describe"],
      ],
      hints: [
        "Ключевое слово для объявления класса в Python.",
        "Имя метода-конструктора — два подчёркивания с обеих сторон.",
        "Стандартное имя первого параметра метода экземпляра.",
        "Атрибут возраста, имя должно совпадать с параметром.",
        "Атрибут породы — присваиваем параметр напрямую.",
        "Логический флаг сытости. Имя на английском, в snake_case, начинается с is_.",
        "Подставь имя кошки в f-строку через self.<атрибут>.",
        "Внутри метода ссылка на текущий экземпляр.",
        "В feed мы поставили mood=happy, тут — после игры — нужно поменять mood.",
        "В describe тоже подставляем имя.",
        "Последнее, что нужно показать в строке describe — это настроение.",
        "Имя класса, через который создаём экземпляр.",
        "Имя второй кошки строкой.",
        "Метод, который должен сработать на сытой кошке.",
        "Метод, которым кошка подаёт голос.",
        "Имя метода, который мы только что описали и который возвращает строку.",
      ],
    },
    {
      type: "fill",
      id: "r1-f2",
      title: "BankAccount — операции и история",
      description:
        "Закрой пробелы в банковском счёте. У счёта должны быть пополнение, снятие, перевод на другой счёт и журнал последних операций.",
      code: `class BankAccount:
    """Простой банковский счёт с журналом."""

    def __init__(self, owner, balance=0):
        self.{{0}} = owner
        self.balance = {{1}}
        self.history = []                 # список последних операций

    def _log(self, kind, amount):
        self.history.{{2}}(f"{kind}: {amount}")

    def deposit(self, amount):
        if amount <= {{3}}:
            print("Сумма должна быть положительной")
            return
        self.balance {{4}} amount
        self._log("deposit", amount)

    def withdraw(self, amount):
        if amount > self.{{5}}:
            print(f"{self.owner}: недостаточно средств")
            return False
        self.balance -= {{6}}
        self._log("withdraw", amount)
        return {{7}}

    def transfer(self, other, amount):
        # other — это другой объект BankAccount
        if not isinstance(other, {{8}}):
            raise TypeError("other должен быть BankAccount")
        ok = self.{{9}}(amount)
        if ok:
            other.{{10}}(amount)
            self._log("transfer_out", amount)
            other._log("transfer_in", amount)

    def show(self):
        print(f"{self.owner}: {self.{{11}}} грн")
        print("История:", ", ".join(self.history[-3:]))


# === Сцена ===
anna = BankAccount("Анна", 500)
ivan = {{12}}("Иван", 100)

anna.deposit(200)
anna.withdraw(50)
anna.{{13}}(ivan, 300)            # Анна → Иван 300

anna.show()                       # Анна: 350 грн
ivan.{{14}}()                      # Иван: 400 грн
`,
      answers: [
        ["owner"],
        ["balance"],
        ["append"],
        ["0"],
        ["+="],
        ["balance"],
        ["amount"],
        ["True"],
        ["BankAccount"],
        ["withdraw"],
        ["deposit"],
        ["balance"],
        ["BankAccount"],
        ["transfer"],
        ["show"],
      ],
      hints: [
        "Атрибут владельца счёта, имя совпадает с параметром.",
        "Сохраняем начальный баланс в атрибут.",
        "Метод списка для добавления элемента в конец.",
        "С каким минимальным числом сравниваем сумму, чтобы отвергнуть невалидный ввод?",
        "Какой составной оператор увеличивает значение на правую часть?",
        "К какому атрибуту обращаемся, чтобы проверить наличие средств?",
        "Какую переменную вычитаем из баланса?",
        "Что возвращаем при успешном снятии? (логическое значение)",
        "Класс, экземпляром которого должен быть other (имя того же класса).",
        "Метод, который списывает у себя средства.",
        "Метод, который зачисляет средства другому счёту.",
        "Атрибут, отвечающий за текущий баланс.",
        "Имя класса, чтобы создать счёт Ивана.",
        "Метод перевода со счёта на счёт.",
        "Метод вывода информации о счёте.",
      ],
    },
    {
      type: "fill",
      id: "r1-f3",
      title: "Rectangle — площадь, периметр, масштабирование",
      description:
        "Дополни класс прямоугольника. Кроме площади и периметра, должно быть масштабирование, проверка на квадрат и красивый вывод.",
      code: `class Rectangle:
    """Геометрический прямоугольник со сторонами width и height."""

    def __init__({{0}}, width, height):
        if width <= 0 or {{1}} <= 0:
            raise ValueError("Стороны должны быть положительными")
        self.width = {{2}}
        self.height = height

    def area(self):
        return self.width {{3}} self.height

    def perimeter(self):
        return {{4}} * (self.width + self.{{5}})

    def is_square(self):
        return self.{{6}} == self.height

    def scale(self, factor):
        # увеличить обе стороны в factor раз
        self.width *= {{7}}
        self.{{8}} *= factor

    def describe(self):
        kind = "квадрат" if self.{{9}}() else "прямоугольник"
        a = self.area()
        p = self.{{10}}()
        return f"{kind} {self.width}x{self.height}: S={a}, P={p}"

    def __repr__(self):
        return f"Rectangle({self.width}, {self.{{11}}})"


# === Сцена ===
r = {{12}}(4, 5)
print(r.{{13}}())                       # 20
print(r.perimeter())                  # 18
print(r.is_square())                  # False
r.{{14}}(2)                            # стороны удваиваются
print(r.describe())                   # прямоугольник 8x10
print({{15}}(r))                       # вызовет __repr__
`,
      answers: [
        ["self"],
        ["height"],
        ["width"],
        ["*"],
        ["2"],
        ["height"],
        ["width"],
        ["factor"],
        ["height"],
        ["is_square"],
        ["perimeter"],
        ["height"],
        ["Rectangle"],
        ["area"],
        ["scale"],
        ["repr"],
      ],
      hints: [
        "Первый параметр любого метода экземпляра.",
        "Вторая сторона тоже должна быть положительной.",
        "Сохраняем ширину в одноимённое поле.",
        "Какой оператор даёт произведение?",
        "Какое число умножается на сумму сторон при вычислении периметра?",
        "Имя поля высоты в формуле периметра.",
        "С чем сравниваем height, чтобы понять, квадрат ли это?",
        "На что умножаем ширину при масштабировании?",
        "Аналогично для второй стороны.",
        "Имя метода, проверяющего квадратность.",
        "Имя метода периметра.",
        "Имя поля высоты в __repr__.",
        "Имя класса для создания экземпляра.",
        "Имя метода площади.",
        "Метод масштабирования.",
        "Встроенная функция, вызывающая __repr__ объекта.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r1-q1",
      title: "Что такое self?",
      question:
        "В Python существует договорённость: первый параметр метода экземпляра называть именно так, чтобы ссылаться на сам объект. Как называется этот параметр? Введи одно слово-имя.",
      answers: ["self"],
      hint: "self — это просто соглашение об имени первого параметра. Пишешь def hello(self): — именно это слово и введи.",
      explanation:
        "self — явная ссылка на текущий экземпляр класса. Технически можно назвать его как угодно, но по соглашению PEP 8 это всегда self. Эквивалент 'this' в Java/C++, но в Python его нужно явно объявить первым параметром.",
    },
    {
      type: "question",
      id: "r1-q2",
      title: "Что выведет программа?",
      question:
        "Запиши, ровно что появится в консоли (одной строкой) после запуска кода ниже.",
      code: `class Dog:
    def __init__(self, name, age=1):
        self.name = name
        self.age = age

    def info(self):
        return f"{self.name}, {self.age} лет"

d = Dog("Рекс", 4)
e = Dog("Барбос")
print(d.info(), "/", e.info())`,
      answers: ["Рекс, 4 лет / Барбос, 1 лет"],
      hint: "У Барбоса возраст не передан — берётся значение по умолчанию.",
      explanation:
        "Когда параметр имеет значение по умолчанию (age=1), его можно не передавать. print со sep=' ' выводит аргументы через пробел; '/' — разделитель между info().",
    },
    {
      type: "question",
      id: "r1-q3",
      title: "Имя конструктора",
      question:
        "Как называется специальный метод, который Python автоматически вызывает при создании нового объекта класса? Введи имя метода точно так, как пишется в коде.",
      answers: ["__init__"],
      hint: "Два подчёркивания с обеих сторон.",
      explanation:
        "__init__ — конструктор/инициализатор. Внутри него обычно сохраняют входные аргументы в атрибуты экземпляра.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r1-w1",
      title: "Класс Person с биографией",
      task:
        "Напиши класс Person с атрибутами name, age, city. Добавь методы:\n• greet() — выводит «Привет, я <name>».\n• have_birthday() — увеличивает возраст на 1 и печатает «Теперь мне <age>».\n• move(new_city) — меняет город и печатает «Переехал в <new_city>».\n• bio() — возвращает строку «<name>, <age> лет, живёт в <city>».\nСоздай 2 объекта, для каждого вызови greet(), have_birthday(), move() и в конце выведи bio() обоих.",
      hints: [
        "Объяви class Person: и __init__(self, name, age, city), сохрани все три параметра.",
        "В have_birthday меняй self.age и печатай через f-строку.",
        "В move просто перезапиши self.city и напечатай сообщение.",
        "bio() должен именно return-ить строку, а не печатать.",
        "Создай двух разных Person с разными данными и пройдись по сценарию для обоих.",
      ],
      required: [
        "class Person",
        "__init__",
        "self.name",
        "self.age",
        "self.city",
        "def greet",
        "def have_birthday",
        "def move",
        "def bio",
        "return",
        "Person(",
      ],
      minLines: 18,
    },
    {
      type: "write",
      id: "r1-w2",
      title: "Класс Counter с историей",
      task:
        "Сделай класс Counter, который умеет считать и помнит свои действия. Атрибуты: value (по умолчанию 0), history (список строк-действий). Методы:\n• increment(by=1) — увеличивает value на by и добавляет в history запись «+by».\n• decrement(by=1) — уменьшает value на by и добавляет «-by».\n• reset() — value=0, добавляет «reset» в history.\n• show() — печатает «value=<value>, история: <history>».\nПродемонстрируй: создай счётчик, вызови все методы (с параметрами и без), в конце вызови show().",
      hints: [
        "В __init__ инициализируй self.value = 0 и self.history = [].",
        "increment(by=1) — параметр со значением по умолчанию.",
        "В history добавляй строки через self.history.append(...).",
        "В show используй f-строку и подставь оба атрибута.",
        "Сцена должна показать минимум 4 разных вызова, чтобы история заполнилась.",
      ],
      required: [
        "class Counter",
        "self.value",
        "self.history",
        "def increment",
        "def decrement",
        "def reset",
        "def show",
        "append",
      ],
      minLines: 18,
    },
    {
      type: "write",
      id: "r1-w3",
      title: "Класс Book и небольшая библиотека",
      task:
        "Создай класс Book с атрибутами title, author, pages, year. Методы:\n• info() — возвращает «<title>, <author> ({year}, {pages} с.)».\n• is_long() — возвращает True, если pages > 300.\nЗатем создай список из 3 книг и в цикле выведи info() для каждой, а также напечатай, какие из них длинные через is_long().",
      hints: [
        "В конструкторе сохрани все 4 параметра.",
        "info() обязательно return, не print.",
        "is_long() — простое сравнение pages с числом.",
        "Создай список books = [Book(...), Book(...), Book(...)] с разными pages.",
        "Цикл for b in books: и условные ветви.",
      ],
      required: [
        "class Book",
        "self.title",
        "self.author",
        "self.pages",
        "self.year",
        "def info",
        "def is_long",
        "return",
        "for ",
      ],
      minLines: 18,
    },
  ],
};

// ---------------------------------------------------------------------------
// ROUND 2 — Начальный → Средний: атрибуты класса, инкапсуляция, виды методов
// ---------------------------------------------------------------------------

const round2: Round = {
  number: 2,
  title: "Атрибуты, инкапсуляция и виды методов",
  level: "Начальный → Средний",
  intro:
    "Учимся отличать атрибут класса от атрибута экземпляра, прятать данные через подчёркивания и работать с тремя видами методов: instance-методами, @classmethod и @staticmethod. Это инструменты, которые превращают код из набора функций в настоящий класс.",
  fills: [
    {
      type: "fill",
      id: "r2-f1",
      title: "Класс Dog со счётчиком и реестром",
      description:
        "Сделай так, чтобы species был общий, count считал созданных собак, а all_dogs хранил список всех экземпляров. Добавь classmethod, возвращающий статистику.",
      code: `class Dog:
    """Все собаки одного вида и считают сами себя."""

    species = {{0}}                  # атрибут класса — общий для всех
    count = 0
    all_dogs = []

    def __init__(self, name, age):
        self.{{1}} = name
        self.age = {{2}}
        Dog.{{3}} += 1                # обновляем счётчик класса
        Dog.all_dogs.{{4}}(self)      # регистрируемся в реестре

    def bark(self):
        print(f"{self.name}: гав!")

    {{5}}
    def how_many(cls):
        return cls.{{6}}

    @classmethod
    def average_age(cls):
        if not cls.{{7}}:
            return 0
        ages = [d.{{8}} for d in cls.all_dogs]
        return {{9}}(ages) / len(ages)

    @classmethod
    def reset_registry(cls):
        cls.{{10}}.clear()
        cls.count = {{11}}


# === Сцена ===
a = Dog("Рекс", 5)
b = Dog("Барбос", 3)
c = {{12}}("Мухтар", 7)

print(Dog.{{13}})                     # → Canis familiaris
print(Dog.how_many())                # → 3
print(Dog.{{14}}())                   # → 5.0 (среднее)
Dog.reset_registry()
print(Dog.{{15}}())                   # → 0
`,
      answers: [
        ['"Canis familiaris"', "'Canis familiaris'"],
        ["name"],
        ["age"],
        ["count"],
        ["append"],
        ["@classmethod"],
        ["count"],
        ["all_dogs"],
        ["age"],
        ["sum"],
        ["all_dogs"],
        ["0"],
        ["Dog"],
        ["species"],
        ["average_age"],
        ["how_many"],
      ],
      hints: [
        "Строка с латинским названием вида в кавычках.",
        "Имя сохраняется уникально для каждой собаки — через self.",
        "Возраст тоже сохраняется как атрибут экземпляра.",
        "К общему счётчику обращаемся через имя класса.",
        "Метод списка для регистрации нового экземпляра.",
        "Декоратор для метода, работающего с классом, а не с экземпляром.",
        "Возвращаем поле счётчика — имя то же.",
        "Атрибут-реестр всех собак, который проверяем на пустоту.",
        "Из объекта собаки достаём поле возраста.",
        "Встроенная функция суммы.",
        "В reset очищаем тот же реестр.",
        "А счётчик обнуляем числом.",
        "Имя класса для создания третьей собаки.",
        "Атрибут класса, который мы напечатали — название вида.",
        "Имя classmethod для среднего возраста.",
        "Имя classmethod для счётчика — он же используется в reset.",
      ],
    },
    {
      type: "fill",
      id: "r2-f2",
      title: "Инкапсуляция: SafeAccount c name-mangling",
      description:
        "Спрячь баланс через двойное подчёркивание, дай безопасный доступ через get_balance и transactions. Покажи, что прямой доступ к __balance не работает.",
      code: `class SafeAccount:
    """Счёт, у которого баланс действительно скрыт."""

    def __init__(self, owner, balance=0):
        self.owner = owner
        self.{{0}}balance = balance       # name-mangling в действии
        self._transactions = []

    def deposit(self, amount):
        if amount <= 0:
            raise {{1}}("Сумма должна быть > 0")
        self.{{2}}balance += amount
        self._transactions.append(("+", amount))

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Сумма должна быть > 0")
        if amount > self.{{3}}balance:
            raise ValueError("Недостаточно средств")
        self.{{4}}balance -= amount
        self._transactions.append(("-", {{5}}))

    def get_balance(self):
        return self.{{6}}balance

    def transactions(self):
        # отдаём копию, чтобы снаружи не сломали наш список
        return self._transactions.{{7}}()

    def __repr__(self):
        return f"SafeAccount({self.{{8}}!r}, balance={self.__balance})"


# === Сцена ===
acc = SafeAccount("Иван", 500)
acc.deposit(200)
acc.{{9}}(150)
print(acc.get_balance())                  # → 550
print(acc.{{10}}())                        # → [('+',200), ('-',150)]

# Прямой доступ к __balance снаружи — атрибут переименован
try:
    print(acc.__balance)
except {{11}} as e:
    print("Скрыто:", e)

# Зато через искажённое имя — можно (но это плохой стиль)
print("Через mangling:", acc._SafeAccount__{{12}})
`,
      answers: [
        ["__"],
        ["ValueError"],
        ["__"],
        ["__"],
        ["__"],
        ["amount"],
        ["__"],
        ["copy"],
        ["owner"],
        ["withdraw"],
        ["transactions"],
        ["AttributeError"],
        ["balance"],
      ],
      hints: [
        "Префикс из двух подчёркиваний делает атрибут «приватным».",
        "Стандартное исключение для неверного значения аргумента.",
        "Тот же префикс, чтобы попасть в скрытый атрибут.",
        "И снова двойное подчёркивание перед именем поля.",
        "Списываем средства из того же скрытого поля.",
        "Какую переменную добавляем в журнал транзакций?",
        "Аналогично — обращение к скрытому балансу.",
        "Метод списка, возвращающий копию.",
        "В __repr__ подставляем имя владельца.",
        "Метод снятия средств.",
        "Метод журнала транзакций.",
        "Какое исключение возникнет при попытке прочитать `acc.__balance` снаружи?",
        "Обращение к настоящему искажённому имени `_SafeAccount__<…>`.",
      ],
    },
    {
      type: "fill",
      id: "r2-f3",
      title: "Date — два classmethod-конструктора и staticmethod-валидатор",
      description:
        "Добавь альтернативные конструкторы from_string и today, статический валидатор is_valid и метод to_iso. У класса должна быть полноценная фабричная семантика.",
      code: `from datetime import date as _today

class Date:
    """Минималистичная дата с альтернативными конструкторами."""

    def __init__(self, day, month, year):
        if not Date.{{0}}(day, month, year):
            raise ValueError(f"Невалидная дата: {day}-{month}-{year}")
        self.day = day
        self.{{1}} = month
        self.year = year

    {{2}}
    def from_string(cls, s):                   # формат "12-04-2025"
        d, m, y = map({{3}}, s.split("-"))
        return {{4}}(d, m, y)                   # альтернативный конструктор

    @classmethod
    def from_iso(cls, s):                      # формат "2025-04-12"
        y, m, d = map(int, s.split("-"))
        return {{5}}(d, m, y)

    @{{6}}
    def today(cls):
        t = _today.today()
        return cls(t.day, t.month, t.{{7}})

    @{{8}}
    def is_valid(d, m, y):
        if not (1 <= m <= 12):
            return False
        if not (1 <= d <= 31):
            return {{9}}
        return y > 0

    def to_iso(self):
        return f"{self.year:04d}-{self.{{10}}:02d}-{self.day:02d}"


# === Сцена ===
print(Date.is_valid(31, 2, 2024))             # формальная проверка → True
d1 = Date.{{11}}("12-04-2025")
d2 = Date.from_iso("2025-12-31")
d3 = Date.{{12}}()                             # сегодняшняя дата
print(d1.{{13}}())                              # → 2025-04-12
print(d2.day, d2.month, d2.{{14}})             # → 31 12 2025
`,
      answers: [
        ["is_valid"],
        ["month"],
        ["@classmethod"],
        ["int"],
        ["cls"],
        ["cls"],
        ["classmethod"],
        ["year"],
        ["staticmethod"],
        ["False"],
        ["month"],
        ["from_string"],
        ["today"],
        ["to_iso"],
        ["year"],
      ],
      hints: [
        "Имя статического валидатора, который вызываем в __init__.",
        "Атрибут месяца — имя соответствует параметру.",
        "Декоратор для альтернативного конструктора from_string.",
        "Какая функция превращает строку в число?",
        "Внутри classmethod конструируем экземпляр через первый параметр.",
        "То же самое для второго classmethod-конструктора.",
        "Декоратор для today() — он работает с классом, без self.",
        "Третье поле даты, которое берём из datetime.date.today().",
        "Декоратор для метода без self и cls.",
        "Что возвращает is_valid при невалидном дне?",
        "Какое поле даты идёт между year и day в ISO-формате?",
        "Имя classmethod-конструктора из строки 'dd-mm-yyyy'.",
        "Имя classmethod, возвращающего сегодняшнюю дату.",
        "Метод, форматирующий дату в ISO-строку.",
        "Третий атрибут даты, который мы печатаем.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r2-q1",
      title: "Какой декоратор не получает ни self, ни cls?",
      question:
        "Каким декоратором помечают метод, который ни от self, ни от cls не зависит — просто живёт в пространстве имён класса? Введи декоратор (можно с @ или без).",
      answers: ["@staticmethod", "staticmethod"],
      hint: "Это просто функция внутри класса, без неявных параметров.",
      explanation:
        "@staticmethod создаёт метод, который не получает первый параметр автоматически. Он используется для вспомогательных функций, логически связанных с классом.",
    },
    {
      type: "question",
      id: "r2-q2",
      title: "Что выведет код?",
      question: "Введи число, которое появится в консоли.",
      code: `class C:
    counter = 0

    def __init__(self):
        C.counter += 1
        self.counter = 100   # перекрываем атрибут класса локально

a = C()
b = C()
c = C()

print(a.counter + b.counter + c.counter + C.counter)`,
      answers: ["303"],
      hint: "У каждого экземпляра свой counter=100, а у класса C.counter растёт каждый __init__.",
      explanation:
        "Каждый __init__ увеличивает C.counter, итого C.counter = 3. Также каждый объект перекрывает counter локально значением 100. Сумма: 100 + 100 + 100 + 3 = 303.",
    },
    {
      type: "question",
      id: "r2-q3",
      title: "Под каким именем хранится приватное поле?",
      question:
        "В классе Account мы написали `self.__balance = 0`. Под каким именем Python реально хранит этот атрибут в __dict__ объекта? Введи точное имя.",
      answers: ["_Account__balance"],
      hint: "Один подчёркивание, имя класса, два подчёркивания, имя поля.",
      explanation:
        "Это name-mangling: атрибуты, начинающиеся с двух подчёркиваний (но не заканчивающиеся ими), переименовываются в _ClassName__attr, чтобы избежать коллизий в наследниках.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r2-w1",
      title: "Класс Student с реестром группы",
      task:
        "Напиши класс Student. Атрибуты экземпляра: name, group, grades (список оценок). Атрибут класса: count = 0 (общее количество студентов) и registry = [] (все студенты).\nМетоды:\n• __init__ — увеличивает count, регистрирует self в registry.\n• average() — среднее по grades (защита от пустого).\n• @classmethod total_students() — возвращает count.\n• @classmethod best_student() — возвращает Student с самым высоким average().\n• @staticmethod is_passing(avg) — True, если avg >= 4.\nСоздай 3 студентов с разными списками оценок, выведи best_student() и total_students().",
      hints: [
        "Объяви Student.count и Student.registry на уровне класса.",
        "В __init__ делай Student.count += 1 и registry.append(self).",
        "average() — вернуть 0, если список пуст, иначе sum/len.",
        "best_student() — max(cls.registry, key=lambda s: s.average()).",
        "is_passing(avg) — просто avg >= 4.",
        "В сцене создай 3 студентов с разными оценками и проверь все методы.",
      ],
      required: [
        "class Student",
        "@classmethod",
        "@staticmethod",
        "def average",
        "def total_students",
        "def best_student",
        "def is_passing",
        "self.grades",
        "Student.count",
        "Student.registry",
      ],
      minLines: 25,
    },
    {
      type: "write",
      id: "r2-w2",
      title: "Класс Temperature с инкапсуляцией",
      task:
        "Создай класс Temperature. Хранит температуру в °C в скрытом атрибуте __celsius (двойное подчёркивание). Методы:\n• set_celsius(value) — проверяет value >= -273.15, иначе ValueError.\n• set_fahrenheit(value) — переводит в °C и сохраняет.\n• get_celsius() — возвращает °C.\n• get_fahrenheit() — возвращает °F = °C * 9/5 + 32.\n• get_kelvin() — возвращает K = °C + 273.15.\n• __repr__ — 'Temperature(<celsius>°C)'.\nДемо: создай объект, поставь 100°C, выведи Цельсия/Фаренгейта/Кельвина; затем set_fahrenheit(32) и проверь, что °C стал 0.",
      hints: [
        "Скрытое поле — два подчёркивания: self.__celsius.",
        "В __init__ удобно вызвать set_celsius(initial), чтобы пройти проверку.",
        "Не забудь raise ValueError(сообщение).",
        "Формула F → C: (F - 32) * 5/9.",
        "К Кельвинам прибавь 273.15.",
        "В __repr__ возвращай строку с f-string.",
      ],
      required: [
        "class Temperature",
        "__celsius",
        "def set_celsius",
        "def set_fahrenheit",
        "def get_celsius",
        "def get_fahrenheit",
        "def get_kelvin",
        "ValueError",
        "raise",
        "__repr__",
      ],
      minLines: 25,
    },
    {
      type: "write",
      id: "r2-w3",
      title: "Класс Calculator со staticmethod и историей",
      task:
        "Сделай класс Calculator. Атрибут класса history = []. Статические методы add(a, b), sub(a, b), mul(a, b), div(a, b) (защита от деления на ноль через ZeroDivisionError). Каждая операция перед возвратом результата дописывает в Calculator.history строку вида 'add(2, 3) = 5'. Также сделай classmethod last(n) — возвращает последние n записей.\nДемо: вызови все 4 операции и last(3).",
      hints: [
        "@staticmethod не имеет self/cls — но к Calculator.history обращайся напрямую через имя класса.",
        "В div проверь b != 0; иначе raise ZeroDivisionError('делить на 0 нельзя').",
        "После каждой операции: Calculator.history.append(f'add({a}, {b}) = {result}').",
        "@classmethod last(cls, n): return cls.history[-n:].",
        "Без создания экземпляра вызови Calculator.add(2, 3), и т.п.",
      ],
      required: [
        "class Calculator",
        "@staticmethod",
        "@classmethod",
        "def add",
        "def sub",
        "def mul",
        "def div",
        "def last",
        "ZeroDivisionError",
        "history",
        "raise",
      ],
      minLines: 28,
    },
  ],
};

// ---------------------------------------------------------------------------
// ROUND 3 — Средний: properties и наследование
// ---------------------------------------------------------------------------

const round3: Round = {
  number: 3,
  title: "Свойства и наследование",
  level: "Средний",
  intro:
    "Берём настоящие инструменты ООП: @property для управляемого доступа к данным, наследование для повторного использования и super() для расширения родительского поведения. Здесь начинается «инженерный» Python.",
  fills: [
    {
      type: "fill",
      id: "r3-f1",
      title: "Temperature через @property",
      description:
        "Спрячь _celsius и оберни его в свойство celsius с getter/setter и валидацией. Добавь fahrenheit как вычисляемое свойство.",
      code: `class Temperature:
    """Температура с управляемым доступом через @property."""

    MIN_C = -273.15

    def __init__(self, celsius=0):
        self.{{0}} = celsius        # вызовет setter и сделает валидацию

    @{{1}}
    def celsius(self):
        return self._celsius

    @celsius.{{2}}
    def celsius(self, value):
        if value < Temperature.{{3}}:
            raise ValueError(
                f"{value} ниже абсолютного нуля"
            )
        self._{{4}} = float(value)

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + {{5}}

    @{{6}}.setter
    def fahrenheit(self, value):
        # перевод °F → °C и сохранение через основной setter
        self.celsius = (value - 32) * 5 / {{7}}

    @property
    def kelvin(self):
        return self._celsius + 273.{{8}}

    def __repr__(self):
        return f"Temperature({self.{{9}}:.1f}°C)"


# === Сцена ===
t = Temperature(25)
print(t.celsius, t.fahrenheit, t.{{10}})         # 25 77.0 298.15
t.{{11}} = 100
print(t.celsius)                                # 100
t.fahrenheit = 32
print(t.{{12}})                                  # 0 (через обратный setter)

try:
    t.celsius = -300
except {{13}} as e:
    print("Ошибка:", e)
`,
      answers: [
        ["celsius"],
        ["property"],
        ["setter"],
        ["MIN_C"],
        ["celsius"],
        ["32"],
        ["fahrenheit"],
        ["9"],
        ["15"],
        ["celsius"],
        ["kelvin"],
        ["celsius"],
        ["celsius"],
        ["ValueError"],
      ],
      hints: [
        "Установка через свойство, чтобы пройти setter.",
        "Декоратор, превращающий метод в getter свойства.",
        "Декоратор для установки значения свойства.",
        "Константа абсолютного нуля, к которой обращаемся через имя класса.",
        "Сохраняем значение в скрытое поле — без двойного подчёркивания, но с одним.",
        "Какое число прибавляется при переводе °C → °F?",
        "Имя свойства, к которому добавляем .setter.",
        "На что делим при обратном переводе (F − 32) * 5 / ?",
        "Какие сотые после точки прибавляются для Кельвинов?",
        "В __repr__ обращаемся к свойству, не к скрытому полю.",
        "Какое свойство мы напечатали последним?",
        "Установка celsius напрямую.",
        "После set fahrenheit=32 что нужно прочитать, чтобы увидеть 0?",
        "Какое исключение мы должны поймать при попытке установить -300°C?",
      ],
    },
    {
      type: "fill",
      id: "r3-f2",
      title: "Иерархия животных — наследование и super()",
      description:
        "Базовый класс Animal и три наследника: Dog, Cat, Bird. Каждый расширяет конструктор родителя через super().__init__ и переопределяет sound().",
      code: `class Animal:
    """Базовый класс — всё, что общее у животных."""

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def sound(self):
        # «абстрактное» поведение — наследники должны переопределить
        raise {{0}}("override sound() in subclass")

    def describe(self):
        return f"{type(self).__name__}({self.{{1}}}, {self.age})"


class Dog({{2}}):
    def __init__(self, name, age, breed):
        {{3}}().__init__(name, age)         # вызываем родительский __init__
        self.breed = {{4}}

    def sound(self):
        return f"{self.name}: гав!"


class Cat(Animal):
    def __init__(self, name, age, indoor=True):
        super().__init__({{5}}, age)
        self.indoor = indoor

    def sound(self):
        return f"{self.{{6}}}: мяу!"


class Bird({{7}}):
    def __init__(self, name, age, can_fly=True):
        super().__init__(name, {{8}})
        self.can_fly = can_fly

    def sound(self):
        return f"{self.name}: чирик!" if self.{{9}} else f"{self.name}: молчит"


# === Сцена ===
zoo = [
    Dog("Рекс", 4, "лабрадор"),
    {{10}}("Мурка", 2),
    Bird("Кеша", 1, can_fly={{11}}),
]

for a in zoo:
    print(a.describe(), "→", a.{{12}}())
`,
      answers: [
        ["NotImplementedError"],
        ["name"],
        ["Animal"],
        ["super"],
        ["breed"],
        ["name"],
        ["name"],
        ["Animal"],
        ["age"],
        ["can_fly"],
        ["Cat"],
        ["False"],
        ["sound"],
      ],
      hints: [
        "Стандартное исключение, сигналящее, что метод не реализован.",
        "В describe подставляем имя животного из атрибута.",
        "Имя родительского класса в скобках при наследовании.",
        "Встроенная функция, дающая прокси к родителю.",
        "Сохраняем породу в одноимённое поле.",
        "В Cat.__init__ передаём имя родителю.",
        "В sound() Cat подставляем имя кошки.",
        "Bird тоже наследуется от Animal.",
        "Передаём возраст родителю.",
        "В Bird.sound проверяем поле «может ли летать».",
        "Имя класса для второго животного в зоо.",
        "У Кеши can_fly=… (логическое значение).",
        "Метод, выводящий звук животного.",
      ],
    },
    {
      type: "fill",
      id: "r3-f3",
      title: "Employee → Manager — расширяем поведение через super()",
      description:
        "Manager наследуется от Employee, но добавляет команду подчинённых, премию и переопределяет give_raise — внутри вызывает родительский метод через super().",
      code: `class Employee:
    """Базовый сотрудник."""

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def give_raise(self, percent):
        # повышение на percent%
        self.salary {{0}} self.salary * percent / 100
        return self.salary

    def info(self):
        return f"{self.name}: {self.salary:.0f}"


class Manager(Employee):
    def __init__(self, name, salary, bonus, team=None):
        {{1}}().__init__(name, salary)        # инициализируем сотрудника
        self.bonus = {{2}}
        self.team = team or []

    def give_raise(self, percent):
        # сначала обычное повышение зарплаты
        new_salary = {{3}}().give_raise(percent)
        # бонус повышается на удвоенный процент
        self.bonus += self.{{4}} * percent * 2 / 100
        return new_salary, self.bonus

    def add_member(self, employee):
        if not isinstance(employee, {{5}}):
            raise TypeError("В команду — только Employee")
        self.team.{{6}}(employee)

    def total_payroll(self):
        # зарплата менеджера + бонус + сумма зарплат команды
        team_salary = sum(e.{{7}} for e in self.team)
        return self.salary + self.bonus + {{8}}

    def info(self):
        base = super().{{9}}()
        return f"{base} (+бонус {self.bonus:.0f}, команда: {len(self.team)})"


# === Сцена ===
e1 = {{10}}("Анна", 1000)
e2 = Employee("Иван", 1200)

m = Manager("Олег", 2000, bonus=500, team=[e1])
m.{{11}}(e2)                                  # добавим Ивана в команду
m.give_raise(10)                            # +10% зарплаты, +20% бонуса

print(e1.info())
print(e2.info())
print(m.{{12}}())
print("Фонд:", m.{{13}}())
`,
      answers: [
        ["+="],
        ["super"],
        ["bonus"],
        ["super"],
        ["bonus"],
        ["Employee"],
        ["append"],
        ["salary"],
        ["team_salary"],
        ["info"],
        ["Employee"],
        ["add_member"],
        ["info"],
        ["total_payroll"],
      ],
      hints: [
        "Какой составной оператор увеличивает self.salary на правую часть?",
        "Чтобы вызвать родительский __init__, используем встроенную функцию.",
        "Сохраняем бонус в одноимённый атрибут.",
        "В переопределённом give_raise тоже сначала вызываем родителя через super().",
        "На какое поле прибавляем дополнительный бонус?",
        "В команду пускаем только экземпляры базового класса.",
        "Метод списка для добавления члена команды.",
        "Из объекта сотрудника берём поле зарплаты.",
        "Складываем со сборной зарплатой команды.",
        "Имя метода, который вызываем у родителя.",
        "Имя базового класса для создания обычного сотрудника.",
        "Метод, добавляющий сотрудника в команду менеджера.",
        "Метод вывода информации.",
        "Метод, считающий общий фонд зарплат.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r3-q1",
      title: "Что делает super().__init__()?",
      question:
        "Что вызывает выражение super().__init__(...) в методе наследника? Введи: имя класса, чей __init__ будет запущен (одно слово).",
      answers: ["родительского", "родителя", "parent", "родительский"],
      hint: "Нужен класс, от которого мы наследуемся.",
      explanation:
        "super() возвращает прокси на родительский (или следующий по MRO) класс. super().__init__(...) вызывает __init__ родителя, чтобы тот инициализировал свою часть данных.",
    },
    {
      type: "question",
      id: "r3-q2",
      title: "Что выведет код?",
      code: `class A:
    def __init__(self):
        print("A.init")

class B(A):
    def __init__(self):
        super().__init__()
        print("B.init")

class C(B):
    def __init__(self):
        super().__init__()
        print("C.init")

C()`,
      question: "Введи три строки вывода через перевод строки или через '/'.",
      answers: [
        "A.init/B.init/C.init",
        "A.init / B.init / C.init",
        "A.init\nB.init\nC.init",
        "A.init B.init C.init",
      ],
      hint: "super().__init__() поднимается по цепочке: каждый следующий вызывает предыдущего, а потом печатает.",
      explanation:
        "C() → super (B.__init__) → super (A.__init__) печатает A.init, возвращается, B печатает B.init, возвращается, C печатает C.init. Порядок — снизу вверх по super-цепочке.",
    },
    {
      type: "question",
      id: "r3-q3",
      title: "Зачем нужен @property?",
      question:
        "Какой декоратор позволяет обращаться к методу как к атрибуту (без скобок), при этом скрывая логику геттера/сеттера? Введи декоратор (можно с @ или без).",
      answers: ["@property", "property"],
      hint: "Превращает метод-геттер в атрибут.",
      explanation:
        "@property превращает метод в управляемый атрибут. Также можно объявить @<name>.setter и @<name>.deleter для контроля записи и удаления.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r3-w1",
      title: "Класс Vehicle и наследник Car",
      task:
        "Напиши базовый класс Vehicle (атрибуты brand, max_speed; метод describe(), возвращающий строку 'Vehicle <brand>, до <max_speed> км/ч'). Затем Car(Vehicle) с дополнительным параметром fuel_type. В Car.__init__ обязательно используй super().__init__(...). Переопредели describe() так, чтобы он возвращал родительскую строку + ', топливо: <fuel_type>'. Создай 1 Vehicle и 2 Car (с разными топливом), выведи describe() для всех.",
      hints: [
        "В Vehicle.__init__ сохрани brand и max_speed.",
        "В Car.__init__ передай brand и max_speed в super().__init__.",
        "В Car.describe вызови super().describe() и склей со своей частью.",
        "Создай объекты с разными данными, чтобы видна была разница.",
      ],
      required: [
        "class Vehicle",
        "class Car",
        "Vehicle)",
        "super().__init__",
        "self.brand",
        "self.max_speed",
        "self.fuel_type",
        "def describe",
        "return",
      ],
      minLines: 22,
    },
    {
      type: "write",
      id: "r3-w2",
      title: "Класс Account с @property balance",
      task:
        "Сделай класс Account с скрытым полем _balance. Через @property balance — getter; через @balance.setter — запрещай отрицательные значения (raise ValueError). Добавь методы deposit(amount) и withdraw(amount), которые внутри пользуются свойством balance (а не _balance напрямую). Покажи на сцене:\n• создание счёта с начальным балансом,\n• удачный deposit и withdraw,\n• попытку установить отрицательный balance напрямую через свойство (должна выбросить исключение).",
      hints: [
        "В __init__: self.balance = initial (через сеттер, чтобы пройти проверку).",
        "@property def balance(self): return self._balance.",
        "@balance.setter def balance(self, value): if value < 0: raise ValueError, иначе self._balance = value.",
        "deposit/withdraw меняют self.balance, а не self._balance.",
        "В сцене заверни попытку установить balance в try/except.",
      ],
      required: [
        "class Account",
        "@property",
        "@balance.setter",
        "self._balance",
        "self.balance",
        "ValueError",
        "raise",
        "def deposit",
        "def withdraw",
        "try:",
        "except",
      ],
      minLines: 25,
    },
    {
      type: "write",
      id: "r3-w3",
      title: "Иерархия: Shape → Circle и Square",
      task:
        "Базовый класс Shape с атрибутом name и методом area() (raise NotImplementedError). Наследники:\n• Circle(Shape) с radius — area() = π·r².\n• Square(Shape) с side — area() = side·side.\nКаждый наследник вызывает super().__init__(name) с человеко-читаемым именем. Сделай функцию total_area(shapes), которая принимает список фигур и возвращает их суммарную площадь, используя полиморфизм. Создай список из 3+ фигур, выведи total_area() и площади поштучно.",
      hints: [
        "В Shape.__init__ сохрани self.name = name.",
        "В Circle и Square передавай в super().__init__('круг') или ('квадрат').",
        "Площадь круга — math.pi * radius ** 2 (импортируй math).",
        "total_area — обычная функция, не метод; sum(s.area() for s in shapes).",
        "Покажи разные фигуры с разными размерами.",
      ],
      required: [
        "import math",
        "class Shape",
        "class Circle",
        "class Square",
        "Shape)",
        "super().__init__",
        "NotImplementedError",
        "def area",
        "def total_area",
        "math.pi",
      ],
      minLines: 28,
    },
  ],
};

// ---------------------------------------------------------------------------
// ROUND 4 — Средний → Сложный: ABC, полиморфизм, MRO, миксины
// ---------------------------------------------------------------------------

const round4: Round = {
  number: 4,
  title: "Абстракции, полиморфизм и MRO",
  level: "Средний → Сложный",
  intro:
    "Подключаем тяжёлую артиллерию: абстрактные базовые классы (ABC), полиморфизм через единый интерфейс, миксины и порядок разрешения методов (MRO). Это уровень, на котором ты начинаешь проектировать архитектуру, а не просто писать классы.",
  fills: [
    {
      type: "fill",
      id: "r4-f1",
      title: "ABC Shape и три наследника",
      description:
        "Сделай Shape абстрактным классом с двумя обязательными методами area() и draw(). Реализуй Circle, Rectangle и Triangle с площадью и текстовым «рисованием».",
      code: `from abc import ABC, abstractmethod
import math


class Shape({{0}}):
    """Базовая абстракция — общий контракт всех фигур."""

    def __init__(self, name):
        self.name = name

    @{{1}}
    def area(self):
        ...                                  # подкласс обязан реализовать

    @abstractmethod
    def draw(self):
        ...

    # неабстрактный helper — будет общий для всех
    def describe(self):
        return f"{self.{{2}}}: S = {self.{{3}}():.2f}"


class Circle(Shape):
    def __init__(self, radius):
        {{4}}().__init__("Круг")
        self.radius = {{5}}

    def area(self):
        return math.{{6}} * self.radius ** {{7}}

    def draw(self):
        print("()")


class Rectangle(Shape):
    def __init__(self, w, h):
        super().__init__("Прямоугольник")
        self.w, self.h = w, {{8}}

    def area(self):
        return self.w * self.{{9}}

    def draw(self):
        print(f"[{ '#' * int(self.w) }]")


class Triangle(Shape):
    def __init__(self, base, height):
        super().__init__("Треугольник")
        self.base = base
        self.height = {{10}}

    def area(self):
        return self.base * self.height / {{11}}

    def draw(self):
        print("/\\")


# === Сцена ===
shapes = [Circle(3), Rectangle(4, 5), Triangle(6, 4)]
total = {{12}}(s.area() for s in shapes)

for s in shapes:
    print(s.{{13}}())
    s.{{14}}()

print("Сумма площадей:", round(total, 2))

# Попытка инстанцировать абстрактный класс должна упасть
try:
    Shape("кривое")
except {{15}} as e:
    print("Нельзя:", e)
`,
      answers: [
        ["ABC"],
        ["abstractmethod"],
        ["name"],
        ["area"],
        ["super"],
        ["radius"],
        ["pi"],
        ["2"],
        ["h"],
        ["h"],
        ["height"],
        ["2"],
        ["sum"],
        ["describe"],
        ["draw"],
        ["TypeError"],
      ],
      hints: [
        "Класс, от которого наследуются абстрактные базовые классы.",
        "Декоратор, помечающий метод как обязательный к реализации.",
        "Подставь имя фигуры в describe.",
        "В describe вызываем метод площади.",
        "Чтобы вызвать __init__ родителя — встроенная функция.",
        "Сохраняем радиус.",
        "Константа π из модуля math.",
        "В какую степень возводим радиус для S = πr²?",
        "Сохраняем высоту прямоугольника во второе поле.",
        "В формуле S = w * h используем поле высоты.",
        "Сохраняем высоту треугольника.",
        "На что делим, чтобы получить площадь треугольника?",
        "Встроенная функция суммирования.",
        "Метод-helper для красивой строки.",
        "Метод текстового рисования.",
        "Какое исключение возникнет при попытке создать абстрактный класс?",
      ],
    },
    {
      type: "fill",
      id: "r4-f2",
      title: "Абстрактный Storage и две реализации",
      description:
        "Спроектируй Storage как абстрактный интерфейс хранения. Реализуй InMemoryStorage и FileStorage (заглушка). Используй полиморфизм в коде клиента.",
      code: `from abc import ABC, abstractmethod


class Storage({{0}}):
    """Контракт любого хранилища ключ-значение."""

    @{{1}}
    def get(self, key):
        ...

    @abstractmethod
    def set(self, key, value):
        ...

    @abstractmethod
    def delete(self, key):
        ...

    # неабстрактный — все наследники получат бесплатно
    def has(self, key):
        try:
            self.{{2}}(key)
            return True
        except KeyError:
            return False


class InMemoryStorage(Storage):
    def __init__(self):
        self._data = {}

    def get(self, key):
        if key not in self._data:
            raise {{3}}(key)
        return self._data[{{4}}]

    def set(self, key, value):
        self._data[key] = {{5}}

    def delete(self, key):
        if key in self._data:
            del self._data[{{6}}]


class FileStorage(Storage):
    """Демо-заглушка: на самом деле просто dict, но с префиксом."""

    def __init__(self, prefix):
        self.prefix = prefix
        self._data = {}

    def _full(self, key):
        return self.prefix + ":" + str(key)

    def get(self, key):
        full = self._full(key)
        if full not in self._data:
            raise KeyError(key)
        return self._data[{{7}}]

    def set(self, key, value):
        self._data[self._full(key)] = value

    def delete(self, key):
        full = self.{{8}}(key)
        self._data.pop(full, None)


def use_storage(s: Storage):
    """Один и тот же код работает с любой реализацией."""
    s.set("x", 42)
    s.set("y", 100)
    print(s.get("x"), s.{{9}}("y"))
    print("есть x?", s.{{10}}("x"))
    s.delete("x")
    print("есть x?", s.has("x"))


# === Сцена ===
use_storage({{11}}())
use_storage(FileStorage(prefix="user"))

# Абстрактный класс инстанцировать нельзя
try:
    Storage()
except {{12}} as e:
    print("Storage абстрактен:", e)
`,
      answers: [
        ["ABC"],
        ["abstractmethod"],
        ["get"],
        ["KeyError"],
        ["key"],
        ["value"],
        ["key"],
        ["full"],
        ["_full"],
        ["get"],
        ["has"],
        ["InMemoryStorage"],
        ["TypeError"],
      ],
      hints: [
        "Класс, от которого наследуются абстрактные базовые классы.",
        "Декоратор обязательного метода.",
        "В has() вызываем метод чтения, чтобы поймать KeyError.",
        "Какое стандартное исключение для отсутствующего ключа?",
        "Возвращаем значение по тому же ключу.",
        "Что записываем по ключу в set?",
        "В delete удаляем по тому же ключу.",
        "В FileStorage.get возвращаем значение по полному ключу.",
        "Имя приватного метода, формирующего полный ключ.",
        "В use_storage читаем значение через метод get.",
        "Проверка наличия — метод has.",
        "Создаём первое хранилище — имя класса.",
        "Какое исключение при попытке инстанцировать абстрактный класс?",
      ],
    },
    {
      type: "fill",
      id: "r4-f3",
      title: "Множественное наследование и MRO",
      description:
        "Создай миксины Loggable и Serializable, скомбинируй их с базовым User. Изучи, как Python находит методы через MRO.",
      code: `import json


class Loggable:
    """Mixin — добавляет .log()."""

    def log(self, msg):
        print(f"[{type(self).__name__}] {msg}")


class Serializable:
    """Mixin — добавляет .to_json()."""

    def to_json(self):
        # сериализуем все поля экземпляра
        return json.dumps(self.__dict__, ensure_ascii=False)


class Entity:
    """Базовая сущность — у неё есть id."""

    def __init__(self, id_):
        self.id = id_


class User(Entity, Loggable, {{0}}):
    """Берём id из Entity, log() из Loggable, to_json() из Serializable."""

    def __init__(self, id_, name, email):
        # вызываем родителя по MRO
        {{1}}().__init__(id_)
        self.name = name
        self.email = {{2}}

    def greet(self):
        self.{{3}}(f"Привет, {self.name}!")


# === Сцена ===
u = User({{4}}, "Анна", "anna@ex.com")
u.greet()
print(u.{{5}}())                         # → JSON со всеми полями

# Распечатаем порядок поиска методов
mro_names = [c.__name__ for c in User.__{{6}}__]
print("MRO:", mro_names)


# Алмазное наследование — порядок важен
class A:
    def who(self):
        return "A"

class B(A):
    def who(self):
        return "B"

class C(A):
    def who(self):
        return "C"

class D(B, {{7}}):
    pass


d = D()
print("D.who() =", d.{{8}}())            # порядок: D → B → C → A
print([c.__name__ for c in D.__mro__])
`,
      answers: [
        ["Serializable"],
        ["super"],
        ["email"],
        ["log"],
        ["1"],
        ["to_json"],
        ["mro"],
        ["C"],
        ["who"],
      ],
      hints: [
        "Третий миксин для сериализации.",
        "super() — вызов __init__ по цепочке MRO.",
        "Сохраняем email.",
        "В greet используем метод из миксина Loggable.",
        "Любое целое число для id.",
        "Метод сериализации в JSON.",
        "Атрибут класса с порядком разрешения методов.",
        "Второй родитель в алмазном наследовании.",
        "Метод, который мы вызываем у d.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r4-q1",
      title: "Что такое полиморфизм одной строкой?",
      question:
        "Полиморфизм — это когда один и тот же ___ работает с разными типами объектов, не зная их конкретного класса. Введи одно слово (рус. или англ.).",
      answers: ["интерфейс", "метод", "вызов", "interface", "method", "call"],
      hint: "Один общий контракт — много реализаций.",
      explanation:
        "Полиморфизм означает, что один и тот же интерфейс (метод/контракт) можно реализовать по-разному. Клиентский код использует общий метод, не зная, какой конкретно класс перед ним.",
    },
    {
      type: "question",
      id: "r4-q2",
      title: "Что выведет MRO?",
      code: `class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass

print([c.__name__ for c in D.__mro__])`,
      question:
        "Введи список как его напечатает интерпретатор (с квадратными скобками и кавычками).",
      answers: [
        "['D', 'B', 'C', 'A', 'object']",
        '["D", "B", "C", "A", "object"]',
        "['D','B','C','A','object']",
        '["D","B","C","A","object"]',
        "D, B, C, A, object",
        "D B C A object",
      ],
      hint: "C3-линеаризация: D → B → C → A → object. Можно написать только имена через запятую или пробел.",
      explanation:
        "Python использует C3-линеаризацию для построения MRO. Для алмаза D(B, C) — D, B, C, A, object. Этот же порядок управляет тем, какой метод найдёт super().",
    },
    {
      type: "question",
      id: "r4-q3",
      title: "Из какого модуля импортируем abstractmethod?",
      question:
        "Какой стандартный модуль Python содержит ABC и @abstractmethod? Введи имя модуля одним словом.",
      answers: ["abc"],
      hint: "Тот же, что и сам термин Abstract Base Class.",
      explanation:
        "Модуль abc предоставляет ABC (базовый класс), ABCMeta (метакласс) и @abstractmethod. Любой подкласс ABC должен реализовать все абстрактные методы.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r4-w1",
      title: "Абстрактный PaymentMethod и три реализации",
      task:
        "Спроектируй абстрактный класс PaymentMethod (наследник ABC) с абстрактными методами charge(amount) и refund(amount). Сделай 3 реализации: CreditCard, Cash, BankTransfer. У каждой свои данные в конструкторе (например, у CreditCard номер карты, у BankTransfer — IBAN). Каждый charge должен печатать что-то осмысленное и возвращать True/False.\n\nЗатем напиши функцию process(payments, amount), которая принимает список разных PaymentMethod и амоунт, и вызывает у каждого charge(amount). Это и есть полиморфизм. Покажи на сцене со всеми тремя типами оплат.",
      hints: [
        "from abc import ABC, abstractmethod.",
        "class PaymentMethod(ABC): @abstractmethod def charge(self, amount): ...; @abstractmethod def refund(self, amount): ...",
        "Каждая реализация — class CreditCard(PaymentMethod): и т.п.",
        "В __init__ каждого класса сохраняй свои поля.",
        "В process — обычный цикл for p in payments: p.charge(amount).",
      ],
      required: [
        "from abc import",
        "ABC",
        "@abstractmethod",
        "class PaymentMethod",
        "class CreditCard",
        "class Cash",
        "class BankTransfer",
        "def charge",
        "def refund",
        "def process",
      ],
      minLines: 35,
    },
    {
      type: "write",
      id: "r4-w2",
      title: "Иерархия Employee → Developer и Designer + полиморфизм",
      task:
        "Сделай класс Employee с атрибутами name, salary и методом calculate_bonus(), который raise NotImplementedError.\nDeveloper(Employee) добавляет language; calculate_bonus() = salary * 0.2.\nDesigner(Employee) добавляет tools (список); calculate_bonus() = salary * 0.1 + 50 * len(tools).\n\nЗатем функция total_bonus(employees) — сумма бонусов по списку (полиморфизм). Создай минимум 3 разных сотрудника и выведи сумму бонусов и бонус каждого.",
      hints: [
        "В Employee.__init__ сохрани name и salary.",
        "В calculate_bonus родителя — raise NotImplementedError.",
        "В Developer.__init__ вызови super() и сохрани language.",
        "В Designer.__init__ вызови super() и сохрани tools.",
        "total_bonus — sum(e.calculate_bonus() for e in employees).",
      ],
      required: [
        "class Employee",
        "class Developer",
        "class Designer",
        "Employee)",
        "super().__init__",
        "def calculate_bonus",
        "NotImplementedError",
        "def total_bonus",
        "for ",
      ],
      minLines: 30,
    },
    {
      type: "write",
      id: "r4-w3",
      title: "Mixin TimestampMixin для нескольких моделей",
      task:
        "Сделай миксин TimestampMixin, который в __init__ устанавливает self.created_at = datetime.now() и метод age_seconds() — сколько секунд прошло с created_at.\n\nЗатем сделай два класса, которые его используют:\n• Article(TimestampMixin) с title и text;\n• Comment(TimestampMixin) с author и body.\n\nКаждый класс в своём __init__ должен вызвать super().__init__() (чтобы миксин отработал). Создай объекты, подожди условно (не нужно sleep — просто покажи метод) и распечатай age_seconds() для них и MRO каждого класса.",
      hints: [
        "from datetime import datetime.",
        "В TimestampMixin.__init__: self.created_at = datetime.now(). Можно принимать *args, **kwargs и пробрасывать в super() для безопасности.",
        "В age_seconds(): return (datetime.now() - self.created_at).total_seconds().",
        "В Article.__init__: super().__init__(); self.title = title; self.text = text.",
        "Аналогично Comment.",
        "Распечатай ClassName.__mro__ через [c.__name__ for c in ClassName.__mro__].",
      ],
      required: [
        "from datetime import datetime",
        "class TimestampMixin",
        "class Article",
        "class Comment",
        "TimestampMixin)",
        "super().__init__",
        "self.created_at",
        "def age_seconds",
        "__mro__",
      ],
      minLines: 28,
    },
  ],
};

// ---------------------------------------------------------------------------
// ROUND 5 — Сложный: dunder, dataclass, композиция, проектирование
// ---------------------------------------------------------------------------

const round5: Round = {
  number: 5,
  title: "Магические методы и архитектура",
  level: "Сложный",
  intro:
    "Финальный раунд — самый насыщенный. Магические методы (__add__, __eq__, __iter__, __len__), dataclasses, композиция и элементы архитектуры. После него можно уверенно проектировать классы с чистым интерфейсом.",
  fills: [
    {
      type: "fill",
      id: "r5-f1",
      title: "Vector с арифметикой и сравнением",
      description:
        "Реализуй математический вектор с операциями + - * (на скаляр), сравнением и красивым выводом через dunder-методы.",
      code: `import math


class Vector:
    """2D-вектор с поддержкой арифметики через dunder-методы."""

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.{{0}}})"

    def __str__(self):
        return f"<{self.x}, {self.y}>"

    def {{1}}(self, other):                       # сложение векторов
        return Vector(self.x + other.x, self.y + other.{{2}})

    def __sub__(self, other):                    # вычитание
        return Vector(self.{{3}} - other.x, self.y - other.y)

    def __mul__(self, k):                        # умножение на скаляр
        if not isinstance(k, (int, float)):
            return {{4}}                          # «не моя операция»
        return Vector(self.x * k, self.y * {{5}})

    def __rmul__(self, k):                       # 3 * v тоже работает
        return self.__mul__({{6}})

    def __eq__(self, other):
        if not isinstance(other, Vector):
            return False
        return self.x == other.x and self.y == other.{{7}}

    def __hash__(self):
        # хэш на основе кортежа координат
        return hash((self.{{8}}, self.y))

    def __abs__(self):                           # модуль вектора
        return math.sqrt(self.x ** 2 + self.{{9}} ** 2)

    def __neg__(self):                           # унарный минус
        return Vector(-self.x, {{10}}self.y)


# === Сцена ===
a = {{11}}(3, 4)
b = Vector(1, 2)

print(a + b)                                  # <4, 6>
print(a - b)                                  # <2, 2>
print(a * 2)                                  # <6, 8>
print(2 * {{12}})                              # <2, 4> (через __rmul__)
print({{13}}(a))                               # 5.0  (через __abs__)
print(-{{14}})                                 # <-3, -4>
print(a == Vector(3, 4))                     # True
print(hash(a) == hash(Vector(3, 4)))         # True
`,
      answers: [
        ["y"],
        ["__add__"],
        ["y"],
        ["x"],
        ["NotImplemented"],
        ["k"],
        ["k"],
        ["y"],
        ["x"],
        ["y"],
        ["-"],
        ["Vector"],
        ["b"],
        ["abs"],
        ["a"],
      ],
      hints: [
        "В __repr__ подставляем второе поле — y.",
        "Имя dunder-метода для сложения.",
        "В __add__ складываем второе поле другого вектора.",
        "В __sub__ вычитаем первое поле — x.",
        "Что нужно вернуть, если операция к этому типу неприменима? (специальная константа)",
        "На что умножаем второе поле в __mul__?",
        "В __rmul__ просто переадресуем на __mul__ с тем же скаляром.",
        "В __eq__ сравниваем второе поле.",
        "В __hash__ берём первое поле.",
        "В __abs__ возводим в квадрат второе поле.",
        "Какой знак ставится перед self.y в __neg__?",
        "Имя класса для создания первого вектора.",
        "Имя второго вектора в строке `2 * …`.",
        "Встроенная функция, вызывающая __abs__.",
        "Имя первого вектора — то, что отрицаем.",
      ],
    },
    {
      type: "fill",
      id: "r5-f2",
      title: "Связный список с __iter__, __len__ и __getitem__",
      description:
        "Реализуй односвязный список как полноценный «контейнерный» объект Python: длина через len(), итерация через for, доступ по индексу через [].",
      code: `class _Node:
    __slots__ = ("value", "next")

    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    """Односвязный список как контейнер Python."""

    def __init__(self, items=()):
        self._head = None
        self._size = 0
        for it in items:
            self.{{0}}(it)

    def append(self, value):
        node = _Node(value)
        if self._head is None:
            self._head = node
        else:
            cur = self._head
            while cur.{{1}} is not None:
                cur = cur.next
            cur.next = node
        self._size += {{2}}

    def __len__(self):
        return self.{{3}}

    def __iter__(self):
        cur = self._head
        while cur is not {{4}}:
            yield cur.{{5}}
            cur = cur.next

    def __getitem__(self, index):
        if not isinstance(index, int):
            raise TypeError("индекс должен быть int")
        if index < 0:
            index += len(self)                 # поддержка отрицательных индексов
        if index < 0 or index >= len(self):
            raise {{6}}(index)
        cur = self._head
        for _ in range({{7}}):
            cur = cur.{{8}}
        return cur.value

    def __contains__(self, value):
        for v in {{9}}:                         # используем собственный __iter__
            if v == value:
                return True
        return False

    def __repr__(self):
        return f"LinkedList([{', '.join(repr(v) for v in self)}])"


# === Сцена ===
ll = {{10}}([10, 20, 30])
ll.append(40)

print(len(ll))             # 4
print(list(ll))            # [10, 20, 30, 40]   ← через __iter__
print(ll[2])               # 30                 ← через __getitem__
print(ll[-1])              # 40
print(20 in ll)            # True               ← через __contains__
print({{11}})               # LinkedList([10, 20, 30, 40])  ← через __repr__

try:
    ll[100]
except {{12}} as e:
    print("Out of range:", e)
`,
      answers: [
        ["append"],
        ["next"],
        ["1"],
        ["_size"],
        ["None"],
        ["value"],
        ["IndexError"],
        ["index"],
        ["next"],
        ["self"],
        ["LinkedList"],
        ["ll"],
        ["IndexError"],
      ],
      hints: [
        "В __init__ для каждого элемента вызываем свой метод добавления в конец.",
        "Поле узла, указывающее на следующий узел.",
        "На сколько растёт _size при каждом append?",
        "В __len__ возвращаем приватное поле размера.",
        "С чем сравниваем cur, чтобы понять, что список закончился?",
        "Что yield-им в итераторе — поле узла.",
        "Какое исключение выбрасываем при выходе за границы списка?",
        "Сколько раз нужно сделать шаг next, чтобы дойти до элемента — параметр индекса.",
        "По какому полю узла идём вперёд?",
        "В __contains__ итерируемся по самому объекту — пишем self.",
        "Имя класса контейнера.",
        "Объект, у которого вызывается __repr__ при print().",
        "Какое исключение мы только что определили в __getitem__?",
      ],
    },
    {
      type: "fill",
      id: "r5-f3",
      title: "Композиция: Bank, Account и Transaction (dataclasses)",
      description:
        "Финал курса. Есть три сущности: Transaction (frozen dataclass), Account (хранит транзакции и считает баланс), Bank (содержит счета, делает переводы). Заполни пропуски в архитектуре.",
      code: `from dataclasses import dataclass, field
from datetime import datetime
from typing import List


@{{0}}(frozen=True)
class Transaction:
    """Неизменяемая запись о транзакции."""

    account_id: str
    amount: float                          # положительное — приход, отрицательное — расход
    note: str = ""
    at: datetime = field(default_factory={{1}}.now)


@dataclass
class Account:
    id: str
    owner: str
    transactions: List[Transaction] = {{2}}(default_factory=list)

    def balance(self) -> float:
        return sum(t.{{3}} for t in self.transactions)

    def deposit(self, amount: float, note: str = "deposit") -> None:
        if amount <= 0:
            raise ValueError("amount должен быть > 0")
        self.transactions.append(
            {{4}}(account_id=self.id, amount=amount, note=note)
        )

    def withdraw(self, amount: float, note: str = "withdraw") -> None:
        if amount <= 0:
            raise ValueError("amount должен быть > 0")
        if amount > self.{{5}}():
            raise ValueError("Недостаточно средств")
        self.transactions.append(
            Transaction(account_id=self.id, amount={{6}}amount, note=note)
        )


class Bank:
    """Хранит счета и умеет переводить."""

    def __init__(self, name: str):
        self.name = name
        self._accounts: dict[str, {{7}}] = {}

    def open_account(self, account_id: str, owner: str) -> Account:
        if account_id in self._accounts:
            raise ValueError(f"Счёт {account_id} уже существует")
        acc = Account(id=account_id, owner=owner)
        self._accounts[account_id] = {{8}}
        return acc

    def get(self, account_id: str) -> Account:
        if account_id not in self._accounts:
            raise KeyError(account_id)
        return self._accounts[{{9}}]

    def transfer(self, from_id: str, to_id: str, amount: float) -> None:
        src = self.{{10}}(from_id)
        dst = self.get({{11}})
        src.withdraw(amount, note=f"to {to_id}")
        dst.{{12}}(amount, note=f"from {from_id}")

    def total_assets(self) -> float:
        # сумма по всем счетам банка
        return sum(a.{{13}}() for a in self._accounts.values())


# === Сцена ===
bank = Bank({{14}})
bank.open_account("A1", "Анна")
bank.open_account("I1", "Иван")

bank.get("A1").deposit(1000)
bank.get("I1").deposit(500)
bank.transfer("A1", "I1", 300)

print(bank.get("A1").balance())          # 700
print(bank.{{15}}("I1").balance())        # 800
print("Активы банка:", bank.total_assets())
`,
      answers: [
        ["dataclass"],
        ["datetime"],
        ["field"],
        ["amount"],
        ["Transaction"],
        ["balance"],
        ["-"],
        ["Account"],
        ["acc"],
        ["account_id"],
        ["get"],
        ["to_id"],
        ["deposit"],
        ["balance"],
        ['"MyBank"', "'MyBank'"],
        ["get"],
      ],
      hints: [
        "Декоратор для автогенерации __init__/__repr__/__eq__ из аннотаций полей.",
        "Класс из модуля datetime, у которого есть метод .now (пишем без скобок — это callable).",
        "Функция из dataclasses, дающая значение по умолчанию через фабрику.",
        "В balance() суммируем поле каждой транзакции.",
        "Имя класса транзакции, который создаём в deposit.",
        "В withdraw сверяемся с собственным методом баланса.",
        "Какой знак ставим перед amount, чтобы записать списание?",
        "Тип значений в словаре _accounts — это класс счёта.",
        "Что записываем в словарь по ключу account_id?",
        "В get возвращаем счёт по тому же ключу.",
        "Получение исходного счёта через метод банка.",
        "Получение целевого счёта — по второму идентификатору.",
        "Зачисление на целевой счёт — метод счёта.",
        "В total_assets суммируем балансы всех счетов.",
        "Любая строка-имя банка для конструктора.",
        "Метод банка, через который читаем счёт во второй раз.",
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r5-q1",
      title: "Какой dunder для len()?",
      question:
        "Какой магический метод вызывается, когда мы пишем len(obj)? Введи имя метода точно как в коде, с подчёркиваниями.",
      answers: ["__len__"],
      hint: "Подчёркивание + имя встроенной функции + подчёркивание, всё удвоенное.",
      explanation:
        "len(obj) делегирует вызов в obj.__len__(). Метод должен вернуть неотрицательное целое.",
    },
    {
      type: "question",
      id: "r5-q2",
      title: "В чём разница __str__ и __repr__?",
      question:
        "Какой из этих двух методов должен возвращать строку, по которой видно, как объект был сконструирован (часто пригодную для копи-паста в Python)? Введи имя метода (можно с подчёркиваниями или без).",
      answers: ["__repr__", "repr"],
      hint: "Этот метод вызывает встроенный repr() и используется в REPL.",
      explanation:
        "__repr__ — техническое представление: 'Vector(3, 4)'. __str__ — человекочитаемое: '<3, 4>'. Если __str__ не определён, print() использует __repr__.",
    },
    {
      type: "question",
      id: "r5-q3",
      title: "Что выведет код?",
      code: `from dataclasses import dataclass

@dataclass(frozen=True)
class P:
    x: int
    y: int

a = P(1, 2)
b = P(1, 2)
s = {a, b}      # set из двух одинаковых dataclass

print(len(s))`,
      question: "Введи число.",
      answers: ["1"],
      hint: "frozen=True даёт авто-__hash__ и __eq__; одинаковые поля — одинаковый объект для set.",
      explanation:
        "frozen=True делает dataclass неизменяемым и хэшируемым. Два экземпляра с одинаковыми полями равны и имеют одинаковый хэш, поэтому set их схлопнет до одного.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r5-w1",
      title: "Класс Money с арифметикой",
      task:
        "Сделай класс Money с полями amount (Decimal или float) и currency (строка). Реализуй:\n• __init__ с проверкой, что amount >= 0 (иначе ValueError);\n• __repr__ → 'Money(amount, \"USD\")';\n• __str__ → '100.00 USD';\n• __add__ и __sub__ — складывают/вычитают только при одинаковой валюте, иначе TypeError;\n• __eq__ — равны при одинаковой валюте и сумме;\n• __lt__ и __le__ для сортировки (только в одной валюте);\n• __hash__.\n\nПокажи на сцене: создание, +, -, сравнение, сортировку списка из нескольких Money.",
      hints: [
        "В __init__ raise ValueError если amount < 0.",
        "В __add__/__sub__ проверяй self.currency == other.currency, иначе raise TypeError.",
        "В __eq__ верни False, если other не Money.",
        "В __lt__ raise TypeError при разных валютах.",
        "__hash__ — hash((round(self.amount, 2), self.currency)).",
        "В сцене сделай sorted([Money(...), ...]) и распечатай.",
      ],
      required: [
        "class Money",
        "self.amount",
        "self.currency",
        "__repr__",
        "__str__",
        "__add__",
        "__sub__",
        "__eq__",
        "__lt__",
        "__hash__",
        "ValueError",
        "TypeError",
        "raise",
        "sorted(",
      ],
      minLines: 35,
    },
    {
      type: "write",
      id: "r5-w2",
      title: "Класс Stack как полноценный контейнер",
      task:
        "Сделай класс Stack (LIFO). Внутри — список. Реализуй:\n• push(x), pop() (raise IndexError на пустом стеке), peek();\n• __len__, __bool__ (True, если не пуст), __iter__ (от вершины к дну), __contains__;\n• __repr__ — 'Stack([верх, ..., дно])'.\n\nПокажи: push нескольких значений, peek, len, итерацию через for, проверку in, pop до пустого, попытку pop из пустого через try/except.",
      hints: [
        "Внутри: self._items = []. push — append, pop — self._items.pop().",
        "В pop сначала: if not self._items: raise IndexError('пустой стек').",
        "__len__ → len(self._items).",
        "__bool__ → bool(self._items).",
        "__iter__ — yield элементы в обратном порядке: for x in reversed(self._items): yield x.",
        "В сцене заверни pop из пустого в try/except IndexError.",
      ],
      required: [
        "class Stack",
        "self._items",
        "def push",
        "def pop",
        "def peek",
        "__len__",
        "__bool__",
        "__iter__",
        "__contains__",
        "__repr__",
        "IndexError",
        "raise",
        "try:",
        "except",
      ],
      minLines: 32,
    },
    {
      type: "write",
      id: "r5-w3",
      title: "Мини-архитектура: TodoList с приоритетами",
      task:
        "Спроектируй мини-приложение «список задач».\n\n@dataclass(order=True) class Task с полями priority: int, title: str, done: bool = False (priority должна стоять первой, чтобы сортировка работала автоматически).\n\nclass TodoList:\n• add(title, priority) — создаёт Task и добавляет;\n• complete(title) — помечает done=True (через replace, ведь Task может быть frozen — оставь решение за собой);\n• pending() — возвращает список незавершённых, отсортированный по приоритету (по возрастанию);\n• __len__, __iter__ (по всем задачам), __repr__.\n\nСцена: добавь 4-5 задач с разным приоритетом, заверши пару, выведи pending() и общее количество.",
      hints: [
        "from dataclasses import dataclass, field. order=True даёт __lt__ автоматически.",
        "В TodoList.__init__ сделай self._tasks = [].",
        "Если Task не frozen — просто self._tasks[i].done = True. Иначе замени через dataclasses.replace.",
        "pending — sorted([t for t in self._tasks if not t.done]).",
        "__iter__ → yield from self._tasks.",
        "Покажи весь сценарий, чтобы было видно, что pending действительно отсортирован.",
      ],
      required: [
        "from dataclasses import",
        "@dataclass",
        "order=True",
        "class Task",
        "priority",
        "title",
        "done",
        "class TodoList",
        "def add",
        "def complete",
        "def pending",
        "__len__",
        "__iter__",
        "sorted(",
      ],
      minLines: 35,
    },
  ],
};

// ---------------------------------------------------------------------------
// ATTACH EXPLANATIONS (rich post-check explanations live in ./explanations.ts)
// ---------------------------------------------------------------------------

import { EXPLANATIONS } from "./explanations";
import { ADVANCED_ROUNDS } from "./curriculum-advanced";
import { EXTRA_ROUNDS } from "./curriculum-extra";
import { LESSONS } from "./lessons";
import { LESSON_EXTRAS } from "./lessons-extra";
import { LESSON_PREVIEWS } from "./lessons-preview";

const RAW_ROUNDS: Round[] = [
  round1,
  round2,
  round3,
  round4,
  round5,
  ...ADVANCED_ROUNDS,
  ...EXTRA_ROUNDS,
];

for (const round of RAW_ROUNDS) {
  for (const ex of round.fills) {
    const explanation = EXPLANATIONS[ex.id];
    if (explanation) ex.explanation = explanation;
  }
  for (const ex of round.writes) {
    const explanation = EXPLANATIONS[ex.id];
    if (explanation) ex.explanation = explanation;
  }
  if (round.fillLines) {
    for (const ex of round.fillLines) {
      const explanation = EXPLANATIONS[ex.id];
      if (explanation) ex.explanation = explanation;
    }
  }
  // Attach the lesson (mega-detailed pre-round handout) by round number.
  const lesson = LESSONS[round.number];
  if (lesson) {
    // Append optional «extras» (расширенные секции + шпаргалка) и
    // «preview» (что именно будет в заданиях этого раунда + ответы).
    const extras = LESSON_EXTRAS[round.number];
    const previews = LESSON_PREVIEWS[round.number];
    const extraSections = [
      ...(extras?.sections ?? []),
      ...(previews ?? []),
    ];
    if (extraSections.length > 0 || extras?.cheatSheet?.length) {
      round.lesson = {
        ...lesson,
        sections: [...lesson.sections, ...extraSections],
        cheatSheet: [
          ...(lesson.cheatSheet ?? []),
          ...(extras?.cheatSheet ?? []),
        ],
      };
    } else {
      round.lesson = lesson;
    }
  }
}

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------

export const ROUNDS: Round[] = RAW_ROUNDS;
export const TOTAL_ROUNDS = RAW_ROUNDS.length;
