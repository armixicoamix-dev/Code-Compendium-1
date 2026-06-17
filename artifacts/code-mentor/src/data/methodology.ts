export interface MethodologyConcept {
  /** Concept name as it appears in the assignment (e.g. "ABC", "@property", "super()") */
  name: string;
  /** Plain-language explanation of what it means and why we use it */
  what: string;
  /** Deep dive: how it works, edge cases, related ideas */
  details: string;
}

export interface MethodologyStep {
  title: string;
  /** What we're doing in this step, in plain words */
  goal: string;
  /** Action items, line by line */
  steps: string[];
  /** Concept-by-concept explanations of every new idea introduced in this step */
  concepts?: MethodologyConcept[];
  /** Optional code-shaped sketch (NOT working code, just structure to imitate) */
  skeleton?: string;
  /** Sample of what the program prints at this step (when applicable) */
  expectedOutput?: string;
  /** A wisdom-tip from the teacher */
  tip?: string;
}

export const FINAL_ASSIGNMENT = {
  title: "Финальное задание для учителя",
  description:
    "Дорогой студент! Основываясь на пройденном материале, напиши на Python небольшую программу — «Систему учёта учеников школы». Покажи учителю работающий код и пояснения. Ниже — описание задания. Кнопка «Открыть методичку» внизу раскроет МЕГА ПОДРОБНОЕ руководство, как именно к этому подойти. Внутри — шаги, разбор каждой концепции, ожидаемый вывод программы, а также почему мы делаем именно так — но НЕ готовый код. Ты должен написать его сам, опираясь на инструкции.",
  requirements: [
    "Создать абстрактный класс Person с полями name, age и абстрактным методом role().",
    "Унаследовать от Person два класса: Student (добавляет grades — список оценок) и Teacher (добавляет subject — предмет).",
    "У Student должен быть метод average() и read-only property is_excellent (True, если средняя оценка ≥ 10).",
    "У Teacher — classmethod from_string('Имя|Предмет|Возраст'), создающий учителя из строки.",
    "Класс School (композиция!) хранит список людей и имеет: add(person), students(), teachers(), top_students(n), describe().",
    "Реализовать __str__, __len__ и __contains__ у School (in проверяет наличие человека по имени).",
    "Защитить инвариант: возраст не может быть отрицательным, оценки только от 1 до 12 (через сеттеры/property).",
    "Создать школу, добавить минимум 3 студентов и 2 учителей, продемонстрировать ВСЕ методы.",
  ],
};

export const ASSIGNMENT_OVERVIEW = {
  title: "Что мы строим — общий план",
  description:
    "Перед тем как кодить, давай разберёмся в архитектуре. У нас будет 4 класса: один абстрактный (Person) и три конкретных (Student, Teacher, School). Person задаёт ОБЩИЕ свойства всех людей в школе. Student и Teacher — это конкретные роли (наследование). School — отдельный контейнер, который ВЛАДЕЕТ списком людей (это композиция, а не наследование).",
  diagram: [
    "Person (ABC)  ─┬─►  Student  (наследует Person, добавляет grades)",
    "                ├─►  Teacher  (наследует Person, добавляет subject)",
    "                                                                 ",
    "School  ──►  _people: List[Person]   ◄── композиция, не наследование",
  ],
  whyThisDesign: [
    "Person как ABC — потому что «человек вообще» в нашей системе НЕ существует. Существуют только конкретные роли (студент, учитель). ABC формально это запрещает.",
    "Student и Teacher — наследники, потому что у них есть ОБЩАЯ часть (имя, возраст, контракт role()) и СВОЯ специфика (оценки vs предмет). Это классическая «is-a» связь.",
    "School — НЕ наследник Person. Школа не «человек», она «контейнер людей». Это «has-a» связь, и для неё используется композиция (список людей внутри).",
    "Если завтра появится Janitor(Person), школа примет его без единой правки. Это и есть гибкость, которую даёт ООП.",
  ],
};

