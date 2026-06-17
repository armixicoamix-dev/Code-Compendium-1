import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SmartCodeEditor } from "@/components/SmartCodeEditor";
import { PythonRunner } from "@/components/PythonRunner";
import { Home, Code2, RotateCcw, Copy, Check, Lightbulb } from "lucide-react";

interface Example {
  title: string;
  description: string;
  code: string;
  concepts: string[];
  tip: string;
}

const EXAMPLES: Example[] = [
  {
    title: "Привет, Мир!",
    description: "Базовый синтаксис Python",
    concepts: ["print()", "input()", "f-строки", "переменные", "типы данных"],
    tip: "Попробуй: измени текст в print(), запусти и посмотри на вывод. Введи своё имя когда появится диалог.",
    code: `# ════════════════════════════════════════
#  Привет, Мир! — основы синтаксиса Python
# ════════════════════════════════════════

# print() — выводит текст на экран (стандартный вывод)
# Строки можно писать в одинарных или двойных кавычках — разницы нет
print("Привет, Мир!")
print('Python — лучший язык!')

# Несколько значений через запятую — выведутся с пробелом между ними
print("Сумма:", 2 + 3, "Произведение:", 2 * 3)

# Переменная — именованная ячейка памяти
# Python определяет тип автоматически при присвоении (динамическая типизация)
name = input("Как тебя зовут? ")  # input() всегда возвращает str

# f-строка (f"...") — форматированная строка, Python 3.6+
# Всё внутри {} вычисляется как Python-выражение и подставляется
print(f"Привет, {name}!")
print(f"Длина твоего имени: {len(name)} символов")

# Математические операции прямо внутри f-строки
age = 20                    # int — целое число
print(f"Через 5 лет тебе будет {age + 5} лет")

# Разные типы данных
height = 1.75               # float — дробное число
is_student = True           # bool — логическое значение

# :.2f в f-строке — форматирование: 2 знака после запятой
print(f"Рост: {height:.2f} м, Студент: {is_student}")
`,
  },
  {
    title: "Класс Dog",
    description: "Основы ООП — класс, атрибуты, методы",
    concepts: ["class", "__init__", "self", "атрибут экземпляра", "атрибут класса", "__repr__"],
    tip: "Создай третий объект Dog с другим именем и породой. Вызови у него bark() и info(). Обрати внимание: у каждого объекта свои данные.",
    code: `# ════════════════════════════════════════
#  Класс Dog — основы объектно-ориентированного программирования
# ════════════════════════════════════════

class Dog:
    """Строка документации (docstring) — описание класса.
    Доступна через Dog.__doc__ или help(Dog)."""

    # Атрибут КЛАССА — один общий для ВСЕХ экземпляров
    # Обращение: Dog.species  или  self.species (из метода)
    species = "Canis familiaris"

    # __init__ — метод-инициализатор (аналог конструктора)
    # Python вызывает его автоматически при создании объекта: Dog("Рекс", ...)
    # self — ссылка на создаваемый объект (первый аргумент всегда)
    def __init__(self, name: str, breed: str, age: int):
        # Атрибуты ЭКЗЕМПЛЯРА — уникальны для каждого объекта
        # self.name = name  читается так: "этому объекту присвоить атрибут name"
        self.name = name      # строка с именем собаки
        self.breed = breed    # строка с породой
        self.age = age        # целое число — возраст

    # Обычный метод — получает self как первый аргумент
    # При вызове rex.bark() Python автоматически подставляет self = rex
    def bark(self) -> str:
        return f"{self.name}: Гав!"

    def info(self) -> str:
        # Многострочная f-строка — внутри {} полноценные выражения
        return f"{self.name} ({self.breed}), {self.age} лет"

    def birthday(self) -> None:
        """Увеличить возраст на 1 год."""
        self.age += 1         # изменяем атрибут через self
        print(f"{self.name} стал старше! Теперь {self.age} лет.")

    # __repr__ — строковое представление для разработчика
    # Используется в отладчике, при print() для списка объектов и repr()
    # Хорошая практика: __repr__ должен воспроизводить объект
    def __repr__(self) -> str:
        return f"Dog('{self.name}', '{self.breed}', {self.age})"


# ── Создаём объекты (экземпляры класса) ──
# Python вызывает Dog.__new__() → Dog.__init__(rex, "Рекс", ...)
rex = Dog("Рекс", "немецкая овчарка", 3)
buddy = Dog("Бади", "лабрадор", 5)

# ── Работаем с объектами ──
print(rex.bark())          # Рекс: Гав!
print(buddy.info())        # Бади (лабрадор), 5 лет

# Атрибут класса доступен через класс и через экземпляр
print(f"Вид (через класс): {Dog.species}")
print(f"Вид (через объект): {rex.species}")  # тот же атрибут класса!

# __repr__ вызывается автоматически при print(объект)
print(repr(rex))           # Dog('Рекс', 'немецкая овчарка', 3)

# Вызов метода, изменяющего состояние объекта
rex.birthday()             # Рекс стал старше! Теперь 4 лет.
print(rex.info())          # Рекс (немецкая овчарка), 4 лет
`,
  },
  {
    title: "Наследование",
    description: "ABC, abstract method, полиморфизм",
    concepts: ["наследование", "ABC", "@abstractmethod", "super()", "полиморфизм", "type()"],
    tip: "Попробуй создать экземпляр Animal() напрямую — получишь TypeError. Это и есть смысл ABC: нельзя создать «абстрактное животное».",
    code: `# ════════════════════════════════════════
#  Наследование и полиморфизм
# ════════════════════════════════════════

from abc import ABC, abstractmethod  # ABC = Abstract Base Class

# ── Абстрактный базовый класс ──
# Нельзя создать напрямую: Animal("Кто-то", 0) → TypeError
# Задаёт КОНТРАКТ: все наследники ОБЯЗАНЫ реализовать abstractmethod
class Animal(ABC):
    """Абстрактный класс — задаёт общий интерфейс для всех животных."""

    def __init__(self, name: str, age: int):
        # Обычная инициализация — здесь всё как в обычном классе
        self.name = name
        self.age = age

    @abstractmethod               # ← этот декоратор делает метод обязательным
    def speak(self) -> str:
        """Каждое животное ОБЯЗАНО реализовать этот метод."""
        ...                       # тело не важно — используем ... как заглушку

    # Конкретный метод — наследуется всеми и работает без переопределения
    def describe(self) -> str:
        # type(self).__name__ — имя класса текущего объекта (Dog, Cat, Duck)
        # Это удобнее чем прописывать имя класса явно
        return f"{self.name} ({type(self).__name__}), {self.age} лет"


# ── Конкретные классы — наследуют от Animal ──
class Dog(Animal):
    # Реализуем abstractmethod — обязательно!
    def speak(self) -> str:
        return f"{self.name}: Гав-гав!"

    # Можно добавлять свои методы
    def fetch(self) -> str:
        return f"{self.name} приносит мяч!"


class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name}: Мяу!"

    def purr(self) -> str:
        return f"{self.name}: Мурр..."


class Duck(Animal):
    def speak(self) -> str:
        return f"{self.name}: Кря-кря!"


# ── Полиморфизм в действии ──
# Список содержит объекты РАЗНЫХ классов, но все они Animal
animals: list[Animal] = [
    Dog("Рекс", 3),
    Cat("Мурка", 2),
    Duck("Кряша", 1),
]

print("=== Все животные говорят ===")
for animal in animals:
    # describe() работает для КАЖДОГО через наследование
    print(animal.describe())
    # speak() вызывается у каждого по-своему — это полиморфизм
    print(f"  → {animal.speak()}")

# super() — обращение к родительскому классу
class Kitten(Cat):
    def __init__(self, name: str):
        # super().__init__ вызывает Cat.__init__ (который вызывает Animal.__init__)
        super().__init__(name, age=0)   # котёнку 0 лет

    def speak(self) -> str:
        # Можно вызвать родительский метод и дополнить его
        parent_sound = super().speak()
        return parent_sound + " (тихо)"

k = Kitten("Пуговка")
print(k.describe())   # Пуговка (Kitten), 0 лет
print(k.speak())      # Пуговка: Мяу! (тихо)
`,
  },
  {
    title: "Comprehensions",
    description: "List/dict/set comprehension, генераторы",
    concepts: ["list comprehension", "dict comprehension", "set comprehension", "generator expression", "filter в comprehension"],
    tip: "Замени [x**2 for x in range(10)] на (x**2 for x in range(10)) — в скобках будет генератор, а не список. Попробуй list() и next() на нём.",
    code: `# ════════════════════════════════════════
#  Comprehensions — компактные коллекции
# ════════════════════════════════════════

# ── 1. List comprehension ──
# Обычный цикл для создания списка:
squares_loop = []
for x in range(1, 11):
    squares_loop.append(x ** 2)

# То же самое, но в одну строку — это comprehension
# Синтаксис: [выражение for переменная in итерируемое]
squares = [x ** 2 for x in range(1, 11)]
print("Квадраты 1–10:", squares)

# С условием — фильтр:
# [выражение for переменная in итерируемое if условие]
# Python добавит элемент в список ТОЛЬКО если условие истинно
evens = [x for x in range(20) if x % 2 == 0]
print("Чётные 0–18:", evens)

# Можно трансформировать строки:
words = ["python", "oop", "class", "flask"]
upper_words = [w.upper() for w in words if len(w) > 3]
print("Длинные слова заглавными:", upper_words)

print()

# ── 2. Dict comprehension ──
# Синтаксис: {ключ: значение for переменная in итерируемое}
word_lengths = {word: len(word) for word in words}
print("Длины слов:", word_lengths)

# Можно инвертировать словарь:
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
print("Инвертированный словарь:", inverted)

print()

# ── 3. Set comprehension ──
# Синтаксис: {выражение for переменная in итерируемое}
# Set автоматически убирает дубликаты — полезно для уникальных значений
numbers = [1, 2, 2, 3, 3, 3, 4, 4, 5]
unique_squares = {x ** 2 for x in numbers}
print("Уникальные квадраты (без дублей):", unique_squares)

print()

# ── 4. Generator expression ──
# Синтаксис: (выражение for переменная in итерируемое)
# НЕ создаёт список — вычисляет значения ЛЕНИВО по одному
# Экономит память при работе с большими данными
big_gen = (x ** 2 for x in range(1_000_000))  # памяти почти не тратит!

# Берём первые 5 — остальные 999995 вообще не вычисляются
first_five = [next(big_gen) for _ in range(5)]
print("Первые 5 квадратов из генератора:", first_five)

# sum() работает с генераторами — эффективнее чем список
total = sum(x ** 2 for x in range(100))   # нет промежуточного списка
print("Сумма квадратов 0–99:", total)
`,
  },
  {
    title: "Декораторы",
    description: "Функции высшего порядка, @wraps",
    concepts: ["декоратор", "closure", "functools.wraps", "*args/**kwargs", "декоратор с параметром", "стек декораторов"],
    tip: "Декоратор @timer — это просто синтаксический сахар для slow_sum = timer(slow_sum). Попробуй написать это явно без @.",
    code: `# ════════════════════════════════════════
#  Декораторы — функции, оборачивающие функции
# ════════════════════════════════════════
import functools
import time

# ── Как работает декоратор (простая версия) ──
# Декоратор — функция, которая принимает функцию и возвращает новую функцию
def timer(func):
    """Измеряет время выполнения функции и выводит результат."""

    # @functools.wraps сохраняет имя/docstring оригинальной функции
    # Без него func.__name__ стал бы "wrapper" — что сбивает с толку
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # *args — позиционные аргументы оригинальной функции
        # **kwargs — именованные аргументы оригинальной функции
        start = time.perf_counter()           # время до выполнения
        result = func(*args, **kwargs)        # вызов оригинальной функции
        elapsed = time.perf_counter() - start # время после
        print(f"[timer] {func.__name__} → {elapsed:.6f}с")
        return result                         # возвращаем результат оригинала

    return wrapper  # возвращаем wrapper, который заменит оригинальную функцию


# ── Декоратор с параметрами ──
# Нужен ещё один уровень вложенности (трёхуровневая функция)
def logger(prefix="[LOG]"):
    """Фабрика декораторов — возвращает декоратор с нужным prefix."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # func.__name__ — имя оригинальной функции (сохранено @wraps)
            print(f"{prefix} Вызов: {func.__name__}{args}")
            result = func(*args, **kwargs)
            print(f"{prefix} Результат: {result}")
            return result
        return wrapper
    return decorator  # logger() возвращает decorator, который и применяется


# ── Применение декораторов ──

# @timer — это синтаксический сахар для: slow_sum = timer(slow_sum)
@timer
def slow_sum(n: int) -> int:
    """Сумма чисел от 0 до n-1."""
    return sum(range(n))


# @logger(prefix="[MATH]") → сначала вызывается logger("[MATH]"),
# возвращает decorator, который применяется к функции add
@logger(prefix="[MATH]")
def add(a: int, b: int) -> int:
    return a + b


# Стек декораторов — применяются СНИЗУ ВВЕРХ
# Порядок: сначала logger оборачивает multiply, потом timer оборачивает logger-wrapper
@timer
@logger(prefix="[INFO]")
def multiply(a: int, b: int) -> int:
    return a * b


# ── Запускаем ──
print("=== slow_sum ===")
slow_sum(1_000_000)

print()
print("=== add ===")
add(3, 4)

print()
print("=== multiply (два декоратора) ===")
multiply(6, 7)
`,
  },
  {
    title: "Генераторы",
    description: "yield, ленивые последовательности, send()",
    concepts: ["yield", "генератор", "next()", "StopIteration", "бесконечная последовательность", "экономия памяти"],
    tip: "Попробуй: вызови fibonacci() дважды и проверь что это два независимых генератора. Каждый хранит своё состояние.",
    code: `# ════════════════════════════════════════
#  Генераторы — ленивые вычисления
# ════════════════════════════════════════

# ── Что такое генератор? ──
# Функция-генератор: содержит yield вместо return
# При вызове возвращает объект-генератор (не вычисляет!)
# Значения производятся одно за другим при каждом next()

def fibonacci():
    """Бесконечный генератор последовательности Фибоначчи.
    Не хранит все числа в памяти — только текущие a и b.
    """
    a, b = 0, 1
    while True:        # бесконечный цикл — генератор не заканчивается
        yield a        # «заморозить» функцию и вернуть a
        # При следующем next() выполнение продолжится ЗДЕСЬ
        a, b = b, a + b  # одновременное присвоение (swap без temp)


def take(n: int, gen):
    """Взять первые n значений из генератора."""
    # islice из itertools сделал бы то же самое, но это наша реализация
    return [next(gen) for _ in range(n)]


# Создаём генератор — функция НЕ выполняется пока не вызвать next()
fib = fibonacci()

# next(fib) — выполнить до следующего yield и вернуть значение
print("Первые 10 чисел Фибоначчи:", take(10, fib))

# Генератор помнит состояние — продолжаем с 11-го числа
print("Следующие 5:", take(5, fib))

print()

# ── Конечный генератор ──
def countdown(n: int):
    """Обратный отсчёт от n до 1."""
    while n > 0:
        yield n
        n -= 1
    # После этой точки генератор поднимет StopIteration автоматически

cd = countdown(5)
print("Обратный отсчёт:", list(cd))  # list() выбирает ВСЕ значения

print()

# ── Generator expression ──
# Похоже на list comprehension, но в круглых скобках
# Создаётся мгновенно, не занимает памяти для всех элементов
big_gen = (x ** 2 for x in range(1_000_000))  # 0 Мб дополнительно!

# sum() принимает генератор напрямую — не создаёт промежуточный список
total = sum(x ** 2 for x in range(100))
print(f"Сумма квадратов 0–99: {total}")

# Первые 5 квадратов из огромного генератора
print("Первые 5:", [next(big_gen) for _ in range(5)])

print()

# ── Генератор vs список ──
# Список: все 1 млн элементов в памяти (~8 Мб)
# big_list = [x**2 for x in range(1_000_000)]  # много памяти

# Генератор: только текущий элемент (~100 байт)
# big_gen = (x**2 for x in range(1_000_000))   # почти нет памяти
print("Генераторы экономят память при работе с большими данными!")
`,
  },
  {
    title: "Исключения",
    description: "try/except/else/finally, свои исключения",
    concepts: ["try/except", "else/finally", "raise", "своё исключение", "иерархия исключений", "as e"],
    tip: "Измени баланс на 1000 и запусти — посмотри как снятие 600 теперь проходит. Обрати внимание на блок finally: он выполняется ВСЕГДА.",
    code: `# ════════════════════════════════════════
#  Обработка исключений
# ════════════════════════════════════════

# ── Своё исключение ──
# Наследуем от стандартного исключения для правильной иерархии
# ValueError — подходит: "значение не корректно для операции"
class InsufficientFundsError(ValueError):
    """Ошибка: недостаточно средств на счету."""

    def __init__(self, balance: float, amount: float):
        self.balance = balance   # сохраняем данные в атрибутах
        self.amount = amount
        # super().__init__ устанавливает сообщение исключения
        super().__init__(f"Нужно {amount} ₴, есть только {balance} ₴")


class BankAccount:
    def __init__(self, balance: float = 0):
        self.balance = balance

    def deposit(self, amount: float) -> None:
        """Пополнить счёт."""
        if amount <= 0:
            # raise прерывает выполнение и бросает исключение
            raise ValueError("Сумма пополнения должна быть положительной")
        self.balance += amount
        print(f"  Пополнение +{amount} ₴ → баланс: {self.balance} ₴")

    def withdraw(self, amount: float) -> float:
        """Снять деньги. Возвращает снятую сумму."""
        if amount <= 0:
            raise ValueError("Сумма снятия должна быть положительной")
        if amount > self.balance:
            # Бросаем СВОЁ исключение с дополнительными данными
            raise InsufficientFundsError(self.balance, amount)
        self.balance -= amount
        return amount


# ── Работаем со счётом ──
account = BankAccount(500)
print(f"Начальный баланс: {account.balance} ₴\n")

# Проверяем разные операции
for amount in [100, -5, 600, 200]:
    print(f"Снятие {amount} ₴:")
    try:
        # try — блок, где может произойти исключение
        withdrawn = account.withdraw(amount)
        # эта строка выполняется только если исключения НЕ было
        print(f"  ✓ Снято {withdrawn} ₴")

    except InsufficientFundsError as e:
        # Ловим наше специфичное исключение ПЕРВЫМ
        # as e — сохраняем объект исключения в переменную e
        print(f"  ✗ Нехватка: {e}")
        print(f"    (не хватает {e.amount - e.balance} ₴)")

    except ValueError as e:
        # Потом более общее — порядок ВАЖЕН (от частного к общему)
        print(f"  ✗ Ошибка значения: {e}")

    else:
        # else — выполняется только если исключения НЕ было
        print(f"  (операция прошла успешно)")

    finally:
        # finally — выполняется ВСЕГДА, с ошибкой или без
        # Используется для закрытия файлов, соединений и т.д.
        print(f"  [баланс: {account.balance} ₴]")

    print()
`,
  },
  {
    title: "Dataclasses",
    description: "@dataclass, field(), @property, frozen",
    concepts: ["@dataclass", "field(default_factory)", "@property", "аннотации типов", "автогенерация __init__/__repr__/__eq__"],
    tip: "Добавь параметр frozen=True в @dataclass и попробуй изменить поле студента — получишь FrozenInstanceError. Так делают иммутабельные объекты.",
    code: `# ════════════════════════════════════════
#  Dataclasses — современный способ создавать классы данных
# ════════════════════════════════════════
from dataclasses import dataclass, field

# @dataclass автоматически генерирует:
# __init__(self, name, age, grades, is_enrolled) — по аннотациям
# __repr__ — красивое строковое представление
# __eq__ — сравнение по всем полям
@dataclass
class Student:
    # Обязательные поля (без default) — должны идти ПЕРВЫМИ
    name: str       # аннотация типа — подсказка для IDE и mypy
    age: int

    # Поле со значением по умолчанию
    # НЕЛЬЗЯ написать grades: list[int] = []  — это общий объект для ВСЕХ!
    # ПРАВИЛЬНО: field(default_factory=list) — каждый раз новый список
    grades: list[int] = field(default_factory=list)

    # Простой default для неизменяемых типов — OK
    is_enrolled: bool = True

    # Обычные методы работают как обычно
    def average(self) -> float:
        """Средний балл. Возвращает 0.0 если оценок нет."""
        if not self.grades:    # пустой список — False в bool-контексте
            return 0.0
        return sum(self.grades) / len(self.grades)

    def add_grade(self, grade: int) -> None:
        """Добавить оценку с валидацией."""
        if not 1 <= grade <= 12:
            raise ValueError(f"Оценка {grade} вне диапазона 1–12")
        self.grades.append(grade)

    # @property — вычисляемый атрибут (обращение без скобок)
    # student.is_excellent — НЕ student.is_excellent()
    @property
    def is_excellent(self) -> bool:
        """Отличник — средний балл >= 10."""
        return self.average() >= 10.0

    @property
    def status(self) -> str:
        """Статус студента как строка."""
        if self.average() >= 10:
            return "Відмінник 🏆"
        elif self.average() >= 7:
            return "Хороший результат"
        else:
            return "Потрібно більше зусиль"


# ── Создаём студентов ──
# @dataclass сгенерировал __init__ — вызываем как обычно
anna = Student("Анна", 20)
ivan = Student("Іван", 21, [10, 11, 12])   # с начальными оценками
petro = Student("Петро", 22, [7, 8, 9])

# Добавляем оценки
for student in [anna, ivan, petro]:
    student.add_grade(11)

print("=== Студенты ===")
for student in [anna, ivan, petro]:
    # @property вызывается как атрибут, без ()
    print(f"{student.name}: середнє {student.average():.1f} — {student.status}")

print()

# __repr__ сгенерирован автоматически — читаемый вывод
print("repr:", anna)

# __eq__ сгенерирован автоматически — сравнение по полям
copy = Student("Іван", 21, [10, 11, 12, 11])
print(f"ivan == copy: {ivan == copy}")  # True — одинаковые данные
`,
  },
];

