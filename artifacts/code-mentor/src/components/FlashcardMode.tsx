import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Home,
  CheckCircle2,
  XCircle,
  Shuffle,
  BookOpen,
  Trophy,
  Zap,
} from "lucide-react";
import { highlightPython } from "@/lib/highlight";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  code?: string;
  /** Annotation for each line of code (null = no annotation). Index = line number (0-based). */
  codeLines?: (string | null)[];
  category: string;
}

// ── AnnotatedCode ─────────────────────────────────────────────────────────────
function AnnotatedCode({ code, codeLines }: { code: string; codeLines?: (string | null)[] }) {
  const lines = code.split("\n");
  const hasAnnotations = codeLines && codeLines.some((a) => a != null);

  if (!hasAnnotations) {
    return (
      <pre
        className="code-block rounded-xl text-sm overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: highlightPython(code) }}
      />
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden border border-border/50 text-sm"
      style={{ background: "hsl(226 38% 5%)" }}
    >
      <div className="px-3 py-3 space-y-0.5 font-mono">
        {lines.map((line, i) => {
          const ann = codeLines?.[i] ?? null;
          return (
            <div key={i}>
              <div className="flex gap-2 leading-6">
                <span className="select-none text-[10px] text-white/20 w-4 text-right shrink-0 mt-[5px]">
                  {i + 1}
                </span>
                <pre
                  className="flex-1 min-w-0 overflow-x-auto whitespace-pre text-[13px]"
                  dangerouslySetInnerHTML={{ __html: highlightPython(line) || " " }}
                />
              </div>
              {ann && (
                <div className="flex gap-2 pb-1.5">
                  <span className="w-4 shrink-0" />
                  <div className="text-[11px] text-primary/55 italic leading-tight pl-2 border-l-2 border-primary/25">
                    {ann}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Основы ООП",
  "Наследование",
  "Полиморфизм",
  "Инкапсуляция",
  "Магические методы",
  "Абстракция",
  "Свойства",
  "MRO и множественное наследование",
  "Паттерны",
  "Декораторы",
  "Генераторы",
  "Контекст-менеджеры",
  "Dataclasses",
  "Типизация",
] as const;

const FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    category: "Основы ООП",
    front: "Что такое класс в Python?",
    back: "Класс — это шаблон (чертёж) для создания объектов. Определяет данные (атрибуты) и поведение (методы), которые будут у всех объектов этого класса. Экземпляр (объект) — конкретная «вещь», созданная по шаблону.",
    code: `class Dog:
    def __init__(self, name):
        self.name = name  # атрибут экземпляра

    def bark(self):      # метод
        print(f"{self.name}: Гав!")

rex = Dog("Рекс")   # создание экземпляра
rex.bark()           # → Рекс: Гав!`,
    codeLines: [
      "Ключевое слово class + имя (PascalCase) + двоеточие открывают тело класса",
      "Конструктор: Python вызывает автоматически при Dog(\"Рекс\")",
      "self.name — атрибут экземпляра; каждый объект хранит своё значение",
      null,
      "Обычный метод; self — ссылка на объект, Python передаёт её автоматически",
      "{self.name} в f-строке подставляет имя данного конкретного объекта",
      null,
      "Python создаёт объект и вызывает __init__(self=<obj>, name=\"Рекс\")",
      "При rex.bark() Python автоматически подставляет rex как self",
    ],
  },
  {
    id: "fc-2",
    category: "Основы ООП",
    front: "Что такое `self` и зачем он нужен?",
    back: "`self` — это ссылка на ТЕКУЩИЙ экземпляр класса. Python автоматически передаёт его первым аргументом при вызове метода. Через `self` метод получает доступ к атрибутам и другим методам именно того объекта, у которого его вызвали.",
    code: `class Counter:
    def __init__(self):
        self.count = 0        # атрибут этого объекта

    def increment(self):
        self.count += 1       # изменяем атрибут через self

c1 = Counter()
c2 = Counter()
c1.increment()
print(c1.count, c2.count)  # 1 0 — независимые объекты`,
    codeLines: [
      null,
      "Конструктор без дополнительных параметров — только self",
      "Создаём атрибут. У каждого объекта (c1, c2) свой независимый count",
      null,
      null,
      "self.count — атрибут именно этого объекта; c1 и c2 не делят count",
      null,
      "c1 и c2 — два разных объекта, каждый со своим count = 0",
      null,
      "Вызываем increment() только у c1 — c2 не затронут",
      "c1.count == 1, c2.count == 0 — они полностью независимы",
    ],
  },
  {
    id: "fc-3",
    category: "Основы ООП",
    front: "Что делает `__init__`?",
    back: "`__init__` — специальный метод-инициализатор. Python вызывает его автоматически сразу после создания нового объекта. Внутри устанавливаются все атрибуты экземпляра. Аналог конструктора в других языках.",
    code: `class Point:
    def __init__(self, x, y):   # запускается при Point(3, 4)
        self.x = x
        self.y = y
        self.label = ""         # можно задавать дефолты

p = Point(3, 4)
print(p.x, p.y)   # 3 4`,
    codeLines: [
      null,
      "Запускается автоматически при Point(3, 4). x=3, y=4 — аргументы при создании",
      "Сохраняем x в атрибут — теперь доступен во всех методах как self.x",
      "Аналогично: self.y = 4",
      "Можно задавать атрибуты со значениями по умолчанию",
      null,
      "Python вызывает __init__(self=<new_point>, x=3, y=4)",
      "Обращаемся к атрибуту через имя объекта: p.x, p.y",
    ],
  },
  {
    id: "fc-4",
    category: "Наследование",
    front: "Что такое наследование?",
    back: "Наследование — механизм, позволяющий одному классу (дочернему) перенять атрибуты и методы другого (родительского). Дочерний класс может дополнять или переопределять поведение родителя. Это принцип DRY: код не дублируется.",
    code: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):            # наследуем от Animal
    def speak(self):          # переопределяем метод
        return f"{self.name}: Мяу!"

c = Cat("Мурка")
print(c.speak())   # Мурка: Мяу!
print(c.name)      # Мурка — атрибут от Animal`,
    codeLines: [
      "Родительский (базовый) класс — общая логика для всех животных",
      null,
      "Атрибут name унаследуют все дочерние классы",
      null,
      "Метод-заглушка — дочерние классы переопределят своё поведение",
      null,
      null,
      "(Animal) в скобках — Cat наследует все атрибуты и методы Animal",
      "Переопределение (override): Cat заменяет speak() своей реализацией",
      "self.name унаследован от Animal.__init__ — не нужно писать заново",
      null,
      "Cat наследует __init__ от Animal — name задаётся так же",
      "Python вызывает Cat.speak(), а не Animal.speak() — переопределение работает!",
      "c.name — атрибут, унаследованный от Animal.__init__",
    ],
  },
  {
    id: "fc-5",
    category: "Наследование",
    front: "Что делает `super()`?",
    back: "`super()` возвращает объект-прокси к родительскому классу, что позволяет вызывать его методы. Чаще всего используется в `__init__`, чтобы инициализировать родительскую часть объекта перед добавлением своих атрибутов.",
    code: `class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # вызываем Animal.__init__
        self.breed = breed       # добавляем свой атрибут

d = Dog("Рекс", "лабрадор")
print(d.name, d.breed)  # Рекс лабрадор`,
    codeLines: [
      null,
      null,
      null,
      null,
      null,
      "Переопределяем __init__, добавляя новый параметр breed",
      "super() = прокси к Animal. Вызываем его __init__ чтобы задать self.name",
      "После super().__init__ добавляем свой атрибут breed",
      null,
      "Python вызывает Dog.__init__, который вызывает Animal.__init__ через super()",
      "d.name задан через Animal.__init__, d.breed — через Dog.__init__",
    ],
  },
  {
    id: "fc-6",
    category: "Полиморфизм",
    front: "Что такое полиморфизм?",
    back: "Полиморфизм — возможность использовать объекты разных классов через одинаковый интерфейс. Один и тот же вызов метода работает по-разному в зависимости от типа объекта. Python поддерживает полиморфизм «утиной типизацией»: если у объекта есть нужный метод — он подойдёт.",
    code: `class Dog:
    def speak(self): return "Гав!"

class Cat:
    def speak(self): return "Мяу!"

class Duck:
    def speak(self): return "Кря!"

animals = [Dog(), Cat(), Duck()]
for a in animals:
    print(a.speak())  # работает для ЛЮБОГО объекта с speak()`,
    codeLines: [
      null,
      "Dog не наследует ни от кого — просто имеет метод speak()",
      null,
      null,
      null,
      null,
      null,
      null,
      "Список объектов разных (несвязанных) классов — работает благодаря duck typing",
      null,
      "Python вызывает speak() для каждого — не важно, какого типа объект. Это полиморфизм!",
    ],
  },
  {
    id: "fc-7",
    category: "Инкапсуляция",
    front: "Что такое инкапсуляция и зачем нужны `_private`?",
    back: "Инкапсуляция — принцип сокрытия внутреннего состояния объекта. В Python:\n• `_name` (одно подчёркивание) — «не трогай извне» (соглашение)\n• `__name` (два подчёркивания) — name mangling: `_ClassName__name` — затрудняет доступ\nВнешний код работает только через публичные методы-интерфейс.",
    code: `class BankAccount:
    def __init__(self, balance):
        self.__balance = balance   # «защищённое» поле

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount

    @property
    def balance(self):             # читаем — только через property
        return self.__balance`,
    codeLines: [
      null,
      null,
      "__ (двойное подчёркивание): Python переименует в _BankAccount__balance — name mangling",
      null,
      null,
      "Валидация внутри класса — защищаем данные от некорректного ввода",
      "Изменять __balance можно только через методы; прямой доступ извне затруднён",
      null,
      "@property делает метод доступным как атрибут: obj.balance (без скобок)",
      "Чтение только через контролируемый интерфейс — инкапсуляция в действии",
    ],
  },
  {
    id: "fc-8",
    category: "Магические методы",
    front: "Что делают `__str__` и `__repr__`?",
    back: "`__str__` — вызывается при `str(obj)` и `print(obj)`. Должен возвращать «человекочитаемое» описание.\n`__repr__` — вызывается при `repr(obj)` и в консоли. Должен давать точное описание для разработчика, идеально — код для воссоздания объекта.\nПравило: `repr` для разработчика, `str` для пользователя.",
    code: `class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"   # для разработчика

    def __str__(self):
        return f"Точка ({self.x}, {self.y})"  # для пользователя

p = Point(3, 4)
print(str(p))   # Точка (3, 4)
print(repr(p))  # Point(3, 4)`,
    codeLines: [
      null,
      null,
      "Множественное присваивание: self.x, self.y = x, y одной строкой",
      null,
      "Вызывается при repr(obj), в консоли интерпретатора, при f\"{obj!r}\"",
      "Идеально — код для воссоздания объекта: eval(repr(p)) должен == p",
      null,
      "Вызывается при str(obj), print(obj), при f\"{obj}\"",
      "Читаемое описание для конечного пользователя",
      null,
      "str(p) вызывает p.__str__() → 'Точка (3, 4)'",
      "repr(p) вызывает p.__repr__() → 'Point(3, 4)'",
    ],
  },
  {
    id: "fc-9",
    category: "Магические методы",
    front: "Какие магические методы отвечают за арифметику?",
    back: "Python позволяет перегружать арифметические операторы через dunder-методы:\n`__add__` → +\n`__sub__` → -\n`__mul__` → *\n`__truediv__` → /\n`__eq__` → ==\n`__lt__` → <\n`__len__` → len()\n`__contains__` → in",
    code: `class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)  # Vector(4, 6)`,
    codeLines: [
      null,
      null,
      null,
      null,
      "__add__ вызывается при v1 + v2 — перегрузка оператора +",
      "other — правый операнд. Возвращаем новый Vector с суммой координат",
      null,
      null,
      null,
      null,
      null,
      "v1 + v2 → Python вызывает v1.__add__(v2) → новый Vector(4, 6)",
    ],
  },
  {
    id: "fc-10",
    category: "Абстракция",
    front: "Что такое абстрактный класс и `@abstractmethod`?",
    back: "Абстрактный класс (ABC) задаёт интерфейс-контракт: объявляет методы, которые ОБЯЗАНЫ реализовать все наследники. Нельзя создать экземпляр самого ABC. Импортируем из `abc`. Если наследник не реализовал абстрактный метод — TypeError при создании экземпляра.",
    code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...   # контракт — все формы считают площадь

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14 * self.r ** 2

# Shape()  ← TypeError! Нельзя
c = Circle(5)
print(c.area())   # 78.5`,
    codeLines: [
      "Импортируем ABC (Abstract Base Class) и декоратор abstractmethod",
      null,
      "Shape(ABC) делает Shape абстрактным — нельзя создать Shape() напрямую",
      "@abstractmethod объявляет контракт: все наследники ОБЯЗАНЫ реализовать area()",
      "... (Ellipsis) — тело-заглушка; реализацию дадут конкретные подклассы",
      null,
      "Circle наследует Shape и ОБЯЗАН реализовать area() — иначе TypeError",
      null,
      "Реализуем контракт: возвращаем πr²",
      null,
      "Shape() → TypeError: Can't instantiate abstract class — защита работает!",
      "Конкретный подкласс Circle создавать можно — он реализовал все контракты",
      null,
    ],
  },
  {
    id: "fc-11",
    category: "Свойства",
    front: "Что такое `@property` и зачем он нужен?",
    back: "`@property` превращает метод в «виртуальный атрибут». Снаружи обращаемся как к атрибуту (без скобок), внутри — это вызов метода. Позволяет добавить валидацию, вычисление «на лету», не ломая существующий API. Дополнительно: `@attr.setter` для записи, `@attr.deleter` для удаления.",
    code: `class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):          # читаем как атрибут
        return self._celsius

    @celsius.setter
    def celsius(self, value):   # записываем с валидацией
        if value < -273.15:
            raise ValueError("Ниже абсолютного нуля!")
        self._celsius = value

t = Temperature(25)
t.celsius = 100    # вызывает setter
print(t.celsius)   # 100`,
    codeLines: [
      null,
      null,
      "_celsius с одним подчёркиванием — соглашение «не трогай напрямую»",
      null,
      "@property: метод celsius() вызывается при чтении t.celsius (без скобок!)",
      null,
      null,
      null,
      "@celsius.setter: определяет что происходит при t.celsius = 100",
      null,
      "Валидация в setter — защита от некорректных значений",
      "Обновляем хранилище только если значение прошло проверку",
      null,
      null,
      "t.celsius = 100 → Python вызывает celsius.setter(self=t, value=100)",
      "t.celsius → Python вызывает @property celsius → возвращает self._celsius",
    ],
  },
  {
    id: "fc-12",
    category: "Свойства",
    front: "Чем отличается `classmethod` от `staticmethod`?",
    back: "`@classmethod` — получает класс (`cls`) первым аргументом. Может создавать экземпляры, обращаться к атрибутам класса. Используется для альтернативных конструкторов.\n`@staticmethod` — не получает ни `self` ни `cls`. Просто функция внутри класса. Используется для утилитарных функций, связанных с классом по смыслу.",
    code: `class Date:
    def __init__(self, y, m, d):
        self.year, self.month, self.day = y, m, d

    @classmethod
    def from_string(cls, s):        # альтернативный конструктор
        y, m, d = map(int, s.split("-"))
        return cls(y, m, d)

    @staticmethod
    def is_valid(y, m, d):          # просто утилита
        return 1 <= m <= 12 and 1 <= d <= 31

d = Date.from_string("2024-05-15")
print(Date.is_valid(2024, 5, 15))   # True`,
    codeLines: [
      null,
      null,
      null,
      null,
      "@classmethod: первый аргумент — cls (сам класс), а не self (экземпляр)",
      "Альтернативный конструктор — создаём Date из строки, а не из трёх чисел",
      "Парсим строку в три числа через map(int, ...)",
      "cls(y, m, d) = Date(y, m, d) — создаём экземпляр через класс",
      null,
      "@staticmethod: нет ни self, ни cls — просто функция внутри класса",
      null,
      "Булевое выражение: проверяем диапазоны месяца и дня",
      null,
      "Вызываем через класс, а не через экземпляр — Date.from_string(...)",
      "Статический метод тоже вызывается через класс — Date.is_valid(...)",
    ],
  },
  {
    id: "fc-13",
    category: "MRO и множественное наследование",
    front: "Что такое MRO в Python?",
    back: "MRO (Method Resolution Order) — порядок, в котором Python ищет метод при наследовании. Определяется алгоритмом C3 linearization. Смотреть: `ClassName.__mro__` или `ClassName.mro()`. Принцип: «слева направо, глубина последняя».",
    code: `class A:
    def hello(self): return "A"

class B(A):
    def hello(self): return "B"

class C(A):
    def hello(self): return "C"

class D(B, C): pass   # множественное наследование

print(D.__mro__)
# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, ...)
print(D().hello())    # B — ищем слева направо`,
    codeLines: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "D(B, C): порядок в скобках задаёт приоритет — B перед C",
      "pass — не добавляем своих методов, всё наследуем от B и C",
      null,
      "__mro__ — кортеж классов в порядке поиска метода (C3-алгоритм)",
      "Порядок: D → B → C → A → object — от конкретного к абстрактному",
      "D().hello(): ищем D? нет. B? Есть! → возвращает 'B'",
    ],
  },
  {
    id: "fc-14",
    category: "Паттерны",
    front: "Что такое паттерн Singleton?",
    back: "Singleton — паттерн, гарантирующий, что у класса есть только ОДИН экземпляр, и предоставляющий глобальную точку доступа к нему. Используется для логгеров, конфигов, пулов соединений. В Python реализуется через `__new__` или метакласс.",
    code: `class Config:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance   # всегда тот же объект!

c1 = Config()
c2 = Config()
print(c1 is c2)   # True — один и тот же объект`,
    codeLines: [
      null,
      "_instance — атрибут КЛАССА (не экземпляра). Хранит единственный объект",
      null,
      "__new__ вызывается ДО __init__, создаёт объект. cls — сам класс Config",
      "Проверяем: экземпляр уже существует?",
      "Нет — создаём ОДИН РАЗ через super().__new__(cls)",
      null,
      "Всегда возвращаем тот же экземпляр — второй не создаётся",
      null,
      "Первый вызов: __new__ создаёт объект и сохраняет в _instance",
      "Второй вызов: __new__ возвращает _instance без создания нового",
      "is проверяет идентичность объектов в памяти (не равенство значений)",
    ],
  },
  {
    id: "fc-15",
    category: "Паттерны",
    front: "Что такое паттерн Observer?",
    back: "Observer (Наблюдатель) — паттерн, при котором один объект (Subject) хранит список зависимых объектов (Observers) и автоматически оповещает их при изменении состояния. Используется в GUI, event-системах, реактивных фреймворках.",
    code: `class EventBus:
    def __init__(self):
        self._listeners = {}

    def on(self, event, fn):
        self._listeners.setdefault(event, []).append(fn)

    def emit(self, event, data=None):
        for fn in self._listeners.get(event, []):
            fn(data)

bus = EventBus()
bus.on("login", lambda u: print(f"Вошёл: {u}"))
bus.emit("login", "Анна")   # Вошёл: Анна`,
    codeLines: [
      null,
      null,
      "_listeners: словарь {событие → [список функций-наблюдателей]}",
      null,
      null,
      "setdefault(key, []) возвращает список для event, создавая его если нет; добавляем fn",
      null,
      null,
      "Вызываем всех подписчиков на событие event, передавая data",
      null,
      null,
      "Подписываем lambda как обработчик события 'login'",
      "Генерируем событие — все подписчики получают уведомление с данными",
    ],
  },
  {
    id: "fc-16",
    category: "Декораторы",
    front: "Что такое декоратор функции?",
    back: "Декоратор — функция, которая принимает другую функцию и возвращает новую (обёрнутую) функцию. Синтаксис `@decorator` — это сахар для `func = decorator(func)`. Декораторы позволяют добавлять поведение (логирование, кеширование, авторизацию) без изменения оригинального кода.",
    code: `import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} за {time.time()-start:.3f}с")
        return result
    return wrapper

@timer
def slow():
    import time; time.sleep(0.1)

slow()   # slow за 0.100с`,
    codeLines: [
      null,
      null,
      "timer принимает функцию func и возвращает обёрнутую версию",
      "@functools.wraps(func) копирует имя и docstring оригинала на wrapper",
      "*args, **kwargs — принимаем любые аргументы, чтобы передать в func",
      null,
      "Засекаем время ДО вызова оригинальной функции",
      "Вызываем оригинальную функцию с теми же аргументами",
      "Выводим затраченное время. :.3f — три знака после запятой",
      "Возвращаем результат оригинальной функции",
      null,
      null,
      "@timer = slow = timer(slow). timer получает slow и возвращает wrapper",
      null,
      null,
      "slow() → вызывает wrapper() → измеряет время → вызывает оригинальный slow()",
    ],
  },
  {
    id: "fc-17",
    category: "Генераторы",
    front: "Чем отличается генератор от обычной функции?",
    back: "Функция-генератор содержит `yield` вместо `return`. При вызове возвращает объект-генератор — итерируемый лениво. Значения вычисляются по одному при каждом `next()`. Экономит память (не создаёт весь список сразу). Генераторное выражение: `(x*2 for x in range(10))`.",
    code: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a          # «замораживает» функцию
        a, b = b, a + b  # продолжает при следующем next()

gen = fibonacci()
for _ in range(8):
    print(next(gen), end=" ")
# 0 1 1 2 3 5 8 13`,
    codeLines: [
      "yield внутри функции — она становится генератором; вызов возвращает объект",
      "Начальные значения Фибоначчи",
      "Бесконечный цикл — генератор не завершается сам; мы контролируем количество",
      "yield: отдаём значение a вызывающему коду и ПРИОСТАНАВЛИВАЕМ функцию здесь",
      "При следующем next() продолжаем отсюда и вычисляем следующую пару",
      null,
      "fibonacci() возвращает объект-генератор, НЕ вычисляет значения сразу",
      null,
      "next(gen) продвигает генератор до следующего yield и возвращает значение",
      null,
    ],
  },
  {
    id: "fc-18",
    category: "Контекст-менеджеры",
    front: "Как создать свой контекст-менеджер?",
    back: "Два способа:\n1. Класс с `__enter__` и `__exit__`\n2. Декоратор `@contextmanager` из `contextlib` с `yield`\n\n`__enter__` — выполняется при входе в `with`\n`__exit__(exc_type, exc_val, tb)` — при выходе (в т.ч. при ошибке). Если возвращает `True` — исключение подавляется.",
    code: `from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    yield                              # тело with-блока
    print(f"Время: {time.time()-start:.3f}с")

with timer():
    sum(range(1_000_000))   # Время: 0.05с`,
    codeLines: [
      null,
      null,
      "@contextmanager превращает генератор в контекст-менеджер для with-блока",
      null,
      null,
      "Код ДО yield: выполняется при входе в with (аналог __enter__)",
      "yield — здесь выполняется тело with-блока. yield value передаёт значение в as",
      "Код ПОСЛЕ yield: выполняется при выходе из with (аналог __exit__)",
      null,
      "with timer(): → входим в контекст → выполняется всё до yield",
      "После блока — продолжается код после yield",
    ],
  },
  {
    id: "fc-19",
    category: "Dataclasses",
    front: "Что такое `@dataclass` и когда его использовать?",
    back: "`@dataclass` (из модуля `dataclasses`) автоматически генерирует `__init__`, `__repr__`, `__eq__` и другие методы на основе аннотаций класса. Уменьшает boilerplate. Параметры: `frozen=True` → иммутабельный (+ хешируемый), `order=True` → операторы сравнения, `slots=True` → __slots__.",
    code: `from dataclasses import dataclass, field

@dataclass
class Student:
    name: str
    age: int
    grades: list[int] = field(default_factory=list)

    def average(self) -> float:
        return sum(self.grades) / len(self.grades) if self.grades else 0.0

s = Student("Анна", 20, [10, 11, 12])
print(s)           # Student(name='Анна', age=20, grades=[10, 11, 12])
print(s.average()) # 11.0`,
    codeLines: [
      null,
      null,
      "@dataclass автоматически создаёт __init__, __repr__, __eq__ из аннотаций ниже",
      null,
      "name: str — аннотация типа; @dataclass создаст параметр name в __init__",
      "age: int — следующий параметр __init__",
      "field(default_factory=list): нельзя писать grades=[] (мутабельный дефолт!), нужна фабрика",
      null,
      "Можно добавлять обычные методы — @dataclass не ограничивает",
      "Тернарный оператор: вычисляем среднее если grades не пустой",
      null,
      "Student('Анна', 20, [10,11,12]) — __init__ сгенерирован @dataclass автоматически",
      "s → вызывает __repr__ сгенерированный @dataclass — читаемый вывод",
      null,
    ],
  },
  {
    id: "fc-20",
    category: "Типизация",
    front: "Что такое аннотации типов (type hints)?",
    back: "Аннотации типов — подсказки для IDE и статических анализаторов (mypy). Не проверяются в runtime (по умолчанию). Синтаксис: `param: int`, `-> str`. С Python 3.10+: `int | None` вместо `Optional[int]`. Встроенные дженерики: `list[int]`, `dict[str, Any]`, `tuple[int, str]`.",
    code: `from typing import Optional

def greet(name: str, times: int = 1) -> str:
    return (name + "! ") * times

def find_user(user_id: int) -> Optional[str]:
    # возвращает имя или None
    users = {1: "Анна", 2: "Иван"}
    return users.get(user_id)

print(greet("Привет", 3))    # Привет! Привет! Привет!
print(find_user(99))          # None`,
    codeLines: [
      null,
      null,
      "name: str — аргумент-строка; times: int — число; -> str — тип возврата. IDE поймёт!",
      null,
      null,
      "Optional[str] = Union[str, None] — может вернуть строку ИЛИ None",
      null,
      "dict.get(key) возвращает None если ключ не найден — поэтому нужен Optional",
      null,
      null,
      null,
    ],
  },
  {
    id: "fc-21",
    category: "Основы ООП",
    front: "Что такое «утиная типизация» (duck typing)?",
    back: "«Если оно крякает как утка и ходит как утка — это утка». Python не проверяет ТИП объекта, а проверяет, есть ли у него НУЖНЫЙ метод или атрибут. Если у объекта есть метод `speak()` — Python вызовет его, не важно к какому классу принадлежит объект. Это основа полиморфизма в Python.",
    code: `class Dog:
    def speak(self): return "Гав!"

class Robot:
    def speak(self): return "Бип-бип!"

class Stone:
    pass   # нет метода speak

def make_noise(obj):
    # Не проверяем type(obj) — просто вызываем speak()
    print(obj.speak())

make_noise(Dog())    # Гав!
make_noise(Robot())  # Бип-бип!
# make_noise(Stone()) → AttributeError: 'Stone' has no attribute 'speak'`,
    codeLines: [
      null,
      null,
      null,
      null,
      null,
      "pass — тело класса без методов. Stone не «крякает»",
      null,
      null,
      "Не проверяем isinstance(obj, Dog) — просто вызываем speak(). Duck typing!",
      null,
      null,
      null,
      "Dog и Robot несвязанные классы, но оба работают с make_noise()",
      "Stone не имеет speak() → AttributeError. Нет интерфейса — нет полиморфизма",
    ],
  },
  {
    id: "fc-22",
    category: "Основы ООП",
    front: "Что такое `__slots__` и зачем он нужен?",
    back: "`__slots__` — список разрешённых атрибутов экземпляра. Отключает `__dict__` у объектов, что:\n• Экономит память (~40–50% для каждого экземпляра)\n• Ускоряет доступ к атрибутам\n• Запрещает добавлять новые атрибуты во время выполнения\nИспользуй когда нужно миллионы экземпляров класса.",
    code: `class Point:
    __slots__ = ('x', 'y')   # только эти два атрибута

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 4)
print(p.x, p.y)   # 3 4

# p.z = 0  ← AttributeError!
# p.__dict__  ← AttributeError: нет __dict__

class PointNormal:
    def __init__(self, x, y):
        self.x = x; self.y = y

pn = PointNormal(1, 2)
print(pn.__dict__)   # {'x': 1, 'y': 2} — больше памяти`,
    codeLines: [
      null,
      "__slots__ отключает __dict__: разрешены ТОЛЬКО перечисленные атрибуты",
      null,
      null,
      "self.x и self.y — разрешены. Попытка self.z вызовет AttributeError",
      null,
      null,
      null,
      null,
      null,
      "Добавить p.z = 0 → AttributeError: __slots__ запрещает новые атрибуты",
      "Без __dict__ нет накладных расходов: Point с __slots__ занимает ~40% меньше памяти",
      null,
      "Обычный класс БЕЗ __slots__ — каждый экземпляр имеет словарь __dict__",
      null,
      null,
      null,
      "pn.__dict__ существует — гибко, но занимает больше памяти",
    ],
  },
  {
    id: "fc-23",
    category: "Типизация",
    front: "Что такое Protocol в Python и чем отличается от ABC?",
    back: "**Protocol** (из `typing`) — структурная типизация (duck typing + проверка mypy). Если у объекта есть нужные методы — он соответствует Protocol, даже без явного наследования. **ABC** — номинальная типизация: класс ОБЯЗАН явно унаследоваться (`class Dog(Animal)`).\nProtocol: проверка только mypy, нет runtime-проверки. ABC: `isinstance()` работает в runtime.",
    code: `from typing import Protocol

class Speakable(Protocol):
    def speak(self) -> str: ...   # определяем «контракт»

class Dog:                    # НЕ наследует Speakable!
    def speak(self) -> str:
        return "Гав!"

class Cat:
    def speak(self) -> str:
        return "Мяу!"

def make_noise(obj: Speakable) -> None:
    print(obj.speak())

make_noise(Dog())  # Гав!
make_noise(Cat())  # Мяу!`,
    codeLines: [
      null,
      null,
      "Speakable(Protocol) — структурный тип: любой класс с методом speak()→str подходит",
      "... — тело-заглушка. Protocol объявляет контракт, не реализует",
      null,
      "Dog НЕ пишет (Speakable) — но mypy всё равно считает его совместимым",
      "Достаточно просто иметь метод speak() → str. Структурная типизация!",
      null,
      null,
      null,
      null,
      null,
      null,
      "obj: Speakable — mypy проверит что у obj есть speak()→str в статике",
      null,
      "Dog совместим с Speakable (есть speak→str), хотя явно не наследует",
      null,
    ],
  },
  {
    id: "fc-24",
    category: "Паттерны",
    front: "Композиция vs наследование — в чём разница?",
    back: "**Наследование** («является»): Dog является Animal. Даёт общий интерфейс и переиспользование кода, но создаёт жёсткую связь.\n**Композиция** («содержит»): Car содержит Engine. Более гибко: можно менять Engine без изменения Car. Правило: предпочитай композицию наследованию, если нет явных отношений «является».",
    code: `# НАСЛЕДОВАНИЕ: класс IS-A (является)
class Animal:
    def breathe(self): return "дышу"

class Dog(Animal):   # Dog «является» Animal
    def speak(self): return "Гав!"


# КОМПОЗИЦИЯ: класс HAS-A (содержит)
class Engine:
    def start(self): return "Двигатель запущен"

class Car:
    def __init__(self):
        self.engine = Engine()   # можно заменить на ElectricEngine

    def drive(self):
        return f"{self.engine.start()} — едем!"

car = Car()
print(car.drive())   # Двигатель запущен — едем!`,
    codeLines: [
      null,
      null,
      null,
      null,
      "Dog наследует breathe() от Animal — жёсткая связь: Dog всегда будет Animal",
      null,
      null,
      null,
      null,
      null,
      null,
      "Car «содержит» Engine как атрибут. Слабая связь: легко заменить на другой движок",
      null,
      null,
      "engine.start() вызывается через ссылку. Car не знает деталей Engine",
      null,
      null,
      null,
    ],
  },
  {
    id: "fc-25",
    category: "Магические методы",
    front: "Что делает `__new__`? Чем отличается от `__init__`?",
    back: "`__new__` — создаёт НОВЫЙ экземпляр (выделяет память). Вызывается ДО `__init__`. Принимает класс (`cls`), возвращает новый объект.\n`__init__` — инициализирует уже созданный объект. Получает готовый `self`.\nПорядок: `__new__()` → `__init__()`. `__new__` нужен для Singleton, иммутабельных подклассов (`str`, `int`), метаклассов.",
    code: `class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            print("Создан новый экземпляр!")
        return cls._instance

    def __init__(self):
        print("__init__ вызван")

s1 = Singleton()   # Создан новый экземпляр! __init__ вызван
s2 = Singleton()   # только __init__ вызван
print(s1 is s2)    # True — один объект`,
    codeLines: [
      null,
      "_instance — атрибут КЛАССА для хранения единственного экземпляра",
      null,
      "__new__ вызывается первым, СОЗДАЁТ объект. cls — сам класс (не экземпляр)",
      "Проверяем: экземпляр уже существует?",
      "super().__new__(cls) — вызываем object.__new__(cls) для реального создания объекта",
      null,
      "Возвращаем всегда один и тот же объект. __init__ получит его как self",
      null,
      "__init__ вызывается ПОСЛЕ __new__, получает уже созданный объект",
      null,
      null,
      "При s1: __new__ создаёт → __init__ инициализирует",
      "При s2: __new__ возвращает существующий → __init__ вызывается снова, объект тот же",
      "s1 is s2 == True: is проверяет идентичность объектов в памяти",
    ],
  },
  {
    id: "fc-26",
    category: "Магические методы",
    front: "Что делает `__call__`?",
    back: "`__call__` делает экземпляр класса ВЫЗЫВАЕМЫМ как функция. Если у объекта `obj` есть `__call__`, то `obj(args)` вызывает `obj.__call__(args)`. Используется в декораторах-классах, функторах, мёмоизаторах.",
    code: `class Multiplier:
    """Функтор — объект, который можно вызвать как функцию."""

    def __init__(self, factor):
        self.factor = factor

    def __call__(self, value):
        return value * self.factor

double = Multiplier(2)
triple = Multiplier(3)

print(double(5))   # 10  ← вызываем как функцию!
print(triple(4))   # 12

print(callable(double))  # True
print(callable(42))      # False — int не вызываемый`,
    codeLines: [
      null,
      null,
      null,
      null,
      "Сохраняем factor как атрибут — используем при каждом вызове объекта",
      null,
      "__call__ вызывается при double(5). Делает экземпляр «вызываемым»",
      "Функтор хранит настройку (factor) и применяет её при каждом вызове",
      null,
      "double — объект, не функция. Но имеет __call__, поэтому ведёт себя как функция",
      null,
      null,
      "double(5) → Python вызывает double.__call__(5) → 5 * 2 = 10",
      null,
      null,
      "callable() проверяет наличие __call__: у double есть, у 42 — нет",
      null,
    ],
  },
  {
    id: "fc-27",
    category: "Основы ООП",
    front: "В чём разница между `==` и `is`?",
    back: "`==` — сравнение ЗНАЧЕНИЙ (вызывает `__eq__`). Два разных объекта с одинаковым содержимым равны.\n`is` — сравнение ИДЕНТИЧНОСТИ (тот же объект в памяти, одинаковый id()). Используй `is` только для `None`, `True`, `False` и проверки идентичности объектов.",
    code: `a = [1, 2, 3]
b = [1, 2, 3]    # новый список, те же данные
c = a            # тот же объект (ссылка)

print(a == b)    # True  — одинаковые ЗНАЧЕНИЯ
print(a is b)    # False — разные ОБЪЕКТЫ в памяти

print(a is c)    # True — один и тот же объект!

print(id(a))     # адрес в памяти
print(id(b))     # другой адрес
print(id(c))     # тот же адрес что у a

x = None
if x is None:    # правильно — is для None (PEP 8)
    print("x это None")`,
    codeLines: [
      null,
      "Создаём НОВЫЙ список с теми же данными — другой объект в памяти",
      "c = a: c — псевдоним, не копия. c и a указывают на один объект",
      null,
      "== вызывает __eq__: сравнивает содержимое. [1,2,3] == [1,2,3] → True",
      "is сравнивает id(): a и b — разные объекты в памяти → False",
      null,
      "c — тот же объект что a: оба и == и is → True",
      null,
      "id() возвращает адрес объекта — уникальный идентификатор",
      "id(b) ≠ id(a) — разные объекты",
      "id(c) == id(a) — один объект, просто два имени",
      null,
      "Для None всегда используй is, а не == — это питоновский стиль (PEP 8)",
      null,
    ],
  },
  {
    id: "fc-28",
    category: "Декораторы",
    front: "Что такое мемоизация и `@lru_cache`?",
    back: "Мемоизация — кеширование результатов функции по входным аргументам. При повторном вызове с теми же аргументами возвращается сохранённый результат без пересчёта.\n`@lru_cache(maxsize=128)` из `functools` добавляет мемоизацию в одну строку. LRU = Least Recently Used — вытесняет редко используемые кеш-записи.",
    code: `from functools import lru_cache

def fib_slow(n):
    if n <= 1: return n
    return fib_slow(n-1) + fib_slow(n-2)  # O(2^n)!

@lru_cache(maxsize=None)   # None = неограниченный кеш
def fib_fast(n):
    if n <= 1: return n
    return fib_fast(n-1) + fib_fast(n-2)  # O(n) с кешем!

print(fib_slow(30))   # медленно...
print(fib_fast(30))   # мгновенно
print(fib_fast.cache_info())   # hits, misses, maxsize, currsize`,
    codeLines: [
      null,
      null,
      null,
      null,
      "Рекурсия без кеша — exponential. fib(40) делает ~2⁴⁰ ≈ 1 трлн вызовов!",
      null,
      "@lru_cache хранит результаты в словаре {(n,): результат}. При повторном вызове — возвращает сохранённое",
      null,
      null,
      "При повторном fib_fast(n-2) — результат уже в кеше → O(n) вместо O(2ⁿ)",
      null,
      null,
      "cache_info() показывает статистику: сколько раз попали в кеш и сколько промахов",
    ],
  },
  {
    id: "fc-29",
    category: "Магические методы",
    front: "Как сделать класс итерируемым? `__iter__` и `__next__`",
    back: "Для использования в `for item in obj:` класс должен реализовать протокол итератора:\n• `__iter__` — возвращает объект-итератор (часто `return self`)\n• `__next__` — возвращает следующее значение или поднимает `StopIteration`\nЕсли у класса есть `__iter__` — он **итерируемый**. Если ещё и `__next__` — он **итератор**.",
    code: `class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        self.current = self.start
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration   # сигнал завершения итерации
        value = self.current
        self.current -= 1
        return value

for n in Countdown(5):
    print(n, end=" ")   # 5 4 3 2 1

print(list(Countdown(3)))   # [3, 2, 1]`,
    codeLines: [
      null,
      null,
      null,
      null,
      "__iter__: вызывается при входе в for-цикл. Инициализирует состояние и возвращает итератор",
      "self.current — текущее значение; будет изменяться на каждой итерации",
      "return self: сам объект является итератором (реализует __next__)",
      null,
      "__next__: вызывается при каждой итерации for-цикла",
      "StopIteration — исключение-сигнал: итерация завершена. for-цикл поймает его",
      null,
      "Возвращаем текущее значение и уменьшаем счётчик",
      null,
      null,
      null,
      "Работает с for — Python вызывает iter() и next() автоматически",
      null,
      "Работает с list(), sum(), any(), all() — любой код, ожидающий итерируемое",
    ],
  },
  {
    id: "fc-30",
    category: "MRO и множественное наследование",
    front: "Что такое метакласс (metaclass)?",
    back: "Метакласс — «класс классов». Если обычный класс определяет поведение экземпляров, то метакласс определяет поведение САМИХ КЛАССОВ. `type` — метакласс по умолчанию для всех классов Python. Метаклассы используются для: автоматического добавления методов, валидации определения класса, регистрации подклассов, ORM (Django models).",
    code: `class UpperAttrMeta(type):
    """Метакласс: все атрибуты класса переводятся в ВЕРХНИЙ регистр."""

    def __new__(mcs, name, bases, attrs):
        new_attrs = {
            k.upper() if not k.startswith('_') else k: v
            for k, v in attrs.items()
        }
        return super().__new__(mcs, name, bases, new_attrs)

class MyClass(metaclass=UpperAttrMeta):
    hello = "привет"   # будет переименован в HELLO
    count = 42

print(hasattr(MyClass, 'HELLO'))   # True
print(hasattr(MyClass, 'hello'))   # False!
print(MyClass.COUNT)               # 42`,
    codeLines: [
      "UpperAttrMeta наследует type — стандартный метакласс всех Python-классов",
      null,
      null,
      "__new__ вызывается при СОЗДАНИИ класса. attrs — словарь атрибутов/методов класса",
      "Создаём новый словарь: все публичные ключи переводим в ВЕРХНИЙ регистр",
      "Не трогаем dunder-атрибуты (начинающиеся с _)",
      null,
      "Создаём класс с модифицированными атрибутами",
      null,
      "metaclass=UpperAttrMeta — при создании MyClass Python вызовет UpperAttrMeta",
      "hello → HELLO при создании класса через метакласс",
      null,
      null,
      "Атрибут hello переименован в HELLO — оригинального имени больше нет",
      "Атрибут count переименован в COUNT",
    ],
  },
  {
    id: "fc-31",
    category: "Магические методы",
    front: "Чем отличается `__getattr__` от `__getattribute__`?",
    back: "`__getattribute__` вызывается при КАЖДОМ обращении к атрибуту (`obj.x`). Если переопределить — нужно быть осторожным (легко попасть в рекурсию).\n`__getattr__` вызывается ТОЛЬКО когда атрибут НЕ найден обычным способом. Удобен для динамических атрибутов или прокси-объектов.",
    code: `class DynamicAttrs:
    def __getattr__(self, name: str):
        # Вызывается ТОЛЬКО если атрибут не найден обычным способом
        if name.startswith('get_'):
            field = name[4:]
            return lambda: f"Значение поля '{field}'"
        raise AttributeError(f"нет атрибута '{name}'")

obj = DynamicAttrs()

print(obj.get_name())     # Значение поля 'name'
print(obj.get_email())    # Значение поля 'email'`,
    codeLines: [
      null,
      "__getattr__ вызывается только если атрибут не найден в __dict__ и классе",
      null,
      "Проверяем паттерн имени: get_X → динамически создаём метод для поля X",
      "name[4:] — берём часть после 'get_': 'get_name' → 'name'",
      "Возвращаем lambda — она будет вызвана как метод: obj.get_name()",
      "Если не наш паттерн — выбрасываем AttributeError как обычно",
      null,
      null,
      null,
      "obj.get_name() → Python не нашёл get_name → вызвал __getattr__('get_name') → lambda",
      null,
    ],
  },
  {
    id: "fc-32",
    category: "Основы ООП",
    front: "Чем отличается `copy.copy()` от `copy.deepcopy()`?",
    back: "`copy.copy()` — поверхностная (shallow) копия: создаёт новый объект, но вложенные объекты остаются общими (те же ссылки).\n`copy.deepcopy()` — глубокая копия: рекурсивно копирует все вложенные объекты. Изменение копии не влияет на оригинал.\nПравило: для объектов с вложенными мутабельными данными (списки, словари) используй deepcopy.",
    code: `import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)
shallow[0].append(99)

print("original:", original)   # [[1, 2, 99], [3, 4]] — изменился!
print("shallow:", shallow)     # [[1, 2, 99], [3, 4]]

original = [[1, 2], [3, 4]]

deep = copy.deepcopy(original)
deep[0].append(99)

print("original:", original)   # [[1, 2], [3, 4]] — НЕ изменился!
print("deep:", deep)           # [[1, 2, 99], [3, 4]]`,
    codeLines: [
      null,
      null,
      "original — список списков (вложенные мутабельные объекты)",
      null,
      "copy.copy(): новый список, но вложенные списки — те же объекты (общие ссылки!)",
      "Изменяем вложенный список shallow[0] — это тот же объект что original[0]",
      null,
      "Изменение shallow[0] видно и в original — они делят вложенный список",
      null,
      null,
      null,
      "copy.deepcopy(): рекурсивно копирует ВСЕ вложенные объекты — полная независимость",
      "Изменяем вложенный список deep[0] — это ДРУГОЙ объект",
      null,
      "original не изменился — deep полностью независима от оригинала",
      null,
    ],
  },
  {
    id: "fc-33",
    category: "Свойства",
    front: "Что такое абстрактное свойство (`@abstractmethod` + `@property`)?",
    back: "Комбинация `@property` и `@abstractmethod` — создаёт свойство, которое каждый конкретный подкласс ОБЯЗАН реализовать. Нельзя создать экземпляр класса без реализации этого свойства. Это гарантирует что все подклассы предоставят нужный «виртуальный атрибут».",
    code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @property
    @abstractmethod
    def area(self) -> float:
        """Площадь — ОБЯЗАТЕЛЬНО реализовать!"""
        ...

    def describe(self) -> str:
        return f"Площадь: {self.area:.2f}"

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    @property
    def area(self) -> float:
        return 3.14159 * self.radius ** 2

c = Circle(5)
print(c.describe())   # Площадь: 78.54`,
    codeLines: [
      null,
      null,
      null,
      "@property — объявляем свойство (виртуальный атрибут)",
      "@abstractmethod — каждый конкретный подкласс ОБЯЗАН реализовать area",
      null,
      null,
      "... — тело-заглушка. Реализацию дадут конкретные подклассы",
      null,
      "describe() использует self.area — но какой именно area — решит конкретный подкласс",
      null,
      null,
      null,
      null,
      null,
      "@property — реализуем контракт. Теперь c.area работает как атрибут",
      "Возвращаем πr²",
      null,
      null,
      "c.describe() вызывает self.area — Python вызывает Circle.area property",
    ],
  },
  {
    id: "fc-34",
    category: "Паттерны",
    front: "Что такое паттерн Factory (Фабрика)?",
    back: "Фабрика — паттерн, который создаёт объекты, не зная заранее их точного типа. Код, использующий фабрику, работает с абстрактным интерфейсом — не знает какой именно класс будет создан. Преимущества: легко добавить новый тип без изменения существующего кода (OCP — Open/Closed Principle).",
    code: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self) -> str: ...

class Dog(Animal):
    def speak(self): return "Гав!"

class Cat(Animal):
    def speak(self): return "Мяу!"

def animal_factory(kind: str) -> Animal:
    registry = {"dog": Dog, "cat": Cat}
    cls = registry.get(kind)
    if cls is None:
        raise ValueError(f"Неизвестный тип: {kind}")
    return cls()

pet = animal_factory("dog")
print(pet.speak())   # Гав!`,
    codeLines: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "Фабричная функция — принимает строку-тип, возвращает объект Animal",
      "registry — словарь-маппинг: строка → класс. Легко добавить новый тип без изменения кода",
      "Получаем нужный класс из реестра (или None если не найден)",
      null,
      "cls() — создаём экземпляр. Код не знает Dog это или Cat — работает через Animal",
      null,
      "Запрашиваем 'dog' — фабрика создаёт Dog() и возвращает как Animal",
      "Вызываем speak() — полиморфизм: не знаем точный тип, но метод работает",
    ],
  },
  {
    id: "fc-35",
    category: "Паттерны",
    front: "Что такое паттерн Strategy (Стратегия)?",
    back: "Strategy — паттерн, позволяющий определить семейство алгоритмов, инкапсулировать каждый из них и делать их взаимозаменяемыми. Клиент может менять алгоритм во время выполнения, не изменяя код самого клиента. В Python — через callable или Protocol.",
    code: `from typing import Callable

def bubble_sort(data: list) -> list:
    d = data[:]
    for i in range(len(d)):
        for j in range(len(d)-i-1):
            if d[j] > d[j+1]: d[j], d[j+1] = d[j+1], d[j]
    return d

def python_sort(data: list) -> list:
    return sorted(data)

class Sorter:
    def __init__(self, strategy: Callable):
        self.strategy = strategy   # стратегия — любая функция сортировки

    def sort(self, data: list) -> list:
        return self.strategy(data)

sorter = Sorter(strategy=python_sort)
print(sorter.sort([3, 1, 2]))   # [1, 2, 3]

sorter.strategy = bubble_sort   # меняем стратегию во время выполнения!
print(sorter.sort([3, 1, 2]))   # [1, 2, 3]`,
    codeLines: [
      null,
      null,
      "Стратегия 1: пузырьковая сортировка — медленная O(n²), но понятная",
      null,
      null,
      null,
      null,
      "Стратегия 2: встроенная сортировка Python — быстрая O(n log n)",
      null,
      null,
      null,
      "strategy — атрибут-функция. Любой callable подходит — Strategy через duck typing",
      null,
      null,
      "self.strategy(data) — вызываем текущую стратегию. Sorter не знает деталей алгоритма",
      null,
      null,
      "Создаём Sorter с python_sort как стратегией по умолчанию",
      null,
      null,
      "Меняем стратегию в runtime — без пересоздания объекта Sorter!",
      null,
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function FlashcardMode({ onHome }: { onHome: () => void }) {
  const [selectedCat, setSelectedCat] = useState<string | "all">("all");
  const [cards, setCards] = useState<Flashcard[]>(() => shuffleArray(FLASHCARDS));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flipKey, setFlipKey] = useState(0);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [unknown, setUnknown] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);

  const filtered = useMemo(() => {
    return selectedCat === "all" ? cards : cards.filter((c) => c.category === selectedCat);
  }, [cards, selectedCat]);

  const current = filtered[idx];
  const progress = ((known.size + unknown.size) / filtered.length) * 100;

  const doFlip = useCallback(() => {
    setFlipped((v) => !v);
    setFlipKey((k) => k + 1);
  }, []);

  const handleKnow = useCallback(() => {
    if (!current) return;
    setKnown((prev) => new Set([...prev, current.id]));
    setUnknown((prev) => {
      const n = new Set(prev);
      n.delete(current.id);
      return n;
    });
    if (idx + 1 >= filtered.length) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
      setFlipKey((k) => k + 1);
    }
  }, [current, idx, filtered.length]);

  const handleDontKnow = useCallback(() => {
    if (!current) return;
    setUnknown((prev) => new Set([...prev, current.id]));
    setKnown((prev) => {
      const n = new Set(prev);
      n.delete(current.id);
      return n;
    });
    if (idx + 1 >= filtered.length) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
      setFlipKey((k) => k + 1);
    }
  }, [current, idx, filtered.length]);

  const handlePrev = () => {
    if (idx > 0) {
      setIdx((i) => i - 1);
      setFlipped(false);
      setFlipKey((k) => k + 1);
    }
  };

  const handleNext = () => {
    if (idx + 1 < filtered.length) {
      setIdx((i) => i + 1);
      setFlipped(false);
      setFlipKey((k) => k + 1);
    }
  };

  const handleShuffle = () => {
    setCards(shuffleArray(FLASHCARDS));
    setIdx(0);
    setFlipped(false);
    setFlipKey((k) => k + 1);
    setKnown(new Set());
    setUnknown(new Set());
    setFinished(false);
  };

  const handleRestart = () => {
    setIdx(0);
    setFlipped(false);
    setFlipKey((k) => k + 1);
    setKnown(new Set());
    setUnknown(new Set());
    setFinished(false);
  };

  const handleCatChange = (cat: string) => {
    setSelectedCat(cat);
    setIdx(0);
    setFlipped(false);
    setFlipKey((k) => k + 1);
    setKnown(new Set());
    setUnknown(new Set());
    setFinished(false);
  };

  // ── Finished screen ────────────────────────────────────────────────────────
  if (finished) {
    const total = filtered.length;
    const knownCount = known.size;
    const pct = Math.round((knownCount / total) * 100);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="h-20 w-20 rounded-full bg-primary/15 text-primary grid place-items-center mx-auto mb-6">
            <Trophy className="h-10 w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gradient">Сессия завершена!</h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-8">
            Из {total} карточек ты знаешь{" "}
            <strong className="text-emerald-400">{knownCount}</strong>, учить ещё{" "}
            <strong className="text-rose-400">{total - knownCount}</strong>
          </p>
          <div className="surface-card rounded-2xl p-6 mb-8">
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-emerald-400 font-medium">Знаю: {knownCount}</span>
              <span className="font-bold text-2xl">{pct}%</span>
              <span className="text-rose-400 font-medium">Не знаю: {total - knownCount}</span>
            </div>
            <Progress value={pct} className="h-3 [&>div]:bg-emerald-500" />
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={handleRestart} size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Повторить всё
            </Button>
            {total - knownCount > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const repeatCards = filtered.filter((c) => !known.has(c.id));
                  setCards(shuffleArray(repeatCards));
                  setIdx(0);
                  setFlipped(false);
                  setFlipKey((k) => k + 1);
                  setKnown(new Set());
                  setUnknown(new Set());
                  setFinished(false);
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Только незнакомые ({total - knownCount})
              </Button>
            )}
            <Button variant="ghost" size="lg" onClick={onHome}>
              <Home className="h-4 w-4 mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main screen ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onHome} className="h-7 px-2 -ml-1 gap-1">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Главная</span>
              </Button>
              <div className="h-4 w-px bg-border" />
              <div className="h-7 w-7 rounded-md bg-primary/15 text-primary grid place-items-center">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm">Флэшкарты</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-emerald-400 font-semibold">{known.size} ✓</span>
              <span>·</span>
              <span className="text-rose-400 font-semibold">{unknown.size} ✗</span>
              <span>·</span>
              <span>
                {idx + 1} / {filtered.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShuffle}
                className="h-6 px-2 gap-1"
              >
                <Shuffle className="h-3 w-3" />
                <span className="hidden sm:inline">Перемешать</span>
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
          {(["all", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCatChange(cat)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all border ${
                selectedCat === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat === "all" ? `Все (${FLASHCARDS.length})` : cat}
            </button>
          ))}
        </div>

        {/* Card */}
        {current && (
          <div className="mb-5">
            {/* ── Fixed flip: state-based rendering with CSS animation ── */}
            <div
              key={flipKey}
              className="animate-card-flip-in surface-card rounded-2xl border select-none"
              style={{
                borderColor: flipped ? "hsl(var(--accent) / 0.2)" : "hsl(var(--primary) / 0.2)",
              }}
            >
              {!flipped ? (
                /* Front */
                <div
                  className="p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] sm:min-h-[260px]"
                  onClick={doFlip}
                >
                  <div className="text-xs uppercase tracking-wider text-primary/70 font-semibold mb-4 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                    {current.category}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-6">
                    {current.front}
                  </h2>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Нажми, чтобы перевернуть
                  </div>
                </div>
              ) : (
                /* Back */
                <div className="p-4 sm:p-6 flex flex-col cursor-pointer" onClick={doFlip}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs uppercase tracking-wider text-accent/70 font-semibold px-2 py-1 rounded-full bg-accent/10 border border-accent/20">
                      Ответ · {current.category}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <RotateCcw className="h-3 w-3" />
                      вернуть
                    </div>
                  </div>

                  {/* Explanation text */}
                  <div className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line mb-4">
                    {current.back}
                  </div>

                  {/* Annotated code */}
                  {current.code && (
                    <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 flex items-center gap-1.5">
                        <BookOpen className="h-3 w-3" />
                        Разбор кода по строкам
                      </div>
                      <AnnotatedCode
                        code={current.code}
                        codeLines={current.codeLines}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 justify-between flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={idx === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDontKnow}
              className="gap-1.5 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/60"
            >
              <XCircle className="h-4 w-4" />
              <span className="hidden xs:inline">Не знаю</span>
            </Button>
            <Button
              size="sm"
              onClick={handleKnow}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden xs:inline">Знаю!</span>
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={idx + 1 >= filtered.length}
            className="gap-1"
          >
            Вперёд
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Tips box */}
        <div className="mt-8 sm:mt-10 surface-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            Как работать с флэшкартами:
          </div>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5">
            <li>• Прочитай вопрос на лицевой стороне — постарайся ответить мысленно</li>
            <li>• Нажми на карточку, чтобы увидеть ответ и разбор кода по строкам</li>
            <li>• «Знаю» — если ответил правильно, «Не знаю» — если нет</li>
            <li>• В конце можно повторить только незнакомые карточки</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