export const METHODOLOGY: MethodologyStep[] = [
  {
    title: "Шаг 1. Каркас файла и импорты",
    goal: "Создать пустой файл school.py и подключить нужные модули. Никаких классов и логики ещё нет — только подготовка.",
    steps: [
      "Создай новый файл school.py (или как ты его назовёшь).",
      "В самом верху импортируй: from abc import ABC, abstractmethod.",
      "Также понадобится from typing import List, Optional (чтобы аннотировать списки и опциональные параметры).",
      "Никакого кода вне классов на этом шаге — только импорты.",
    ],
    concepts: [
      {
        name: "ABC",
        what: "Abstract Base Class — базовый класс для абстрактных классов.",
        details:
          "Когда твой класс наследуется от ABC, Python начинает следить за абстрактными методами. Создать экземпляр такого класса напрямую станет НЕЛЬЗЯ — будет TypeError. Это формальный контракт: «прежде чем создать объект, реализуй обязательные методы».",
      },
      {
        name: "abstractmethod",
        what: "Декоратор, помечающий метод как обязательный к переопределению.",
        details:
          "Метод с @abstractmethod не имеет тела (точнее, тело — `pass` или `...`). В наследниках ОБЯЗАН быть метод с тем же именем, иначе наследник тоже останется абстрактным. Это и есть контракт.",
      },
      {
        name: "typing.List",
        what: "Тип-аннотация для списков. Помогает IDE и mypy понимать твой код.",
        details:
          "List[Person] означает «список объектов Person». Аннотация в Python НЕ проверяется во время выполнения — она только для статического анализа и читаемости. С Python 3.9+ можно писать просто list[Person] вместо List[Person].",
      },
    ],
    skeleton: `# school.py
from abc import ABC, abstractmethod
from typing import List, Optional

# (классы будут ниже)`,
    tip:
      "Сначала всегда проектируй структуру: сколько классов, кто кого наследует, кто кого содержит. Только потом начинай писать. Каркас на этом шаге — буквально 4 строки.",
  },
  {
    title: "Шаг 2. Абстрактный класс Person",
    goal: "Создать общий «корень» иерархии: класс Person, у которого есть имя и возраст, валидация возраста, и абстрактный метод role(), который ОБЯЗАН реализовать каждый наследник.",
    steps: [
      "Объяви class Person(ABC):",
      "В __init__ принимай self, name, age. Сохрани name в self._name. Возраст — через сеттер: self.age = age (это вызовет проверку).",
      "Сделай @property def age(self) и @age.setter. В сеттере проверь age >= 0, иначе raise ValueError('Возраст не может быть отрицательным').",
      "Также сделай @property def name (read-only — без сеттера).",
      "Объяви @abstractmethod def role(self): pass — без реализации.",
      "Реализуй __str__: возвращает f'{self.role()}: {self.name}, {self.age} лет'.",
    ],
    concepts: [
      {
        name: "@property",
        what: "Превращает метод в «читаемый атрибут» — обращение БЕЗ скобок.",
        details:
          "Если метод объявлен как @property, ты пишешь person.age, а не person.age(). Снаружи это выглядит как обычное поле, но за ним стоит код. Это позволяет начать с простого атрибута и потом добавить логику без поломки внешнего кода.",
      },
      {
        name: "@<имя>.setter",
        what: "Перехватывает присвоение значения свойству.",
        details:
          "@age.setter позволяет писать person.age = 25, и при этом внутри сработает твой код проверки. Без сеттера property будет read-only — попытка присвоения упадёт с AttributeError.",
      },
      {
        name: "raise ValueError",
        what: "Стандартный способ сообщить об ошибочном значении аргумента.",
        details:
          "ValueError используется, когда значение правильного ТИПА, но неподходящего СОДЕРЖАНИЯ (например, отрицательный возраст — это int, но недопустимый). Для неправильного типа используют TypeError.",
      },
      {
        name: "Инвариант объекта",
        what: "Условие, которое всегда истинно для корректного объекта.",
        details:
          "Инвариант Person — «возраст ≥ 0». Защищать инвариант нужно ВЕЗДЕ, где он может быть нарушен: в __init__, в сеттере, в любых методах, которые меняют возраст. Лучше всего — централизовать проверку в одном месте (сеттере) и везде использовать его.",
      },
    ],
    skeleton: `class Person(ABC):
    def __init__(self, name, age):
        self._name = name
        self.age = age            # через сеттер — проверится автоматически

    @property
    def name(self):
        return self._name         # read-only

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("Возраст не может быть отрицательным")
        self._age = value

    @abstractmethod
    def role(self):
        ...

    def __str__(self):
        return f"{self.role()}: {self.name}, {self.age} лет"`,
    tip:
      "Абстрактный метод — это контракт: «любой потомок ОБЯЗАН его реализовать». Если не реализуешь — Python не даст создать объект. Поэтому Person('X', 10) сразу упадёт с TypeError, а Student('X', 10) — нет, при условии что Student.role() реализован.",
  },
  {
    title: "Шаг 3. Класс Student (наследник Person)",
    goal: "Создать класс ученика. Он наследует Person (получает name, age, валидацию), добавляет список оценок, среднее, и read-only-свойство «отличник». Защищает оценки: только от 1 до 12.",
    steps: [
      "class Student(Person): объяви наследование явно.",
      "В __init__ принимай self, name, age, grades=None. Внутри: super().__init__(name, age).",
      "self._grades = list(grades) if grades else []. Список нужно копировать, чтобы внешние изменения не ломали объект.",
      "Реализуй обязательный метод def role(self): return 'Студент'.",
      "Метод add_grade(self, value): проверь 1 <= value <= 12, иначе ValueError. Затем self._grades.append(value).",
      "Метод average(self): если список пуст — верни 0.0, иначе sum(self._grades) / len(self._grades).",
      "@property def is_excellent(self): return self.average() >= 10. БЕЗ setter — чисто read-only.",
      "Также сделай @property def grades — возвращает list(self._grades) (копию, чтобы снаружи не модифицировали).",
    ],
    concepts: [
      {
        name: "super().__init__",
        what: "Вызов конструктора родительского класса.",
        details:
          "Когда ты наследуешь, родительский __init__ НЕ вызывается автоматически — это нужно сделать самому через super().__init__(...). Без этого поля родителя (name, age) не установятся, и любое обращение к ним упадёт с AttributeError.",
      },
      {
        name: "Защитное копирование",
        what: "list(grades) вместо grades — чтобы внешние изменения не сломали объект.",
        details:
          "Если ты сохранишь self._grades = grades, то снаружи кто-то может сделать grades.clear() и стереть всё. Копирование (list(grades)) разрывает связь — теперь внутренний список независим.",
      },
      {
        name: "Default-аргумент = None",
        what: "Безопасный способ задать «пустой список по умолчанию».",
        details:
          "НИКОГДА не пиши grades=[] в сигнатуре функции/метода! Этот список создастся ОДИН раз при объявлении и будет общим для всех вызовов. Используй grades=None и потом if grades is None: grades = [] (или list(grades) if grades else []).",
      },
      {
        name: "Read-only property",
        what: "@property без setter — пользователь может ЧИТАТЬ значение, но не присваивать.",
        details:
          "is_excellent — это вычисление от других данных. Присваивать ему нельзя по смыслу. Если кто-то напишет student.is_excellent = True — он получит AttributeError, и это правильно.",
      },
    ],
    skeleton: `class Student(Person):
    def __init__(self, name, age, grades=None):
        super().__init__(name, age)
        self._grades = list(grades) if grades else []

    def role(self):
        return "Студент"

    @property
    def grades(self):
        return list(self._grades)   # копия

    def add_grade(self, value):
        if not (1 <= value <= 12):
            raise ValueError("Оценка должна быть от 1 до 12")
        self._grades.append(value)

    def average(self):
        if not self._grades:
            return 0.0
        return sum(self._grades) / len(self._grades)

    @property
    def is_excellent(self):
        return self.average() >= 10`,
    tip:
      "Защищай инварианты прямо в сеттерах/методах. Никогда не доверяй пользователю, который использует твой класс — лучше явная ошибка, чем неверное состояние внутри объекта.",
  },
  {
    title: "Шаг 4. Класс Teacher (наследник Person)",
    goal: "Создать класс учителя. Тоже наследует Person, добавляет предмет. Главная фишка — classmethod from_string, альтернативный конструктор из строки формата 'Имя|Предмет|Возраст'.",
    steps: [
      "class Teacher(Person): и снова явное наследование.",
      "__init__: self, name, age, subject. super().__init__(name, age) и self.subject = subject.",
      "Реализуй def role(self): return 'Учитель'.",
      "Добавь @classmethod def from_string(cls, line): line формата 'Имя|Предмет|Возраст'.",
      "Внутри: parts = line.split('|'). Проверь len(parts) == 3, иначе ValueError.",
      "name, subject, age_str = (p.strip() for p in parts).",
      "age = int(age_str) — если не число, упадёт ValueError автоматически.",
      "Верни cls(name, age, subject).",
    ],
    concepts: [
      {
        name: "@classmethod",
        what: "Метод, который получает не self (объект), а cls (класс).",
        details:
          "classmethod вызывается через имя класса (Teacher.from_string(...)) или через экземпляр. Первый параметр cls — это сам класс. Это позволяет создавать экземпляры через cls(...) и работать с атрибутами класса.",
      },
      {
        name: "Альтернативный конструктор",
        what: "Метод, который создаёт экземпляр из ДРУГОГО формата данных.",
        details:
          "Имя из_xxx (from_string, from_dict, from_json) — устоявшаяся идиома. dict.fromkeys(), datetime.fromisoformat() — примеры из стандартной библиотеки. Это намного чище, чем плодить много разных __init__.",
      },
      {
        name: "Использование cls вместо имени класса",
        what: "Внутри classmethod — пиши cls(...), а не Teacher(...).",
        details:
          "Если кто-то отнаследуется (class HeadTeacher(Teacher)), то HeadTeacher.from_string('...') должен вернуть HeadTeacher, а не Teacher. cls указывает на «текущий класс» в иерархии — это правильное поведение для полиморфизма.",
      },
      {
        name: "str.split + str.strip",
        what: "Парсинг строки по разделителю и очистка пробелов.",
        details:
          "split('|') разбивает строку на список по символу |. strip() убирает пробелы по краям. Комбинация очень частая при парсинге CSV-подобных данных.",
      },
    ],
    skeleton: `class Teacher(Person):
    def __init__(self, name, age, subject):
        super().__init__(name, age)
        self.subject = subject

    def role(self):
        return "Учитель"

    @classmethod
    def from_string(cls, line):
        parts = line.split("|")
        if len(parts) != 3:
            raise ValueError("Ожидается 'Имя|Предмет|Возраст'")
        name, subject, age_str = (p.strip() for p in parts)
        return cls(name, int(age_str), subject)`,
    tip:
      "classmethod — отличный способ предоставить альтернативные конструкторы. Имя метода from_xxx — это устоявшаяся идиома. Не пиши вместо неё статический метод, который вернёт Teacher(...) — потеряешь полиморфизм.",
  },
  {
    title: "Шаг 5. Класс School (композиция, не наследование)",
    goal: "Создать класс школы. Школа НЕ человек — она контейнер людей. Наследования здесь нет, есть КОМПОЗИЦИЯ: School владеет списком _people: List[Person]. И предоставляет операции: add, students, teachers, top_students, describe.",
    steps: [
      "class School: ничего не наследуем — это контейнер.",
      "В __init__ принимай self, name. Сохрани self.name = name и self._people: List[Person] = [].",
      "Метод add(self, person): проверь isinstance(person, Person), иначе ValueError. Затем self._people.append(person).",
      "Метод students(self): верни [p for p in self._people if isinstance(p, Student)].",
      "Метод teachers(self): аналогично через isinstance(..., Teacher).",
      "Метод top_students(self, n): отсортируй self.students() по p.average() убыванию (key=lambda s: s.average(), reverse=True), верни срез [:n].",
      "Метод describe(self): пройди по self._people и через for p in ...: print(p) — за счёт нашего __str__ всё выведется красиво.",
    ],
    concepts: [
      {
        name: "Композиция vs наследование",
        what: "Композиция = объект СОДЕРЖИТ другие. Наследование = объект ЯВЛЯЕТСЯ другим.",
        details:
          "School не is-a Person, он has-a List[Person]. Это композиция. Правило: если ты хочешь сказать «X — это вид Y» — наследуй. Если «X содержит/использует Y» — композиция. Композиция гибче и реже приводит к проблемам с архитектурой.",
      },
      {
        name: "isinstance",
        what: "Проверка, является ли объект экземпляром класса (или его наследника).",
        details:
          "isinstance(student, Person) → True (Student наследует Person). isinstance(teacher, Student) → False. С помощью isinstance мы фильтруем людей по роли. type(p) is Person — более строгая проверка (без учёта наследников), редко нужна.",
      },
      {
        name: "List comprehension",
        what: "Компактная запись цикла, создающего список.",
        details:
          "[p for p in self._people if isinstance(p, Student)] — то же самое, что:\nresult = []\nfor p in self._people:\n    if isinstance(p, Student):\n        result.append(p)\nreturn result\n— но в одну строку и быстрее.",
      },
      {
        name: "key=lambda + reverse=True",
        what: "Сортировка по вычисляемому ключу в обратном порядке.",
        details:
          "sorted(items, key=lambda x: x.something, reverse=True) — сортировка по убыванию. lambda — это анонимная функция «дай мне что-то у объекта». Здесь key=lambda s: s.average() = «отсортируй по средней оценке».",
      },
    ],
    skeleton: `class School:
    def __init__(self, name):
        self.name = name
        self._people: List[Person] = []

    def add(self, person):
        if not isinstance(person, Person):
            raise ValueError("Можно добавлять только Person")
        self._people.append(person)

    def students(self):
        return [p for p in self._people if isinstance(p, Student)]

    def teachers(self):
        return [p for p in self._people if isinstance(p, Teacher)]

    def top_students(self, n):
        return sorted(self.students(),
                      key=lambda s: s.average(),
                      reverse=True)[:n]

    def describe(self):
        for p in self._people:
            print(p)`,
    tip:
      "Композиция гибче наследования: School ВЛАДЕЕТ списком людей. Если завтра появится класс Janitor(Person), школа примет и его без единой правки. Если бы School наследовал Person — пришлось бы переделывать всё.",
  },
  {
    title: "Шаг 6. Магические методы у School",
    goal: "Сделать School полноценным контейнером Python — таким, что len(school) работает, 'Анна' in school работает, и print(school) выводит что-то осмысленное. Это и есть dunder-методы (double underscore).",
    steps: [
      "__len__(self): верни len(self._people). Теперь работает len(school).",
      "__contains__(self, name): пройди по self._people и any(p.name == name for p in self._people). Теперь работает 'Аня' in school.",
      "__str__(self): верни f'Школа \"{self.name}\": {len(self)} чел.'.",
      "Эти три метода превращают School в полноценный контейнер: длина, in, print — всё работает так, как ожидает пользователь класса.",
    ],
    concepts: [
      {
        name: "__len__",
        what: "Поддержка функции len(obj).",
        details:
          "Когда пишешь len(school), Python вызывает school.__len__(). Должно возвращать неотрицательное int. Также __len__ влияет на bool(school): пустая школа считается False.",
      },
      {
        name: "__contains__",
        what: "Поддержка оператора `x in obj`.",
        details:
          "Когда пишешь 'Аня' in school, Python вызывает school.__contains__('Аня'). Если __contains__ не определён, Python пробует __iter__ — медленнее. Здесь мы ищем по имени, поэтому переопределяем.",
      },
      {
        name: "__str__ vs __repr__",
        what: "__str__ — для пользователя (print). __repr__ — для разработчика (REPL, отладка).",
        details:
          "print(obj) → __str__. Просто obj в REPL → __repr__. Если __str__ не определён, print использует __repr__. Хорошее правило: __repr__ должен возвращать что-то, по чему можно восстановить объект (Account('Иван', 100)).",
      },
      {
        name: "any() и all()",
        what: "Встроенные функции для проверки коллекций.",
        details:
          "any(условие for x in items) — True, если хотя бы одно условие True. all(...) — True, если ВСЕ True. Ленивая оценка: any остановится на первом True. Это эффективнее ручного цикла с break.",
      },
    ],
    skeleton: `# Внутри класса School:
def __len__(self):
    return len(self._people)

def __contains__(self, name):
    return any(p.name == name for p in self._people)

def __str__(self):
    return f'Школа "{self.name}": {len(self)} чел.'`,
    tip:
      "Каждый dunder-метод = поддержка соответствующего синтаксиса. __len__ → len(), __contains__ → in, __iter__ → for, __getitem__ → obj[i], __add__ → +. Ты делаешь свой класс «как родной» в Python.",
  },
  {
    title: "Шаг 7. Демонстрация в блоке if __name__ == '__main__'",
    goal: "Внизу файла написать сценарий, который ИСПОЛЬЗУЕТ всю систему: создаёт школу, добавляет студентов и учителей, вызывает все методы и магические операторы. Это и доказательство работоспособности, и инструкция по использованию для будущих программистов.",
    steps: [
      "В самом низу файла напиши if __name__ == '__main__':",
      "Создай school = School('Лицей №1').",
      "Добавь 3 студентов с разными оценками: school.add(Student('Аня', 16, [10, 11, 12])) и т.п.",
      "Используй Teacher.from_string('Иван Петрович|Математика|45') хотя бы раз, добавь и обычный конструктор Teacher('...', 35, '...').",
      "Вызови school.describe(), потом print(len(school)), print('Аня' in school).",
      "Выведи top-2 студентов через цикл: for s in school.top_students(2): print(s.name, s.average()).",
      "Покажи добавление оценки: ann.add_grade(11), потом print(ann.average()).",
      "Покажи property is_excellent: print(ann.is_excellent).",
    ],
    concepts: [
      {
        name: "if __name__ == '__main__'",
        what: "Стандартная защита: код внутри запускается только при ПРЯМОМ запуске файла, а не при импорте.",
        details:
          "Когда ты делаешь python school.py — переменная __name__ == '__main__' и код выполнится. Когда другой файл делает import school — переменная будет 'school' и код пропустится. Это позволяет одновременно использовать файл и как библиотеку, и как самостоятельный скрипт.",
      },
      {
        name: "Демонстрационный сценарий",
        what: "Минимальный набор вызовов, показывающий ВСЕ возможности класса.",
        details:
          "Хороший демо-блок показывает 1) обычное использование, 2) альтернативные конструкторы, 3) магические методы (len, in, print), 4) основные методы. Учитель должен увидеть, что ты использовал ВСЕ заявленные возможности.",
      },
    ],
    skeleton: `if __name__ == "__main__":
    school = School("Лицей №1")

    ann = Student("Аня", 16, [10, 11, 12])
    school.add(ann)
    school.add(Student("Борис", 17, [7, 8, 9]))
    school.add(Student("Вера", 16, [12, 12, 11, 10]))

    school.add(Teacher("Мария Петровна", 38, "Литература"))
    school.add(Teacher.from_string("Иван Петрович | Математика | 45"))

    school.describe()
    print("Всего:", len(school))
    print("Есть Аня:", "Аня" in school)

    print("Топ-2:")
    for s in school.top_students(2):
        print(" ", s.name, "—", round(s.average(), 2))

    ann.add_grade(11)
    print("Аня — отличник?", ann.is_excellent)`,
    expectedOutput: `Студент: Аня, 16 лет
Студент: Борис, 17 лет
Студент: Вера, 16 лет
Учитель: Мария Петровна, 38 лет
Учитель: Иван Петрович, 45 лет
Всего: 5
Есть Аня: True
Топ-2:
  Вера — 11.25
  Аня — 11.0
Аня — отличник? True`,
    tip:
      "if __name__ == '__main__' — стандартная защита. Демонстрационный код не запустится, если кто-то импортирует твой файл как модуль. Небольшая деталь, но профессиональный стандарт.",
  },
  {
    title: "Шаг 8. Самопроверка перед сдачей",
    goal: "Прогнать все edge cases и убедиться, что система ведёт себя правильно при ошибках. Учитель часто проверяет именно это: «а что, если…?»",
    steps: [
      "Запусти файл: python school.py. Должны быть выведены данные всех людей, длина школы, проверка in, топ-студентов.",
      "Передай отрицательный возраст: try: Student('X', -5); except ValueError as e: print(e). Должно сработать.",
      "Передай оценку 13: try: ann.add_grade(13); except ValueError as e: print(e). Должно сработать.",
      "Попробуй создать Person('X', 10) напрямую — Python должен возбудить TypeError ('Can't instantiate abstract class').",
      "Попробуй Teacher.from_string('кривая_строка') — должна быть ValueError.",
      "Попробуй school.add('строка') — должна быть ValueError ('Можно добавлять только Person').",
      "Прогон через PEP 8: имена snake_case, отступы 4 пробела, пустые строки между методами.",
      "Если всё это работает — задание готово к показу учителю.",
    ],
    concepts: [
      {
        name: "try/except для тестирования",
        what: "Способ убедиться, что код «правильно падает» при неверном вводе.",
        details:
          "Хороший класс не просто работает с правильными данными — он ВНЯТНО ОТКАЗЫВАЕТСЯ работать с неправильными. try/except позволяет проверить, что нужное исключение действительно поднимается. Это базовая дисциплина «defensive programming».",
      },
      {
        name: "PEP 8",
        what: "Официальный стайлгайд Python.",
        details:
          "Главное: 4 пробела отступа, snake_case для функций и переменных, PascalCase для классов, пустая строка между методами в классе, две пустых строки между классами. Учитель моментально видит небрежный код.",
      },
      {
        name: "Тест абстрактности",
        what: "Person('X', 10) должен упасть — это доказывает, что ABC работает.",
        details:
          "Если этот тест НЕ падает — значит, ты забыл унаследоваться от ABC или забыл @abstractmethod. Это контрольная точка качества контракта.",
      },
    ],
    expectedOutput: `(Базовый прогон выводит то же, что в шаге 7)

# Дополнительные проверки:
ValueError: Возраст не может быть отрицательным
ValueError: Оценка должна быть от 1 до 12
TypeError: Can't instantiate abstract class Person with abstract method role
ValueError: Ожидается 'Имя|Предмет|Возраст'
ValueError: Можно добавлять только Person`,
    tip:
      "Учитель ценит не объём кода, а аккуратность: проверки, понятные имена, осмысленные сообщения об ошибках, демонстрация всех заявленных возможностей. Программа, которая «ломается красиво», — это профессиональная программа.",
  },
];