export function CodePlayground({ onHome }: { onHome: () => void }) {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [copied, setCopied] = useState(false);
  const [activeExample, setActiveExample] = useState(0);

  const handleLoad = (idx: number) => {
    setActiveExample(idx);
    setCode(EXAMPLES[idx].code);
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [code]);

  const handleReset = () => {
    setCode(EXAMPLES[activeExample].code);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onHome} className="h-7 px-2 -ml-1 gap-1">
                <Home className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Главная</span>
              </Button>
              <div className="h-4 w-px bg-border" />
              <div className="h-7 w-7 rounded-md bg-emerald-500/15 text-emerald-400 grid place-items-center">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm">Python Playground</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 px-2 gap-1">
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Сбросить</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 gap-1">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{copied ? "Скопировано!" : "Копировать"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold">Готовые примеры</span>
            <span className="text-xs text-muted-foreground">— выбери и запусти, или пиши свой код</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleLoad(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  activeExample === i
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                    : "bg-card border-border text-muted-foreground hover:border-emerald-500/30 hover:text-foreground"
                }`}
                title={ex.description}
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card rounded-xl border border-muted/40 mb-4 overflow-hidden">
          <div className="px-4 py-2 border-b border-border/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {EXAMPLES[activeExample].title} — {EXAMPLES[activeExample].description}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {code.split("\n").length} строк
            </span>
          </div>
          <SmartCodeEditor
            value={code}
            onChange={setCode}
            placeholder={"# Напиши свой Python-код\n# Tab = 4 пробела, Enter = авто-отступ\n"}
            minHeight={360}
          />
        </div>

        <PythonRunner code={code} />

        {/* Concepts panel — what this example teaches */}
        <div className="mt-4 surface-card rounded-xl border border-muted/40 p-4">
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Что изучаем в этом примере
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES[activeExample].concepts.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            {EXAMPLES[activeExample].tip && (
              <div className="flex items-start gap-1.5 text-xs text-amber-300/90 max-w-sm">
                <Lightbulb className="h-3.5 w-3.5 mt-0.5 text-amber-400 flex-shrink-0" />
                <span className="leading-relaxed">{EXAMPLES[activeExample].tip}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Code2 className="h-4 w-4 text-emerald-400" />
              Горячие клавиши
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-foreground">Tab</kbd>
                <span>Отступ 4 пробела</span>
              </div>
              <div className="flex justify-between">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-foreground">Shift+Tab</kbd>
                <span>Убрать отступ</span>
              </div>
              <div className="flex justify-between">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-foreground">Enter</kbd>
                <span>Авто-отступ (после `:`)</span>
              </div>
              <div className="flex justify-between">
                <kbd className="px-2 py-1 rounded bg-muted font-mono text-foreground">Backspace</kbd>
                <span>Удалить 4 пробела сразу</span>
              </div>
            </div>
          </div>
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              Советы
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Python запускается прямо в браузере через Pyodide — без сервера</li>
              <li>• <code className="text-primary font-mono bg-primary/10 px-1 rounded">input()</code> показывает диалог браузера</li>
              <li>• Первый запуск загружает Pyodide (~10 сек), потом быстро</li>
              <li>• Код полностью изолирован — нет доступа к файлам или сети</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
