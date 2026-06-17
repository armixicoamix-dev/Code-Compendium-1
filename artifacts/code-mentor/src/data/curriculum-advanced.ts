import type { Round } from "./curriculum";

/**
 * ROUNDS 6-10 — продвинутая часть курса.
 *
 * Каждый раунд содержит:
 *   - 2 fills          (классические пропуски-слова)
 *   - 2 questions      (вопросы с открытым ответом)
 *   - 2 writes         (написать класс с нуля)
 *   - 2 fillLines      (новый тип: пропуски на ЦЕЛЫЕ строки/блоки кода)
 *
 * Темы:
 *   R6  — типизация: type hints, Generic, Protocol, dataclass-фичи
 *   R7  — мета-механика объекта: @property, descriptors, __slots__, __new__
 *   R8  — иерархии: super(), MRO, mixins, ABC
 *   R9  — паттерны проектирования: Strategy, Observer, Factory, Singleton
 *   R10 — продвинутые протоколы: context managers, итераторы, async with
 *
 * Объяснения к fills/writes/fillLines — inline через поле `explanation`.
 * (Объяснения к question-задачам обязательны inline по типу.)
 */

// ===========================================================================
// ROUND 6 — Типизация и dataclasses: статика, на которой стоит современный Python
// ===========================================================================