export const FINAL_WALKTHROUGH = {
  title: "Сводка: что и зачем мы сделали",
  description:
    "После того, как ты прошёл все 8 шагов, давай ещё раз пройдёмся по архитектуре целиком и убедимся, что ты понимаешь КАЖДОЕ решение.",
  sections: [
    {
      heading: "Person как ABC",
      body:
        "Зачем абстрактный, а не обычный класс? Чтобы запретить создание «человека вообще». В нашей предметной области бывают только студенты и учителя (и потенциально кто-то ещё). Person без role() не имеет смысла. ABC формализует это правило на уровне языка.",
    },
    {
      heading: "Property age и валидация",
      body:
        "Возраст не может быть отрицательным — это инвариант. Мы проверяем его в одном месте (сеттере) и используем сеттер ВЕЗДЕ, где значение присваивается (включая __init__). Это гарантирует, что некорректный объект просто не существует.",
    },
    {
      heading: "Student.is_excellent — read-only property",
      body:
        "is_excellent — это вычисление от оценок, а не отдельное поле. Если бы мы хранили его отдельно, после каждой add_grade пришлось бы обновлять. Property пересчитывается ПРИ КАЖДОМ ОБРАЩЕНИИ — данные всегда актуальны.",
    },
    {
      heading: "Teacher.from_string как classmethod",
      body:
        "Альтернативный конструктор — устоявшийся паттерн. Использование cls вместо Teacher даёт автоматическую полиморфию: HeadTeacher.from_string('...') вернёт HeadTeacher без переопределения метода.",
    },
    {
      heading: "School как композиция",
      body:
        "Школа НЕ человек, а контейнер людей. Наследование здесь было бы ошибкой: School не должна наследовать age и role. Композиция (хранение списка) — правильное решение, оно гибкое и расширяемое.",
    },
    {
      heading: "isinstance вместо if type(p) == Student",
      body:
        "isinstance работает с наследниками: если завтра кто-то сделает HonorStudent(Student), он автоматически попадёт в school.students(). С type(p) == Student — нет. isinstance — почти всегда правильный выбор.",
    },
    {
      heading: "Магические методы у School",
      body:
        "len(school), 'Анна' in school, print(school) — это идиоматичный интерфейс Python. Пользователь класса использует привычные встроенные операции — len(), in, print — вместо нестандартных методов вроде «школа.размер()». В этом и состоит признак качественного дизайна.",
    },
    {
      heading: "Поднятие исключений вместо «тихого» возврата",
      body:
        "Вместо return False при ошибке — raise ValueError. Молчаливые ошибки приводят к багам, которые проявляются далеко от места проблемы. Громкие — мгновенно показывают, где сломалось.",
    },
  ],
};

