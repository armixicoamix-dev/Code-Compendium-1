import type { LessonSection } from "./curriculum";

/**
 * ПРЕВЬЮ РАУНДА — что именно будет в заданиях этого раунда
 * и где в методичке смотреть ответ.
 *
 * Цель: ученик закрывает методичку и УЖЕ знает, какие задачи и какие
 * вопросы его ждут, и какой именно концепт спрашивается. Никаких сюрпризов.
 *
 * Каждая запись добавляется в конец `lesson.sections` поверх обычных
 * extras (см. curriculum.ts).
 */

// ---------------------------------------------------------------------------
// ROUND 1 — Классы, экземпляры, self, __init__
// ---------------------------------------------------------------------------
const preview1: LessonSection[] = [
  {
    heading: "Превью раунда 1: что тебе встретится в заданиях",
    tagline: "Прочитай этот раздел перед заданиями — здесь ответ на всё, что будет",
    body:
      "В раунде встретятся три формата: пропуски в коде, вопросы с выбором ответа и задания «напиши класс с нуля». Здесь — список тем и шпаргалка-ответ на каждую.\n\n" +
      "**Пропуски (fill):**\n\n" +
      "- **Cat — атрибуты и поведение.** Нужно дописать `def __init__(self, name, age):`, внутри `self.name = name` и `self.age = age`, а также метод `def meow(self): print(...)`.\n" +
      "- **BankAccount — операции и история.** Конструктор принимает `owner` и `balance=0`, заводит `self.history = []`. Методы `deposit(self, amount)` и `withdraw(self, amount)` меняют `self.balance` и дописывают строку в `self.history`.\n" +
      "- **Rectangle — площадь, периметр, масштабирование.** В `__init__(self, width, height)` сохраняем оба параметра. Методы возвращают `self.width * self.height`, `2 * (self.width + self.height)`, а `scale(self, k)` умножает оба поля на `k` (мутирует объект).\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Что такое self?»** → Это первый параметр любого метода экземпляра, в который Python автоматически подставляет тот объект, у которого позвали метод. Через `self` мы обращаемся к атрибутам именно этого экземпляра.\n" +
      "- **«Что выведет программа?»** → Внимательно смотри на порядок: `__init__` запускается при создании объекта, `print(...)` внутри метода сработает только при явном вызове метода. Если конструктор изменяет атрибут, его новое значение видно в последующих обращениях.\n" +
      "- **«Имя конструктора»** → `__init__` (с двумя подчёркиваниями с обеих сторон). Не `__init`, не `_init_`, не `constructor`.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Person с биографией.** `class Person`, `__init__(self, name, year_born)`, `self.events = []`, метод `add_event(self, year, text)` добавляет в список, метод `bio(self)` возвращает многострочное описание (или печатает).\n" +
      "- **Counter с историей.** Конструктор `__init__(self, start=0)`, `self.value = start`, `self.history = [start]`. Методы `inc(self)` и `dec(self)` меняют `value` и дописывают в `history`. Часто требуется `reset(self)`, который возвращает `value` к стартовому.\n" +
      "- **Book + библиотека.** Два класса. `Book(title, author)` — простая модель. `Library` хранит `self.books = []`, метод `add(self, book)` добавляет, `find_by_author(self, author)` возвращает список совпадений.\n\n" +
      "Главный набор пропусков, который встречается ВЕЗДЕ: `def __init__(self, ...)`, `self.<имя> = ...`, обращение к своим атрибутам `self.<имя>`, вызов своих методов — `self.<метод>()`.",
    code:
      "# Шаблон, который ты будешь воспроизводить в большинстве заданий:\n" +
      "class MyClass:\n" +
      "    def __init__(self, a, b):\n" +
      "        self.a = a\n" +
      "        self.b = b\n" +
      "        self.history = []           # пустая коллекция тоже инициализируется\n\n" +
      "    def do_something(self, x):\n" +
      "        self.history.append(x)      # объект помнит свои действия\n" +
      "        return self.a + self.b + x  # пользуемся своими атрибутами через self.",
    keyTakeaways: [
      "Все три типа задач спрашивают одно и то же: классы, экземпляры, self, __init__.",
      "В вопросах — теория из методички; в коде — практика.",
      "Если в задании просят «история» — это `self.history = []` в __init__ + `.append(...)` в нужных методах.",
    ],
    pitfalls: [
      "Забыть `self.` перед именем атрибута — самая частая ошибка раунда.",
      "Перепутать порядок параметров `__init__` — Python ничего не сообщит, баги вылезут позже.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 2 — Атрибуты, инкапсуляция, classmethod/staticmethod
// ---------------------------------------------------------------------------
const preview2: LessonSection[] = [
  {
    heading: "Превью раунда 2: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Dog со счётчиком и реестром.** Атрибут класса `count = 0` и `registry = []`. В `__init__` инкрементируем `Dog.count += 1` и `Dog.registry.append(self)`. Здесь будет `@classmethod def total(cls): return cls.count` и/или `@classmethod def all_names(cls): return [d.name for d in cls.registry]`.\n" +
      "- **SafeAccount c name-mangling.** Поле баланса хранится как `self.__balance` (два подчёркивания). Снаружи доступ через `_SafeAccount__balance` — этот точный формат ОБЯЗАН быть в твоём ответе на соответствующий тест.\n" +
      "- **Date — два classmethod-конструктора и staticmethod-валидатор.** `__init__(self, year, month, day)`, плюс `@classmethod from_string(cls, s)` (парсит ISO-дату через `cls(*map(int, s.split('-')))`), плюс `@classmethod today(cls)` (использует `datetime.date.today()`), плюс `@staticmethod is_valid(year, month, day)` без `self`/`cls`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Какой декоратор не получает ни self, ни cls?»** → `@staticmethod`. У него обычная сигнатура без первого «магического» параметра.\n" +
      "- **«Что выведет код?»** → Чаще всего тестируется ловушка с общим `list` на уровне класса: одно изменение видно у всех экземпляров. Ответ — то значение, которое получит «общая» переменная после операций.\n" +
      "- **«Под каким именем хранится приватное поле?»** → Если класс называется `SafeAccount`, а поле объявлено как `__balance`, то реально оно хранится как `_SafeAccount__balance`. Это и есть **name mangling**: префикс — одно подчёркивание + имя класса.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Student с реестром группы.** `class Student`. Атрибут класса `students = []`. В `__init__(self, name, grade)` сохраняй и `Student.students.append(self)`. `@classmethod top(cls)` возвращает студента с максимальной оценкой через `max(cls.students, key=lambda s: s.grade)`.\n" +
      "- **Temperature с инкапсуляцией.** Конструктор принимает `celsius`, сохраняет в `self._celsius` (одно подчёркивание — «не лезь»). Метод `to_fahrenheit(self)` возвращает `self._celsius * 9/5 + 32`. Менять извне — только через метод-сеттер с проверкой диапазона.\n" +
      "- **Calculator со staticmethod и историей.** `self.history = []` в `__init__`. Методы `add/sub/mul` записывают `(операция, результат)` в историю и возвращают результат. Один метод `@staticmethod def is_zero(x): return x == 0` — без self.",
    code:
      "# Class attribute + classmethod:\n" +
      "class Dog:\n" +
      "    count = 0\n" +
      "    def __init__(self, name):\n" +
      "        self.name = name\n" +
      "        Dog.count += 1\n" +
      "    @classmethod\n" +
      "    def total(cls):\n" +
      "        return cls.count\n\n" +
      "# Name mangling — Python переписывает __x в _ClassName__x:\n" +
      "class SafeAccount:\n" +
      "    def __init__(self, balance):\n" +
      "        self.__balance = balance\n" +
      "a = SafeAccount(100)\n" +
      "print(a._SafeAccount__balance)   # 100",
    keyTakeaways: [
      "Атрибут класса (`count = 0`) — общий для всех; объявляется ДО __init__.",
      "@classmethod получает `cls` — класс. @staticmethod не получает ничего.",
      "`__field` → `_ClassName__field` (name mangling). Никакой настоящей приватности нет.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 3 — Свойства и наследование
// ---------------------------------------------------------------------------
const preview3: LessonSection[] = [
  {
    heading: "Превью раунда 3: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Temperature через @property.** Хранилище — `self._celsius`. `@property def celsius(self): return self._celsius`. `@celsius.setter def celsius(self, value):` — проверка `if value < -273.15: raise ValueError(...)`, потом `self._celsius = value`. Нельзя писать в сеттере `self.celsius = value` — это бесконечная рекурсия.\n" +
      "- **Иерархия животных — наследование и super().** Базовый `class Animal` с `__init__(self, name)`. `class Dog(Animal):` — в его `__init__(self, name, breed)` обязательный `super().__init__(name)`, потом `self.breed = breed`. Метод `speak(self)` переопределяется в потомке.\n" +
      "- **Employee → Manager.** `Employee(name, salary)`. `Manager(Employee)` принимает дополнительно `team` (список) и/или `bonus`. В `__init__` Manager-а — `super().__init__(name, salary)`, потом свои поля. Метод `total(self)` у Manager-а возвращает `super().total() + self.bonus` (или сумма с командой).\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Что делает super().__init__()?»** → Зовёт `__init__` родительского класса (точнее — следующего по MRO). Нужно, чтобы атрибуты, которые задаёт родитель, появились на объекте.\n" +
      "- **«Что выведет код?»** → Обычно проверяет переопределение методов: вызвал у потомка — отработает версия потомка, даже если ссылка типа родителя. Это и есть **полиморфизм**.\n" +
      "- **«Зачем нужен @property?»** → Чтобы превратить метод в «вычисляемое поле» с валидацией при записи, не меняя внешний интерфейс. Снаружи `obj.x` читается/пишется как обычное поле.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Vehicle и наследник Car.** `Vehicle(brand, year)`, метод `info(self)`. `Car(Vehicle)` принимает `brand, year, doors`, в `__init__` зовёт `super().__init__(brand, year)`, переопределяет `info(self)` (или добавляет метод).\n" +
      "- **Account с @property balance.** Поле `self._balance`. Геттер возвращает значение, сеттер не пускает отрицательное (`raise ValueError`). Метод `deposit(self, amount)` использует сеттер: `self.balance = self.balance + amount`.\n" +
      "- **Shape → Circle и Square.** Базовый класс с методом `area(self)`, который не реализован (или возвращает 0 / поднимает исключение). `Circle(radius)` и `Square(side)` переопределяют `area`. Полиморфно перебираем `[Circle(2), Square(3)]` через `for s in shapes: print(s.area())`.",
    code:
      "# property с проверкой:\n" +
      "class Temperature:\n" +
      "    def __init__(self, c):\n" +
      "        self.celsius = c              # сразу пройдёт через сеттер\n" +
      "    @property\n" +
      "    def celsius(self):\n" +
      "        return self._celsius\n" +
      "    @celsius.setter\n" +
      "    def celsius(self, v):\n" +
      "        if v < -273.15:\n" +
      "            raise ValueError(\"ниже абсолютного нуля\")\n" +
      "        self._celsius = v             # ВНИМАНИЕ: _celsius, не self.celsius!\n\n" +
      "# super() корректно:\n" +
      "class Dog(Animal):\n" +
      "    def __init__(self, name, breed):\n" +
      "        super().__init__(name)        # сначала родитель\n" +
      "        self.breed = breed",
    keyTakeaways: [
      "В сеттере @property пиши `self._x = value`, не `self.x = value` (это рекурсия).",
      "В __init__ потомка сначала зови super().__init__(...), потом свои поля.",
      "Полиморфизм = переопределить метод в потомке; вызывающий код не меняется.",
    ],
    pitfalls: [
      "Забыть super().__init__() → атрибуты родителя не появятся, при первом обращении — AttributeError.",
      "Положить в setter `self.x = value` без подчёркивания — бесконечная рекурсия и RecursionError.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 4 — Абстракции, полиморфизм, MRO
// ---------------------------------------------------------------------------
const preview4: LessonSection[] = [
  {
    heading: "Превью раунда 4: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **ABC Shape и три наследника.** Импорт `from abc import ABC, abstractmethod`. `class Shape(ABC):`, внутри `@abstractmethod def area(self): ...` (многоточие — валидное тело). Наследники (`Circle`, `Square`, `Triangle`) обязаны реализовать `area`, иначе `TypeError: can't instantiate abstract class`.\n" +
      "- **Абстрактный Storage и две реализации.** `class Storage(ABC)` с `@abstractmethod save(self, key, value)` и `@abstractmethod load(self, key)`. Реализации: `MemoryStorage` (через `self._data = {}`) и, например, `FileStorage` (читает/пишет json/pickle).\n" +
      "- **Множественное наследование и MRO.** Иерархия типа `class D(B, C):` где `B(A)`, `C(A)`. Использование `super().method()` в каждом — обход по MRO. Шаблон с порядком вызовов: `D → B → C → A`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Что такое полиморфизм одной строкой?»** → Один и тот же интерфейс работает с объектами разных типов; конкретное поведение определяется типом объекта в рантайме.\n" +
      "- **«Что выведет MRO?»** → Считай по C3-линеаризации: класс → его родители слева направо → дальше по их MRO, без повторов. Можешь подсмотреть `Cls.__mro__`.\n" +
      "- **«Из какого модуля импортируем abstractmethod?»** → `abc` (`from abc import ABC, abstractmethod`).\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Абстрактный PaymentMethod и три реализации.** `class PaymentMethod(ABC)` с `@abstractmethod def pay(self, amount): ...`. Три потомка: `CardPayment`, `CryptoPayment`, `CashPayment` — каждый реализует `pay` по-своему. Часто добавляется `@abstractmethod def name(self) -> str: ...`.\n" +
      "- **Иерархия Employee → Developer и Designer + полиморфизм.** Базовый Employee с методом `salary(self)` (или абстрактным). Потомки переопределяют. Цикл по списку сотрудников печатает `f\"{e.name}: {e.salary()}\"` — это и есть полиморфный обход.\n" +
      "- **Mixin TimestampMixin для нескольких моделей.** `class TimestampMixin:` с методом `__init__(self, **kwargs)`, который ставит `self.created_at = datetime.utcnow()` и зовёт `super().__init__(**kwargs)`. Класс `User(TimestampMixin, Base)` использует mixin без своего timestamp-кода.",
    code:
      "from abc import ABC, abstractmethod\n\n" +
      "class Shape(ABC):\n" +
      "    @abstractmethod\n" +
      "    def area(self) -> float: ...\n\n" +
      "class Circle(Shape):\n" +
      "    def __init__(self, r): self.r = r\n" +
      "    def area(self): return 3.14 * self.r ** 2\n\n" +
      "# MRO в множественном наследовании:\n" +
      "class A: pass\n" +
      "class B(A): pass\n" +
      "class C(A): pass\n" +
      "class D(B, C): pass\n" +
      "print(D.__mro__)  # D, B, C, A, object",
    keyTakeaways: [
      "ABC + @abstractmethod = жёсткий контракт. Без реализации — нельзя инстанцировать.",
      "MRO считается алгоритмом C3; смотри через `__mro__`.",
      "Mixin — маленький класс с одной возможностью; имя `*Mixin`. Зовёт `super().__init__(**kwargs)`.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 5 — Магические методы, dataclasses
// ---------------------------------------------------------------------------
const preview5: LessonSection[] = [
  {
    heading: "Превью раунда 5: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Vector с арифметикой и сравнением.** `__init__(self, x, y)`, `__add__(self, other)` возвращает `Vector(self.x+other.x, self.y+other.y)`, `__eq__(self, other)` сравнивает координаты, `__repr__(self)` возвращает `f\"Vector({self.x}, {self.y})\"`. Иногда `__mul__(self, k)` для умножения на скаляр.\n" +
      "- **Связный список с __iter__, __len__ и __getitem__.** Узлы хранят `value` и `next`. `__len__` возвращает количество узлов. `__getitem__(self, i)` идёт по цепочке i раз. `__iter__` — генератор, yield-ит значения по порядку.\n" +
      "- **Композиция: Bank, Account и Transaction (dataclasses).** `@dataclass` для каждого класса. `Account(owner: str, balance: float = 0)`. `Transaction(amount: float, ts: datetime)`. `Bank` хранит `accounts: list[Account] = field(default_factory=list)` — обязательно через field(default_factory=list).\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Какой dunder для len()?»** → `__len__`. `len(obj)` зовёт `obj.__len__()`.\n" +
      "- **«В чём разница __str__ и __repr__?»** → `__str__` — для человека (print, f-string). `__repr__` — для разработчика (REPL, отладчик, в коллекциях). Хорошее `__repr__` выглядит как код, способный воссоздать объект.\n" +
      "- **«Что выведет код?»** → Обычно — проверка, работает ли арифметика через `__add__`/`__mul__`, или какой `__repr__` выведется в списке.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Money с арифметикой.** `__init__(self, amount, currency)`. `__add__` проверяет совпадение валюты — иначе `raise ValueError`. `__eq__` сравнивает по amount+currency. `__repr__` — `f\"Money({self.amount} {self.currency})\"`.\n" +
      "- **Stack как полноценный контейнер.** Внутри `self._items = []`. `push`, `pop` (поднимает `IndexError` на пустом), `peek` (тоже IndexError на пустом). `__len__`, опционально `__iter__`, `__contains__`.\n" +
      "- **TodoList с приоритетами.** Хранит задачи (можно `@dataclass Task(text, priority)`). Метод `add(text, priority)`. Метод `top(self)` возвращает задачу с максимальным `priority` через `max(...)`. Часто — `__iter__` для прохода по всем задачам.",
    code:
      "from dataclasses import dataclass, field\n\n" +
      "@dataclass\n" +
      "class Account:\n" +
      "    owner: str\n" +
      "    balance: float = 0\n\n" +
      "@dataclass\n" +
      "class Bank:\n" +
      "    accounts: list[Account] = field(default_factory=list)  # обязательно factory!\n\n" +
      "# Vector с арифметикой:\n" +
      "class Vector:\n" +
      "    def __init__(self, x, y): self.x, self.y = x, y\n" +
      "    def __add__(self, other):\n" +
      "        return Vector(self.x + other.x, self.y + other.y)\n" +
      "    def __eq__(self, other):\n" +
      "        return isinstance(other, Vector) and (self.x, self.y) == (other.x, other.y)\n" +
      "    def __repr__(self):\n" +
      "        return f\"Vector({self.x}, {self.y})\"",
    keyTakeaways: [
      "`len(x)` → `x.__len__()`. `x + y` → `x.__add__(y)`. `for i in x` → `x.__iter__()`.",
      "В @dataclass изменяемые дефолты — только через `field(default_factory=list)`.",
      "__str__ — для человека. __repr__ — для разработчика, выглядит как валидный конструктор.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 6 — Generics, dataclasses (продвинутые), Protocol
// ---------------------------------------------------------------------------
const preview6: LessonSection[] = [
  {
    heading: "Превью раунда 6: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Generic Repository[T] — типобезопасный контейнер.** `from typing import Generic, TypeVar`. `T = TypeVar(\"T\")`. `class Repository(Generic[T]):`, внутри `self._items: list[T] = []`. Методы `add(self, x: T)` и `all(self) -> list[T]`. Использование: `Repository[User]()`.\n" +
      "- **@dataclass: frozen, slots и default_factory.** `@dataclass(frozen=True, slots=True)`. Поля с типами; для list/dict — `field(default_factory=list)`. После создания нельзя присваивать — `FrozenInstanceError`.\n" +
      "- **__post_init__ и метод-фабрика.** `def __post_init__(self):` запускается ПОСЛЕ автоматического `__init__`. Внутри валидация полей. Фабрика — `@classmethod from_dict(cls, d): return cls(**d)`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Чем Protocol отличается от ABC?»** → Protocol — структурная типизация: класс соответствует протоколу, если у него есть нужные методы, БЕЗ наследования. ABC требует явного наследования.\n" +
      "- **«Почему mutable default — баг?»** → `def f(x=[]):` создаёт ОДИН список на все вызовы — изменения «накапливаются». Правильно: `x=None` и `if x is None: x = []` (или для dataclass — `field(default_factory=list)`).\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Generic Pair[A, B].** Два TypeVar: `A = TypeVar(\"A\")`, `B = TypeVar(\"B\")`. `class Pair(Generic[A, B]):` с полями `first: A`, `second: B`. Метод `swap(self) -> \"Pair[B, A]\"` возвращает новый Pair с переставленными типами.\n" +
      "- **@dataclass FrozenPoint с distance_to.** `@dataclass(frozen=True)` с `x: float`, `y: float`. Метод `distance_to(self, other) -> float` через `math.hypot(self.x - other.x, self.y - other.y)`.\n" +
      "- **Допиши Protocol и проверку структурной типизации.** `from typing import Protocol`. `class Closable(Protocol): def close(self) -> None: ...`. Функция `close_all(items: list[Closable])` принимает что угодно с методом `close` — без наследования.",
    code:
      "from typing import Protocol, TypeVar, Generic\n" +
      "from dataclasses import dataclass, field\n\n" +
      "T = TypeVar(\"T\")\n\n" +
      "class Repository(Generic[T]):\n" +
      "    def __init__(self) -> None:\n" +
      "        self._items: list[T] = []\n" +
      "    def add(self, x: T) -> None:\n" +
      "        self._items.append(x)\n\n" +
      "@dataclass(frozen=True, slots=True)\n" +
      "class Point:\n" +
      "    x: float\n" +
      "    y: float\n" +
      "    tags: list[str] = field(default_factory=list)\n\n" +
      "class Closable(Protocol):\n" +
      "    def close(self) -> None: ...",
    keyTakeaways: [
      "`Generic[T]` + `TypeVar(\"T\")` — параметризованные классы.",
      "Изменяемый дефолт в dataclass — только через `field(default_factory=list)`.",
      "Protocol — структурный контракт, без наследования. ABC — явный, с наследованием.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 7 — Дескрипторы, __slots__, __new__
// ---------------------------------------------------------------------------
const preview7: LessonSection[] = [
  {
    heading: "Превью раунда 7: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Temperature: @property с валидацией.** Хранилище `self._celsius`. Геттер возвращает значение. Сеттер проверяет `value >= -273.15`, иначе `raise ValueError`. Помни: внутри сеттера присваиваем `self._celsius = value`, не `self.celsius`.\n" +
      "- **Дескриптор Positive — переиспользуемая валидация.** Класс с методами `__set_name__(self, owner, name)`, `__get__(self, obj, objtype=None)`, `__set__(self, obj, value)`. `__set_name__` запоминает имя атрибута; `__set__` проверяет `value > 0` и сохраняет в `obj.__dict__[self._name]`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Что делает __slots__?»** → Фиксирует список разрешённых атрибутов; экономит память (нет `__dict__`); запрещает добавлять новые атрибуты на лету.\n" +
      "- **«__new__ vs __init__»** → `__new__` СОЗДАЁТ объект (возвращает его). `__init__` НАСТРАИВАЕТ уже созданный объект (ничего не возвращает). 99% случаев пишут только `__init__`.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Дескриптор RangeChecked.** Принимает `low` и `high` в `__init__`. `__set_name__` сохраняет имя поля. `__set__` проверяет `low <= value <= high`, иначе ValueError. Используется как `age = RangeChecked(0, 150)` в классе.\n" +
      "- **Класс с __slots__.** `__slots__ = (\"x\", \"y\")`. Попытка `obj.z = 1` поднимет `AttributeError`.\n" +
      "- **Singleton через __new__.** `_instance = None` на уровне класса. В `__new__(cls, *a, **kw):` если `cls._instance is None`, создаём через `super().__new__(cls)` и сохраняем; возвращаем `cls._instance`. `Foo() is Foo()` → True.\n" +
      "- **@property с lazy-кэшем и @<x>.deleter.** Геттер кэширует вычисление в `self._cache`; если есть в `__dict__` — возвращает; иначе считает и сохраняет. `@x.deleter` сбрасывает кэш через `del self.__dict__[\"x\"]` (или похоже).",
    code:
      "class Positive:\n" +
      "    def __set_name__(self, owner, name):\n" +
      "        self._name = name\n" +
      "    def __get__(self, obj, objtype=None):\n" +
      "        if obj is None: return self\n" +
      "        return obj.__dict__[self._name]\n" +
      "    def __set__(self, obj, value):\n" +
      "        if value <= 0:\n" +
      "            raise ValueError(f\"{self._name} must be positive\")\n" +
      "        obj.__dict__[self._name] = value\n\n" +
      "class Product:\n" +
      "    price = Positive()\n\n" +
      "# Singleton:\n" +
      "class Config:\n" +
      "    _instance = None\n" +
      "    def __new__(cls, *a, **kw):\n" +
      "        if cls._instance is None:\n" +
      "            cls._instance = super().__new__(cls)\n" +
      "        return cls._instance",
    keyTakeaways: [
      "Дескриптор — класс с __get__/__set__/__set_name__. Объявляется на УРОВНЕ КЛАССА, не в __init__.",
      "__slots__ = кортеж разрешённых атрибутов; экономия памяти + запрет произвольных новых.",
      "Singleton через __new__: храни `_instance`, в __new__ верни его, если уже есть.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 8 — ABCs, MRO, mixins, __init_subclass__
// ---------------------------------------------------------------------------
const preview8: LessonSection[] = [
  {
    heading: "Превью раунда 8: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **ABC: контракт через abstractmethod.** `from abc import ABC, abstractmethod`. Базовый класс с одним или двумя `@abstractmethod`. Наследники реализуют все абстракции.\n" +
      "- **super() и MRO в множественном наследовании.** Иерархия типа `D(B, C)` где `B`, `C` сами наследуют общий корень. Каждый метод зовёт `super().method()`. Порядок вывода: D → B → C → корень.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Что вернёт super()?»** → Прокси-объект, через который вызовы методов идут по MRO начиная со СЛЕДУЮЩЕГО после текущего класса.\n" +
      "- **«MRO алгоритм»** → C3 linearization. Сохраняет порядок «класс → родители слева направо», без повторов, с консистентностью между подцепочками.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **ABC Shape с площадью и периметром.** `@abstractmethod area`, `@abstractmethod perimeter`. Два-три потомка реализуют оба метода.\n" +
      "- **Mixin Loggable + Timestamped + класс User.** `LoggableMixin` добавляет `def log(self, msg): print(...)`. `TimestampedMixin` в `__init__` ставит `self.created_at` и зовёт `super().__init__(**kwargs)`. Класс `User(LoggableMixin, TimestampedMixin)` использует обе возможности.\n" +
      "- **__init_subclass__ для авто-регистрации.** В базовом классе `registry = []`. `def __init_subclass__(cls, **kwargs): super().__init_subclass__(**kwargs); Base.registry.append(cls)`. Каждый новый наследник автоматически попадает в registry — без декораторов и метаклассов.\n" +
      "- **Cooperative super() в mixin-цепочке.** Каждый mixin принимает `**kwargs`, делает своё дело, потом `super().__init__(**kwargs)`. Это позволяет любому порядку mixin'ов работать корректно.",
    code:
      "from abc import ABC, abstractmethod\n\n" +
      "class Shape(ABC):\n" +
      "    @abstractmethod\n" +
      "    def area(self) -> float: ...\n" +
      "    @abstractmethod\n" +
      "    def perimeter(self) -> float: ...\n\n" +
      "# Auto-registration через __init_subclass__:\n" +
      "class Plugin:\n" +
      "    registry: list = []\n" +
      "    def __init_subclass__(cls, **kwargs):\n" +
      "        super().__init_subclass__(**kwargs)\n" +
      "        Plugin.registry.append(cls)\n\n" +
      "class A(Plugin): pass\n" +
      "class B(Plugin): pass\n" +
      "print(Plugin.registry)   # [A, B]",
    keyTakeaways: [
      "super() — прокси по MRO от СЛЕДУЮЩЕГО класса, не «к родителю».",
      "MRO = C3 linearization. Смотри через `Cls.__mro__`.",
      "__init_subclass__ — хук на каждом наследнике; идеален для регистрации/валидации.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 9 — Strategy, Observer, паттерны
// ---------------------------------------------------------------------------
const preview9: LessonSection[] = [
  {
    heading: "Превью раунда 9: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Strategy: подменяемая логика скидки.** `class Cart(items, discount_strategy)` где `discount_strategy` — функция или объект с методом `apply(total) -> float`. Меняя стратегию, меняешь алгоритм без правок Cart.\n" +
      "- **Observer: подписка на события.** `Subject` хранит `self._observers = []`. Метод `subscribe(self, fn)` добавляет; `notify(self, event)` зовёт каждого `fn(event)`. Observer — функция или объект с методом `update`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Strategy vs наследование»** → Стратегия гибче: меняется в рантайме, не требует иерархии. Наследование жёстко связывает классы навсегда. По правилу «composition over inheritance» — Strategy предпочтительнее.\n" +
      "- **«Почему Singleton ругают?»** → Глобальное состояние, скрытые зависимости (класс не объявляет, что использует синглтон), сложно тестировать (нельзя подсунуть mock), проблемы в многопоточности.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Factory Method для парсеров.** Базовый `Parser` с абстрактным `parse(self, raw)`. Реализации: `JsonParser`, `XmlParser`, `CsvParser`. Фабрика — функция `make_parser(kind: str) -> Parser`, которая по строке возвращает нужную реализацию. Если kind неизвестен — `raise ValueError`.\n" +
      "- **Observer на классах: Subject и Observer.** `class Observer(ABC)` с `@abstractmethod update(self, data)`. `class Subject` с `subscribe`, `unsubscribe`, `notify`. Цикл по `_observers` и вызов `o.update(data)`.\n" +
      "- **Strategy через Callable.** Простая версия: функция-стратегия передаётся в конструктор. `Cart(items, lambda total: total * 0.9)`. Менять стратегию — один параметр конструктора.\n" +
      "- **Factory + Singleton через декоратор.** Декоратор `@singleton(cls)` возвращает функцию-фабрику, которая хранит единственный экземпляр в замыкании.",
    code:
      "# Strategy через Callable:\n" +
      "class Cart:\n" +
      "    def __init__(self, items, discount):\n" +
      "        self.items = items\n" +
      "        self.discount = discount        # callable[float] -> float\n" +
      "    def total(self):\n" +
      "        raw = sum(i.price for i in self.items)\n" +
      "        return self.discount(raw)\n\n" +
      "Cart(items, lambda x: x * 0.9).total()\n\n" +
      "# Observer (минимальный):\n" +
      "class Subject:\n" +
      "    def __init__(self): self._obs = []\n" +
      "    def subscribe(self, fn): self._obs.append(fn)\n" +
      "    def notify(self, event):\n" +
      "        for fn in self._obs: fn(event)",
    keyTakeaways: [
      "Strategy — храни поведение как параметр (функцию/объект), не как if/elif.",
      "Observer — список подписчиков, метод notify проходит и вызывает.",
      "Singleton хранит экземпляр в `_instance` (или замыкании декоратора). Используй редко — много минусов.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 10 — Context managers, iterators, async
// ---------------------------------------------------------------------------
const preview10: LessonSection[] = [
  {
    heading: "Превью раунда 10: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Контекстный менеджер: Timer.** Класс с `__enter__(self)` (запоминает `time.perf_counter()`, возвращает self) и `__exit__(self, exc_type, exc, tb)` (вычисляет elapsed, печатает или сохраняет). `with Timer() as t: ...` потом `t.elapsed`.\n" +
      "- **Итератор: Range с шагом.** `class Range(start, stop, step)`. `__iter__(self)` — обычно `return self`. `__next__(self)` отдаёт текущее значение, инкрементирует, при достижении stop — `raise StopIteration`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Что такое генератор?»** → Функция с `yield`. При вызове возвращает объект-генератор, который реализует протокол итератора и считает значения лениво, по запросу.\n" +
      "- **«Что должен делать __aexit__?»** → Асинхронный аналог `__exit__`. Принимает те же три параметра исключения, должен быть `async def`. Используется в `async with`.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Контекстный менеджер OpenSafe.** В `__enter__` открывает файл и возвращает его handle. В `__exit__` гарантированно закрывает (`self.f.close()`), даже если внутри было исключение. Возврат False/None — не глотать.\n" +
      "- **Итератор Cycle(items, n).** Цикл через items n раз. `__iter__` возвращает self. `__next__` отдаёт элементы по очереди, считает «сколько кругов сделали»; на n+1-м круге — StopIteration.\n" +
      "- **@contextmanager: декоратор вместо класса.** `from contextlib import contextmanager`. Функция-генератор: `try: setup; yield resource; finally: cleanup`. Декоратор превращает её в полноценный context manager.\n" +
      "- **async-итератор: тики таймера.** `class Ticker` с `__aiter__(self): return self` и `async def __anext__(self):` который `await asyncio.sleep(interval)` и возвращает следующий тик.",
    code:
      "import time\n" +
      "from contextlib import contextmanager\n\n" +
      "class Timer:\n" +
      "    def __enter__(self):\n" +
      "        self.t0 = time.perf_counter()\n" +
      "        return self\n" +
      "    def __exit__(self, et, e, tb):\n" +
      "        self.elapsed = time.perf_counter() - self.t0\n\n" +
      "@contextmanager\n" +
      "def section(name):\n" +
      "    print(f\"start {name}\")\n" +
      "    try:\n" +
      "        yield\n" +
      "    finally:\n" +
      "        print(f\"end {name}\")",
    keyTakeaways: [
      "Контекст-менеджер: __enter__ возвращает то, что попадёт в `as x`; __exit__ вызывается всегда.",
      "@contextmanager + try/finally вокруг yield — короткий способ.",
      "Итератор: __iter__ + __next__ + StopIteration. Часто проще написать функцию-генератор.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 11 — Метаклассы и __init_subclass__
// ---------------------------------------------------------------------------
const preview11: LessonSection[] = [
  {
    heading: "Превью раунда 11: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **type() как фабрика классов.** `type(name, bases, namespace)` создаёт класс «руками». Эквивалент `class Foo(Base): x = 1` — это `type(\"Foo\", (Base,), {\"x\": 1})`.\n" +
      "- **__init_subclass__ — простой 'метакласс на минималках'.** В базовом классе хук, который автоматически зовётся при создании каждого наследника. Принимает `cls` (новый класс) и `**kwargs`.\n" +
      "- **Свой метакласс: автоматическая валидация атрибутов.** `class Meta(type):`, метод `__new__(mcls, name, bases, ns)` проверяет namespace (например, требует обязательное поле) и зовёт `super().__new__(mcls, name, bases, ns)`.\n\n" +
      "**Вопросы (question):** Большая серия теории про метаклассы.\n\n" +
      "- **«Метакласс по умолчанию»** → `type`. Все классы без явного `metaclass=` — экземпляры `type`.\n" +
      "- **«Когда вызывается __init_subclass__?»** → При определении КАЖДОГО подкласса (даже глубокого), но не при создании экземпляра.\n" +
      "- **«type() и его сигнатура»** → Два варианта: `type(obj)` (вернёт класс) и `type(name, bases, namespace)` (создаст класс).\n" +
      "- **«Метакласс — наследник чего?»** → Обычно `type`. Можно цепочкой: `class MyMeta(type): ...`.\n" +
      "- **«Конфликт метаклассов»** → Если у родителей разные метаклассы и ни один не подкласс другого — `TypeError: metaclass conflict`.\n" +
      "- **«__class_getitem__: для чего?»** → Чтобы класс поддерживал синтаксис `Foo[int]` (как `list[int]`).\n" +
      "- **«__init_subclass__ и super()»** → Обязательно зови `super().__init_subclass__(**kwargs)`, иначе сломаешь цепочку.\n" +
      "- **«Декоратор vs метакласс»** → Декоратор класса проще, действует на ОДИН класс. Метакласс — на иерархию, мощнее, но сложнее.\n" +
      "- **«__call__ метакласса»** → Контролирует, что происходит при `Foo(...)` (создание экземпляра). Singleton-метакласс через __call__ — частый приём.\n" +
      "- **«Метакласс vs __init_subclass__»** → __init_subclass__ покрывает 90% задач (регистрация/валидация). Метакласс нужен, когда хочется контроля над созданием самого класса.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **__init_subclass__ с обязательным атрибутом.** Базовый класс требует, чтобы у каждого подкласса был `name`. В __init_subclass__ — `if not hasattr(cls, \"name\"): raise TypeError`.\n" +
      "- **Метакласс-singleton.** В `Meta.__call__(cls, *a, **kw)` — если у класса нет `_instance`, создать; вернуть его. Все классы с `metaclass=Meta` автоматически становятся синглтонами.\n" +
      "- **__class_getitem__: свой синтаксис Box[int].** Метод класса (или дандер) принимает аргумент `Box[int]` — может вернуть себя же или специализированную обёртку.",
    code:
      "# type как фабрика:\n" +
      "Foo = type(\"Foo\", (object,), {\"x\": 1, \"hi\": lambda self: \"hello\"})\n" +
      "Foo().hi()   # 'hello'\n\n" +
      "# __init_subclass__:\n" +
      "class Plugin:\n" +
      "    def __init_subclass__(cls, **kw):\n" +
      "        super().__init_subclass__(**kw)\n" +
      "        if not hasattr(cls, \"name\"):\n" +
      "            raise TypeError(f\"{cls.__name__} requires `name`\")\n\n" +
      "# Метакласс-singleton:\n" +
      "class SingletonMeta(type):\n" +
      "    _i = {}\n" +
      "    def __call__(cls, *a, **kw):\n" +
      "        if cls not in SingletonMeta._i:\n" +
      "            SingletonMeta._i[cls] = super().__call__(*a, **kw)\n" +
      "        return SingletonMeta._i[cls]",
    keyTakeaways: [
      "Метакласс — «класс класса». Базовый — type.",
      "90% задач решаются через __init_subclass__ или декоратор класса. Метакласс — для фреймворков.",
      "При __init_subclass__ всегда зови super().__init_subclass__(**kwargs).",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 12 — Дескрипторы (углублённо)
// ---------------------------------------------------------------------------
const preview12: LessonSection[] = [
  {
    heading: "Превью раунда 12: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **__set_name__: дескриптор узнаёт своё имя.** Метод вызывается, когда класс владельца ещё создаётся; в `name` приходит имя атрибута. Сохрани его в `self._name = name` и далее используй для ключа в `instance.__dict__`.\n" +
      "- **Lazy property с кэшем и инвалидацией.** Хранит результат в `obj.__dict__[self._name]`. При следующем чтении возвращает из кэша. `delete` (или сеттер на None) удаляет из __dict__.\n" +
      "- **TypedDescriptor — параметризуем тип.** В `__init__(self, expected_type)` запоминает тип. В `__set__` проверяет `isinstance(value, self.expected_type)`, иначе TypeError.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Когда срабатывает __set_name__?»** → При определении класса, в который встроен дескриптор. Не при создании экземпляра.\n" +
      "- **«Где хранить значение?»** → Чаще всего в `instance.__dict__[self._name]`. Это не вызовет рекурсию, потому что data-descriptor имеет приоритет над `__dict__` только для чтения (если есть __get__) — но запись через `obj.__dict__[name] = ...` обходит __set__.\n" +
      "- **«data vs non-data descriptor»** → Data-descriptor реализует и `__get__`, и `__set__` (или `__delete__`). Non-data — только `__get__`. Data имеет приоритет над `__dict__` экземпляра при поиске.\n" +
      "- **«instance is None»** → Когда `__get__` вызывают через КЛАСС (`Cls.x`), instance=None. В этом случае принято возвращать сам дескриптор: `if instance is None: return self`.\n" +
      "- **«@property vs дескриптор»** → property — частный случай дескриптора, удобен для одного класса. Дескриптор — переиспользуемая валидация на нескольких классах.\n" +
      "- **«functools.cached_property»** → Готовый ленивый дескриптор: считает один раз, потом возвращает из __dict__. Альтернатива ручному lazy property.\n" +
      "- **«Дескриптор и __slots__»** → С __slots__ нет __dict__; нужно хранить значение либо в самом дескрипторе (по WeakKeyDictionary), либо в отдельном слоте.\n" +
      "- **«Дескриптор и наследование»** → Работает: дескриптор, объявленный в родителе, виден в наследнике.\n" +
      "- **«Дескриптор для метода»** → Обычная функция уже non-data descriptor. Через её __get__ Python и делает `bound method`.\n" +
      "- **«Где НЕ использовать дескрипторы»** → В простых случаях (одно поле, одна валидация) — слишком тяжело; хватит @property.\n\n" +
      "**Написать класс с нуля (write):**\n\n" +
      "- **Дескриптор-кэш с инвалидацией зависимостей.** Считает значение лениво; имеет метод/механизм инвалидировать кэш при изменении зависимых полей.\n" +
      "- **Range-валидатор с __set_name__.** Принимает `low`, `high` в __init__; в __set__ проверяет диапазон.\n" +
      "- **Дескриптор-конвертер: автоматический парсинг.** В __set__ принимает строку и преобразует к нужному типу (int/float/datetime), сохраняет преобразованное.",
    code:
      "class Positive:\n" +
      "    def __set_name__(self, owner, name):\n" +
      "        self._name = name\n" +
      "    def __get__(self, obj, objtype=None):\n" +
      "        if obj is None: return self\n" +
      "        return obj.__dict__[self._name]\n" +
      "    def __set__(self, obj, value):\n" +
      "        if value <= 0: raise ValueError(self._name)\n" +
      "        obj.__dict__[self._name] = value\n\n" +
      "class Product:\n" +
      "    price = Positive()\n" +
      "    qty   = Positive()",
    keyTakeaways: [
      "Дескриптор = класс с __get__/__set__/__set_name__. Объявляется на УРОВНЕ КЛАССА.",
      "Хранилище — `obj.__dict__[self._name]`. instance is None → верни self.",
      "Используй дескриптор, когда логика повторяется на нескольких атрибутах/классах.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 13 — Generics, TypeVar, Protocol (углублённо)
// ---------------------------------------------------------------------------
const preview13: LessonSection[] = [
  {
    heading: "Превью раунда 13: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Generic[T] — параметризованный контейнер.** `T = TypeVar(\"T\")`. `class Box(Generic[T]):`, поле `self._value: T`. Использование: `Box[int](42)`.\n" +
      "- **TypeVar с bound — строгое ограничение.** `T = TypeVar(\"T\", bound=Comparable)`. Только типы, реализующие интерфейс Comparable.\n" +
      "- **Self и кооперативные fluent-builders.** `from typing import Self`. Метод возвращает `Self` — и наследник получит правильный тип `Subclass`, не `Base`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Generic[T]»** → Базовый класс из typing для объявления generic-классов.\n" +
      "- **«bound vs constraints»** → `bound=X` — тип должен быть подклассом X. `(A, B)` — тип должен быть РОВНО A или B.\n" +
      "- **«Self из typing»** → Появилось в Python 3.11. Возвращаемый тип, который автоматически становится конкретным подклассом.\n" +
      "- **«Protocol vs ABC»** → Protocol — структурный (без наследования). ABC — явный (требует наследования).\n" +
      "- **«@runtime_checkable»** → Делает Protocol проверяемым через `isinstance`. По именам атрибутов, не сигнатурам.\n" +
      "- **«ParamSpec — для чего?»** → Для типизации декораторов, которые сохраняют сигнатуру оборачиваемой функции.\n" +
      "- **«Optional[X] и X | None»** → Эквивалентны. `X | None` — современный синтаксис (Python 3.10+).\n" +
      "- **«TypeVar invariance»** → По умолчанию TypeVar инвариантен: `List[Cat]` НЕ подтип `List[Animal]` (потому что список изменяемый).\n" +
      "- **«Когда типизация ВРЕДНА»** → В прототипах, экспериментах, очень динамичном коде, где аннотации только мешают.",
    code:
      "from typing import Generic, TypeVar, Protocol, Self\n\n" +
      "T = TypeVar(\"T\")\n\n" +
      "class Box(Generic[T]):\n" +
      "    def __init__(self, value: T) -> None:\n" +
      "        self.value = value\n\n" +
      "class HasArea(Protocol):\n" +
      "    def area(self) -> float: ...\n\n" +
      "class Builder:\n" +
      "    def __init__(self): self.parts: list[str] = []\n" +
      "    def add(self, p: str) -> Self:\n" +
      "        self.parts.append(p)\n" +
      "        return self                  # тип Self → подкласс получит свой тип",
    keyTakeaways: [
      "Generic[T] + TypeVar(\"T\") — параметризованные классы.",
      "Protocol — структурный, без наследования. ABC — явный.",
      "Self — возвращаемый тип, корректный в подклассах.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 14 — Тестирование на pytest
// ---------------------------------------------------------------------------
const preview14: LessonSection[] = [
  {
    heading: "Превью раунда 14: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **assert в pytest и базовый тест.** Файл `test_*.py`, функция `def test_*():`. Используем обычный `assert`. Запуск: `pytest`.\n" +
      "- **Фикстуры и parametrize.** `@pytest.fixture` объявляет «подготовленный объект». Параметр функции с тем же именем — pytest подставит фикстуру. `@pytest.mark.parametrize(\"a,b,exp\", [...])` — таблица входов.\n" +
      "- **Mock и dependency injection.** `from unittest.mock import Mock`. Передаём mock в конструктор тестируемого класса; проверяем `mock.method.assert_called_once_with(...)`.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Имя файла с тестами»** → `test_*.py` или `*_test.py`. По умолчанию pytest собирает оба формата.\n" +
      "- **«Что такое фикстура?»** → Функция, помеченная `@pytest.fixture`, готовящая объект для теста (БД, временные файлы, mock-объекты).\n" +
      "- **«Скопы фикстур»** → `function` (по умолчанию), `class`, `module`, `session`. Чем шире, тем дольше живёт.\n" +
      "- **«parametrize»** → Запускает тест несколько раз с разными наборами параметров.\n" +
      "- **«MagicMock vs Mock»** → MagicMock умеет работать с magic-методами (`__len__`, `__iter__`...) из коробки.\n" +
      "- **«Dependency injection»** → Приём «принимай зависимости в конструкторе» — делает класс легко тестируемым.\n" +
      "- **«tmp_path»** → Встроенная фикстура pytest, дающая `pathlib.Path` к временному каталогу для теста.\n" +
      "- **«spec= в Mock»** → Ограничивает Mock интерфейсом реального класса; вызов несуществующего метода поднимет AttributeError.\n" +
      "- **«TDD: red-green-refactor»** → Цикл: написать падающий тест → минимально пройти → улучшить код, не ломая тестов.\n" +
      "- **«Почему нельзя тестировать приватные методы»** → Это деталь реализации; покрывать надо публичный интерфейс. Иначе тесты ломаются на каждой внутренней правке.\n\n" +
      "**Написать тест/класс с нуля (write):**\n\n" +
      "- **Тест с фикстурой и tmp_path.** Создаёт файл во временной директории, передаёт путь в тестируемую функцию, проверяет результат.\n" +
      "- **Параметризованный тест-таблица.** Несколько комбинаций входов и ожидаемых выходов одной строкой `parametrize`.\n" +
      "- **Mock внешней зависимости.** Передаём в конструктор класса mock-объект, проверяем взаимодействие.",
    code:
      "import pytest\n" +
      "from unittest.mock import Mock\n\n" +
      "@pytest.fixture\n" +
      "def user():\n" +
      "    return User(\"Anna\")\n\n" +
      "@pytest.mark.parametrize(\"a,b,exp\", [(1,2,3),(0,0,0),(-1,1,0)])\n" +
      "def test_add(a, b, exp):\n" +
      "    assert add(a, b) == exp\n\n" +
      "def test_with_mock_repo():\n" +
      "    repo = Mock()\n" +
      "    svc = Service(repo=repo)\n" +
      "    svc.do_thing()\n" +
      "    repo.save.assert_called_once()",
    keyTakeaways: [
      "test_*.py + def test_*: + assert. Запуск — pytest.",
      "@pytest.fixture готовит объект; @pytest.mark.parametrize — таблица входов.",
      "Mock + DI — стандартная связка для unit-тестов.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 15 — Concurrency: threading vs asyncio vs multiprocessing
// ---------------------------------------------------------------------------
const preview15: LessonSection[] = [
  {
    heading: "Превью раунда 15: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **ThreadPoolExecutor — параллельный I/O.** `from concurrent.futures import ThreadPoolExecutor`. `with ThreadPoolExecutor(max_workers=8) as ex: results = list(ex.map(fn, urls))`. Используется для I/O-bound задач (сеть, диск).\n" +
      "- **asyncio.gather: параллельные корутины.** `async def main(): results = await asyncio.gather(*coros)`. Все корутины стартуют параллельно; результат — список в порядке передачи.\n" +
      "- **multiprocessing: настоящий параллелизм для CPU.** Создаёт отдельные процессы (обходит GIL). Для CPU-bound задач (тяжёлые вычисления).\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«Что такое GIL?»** → Global Interpreter Lock. Блокировка, не дающая нескольким потокам одновременно выполнять Python-байткод. Поэтому threading хорош для I/O, не для CPU.\n" +
      "- **«Когда threads хороши»** → I/O-bound: HTTP-запросы, БД, файлы. Поток отдаёт GIL во время ожидания.\n" +
      "- **«Когда нужны процессы»** → CPU-bound: тяжёлые вычисления. Процессы обходят GIL, дают настоящую параллельность.\n" +
      "- **«asyncio модель»** → Один поток, кооперативная многозадачность через event loop. Задачи добровольно отдают управление на await.\n" +
      "- **«asyncio.run vs gather»** → run — точка входа, запускает event loop. gather — запускает несколько корутин параллельно внутри loop.\n" +
      "- **«asyncio.sleep vs time.sleep»** → asyncio.sleep — асинхронная, отдаёт управление loop'у. time.sleep — БЛОКИРУЕТ всё (даже в async функции).\n" +
      "- **«Future.result()»** → Блокирующий вызов: ждёт завершения, возвращает результат (или поднимает исключение).\n" +
      "- **«Race condition»** → Состояние гонки: результат зависит от непредсказуемого порядка выполнения. Обычно — несколько потоков пишут в общую переменную без синхронизации.\n" +
      "- **«TaskGroup vs gather»** → TaskGroup (Py 3.11+) безопаснее: при первой ошибке отменяет остальные задачи.\n" +
      "- **«Сколько потоков создавать»** → Для I/O — десятки/сотни (зависит от latency). Для CPU потоки бесполезны (GIL); там процессы числом ≈ числу ядер.\n\n" +
      "**Написать с нуля (write):**\n\n" +
      "- **ThreadPoolExecutor с обработкой ошибок.** Запустить набор задач, пройти по `as_completed`, ловить `future.exception()`.\n" +
      "- **asyncio: cancel, timeout, semaphore.** `asyncio.wait_for(...)` для таймаута; `asyncio.Semaphore(n)` для ограничения числа параллельных; `task.cancel()` для отмены.\n" +
      "- **Lock и потокобезопасный счётчик.** `from threading import Lock`. `with self.lock: self.value += 1`. Без lock — race condition.",
    code:
      "import asyncio\n" +
      "from concurrent.futures import ThreadPoolExecutor\n\n" +
      "# I/O bound — потоки хорошо\n" +
      "with ThreadPoolExecutor(8) as ex:\n" +
      "    results = list(ex.map(fetch, urls))\n\n" +
      "# Кооперативная многозадачность\n" +
      "async def main():\n" +
      "    return await asyncio.gather(\n" +
      "        fetch_async(\"a\"),\n" +
      "        fetch_async(\"b\"),\n" +
      "    )\n" +
      "asyncio.run(main())",
    keyTakeaways: [
      "I/O-bound → threads или asyncio. CPU-bound → multiprocessing.",
      "GIL не даёт двум потокам выполнять Python-код одновременно. Для CPU потоки бесполезны.",
      "asyncio.sleep отдаёт управление; time.sleep — блокирует. Не путай.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ROUND 16 — Чистая архитектура
// ---------------------------------------------------------------------------
const preview16: LessonSection[] = [
  {
    heading: "Превью раунда 16: что тебе встретится в заданиях",
    body:
      "**Пропуски (fill):**\n\n" +
      "- **Repository — абстракция над хранилищем.** `class UserRepository(Protocol):` (или ABC). Методы `find(id) -> User | None`, `save(user) -> None`, `all() -> list[User]`. Реализации: `SqlUserRepository`, `InMemoryUserRepository` (для тестов).\n" +
      "- **Use Case — единица бизнес-логики.** Класс с одним методом `__call__(self, ...)` или `execute(self, ...)`. Зависит от Repository (передаётся в конструктор). Воплощает один сценарий: «зарегистрировать пользователя», «оплатить заказ».\n" +
      "- **DI-контейнер вручную и слой доставки.** Composition Root (точка сборки) — функция, создающая все зависимости и связывающая их. Слой доставки (HTTP-роуты) знает только про use cases.\n\n" +
      "**Вопросы (question):**\n\n" +
      "- **«S из SOLID»** → Single Responsibility: одна причина для изменения класса.\n" +
      "- **«D из SOLID»** → Dependency Inversion: зависим от абстракций, не от конкретных реализаций. На практике — DI через интерфейсы.\n" +
      "- **«Repository pattern»** → Абстракция над хранилищем. Бизнес-логика не знает, БД это, файл или Mock.\n" +
      "- **«Use Case»** → Один сценарий бизнес-логики. Тонкая координация между domain и репозиториями.\n" +
      "- **«Composition Root»** → Единственное место, где создаются конкретные реализации зависимостей. Обычно в `main()`.\n" +
      "- **«Зачем DTO»** → Data Transfer Object: чистая структура для передачи данных между слоями. Защищает domain от формата HTTP/БД.\n" +
      "- **«Unit of Work»** → Паттерн: один объект собирает изменения нескольких репозиториев и коммитит транзакцией.\n" +
      "- **«Anemic Domain Model»** → Антипаттерн: домены без поведения, вся логика в сервисах. Уместно только в простых CRUD'ах.\n" +
      "- **«Тонкий контроллер»** → HTTP-обработчик ничего не делает кроме валидации входа, вызова use case и форматирования ответа.\n" +
      "- **«Когда Clean Architecture — оверкилл»** → Прототип, MVP, простой CRUD без бизнес-правил, маленькая команда. Архитектура — инструмент под задачу.\n\n" +
      "**Написать с нуля (write):**\n\n" +
      "- **Repository: контракт + тестовая реализация.** Protocol/ABC + InMemoryRepo для тестов. Реальный SqlRepo — отдельно.\n" +
      "- **Use Case с DI и доменной ошибкой.** `class RegisterUser:` с `__init__(self, repo)`. Метод `__call__` валидирует, вызывает repo, на конфликте — поднимает `EmailAlreadyExists` (доменное исключение).\n" +
      "- **Service Layer + транзакция.** Сервис, оборачивающий несколько действий в одну транзакцию (Unit of Work). При ошибке — откат.",
    code:
      "from typing import Protocol\n\n" +
      "class User: ...\n\n" +
      "class UserRepo(Protocol):\n" +
      "    def find(self, id_: int) -> User | None: ...\n" +
      "    def save(self, user: User) -> None: ...\n\n" +
      "class RegisterUser:\n" +
      "    def __init__(self, repo: UserRepo) -> None:\n" +
      "        self.repo = repo\n" +
      "    def __call__(self, email: str) -> User:\n" +
      "        user = User(id_=None, email=email)\n" +
      "        self.repo.save(user)\n" +
      "        return user\n\n" +
      "# Composition Root\n" +
      "def main():\n" +
      "    use_case = RegisterUser(repo=SqlUserRepo())\n" +
      "    Http(use_case).serve()",
    keyTakeaways: [
      "Repository = абстракция над хранилищем. Use Case = один сценарий бизнес-логики.",
      "DI через конструктор делает классы тестируемыми; mock репозитория = unit-тест без БД.",
      "Архитектура под задачу. Прототип — плоско. Долгоживущий продукт — слои.",
    ],
  },
];

export const LESSON_PREVIEWS: Record<number, LessonSection[]> = {
  1: preview1,
  2: preview2,
  3: preview3,
  4: preview4,
  5: preview5,
  6: preview6,
  7: preview7,
  8: preview8,
  9: preview9,
  10: preview10,
  11: preview11,
  12: preview12,
  13: preview13,
  14: preview14,
  15: preview15,
  16: preview16,
};