const round6: Round = {
  number: 6,
  title: "Типы, Generic и dataclasses",
  level: "Средний → Сложный",
  intro:
    "Современный Python почти всегда пишется с типами. В этом раунде учимся читать сигнатуры с type hints, применять Generic[T] для контейнеров «над любыми типами», описывать поведение через Protocol (структурная типизация — «утиная типизация по описанию») и выжимать максимум из @dataclass: frozen, slots, field(default_factory=...). Это инструменты, которые делают код одновременно короче и безопаснее.",
  fills: [
    {
      type: "fill",
      id: "r6-f1",
      title: "Generic Repository[T] — типобезопасный контейнер",
      description:
        "Заверши обобщённый репозиторий, который умеет хранить любые сущности с полем id. Параметр T задаёт конкретный тип — User, Product и т.д. Тогда mypy/pyright проверят, что мы кладём и достаём один и тот же тип.",
      code: `from __future__ import annotations
from typing import {{0}}, Protocol
from dataclasses import dataclass


class HasId({{1}}):
    """Структурный протокол: подходит ВСЁ, у чего есть int-овое поле id."""
    id: int


T = {{2}}("T", bound=HasId)


class Repository({{3}}[T]):
    """Хранит сущности типа T и достаёт их по id."""

    def __init__(self) -> None:
        self._items: dict[int, T] = {{4}}

    def add(self, item: T) -> {{5}}:
        self._items[item.id] = item

    def get(self, item_id: int) -> T | {{6}}:
        return self._items.get(item_id)

    def all(self) -> list[{{7}}]:
        return list(self._items.values())


@dataclass
class User:
    id: int
    name: str


users: Repository[{{8}}] = Repository()
users.add(User(1, "Анна"))
users.add(User(2, "Иван"))
print(users.get(1).{{9}})            # типобезопасно: ".name" — ок, ".price" — ошибка типов
`,
      answers: [
        ["TypeVar", "Generic, TypeVar", "Generic,TypeVar"],
        ["Protocol"],
        ["TypeVar"],
        ["Generic"],
        ["{}", "dict()"],
        ["None"],
        ["None"],
        ["T"],
        ["User"],
        ["name"],
      ],
      hints: [
        "Из typing нужны Generic и TypeVar (а Protocol уже импортируется).",
        "Чтобы класс был структурным типом, он должен наследоваться от Protocol.",
        "Параметр T создаётся вызовом TypeVar(\"T\", bound=...).",
        "Чтобы Repository стал обобщённым по T, он наследует Generic[T].",
        "Пустой словарь — литерал из двух фигурных скобок.",
        "Метод add ничего не возвращает, тип возврата — None.",
        "Если элемента нет, .get вернёт None — это нужно отразить в типе возврата.",
        "Метод all возвращает список именно тех T, что лежат внутри.",
        "Параметризуем репозиторий конкретным типом — User.",
        "У User есть атрибут name, его и проверяем.",
      ],
      explanation: {
        summary:
          "Generic + TypeVar — основной способ писать обобщённые структуры данных в Python. Repository[User] и Repository[Product] — это с точки зрения mypy/pyright РАЗНЫЕ типы, поэтому случайно перепутать сущности невозможно. Protocol даёт «структурную» проверку: подходит любой класс с нужными атрибутами, без явного наследования.",
        keyPoints: [
          "T = TypeVar(\"T\", bound=HasId) — T может быть чем угодно, но обязательно с полем id (через bound).",
          "class Repository(Generic[T]) — превращает обычный класс в обобщённый. После этого можно писать Repository[User].",
          "Protocol — это «утиная типизация по описанию». Класс подходит, если у него есть нужные поля/методы. Никакого .register() или наследования не требуется.",
          "T | None в возврате — современный Python 3.10+ синтаксис вместо Optional[T]. Старый вариант тоже работает.",
        ],
        pitfalls: [
          "Без Generic[T] параметризация Repository[User] разрешена синтаксически, но mypy не будет проверять типы внутри.",
          "Protocol не делает RUNTIME-проверок по умолчанию. Если нужен isinstance — допиши декоратор @runtime_checkable.",
          "TypeVar нужно вызывать в module-scope, а не внутри функции — иначе тайпчекеры путаются.",
        ],
        realWorld:
          "Точно так устроены Sequence[T], Mapping[K, V], asyncio.Queue[T]. Любая нормальная библиотека для работы с данными сегодня типизирована через Generic.",
      },
    },
    {
      type: "fill",
      id: "r6-f2",
      title: "@dataclass: frozen, slots и default_factory",
      description:
        "Закрой пробелы в типизированном dataclass. Это «правильный» современный способ описать неизменяемую сущность с валидацией в __post_init__.",
      code: `from dataclasses import {{0}}, field
from typing import ClassVar


@dataclass(frozen={{1}}, slots=True)
class Money:
    """Неизменяемая сумма в конкретной валюте."""

    amount: int                          # в копейках/центах, чтобы избежать float
    currency: str = "UAH"
    tags: list[str] = field({{2}}=list)  # мутабельный default — ТОЛЬКО через factory!

    # Атрибут уровня класса, не относится к экземплярам:
    SUPPORTED: {{3}}[set[str]] = {"UAH", "USD", "EUR"}

    def __post_init__(self) -> {{4}}:
        if self.amount < 0:
            raise {{5}}("amount must be >= 0")
        if self.currency not in self.SUPPORTED:
            raise ValueError(f"unsupported currency: {self.currency}")

    def add(self, other: "Money") -> "Money":
        if other.currency != self.{{6}}:
            raise ValueError("currency mismatch")
        # frozen=True ⇒ self.amount = ... ЗАПРЕЩЕНО,
        # поэтому делаем НОВЫЙ объект:
        return {{7}}(self.amount + other.amount, self.currency)


a = Money(1000)                          # 10.00 UAH
b = Money(2500, "UAH", tags=["bonus"])
c = a.{{8}}(b)
print(c)                                 # Money(amount=3500, currency='UAH', tags=[])
print(c.{{9}})                           # 3500
`,
      answers: [
        ["dataclass"],
        ["True"],
        ["default_factory"],
        ["ClassVar"],
        ["None"],
        ["ValueError"],
        ["currency"],
        ["Money"],
        ["add"],
        ["amount"],
      ],
      hints: [
        "Сам декоратор называется так же, как модуль и тип.",
        "Чтобы сделать объект неизменяемым — frozen=True.",
        "Для list/dict в default используется именно default_factory=...",
        "Атрибут уровня класса (а не экземпляра) помечается ClassVar[...].",
        "__post_init__ ничего не возвращает.",
        "Стандартное исключение для «неправильного значения» — ValueError.",
        "Сложение сумм возможно только в одинаковой валюте — проверь self.currency.",
        "Возвращаем новый экземпляр того же класса.",
        "Имя метода сложения сумм.",
        "Из выведенного объекта берём поле amount.",
      ],
      explanation: {
        summary:
          "Современный @dataclass даёт сразу: __init__, __repr__, __eq__, валидацию через __post_init__, и опционально неизменяемость и __slots__. Это в 99% случаев лучше, чем писать класс «руками».",
        keyPoints: [
          "frozen=True блокирует self.x = ... после создания. Поэтому методы вроде add() не мутируют, а возвращают НОВЫЙ объект — иммутабельный стиль.",
          "slots=True (Python 3.10+) экономит память и запрещает добавление новых атрибутов на лету. Часто включают для часто создаваемых объектов.",
          "default_factory=list нужен потому, что mutable default (tags=[]) был бы РАЗДЕЛЁН между всеми экземплярами — классический баг.",
          "ClassVar[...] помечает атрибут класса; dataclass его не трогает (не делает полем экземпляра).",
          "__post_init__ — единственное правильное место для валидации в dataclass. Он вызывается автоматически после сгенерированного __init__.",
        ],
        pitfalls: [
          "tags: list[str] = [] вместо field(default_factory=list) — частый и опасный баг.",
          "Если поле объявлено без типа, dataclass его проигнорирует. Тип ОБЯЗАТЕЛЕН.",
          "Поля с default нельзя ставить ДО полей без default — будет SyntaxError при генерации __init__.",
        ],
        realWorld:
          "Money/Quantity/Coordinates — типичные value objects из DDD. Их всегда делают frozen, чтобы случайное изменение не сломало логику.",
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "r6-q1",
      title: "Чем Protocol отличается от ABC?",
      question:
        "Какой ОДИН ключевой механизм Python используется в Protocol для «утиной типизации по описанию», но НЕ требует от пользователя наследования? Назови этот тип проверки одним словом (по-английски).",
      answers: ["structural", "structural typing", "structural-typing"],
      hint: "Противоположность 'nominal' (когда тип определяется именем/наследованием).",
      explanation:
        "Protocol реализует STRUCTURAL TYPING: класс «подходит» по протоколу, если у него есть нужные атрибуты и методы — независимо от того, наследуется ли он от чего-либо. ABC же — NOMINAL: чтобы пройти isinstance, класс должен явно наследоваться (или быть зарегистрирован через .register()). Protocol гораздо ближе к Go interfaces: «если оно крякает как утка — это и есть утка».",
    },
    {
      type: "question",
      id: "r6-q2",
      title: "Почему mutable default — баг?",
      question:
        "Что покажет такой код?\n\n@dataclass\nclass A:\n    items: list = []   # допустим, dataclass это разрешил\n\na = A(); a.items.append(1)\nb = A(); print(b.items)\n\nНапиши результат, как его вывел бы print.",
      answers: ["[1]"],
      hint: "Список — мутабельный объект. Default-значение вычисляется один раз.",
      explanation:
        "Default-значение вычисляется ОДИН раз — при определении функции/класса. Если этот объект мутабельный (list, dict, set), все экземпляры начнут делить его. a.items.append(1) изменит ТОТ ЖЕ список, который потом увидит b. Поэтому dataclass запрещает голые mutable defaults и требует field(default_factory=list) — чтобы новый список создавался для КАЖДОГО экземпляра.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r6-w1",
      title: "Generic Pair[A, B]",
      task:
        "Напиши класс Pair, обобщённый по ДВУМ параметрам типа A и B. У него: конструктор с self.first: A и self.second: B; метод swap() -> Pair[B, A], который возвращает новую пару с поменянными местами элементами; метод как_dict() -> dict[str, A | B]. Используй typing.Generic, TypeVar и аннотации. Не забудь from typing import.",
      hints: [
        "Создай два TypeVar: A = TypeVar('A'), B = TypeVar('B').",
        "Унаследуй класс от Generic[A, B].",
        "swap должен вернуть Pair[B, A] — параметры МЕНЯЮТСЯ местами в типе возврата.",
        "Внутри swap создавай новый Pair, не мутируй текущий.",
      ],
      required: ["TypeVar", "Generic", "class Pair", "swap", "first", "second"],
      minLines: 10,
      explanation: {
        summary:
          "Класс с ДВУМЯ параметрами типа — отличная иллюстрация того, что Generic — это не магия, а просто параметризация. Типы первого и второго элемента не обязаны совпадать, и swap красиво показывает, что type checker умеет их менять местами.",
        keyPoints: [
          "TypeVar — это «переменная для типа», она существует только на уровне аннотаций.",
          "Generic[A, B] делает класс обобщённым сразу по двум параметрам.",
          "Возвращая Pair[B, A] из swap, мы декларируем: тип первого и второго после свопа поменялись местами.",
        ],
        realWorld:
          "Похожим образом устроены tuple[A, B], dict[K, V], Result[T, E] (как в Rust). Pair — кирпичик для key-value маппингов и для возврата нескольких значений с типами.",
      },
    },
    {
      type: "write",
      id: "r6-w2",
      title: "@dataclass FrozenPoint с distance_to",
      task:
        "Напиши неизменяемую (frozen=True) дата-класс точку FrozenPoint с полями x: float и y: float (оба с default 0.0). Добавь метод distance_to(other: FrozenPoint) -> float, считающий евклидово расстояние через math.hypot. Реализуй __post_init__, который запрещает значения NaN (используй math.isnan).",
      hints: [
        "from dataclasses import dataclass; from math import hypot, isnan",
        "@dataclass(frozen=True) перед классом.",
        "В __post_init__ проверь isnan(x) или isnan(y) и кинь ValueError.",
        "distance_to: return hypot(self.x - other.x, self.y - other.y).",
      ],
      required: [
        "@dataclass",
        "frozen=True",
        "class FrozenPoint",
        "distance_to",
        "hypot",
        "__post_init__",
      ],
      minLines: 10,
      explanation: {
        summary:
          "Frozen dataclass — почти каноническая Value Object. Идеален для математических объектов: точка, вектор, угол. Иммутабельность гарантирует, что объект, передаваемый в функции, не будет молча мутирован «откуда-то снизу».",
        keyPoints: [
          "math.hypot(dx, dy) численно стабильнее, чем sqrt(dx*dx + dy*dy) — он избегает overflow для очень больших координат.",
          "__post_init__ — правильное место для валидации; кидать там ValueError — норма.",
          "frozen=True автоматически генерирует __hash__, поэтому FrozenPoint можно использовать как ключ словаря/элемент set.",
        ],
        pitfalls: [
          "В обычном @dataclass __hash__ не генерируется (хеш зависит от изменяемого состояния). frozen=True решает это.",
        ],
      },
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r6-l1",
      title: "Допиши Protocol и проверку структурной типизации",
      description:
        "В коде помечены {{LINE:N}} места, куда нужно ВПИСАТЬ ЦЕЛЫЕ строки/блоки кода. Не одно слово, а кусок логики. Здесь нужно описать Protocol для рисуемого объекта и реализовать функцию render_all.",
      code: `from typing import Protocol, runtime_checkable


# ───────────────────────── БЛОК 1 (~4 строки) ─────────────────────────
# Опиши Protocol с одним методом. Структура должна быть ровно такой:
#    @runtime_checkable                # декоратор — чтобы isinstance работал
#    class Drawable(Protocol):         # имя Drawable, базовый класс Protocol
#        def draw(self) -> str:        # сигнатура метода (один self, return str)
#            ...                       # тело: многоточие — это «нет реализации»
# ВАЖНО: тело метода в Protocol — всегда многоточие (...), не pass.
{{LINE:0}}


class Circle:
    def __init__(self, r: float) -> None:
        self.r = r

    def draw(self) -> str:
        return f"○(r={self.r})"


class Square:
    def __init__(self, side: float) -> None:
        self.side = side

    def draw(self) -> str:
        return f"□({self.side}x{self.side})"


def render_all(shapes: list[Drawable]) -> list[str]:
    # ──────────────────── БЛОК 2 (одна строка) ────────────────────
    # Верни список вызовов draw() от КАЖДОЙ фигуры, пропустив те,
    # что не подходят под Drawable (например, обычная строка).
    # Шаблон (list comprehension с фильтром):
    #     return [<что вызвать>(<выражение>) for <переменная> in <итерируемое>
    #             if isinstance(<переменная>, Drawable)]
    # У s метод draw без аргументов; вызов даёт нужную строку.
{{LINE:1}}


print(render_all([Circle(3), Square(4), "не фигура"]))
`,
      blanks: [
        {
          lines: 4,
          required: ["@runtime_checkable", "class Drawable", "Protocol", "draw", "->"],
          forbidden: ["pass  # TODO"],
          hint: "Декоратор + class Drawable(Protocol): + метод draw, объявленный как метод протокола (тело — обычно ...).",
          reference: `@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> str:
        ...`,
          placeholder:
            "@runtime_checkable\nclass Drawable(Protocol):\n    def draw(self) -> str:\n        ...",
        },
        {
          lines: 1,
          required: ["return", "isinstance", "Drawable", "draw"],
          hint: "Однострочник: return [s.draw() for s in shapes if isinstance(s, Drawable)]",
          reference:
            "    return [s.draw() for s in shapes if isinstance(s, Drawable)]",
          placeholder:
            "    return [s.draw() for s in shapes if isinstance(s, Drawable)]",
        },
      ],
      explanation: {
        summary:
          "Protocol + @runtime_checkable — самый гибкий способ описать «контракт» в Python. В отличие от ABC, ни Circle, ни Square не наследуются от Drawable — но и тайпчекеры, и isinstance считают их подходящими, потому что у них есть метод draw нужной формы.",
        keyPoints: [
          "@runtime_checkable добавляет к протоколу __subclasshook__, благодаря которому isinstance(obj, Drawable) работает по фактическому набору атрибутов.",
          "Тело методов в Protocol — это всегда `...` (или docstring). Это не реализация, а декларация.",
          "Generic + Protocol позволяют строить очень общие функции вроде render_all, которые принимают что угодно «рисуемое».",
        ],
      },
    },
    {
      type: "fill-lines",
      id: "r6-l2",
      title: "Заполни __post_init__ и метод-фабрику",
      description:
        "Заполни блочные пропуски в dataclass-е User. Один блок — валидация в __post_init__, второй — classmethod-фабрика, парсящая 'имя:почта'.",
      code: `from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class User:
    name: str
    email: str

    # ─────────────── БЛОК 1: тело __post_init__ (~4 строки) ───────────────
    # Внутри метода две проверки. Шаблон каждой:
    #     if <условие>:
    #         raise ValueError("<понятное сообщение>")
    #
    # Условие №1: имя пустое после удаления пробелов.
    #     not self.name.strip()    # True если "" или "   "
    # Условие №2: в email нет '@' ИЛИ нет '.'
    #     "@" not in self.email or "." not in self.email
    #
    # Каждая строка тела метода имеет 8 пробелов отступа (4 за класс + 4 за метод).
    def __post_init__(self) -> None:
{{LINE:0}}

    # ─────────────── БЛОК 2: classmethod-фабрика (~5 строк) ───────────────
    # Структура (4 пробела отступа за класс, далее обычный def):
    #     def from_str(cls, s: str) -> "User":
    #         if ":" not in s:                          # защита от плохого ввода
    #             raise ValueError("expected 'name:email'")
    #         name, email = s.split(":", 1)             # 1 = максимум 1 раз делим
    #         return cls(name.strip(), email.strip())   # cls — а не User!
    # ВАЖНО: используем cls(...), а НЕ User(...) — это работает и для подклассов.
    @classmethod
{{LINE:1}}


u = User.from_str("Анна:anna@example.com")
print(u)
`,
      blanks: [
        {
          lines: 4,
          required: ["if", "raise", "ValueError", "@", "."],
          hint: "Две проверки: пустое имя → ValueError; в email нет '@' или '.' → ValueError.",
          reference: `        if not self.name.strip():
            raise ValueError("name must not be empty")
        if "@" not in self.email or "." not in self.email:
            raise ValueError("email must contain '@' and '.'")`,
          placeholder:
            "        if not self.name.strip():\n            raise ValueError(\"name must not be empty\")\n        if \"@\" not in self.email or \".\" not in self.email:\n            raise ValueError(\"email must contain '@' and '.'\")",
        },
        {
          lines: 6,
          required: ["def from_str", "cls", "split", ":", "return cls", "raise"],
          hint: "def from_str(cls, s): if ':' not in s: raise ValueError(...); name, email = s.split(':', 1); return cls(name.strip(), email.strip())",
          reference: `    def from_str(cls, s: str) -> "User":
        if ":" not in s:
            raise ValueError("expected 'name:email'")
        name, email = s.split(":", 1)
        return cls(name.strip(), email.strip())`,
          placeholder:
            "    def from_str(cls, s: str) -> \"User\":\n        if \":\" not in s:\n            raise ValueError(\"expected 'name:email'\")\n        name, email = s.split(\":\", 1)\n        return cls(name.strip(), email.strip())",
        },
      ],
      explanation: {
        summary:
          "Связка @dataclass + classmethod-фабрика — стандартный паттерн «создай меня из чужого формата»: from_str, from_dict, from_json. Логика парсинга остаётся внутри класса, который умеет себя проверять.",
        keyPoints: [
          "В classmethod через cls(...) можно безопасно создавать экземпляры подклассов — это лучше, чем хардкодить имя User.",
          "split(':', 1) — важно ограничить количество разделений, чтобы email с двоеточием (порт?) не сломал парсер.",
          "Валидация в __post_init__ работает и для объектов, созданных через from_str — потому что from_str всё равно зовёт обычный __init__.",
        ],
      },
    },
  ],
};

// ===========================================================================
// ROUND 7 — Магия атрибутов: @property, дескрипторы, __slots__, __new__
// ===========================================================================

const round7: Round = {
  number: 7,
  title: "Свойства, дескрипторы и __slots__",
  level: "Сложный",
  intro:
    "До сих пор атрибуты были «просто переменными». В этом раунде учимся управлять доступом к ним: @property превращает обычный self.x в вычисляемое поле, дескриптор позволяет переиспользовать одну и ту же логику валидации для нескольких атрибутов и нескольких классов, а __slots__ запрещает «лишние» атрибуты и экономит память. Ещё познакомимся с __new__ — методом, который создаёт объект ДО __init__.",
  fills: [
    {
      type: "fill",
      id: "r7-f1",
      title: "Temperature: @property с валидацией",
      description:
        "Заверши класс Temperature. Снаружи он выглядит как обычный объект с .celsius и .fahrenheit, а внутри прячет одно число и не даёт опуститься ниже абсолютного нуля.",
      code: `class Temperature:
    """Температура с защитой от значений ниже -273.15°C."""

    ABSOLUTE_ZERO = -273.15

    def __init__(self, celsius: float = 0.0) -> None:
        # ВАЖНО: используем сеттер через self.celsius = ...,
        # чтобы валидация прошла даже на старте.
        self.{{0}} = celsius

    @{{1}}
    def celsius(self) -> float:
        return self._celsius

    @celsius.{{2}}
    def celsius(self, value: float) -> None:
        if value < self.{{3}}:
            raise ValueError(f"температура не может быть ниже {self.ABSOLUTE_ZERO}°C")
        self._celsius = float(value)

    @property
    def fahrenheit(self) -> float:
        return self._celsius * 9 / 5 + {{4}}

    @fahrenheit.setter
    def fahrenheit(self, value: float) -> None:
        # переводим обратно в Цельсии и используем валидирующий сеттер celsius
        self.{{5}} = (value - 32) * 5 / 9


t = Temperature(25)
print(t.celsius, t.{{6}})       # 25.0  77.0
t.fahrenheit = 212
print(t.{{7}})                   # 100.0
`,
      answers: [
        ["celsius"],
        ["property"],
        ["setter"],
        ["ABSOLUTE_ZERO"],
        ["32"],
        ["celsius"],
        ["fahrenheit"],
        ["celsius"],
      ],
      hints: [
        "Чтобы валидация прошла, в __init__ присваиваем через сеттер — то есть self.celsius.",
        "Декоратор для геттера.",
        "Сеттер привязывается через @<имя>.setter.",
        "Граница — атрибут класса ABSOLUTE_ZERO.",
        "В формуле перевода в Фаренгейты — слагаемое 32.",
        "Сеттер fahrenheit делегирует валидацию сеттеру celsius.",
        "Печатаем градусы по Фаренгейту.",
        "После установки fahrenheit=212 в Цельсиях должно быть 100.",
      ],
      explanation: {
        summary:
          "@property превращает обычный self.x в управляемое свойство. Снаружи выглядит как поле, внутри — функция. Это лучший способ добавить валидацию или вычисляемое значение, не меняя интерфейс класса.",
        keyPoints: [
          "Геттер: @property над методом без параметров (кроме self).",
          "Сеттер: @<имя>.setter — привязывается к существующему свойству.",
          "Использование self.celsius = celsius В __init__ — хитрый и правильный приём: проходит через сеттер, поэтому валидация работает сразу.",
          "fahrenheit делегирует установку обратно в celsius — DRY: один источник истины и одно место с проверкой.",
        ],
        pitfalls: [
          "Если хранить значение в self.celsius, а не в self._celsius — будет бесконечная рекурсия (геттер вызовет геттер).",
          "Без сеттера @property возвращает read-only атрибут. Это не баг, а часто именно то, что нужно.",
        ],
        realWorld:
          "Любое поле «выглядит как данные, но требует проверки/пересчёта» — отличный кандидат на @property. В Python не принято писать пары get_x()/set_x() в Java-стиле — для этого есть @property.",
      },
    },
    {
      type: "fill",
      id: "r7-f2",
      title: "Дескриптор Positive — переиспользуемая валидация",
      description:
        "Допиши data-дескриптор Positive: он работает в нескольких классах, валидирует положительность и хранит значение в самом экземпляре под именем '_<имя поля>'.",
      code: `class Positive:
    """Дескриптор: разрешает только положительные числа."""

    def __set_name__(self, owner, name: str) -> None:
        # автоматически вызывается при объявлении поля в классе:
        # его имя — то самое, под которым описали в теле класса
        self.name = name
        self.private = "_" + {{0}}

    def __get__(self, instance, owner=None):
        if instance is {{1}}:
            return self                            # обращение через класс — вернём дескриптор
        return getattr(instance, self.{{2}})

    def __set__(self, instance, value) -> None:
        if value <= {{3}}:
            raise ValueError(f"{self.name} must be > 0, got {value!r}")
        setattr(instance, self.private, {{4}})


class Order:
    quantity = {{5}}()
    price = Positive()

    def __init__(self, quantity: int, price: float) -> None:
        self.quantity = quantity                   # пройдёт через дескриптор
        self.{{6}} = price


o = Order(2, 99.5)
print(o.quantity, o.price)
try:
    o.quantity = -1
except ValueError as e:
    print("validated:", {{7}})
`,
      answers: [
        ["name"],
        ["None"],
        ["private"],
        ["0"],
        ["value"],
        ["Positive"],
        ["price"],
        ["e"],
      ],
      hints: [
        "В __set_name__ только что узнали name — его и используем для построения 'private'.",
        "Если instance == None, значит обращаются как Order.quantity, а не o.quantity.",
        "Достаём из экземпляра атрибут с приватным именем.",
        "Валидируем «должно быть строго больше нуля».",
        "Сохраняем именно value, прошедшее валидацию.",
        "Поле quantity — это объект класса Positive.",
        "Второе поле — price.",
        "В блоке except напечатать сообщение — это str(e), но print(e) тоже выведет нужное.",
      ],
      explanation: {
        summary:
          "Дескриптор — это ОБЪЕКТ-протокол: класс с методами __get__/__set__/__delete__. В отличие от @property (привязан к одному классу), дескриптор переиспользуется в любом классе, в любом количестве полей. Вся валидация описывается ОДИН раз.",
        keyPoints: [
          "__set_name__ — современная (Python 3.6+) точка, в которой дескриптор узнаёт ИМЯ поля, под которым его положили.",
          "Хранить значение в самом дескрипторе — частая ошибка: тогда ВСЕ экземпляры будут делить одно поле. Хранить нужно в instance.__dict__.",
          "instance is None в __get__ — стандартный приём отличить obj.field (вернуть значение) от Class.field (вернуть сам дескриптор).",
          "Дескриптор бывает data (__set__ есть) и non-data (только __get__). Data перебивает __dict__ — поэтому валидация всегда срабатывает.",
        ],
        realWorld:
          "Ровно так устроены поля в SQLAlchemy, Django ORM, Pydantic V1 и многих других ORM/валидаторах. Это инфраструктурный механизм Python.",
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "r7-q1",
      title: "Что делает __slots__?",
      question:
        "У класса задан __slots__ = ('x', 'y'). Попытка obj.z = 1 на экземпляре приведёт к исключению какого типа? Напиши имя исключения.",
      answers: ["AttributeError"],
      hint: "Слот ограничивает множество допустимых атрибутов.",
      explanation:
        "__slots__ запрещает создавать атрибуты, которых нет в списке. У объекта НЕТ __dict__, поэтому obj.z = 1 не находит места и Python кидает AttributeError. Бонусом: меньше памяти (особенно ощутимо при миллионах объектов) и небольшое ускорение доступа к атрибутам. Минус: больше нельзя «прилепить» к объекту произвольные поля на лету.",
    },
    {
      type: "question",
      id: "r7-q2",
      title: "__new__ vs __init__",
      question:
        "Какой из двух методов СОЗДАЁТ объект (выделяет память и возвращает свежий экземпляр), а какой — только инициализирует уже созданный? Напиши ИМЯ того, который создаёт.",
      answers: ["__new__", "new", "__new__()"],
      hint: "Один возвращает экземпляр, второй — None.",
      explanation:
        "__new__(cls, ...) — это конструктор уровня КЛАССА: он вызывается ПЕРВЫМ и обязан вернуть свежий экземпляр (обычно через super().__new__(cls)). После этого Python автоматически зовёт __init__(self, ...) для настройки. Переопределяют __new__ редко: для иммутабельных типов (int, str, tuple), для синглтонов, для классов-фабрик. __init__ переопределяют постоянно — это «настройка» уже созданного объекта.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r7-w1",
      title: "Дескриптор RangeChecked",
      task:
        "Напиши data-дескриптор RangeChecked(low, high), который валидирует, что присваиваемое значение лежит в [low, high]. Используй __set_name__ для запоминания имени поля и храни значение в instance.__dict__ под приватным именем '_<name>'. Реализуй __get__, __set__. Кидай ValueError с понятным сообщением.",
      hints: [
        "Конструктор: self.low = low; self.high = high.",
        "__set_name__: self.name = name; self.private = '_' + name.",
        "__get__: if instance is None: return self; return instance.__dict__[self.private].",
        "__set__: проверь self.low <= value <= self.high; если нет — raise ValueError.",
      ],
      required: [
        "class RangeChecked",
        "__set_name__",
        "__get__",
        "__set__",
        "ValueError",
      ],
      minLines: 12,
      explanation: {
        summary:
          "RangeChecked — каноничный пример переиспользуемого дескриптора. Один класс — десятки полей с валидацией: temperature = RangeChecked(-50, 50); humidity = RangeChecked(0, 100); ...",
        keyPoints: [
          "Хранение в instance.__dict__ под приватным именем — единственный безопасный вариант для МНОЖЕСТВЕННЫХ дескрипторов одного типа в одном классе.",
          "__set_name__ избавляет от копи-пасты вроде RangeChecked(-50, 50, 'temperature'). Имя задаётся автоматически.",
          "Дескриптор — это data descriptor (есть __set__), и он перебивает обычные атрибуты в instance.__dict__ — поэтому валидация неминуема.",
        ],
      },
    },
    {
      type: "write",
      id: "r7-w2",
      title: "Класс с __slots__",
      task:
        "Напиши класс Vector2D с двумя координатами x: float и y: float. Используй __slots__, чтобы запретить любые другие атрибуты. Добавь метод length(self) -> float (через math.hypot) и __repr__ (используй f-string).",
      hints: [
        "from math import hypot",
        "__slots__ = ('x', 'y') — кортеж имён.",
        "Конструктор присваивает self.x = x; self.y = y — это будет работать, так как имена в slots.",
        "В __repr__ используй f'Vector2D(x={self.x}, y={self.y})'.",
      ],
      required: ["__slots__", "class Vector2D", "length", "hypot", "__repr__"],
      minLines: 10,
      explanation: {
        summary:
          "__slots__ — низкоуровневая оптимизация: убирает у каждого экземпляра __dict__ (а часто и __weakref__), экономя 40–80 байт на объект. Если у тебя миллион векторов — экономия в десятки мегабайт.",
        keyPoints: [
          "Можно использовать __slots__ = ('x', 'y') (tuple) — самый частый стиль.",
          "Нельзя класть в slots сами имена с подчёркиванием для @property — потому что property и slot одного имени конфликтуют. Решение: имена слотов с _ , свойства — без.",
          "Подкласс наследует __slots__ родителя автоматически, но если у подкласса нет своего __slots__, у его экземпляров появится __dict__ — и оптимизация частично потеряется.",
        ],
      },
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r7-l1",
      title: "Сделай настоящий Singleton через __new__",
      description:
        "В первом блоке нужно реализовать __new__, который возвращает один и тот же экземпляр. Во втором — __init__, который выполняет настройку только ОДИН раз.",
      code: `class AppConfig:
    """Singleton: на весь процесс существует только один AppConfig."""

    _instance: "AppConfig | None" = None

    # ─────────────── БЛОК 1: __new__ (~5 строк) ───────────────
    # __new__ — classmethod, получает cls (а не self!). Шаблон:
    #     def __new__(cls, *args, **kwargs):
    #         if cls._instance is None:               # объект ещё не создавали
    #             cls._instance = super().__new__(cls)  # СОЗДАЁМ через родителя
    #         return cls._instance                    # ВСЕГДА возвращаем кэш
    # Аргументы *args/**kwargs ловим, чтобы не падать — но игнорируем:
    # настройка пойдёт в __init__.
{{LINE:0}}

    # ─────────────── БЛОК 2: __init__ с защитой от повторов (~5 строк) ───────────────
    # Каждый вызов AppConfig(...) запускает __init__ ЕЩЁ РАЗ — даже если
    # __new__ вернул старый объект. Поэтому нужен флаг.
    # Шаблон:
    #     def __init__(self, debug: bool = False) -> None:
    #         if getattr(self, "_inited", False):    # уже настраивали?
    #             return                             # выходим, не трогая поля
    #         self.debug = debug                     # настраиваем поля...
    #         self._inited = True                    # ...и ставим флаг
    # getattr с дефолтом False нужен, потому что при ПЕРВОМ заходе атрибута ещё нет.
{{LINE:1}}


a = AppConfig(debug=True)
b = AppConfig(debug=False)        # debug=False ИГНОРИРУЕТСЯ — это тот же объект
print(a is b)                     # True
print(a.debug)                    # True
`,
      blanks: [
        {
          lines: 5,
          required: ["def __new__", "cls", "_instance is None", "super().__new__", "return cls._instance"],
          hint: "def __new__(cls, *a, **kw): if cls._instance is None: cls._instance = super().__new__(cls); return cls._instance",
          reference: `    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance`,
          placeholder:
            "    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance",
        },
        {
          lines: 5,
          required: ["def __init__", "self", "_inited", "self.debug", "return"],
          hint: "В __init__ проверь getattr(self, '_inited', False). Если уже инициализирован — return. Иначе установи self.debug и self._inited=True.",
          reference: `    def __init__(self, debug: bool = False) -> None:
        if getattr(self, "_inited", False):
            return
        self.debug = debug
        self._inited = True`,
          placeholder:
            "    def __init__(self, debug: bool = False) -> None:\n        if getattr(self, \"_inited\", False):\n            return\n        self.debug = debug\n        self._inited = True",
        },
      ],
      explanation: {
        summary:
          "Singleton через __new__ — классический и при этом ХРУПКИЙ паттерн. Хрупкий, потому что Python всё равно зовёт __init__ при каждом AppConfig(...), и без флага _inited повторный вызов перезатрёт настройки.",
        keyPoints: [
          "__new__ — единственное место, где можно решить «не создавать новый объект», вернув уже существующий.",
          "__init__ всегда вызывается на возвращённом из __new__ объекте. Поэтому нужен флаг _inited, чтобы не сбросить состояние.",
          "В реальных проектах вместо Singleton чаще используют Dependency Injection или модульный синглтон — это проще тестировать.",
        ],
      },
    },
    {
      type: "fill-lines",
      id: "r7-l2",
      title: "Допиши @property с lazy-кэшем и @<x>.deleter",
      description:
        "Заполни геттер с ленивым вычислением (считаем один раз, кешируем) и deleter, сбрасывающий кэш.",
      code: `import math


class Stats:
    def __init__(self, data: list[float]) -> None:
        self._data = list(data)
        self._mean: float | None = None      # кэш

    # ─────────────── БЛОК 1: тело геттера mean (~4 строки) ───────────────
    # Декоратор @property уже стоит сверху — пиши только def + тело.
    # Шаблон (отступ 4 пробела за класс):
    #     def mean(self) -> float:
    #         if self._mean is None:                                     # ещё не считали?
    #             self._mean = sum(self._data) / len(self._data)         # посчитать и закэшировать
    #         return self._mean                                          # вернуть из кэша
    # ВНИМАНИЕ: имя метода — точно mean (то же, что у property), а хранение в self._mean.
    @property
{{LINE:0}}

    # ─────────────── БЛОК 2: deleter (~3 строки) ───────────────
    # Декоратор @<имя>.deleter навешивается на функцию, которая запустится
    # при del obj.имя — нужно обнулить кэш.
    # Шаблон:
    #     @mean.deleter
    #     def mean(self) -> None:
    #         self._mean = None       # сброс кэша → следующий get посчитает заново
{{LINE:1}}


s = Stats([1, 2, 3, 4])
print(s.mean)         # 2.5  (вычислено)
print(s.mean)         # 2.5  (взято из кэша)
del s.mean            # сбросили кэш
print(s.mean)         # 2.5  (снова вычислено)
`,
      blanks: [
        {
          lines: 5,
          required: ["def mean", "self", "self._mean is None", "sum", "len", "return self._mean"],
          hint: "def mean(self): if self._mean is None: self._mean = sum(self._data) / len(self._data); return self._mean",
          reference: `    def mean(self) -> float:
        if self._mean is None:
            self._mean = sum(self._data) / len(self._data)
        return self._mean`,
          placeholder:
            "    def mean(self) -> float:\n        if self._mean is None:\n            self._mean = sum(self._data) / len(self._data)\n        return self._mean",
        },
        {
          lines: 3,
          required: ["@mean.deleter", "def mean", "self._mean = None"],
          hint: "@mean.deleter\ndef mean(self): self._mean = None",
          reference: `    @mean.deleter
    def mean(self) -> None:
        self._mean = None`,
          placeholder:
            "    @mean.deleter\n    def mean(self) -> None:\n        self._mean = None",
        },
      ],
      explanation: {
        summary:
          "Lazy property + deleter — компактный аналог functools.cached_property с ручным сбросом. Полезно, когда вычисление дорогое, а данные иногда меняются и кэш надо инвалидировать.",
        keyPoints: [
          "Стандартная альтернатива: @functools.cached_property — кэширует автоматически, но без deleter.",
          "Deleter позволяет писать очень читаемый код: del stats.mean; stats.add(...); print(stats.mean) — последняя строка пересчитает.",
        ],
      },
    },
  ],
};

// ===========================================================================
// ROUND 8 — Иерархии: super(), MRO, mixins, ABC
// ===========================================================================

const round8: Round = {
  number: 8,
  title: "Наследование, MRO и mixins",
  level: "Сложный → Эксперт",
  intro:
    "Множественное наследование в Python устроено через MRO (Method Resolution Order, алгоритм C3). super() — НЕ «родитель», а «следующий в MRO». Понимая это, можно строить mixin-архитектуру: маленькие классы, каждый отвечает за одну способность (Loggable, Serializable, Cacheable), и их можно складывать как кирпичики. Здесь же — abstract base classes (ABC) для контрактов, которые ОБЯЗАН реализовать наследник.",
  fills: [
    {
      type: "fill",
      id: "r8-f1",
      title: "ABC: контракт через abstractmethod",
      description:
        "Заверши абстрактный класс Notifier и его наследников. Никто не должен быть в состоянии создать сам Notifier — только конкретный наследник, реализующий send().",
      code: `from abc import {{0}}, abstractmethod


class Notifier({{1}}):
    """Базовый интерфейс отправщика уведомлений."""

    @{{2}}
    def send(self, user: str, message: str) -> None:
        ...

    def notify_many(self, users: list[str], message: str) -> int:
        sent = 0
        for u in users:
            self.{{3}}(u, message)        # Template Method — зовём абстрактный метод
            sent += 1
        return sent


class EmailNotifier({{4}}):
    def send(self, user: str, message: str) -> None:
        print(f"[email] {user}: {message}")


class SmsNotifier(Notifier):
    def send(self, user: str, message: str) -> None:
        print(f"[sms] {user}: {message}")


# Notifier()  # ← это упало бы с TypeError: Can't instantiate abstract class
e = {{5}}()
n = e.notify_many(["Анна", "Иван"], "Привет!")
print(n)                                  # 2

s: Notifier = {{6}}()
s.send("Олег", "ping")
`,
      answers: [
        ["ABC", "ABC, abstractmethod"],
        ["ABC"],
        ["abstractmethod"],
        ["send"],
        ["Notifier"],
        ["EmailNotifier"],
        ["SmsNotifier"],
      ],
      hints: [
        "Из abc нужны ABC и abstractmethod.",
        "Базовый класс наследуется от ABC, чтобы Python знал — это абстрактный.",
        "Над методом без реализации ставим этот декоратор.",
        "В notify_many мы должны вызвать тот самый абстрактный send.",
        "Конкретный наследник — Notifier.",
        "Создаём EmailNotifier (его можно — он реализовал send).",
        "Второй конкретный — SmsNotifier.",
      ],
      explanation: {
        summary:
          "ABC + @abstractmethod — это контракт на уровне типа. Базовый класс описывает, какие методы ОБЯЗАН реализовать наследник, а попытка создать неполный класс падает с TypeError. Это безопаснее, чем «надеемся, что наследник всё переопределил».",
        keyPoints: [
          "Notifier(ABC) делает класс абстрактным; наличие хотя бы одного @abstractmethod без реализации ⇒ нельзя создать экземпляр.",
          "notify_many — Template Method: общая логика в базовом классе, конкретный шаг (send) — у наследника.",
          "Если наследник забыл реализовать abstractmethod, EmailNotifier() тоже упадёт с TypeError. Это «ловит ошибку рано».",
        ],
        realWorld:
          "logging.Handler, codecs.Codec, json.JSONEncoder — все они построены на ABC + Template Method. Это базовая структура любой расширяемой библиотеки.",
      },
    },
    {
      type: "fill",
      id: "r8-f2",
      title: "super() и MRO в множественном наследовании",
      description:
        "Заверши mixin-архитектуру. Каждый класс зовёт super().__init__(**kwargs), и благодаря MRO C3 цепочка вызовов идёт по диаграмме сверху вниз.",
      code: `class Loggable:
    def __init__(self, *, logger=print, **kwargs) -> None:
        self.logger = logger
        super().__init__({{0}})           # пробрасываем оставшиеся kwargs дальше по MRO

    def log(self, msg: str) -> None:
        self.logger(f"[log] {msg}")


class Cacheable:
    def __init__(self, *, cache=None, **kwargs) -> None:
        self.cache = cache or {}
        super().{{1}}(**kwargs)


class Service(Loggable, Cacheable):
    def __init__(self, *, name: str, **kwargs) -> None:
        self.name = name
        # ВАЖНО: super().__init__(**kwargs) — НЕ Loggable.__init__,
        # потому что иначе Cacheable никогда не вызовется
        {{2}}().__init__(**kwargs)


s = Service(name="api", logger=print, cache={"x": 1})
s.log(f"started {s.name} cache={s.cache}")

# MRO считается по правилу C3 — выводим:
print([c.__name__ for c in Service.{{3}}])
# Service → Loggable → Cacheable → object
`,
      answers: [
        ["**kwargs"],
        ["__init__"],
        ["super"],
        ["__mro__", "mro()"],
      ],
      hints: [
        "super().__init__ принимает оставшиеся именованные аргументы — пробрасываем их.",
        "Стандартный конструктор объекта.",
        "Вместо имени конкретного родителя — super(), чтобы цепочка не оборвалась.",
        "Список MRO лежит в Service.__mro__ (или возвращается Service.mro()).",
      ],
      explanation: {
        summary:
          "В множественном наследовании super() — это НЕ ссылка на родителя, а ссылка на следующего в MRO. Если каждый класс честно зовёт super().__init__(**kwargs), цепочка пройдёт через ВСЕХ предков ровно по одному разу. Это и называется «cooperative multiple inheritance».",
        keyPoints: [
          "**kwargs обязателен в каждом __init__ цепочки — иначе аргументы не дойдут до следующего класса.",
          "MRO считается по алгоритму C3-линеаризации: он гарантирует, что родитель будет вызван ПОСЛЕ всех своих наследников и что порядок наследования сохраняется.",
          "Вызов через super() позволяет менять иерархию (добавлять/убирать mixins), не переписывая каждое имя руками.",
        ],
        pitfalls: [
          "Если хоть один класс зовёт Loggable.__init__(self, ...) напрямую вместо super(), цепочка ОБОРВЁТСЯ и часть mixin-ов не инициализируется.",
          "Аргументы должны быть KEYWORD-only (после *), иначе их позиция в цепочке станет хрупкой.",
        ],
        realWorld:
          "Так устроены практически все Django Class-Based Views: ListView = MultipleObjectTemplateResponseMixin + BaseListView + ... — куча маленьких mixin-ов, склеенных через MRO.",
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "r8-q1",
      title: "Что вернёт super()?",
      question:
        "В классе B(A) внутри метода вызвали super().method(). На какой объект ссылается super()? Напиши одним словом по-английски: это PARENT, INSTANCE или PROXY?",
      answers: ["proxy", "PROXY", "Proxy"],
      hint: "super() — это не класс и не экземпляр.",
      explanation:
        "super() возвращает PROXY-объект — он не A, не B, не self. Это специальный посредник, который ищет МЕТОДЫ в MRO начиная со СЛЕДУЮЩЕГО класса после текущего. Поэтому фраза «super() — это родитель» — некорректна: при множественном наследовании следующий в MRO может быть «братом», а не родителем.",
    },
    {
      type: "question",
      id: "r8-q2",
      title: "MRO алгоритм",
      question:
        "Как называется алгоритм, по которому Python вычисляет порядок разрешения методов (MRO) в множественном наследовании? Напиши короткое название (например, в стиле 'C3').",
      answers: ["c3", "C3", "C3 linearization", "c3 linearization"],
      hint: "Назван в честь алгоритма из языка Dylan/Lisp; короткое имя содержит букву и цифру.",
      explanation:
        "Это алгоритм C3-линеаризации (он же 'C3 superclass linearization'). Он гарантирует три свойства: (1) класс идёт перед своими предками; (2) порядок прямых родителей сохраняется; (3) общий порядок монотонен. Если построить MRO нельзя (циклическое противоречие в порядке) — Python кинет TypeError при определении класса.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r8-w1",
      title: "ABC Shape с площадью и периметром",
      task:
        "Напиши абстрактный базовый класс Shape (наследник ABC) с двумя абстрактными методами: area() -> float и perimeter() -> float. Реализуй неабстрактный compactness(self) -> float, считающий 4*pi*area / perimeter**2 (используй math.pi). Реализуй два конкретных подкласса: Circle(r) и Rectangle(w, h).",
      hints: [
        "from abc import ABC, abstractmethod; from math import pi.",
        "Base: class Shape(ABC); внутри — два @abstractmethod.",
        "Не забудь, что compactness вычисляется через self.area() и self.perimeter().",
        "Circle: area = pi*r*r, perimeter = 2*pi*r. Rectangle: a*b и 2*(a+b).",
      ],
      required: [
        "class Shape",
        "ABC",
        "abstractmethod",
        "class Circle",
        "class Rectangle",
        "compactness",
      ],
      minLines: 15,
      explanation: {
        summary:
          "Классическая иерархия Shape — отличный пример «Template Method + ABC»: общая формула в базе, переменные части (площадь и периметр) — у наследников. compactness становится ОБЩЕЙ формулой, которую не нужно копировать.",
        keyPoints: [
          "compactness — мера 'насколько фигура близка к кругу' (для круга равна 1).",
          "Раз база абстрактна, нельзя забыть метод. Если забудешь — Rectangle() упадёт с TypeError при создании.",
        ],
      },
    },
    {
      type: "write",
      id: "r8-w2",
      title: "Mixin Loggable + Timestamped + класс User",
      task:
        "Напиши два mixin-класса: Loggable c методом log(msg) (печатает '[LOG] msg') и Timestamped с __init__(self, **kwargs), сохраняющим self.created_at = datetime.now() и пробрасывающим super().__init__(**kwargs). Затем класс User(Loggable, Timestamped), у которого __init__(name, **kwargs) сохраняет имя и зовёт super().__init__(**kwargs). В конце создай User('Анна') и вызови u.log(f'created at {u.created_at}').",
      hints: [
        "from datetime import datetime в начале файла.",
        "Каждый класс должен принимать **kwargs и пробрасывать их дальше через super().",
        "User(name, **kwargs): self.name = name; super().__init__(**kwargs).",
        "Loggable не нуждается в __init__ — там только метод log.",
      ],
      required: [
        "class Loggable",
        "class Timestamped",
        "class User",
        "datetime",
        "super().__init__",
        "created_at",
      ],
      minLines: 14,
      explanation: {
        summary:
          "Mixin-композиция — современная альтернатива «толстым» базовым классам. Каждая способность изолирована в свой mixin, и любой User/Order/Product может «подмешать» только то, что нужно.",
        keyPoints: [
          "Главное правило mixin-ов: ВСЕ классы цепочки принимают **kwargs и пробрасывают их через super().",
          "Mixin не должен иметь смысла «сам по себе»: Loggable() без основного класса бесполезен.",
        ],
      },
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r8-l1",
      title: "Реализуй __init_subclass__ для авто-регистрации",
      description:
        "В первом блоке нужно реализовать __init_subclass__ так, чтобы каждый наследник автоматически попадал в реестр REGISTRY. Во втором — фабричную функцию build по строковому имени.",
      code: `class Plugin:
    """Любой подкласс автоматически регистрируется по имени класса."""

    REGISTRY: dict[str, type["Plugin"]] = {}

    # ─────────────── БЛОК 1: __init_subclass__ (~3 строки) ───────────────
    # __init_subclass__ — особый classmethod, Python зовёт его САМ при объявлении
    # любого подкласса. cls = объявляемый подкласс. **kwargs — на всякий случай.
    # Шаблон (4 пробела отступа за классом Plugin):
    #     def __init_subclass__(cls, **kwargs) -> None:
    #         super().__init_subclass__(**kwargs)         # ← обязательно зови!
    #         Plugin.REGISTRY[cls.__name__] = cls         # ← сама регистрация
    # ВАЖНО: первая строка — super(). Без неё ломаются дальние наследники.
{{LINE:0}}


class JsonPlugin(Plugin):
    def run(self, data):
        return f"json: {data}"


class CsvPlugin(Plugin):
    def run(self, data):
        return f"csv: {data}"


# ─────────────── БЛОК 2: фабрика build (~5 строк) ───────────────
# Это МОДУЛЬНАЯ функция (без отступа!). Шаблон:
#     def build(name: str, *args, **kwargs) -> Plugin:
#         cls = Plugin.REGISTRY.get(name)             # достаём класс по имени
#         if cls is None:                             # такого нет в реестре
#             raise KeyError(f"unknown plugin: {name!r}")
#         return cls(*args, **kwargs)                 # cls — это сам класс, вызываем = создаём экземпляр
{{LINE:1}}


print(build("JsonPlugin").run({"a": 1}))
print(list(Plugin.REGISTRY))
`,
      blanks: [
        {
          lines: 4,
          required: [
            "def __init_subclass__",
            "cls",
            "super().__init_subclass__",
            "REGISTRY",
            "cls.__name__",
          ],
          hint: "def __init_subclass__(cls, **kwargs): super().__init_subclass__(**kwargs); Plugin.REGISTRY[cls.__name__] = cls",
          reference: `    def __init_subclass__(cls, **kwargs) -> None:
        super().__init_subclass__(**kwargs)
        Plugin.REGISTRY[cls.__name__] = cls`,
          placeholder:
            "    def __init_subclass__(cls, **kwargs) -> None:\n        super().__init_subclass__(**kwargs)\n        Plugin.REGISTRY[cls.__name__] = cls",
        },
        {
          lines: 5,
          required: ["def build", "REGISTRY", "raise KeyError", "return"],
          hint: "def build(name, *args, **kw): cls = Plugin.REGISTRY.get(name); if cls is None: raise KeyError(...); return cls(*args, **kw)",
          reference: `def build(name: str, *args, **kwargs) -> Plugin:
    cls = Plugin.REGISTRY.get(name)
    if cls is None:
        raise KeyError(f"unknown plugin: {name!r}")
    return cls(*args, **kwargs)`,
          placeholder:
            "def build(name: str, *args, **kwargs) -> Plugin:\n    cls = Plugin.REGISTRY.get(name)\n    if cls is None:\n        raise KeyError(f\"unknown plugin: {name!r}\")\n    return cls(*args, **kwargs)",
        },
      ],
      explanation: {
        summary:
          "__init_subclass__ — лёгкий и НЕДОоценённый аналог метаклассов. Достаточно для 90% задач плагинов/реестров. Не нужно определять metaclass=..., не нужны ABCMeta — просто метод.",
        keyPoints: [
          "__init_subclass__ срабатывает АВТОМАТИЧЕСКИ при объявлении подкласса, не нужно ничего вызывать руками.",
          "Реестр — типичный паттерн: позволяет писать build('JsonPlugin') без if-elif-else по строке.",
          "Всегда вызывай super().__init_subclass__(**kwargs), иначе сломаешь дальние наследники.",
        ],
      },
    },
    {
      type: "fill-lines",
      id: "r8-l2",
      title: "Cooperative super() в mixin-цепочке",
      description:
        "Заполни цепочку super().method вызовов так, чтобы Pretty(Bold, Italic, Plain) корректно собирала строку через все mixin-ы.",
      code: `class Plain:
    def render(self, text: str) -> str:
        return text


class Bold:
    # ─────────────── БЛОК 1: render у Bold (~3 строки) ───────────────
    # Идея: получить результат «следующего» render по MRO и обернуть в **...**
    # Шаблон (4 пробела отступа за классом):
    #     def render(self, text: str) -> str:
    #         inner = super().render(text)        # ← super(), а не Plain.render!
    #         return f"**{inner}**"
    # ОЧЕНЬ ВАЖНО: super() даёт «следующего в MRO». В Pretty(Bold, Italic, Plain)
    # после Bold идёт Italic, а не Plain. Если позвать Plain.render напрямую —
    # Italic выпадет из цепочки и курсив исчезнет.
{{LINE:0}}


class Italic:
    # ─────────────── БЛОК 2: render у Italic (~3 строки) ───────────────
    # То же самое, но с одной звёздочкой *...*
    # Шаблон:
    #     def render(self, text: str) -> str:
    #         inner = super().render(text)
    #         return f"*{inner}*"
{{LINE:1}}


class Pretty(Bold, Italic, Plain):
    pass


p = Pretty()
print(p.render("hi"))            # **\\*hi\\***   →  жирный курсив
print([c.__name__ for c in Pretty.__mro__])
`,
      blanks: [
        {
          lines: 3,
          required: ["def render", "super().render", "return", "**"],
          hint: "def render(self, text): inner = super().render(text); return f'**{inner}**'",
          reference: `    def render(self, text: str) -> str:
        inner = super().render(text)
        return f"**{inner}**"`,
          placeholder:
            "    def render(self, text: str) -> str:\n        inner = super().render(text)\n        return f\"**{inner}**\"",
        },
        {
          lines: 3,
          required: ["def render", "super().render", "return", "*"],
          hint: "def render(self, text): inner = super().render(text); return f'*{inner}*'",
          reference: `    def render(self, text: str) -> str:
        inner = super().render(text)
        return f"*{inner}*"`,
          placeholder:
            "    def render(self, text: str) -> str:\n        inner = super().render(text)\n        return f\"*{inner}*\"",
        },
      ],
      explanation: {
        summary:
          "Cooperative super() — это то, ради чего MRO существует. Каждый mixin не знает, кто будет за ним в цепочке — он просто зовёт super().render(). И всё работает как «декорирующий конвейер»: Bold → Italic → Plain.",
        keyPoints: [
          "MRO здесь: Pretty → Bold → Italic → Plain → object. Bold зовёт Italic, Italic зовёт Plain.",
          "Если в Bold написать Plain.render(self, text) — Italic полностью пропустится, и курсив исчезнет.",
          "Этот же приём — основа декораторов классов и AOP-стиля в Python без сторонних библиотек.",
        ],
      },
    },
  ],
};

// ===========================================================================
// ROUND 9 — Паттерны проектирования
// ===========================================================================

const round9: Round = {
  number: 9,
  title: "Паттерны: Strategy, Observer, Factory",
  level: "Эксперт",
  intro:
    "Паттерны проектирования — это не догмы, а словарь, на котором разговаривают опытные инженеры. В этом раунде четыре больших классических паттерна: Strategy (подменяемое поведение), Observer (рассылка событий), Factory Method (полиморфное создание) и Singleton с критикой. Все примеры — на реальных задачах, без академических Foo/Bar.",
  fills: [
    {
      type: "fill",
      id: "r9-f1",
      title: "Strategy: подменяемая логика скидки",
      description:
        "Заполни паттерн Strategy: класс Order не знает, КАК считается скидка — он принимает её как объект-стратегию.",
      code: `from abc import ABC, abstractmethod


class DiscountStrategy({{0}}):
    """Контракт стратегии."""

    @{{1}}
    def apply(self, total: float) -> float:
        ...


class NoDiscount(DiscountStrategy):
    def apply(self, total: float) -> float:
        return {{2}}


class PercentDiscount(DiscountStrategy):
    def __init__(self, percent: float) -> None:
        self.percent = percent

    def apply(self, total: float) -> float:
        return total * (1 - self.{{3}} / 100)


class LoyaltyDiscount(DiscountStrategy):
    """Каждые полные 1000 — минус 50."""

    def apply(self, total: float) -> float:
        bonus = (total // 1000) * 50
        return total - {{4}}


class Order:
    def __init__(self, items: list[float], strategy: DiscountStrategy) -> None:
        self.items = items
        self.{{5}} = strategy            # внедряем стратегию через конструктор

    def total(self) -> float:
        raw = sum(self.items)
        return self.strategy.{{6}}(raw)


o1 = Order([300, 500, 1200], {{7}})
o2 = Order([300, 500, 1200], PercentDiscount(10))
o3 = Order([300, 500, 1200], LoyaltyDiscount())
print(o1.total(), o2.total(), o3.total())
`,
      answers: [
        ["ABC"],
        ["abstractmethod"],
        ["total"],
        ["percent"],
        ["bonus"],
        ["strategy"],
        ["apply"],
        ["NoDiscount()"],
      ],
      hints: [
        "Базовый абстрактный класс — наследник ABC.",
        "Метод apply должен быть абстрактным.",
        "NoDiscount возвращает сумму без изменений.",
        "Используем сохранённый процент.",
        "Возвращаем сумму минус посчитанный bonus.",
        "Сохраняем переданную стратегию в self.strategy.",
        "Делегируем расчёт стратегии: self.strategy.apply(raw).",
        "Передаём конкретный экземпляр NoDiscount() — без скидки.",
      ],
      explanation: {
        summary:
          "Strategy — это «if-elif-else по полиморфизму». Вместо того чтобы пихать в Order условия по типу скидки, мы вынесем КАЖДУЮ ветку в свой класс. Добавление новой скидки = новый класс, без правок Order.",
        keyPoints: [
          "Order зависит ТОЛЬКО от абстракции DiscountStrategy — это OCP («open for extension, closed for modification»).",
          "Стратегии можно держать как stateless-функции; в Python иногда вместо классов используют просто Callable[[float], float].",
          "Тестируется идеально: каждая стратегия проверяется в изоляции, Order — с моками-стратегиями.",
        ],
        realWorld:
          "Сортировки (key=...), способы оплаты, правила ценообразования, политики ретраев в HTTP — всё это Strategy в чистом виде.",
      },
    },
    {
      type: "fill",
      id: "r9-f2",
      title: "Observer: подписка на события",
      description:
        "Заверши классический Observer: Subject рассылает события, наблюдатели подписываются и реагируют.",
      code: `from typing import Callable


class EventBus:
    """Простой шина событий: подписка/отписка/рассылка."""

    def __init__(self) -> None:
        self._subs: dict[str, list[Callable[..., None]]] = {}

    def subscribe(self, event: str, handler: Callable[..., None]) -> None:
        self._subs.setdefault(event, []).{{0}}(handler)

    def unsubscribe(self, event: str, handler: Callable[..., None]) -> None:
        if event in self._subs and handler in self._subs[event]:
            self._subs[event].{{1}}(handler)

    def emit(self, event: str, *args, **kwargs) -> None:
        for h in list(self._subs.{{2}}(event, [])):   # копия — на случай отписки в обработчике
            h(*args, **kwargs)


class OrderService:
    def __init__(self, bus: EventBus) -> None:
        self.bus = bus

    def create(self, order_id: int, total: float) -> None:
        print(f"order#{order_id} создан на {total}")
        self.bus.{{3}}("order_created", order_id, total)


def send_email(order_id: int, total: float) -> None:
    print(f"  → email: спасибо за заказ #{order_id}!")


def update_stats(order_id: int, total: float) -> None:
    print(f"  → stats: +{total}")


bus = EventBus()
bus.{{4}}("order_created", send_email)
bus.subscribe("order_created", {{5}})

svc = OrderService(bus)
svc.create(101, 999.0)
`,
      answers: [
        ["append"],
        ["remove"],
        ["get"],
        ["emit"],
        ["subscribe"],
        ["update_stats"],
      ],
      hints: [
        "Добавляем нового подписчика в конец списка.",
        "Убираем подписчика из списка.",
        ".get(event, []) безопасно вернёт пустой список, если событие никто не слушает.",
        "Уведомляем всех подписчиков.",
        "Регистрируем обработчик email.",
        "Вторая подписка — обновление статистики.",
      ],
      explanation: {
        summary:
          "Observer (он же pub/sub) развязывает «кто событие создаёт» и «кто на него реагирует». OrderService даже не знает о существовании email-подсистемы и стат-сервиса. Это критически важно для модульности.",
        keyPoints: [
          "list(self._subs.get(...)) — копия списка нужна, потому что обработчик может отписаться сам, и итерация по живому списку упадёт.",
          "В Python обработчик — это любой Callable: функция, метод, лямбда, объект с __call__.",
          "Слабые ссылки (weakref) часто используют в EventBus, чтобы подписки не мешали GC. Это уже сложнее, но идея — та же.",
        ],
        realWorld:
          "Сигналы Django, Qt signals/slots, EventEmitter в Node, RxJS Subject — всё это варианты Observer. На больших расстояниях он превращается в очередь сообщений (Kafka, RabbitMQ).",
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "r9-q1",
      title: "Strategy vs наследование",
      question:
        "Какое ОДНО ключевое преимущество Strategy перед прямым переопределением метода в наследниках? Назови принцип SOLID одной буквой (например, S, O, L, I, D).",
      answers: ["O", "o", "Open-Closed", "OCP"],
      hint: "Открыт для расширения, закрыт для модификации.",
      explanation:
        "OCP — Open/Closed Principle. С наследованием, чтобы добавить пятую скидку, придётся либо плодить наследников Order (комбинаторный взрыв), либо менять Order сам. Со Strategy — Order вообще не трогаем: достаточно добавить новый класс DiscountStrategy. Объект-композиция > наследование именно в таких сценариях.",
    },
    {
      type: "question",
      id: "r9-q2",
      title: "Почему Singleton ругают?",
      question:
        "Какое ОДНО главное практическое возражение против Singleton (помимо 'это глобальная переменная')? Напиши коротко по-русски одним словом — это слово начинается на букву 'т'.",
      answers: ["тестируемость", "тесты", "тестирование"],
      hint: "Глобальное состояние тяжело подменить в чём?",
      explanation:
        "Тестируемость. Singleton — это глобальное состояние, которое в тестах нельзя подменить чисто, без чёрной магии (resetting class attributes, monkeypatching). Альтернатива — Dependency Injection: передавать конфиг/клиент явно в конструкторе. Тогда в тестах можно подсунуть фейк без хаков. Singleton оправдан только когда альтернативы реально нет — например, для логгера на уровне процесса.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r9-w1",
      title: "Factory Method для парсеров",
      task:
        "Реализуй Factory Method. Базовый класс Parser с абстрактным методом parse(text) -> dict. Два наследника: JsonParser (использует import json) и KeyValueParser (строки 'k=v', разделитель '\\n'). Реализуй модульную функцию-фабрику make_parser(kind: str) -> Parser, которая возвращает JsonParser() для kind=='json', KeyValueParser() для kind=='kv', иначе кидает ValueError.",
      hints: [
        "from abc import ABC, abstractmethod; import json.",
        "class Parser(ABC): @abstractmethod def parse(self, text)...",
        "JsonParser.parse — return json.loads(text).",
        "KeyValueParser.parse — return dict(line.split('=', 1) for line in text.splitlines() if line.strip()).",
        "make_parser: if/elif/else на kind.",
      ],
      required: [
        "class Parser",
        "class JsonParser",
        "class KeyValueParser",
        "abstractmethod",
        "def make_parser",
        "ValueError",
      ],
      minLines: 18,
      explanation: {
        summary:
          "Factory Method прячет создание конкретного типа за единым интерфейсом. Клиентский код знает только Parser, а решение «какой именно» принимает фабрика. Добавили YAMLParser — расширили make_parser, всё остальное работает.",
        keyPoints: [
          "Это анти-паттерн «if isinstance(...)»: фабрика принимает решение в одном месте, дальше работаем с Parser.",
          "В Python иногда вместо классической фабрики используют dict-реестр: PARSERS = {'json': JsonParser, 'kv': KeyValueParser}; PARSERS[kind]().",
        ],
      },
    },
    {
      type: "write",
      id: "r9-w2",
      title: "Observer на классах: Subject и Observer",
      task:
        "Напиши класс Subject с методами attach(o), detach(o), notify(*args, **kwargs). Внутри хранит self._observers: list. Метод notify зовёт o.update(*args, **kwargs) у каждого. Напиши класс Observer с методом update(*args, **kwargs) (по умолчанию просто print). Сделай простую сцену: subject = Subject(); subject.attach(Observer()); subject.notify('hi').",
      hints: [
        "class Subject: __init__ заводит self._observers = []",
        "attach: self._observers.append(o); detach: self._observers.remove(o).",
        "notify: for o in list(self._observers): o.update(*args, **kwargs).",
        "class Observer: def update(self, *a, **kw): print('event:', *a, kw).",
      ],
      required: [
        "class Subject",
        "class Observer",
        "attach",
        "detach",
        "notify",
        "update",
      ],
      minLines: 14,
      explanation: {
        summary:
          "Каноническая объектная версия Observer (в отличие от EventBus с типами событий по строкам). Применяется, когда подписчики ВСЕГДА реагируют на ВСЕ изменения одного объекта.",
        keyPoints: [
          "list(self._observers) в notify даёт безопасную итерацию, если в update подписчик отвяжется.",
          "Объектная версия дороже по памяти (под каждого слушателя — объект), но даёт тип-безопасность через ABC/Protocol.",
        ],
      },
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r9-l1",
      title: "Реализуй Strategy через Callable",
      description:
        "В Python стратегии — часто просто функции. Реализуй фабрику стратегий и применение в SortService.",
      code: `from typing import Callable


class SortService:
    """Сортирует список с помощью переданной стратегии-функции."""

    def __init__(self, strategy: Callable[[list[int]], list[int]]) -> None:
        self.strategy = strategy

    def run(self, data: list[int]) -> list[int]:
        return self.strategy(list(data))   # копия — стратегия не должна мутировать вход


# ─────────────── БЛОК 1: три функции-стратегии (~6 строк) ───────────────
# Каждая принимает список и возвращает НОВЫЙ отсортированный список.
# Шаблон (3 функции, без отступа — это модульный уровень):
#     def asc(xs: list[int]) -> list[int]:
#         return sorted(xs)                       # обычная сортировка
#
#     def desc(xs: list[int]) -> list[int]:
#         return sorted(xs, reverse=True)         # параметр reverse=True
#
#     def by_abs(xs: list[int]) -> list[int]:
#         return sorted(xs, key=abs)              # key= — функция-ключ
# Между функциями оставляй пустую строку (PEP 8 рекомендует две, но Python терпит и одну).
{{LINE:0}}


# ─────────────── БЛОК 2: dict-реестр + get_strategy (~6 строк) ───────────────
# Сначала словарь имя → функция. Потом функция-доставала.
# Шаблон:
#     STRATEGIES: dict[str, Callable[[list[int]], list[int]]] = {
#         "asc": asc, "desc": desc, "by_abs": by_abs,
#     }
#
#     def get_strategy(name: str) -> Callable[[list[int]], list[int]]:
#         if name not in STRATEGIES:
#             raise KeyError(f"unknown strategy: {name!r}")
#         return STRATEGIES[name]
# Передавай ССЫЛКУ на функцию (asc без скобок), а не результат вызова (asc())!
{{LINE:1}}


s = SortService(get_strategy("by_abs"))
print(s.run([-3, 1, -7, 5, -2]))
`,
      blanks: [
        {
          lines: 6,
          required: ["def asc", "def desc", "def by_abs", "sorted", "reverse=True", "key="],
          hint: "Три функции: return sorted(xs); return sorted(xs, reverse=True); return sorted(xs, key=abs)",
          reference: `def asc(xs: list[int]) -> list[int]:
    return sorted(xs)

def desc(xs: list[int]) -> list[int]:
    return sorted(xs, reverse=True)

def by_abs(xs: list[int]) -> list[int]:
    return sorted(xs, key=abs)`,
          placeholder:
            "def asc(xs: list[int]) -> list[int]:\n    return sorted(xs)\n\ndef desc(xs: list[int]) -> list[int]:\n    return sorted(xs, reverse=True)\n\ndef by_abs(xs: list[int]) -> list[int]:\n    return sorted(xs, key=abs)",
        },
        {
          lines: 6,
          required: ["def get_strategy", "STRATEGIES", "raise KeyError", "return"],
          hint: "STRATEGIES = {'asc': asc, 'desc': desc, 'by_abs': by_abs}; def get_strategy(name): try: return STRATEGIES[name] except KeyError: raise KeyError(...)",
          reference: `STRATEGIES: dict[str, Callable[[list[int]], list[int]]] = {
    "asc": asc, "desc": desc, "by_abs": by_abs,
}

def get_strategy(name: str) -> Callable[[list[int]], list[int]]:
    if name not in STRATEGIES:
        raise KeyError(f"unknown strategy: {name!r}")
    return STRATEGIES[name]`,
          placeholder:
            "STRATEGIES: dict[str, Callable[[list[int]], list[int]]] = {\n    \"asc\": asc, \"desc\": desc, \"by_abs\": by_abs,\n}\n\ndef get_strategy(name: str) -> Callable[[list[int]], list[int]]:\n    if name not in STRATEGIES:\n        raise KeyError(f\"unknown strategy: {name!r}\")\n    return STRATEGIES[name]",
        },
      ],
      explanation: {
        summary:
          "В Python функции — это объекты первого класса. Поэтому Strategy часто проще реализовать как Callable, без наследования. Дешевле, читабельнее, но теряется группировка состояния.",
        keyPoints: [
          "Когда у стратегии нет состояния — функция или лямбда. Когда нужно состояние — класс.",
          "dict-реестр стратегий = открытая мини-DSL: добавил пару 'name': func, и она доступна во всём приложении.",
          "list(data) внутри run — защитное копирование: стратегия не должна неожиданно мутировать вход.",
        ],
      },
    },
    {
      type: "fill-lines",
      id: "r9-l2",
      title: "Реализуй Factory + Singleton через декоратор",
      description:
        "Заполни декоратор @singleton (превращает класс в singleton через словарь экземпляров) и фабричную функцию.",
      code: `# ─────────────── БЛОК 1: декоратор @singleton (~7 строк) ───────────────
# Декоратор — это функция, которая принимает класс и возвращает что-то взамен.
# Здесь — функцию-обёртку, которая помнит уже созданный экземпляр в замыкании.
# Шаблон (без отступа — модульный уровень):
#     def singleton(cls):
#         _instances: dict = {}                  # ловушка для экземпляров
#
#         def wrapper(*args, **kwargs):
#             if cls not in _instances:          # ещё не создавали
#                 _instances[cls] = cls(*args, **kwargs)
#             return _instances[cls]             # всегда тот же объект
#
#         return wrapper                         # возвращаем обёртку, не cls!
{{LINE:0}}


@singleton
class Logger:
    def __init__(self, level: str = "INFO") -> None:
        self.level = level

    def log(self, msg: str) -> None:
        print(f"[{self.level}] {msg}")


# ─────────────── БЛОК 2: фабрика make_logger (~5 строк) ───────────────
# Особенность: Logger уже декорирован @singleton, поэтому Logger(level) при втором
# вызове ВЕРНЁТ старый объект — переданный level будет ПРОИГНОРИРОВАН.
# Наша задача — заметить это и предупредить пользователя.
# Шаблон:
#     def make_logger(level: str) -> Logger:
#         logger = Logger(level)                          # singleton-вызов
#         if logger.level != level:                       # настройка не применилась?
#             print(f"warning: singleton already created with level={logger.level!r}, ignoring {level!r}")
#         return logger
{{LINE:1}}


a = make_logger("DEBUG")
b = make_logger("ERROR")        # должен напечатать предупреждение
print(a is b, a.level)
`,
      blanks: [
        {
          lines: 7,
          required: ["def singleton", "_instances", "if cls", "_instances[cls]", "return", "wrapper"],
          hint: "def singleton(cls): _instances = {}; def wrapper(*a, **kw): if cls not in _instances: _instances[cls] = cls(*a, **kw); return _instances[cls]; return wrapper",
          reference: `def singleton(cls):
    _instances: dict = {}

    def wrapper(*args, **kwargs):
        if cls not in _instances:
            _instances[cls] = cls(*args, **kwargs)
        return _instances[cls]

    return wrapper`,
          placeholder:
            "def singleton(cls):\n    _instances: dict = {}\n\n    def wrapper(*args, **kwargs):\n        if cls not in _instances:\n            _instances[cls] = cls(*args, **kwargs)\n        return _instances[cls]\n\n    return wrapper",
        },
        {
          lines: 5,
          required: ["def make_logger", "logger", "Logger(", "level", "print"],
          hint: "def make_logger(level): logger = Logger(level); if logger.level != level: print('warning: ...'); return logger",
          reference: `def make_logger(level: str) -> Logger:
    logger = Logger(level)
    if logger.level != level:
        print(f"warning: singleton already created with level={logger.level!r}, ignoring {level!r}")
    return logger`,
          placeholder:
            "def make_logger(level: str) -> Logger:\n    logger = Logger(level)\n    if logger.level != level:\n        print(f\"warning: singleton already created with level={logger.level!r}, ignoring {level!r}\")\n    return logger",
        },
      ],
      explanation: {
        summary:
          "Декоратор @singleton — самый чистый способ сделать singleton в Python: не нужны __new__ или метаклассы. Пример с make_logger показывает классическую ловушку: переданный аргумент ИГНОРИРУЕТСЯ, если объект уже создан. Об этом нужно явно предупреждать.",
        keyPoints: [
          "Декоратор оборачивает класс в функцию-фабрику. Это нарушает isinstance(x, Logger), потому что type(x).__name__ всё равно Logger, но Logger теперь — функция, а не класс. Аккуратно с тайпчекерами.",
          "Альтернатива без потерь: класс с метаклассом или модульный синглтон (просто инстанс на уровне модуля).",
        ],
      },
    },
  ],
};

// ===========================================================================
// ROUND 10 — Контекстные менеджеры, итераторы, async
// ===========================================================================

const round10: Round = {
  number: 10,
  title: "Context managers, итераторы и async",
  level: "Архитектор",
  intro:
    "Финальный раунд — продвинутые протоколы Python: __enter__/__exit__ (with), __iter__/__next__ (for), их асинхронные версии __aenter__/__aexit__ (async with) и __aiter__/__anext__ (async for). Эти протоколы превращают язык: вместо try/finally — with, вместо while+state — for, вместо callback hell — async/await. Понимание этих четырёх пар методов делает тебя Python-инженером, а не просто Python-программистом.",
  fills: [
    {
      type: "fill",
      id: "r10-f1",
      title: "Контекстный менеджер: Timer",
      description:
        "Заполни класс Timer, который замеряет время выполнения блока with. Используй __enter__ и __exit__.",
      code: `import time


class Timer:
    """with Timer() as t: ... → потом print(t.elapsed)"""

    def __init__(self) -> None:
        self.start: float | None = None
        self.end: float | None = None

    def __enter__(self) -> "Timer":
        self.start = time.{{0}}()
        return self                        # это попадёт в "as t"

    def __exit__(self, exc_type, exc, tb) -> {{1}}:
        self.end = time.perf_counter()
        # вернуть True ⇒ исключение проглотится; False (или None) ⇒ пробросится дальше
        return False

    @property
    def elapsed(self) -> float:
        if self.start is None or self.{{2}} is None:
            return 0.0
        return self.end - self.start


with Timer() as t:
    sum(i * i for i in range(10_000))

print(f"заняло {t.{{3}}:.6f} с")
`,
      answers: [["perf_counter"], ["bool"], ["end"], ["elapsed"]],
      hints: [
        "Точный таймер из модуля time для измерения интервалов.",
        "__exit__ должен возвращать bool: True проглотит исключение.",
        "Чтобы посчитать elapsed, нужны и start, и end.",
        "Свойство, которое выдаёт длительность.",
      ],
      explanation: {
        summary:
          "Протокол context manager — это two-method интерфейс: __enter__ возвращает то, что попадёт в `as`, __exit__ выполняется при ВЫХОДЕ из блока (даже если было исключение). Гарантия выполнения cleanup-кода в любом случае.",
        keyPoints: [
          "time.perf_counter() — высокоточный монотонный таймер для измерений; никогда не используй time.time() для бенчмарков.",
          "__exit__ получает три аргумента: тип исключения, само исключение и traceback. Если исключения не было — все три None.",
          "Возвращая True из __exit__, ты ПОДАВЛЯЕШЬ исключение. Это делают редко и осознанно (например, suppress).",
        ],
        realWorld:
          "open(), threading.Lock(), pytest.raises(), sqlalchemy.Session, SQLite-транзакции — всё это контекстные менеджеры с тем же паттерном.",
      },
    },
    {
      type: "fill",
      id: "r10-f2",
      title: "Итератор: Range с шагом",
      description:
        "Заверши собственную реализацию range через __iter__ и __next__.",
      code: `class MyRange:
    """Свой range(start, stop, step) для тренировки."""

    def __init__(self, start: int, stop: int, step: int = 1) -> None:
        if step == {{0}}:
            raise ValueError("step must be != 0")
        self.start = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        # каждый вызов iter(myrange) даёт СВЕЖИЙ итератор —
        # значит можно итерировать одно и то же MyRange несколько раз
        return MyRangeIterator(self.start, self.stop, self.{{1}})


class MyRangeIterator:
    def __init__(self, current: int, stop: int, step: int) -> None:
        self.current = current
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self                        # обязательно для итераторов

    def __next__(self):
        # условие остановки зависит от знака step
        if (self.step > 0 and self.current >= self.stop) or (
            self.{{2}} < 0 and self.current <= self.stop
        ):
            raise {{3}}                    # сигнал «итерация закончилась»
        value = self.current
        self.current += self.step
        return value


print(list(MyRange(0, 10, 2)))             # [0, 2, 4, 6, 8]
print(list({{4}}(10, 0, -3)))              # [10, 7, 4, 1]
`,
      answers: [["0"], ["step"], ["step"], ["StopIteration"], ["MyRange"]],
      hints: [
        "step не может быть равным нулю.",
        "Передаём шаг дальше в итератор.",
        "Шаг лежит в self.step.",
        "Сигнал «итерация окончена» — встроенное исключение.",
        "Используем тот же класс MyRange.",
      ],
      explanation: {
        summary:
          "Итератор в Python — это два протокола сразу: ИТЕРИРУЕМЫЙ (__iter__ возвращает итератор) и ИТЕРАТОР (__iter__ возвращает self + __next__ выдаёт следующий элемент или кидает StopIteration). Разделение MyRange/MyRangeIterator — каноническое: оно даёт многократную итерацию.",
        keyPoints: [
          "Если положить и __iter__, и __next__ в один класс, то после прохода итератор «иссякнет» и второй раз for уже ничего не даст.",
          "StopIteration — НЕ ошибка, а штатный сигнал. Поэтому никогда не лови его в except: ты сломаешь итерацию.",
          "Альтернатива классам — generator: def my_range(...): while ...: yield x. Часто короче и читаемее.",
        ],
        realWorld:
          "Все встроенные коллекции (list, dict, set), itertools, файлы, csv.reader — всё реализует этот же протокол. for x in obj — это просто синтаксический сахар над iter+next.",
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "r10-q1",
      title: "Что такое генератор?",
      question:
        "Какое одно ключевое слово превращает обычную функцию в генератор? Напиши только слово.",
      answers: ["yield"],
      hint: "Эта инструкция ВРЕМЕННО возвращает значение, но сохраняет состояние функции.",
      explanation:
        "yield. Любая функция, в теле которой встречается yield, при ВЫЗОВЕ не выполняется сразу — возвращается генератор-объект (он же итератор). На каждом next() функция продолжается до следующего yield, отдаёт значение и снова замораживается. Это и есть «корутина бедного человека»: явно сохранённое состояние без классов.",
    },
    {
      type: "question",
      id: "r10-q2",
      title: "Что должен делать __aexit__?",
      question:
        "Чем отличается __aexit__ от __exit__ ОДНИМ словом? Напиши это слово (по-русски, прилагательное в начальной форме).",
      answers: ["асинхронный", "асинхронным", "асинхронной", "async"],
      hint: "__aexit__ — это для async with.",
      explanation:
        "__aexit__ — АСИНХРОННЫЙ метод (объявляется как async def). Он используется в async with и может await-ить внутри (например, await connection.close()). Парные методы: __aenter__/__aexit__. Точно так же __anext__ — асинхронная версия __next__, и __aiter__ — асинхронная __iter__. Пара 'a' в имени = 'asynchronous'.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "r10-w1",
      title: "Контекстный менеджер OpenSafe",
      task:
        "Напиши класс OpenSafe(path, mode), который работает как with. В __enter__ открой файл (open(path, mode)) и верни его. В __exit__ — закрой файл (если он был открыт) и ПОГЛОТИ FileNotFoundError, вернув True (для остальных исключений верни False — они должны пробрасываться). Сцена: with OpenSafe('/tmp/no.txt', 'r') as f: ... — не должна упасть.",
      hints: [
        "self.file = None в __init__.",
        "__enter__: self.file = open(self.path, self.mode); return self.file.",
        "__exit__: if self.file is not None: self.file.close(); вернуть exc_type is FileNotFoundError.",
        "Не забудь, что open сам может кинуть FileNotFoundError — обработай это в __enter__ через try/except.",
      ],
      required: [
        "class OpenSafe",
        "def __enter__",
        "def __exit__",
        "self.file",
        "FileNotFoundError",
      ],
      minLines: 14,
      explanation: {
        summary:
          "Учебный пример того, как __exit__ может НЕ ПРОБРАСЫВАТЬ исключение. Вернул True — Python считает, что ты обработал ошибку, и блок with продолжается дальше. Возвращать True по умолчанию — антипаттерн (тихие ошибки), но иногда нужно.",
        keyPoints: [
          "Файл должен закрываться даже при исключении — поэтому close() стоит до проверки типа.",
          "В реальной жизни ту же задачу проще решить через contextlib.suppress(FileNotFoundError) — но руками тоже надо уметь.",
        ],
      },
    },
    {
      type: "write",
      id: "r10-w2",
      title: "Итератор Cycle(items, n)",
      task:
        "Напиши класс Cycle(items, n), который при итерации проходит по items по кругу ровно n раз (всего len(items) * n элементов). Реализуй __iter__/__next__ или сделай через generator-функцию внутри __iter__. Пример: list(Cycle([1,2,3], 2)) → [1,2,3,1,2,3].",
      hints: [
        "Самый простой путь: def __iter__(self): for _ in range(self.n): yield from self.items.",
        "Альтернатива через классический протокол: __next__ должен следить за двумя индексами (round, pos) и кидать StopIteration после round == n.",
        "items сохраняй как список — list(items) — на случай переданного итератора.",
      ],
      required: ["class Cycle", "__iter__", "self.items", "self.n"],
      minLines: 8,
      explanation: {
        summary:
          "Хороший пример: классический протокол можно ЗАМЕНИТЬ на generator-метод. Достаточно, чтобы __iter__ был генератором — Python автоматически получает __next__ и StopIteration.",
        keyPoints: [
          "yield from items — компактный способ «выдать все элементы из items» без явного цикла.",
          "list(items) в __init__ важна: если кто-то передаст одноразовый итератор, второй вызов iter(cycle) увидит уже пустой источник.",
        ],
      },
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r10-l1",
      title: "@contextmanager: декоратор вместо класса",
      description:
        "Реализуй контекстный менеджер через @contextmanager (compact-стиль). Внутри — try/finally.",
      code: `from contextlib import contextmanager
import time


# ─────────────── БЛОК 1: @contextmanager-функция (~7 строк) ───────────────
# Это компактная альтернатива классу с __enter__/__exit__: код ДО yield = enter,
# код ПОСЛЕ yield (внутри finally) = exit.
# Шаблон (без отступа — модульный уровень):
#     @contextmanager
#     def timed(label: str):
#         t0 = time.perf_counter()             # начало замера ДО yield
#         try:
#             yield                            # сюда «попадает» тело with
#         finally:
#             ms = (time.perf_counter() - t0) * 1000
#             print(f"{label}: {ms:.2f} ms")
# ВАЖНО: try/finally обязателен — иначе при исключении в with cleanup пропустится.
{{LINE:0}}


# ─────────────── БЛОК 2: timed как ДЕКОРАТОР (~3-4 строки) ───────────────
# Бонус @contextmanager: возвращённый объект сам по себе декоратор.
# То есть @timed("compute") поверх обычной функции тоже сработает.
# Шаблон:
#     @timed("compute")
#     def compute() -> int:
#         return sum(i * i for i in range(100_000))
# ВНУТРИ функции делай что хочешь — лишь бы возвращало значение.
{{LINE:1}}


with timed("loop"):
    sum(i for i in range(100_000))

compute()
`,
      blanks: [
        {
          lines: 7,
          required: ["@contextmanager", "def timed", "label", "t0", "yield", "finally", "perf_counter"],
          hint: "@contextmanager\\ndef timed(label): t0 = time.perf_counter(); try: yield; finally: ms = (time.perf_counter() - t0) * 1000; print(...)",
          reference: `@contextmanager
def timed(label: str):
    t0 = time.perf_counter()
    try:
        yield
    finally:
        ms = (time.perf_counter() - t0) * 1000
        print(f"{label}: {ms:.2f} ms")`,
          placeholder:
            "@contextmanager\ndef timed(label: str):\n    t0 = time.perf_counter()\n    try:\n        yield\n    finally:\n        ms = (time.perf_counter() - t0) * 1000\n        print(f\"{label}: {ms:.2f} ms\")",
        },
        {
          lines: 4,
          required: ["@timed", "def compute", "return", "sum"],
          hint: "@timed('compute')\\ndef compute(): return sum(i*i for i in range(100_000))",
          reference: `@timed("compute")
def compute() -> int:
    return sum(i * i for i in range(100_000))`,
          placeholder:
            "@timed(\"compute\")\ndef compute() -> int:\n    return sum(i * i for i in range(100_000))",
        },
      ],
      explanation: {
        summary:
          "@contextmanager превращает функцию-генератор в полноценный context manager. Код ДО yield = __enter__, код ПОСЛЕ yield (обычно в finally) = __exit__. То же самое поведение, но в разы короче и читаемее.",
        keyPoints: [
          "try/finally вокруг yield — обязателен, если cleanup должен случиться даже при исключении в with-блоке.",
          "Возвращаемый объект (то, что попадёт в `as`) — это аргумент yield. Если просто yield — будет yield None.",
          "Бонус: @contextmanager-объект сам по себе является декоратором, поэтому @timed('x') над функцией работает без отдельного кода.",
        ],
      },
    },
    {
      type: "fill-lines",
      id: "r10-l2",
      title: "async-итератор: тики таймера",
      description:
        "Реализуй __aiter__/__anext__ для асинхронного «таймера»: каждые delay секунд выдаёт следующий номер, до limit.",
      code: `import asyncio


class Ticker:
    """async for tick in Ticker(0.1, 5): ..."""

    def __init__(self, delay: float, limit: int) -> None:
        self.delay = delay
        self.limit = limit
        self.i = 0

    # ─────────────── БЛОК 1: __aiter__ (~2 строки) ───────────────
    # __aiter__ — обычный (НЕ async) метод. Должен вернуть итератор.
    # Когда сам класс является итератором — возвращаем self.
    # Шаблон (4 пробела отступа за классом):
    #     def __aiter__(self):
    #         return self
{{LINE:0}}

    # ─────────────── БЛОК 2: __anext__ (~5 строк) ───────────────
    # __anext__ ОБЯЗАТЕЛЬНО async — это корутина, которую async for await-ит.
    # Возврат → следующее значение. raise StopAsyncIteration → конец цикла.
    # Шаблон (4 пробела отступа за классом):
    #     async def __anext__(self) -> int:
    #         if self.i >= self.limit:
    #             raise StopAsyncIteration       # сигнал «всё, цикл закончен»
    #         await asyncio.sleep(self.delay)    # неблокирующая пауза
    #         self.i += 1
    #         return self.i
    # ВАЖНО: asyncio.sleep, а НЕ time.sleep — иначе заблокируем event loop.
{{LINE:1}}


async def main() -> None:
    async for tick in Ticker(0.05, 4):
        print("tick", tick)


asyncio.run(main())
`,
      blanks: [
        {
          lines: 2,
          required: ["def __aiter__", "self", "return self"],
          hint: "def __aiter__(self): return self",
          reference: `    def __aiter__(self):
        return self`,
          placeholder: "    def __aiter__(self):\n        return self",
        },
        {
          lines: 5,
          required: ["async def __anext__", "StopAsyncIteration", "await asyncio.sleep", "self.delay", "self.i"],
          hint: "async def __anext__(self): if self.i >= self.limit: raise StopAsyncIteration; await asyncio.sleep(self.delay); self.i += 1; return self.i",
          reference: `    async def __anext__(self) -> int:
        if self.i >= self.limit:
            raise StopAsyncIteration
        await asyncio.sleep(self.delay)
        self.i += 1
        return self.i`,
          placeholder:
            "    async def __anext__(self) -> int:\n        if self.i >= self.limit:\n            raise StopAsyncIteration\n        await asyncio.sleep(self.delay)\n        self.i += 1\n        return self.i",
        },
      ],
      explanation: {
        summary:
          "Async-итератор — почти точная копия обычного. Разница: __anext__ объявлен как async и кидает StopAsyncIteration вместо StopIteration. async for делает остальное.",
        keyPoints: [
          "asyncio.sleep — это не блокирующая пауза: пока он 'спит', event loop крутит другие задачи.",
          "Если бы мы написали обычный time.sleep, это заблокировало бы весь event loop.",
          "Альтернатива __anext__/__aiter__ через async generator: async def ticker(...): while ...: yield. Часто проще — но протокол знать обязательно.",
        ],
        realWorld:
          "aiohttp websockets, asyncpg cursors, kafka-python AIOKafkaConsumer, FastAPI streaming responses — всё это async-итераторы.",
      },
    },
  ],
};

// ===========================================================================
// EXPORT
// ===========================================================================

export const ADVANCED_ROUNDS: Round[] = [round6, round7, round8, round9, round10];
