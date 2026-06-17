import type { Round } from "@/data/curriculum";

// ---------------------------------------------------------------------------
// SENIOR PYTHON COURSE — 7 раундов
//
// Продолжение Middle. Цель — сделать архитектурно зрелого Python-разработчика:
// продвинутое ООП, метаклассы/дескрипторы, многозадачность, asyncio,
// профилирование, тестирование, паттерны и SOLID.
// ---------------------------------------------------------------------------

const s1: Round = {
  number: 1,
  title: "Senior · Глубокое ООП: MRO, super, ABC",
  level: "Сложный",
  intro:
    "Зрелое ООП — это не «много классов», а правильное использование наследования, абстракций и контрактов. Учим method resolution order, корректное super() и абстрактные базовые классы.",
  lesson: {
    title: "MRO, super(), abc.ABC и Protocol",
    summary:
      "Как Python разрешает методы в множественном наследовании, что делает super(), зачем нужны ABC и Protocol — и в чём разница.",
    readingMinutes: 8,
    sections: [
      {
        heading: "MRO и super()",
        tagline: "C3 линеаризация + кооперативное наследование",
        body:
          "**MRO (Method Resolution Order)** — порядок, в котором Python ищет атрибуты и методы по цепочке базовых классов. При множественном наследовании используется алгоритм **C3-линеаризации**. Посмотреть можно: `MyClass.__mro__` или `MyClass.mro()`.\n\n" +
          "`super().method()` вызывает следующую реализацию в этом MRO — **не обязательно** «родителя по коду». Это и есть **кооперативное множественное наследование**: каждый класс вызывает `super().method()`, и Python проходит всю цепочку в правильном порядке.\n\n" +
          "Главное правило: **либо все классы в иерархии вызывают super(), либо никто**. Иначе цепочка рвётся.",
        code:
          "class A:\n" +
          "    def hello(self):\n" +
          "        print(\"A\")\n\n" +
          "class B(A):\n" +
          "    def hello(self):\n" +
          "        print(\"B\")\n" +
          "        super().hello()\n\n" +
          "class C(A):\n" +
          "    def hello(self):\n" +
          "        print(\"C\")\n" +
          "        super().hello()\n\n" +
          "class D(B, C):\n" +
          "    def hello(self):\n" +
          "        print(\"D\")\n" +
          "        super().hello()\n\n" +
          "D().hello()    # D, B, C, A — благодаря C3 + super()\n" +
          "print([cls.__name__ for cls in D.__mro__])\n" +
          "# ['D', 'B', 'C', 'A', 'object']",
        keyTakeaways: [
          "MRO определяет порядок поиска. C3-линеаризация — детерминирована.",
          "super() идёт по MRO, а не по «прямому родителю».",
          "Кооперативность работает только если ВСЕ вызывают super().",
        ],
        pitfalls: [
          "Если хоть один класс не позовёт super() — цепочка прервётся на нём.",
          "Множественное наследование — мощно, но дорого по сложности. Часто лучше композиция или mixins.",
          "**Mixin** — это маленький класс с одной обязанностью, без своего __init__. Не злоупотребляй ими.",
        ],
        analogy:
          "super() — как эстафетная палочка: D передаёт B, B передаёт C, C передаёт A. Если B уронит палочку (не вызовет super) — C и A вообще не запустятся. MRO — это заранее расписанный порядок бегунов по C3-алгоритму.",
      },
      {
        heading: "Абстрактные базовые классы и Protocol",
        tagline: "ABC — номинальный контракт; Protocol — структурный (duck typing)",
        body:
          "**`abc.ABC` + `@abstractmethod`** — описывают **обязательный** интерфейс. Подкласс ОБЯЗАН реализовать все абстрактные методы, иначе экземпляр создать нельзя. Это **номинальный** контракт — ты явно наследуешься.\n\n" +
          "**`typing.Protocol`** (3.8+) — это **структурный** контракт: «если у объекта есть нужные методы — он подходит». Не нужно никаких наследований. Это зрелая «утиная типизация».\n\n" +
          "Когда что брать:\n\n" +
          "- ABC — когда хочешь жёстко закрепить иерархию (рамки фреймворка, плагины).\n" +
          "- Protocol — когда нужен лёгкий интерфейс для функций, и не хочется тащить наследование.",
        code:
          "from abc import ABC, abstractmethod\n" +
          "from typing import Protocol\n\n" +
          "# Номинальный контракт\n" +
          "class Storage(ABC):\n" +
          "    @abstractmethod\n" +
          "    def save(self, data: bytes) -> None: ...\n\n" +
          "class FileStorage(Storage):\n" +
          "    def save(self, data: bytes) -> None:\n" +
          "        with open(\"out.bin\", \"wb\") as f:\n" +
          "            f.write(data)\n\n" +
          "# Storage()  # TypeError — абстрактный\n\n" +
          "# Структурный контракт\n" +
          "class HasName(Protocol):\n" +
          "    name: str\n\n" +
          "def hello(x: HasName) -> str:\n" +
          "    return f\"Hi, {x.name}!\"\n\n" +
          "class Cat:\n" +
          "    name = \"Барсик\"\n\n" +
          "print(hello(Cat()))   # Cat подходит, не наследуясь от HasName",
        keyTakeaways: [
          "ABC + @abstractmethod — обязательный контракт через наследование.",
          "Protocol — контракт по структуре, без наследования.",
          "Protocol + аннотации — современная замена «утиной типизации».",
        ],
        pitfalls: [
          "Если у ABC-наследника не реализовать абстрактный метод, инстанс не создашь — но если вообще ничего не наследовать, ошибки не будет.",
          "Protocol работает на уровне статических анализаторов. В рантайме — `@runtime_checkable` + isinstance.",
        ],
        analogy:
          "ABC — как трудовой договор: нанимаешься — подписываешь, что будешь делать определённую работу. Protocol — как кастинг: «умеешь петь и танцевать? проходи». Не нужно подписывать договор — просто соответствуй критериям.",
      },
      {
        heading: "dataclasses — автогенерация __init__, __repr__, __eq__",
        tagline: "@dataclass избавляет от boilerplate в классах-данных",
        body:
          "Модуль `dataclasses` (Python 3.7+) автоматически генерирует `__init__`, `__repr__`, `__eq__` и опционально другие методы на основе аннотированных полей класса.\n\n" +
          "Параметры `@dataclass(...)`: `order=True` — добавляет `__lt__`, `__gt__` и пр.; `frozen=True` — делает объект неизменяемым (и хешируемым); `slots=True` (3.10+) — создаёт `__slots__` для экономии памяти.\n\n" +
          "Специальные значения полей: `field(default_factory=list)` — для изменяемых дефолтов; `field(repr=False)` — исключить поле из repr; `field(compare=False)` — исключить из сравнений.\n\n" +
          "**`__post_init__`** — метод, который вызывается после автогенерированного `__init__`. Удобен для валидации.",
        code:
          "from dataclasses import dataclass, field\n\n" +
          "@dataclass\n" +
          "class Point:\n" +
          "    x: float\n" +
          "    y: float\n\n" +
          "# Автоматически:  __init__(self, x, y), __repr__, __eq__\n" +
          "p = Point(1.0, 2.0)\n" +
          "print(p)          # Point(x=1.0, y=2.0)\n" +
          "print(p == Point(1.0, 2.0))  # True\n\n" +
          "@dataclass(order=True, frozen=True)\n" +
          "class Version:\n" +
          "    major: int\n" +
          "    minor: int\n" +
          "    patch: int = 0   # со значением по умолчанию\n\n" +
          "v1, v2 = Version(1, 2), Version(1, 3)\n" +
          "print(v1 < v2)    # True — order=True включил __lt__\n\n" +
          "@dataclass\n" +
          "class Team:\n" +
          "    name: str\n" +
          "    members: list = field(default_factory=list)  # не []\n\n" +
          "    def __post_init__(self):\n" +
          "        if not self.name:\n" +
          "            raise ValueError(\"Имя команды не может быть пустым\")",
        keyTakeaways: [
          "@dataclass — стандартный способ писать классы-данные без boilerplate.",
          "frozen=True → неизменяемый + хешируемый. Можно класть в set/dict.",
          "field(default_factory=list) для изменяемых дефолтов вместо `members=[]`.",
        ],
        pitfalls: [
          "Поле с дефолтом не может быть раньше поля без дефолта — ошибка при определении.",
          "`frozen=True` — попытка менять атрибут бросает `FrozenInstanceError`.",
          "@dataclass не делает deep copy — если поле — список, объекты его делят.",
        ],
        analogy:
          "@dataclass — как заготовленный бланк. Ты описываешь поля (графы), Python сам заполняет стандартные методы: «заполни __init__, __repr__, __eq__». frozen=True — бланк запаян в пластик: читать можно, менять нельзя.",
      },
      {
        heading: "Дескрипторы и @property — управляемый доступ к атрибутам",
        tagline: "Дескриптор — объект с __get__/__set__/__delete__, управляющий чужим атрибутом",
        body:
          "**@property** — самый простой дескриптор. Он позволяет сделать метод, который вызывается при обращении к атрибуту. Это даёт:\n\n" +
          "- Ленивое вычисление (считаем один раз, кешируем).\n" +
          "- Валидацию при установке (setter).\n" +
          "- Вычисляемые атрибуты (computed property).\n" +
          "- Обратную совместимость: сначала был `self.radius = r`, потом добавили валидацию через `@radius.setter`, — весь внешний код работает без изменений.\n\n" +
          "**Полный дескриптор** — класс с методами `__get__(self, obj, type=None)`, `__set__(self, obj, value)`, `__delete__(self, obj)`. Позволяет централизованно управлять атрибутами у множества классов (валидация типов, логирование, ленивая загрузка).",
        code:
          "class Circle:\n" +
          "    def __init__(self, radius: float):\n" +
          "        self._radius = 0.0\n" +
          "        self.radius = radius   # вызывает setter\n\n" +
          "    @property\n" +
          "    def radius(self) -> float:\n" +
          "        return self._radius\n\n" +
          "    @radius.setter\n" +
          "    def radius(self, value: float) -> None:\n" +
          "        if value < 0:\n" +
          "            raise ValueError(f\"Радиус не может быть отрицательным: {value}\")\n" +
          "        self._radius = value\n\n" +
          "    @property\n" +
          "    def area(self) -> float:\n" +
          "        import math\n" +
          "        return math.pi * self._radius ** 2  # вычисляется каждый раз\n\n" +
          "c = Circle(5)\n" +
          "print(c.area)    # 78.53...\n" +
          "c.radius = -1    # ValueError!",
        keyTakeaways: [
          "@property — вычисляемый атрибут с возможной валидацией в setter.",
          "Называй приватное поле `_x`, публичный property — `x`.",
          "Дескрипторы — механизм, на котором работают @property, @classmethod, @staticmethod.",
        ],
        pitfalls: [
          "Если определить только getter без setter — присваивание даст AttributeError.",
          "`@property` вычисляется каждый раз при доступе. Дорогие вычисления — кешируй через `functools.cached_property`.",
          "Не называй приватное поле так же, как property: `self.radius = ...` в setter → рекурсия.",
        ],
        analogy:
          "@property — как турникет на метро: снаружи выглядит как обычная дверь (c.radius = 5), но внутри — охранник, который проверяет карту и пускает только если всё в порядке (value >= 0). Если кто попытается пройти с отрицательным значением — турникет закрывается (ValueError).",
      },
    ],
    cheatSheet: [
      "MyClass.__mro__ — посмотреть порядок поиска.",
      "super().method() идёт по MRO; кооперативность требует, чтобы ВСЕ классы вызывали super().",
      "abc.ABC + @abstractmethod — обязательный интерфейс.",
      "typing.Protocol — структурный «утиный» контракт.",
      "Композиция > наследование, кроме случаев, когда наследование действительно проще.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "s1-f1",
      title: "Кооперативный super",
      description: "Закрой кооперативную цепочку через super().",
      code:
        "class A:\n" +
        "    def hello(self):\n" +
        "        print(\"A\")\n\n" +
        "class B(A):\n" +
        "    def hello(self):\n" +
        "        print(\"B\")\n" +
        "        {{0}}().hello()\n\n" +
        "class C(A):\n" +
        "    def hello(self):\n" +
        "        print(\"C\")\n" +
        "        {{0}}().hello()\n\n" +
        "class D(B, C):\n" +
        "    def hello(self):\n" +
        "        print(\"D\")\n" +
        "        {{0}}().hello()\n\n" +
        "D().hello()\n" +
        "print([c.__name__ for c in D.{{1}}])",
      answers: [["super"], ["__mro__", "mro()"]],
      hints: [
        "Функция, дающая «следующий по MRO» класс.",
        "Атрибут или метод для просмотра MRO.",
      ],
      explanation: {
        summary:
          "Когда все 4 класса вызывают super(), Python проходит D → B → C → A в строгом порядке C3.",
        keyPoints: [
          "Если убрать super() из B, цепочка остановится на B.",
          "__mro__ — кортеж классов; mro() — метод, возвращающий список.",
        ],
      },
    },
    {
      type: "fill",
      id: "s1-f2",
      title: "Абстрактный класс",
      description: "Опиши обязательный интерфейс через ABC.",
      code:
        "from abc import {{0}}, {{1}}\n\n" +
        "class Storage({{0}}):\n" +
        "    @{{1}}\n" +
        "    def save(self, data: bytes) -> None: ...\n\n" +
        "class FileStorage(Storage):\n" +
        "    def save(self, data: bytes) -> None:\n" +
        "        open(\"out.bin\", \"wb\").write(data)",
      answers: [["ABC"], ["abstractmethod"]],
      hints: [
        "Базовый класс из модуля abc.",
        "Декоратор, помечающий обязательный метод.",
      ],
      explanation: {
        summary:
          "ABC + @abstractmethod = жёсткий контракт. Storage() напрямую не создашь — только через подкласс с реализацией.",
        keyPoints: [
          "Если в FileStorage не реализовать save, его тоже нельзя создать.",
          "Это идеально для плагинов и фреймворков.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "s1-q1",
      title: "ABC vs Protocol",
      question:
        "В чём ключевая разница между abc.ABC и typing.Protocol? Кратко.",
      answers: [
        "abc — номинальный контракт через наследование, protocol — структурный по утиной типизации",
        "abc требует наследоваться, protocol проверяет совпадение методов",
        "abc — наследование, protocol — структурное соответствие без наследования",
        "abc — явное наследование, protocol — duck typing с аннотациями",
      ],
      hint: "Один требует наследования, другой нет.",
      explanation:
        "abc.ABC — номинальный контракт: подкласс должен явно наследоваться. Protocol — структурный: достаточно иметь нужные методы/атрибуты с правильными сигнатурами, наследоваться не нужно.",
    },
    {
      type: "question",
      id: "s1-q2",
      title: "Когда сломается super()",
      question:
        "В кооперативной цепочке наследования с super() — что произойдёт, если в одном из классов забыть вызвать super()?",
      answers: [
        "цепочка прервётся на этом классе и следующие методы не выполнятся",
        "вызов остановится в этом классе, остальные классы цепочки не запустятся",
        "следующие в mro методы не вызовутся",
        "цепочка разрушится в этой точке",
      ],
      hint: "Что физически происходит без super().",
      explanation:
        "super() передаёт управление следующему по MRO. Без него цепочка обрывается — классы выше по MRO просто не получат вызов. Поэтому правило: либо ВСЕ вызывают super(), либо никто.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "s1-w1",
      title: "Plugin-интерфейс через ABC",
      task:
        "Опиши абстрактный класс Plugin с двумя обязательными методами: name() возвращает str и run(payload: dict) -> dict. Сделай конкретный класс EchoPlugin, который возвращает payload неизменённым. Покажи, что Plugin() напрямую не создаётся, а EchoPlugin() — создаётся.",
      hints: [
        "from abc import ABC, abstractmethod.",
        "Два @abstractmethod: name и run.",
        "EchoPlugin реализует оба, возвращает 'echo' и payload.",
      ],
      required: ["from abc import ABC, abstractmethod", "class Plugin(ABC)", "@abstractmethod", "def name(", "def run(", "class EchoPlugin(Plugin)"],
      minLines: 12,
      explanation: {
        summary:
          "Стандартный паттерн «плагины»: абстрактный интерфейс + конкретные реализации. Архитектура многих фреймворков.",
        keyPoints: [
          "ABC заставляет реализовать всё необходимое.",
          "Тип-аннотация Plugin позволяет принимать любую конкретную реализацию.",
        ],
      },
    },
  ],
};

const s2: Round = {
  number: 2,
  title: "Senior · Дескрипторы и метаклассы",
  level: "Сложный",
  intro:
    "Дескрипторы — это магия, на которой работают свойства, методы, classmethod, staticmethod, и почти любой ORM. Метаклассы — «классы для классов». Знать обязательно для понимания фреймворков.",
  lesson: {
    title: "Дескрипторы (__get__/__set__) и type как метакласс",
    summary:
      "Как property работает изнутри, что такое data/non-data descriptor, и зачем когда-нибудь писать __metaclass__.",
    readingMinutes: 8,
    sections: [
      {
        heading: "Дескрипторы",
        tagline: "Объект, у которого определены __get__/__set__/__delete__",
        body:
          "**Дескриптор** — объект с одним или несколькими из методов:\n\n" +
          "- `__get__(self, instance, owner)` — чтение атрибута;\n" +
          "- `__set__(self, instance, value)` — присваивание;\n" +
          "- `__delete__(self, instance)` — удаление.\n\n" +
          "Если у объекта есть `__set__` или `__delete__`, он называется **data descriptor**. Иначе — **non-data**. Это влияет на приоритет: data > __dict__ инстанса > non-data.\n\n" +
          "На дескрипторах построены `property`, `classmethod`, `staticmethod`, ORM-поля (Django Model, SQLAlchemy Column).",
        code:
          "class Positive:\n" +
          "    \"\"\"Дескриптор: только положительные числа.\"\"\"\n" +
          "    def __set_name__(self, owner, name):\n" +
          "        self.private = f\"_{name}\"\n\n" +
          "    def __get__(self, instance, owner):\n" +
          "        if instance is None:\n" +
          "            return self\n" +
          "        return getattr(instance, self.private)\n\n" +
          "    def __set__(self, instance, value):\n" +
          "        if value <= 0:\n" +
          "            raise ValueError(\"должно быть > 0\")\n" +
          "        setattr(instance, self.private, value)\n\n" +
          "class Account:\n" +
          "    balance = Positive()\n\n" +
          "a = Account()\n" +
          "a.balance = 100\n" +
          "print(a.balance)        # 100\n" +
          "# a.balance = -1        # ValueError",
        keyTakeaways: [
          "Дескриптор — это «протокол» из __get__/__set__/__delete__.",
          "data descriptor (с __set__) выигрывает у инстанса; non-data — проигрывает.",
          "__set_name__ автоматически даёт имя поля — удобно.",
        ],
        pitfalls: [
          "Часто новички хранят значение прямо в `self.value` дескриптора — это разделит значение между ВСЕМИ инстансами. Храни в инстансе через setattr/getattr.",
          "Не злоупотребляй дескрипторами в обычном коде. property — обычно достаточно.",
        ],
        analogy:
          "Дескриптор — как умный замок с сенсором. Замок стоит один (class-level), но следит за каждой дверью (инстансом) отдельно. При входе (__get__) он выдаёт ключ, при выходе (__set__) — проверяет пропуск. Ошибка хранить ключ в самом замке — иначе у всех дверей будет один общий ключ.",
      },
      {
        heading: "Дескрипторы изнутри: как работает property",
        tagline: "property — это просто дескриптор, написанный на Python",
        body:
          "После изучения дескрипторов можно понять, как в CPython устроен `property`. Это не магия интерпретатора — это обычный non-data + data descriptor:\n\n" +
          "```python\n" +
          "class property:\n" +
          "    def __init__(self, fget=None, fset=None, fdel=None):\n" +
          "        self.fget, self.fset, self.fdel = fget, fset, fdel\n\n" +
          "    def __get__(self, obj, objtype=None):\n" +
          "        if obj is None: return self\n" +
          "        return self.fget(obj)\n\n" +
          "    def __set__(self, obj, value):\n" +
          "        self.fset(obj, value)\n\n" +
          "    def setter(self, fset):\n" +
          "        return type(self)(self.fget, fset, self.fdel)\n" +
          "```\n\n" +
          "Зная это, понимаешь: `@x.setter` — это вызов метода `setter()` на объекте-property, возвращающий **новый** property с сохранёнными fget и добавленным fset.\n\n" +
          "Аналогично `classmethod` и `staticmethod` — дескрипторы, только non-data (нет `__set__`). Они перехватывают `__get__` и возвращают обёртку, которая подставляет `cls` или не подставляет `self`.",
        code:
          "# Убеждаемся: classmethod тоже дескриптор\n" +
          "class Foo:\n" +
          "    @classmethod\n" +
          "    def bar(cls): pass\n\n" +
          "print(type(Foo.__dict__['bar']))   # <class 'classmethod'>\n" +
          "# Доступ через инстанс вызывает __get__ дескриптора:\n" +
          "print(Foo.bar)   # <bound method Foo.bar of <class 'Foo'>>\n\n" +
          "# functools.cached_property — тоже дескриптор!\n" +
          "from functools import cached_property\n\n" +
          "class Circle:\n" +
          "    def __init__(self, r): self.r = r\n\n" +
          "    @cached_property\n" +
          "    def area(self):\n" +
          "        print('считаем...')\n" +
          "        return 3.14159 * self.r ** 2\n\n" +
          "c = Circle(5)\n" +
          "print(c.area)   # считаем... 78.53...\n" +
          "print(c.area)   # (без 'считаем' — взято из __dict__)",
        keyTakeaways: [
          "property — обычный дескриптор, не магия. Можно прочитать его реализацию.",
          "classmethod и staticmethod — тоже дескрипторы (non-data).",
          "functools.cached_property кеширует результат в __dict__ экземпляра (обходит __get__ при повторном чтении).",
        ],
        pitfalls: [
          "cached_property не работает в классах со __slots__ (нет __dict__).",
          "cached_property не потокобезопасен без доп. синхронизации.",
        ],
        analogy:
          "@cached_property — как ресторанный шеф, который готовит блюдо только при первом заказе, а потом выдаёт с готовой тарелки. Второй раз никакой готовки — просто берёт уже лежащее в __dict__. Но если поваров двое (threads), могут оба броситься готовить одновременно.",
      },
      {
        heading: "Метаклассы",
        tagline: "Класс — это объект. Тип класса — метакласс. По умолчанию — type.",
        body:
          "В Python ВСЁ — объект, в том числе классы. У объекта есть тип; у класса тип называется **метаклассом**. По умолчанию — `type`.\n\n" +
          "`type(name, bases, namespace)` — это конструктор класса. `class X: ...` — синтаксический сахар для вызова type.\n\n" +
          "Свой метакласс позволяет:\n\n" +
          "- автоматически регистрировать классы;\n" +
          "- проверять структуру при определении класса (валидация);\n" +
          "- модифицировать поля/методы прежде, чем класс будет создан.\n\n" +
          "Это магия, на которой построены ORM (Django Model, SQLAlchemy declarative_base), сериализаторы, RPC-фреймворки.\n\n" +
          "Сейчас часто можно обойтись `__init_subclass__` — это менее мощный, но проще для понимания механизм.",
        code:
          "class AutoRegister(type):\n" +
          "    registry: list[type] = []\n" +
          "    def __new__(mcs, name, bases, ns):\n" +
          "        cls = super().__new__(mcs, name, bases, ns)\n" +
          "        if name != \"Plugin\":\n" +
          "            mcs.registry.append(cls)\n" +
          "        return cls\n\n" +
          "class Plugin(metaclass=AutoRegister): ...\n" +
          "class A(Plugin): ...\n" +
          "class B(Plugin): ...\n\n" +
          "print(AutoRegister.registry)\n" +
          "# [<class 'A'>, <class 'B'>]\n\n" +
          "# То же самое современнее — через __init_subclass__\n" +
          "class Plugin2:\n" +
          "    registry: list[type] = []\n" +
          "    def __init_subclass__(cls, **kw):\n" +
          "        super().__init_subclass__(**kw)\n" +
          "        Plugin2.registry.append(cls)",
        keyTakeaways: [
          "Класс — это экземпляр своего метакласса (по умолчанию type).",
          "metaclass=Mcs позволяет управлять созданием классов.",
          "__init_subclass__ — современный лёгкий способ отслеживать наследников.",
        ],
        pitfalls: [
          "Метаклассы — мощно и сложно. По правилу: если не уверен, что нужны метаклассы — НЕ нужны.",
          "Когда в иерархии разные метаклассы — конфликт «metaclass conflict». Лучше избегать.",
        ],
        analogy:
          "Метакласс — как завод-производитель автомобилей. Обычный класс — это чертёж модели. Метакласс — это сам завод, который решает, как строить чертежи. Изменишь завод — все новые модели получат одинаковую надстройку автоматически (например, регистрацию в реестре).",
      },
    ],
    cheatSheet: [
      "Дескриптор: __get__/__set__/__delete__. property — частный случай.",
      "data descriptor (с __set__) > __dict__ инстанса > non-data.",
      "__set_name__ автоматически даёт дескриптору имя поля.",
      "Метакласс — это тип класса. По умолчанию type.",
      "metaclass=X в class или __init_subclass__ — для регистрации/валидации классов.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "s2-f1",
      title: "Дескриптор только-положительных",
      description: "Заверши дескриптор Positive.",
      code:
        "class Positive:\n" +
        "    def __set_name__(self, owner, name):\n" +
        "        self.private = f\"_{name}\"\n\n" +
        "    def __get__(self, inst, owner):\n" +
        "        if inst is None: return self\n" +
        "        return {{0}}(inst, self.private)\n\n" +
        "    def __set__(self, inst, value):\n" +
        "        if value {{1}} 0:\n" +
        "            raise {{2}}(\"must be > 0\")\n" +
        "        setattr(inst, self.private, value)",
      answers: [["getattr"], ["<="], ["ValueError"]],
      hints: [
        "Функция универсального чтения атрибута по строке.",
        "Условие «не положительное».",
        "Какое исключение бросают при некорректном значении.",
      ],
      explanation: {
        summary:
          "Стандартная пара getattr/setattr — единственно правильный способ хранить значение в инстансе, а не в дескрипторе.",
        keyPoints: [
          "Хранение в self.private поделит значение между инстансами — это баг.",
          "ValueError — стандартное исключение для некорректных значений.",
        ],
      },
    },
    {
      type: "fill",
      id: "s2-f2",
      title: "Регистрация наследников через __init_subclass__",
      description: "Заверши лёгкий «реестр» классов.",
      code:
        "class Plugin:\n" +
        "    registry: list[type] = []\n\n" +
        "    def __init_subclass__(cls, **kw):\n" +
        "        {{0}}().__init_subclass__(**kw)\n" +
        "        Plugin.registry.{{1}}(cls)\n\n" +
        "class A(Plugin): ...\n" +
        "class B(Plugin): ...\n" +
        "print(len(Plugin.{{2}}))   # 2",
      answers: [["super"], ["append"], ["registry"]],
      hints: [
        "Чтобы поддержать кооперативное наследование.",
        "Добавить в список.",
        "Имя поля-реестра в Plugin.",
      ],
      explanation: {
        summary:
          "__init_subclass__ выполняется ОДИН раз при создании каждого подкласса. Гораздо проще для понимания, чем метакласс, и решает 80% задач регистрации.",
        keyPoints: [
          "super().__init_subclass__(**kw) — обязателен для совместимости.",
          "**kw нужен, потому что подклассы могут передавать аргументы класса.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "s2-q1",
      title: "Что такое метакласс?",
      question:
        "Что такое метакласс в Python? Кратко.",
      answers: [
        "класс, экземплярами которого являются классы",
        "класс, чьи экземпляры — это сами классы",
        "тип класса, по умолчанию type",
        "класс для классов, по умолчанию type",
      ],
      hint: "Если класс — это объект, то его тип — это…?",
      explanation:
        "Метакласс — это «класс для классов». Сам класс является его экземпляром. По умолчанию метакласс всех классов — `type`.",
    },
    {
      type: "question",
      id: "s2-q2",
      title: "На чём основана property?",
      question:
        "Какой механизм Python лежит в основе property и встроенных classmethod/staticmethod?",
      answers: [
        "дескрипторы",
        "протокол дескрипторов",
        "дескрипторы (descriptor protocol)",
        "descriptor protocol",
      ],
      hint: "__get__/__set__.",
      explanation:
        "property — это data descriptor с реализованными __get__ и __set__. classmethod/staticmethod — non-data descriptors. На том же протоколе строятся поля ORM.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "s2-w1",
      title: "Дескриптор Range",
      task:
        "Напиши дескриптор Range(lo, hi), который при присваивании проверяет, что значение в [lo, hi]. Используй __set_name__ для имени, getattr/setattr для хранения, и ValueError при выходе за пределы. Покажи на классе Sensor с полем temperature = Range(-50, 50).",
      hints: [
        "class Range: def __init__(self, lo, hi).",
        "__set_name__, __get__, __set__ через getattr/setattr.",
        "Бросай ValueError(f\"...\") если value не в диапазоне.",
      ],
      required: ["class Range", "def __init__(", "def __set_name__(", "def __get__(", "def __set__(", "raise ValueError"],
      minLines: 14,
      explanation: {
        summary:
          "Дескриптор-валидатор — типовой кейс для DTO, ORM и конфигов.",
        keyPoints: [
          "__set_name__ — современный способ узнать имя поля.",
          "Хранение в инстансе через getattr/setattr — единственно правильное.",
        ],
      },
    },
  ],
};

const s3: Round = {
  number: 3,
  title: "Senior · Многопоточность, GIL и multiprocessing",
  level: "Сложный",
  intro:
    "У CPython есть GIL — глобальная блокировка интерпретатора. Из-за неё чистые python-потоки не дают параллельного CPU. Зато прекрасно ускоряют I/O. Для CPU-задач — multiprocessing.",
  lesson: {
    title: "GIL, threading, multiprocessing, ThreadPoolExecutor",
    summary:
      "Чем потоки отличаются от процессов в Python; когда брать threading, когда multiprocessing; concurrent.futures как удобный фасад.",
    readingMinutes: 7,
    sections: [
      {
        heading: "GIL и threading",
        tagline: "Потоки полезны для I/O, бесполезны для тяжёлого CPU",
        body:
          "**GIL (Global Interpreter Lock)** — это мьютекс в CPython, который не даёт нескольким потокам ОДНОВРЕМЕННО выполнять байткод. Поэтому даже на 8 ядрах два python-потока, считающих pi, будут идти не быстрее одного.\n\n" +
          "Зато при **I/O** (сеть, файлы, БД) GIL отпускается на время блокировки → потоки реально работают параллельно. Поэтому threading отлично подходит для:\n\n" +
          "- параллельных HTTP-запросов;\n" +
          "- параллельной работы с файлами;\n" +
          "- любых задач, где время уходит на ожидание.\n\n" +
          "Удобный фасад — `concurrent.futures.ThreadPoolExecutor`. Не надо вручную работать с Thread, join'ами и очередями.",
        code:
          "import time, requests\n" +
          "from concurrent.futures import ThreadPoolExecutor\n\n" +
          "URLS = [\"https://example.com\"] * 8\n\n" +
          "def fetch(url):\n" +
          "    return len(requests.get(url).text)\n\n" +
          "t = time.perf_counter()\n" +
          "with ThreadPoolExecutor(max_workers=8) as pool:\n" +
          "    sizes = list(pool.map(fetch, URLS))\n" +
          "print(\"sum:\", sum(sizes), \"in\", time.perf_counter() - t, \"s\")",
        keyTakeaways: [
          "GIL не даёт параллельного CPU-выполнения python-байткода.",
          "Для I/O потоки — отличное решение.",
          "ThreadPoolExecutor — современный API без ручного управления потоками.",
        ],
        pitfalls: [
          "На CPU-bound (число crunchy) потоки бесполезны или даже вредны (накладные расходы).",
          "Без блокировок shared state в потоках — гонки. Используй Lock или Queue.",
          "GIL отпускается в C-расширениях (numpy, cryptography и т.п.) — поэтому numpy-вычисления могут быть параллельны.",
        ],
        analogy:
          "GIL — как один ключ от серверной комнаты: только один человек может войти и работать одновременно. Для телефонных переговоров (I/O — ждёшь ответа) — отдай ключ пока ждёшь, не блокируй. Для вычислений (CPU) — ключ нужен всё время, поэтому второй поток стоит в очереди.",
      },
      {
        heading: "multiprocessing для CPU-bound задач",
        tagline: "Каждый процесс — свой интерпретатор и свой GIL",
        body:
          "**multiprocessing** запускает отдельные процессы; у каждого свой Python и свой GIL → реальный параллельный CPU.\n\n" +
          "Цена: запуск процессов медленнее, обмен данными идёт через pickling/IPC, нельзя так просто шарить состояние.\n\n" +
          "Удобный фасад — `concurrent.futures.ProcessPoolExecutor`. API такой же, как у ThreadPoolExecutor — поменять одно имя.\n\n" +
          "Важный момент на Windows/macOS (spawn): нужно использовать `if __name__ == \"__main__\":`, иначе процессы зациклятся, импортируя файл.",
        code:
          "from concurrent.futures import ProcessPoolExecutor\n" +
          "import math, time\n\n" +
          "def heavy(n):\n" +
          "    return sum(math.sqrt(i) for i in range(n))\n\n" +
          "if __name__ == \"__main__\":\n" +
          "    tasks = [10_000_000] * 4\n" +
          "    t = time.perf_counter()\n" +
          "    with ProcessPoolExecutor(max_workers=4) as pool:\n" +
          "        results = list(pool.map(heavy, tasks))\n" +
          "    print(\"total time:\", time.perf_counter() - t)",
        keyTakeaways: [
          "multiprocessing → реальный параллельный CPU за счёт отдельных интерпретаторов.",
          "API ProcessPoolExecutor совпадает с ThreadPoolExecutor.",
          "Без `if __name__ == '__main__':` — может быть рекурсивный запуск.",
        ],
        pitfalls: [
          "Объекты передаются через pickle — нельзя слать неподдерживаемые (lambda, локальные классы).",
          "Запуск процесса дороже потока. Для коротких задач — overhead больше пользы.",
          "Shared memory — отдельный API; не путай с шерингом памяти потоков.",
        ],
        analogy:
          "multiprocessing — как открыть четыре отдельных кафе вместо одного большого. У каждого своя касса (GIL), свои повара. Всё готовят параллельно. Минус: дороже открыть, и заказ между кафе надо передавать через посредника (pickle/IPC).",
      },
      {
        heading: "asyncio — кооперативная многозадачность",
        tagline: "async/await: один поток, много параллельных I/O операций",
        body:
          "**asyncio** — стандартная библиотека для асинхронного программирования. Один поток, но кооперативно уступающий управление при каждом `await`. Идеален для **высококонкурентного I/O**: сотни HTTP-запросов, WebSocket, БД с async-драйвером.\n\n" +
          "Ключевые концепции:\n\n" +
          "- **`async def`** — объявляет корутину (coroutine). Вызов возвращает coroutine-объект, не запускает его сразу.\n" +
          "- **`await expr`** — приостановить текущую корутину и дать event loop'у запустить другие.\n" +
          "- **`asyncio.run(main())`** — точка входа: запускает event loop с корутиной main.\n" +
          "- **`asyncio.gather(*coros)`** — запустить несколько корутин одновременно, дождаться всех.\n" +
          "- **`asyncio.create_task(coro)`** — запустить фоном, не ждать сразу.\n\n" +
          "asyncio **не ускоряет CPU-код** — только I/O. Для CPU нужны multiprocessing или C-расширения.",
        code:
          "import asyncio, time\n\n" +
          "async def fetch_data(name, delay):\n" +
          "    print(f\"{name}: начинаем\")\n" +
          "    await asyncio.sleep(delay)     # имитируем I/O (сеть, БД)\n" +
          "    print(f\"{name}: готово\")\n" +
          "    return f\"данные-{name}\"\n\n" +
          "async def main():\n" +
          "    t = time.perf_counter()\n" +
          "    # Параллельно! Суммарно ~1с, не 1+2+3=6с\n" +
          "    results = await asyncio.gather(\n" +
          "        fetch_data(\"A\", 1),\n" +
          "        fetch_data(\"B\", 2),\n" +
          "        fetch_data(\"C\", 3),\n" +
          "    )\n" +
          "    print(f\"Done in {time.perf_counter()-t:.2f}s:\", results)\n\n" +
          "asyncio.run(main())\n" +
          "# Done in ~3.0s: ['данные-A', 'данные-B', 'данные-C']",
        keyTakeaways: [
          "asyncio — один поток, кооперативная многозадачность через await.",
          "asyncio.gather — запустить несколько корутин параллельно.",
          "asyncio лучше threads для высококонкурентного I/O (сотни соединений).",
        ],
        pitfalls: [
          "Нельзя использовать обычные блокирующие функции (requests, time.sleep) внутри async. Нужны aiohttp, asyncio.sleep и т.п.",
          "asyncio.run() нельзя вызывать внутри уже работающего event loop'а (например, в Jupyter).",
          "Ошибки в coroutine часто тихие, если Task не awaited — всегда проверяй результаты.",
        ],
        analogy:
          "asyncio — как официант в ресторане. Один человек, но берёт заказ у стола A, идёт к стойке, пока ждёт — берёт заказ у стола B, возвращается к A. `await` — это «иди пока к другому столу, я позвоню». CPU при этом не простаивает — он всё время работает, только переключается между задачами.",
      },
    ],
    cheatSheet: [
      "GIL → один поток в момент времени для python-байткода.",
      "I/O-bound → threading / ThreadPoolExecutor.",
      "CPU-bound → multiprocessing / ProcessPoolExecutor.",
      "concurrent.futures.Executor.map / .submit / Future.result().",
      "На Windows/macOS — обязательно if __name__ == '__main__': для процессов.",
      "asyncio: async def, await, asyncio.gather, asyncio.run — один поток много I/O.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "s3-f1",
      title: "ThreadPoolExecutor для I/O",
      description: "Замени sequential на параллельные HTTP-запросы.",
      code:
        "from concurrent.futures import {{0}}\n" +
        "import requests\n\n" +
        "def fetch(url):\n" +
        "    return len(requests.get(url).text)\n\n" +
        "urls = [\"https://example.com\"] * 4\n\n" +
        "with {{0}}(max_workers={{1}}) as pool:\n" +
        "    sizes = list(pool.{{2}}(fetch, urls))\n\n" +
        "print(sum(sizes))",
      answers: [["ThreadPoolExecutor"], ["4"], ["map"]],
      hints: [
        "Класс пула потоков из concurrent.futures.",
        "Сколько потоков нужно для 4 URL.",
        "Метод, аналогичный встроенной map.",
      ],
      explanation: {
        summary:
          "Самый удобный путь к параллельному I/O — ThreadPoolExecutor + map. Никаких ручных Thread/join.",
        keyPoints: [
          "max_workers ≈ числу одновременных I/O.",
          "pool.map сохраняет порядок результатов.",
        ],
      },
    },
    {
      type: "fill",
      id: "s3-f2",
      title: "ProcessPool для CPU",
      description: "Используй процессы для тяжёлых вычислений.",
      code:
        "from concurrent.futures import {{0}}\n\n" +
        "def heavy(n):\n" +
        "    return sum(i * i for i in range(n))\n\n" +
        "if __name__ == \"{{1}}\":\n" +
        "    with {{0}}(max_workers=4) as pool:\n" +
        "        result = list(pool.map(heavy, [1_000_000] * 4))\n" +
        "    print(sum(result))",
      answers: [["ProcessPoolExecutor"], ["__main__"]],
      hints: [
        "Аналог ThreadPoolExecutor для процессов.",
        "Имя точки входа.",
      ],
      explanation: {
        summary:
          "ProcessPoolExecutor выглядит как ThreadPoolExecutor, но реально использует процессы — обходит GIL для CPU-задач.",
        keyPoints: [
          "Защита `if __name__ == '__main__':` — критична для spawn-стратегии.",
          "Передаваемые функции и аргументы должны быть pickle-able.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "s3-q1",
      title: "Что такое GIL?",
      question:
        "Что такое GIL в CPython и какие задачи он ограничивает?",
      answers: [
        "глобальный мьютекс, не дающий нескольким потокам выполнять байткод одновременно — ограничивает cpu-bound",
        "global interpreter lock — мешает параллельному cpu выполнению на чистом python",
        "блокировка интерпретатора, ограничивающая cpu-параллелизм",
        "global interpreter lock, мешает cpu-параллельности",
      ],
      hint: "Что он защищает и от чего страдает.",
      explanation:
        "GIL — Global Interpreter Lock — позволяет только одному потоку выполнять python-байткод в каждый момент. Это ограничивает CPU-bound задачи (выполнение чистого Python), но почти не влияет на I/O-bound (сеть, файлы) и нативные расширения.",
    },
    {
      type: "question",
      id: "s3-q2",
      title: "Когда threading, когда multiprocessing",
      question:
        "Какую модель параллелизма выбрать для задачи: «скачать 100 страниц по сети», и какую — для «посчитать pi с миллиардом итераций»?",
      answers: [
        "сеть — threading, pi — multiprocessing",
        "i/o — потоки, тяжёлый cpu — процессы",
        "скачивание — threading, расчёт — multiprocessing",
        "потоки для скачивания, процессы для счёта",
      ],
      hint: "I/O vs CPU.",
      explanation:
        "I/O-задачи (сеть) — threading: ожидание GIL отпускает, потоки реально параллельны. CPU-bound (pi) — multiprocessing: каждый процесс имеет свой GIL и реально использует ядра.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "s3-w1",
      title: "Параллельные square через ThreadPool",
      task:
        "Возьми список из 8 чисел, и через ThreadPoolExecutor.map посчитай их квадраты, затем напечатай их сумму. Используй concurrent.futures и время выполнения через time.perf_counter.",
      hints: [
        "from concurrent.futures import ThreadPoolExecutor.",
        "def square(n): return n*n.",
        "with ThreadPoolExecutor(max_workers=8) as pool: results = list(pool.map(square, nums)).",
      ],
      required: ["from concurrent.futures import", "ThreadPoolExecutor", "max_workers", "pool.map(", "time.perf_counter()", "print("],
      minLines: 8,
      explanation: {
        summary:
          "Это «hello world» concurrent.futures. Несмотря на то, что для square потоки не помогут (CPU + GIL), синтаксис нужно знать на автомате.",
        keyPoints: [
          "ThreadPoolExecutor.map сохраняет порядок.",
          "with-блок ждёт завершения всех задач при выходе.",
        ],
      },
    },
  ],
};

const s4: Round = {
  number: 4,
  title: "Senior · Asyncio: async/await, корутины и циклы событий",
  level: "Сложный",
  intro:
    "asyncio — параллелизм через кооперативные корутины и единый цикл событий. Огромное преимущество для тысяч параллельных I/O без накладных расходов потоков.",
  lesson: {
    title: "Корутины, event loop, asyncio.gather, async with",
    summary:
      "async def, await, gather, asyncio.run, async iteration; почему нельзя смешивать с блокирующим I/O в основном потоке.",
    readingMinutes: 8,
    sections: [
      {
        heading: "Базовый asyncio",
        tagline: "asyncio.run(main()) — единая точка входа",
        body:
          "**Корутина** — функция с `async def`. При вызове она возвращает корутину-объект, а НЕ результат. Чтобы получить результат — `await coro` (внутри другой корутины) или `asyncio.run(coro)` (на верхнем уровне программы).\n\n" +
          "**Event loop** управляет тем, какая корутина выполняется. Когда одна корутина await-ит I/O, цикл переключается на другую — без затрат на потоки/процессы.\n\n" +
          "Параллельный запуск — `asyncio.gather(coro1, coro2, ...)`. Можно `asyncio.create_task(coro)` для фонового запуска.\n\n" +
          "**Контекстный менеджер с async** — `async with`. **Итерация** — `async for`. Это всё нужно для асинхронных библиотек (httpx, asyncpg, aiofiles).",
        code:
          "import asyncio\n" +
          "import time\n\n" +
          "async def fetch(name, delay):\n" +
          "    print(f\"{name}: start\")\n" +
          "    await asyncio.sleep(delay)\n" +
          "    print(f\"{name}: done in {delay}s\")\n" +
          "    return name\n\n" +
          "async def main():\n" +
          "    t = time.perf_counter()\n" +
          "    results = await asyncio.gather(\n" +
          "        fetch(\"a\", 2),\n" +
          "        fetch(\"b\", 1),\n" +
          "        fetch(\"c\", 3),\n" +
          "    )\n" +
          "    print(results, \"in\", time.perf_counter() - t, \"s\")\n\n" +
          "asyncio.run(main())\n" +
          "# main завершится за ~3s, не 6",
        keyTakeaways: [
          "async def → корутина; await — точка переключения.",
          "asyncio.run(main()) — стандартная точка входа.",
          "asyncio.gather(*coros) — параллельно ждать многих.",
          "async with / async for — для асинхронных контекстных менеджеров и итераторов.",
        ],
        pitfalls: [
          "Просто вызвать `coro()` без await — НИЧЕГО не произойдёт, ты получишь объект-корутину и предупреждение «coroutine was never awaited».",
          "Блокирующий вызов внутри корутины блокирует ВСЁ. Никаких time.sleep, requests.get, открытий больших файлов синхронно.",
          "Никогда не вызывай asyncio.run внутри уже запущенного цикла (например, в Jupyter).",
        ],
        analogy:
          "Корутина без await — как письмо, которое ты написал, но не отправил. Оно лежит как объект и ждёт. `await` — это опустить в почтовый ящик. `asyncio.run` — это запустить почтовую службу.",
      },
      {
        heading: "asyncio для I/O — главный кейс",
        tagline: "Тысячи параллельных запросов на одном потоке",
        body:
          "asyncio выигрывает у threading на массовых I/O: один поток + цикл событий обслуживает тысячи соединений без context-switch'ей. Это идеально для:\n\n" +
          "- HTTP-клиентов (httpx, aiohttp);\n" +
          "- БД (asyncpg, motor для MongoDB);\n" +
          "- веб-серверов (FastAPI, aiohttp.web, Starlette).\n\n" +
          "**Не годится** для CPU-задач — корутина не отдаёт управление, пока не сделает await. Длинная синхронная вычислительная функция «застопорит» цикл.\n\n" +
          "**Защита от долгих задач** — `asyncio.wait_for(coro, timeout=N)`. Если не уложился — `asyncio.TimeoutError`.\n\n" +
          "**Cancel** — `task.cancel()` посылает CancelledError. Внутри корутины можно поймать и аккуратно завершиться.",
        code:
          "import asyncio\n\n" +
          "async def slow(name):\n" +
          "    try:\n" +
          "        await asyncio.sleep(10)\n" +
          "        return f\"{name} done\"\n" +
          "    except asyncio.CancelledError:\n" +
          "        print(f\"{name} cancelled\")\n" +
          "        raise\n\n" +
          "async def main():\n" +
          "    task = asyncio.create_task(slow(\"a\"))\n" +
          "    await asyncio.sleep(1)\n" +
          "    task.cancel()\n" +
          "    try:\n" +
          "        await task\n" +
          "    except asyncio.CancelledError:\n" +
          "        print(\"task cancelled\")\n\n" +
          "    # Тайм-аут\n" +
          "    try:\n" +
          "        await asyncio.wait_for(slow(\"b\"), timeout=2)\n" +
          "    except asyncio.TimeoutError:\n" +
          "        print(\"timeout\")\n\n" +
          "asyncio.run(main())",
        keyTakeaways: [
          "asyncio = массовый I/O без затрат на потоки.",
          "asyncio.wait_for — таймауты; task.cancel — отмена.",
          "Внутри корутины не используй блокирующий I/O.",
        ],
        pitfalls: [
          "Смешивание sync и async кода без обёртки (run_in_executor) — типичная ловушка.",
          "Корутина без await не выполняется. await забывают чаще всего.",
          "В FastAPI/aiohttp — обработчики async, но если внутри ты вызываешь синхронный requests, ты убил весь сервер.",
        ],
        analogy:
          "asyncio.wait_for — как будильник: ставишь задачу и таймер. Если задача не успела за N секунд — будильник срабатывает (TimeoutError). task.cancel — это вручную выключить будильник досрочно.",
      },
    ],
    cheatSheet: [
      "async def → корутина; await coro → значение.",
      "asyncio.run(main()) — точка входа.",
      "asyncio.gather(*coros) — параллельный запуск.",
      "asyncio.create_task — фон; asyncio.wait_for(coro, timeout) — таймаут.",
      "Внутри корутин запрещено блокирующее I/O.",
      "Для I/O — async библиотеки: httpx, aiohttp, asyncpg, aiofiles.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "s4-f1",
      title: "asyncio.run и gather",
      description: "Запусти три корутины параллельно.",
      code:
        "import asyncio\n\n" +
        "async def task(name, t):\n" +
        "    await asyncio.{{0}}(t)\n" +
        "    return name\n\n" +
        "async def main():\n" +
        "    return await asyncio.{{1}}(\n" +
        "        task(\"a\", 1),\n" +
        "        task(\"b\", 2),\n" +
        "        task(\"c\", 1),\n" +
        "    )\n\n" +
        "print(asyncio.{{2}}(main()))",
      answers: [["sleep"], ["gather"], ["run"]],
      hints: [
        "Асинхронный аналог time.sleep — обязательно с await.",
        "Объединить несколько корутин в параллельный запуск.",
        "Точка входа в асинхронную программу.",
      ],
      explanation: {
        summary:
          "Каноничное трио: asyncio.sleep, asyncio.gather, asyncio.run. Знать на автомате.",
        keyPoints: [
          "asyncio.sleep НЕ блокирует event loop.",
          "gather собирает результаты в списке порядке аргументов.",
          "asyncio.run создаёт цикл и закрывает его.",
        ],
      },
    },
    {
      type: "fill",
      id: "s4-f2",
      title: "Таймаут на корутину",
      description: "Защити медленную операцию таймаутом.",
      code:
        "import asyncio\n\n" +
        "async def slow():\n" +
        "    await asyncio.sleep(5)\n" +
        "    return \"ok\"\n\n" +
        "async def main():\n" +
        "    try:\n" +
        "        return await asyncio.{{0}}(slow(), timeout=1)\n" +
        "    except asyncio.{{1}}:\n" +
        "        return \"timeout!\"\n\n" +
        "print(asyncio.run(main()))   # timeout!",
      answers: [["wait_for"], ["TimeoutError"]],
      hints: [
        "Функция, оборачивающая корутину в таймаут.",
        "Какое исключение бросается при истечении таймаута.",
      ],
      explanation: {
        summary:
          "asyncio.wait_for + asyncio.TimeoutError — стандартный способ защититься от висящих I/O.",
        keyPoints: [
          "wait_for сам отменит задачу при таймауте.",
          "В Python 3.11+ есть TaskGroup и asyncio.timeout — современнее.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "s4-q1",
      title: "Корутина без await",
      question:
        "Что произойдёт, если вызвать корутину coro() без await и без передачи в asyncio?",
      answers: [
        "ничего не выполнится, будет предупреждение coroutine was never awaited",
        "корутина не запустится, выйдет warning",
        "функция не выполнится, python предупредит about not-awaited coroutine",
        "вернётся объект-корутина, а тело не запустится",
      ],
      hint: "Корутина — это объект, а не вызов.",
      explanation:
        "coro() возвращает объект-корутину, но не запускает её тело. Без await или передачи в loop она никогда не выполнится — Python выдаст RuntimeWarning «coroutine was never awaited».",
    },
    {
      type: "question",
      id: "s4-q2",
      title: "Что нельзя в корутине",
      question:
        "Какой тип кода нельзя вызывать внутри async-функции, чтобы не сломать event loop?",
      answers: [
        "блокирующий синхронный i/o",
        "блокирующие синхронные вызовы",
        "блокирующие операции вроде time.sleep, requests.get",
        "длинные блокирующие синхронные операции",
      ],
      hint: "Что мешает циклу переключиться на другие задачи.",
      explanation:
        "Любые блокирующие синхронные вызовы (time.sleep, requests.get, file IO) останавливают весь event loop. Используй асинхронные аналоги (asyncio.sleep, httpx.AsyncClient, aiofiles) или run_in_executor.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "s4-w1",
      title: "Параллельные «запросы» через asyncio",
      task:
        "Напиши асинхронную программу, которая через asyncio.gather запускает 3 «запроса» — каждая корутина просто делает asyncio.sleep(1) и возвращает свой номер. Замерь общее время через time.perf_counter и убедись, что оно ~1с, а не 3с.",
      hints: [
        "import asyncio, time.",
        "async def task(i): await asyncio.sleep(1); return i.",
        "asyncio.gather(task(1), task(2), task(3)).",
      ],
      required: ["import asyncio", "async def", "await asyncio.sleep", "asyncio.gather(", "asyncio.run(", "time.perf_counter()"],
      minLines: 10,
      explanation: {
        summary:
          "Канонический «hello async». Демонстрирует, как gather превращает 3×1с в 1с общего времени.",
        keyPoints: [
          "gather — параллельная связка, не sequential.",
          "asyncio.run — точка входа без явных циклов.",
        ],
      },
    },
  ],
};

const s5: Round = {
  number: 5,
  title: "Senior · Профилирование и оптимизация",
  level: "Сложный",
  intro:
    "Перед тем как оптимизировать — измерь. Учим cProfile, timeit, memory_profiler и базовые правила оптимизации (дешёвые алгоритмы > быстрого C). Наизусть: «преждевременная оптимизация — корень всех зол».",
  lesson: {
    title: "Измеряем правильно: cProfile, timeit, tracemalloc",
    summary:
      "Когда какой инструмент брать; почему важна сложность алгоритма; что даёт мемоизация и векторизация.",
    readingMinutes: 7,
    sections: [
      {
        heading: "Тайминг и профилирование",
        tagline: "Сначала измерь, потом оптимизируй",
        body:
          "**`time.perf_counter()`** — высокоточный таймер реального времени. Стандарт для замера кусков кода.\n\n" +
          "**`timeit`** — модуль и магия для микробенчмарков. Запускает код много раз и усредняет, исключая шум:\n\n" +
          "```\n" +
          "from timeit import timeit\n" +
          "timeit(\"sum(range(1000))\", number=10_000)\n" +
          "```\n\n" +
          "**`cProfile`** — встроенный профилировщик: показывает, сколько времени потрачено в каждой функции и сколько раз она вызвана:\n\n" +
          "```\n" +
          "python -m cProfile -s cumulative my_script.py\n" +
          "```\n\n" +
          "Можно из кода: `cProfile.run(\"main()\", sort=\"cumulative\")`.\n\n" +
          "**`tracemalloc`** — стандартный трекер памяти. Показывает, кто и сколько аллоцирует.",
        code:
          "import cProfile, pstats, io\n\n" +
          "def heavy():\n" +
          "    return sum(i * i for i in range(10_000_000))\n\n" +
          "buf = io.StringIO()\n" +
          "pr = cProfile.Profile()\n" +
          "pr.enable()\n" +
          "heavy()\n" +
          "pr.disable()\n\n" +
          "stats = pstats.Stats(pr, stream=buf).sort_stats(\"cumulative\")\n" +
          "stats.print_stats(5)\n" +
          "print(buf.getvalue())",
        keyTakeaways: [
          "perf_counter — для куска кода; timeit — для микробенчмарков; cProfile — для целой программы.",
          "Профилируй на реальных данных, не на toy.",
          "Графический вид — snakeviz: `pip install snakeviz`, потом `snakeviz profile.out`.",
        ],
        pitfalls: [
          "time.time() не подходит для замеров — менее точный.",
          "Микробенчмарки часто «оптимизируют» то, что не было узким местом.",
          "Запуск под профайлером сам замедляет код — относительные числа важнее абсолютных.",
        ],
        analogy:
          "cProfile — как видеозапись рабочего дня: потом смотришь, на что ушло больше всего времени. timeit — как хронометраж одного движения на конвейере. Оптимизировать без замеров — как переставлять мебель вслепую.",
      },
      {
        heading: "Алгоритм > микро-оптимизация",
        tagline: "O(n) обычно бьёт любую крутую перепись на C",
        body:
          "Главный принцип: **сначала улучшай сложность, потом константу**.\n\n" +
          "Классические «бесплатные» победы:\n\n" +
          "- `x in list` — O(n); `x in set/dict` — O(1). Замена списка на set часто даёт x100.\n" +
          "- Накопление через `s + ch` в цикле — O(n²). Используй `''.join(parts)` или io.StringIO — O(n).\n" +
          "- В горячих циклах — кэшируй атрибуты в локальные переменные, замени `obj.method(x)` на сохранённый method.\n" +
          "- Для числовых массивов — **NumPy** (векторные операции в C). Часто x50-x500.\n" +
          "- Для повторных вычислений — `@functools.lru_cache`. Бесплатное ускорение, если функция чистая.\n\n" +
          "После всего — если всё ещё медленно: **C-расширения** (Cython, mypyc), **ProcessPool**, **переход на PyPy**.",
        code:
          "# До: O(n) на каждом in-проверке → O(n*m) суммарно\n" +
          "needles = [...]\n" +
          "haystack = [...]\n" +
          "found = [n for n in needles if n in haystack]   # МЕДЛЕННО\n\n" +
          "# После: in работает за O(1)\n" +
          "haystack_set = set(haystack)\n" +
          "found = [n for n in needles if n in haystack_set]  # ОБЫЧНО x100+\n\n" +
          "# До: квадратичная склейка строк\n" +
          "result = \"\"\n" +
          "for ch in items:\n" +
          "    result += ch                  # O(n^2)\n\n" +
          "# После: линейный join\n" +
          "result = \"\".join(items)           # O(n)",
        keyTakeaways: [
          "Алгоритмическая сложность бьёт почти любую микро-оптимизацию.",
          "list-in → set-in: топ-1 «бесплатное» ускорение.",
          "join вместо +=, lru_cache для повторов, NumPy для чисел.",
        ],
        pitfalls: [
          "Преждевременная оптимизация — корень зол. Сначала измерь.",
          "Иногда «быстрый C» на самом деле медленный из-за накладных расходов вызова.",
          "Не путай память и время — иногда оптимизация одного ухудшает другое.",
        ],
        analogy:
          "Оптимизировать O(n²) до O(n) — как заменить пешую прогулку самолётом. Потом уже можно выбрать более удобное кресло (микро-оптимизация). Но начать с кресла, оставаясь пешком, — потеря времени.",
      },
    ],
    cheatSheet: [
      "time.perf_counter() — точный таймер; timeit для микробенчмарков; cProfile для всей программы.",
      "tracemalloc — память; snakeviz — визуализация cProfile.",
      "x in list O(n) → x in set O(1).",
      "''.join(parts) вместо += в цикле.",
      "@lru_cache — мемоизация чистых функций.",
      "Сначала измерь — только потом оптимизируй.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "s5-f1",
      title: "list → set ускорение",
      description: "Замени контейнер для O(1) поиска.",
      code:
        "needles = list(range(1000))\n" +
        "haystack = list(range(100_000))\n\n" +
        "# До: x in list — O(n)\n" +
        "# После:\n" +
        "haystack_{{0}} = {{0}}(haystack)\n" +
        "found = [n for n in needles {{1}} n in haystack_{{0}}]\n" +
        "print(len(found))",
      answers: [["set"], ["if"]],
      hints: [
        "Тип, у которого in работает за O(1).",
        "Ключевое слово фильтра в comprehension.",
      ],
      explanation: {
        summary:
          "Самое известное ускорение: вместо «найти в списке» делаем «найти в множестве». Часто 100× быстрее.",
        keyPoints: [
          "set хеширует элементы → in за константу.",
          "Конструкция стоит O(n), но окупается уже при m > log n проверках.",
        ],
      },
    },
    {
      type: "fill",
      id: "s5-f2",
      title: "join вместо += в цикле",
      description: "Сделай склейку строк линейной.",
      code:
        "items = [\"a\", \"b\", \"c\", \"d\", \"e\"]\n\n" +
        "# Плохо:\n" +
        "# r = \"\"\n" +
        "# for s in items:\n" +
        "#     r += s\n\n" +
        "# Хорошо:\n" +
        "r = \"{{0}}\".{{1}}(items)\n" +
        "print(r)   # 'abcde'",
      answers: [[""], ["join"]],
      hints: [
        "Какой разделитель — ничего не вставлять.",
        "Метод строки, склеивающий список строк.",
      ],
      explanation: {
        summary:
          "''.join(seq) делает один проход и одно выделение памяти. += в цикле — каждый шаг копирует всю строку.",
        keyPoints: [
          "Это эталонный случай «алгоритм > микро-оптимизация»: O(n) vs O(n²).",
          "join — метод РАЗДЕЛИТЕЛЯ, не списка.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "s5-q1",
      title: "Какой инструмент для микробенчмарка",
      question:
        "Какой стандартный модуль/функция Python нужен, чтобы корректно измерить время короткого кусочка кода (микробенчмарк), запуская его много раз и усредняя?",
      answers: ["timeit", "модуль timeit", "timeit.timeit"],
      hint: "Имя совпадает с глаголом «time it».",
      explanation:
        "timeit — встроенный модуль для микробенчмарков. Запускает код N раз, исключая накладные расходы и шум одиночного запуска.",
    },
    {
      type: "question",
      id: "s5-q2",
      title: "Сложность in для list и set",
      question:
        "Какова сложность операции `x in container` для list и для set/dict?",
      answers: [
        "list o(n), set/dict o(1)",
        "list — линейная o(n), set — константная o(1)",
        "list — o(n), dict и set — o(1) в среднем",
        "list o(n), set o(1)",
      ],
      hint: "Линейная для одного, константная для другого.",
      explanation:
        "Для list проверка `in` — линейная O(n) (последовательный просмотр). Для set и dict — O(1) в среднем благодаря хешированию.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "s5-w1",
      title: "timeit микробенчмарк",
      task:
        "С помощью модуля timeit сравни две версии: 'sum([i*i for i in range(1000)])' (с list) и 'sum(i*i for i in range(1000))' (с генератором). Запусти каждую 10000 раз через timeit.timeit и напечатай оба результата.",
      hints: [
        "from timeit import timeit.",
        "t1 = timeit('sum([i*i for i in range(1000)])', number=10_000).",
        "Напечатай оба.",
      ],
      required: ["from timeit import timeit", "timeit(", "number=", "print("],
      minLines: 5,
      explanation: {
        summary:
          "Учимся аккуратно мерить две версии. Здесь генераторное выражение часто ЧУТЬ медленнее в sum, потому что список даёт компактные операции, но память хуже. Главное — мерить, а не угадывать.",
        keyPoints: [
          "timeit.timeit принимает строку или callable.",
          "number — сколько повторений; результат — общее время.",
        ],
      },
    },
  ],
};

const s6: Round = {
  number: 6,
  title: "Senior · Тестирование (pytest)",
  level: "Сложный",
  intro:
    "Зрелый разработчик пишет тесты не «после», а вместе с кодом. Учим pytest: как запускать, фикстуры, параметризация, моки. Это страховка от багов и подушка при рефакторинге.",
  lesson: {
    title: "pytest, fixtures, parametrize, monkeypatch",
    summary:
      "Базовый синтаксис теста, фикстуры для подготовки данных, parametrize для табличных тестов, monkeypatch и pytest.raises.",
    readingMinutes: 7,
    sections: [
      {
        heading: "Тесты в pytest",
        tagline: "Файл test_*.py, функция test_*, assert как обычный assert",
        body:
          "Стандартный test discovery в pytest: файлы вида `test_*.py` или `*_test.py`, функции `test_*`, классы `Test*`. Простой `assert` хватает — никакого `assertEqual`.\n\n" +
          "Запуск: `pytest` или `pytest tests/test_one.py::test_func`. Полезные флаги: `-v` (verbose), `-x` (остановиться на первой ошибке), `-k expr` (запустить тесты с подходящим именем), `--maxfail=N`, `--lf` (last-failed).\n\n" +
          "**`pytest.raises`** — контекстный менеджер для проверки исключений.",
        code:
          "import pytest\n\n" +
          "def divide(a, b):\n" +
          "    if b == 0:\n" +
          "        raise ValueError(\"div by zero\")\n" +
          "    return a / b\n\n" +
          "def test_divide_normal():\n" +
          "    assert divide(10, 2) == 5\n\n" +
          "def test_divide_by_zero():\n" +
          "    with pytest.raises(ValueError, match=\"div by zero\"):\n" +
          "        divide(10, 0)",
        keyTakeaways: [
          "Стандартный `assert` — pytest умеет печатать понятный diff.",
          "pytest.raises(ExpectedException) — стандарт для негативных тестов.",
          "match=\"...\" — регекс для проверки сообщения исключения.",
        ],
        pitfalls: [
          "assert в проде с флагом -O будет вырезан. В тестах — не страшно, но не полагайся на assert как на runtime-валидацию.",
          "Не пиши логику в тестовом файле, не относящуюся к тестам. Это путает.",
        ],
        analogy:
          "Тест — как технический осмотр автомобиля перед выездом. pytest.raises — как специально нажать педаль тормоза, чтобы убедиться: она срабатывает, а не молчит. Без тестов — едешь и надеешься, что всё хорошо.",
      },
      {
        heading: "Фикстуры, параметризация и monkeypatch",
        tagline: "Фикстура — переиспользуемое «подготовь данные»",
        body:
          "**Фикстура** — функция с `@pytest.fixture`, возвращающая объект (или генератор для очистки). Тест получает её, объявляя одноимённый параметр.\n\n" +
          "Скоупы фикстуры: `function` (по умолчанию), `class`, `module`, `session`. Меняй, если объект дорогой и переиспользуем.\n\n" +
          "**`@pytest.mark.parametrize`** — таблица тестов одной строкой. Каждая строка — отдельный тест.\n\n" +
          "**`monkeypatch`** — встроенная фикстура, которая подменяет атрибуты, env-переменные, методы — и автоматически откатывает после теста. Идеально для изоляции от внешних зависимостей.",
        code:
          "import pytest\n\n" +
          "@pytest.fixture\n" +
          "def sample_user():\n" +
          "    return {\"name\": \"Аня\", \"age\": 17}\n\n" +
          "def test_sample(sample_user):\n" +
          "    assert sample_user[\"age\"] == 17\n\n" +
          "@pytest.mark.parametrize(\"a,b,expected\", [\n" +
          "    (1, 2, 3),\n" +
          "    (10, -5, 5),\n" +
          "    (0, 0, 0),\n" +
          "])\n" +
          "def test_sum(a, b, expected):\n" +
          "    assert a + b == expected\n\n" +
          "def test_env(monkeypatch):\n" +
          "    monkeypatch.setenv(\"MODE\", \"test\")\n" +
          "    import os\n" +
          "    assert os.environ[\"MODE\"] == \"test\"",
        keyTakeaways: [
          "@pytest.fixture — переиспользуемая подготовка.",
          "@pytest.mark.parametrize — таблица входов в одном тесте.",
          "monkeypatch — безопасная подмена с автоматическим откатом.",
        ],
        pitfalls: [
          "Не делай фикстуру с побочными эффектами в session-scope без yield + cleanup.",
          "Фикстура отдаёт значение через return ИЛИ yield — если yield, всё после yield = teardown.",
          "Изменение глобалов руками без monkeypatch → ломает другие тесты.",
        ],
        analogy:
          "Фикстура — как мизансцена в театре: до каждого спектакля расставляют декорации и актёров. monkeypatch — как реквизитор, который перед сценой подменяет настоящий пистолет бутафорским, а после — возвращает настоящий на место. Parametrize — один актёр играет все роли по очереди по скрипту.",
      },
    ],
    cheatSheet: [
      "test_*.py + def test_*: + assert.",
      "pytest -v / -x / -k / --lf — повседневные флаги.",
      "@pytest.fixture / scope=function|class|module|session.",
      "@pytest.mark.parametrize(\"a,b\", [(1,2), (3,4)]).",
      "with pytest.raises(SomeError, match=\"...\"): для негативных тестов.",
      "monkeypatch.setattr / setenv / delattr — изолированная подмена.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "s6-f1",
      title: "Базовый тест и pytest.raises",
      description: "Заверши негативный тест.",
      code:
        "import pytest\n\n" +
        "def divide(a, b):\n" +
        "    if b == 0: raise ValueError(\"zero\")\n" +
        "    return a / b\n\n" +
        "def test_divide_by_zero():\n" +
        "    with pytest.{{0}}({{1}}, match=\"{{2}}\"):\n" +
        "        divide(10, 0)",
      answers: [["raises"], ["ValueError"], ["zero"]],
      hints: [
        "Контекстный менеджер для проверки исключений.",
        "Какое исключение мы ждём.",
        "Часть сообщения исключения для match.",
      ],
      explanation: {
        summary:
          "pytest.raises с match — золотой стандарт негативных тестов: проверяем и тип, и осмысленность сообщения.",
        keyPoints: [
          "match — регекс, поэтому спецсимволы экранируй.",
          "Без with тест не пройдёт — pytest.raises только в блоке.",
        ],
      },
    },
    {
      type: "fill",
      id: "s6-f2",
      title: "Параметризация",
      description: "Заверши таблицу входов.",
      code:
        "import pytest\n\n" +
        "@pytest.mark.{{0}}(\"a,b,expected\", [\n" +
        "    (1, 2, 3),\n" +
        "    (5, 5, 10),\n" +
        "    (0, -3, -3),\n" +
        "])\n" +
        "def test_add(a, b, {{1}}):\n" +
        "    assert a + b == {{1}}",
      answers: [["parametrize"], ["expected"]],
      hints: [
        "Декоратор для табличных тестов (с одной m, как в pytest).",
        "Имя третьего параметра должно совпадать с описанием.",
      ],
      explanation: {
        summary:
          "parametrize превращает один тест в N. Pytest напечатает каждый случай отдельно — удобно отлаживать.",
        keyPoints: [
          "Имена параметров строго совпадают с теми, что описаны в строке.",
          "Каждая строка таблицы — отдельный сценарий.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "s6-q1",
      title: "Что такое фикстура",
      question:
        "Что такое pytest fixture? Кратко.",
      answers: [
        "функция, подготавливающая данные или ресурс для тестов и автоматически передаваемая по имени параметра",
        "функция с декоратором pytest.fixture, которую можно объявить параметром теста для подготовки данных",
        "переиспользуемая подготовка данных для тестов",
        "фикстура — переиспользуемая подготовка ресурса для тестов через @pytest.fixture",
      ],
      hint: "Подготовка/teardown.",
      explanation:
        "Фикстура — функция с @pytest.fixture, которая готовит ресурс (или данные). Тест получает её, объявив параметр с тем же именем. yield внутри фикстуры — точка между setup и teardown.",
    },
    {
      type: "question",
      id: "s6-q2",
      title: "Зачем monkeypatch",
      question:
        "Какой смысл фикстуры monkeypatch и в чём её преимущество перед прямым изменением глобалов?",
      answers: [
        "подменяет атрибуты/env с автоматическим откатом после теста",
        "временно меняет переменные окружения и атрибуты, потом откатывает обратно",
        "позволяет безопасно подменять состояние и автоматически восстанавливает оригинал",
        "monkeypatch меняет атрибуты с автоматическим cleanup после теста",
      ],
      hint: "Самое главное — изоляция между тестами.",
      explanation:
        "monkeypatch подменяет атрибуты, env, методы — и автоматически возвращает их в исходное состояние после теста. Это сохраняет тесты независимыми друг от друга.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "s6-w1",
      title: "Параметризованный тест clamp",
      task:
        "Напиши функцию clamp(value, lo, hi) — возвращает value, ограниченное диапазоном. Сделай для неё параметризованный pytest-тест с минимум 4 случаями: значение ниже, значение выше, на границах, и внутри. Используй @pytest.mark.parametrize.",
      hints: [
        "def clamp(v, lo, hi): return max(lo, min(v, hi)).",
        "@pytest.mark.parametrize('v,lo,hi,exp', [(-1, 0, 10, 0), ...]).",
        "def test_clamp(v, lo, hi, exp): assert clamp(v, lo, hi) == exp.",
      ],
      required: ["import pytest", "def clamp(", "@pytest.mark.parametrize", "def test_clamp(", "assert"],
      minLines: 10,
      explanation: {
        summary:
          "parametrize превращает 4 ручных теста в одну читаемую таблицу. Pytest сообщит, какой именно случай упал.",
        keyPoints: [
          "Сначала пиши крайние случаи (boundary), потом нормальные.",
          "Имена параметров теста должны совпадать с шапкой parametrize.",
        ],
      },
    },
  ],
};

const s7: Round = {
  number: 7,
  title: "Senior · SOLID, паттерны и архитектура",
  level: "Сложный",
  intro:
    "Финальный раунд. Принципы SOLID, ключевые паттерны (Strategy, Factory, Adapter, Observer), Dependency Injection через композицию и базовые правила «чистой» архитектуры.",
  lesson: {
    title: "SOLID + важнейшие паттерны для Python",
    summary:
      "Что значит каждый из принципов SOLID на практике, как применять их в python (часто без классов вовсе), и какие паттерны действительно полезны.",
    readingMinutes: 8,
    sections: [
      {
        heading: "SOLID — пять принципов чистого ОО-дизайна",
        tagline: "S-R-P, O-C-P, L-S-P, I-S-P, D-I-P",
        body:
          "**S — Single Responsibility**: у класса/модуля одна причина для изменения. Если ты при изменении формата отчётов лезешь и в БД, и в email — нарушено.\n\n" +
          "**O — Open-Closed**: открыт для расширения, закрыт для модификации. Добавление нового способа оплаты не должно требовать менять if-каскад в `Payment`. Часто решается стратегией/полиморфизмом.\n\n" +
          "**L — Liskov Substitution**: подкласс должен полностью заменять родителя. Если `Square` — наследник `Rectangle`, и в `Rectangle` есть `set_width`, а у `Square` оно ломает инварианты — LSP нарушен.\n\n" +
          "**I — Interface Segregation**: лучше много маленьких интерфейсов, чем один толстый. Клиент не должен зависеть от методов, которые не использует.\n\n" +
          "**D — Dependency Inversion**: зависим от абстракций, а не от конкретики. В Python это часто = «передавай зависимость в конструктор» (DI), а не создавай её внутри.",
        code:
          "# Плохо: класс делает всё. Нарушает SRP.\n" +
          "class ReportService:\n" +
          "    def fetch(self, db): ...\n" +
          "    def render_pdf(self, data): ...\n" +
          "    def email(self, smtp, pdf): ...\n\n" +
          "# Лучше: каждая ответственность своя\n" +
          "class ReportRepo: ...\n" +
          "class ReportRenderer: ...\n" +
          "class Mailer: ...\n\n" +
          "class ReportService:\n" +
          "    def __init__(self, repo, renderer, mailer):\n" +
          "        self.repo = repo\n" +
          "        self.renderer = renderer\n" +
          "        self.mailer = mailer\n" +
          "    def send(self, user_id):\n" +
          "        data = self.repo.fetch(user_id)\n" +
          "        pdf = self.renderer.render(data)\n" +
          "        self.mailer.send(pdf)",
        keyTakeaways: [
          "SRP — одна причина для изменения; не сваливай всё в один класс.",
          "OCP — расширяемость без правки старого кода (стратегии, плагины).",
          "DIP — передавай зависимости в конструктор, а не создавай их внутри.",
        ],
        pitfalls: [
          "SOLID — это **рекомендации**, не догма. В Python многое решается функциями и Protocol — без многочисленных классов.",
          "Чрезмерное дробление = больше боли, чем пользы. Класс должен быть осмысленным.",
        ],
        analogy:
          "SRP — как сотрудник с одной должностью: бухгалтер не должен ещё и принимать звонки. OCP — как розетка: новый прибор просто втыкается, не нужно переделывать проводку. DIP — как менеджер, который работает с любым поставщиком (абстракция), не зависит от конкретного бренда.",
      },
      {
        heading: "Паттерны, которые нужны на практике",
        tagline: "Strategy, Factory, Adapter, Observer + DI",
        body:
          "**Strategy** — поведение как объект, можно подменять. В Python — обычно просто функция, передаваемая в параметре.\n\n" +
          "**Factory** — отдельная функция/класс, создающая объекты. Удобно, когда конструктор сложный или зависит от конфигурации.\n\n" +
          "**Adapter** — оборачиваем чужой интерфейс под наш. Часто — Wrapper над сторонним SDK, чтобы можно было заменить.\n\n" +
          "**Observer / Pub-Sub** — подписки на события. В Python — список callable'ов или asyncio.Queue.\n\n" +
          "**Dependency Injection** — основа всего. В Python обычно достаточно передавать зависимости в `__init__` (constructor injection). Никаких отдельных DI-фреймворков большинству проектов не нужно.\n\n" +
          "**Композиция > наследование**: предпочитай содержать объекты как поля, чем глубоко наследоваться.",
        code:
          "# Strategy через функции — pythonic\n" +
          "def by_price(book): return book[\"price\"]\n" +
          "def by_title(book): return book[\"title\"]\n\n" +
          "books = [{\"title\": \"B\", \"price\": 100}, {\"title\": \"A\", \"price\": 200}]\n" +
          "print(sorted(books, key=by_price))\n" +
          "print(sorted(books, key=by_title))\n\n" +
          "# Factory + DI\n" +
          "class JsonStorage:\n" +
          "    def save(self, x): ...\n" +
          "class S3Storage:\n" +
          "    def save(self, x): ...\n\n" +
          "def make_storage(kind):\n" +
          "    if kind == \"json\":\n" +
          "        return JsonStorage()\n" +
          "    elif kind == \"s3\":\n" +
          "        return S3Storage()\n" +
          "    raise ValueError(kind)\n\n" +
          "class Service:\n" +
          "    def __init__(self, storage):     # DI: внешняя зависимость\n" +
          "        self.storage = storage",
        keyTakeaways: [
          "Strategy в Python = просто передавать функцию (key=, callback).",
          "Factory изолирует создание; DI — передачу.",
          "Композиция облегчает замену и тестирование.",
        ],
        pitfalls: [
          "Не плоди паттерны ради паттернов. В Python многие GoF-паттерны выглядят как пара функций.",
          "Избыточные интерфейсы добавляют шум. Применяй абстракции только там, где есть реальный второй вариант реализации.",
        ],
        analogy:
          "Strategy — как выбор маршрута в навигаторе: машина та же, но алгоритм ('быстрый', 'короткий', 'без пробок') меняется. Factory — как официант в ресторане: ты говоришь 'хочу пасту', он решает, как именно её приготовить. DI — как IKEA: ты получаешь стул в разобранном виде, подставляя нужные ножки сам.",
      },
    ],
    cheatSheet: [
      "S — одна причина для изменения; O — расширение без правки; L — подкласс заменяет родителя; I — узкие интерфейсы; D — зависим от абстракций.",
      "Strategy → функция в параметре (key=, callback).",
      "Factory → make_x(...); DI → передача зависимостей в __init__.",
      "Adapter → обёртка над чужим SDK; Observer → список колбэков/Queue.",
      "Композиция > наследование, особенно в python.",
    ],
  },
  fills: [
    {
      type: "fill",
      id: "s7-f1",
      title: "DI через конструктор",
      description: "Заверши пример Dependency Injection.",
      code:
        "class FileLogger:\n" +
        "    def write(self, msg): print(\"FILE:\", msg)\n\n" +
        "class ConsoleLogger:\n" +
        "    def write(self, msg): print(\"CONSOLE:\", msg)\n\n" +
        "class Service:\n" +
        "    def __init__(self, {{0}}):\n" +
        "        self.logger = {{0}}\n" +
        "    def run(self):\n" +
        "        self.logger.write(\"started\")\n\n" +
        "Service({{1}}()).run()\n" +
        "Service({{2}}()).run()",
      answers: [["logger"], ["FileLogger"], ["ConsoleLogger"]],
      hints: [
        "Имя поля и параметра — что мы инжектируем.",
        "Сначала используем файловый логгер.",
        "Потом — консольный.",
      ],
      explanation: {
        summary:
          "Сервис принимает зависимость в конструкторе и не знает, какую реализацию ему дали. Это позволяет легко тестировать (передать FakeLogger) и менять поведение.",
        keyPoints: [
          "Никаких глобалов — всё через __init__.",
          "Любой объект с методом write подойдёт (duck typing).",
        ],
      },
    },
    {
      type: "fill",
      id: "s7-f2",
      title: "Strategy через функции",
      description: "Используй функции как стратегии сортировки.",
      code:
        "books = [\n" +
        "    {\"title\": \"B\", \"price\": 100},\n" +
        "    {\"title\": \"A\", \"price\": 200},\n" +
        "]\n\n" +
        "def by_price(b): return b[\"{{0}}\"]\n" +
        "def by_title(b): return b[\"{{1}}\"]\n\n" +
        "print({{2}}(books, key=by_price))\n" +
        "print({{2}}(books, key=by_title))",
      answers: [["price"], ["title"], ["sorted"]],
      hints: [
        "По чему сортируем в первой функции.",
        "Во второй.",
        "Встроенная функция, принимающая key.",
      ],
      explanation: {
        summary:
          "В Python Strategy чаще всего реализуется простой функцией в параметре key= (или вообще lambda). Никакого класса не нужно.",
        keyPoints: [
          "key — функция, по которой sorted сравнивает элементы.",
          "Это и есть pythonic Strategy.",
        ],
      },
    },
  ],
  questions: [
    {
      type: "question",
      id: "s7-q1",
      title: "Что такое Dependency Inversion",
      question:
        "Какова суть принципа Dependency Inversion (D в SOLID)?",
      answers: [
        "зависим от абстракций, а не от конкретных реализаций",
        "высокоуровневые модули не должны зависеть от низкоуровневых, оба зависят от абстракций",
        "зависимости передаются как абстракции, не как конкретные классы",
        "вместо конкретных классов используем абстракции и передаём зависимости снаружи",
      ],
      hint: "Не завись от конкретного класса.",
      explanation:
        "DIP: высокоуровневые модули не должны зависеть от низкоуровневых; и те и другие зависят от АБСТРАКЦИЙ. На практике в Python — передавай зависимости через __init__ или функцию, а не создавай их внутри.",
    },
    {
      type: "question",
      id: "s7-q2",
      title: "Композиция vs наследование",
      question:
        "Почему в современном python чаще предпочитают композицию наследованию?",
      answers: [
        "композиция гибче, проще тестировать и нет жёсткой иерархии",
        "композиция даёт меньше связности и лучше тестируется",
        "проще менять поведение и нет проблем с mro/diamond",
        "композиция — гибче и без сложного mro",
      ],
      hint: "Гибкость и тестируемость.",
      explanation:
        "Композиция (объект внутри объекта) даёт больше гибкости, проще тестируется (легко подсунуть mock), не страдает от MRO и diamond-проблем, и реже ломает Liskov.",
    },
  ],
  writes: [
    {
      type: "write",
      id: "s7-w1",
      title: "Сервис уведомлений с DI",
      task:
        "Опиши класс Notifier(sender), где sender — любой объект с методом send(text). Сделай два sender'а: ConsoleSender (печатает в print) и LoggingSender (добавляет 'LOG:' и печатает). Создай два Notifier'а с разными sender'ами и вызови notify('hi') у обоих.",
      hints: [
        "class Notifier: __init__(self, sender), notify(self, text) → self.sender.send(text).",
        "ConsoleSender.send(text) → print(text).",
        "LoggingSender.send(text) → print('LOG:', text).",
      ],
      required: ["class Notifier", "def __init__(self, sender)", "self.sender", "class ConsoleSender", "class LoggingSender", "def notify(", "def send("],
      minLines: 14,
      explanation: {
        summary:
          "Минимальный учебный DI: Notifier ничего не знает о конкретных Sender'ах. Можно подменять, тестировать и расширять без правок.",
        keyPoints: [
          "Любой объект с методом send подойдёт.",
          "Это и есть Open-Closed: новый Sender = новый класс, без правки Notifier.",
        ],
      },
    },
  ],
};

export const SENIOR_ROUNDS: Round[] = [s1, s2, s3, s4, s5, s6, s7];
export const SENIOR_TOTAL_ROUNDS = SENIOR_ROUNDS.length;