export const GRADE_DESCRIPTIONS: Record<number, { label: string; comment: string }> = {
  1: {
    label: "Начало пути",
    comment:
      "Похоже, тема пока чужая. Это нормально! Вернись к Раунду 1, перечитай теорию о классах и __init__, и попробуй ещё раз — всё прояснится.",
  },
  2: {
    label: "Начало пути",
    comment:
      "Базовые понятия требуют закрепления. Попробуй сам, без подсказок, написать пару классов с одним-двумя методами.",
  },
  3: {
    label: "Первые шаги",
    comment:
      "Уже что-то получается! Сосредоточься на различии self/cls и роли __init__. Это фундамент для всего остального.",
  },
  4: {
    label: "Первые шаги",
    comment: "Понимание появляется. Попрактикуйся в инкапсуляции и property — это даст уверенность.",
  },
  5: {
    label: "Удовлетворительно",
    comment:
      "Базовый уровень освоен. Следующий шаг — наследование и super(). Постарайся написать собственную небольшую иерархию классов.",
  },
  6: {
    label: "Удовлетворительно",
    comment: "Идёшь в правильном направлении. Подтяни тему наследования и переопределения методов.",
  },
  7: {
    label: "Хорошо",
    comment:
      "Хорошее владение основами. Уверенно работаешь с классами и базовым наследованием. Углубись в полиморфизм и абстрактные классы.",
  },
  8: {
    label: "Хорошо",
    comment:
      "Уверенный уровень. ABC и MRO — твоя следующая остановка. Попрактикуйся с множественным наследованием.",
  },
  9: {
    label: "Очень хорошо",
    comment:
      "Сильно! Понимаешь полиморфизм, абстрактные классы и большинство dunder-методов. Шлифуй магические методы.",
  },
  10: {
    label: "Отлично",
    comment:
      "Отличный результат. Композиция, dunder-методы и dataclass — всё в активе. Можешь смело браться за реальные проекты.",
  },
  11: {
    label: "Превосходно",
    comment:
      "Высокий уровень. Ты не просто решаешь задачи — ты понимаешь дизайн ООП. Следующий шаг — паттерны проектирования.",
  },
  12: {
    label: "Безупречно",
    comment:
      "Высший балл. Ты владеешь Python ООП на профессиональном уровне. Мог бы объяснить эти темы другим.",
  },
};
