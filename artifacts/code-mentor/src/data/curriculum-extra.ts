/**
 * Курс — рaунды 11–16. «Архитектурный» блок.
 *
 * Структура каждого раунда: 3 fills (слова) + 3 fillLines (блоки кода) +
 * 10 открытых вопросов (без задач на «написать с нуля»).
 *
 * Раунды:
 *   11 — Метаклассы и хуки класса (type(), __init_subclass__, __class_getitem__)
 *   12 — Продвинутые дескрипторы (__set_name__, валидаторы, lazy/cached)
 *   13 — Типизация для архитекторов (Generic, TypeVar, Self, Protocol, ParamSpec)
 *   14 — Тестирование на pytest (fixtures, parametrize, mock, тестируемый код)
 *   15 — Concurrency (threading vs asyncio vs multiprocessing, GIL)
 *   16 — Чистая архитектура (Repository, DI, Use Case, Service Layer)
 */
import { Round } from "./curriculum";

// ===========================================================================
// ROUND 11 — Метаклассы и магия классов
// ===========================================================================
const round11: Round = {
  number: 11,
  title: "Метаклассы и хуки класса",
  level: "Эксперт",
  intro:
    "Класс в Python — это объект, который сам создан другим классом-фабрикой (метаклассом). На этом раунде ты увидишь, как Python собирает классы, что умеет __init_subclass__, как написать собственный метакласс и зачем нужен __class_getitem__.",
  fills: [
    {
      type: "fill",
      id: "r11-f1",
      title: "type() как фабрика классов",
      description:
        "Заполни параметры вызова type(name, bases, namespace) — это ровно то, что Python делает за тебя при объявлении class.",
      code: `# type() с тремя аргументами создаёт новый класс на лету.
# type(name: str, bases: tuple, namespace: dict) -> class

# Вариант 1: обычное объявление класса
class Greeter:
    greeting = "hi"
    def hello(self, name): return f"{self.greeting}, {name}"

# Вариант 2: то же самое, но через type()
def hello(self, name):
    return f"{self.greeting}, {name}"

Greeter2 = type(
    {{0}},                             # имя класса — строка
    {{1}},                             # базы — tuple классов
    {
        "greeting": "hi",
        "hello": {{2}},                # ссылка на функцию hello
    },
)

g = Greeter2()
print(g.hello("Alice"))                # hi, Alice
print(type(g).__name__)                # Greeter2
print(type(Greeter2).__name__)         # type  ← метаклассом класса является type
print(isinstance(Greeter2, {{3}}))     # True  — class — это инстанс типа
`,
      answers: [
        ["\"Greeter2\"", "'Greeter2'"],
        ["(object,)", "()", "(object, )"],
        ["hello"],
        ["type"],
      ],
      hints: [
        "Имя класса — строка в кавычках.",
        "Базы — кортеж. Если только object, оставь (object,) или просто пустой кортеж ().",
        "Передаём ССЫЛКУ на функцию (без скобок), а не вызов.",
        "Каждый класс — экземпляр type (если не указан другой metaclass).",
      ],
    },
    {
      type: "fill",
      id: "r11-f2",
      title: "__init_subclass__ — простой 'метакласс на минималках'",
      description:
        "Хук вызывается, когда от базы НАСЛЕДУЮТСЯ. Используется для регистрации, валидации, автонастройки.",
      code: `class Plugin:
    """База, которая регистрирует все свои подклассы в общем реестре."""
    registry: dict[str, type] = {}

    def __init_subclass__(cls, /, name: str = None, **kwargs):
        super().{{0}}(**kwargs)            # ОБЯЗАТЕЛЬНО прокинуть super
        key = name or cls.__name__.lower()
        if key in cls.registry:
            raise ValueError(f"plugin {key!r} already registered")
        cls.{{1}}[key] = cls               # положить КЛАСС в общий dict
        cls._plugin_name = key             # запомнить имя на классе


class CsvPlugin(Plugin, name="csv"):       # параметр name= идёт в __init_subclass__
    pass

class JsonPlugin(Plugin):                  # без name → key = "jsonplugin"
    pass

print(Plugin.registry)
# {'csv': <class 'CsvPlugin'>, 'jsonplugin': <class 'JsonPlugin'>}

# В этот реестр НЕ попадает сам Plugin — __init_subclass__ работает только для
# {{2}} класса, не для самого носителя метода.

# Создание экземпляра по имени из реестра — типичный фабричный сценарий:
def make(name: str):
    cls = Plugin.registry[name]
    return {{3}}()                         # создаём экземпляр найденного класса

print(make("csv"))                         # <CsvPlugin object at ...>
`,
      answers: [
        ["__init_subclass__"],
        ["registry"],
        ["подкласса", "дочернего", "наследника"],
        ["cls"],
      ],
      hints: [
        "Прокидываем тот же магический метод, чтобы кооперативно работать с цепочкой наследования.",
        "Куда добавляем — в общий реестр класса.",
        "Хук вызывается при создании дочернего класса.",
        "В функции make у нас локальная переменная cls — её и зовём.",
      ],
    },
    {
      type: "fill",
      id: "r11-f3",
      title: "Свой метакласс: автоматическая валидация атрибутов",
      description:
        "Метакласс — это класс, наследник type. Он перехватывает СОЗДАНИЕ класса. Используется, когда __init_subclass__ не хватает.",
      code: `class CapitalAttrsMeta({{0}}):
    """Запрещает в классах любые атрибуты, начинающиеся с заглавной буквы,
    кроме методов и dunder-атрибутов (__name__, __doc__ и т.п.)."""

    def __new__(mcs, name, bases, namespace):
        for attr_name, value in namespace.items():
            if attr_name.startswith("__") and attr_name.endswith("__"):
                continue                       # системные атрибуты не трогаем
            if callable({{1}}):
                continue                       # методы — это функции, разрешены
            if attr_name[0].isupper():
                raise TypeError(
                    f"{name}: атрибут {attr_name!r} начинается с заглавной"
                )
        # Делегируем СОЗДАНИЕ класса родителю (type) — так получим настоящий класс
        return super().{{2}}(mcs, name, bases, namespace)


# Используем метакласс через параметр metaclass=
class Good(metaclass={{3}}):
    color = "red"
    def hello(self): return self.color

print(Good().hello())                          # red

# А вот это упадёт ещё на стадии ОБЪЯВЛЕНИЯ:
# class Bad(metaclass=CapitalAttrsMeta):
#     Color = "red"        # TypeError: Bad: атрибут 'Color' начинается с заглавной
`,
      answers: [
        ["type"],
        ["value"],
        ["__new__"],
        ["CapitalAttrsMeta"],
      ],
      hints: [
        "Метакласс — наследник type.",
        "Проверяем значение, которое уже распаковали в цикле.",
        "Создание объекта — это всегда __new__.",
        "В metaclass= указываем тот класс, который только что объявили.",
      ],
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r11-l1",
      title: "Реализуй __init_subclass__ с обязательным атрибутом",
      description:
        "Заполни __init_subclass__, который проверяет, что у каждого подкласса определён class-attribute `endpoint`. Иначе TypeError.",
      code: `class APIResource:
    # ─────────────── БЛОК 1: __init_subclass__ (~5 строк) ───────────────
    # Метод вызывается КАЖДЫЙ раз, когда кто-то наследуется от APIResource.
    # Проверяем, что в подклассе есть атрибут endpoint и он непустая строка.
    # Шаблон (4 пробела отступа за классом):
    #     def __init_subclass__(cls, **kwargs):
    #         super().__init_subclass__(**kwargs)
    #         if not getattr(cls, "endpoint", None):
    #             raise TypeError(f"{cls.__name__}: задайте endpoint")
    # ВАЖНО: используем getattr с default=None, иначе AttributeError при отсутствии.
{{LINE:0}}


class UserResource(APIResource):
    endpoint = "/api/users"


class ProductResource(APIResource):
    endpoint = "/api/products"


# Этот класс упадёт ПРЯМО на def — без endpoint:
# class BrokenResource(APIResource):
#     pass     # TypeError: BrokenResource: задайте endpoint

print(UserResource.endpoint)
print(ProductResource.endpoint)
`,
      blanks: [
        {
          lines: 5,
          required: ["def __init_subclass__", "super()", "getattr", "endpoint", "raise TypeError"],
          hint: "def __init_subclass__(cls, **kwargs): super().__init_subclass__(**kwargs); if not getattr(cls, 'endpoint', None): raise TypeError(...)",
          reference: `    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        if not getattr(cls, "endpoint", None):
            raise TypeError(f"{cls.__name__}: задайте endpoint")`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r11-l2",
      title: "Метакласс-singleton: __call__ запоминает экземпляр",
      description:
        "Реализуй метакласс, который превращает любой использующий его класс в singleton через __call__.",
      code: `class SingletonMeta(type):
    # ─────────────── БЛОК 1: __call__ метакласса (~5 строк) ───────────────
    # __call__ метакласса перехватывает Singleton(...), то есть СОЗДАНИЕ экземпляра.
    # Если экземпляр уже есть в _instances — возвращаем старый, иначе создаём через
    # обычный super().__call__ (это вызовет __new__ + __init__ как обычно).
    # Шаблон (4 пробела за классом):
    #     _instances: dict = {}
    #
    #     def __call__(cls, *args, **kwargs):
    #         if cls not in cls._instances:
    #             cls._instances[cls] = super().__call__(*args, **kwargs)
    #         return cls._instances[cls]
    # ВАЖНО: храним dict на МЕТАКЛАССЕ, а ключ — сам cls (тогда у каждого класса
    # свой singleton, и наследование не ломает реестр).
{{LINE:0}}


class DatabasePool(metaclass=SingletonMeta):
    def __init__(self, dsn: str = "default"):
        self.dsn = dsn


a = DatabasePool("postgres://1")
b = DatabasePool("postgres://2")
print(a is b, a.dsn)              # True default — второй вызов вернул старый объект
`,
      blanks: [
        {
          lines: 6,
          required: ["_instances", "def __call__", "cls", "super()", "return"],
          hint: "_instances = {}; def __call__(cls, *args, **kwargs): if cls not in cls._instances: cls._instances[cls] = super().__call__(*args, **kwargs); return cls._instances[cls]",
          reference: `    _instances: dict = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r11-l3",
      title: "__class_getitem__: свой синтаксис Box[int]",
      description:
        "Реализуй __class_getitem__ так, чтобы Box[int] возвращал параметризованный класс с атрибутом item_type.",
      code: `class Box:
    # ─────────────── БЛОК 1: __class_getitem__ (~5 строк) ───────────────
    # Этот метод дёргается, когда пишут ИмяКласса[что-то].
    # Должен вернуть НОВЫЙ класс (или сам класс), параметризованный типом.
    # Шаблон (классовый метод, отступ 4 пробела):
    #     def __class_getitem__(cls, item_type):
    #         new_name = f"{cls.__name__}[{item_type.__name__}]"
    #         return type(new_name, (cls,), {"item_type": item_type})
    # ИДЕЯ: создаём подкласс на лету через type(), кладём в него item_type.
{{LINE:0}}

    def __init__(self, value):
        if hasattr(self, "item_type") and not isinstance(value, self.item_type):
            raise TypeError(
                f"{type(self).__name__}: ожидался {self.item_type.__name__}"
            )
        self.value = value


IntBox = Box[int]
sb = IntBox(42)
print(sb.value, sb.item_type)       # 42 <class 'int'>
print(type(sb).__name__)            # Box[int]

# Box[str]("hi")     → ok
# Box[int]("hi")     → TypeError: Box[int]: ожидался int
`,
      blanks: [
        {
          lines: 4,
          required: ["def __class_getitem__", "type(", "item_type", "return"],
          hint: "def __class_getitem__(cls, item_type): name = f'{cls.__name__}[{item_type.__name__}]'; return type(name, (cls,), {'item_type': item_type})",
          reference: `    def __class_getitem__(cls, item_type):
        new_name = f"{cls.__name__}[{item_type.__name__}]"
        return type(new_name, (cls,), {"item_type": item_type})`,
        },
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r11-q1",
      title: "Метакласс по умолчанию",
      question:
        "Какой класс используется в качестве метакласса для большинства классов в Python, если ты не указал свой?",
      answers: ["type", "class type", "встроенный type"],
      hint: "Это тот же объект, который ты вызываешь как функцию type(x).",
      explanation:
        "По умолчанию каждый класс — экземпляр встроенного `type`. type(MyClass) == type. Свой метакласс задаётся через `class X(metaclass=MyMeta):`.",
    },
    {
      type: "question",
      id: "r11-q2",
      title: "Когда вызывается __init_subclass__?",
      question:
        "В какой момент выполняется __init_subclass__: при создании экземпляра, при объявлении подкласса или при импорте модуля?",
      answers: [
        "при объявлении подкласса",
        "когда объявляют подкласс",
        "когда наследуют",
        "при наследовании",
      ],
      hint: "Имя метода намекает: subclass = подкласс.",
      explanation:
        "__init_subclass__ срабатывает ОДИН раз — в момент, когда Python собирает новый КЛАСС, унаследованный от твоего. Не на инстансах. Идеально для регистрации/валидации.",
    },
    {
      type: "question",
      id: "r11-q3",
      title: "type() и его сигнатура",
      question:
        "Сколько аргументов у вызова type(...) в режиме создания нового класса (не в режиме определения типа объекта)?",
      answers: ["3", "три", "3 (name, bases, namespace)"],
      hint: "name, bases, namespace.",
      explanation:
        "С тремя аргументами type(name, bases, dict) Python создаёт класс. С одним — возвращает тип объекта. Это перегрузка по числу аргументов.",
    },
    {
      type: "question",
      id: "r11-q4",
      title: "Метакласс — наследник чего?",
      question:
        "От какого класса должен наследоваться твой собственный метакласс, чтобы Python смог его использовать?",
      answers: ["type", "class type"],
      hint: "Тот же базовый объект, что и сам Python использует.",
      explanation:
        "Любой кастомный метакласс наследует `type`. Тогда у него есть нужные __new__/__init__/__call__ для создания классов.",
    },
    {
      type: "question",
      id: "r11-q5",
      title: "Конфликт метаклассов",
      question:
        "Что произойдёт, если базовый класс использует метакласс A, а ты пытаешься унаследоваться от него и одновременно задать metaclass=B (не наследник A)?",
      answers: [
        "TypeError",
        "TypeError metaclass conflict",
        "ошибка metaclass conflict",
        "metaclass conflict",
      ],
      hint: "Python ругается на несовместимость иерархий метаклассов.",
      explanation:
        "Python требует, чтобы метакласс подкласса БЫЛ ПОДКЛАССОМ метакласса базы. Иначе — TypeError: metaclass conflict.",
    },
    {
      type: "question",
      id: "r11-q6",
      title: "__class_getitem__: для чего?",
      question:
        "Какой синтаксис поддерживает __class_getitem__ — то есть какое выражение его вызовет?",
      answers: [
        "Cls[...]",
        "Cls[X]",
        "квадратные скобки на классе",
        "ИмяКласса[...]",
        "ИмяКласса[X]",
      ],
      hint: "Через __class_getitem__ работают list[int], dict[str, int].",
      explanation:
        "Метод срабатывает на синтаксисе SomeClass[X]. Это то, благодаря чему list[int] и dict[str, int] не падают в рантайме без typing.",
    },
    {
      type: "question",
      id: "r11-q7",
      title: "__init_subclass__ и super()",
      question:
        "Зачем в собственном __init_subclass__ обязательно вызывать super().__init_subclass__(**kwargs)?",
      answers: [
        "чтобы кооперативно работали другие миксины",
        "для кооперативного наследования",
        "чтобы цепочка mro не сломалась",
        "для совместимости с другими базами",
      ],
      hint: "Цепочка наследования может содержать другие базы со своим хуком.",
      explanation:
        "Без super() ты обрываешь цепочку — другие миксины с __init_subclass__ перестают получать управление. Это всегда плохо: нарушает кооперативность.",
    },
    {
      type: "question",
      id: "r11-q8",
      title: "Декоратор vs метакласс",
      question:
        "Назови ОДНУ ситуацию, когда метакласс реально нужен и его НЕ заменить декоратором класса (одно слово/фраза).",
      answers: [
        "цепочка наследования",
        "наследование",
        "когда нужно влиять на наследников",
        "влияние на подклассы",
        "когда подклассы должны автоматически получать поведение",
      ],
      hint: "Декоратор работает только на тот класс, к которому применён.",
      explanation:
        "Декоратор обработает только тот класс, к которому навешен. Метакласс/__init_subclass__ автоматически работает на ВСЕХ наследников. Если поведение должно распространяться по дереву наследования — нужен метакласс.",
    },
    {
      type: "question",
      id: "r11-q9",
      title: "__call__ метакласса",
      question:
        "Что делает __call__, определённый на МЕТАКЛАССЕ (не на обычном классе)?",
      answers: [
        "перехватывает создание экземпляра",
        "перехватывает вызов класса",
        "управляет созданием объектов класса",
        "управляет вызовом класса",
      ],
      hint: "Подумай: что в Python делает Cls() — вызывает что?",
      explanation:
        "Cls() — это вызов CLASS-объекта. По правилам Python вызов объекта = вызов type(obj).__call__. Для экземпляра ИКЛАССА типом является МЕТАкласс. Значит, его __call__ и определяет, как создаётся объект (можно вернуть кэш, подменить и т.д.).",
    },
    {
      type: "question",
      id: "r11-q10",
      title: "Метакласс vs __init_subclass__",
      question:
        "Что выбрать в большинстве реальных случаев, когда нужно валидировать или регистрировать подклассы?",
      answers: [
        "__init_subclass__",
        "init_subclass",
        "хук __init_subclass__",
        "хук init_subclass",
      ],
      hint: "Современный Python поощряет более простое решение.",
      explanation:
        "С Python 3.6+ почти всё, для чего раньше нужны были метаклассы, делается через __init_subclass__ и __set_name__. Метакласс — тяжёлая артиллерия (фреймворки типа Django ORM), для прикладного кода обычно избыточна.",
    },
  ],
  writes: [],
};

// ===========================================================================
// ROUND 12 — Продвинутые дескрипторы
// ===========================================================================
const round12: Round = {
  number: 12,
  title: "Продвинутые дескрипторы",
  level: "Эксперт",
  intro:
    "Дескриптор — объект с __get__/__set__, которому Python передаёт работу при обращении к атрибуту. Здесь — __set_name__, валидаторы, lazy/cached properties и кастомные коллекции.",
  fills: [
    {
      type: "fill",
      id: "r12-f1",
      title: "__set_name__: дескриптор узнаёт своё имя",
      description:
        "Заполни валидатор Positive так, чтобы при ошибке он явно говорил, ИМЯ какого атрибута неверно.",
      code: `class Positive:
    """Дескриптор: разрешает только положительные числа."""

    def __set_name__(self, owner, name):
        # Python вызывает этот хук АВТОМАТИЧЕСКИ при создании класса owner,
        # передавая имя, под которым дескриптор привязан в namespace.
        self._public_name = {{0}}                # 'salary' / 'age' и т.п.
        self._private_name = "_" + name          # '_salary' — где лежит значение

    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        return getattr(instance, self.{{1}})

    def __set__(self, instance, value):
        if not isinstance(value, (int, float)) or value <= 0:
            raise ValueError(
                f"{self._public_name}: ожидалось положительное число, "
                f"получено {value!r}"
            )
        setattr(instance, self.{{2}}, value)


class Employee:
    salary = Positive()
    age = Positive()

    def __init__(self, salary, age):
        self.salary = salary
        self.age = age


e = Employee(100_000, 30)
print(e.salary)              # 100000
try:
    e.age = -5
except {{3}} as err:
    print("error:", err)
`,
      answers: [
        ["name"],
        ["_private_name"],
        ["_private_name"],
        ["ValueError"],
      ],
      hints: [
        "Имя атрибута уже передано параметром.",
        "Откуда брать значение — из приватного слота.",
        "Куда положить значение — туда же.",
        "Тип ошибки тот, что мы сами и кидаем.",
      ],
    },
    {
      type: "fill",
      id: "r12-f2",
      title: "Lazy property с кэшем и инвалидацией",
      description:
        "Дескриптор кэширует первый результат в самом инстансе и умеет сбрасываться через `del obj.attr`.",
      code: `class lazy_property:
    """Аналог functools.cached_property + поддержка del для сброса."""

    def __init__(self, func):
        self.func = func
        self.attrname = func.{{0}}     # имя метода — оно же имя атрибута

    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        # Уже посчитано? Возвращаем из __dict__.
        if self.attrname in instance.__dict__:
            return instance.__dict__[self.attrname]
        value = self.func(instance)
        instance.__dict__[self.attrname] = value
        return value

    def __delete__(self, instance):
        # del obj.attr — выкинуть из __dict__, чтобы пересчитали при следующем get.
        instance.__dict__.{{1}}(self.attrname, None)


class Stats:
    def __init__(self, data):
        self._data = data

    @{{2}}
    def mean(self):
        print("calculating...")
        return sum(self._data) / len(self._data)


s = Stats([1, 2, 3, 4])
print(s.mean)         # calculating... 2.5
print(s.mean)         # 2.5  (без 'calculating' — кэш)
{{3}} s.mean
print(s.mean)         # calculating... 2.5  (пересчёт)
`,
      answers: [
        ["__name__"],
        ["pop"],
        ["lazy_property"],
        ["del"],
      ],
      hints: [
        "У функции есть атрибут с её именем.",
        "Безопасное удаление по ключу — этот метод словаря не падает на отсутствующих.",
        "Декоратор — это сам класс-дескриптор.",
        "Оператор удаления атрибута.",
      ],
    },
    {
      type: "fill",
      id: "r12-f3",
      title: "TypedDescriptor — параметризуем тип",
      description:
        "Дескриптор, которому передают тип в конструкторе и который проверяет каждое присваивание.",
      code: `class Typed:
    """Дескриптор с параметром: разрешает только заданный тип."""

    def __init__(self, expected_type, default=None):
        self.expected_type = expected_type
        self.default = default

    def __set_name__(self, owner, name):
        self.name = "_" + name

    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        return getattr(instance, self.name, self.default)

    def __set__(self, instance, value):
        if not isinstance(value, self.{{0}}):
            raise TypeError(
                f"{self.name[1:]}: ожидался {self.expected_type.__name__}, "
                f"получен {type(value).__name__}"
            )
        setattr(instance, self.{{1}}, value)


class Article:
    title = Typed({{2}}, default="без названия")
    views = Typed(int, default=0)

    def __init__(self, title, views=0):
        self.title = title
        self.views = views


a = Article("Hello", 10)
print(a.title, a.views)
try:
    a.views = "много"
except {{3}} as e:
    print("err:", e)
`,
      answers: [
        ["expected_type"],
        ["name"],
        ["str"],
        ["TypeError"],
      ],
      hints: [
        "В конструкторе мы сохранили expected_type на self.",
        "Имя приватного слота уже посчитано в __set_name__.",
        "Какой тип у заголовка статьи?",
        "Несовпадение типа — это…",
      ],
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r12-l1",
      title: "Дескриптор-кэш с инвалидацией зависимостей",
      description:
        "Реализуй get/set/delete для дескриптора, который кэширует значение на инстансе и умеет сбрасываться.",
      code: `class CachedAttr:
    """Дескриптор: считает значение функцией один раз, кэширует, поддерживает del."""

    def __init__(self, compute):
        self.compute = compute

    def __set_name__(self, owner, name):
        self.public = name
        self.slot = "_cache_" + name

    # ─────────────── БЛОК 1: __get__ (~5 строк) ───────────────
    # Если у объекта уже есть self.slot — возвращаем его. Иначе вычисляем,
    # кладём, возвращаем. Не забудь instance is None → вернуть self (доступ ИЗ КЛАССА).
    # Шаблон (4 пробела за классом):
    #     def __get__(self, instance, owner=None):
    #         if instance is None:
    #             return self
    #         if not hasattr(instance, self.slot):
    #             setattr(instance, self.slot, self.compute(instance))
    #         return getattr(instance, self.slot)
{{LINE:0}}

    # ─────────────── БЛОК 2: __delete__ (~3 строки) ───────────────
    # del obj.x должен очистить кэш, а не упасть, если кэша ещё нет.
    # Шаблон:
    #     def __delete__(self, instance):
    #         if hasattr(instance, self.slot):
    #             delattr(instance, self.slot)
{{LINE:1}}


class Report:
    def __init__(self, data):
        self.data = data

    @CachedAttr
    def total(self):
        print("counting...")
        return sum(self.data)


r = Report([1, 2, 3, 4])
print(r.total)        # counting... 10
print(r.total)        # 10
del r.total
print(r.total)        # counting... 10
`,
      blanks: [
        {
          lines: 6,
          required: ["def __get__", "instance is None", "self.slot", "compute", "return"],
          hint: "def __get__(self, instance, owner=None): if instance is None: return self; if not hasattr(instance, self.slot): setattr(...); return getattr(...)",
          reference: `    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        if not hasattr(instance, self.slot):
            setattr(instance, self.slot, self.compute(instance))
        return getattr(instance, self.slot)`,
        },
        {
          lines: 3,
          required: ["def __delete__", "hasattr", "delattr"],
          hint: "def __delete__(self, instance): if hasattr(instance, self.slot): delattr(instance, self.slot)",
          reference: `    def __delete__(self, instance):
        if hasattr(instance, self.slot):
            delattr(instance, self.slot)`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r12-l2",
      title: "Range-валидатор с __set_name__",
      description:
        "Дескриптор, который валидирует, что значение лежит в [lo, hi]. Используется для процентов, температур, вероятностей.",
      code: `class InRange:
    def __init__(self, lo: float, hi: float):
        self.lo, self.hi = lo, hi

    # ─────────────── БЛОК 1: __set_name__ (~3 строки) ───────────────
    # Запоминаем публичное имя (для сообщения об ошибке) и приватный слот.
    # Шаблон (4 пробела за классом):
    #     def __set_name__(self, owner, name):
    #         self.public = name
    #         self.slot = "_" + name
{{LINE:0}}

    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        return getattr(instance, self.slot)

    # ─────────────── БЛОК 2: __set__ (~5 строк) ───────────────
    # Проверка: lo <= value <= hi. Иначе ValueError с понятным сообщением.
    # Шаблон:
    #     def __set__(self, instance, value):
    #         if not (self.lo <= value <= self.hi):
    #             raise ValueError(
    #                 f"{self.public}={value} вне [{self.lo}, {self.hi}]"
    #             )
    #         setattr(instance, self.slot, value)
{{LINE:1}}


class Sensor:
    temperature = InRange(-273.15, 1000)
    humidity = InRange(0, 100)

    def __init__(self, t, h):
        self.temperature = t
        self.humidity = h


s = Sensor(20, 55)
print(s.temperature, s.humidity)
try:
    s.humidity = 150
except ValueError as e:
    print("err:", e)
`,
      blanks: [
        {
          lines: 3,
          required: ["def __set_name__", "self.public", "self.slot"],
          hint: "def __set_name__(self, owner, name): self.public = name; self.slot = '_' + name",
          reference: `    def __set_name__(self, owner, name):
        self.public = name
        self.slot = "_" + name`,
        },
        {
          lines: 5,
          required: ["def __set__", "self.lo", "self.hi", "ValueError", "setattr"],
          hint: "def __set__(self, instance, value): if not (self.lo <= value <= self.hi): raise ValueError(...); setattr(instance, self.slot, value)",
          reference: `    def __set__(self, instance, value):
        if not (self.lo <= value <= self.hi):
            raise ValueError(
                f"{self.public}={value} вне [{self.lo}, {self.hi}]"
            )
        setattr(instance, self.slot, value)`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r12-l3",
      title: "Дескриптор-конвертер: автоматический парсинг",
      description:
        "При записи строкой автоматически конвертируем в нужный тип (например, '42' → 42).",
      code: `class AutoParse:
    """Дескриптор: при записи приводит value к target_type через target_type(value)."""

    def __init__(self, target_type):
        self.target_type = target_type

    def __set_name__(self, owner, name):
        self.slot = "_" + name
        self.public = name

    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        return getattr(instance, self.slot)

    # ─────────────── БЛОК 1: __set__ с конвертацией (~6 строк) ───────────────
    # Если value УЖЕ нужного типа — кладём как есть. Иначе пробуем target_type(value).
    # При ошибке преобразования — ValueError с поясняющим сообщением.
    # Шаблон (4 пробела за классом):
    #     def __set__(self, instance, value):
    #         if isinstance(value, self.target_type):
    #             setattr(instance, self.slot, value)
    #             return
    #         try:
    #             converted = self.target_type(value)
    #         except (TypeError, ValueError) as e:
    #             raise ValueError(
    #                 f"{self.public}: не получилось привести {value!r} к {self.target_type.__name__}"
    #             ) from e
    #         setattr(instance, self.slot, converted)
{{LINE:0}}


class Config:
    port = AutoParse(int)
    debug = AutoParse(bool)

    def __init__(self, port, debug):
        self.port = port
        self.debug = debug


c = Config("8080", 1)        # строки/числа автоматически приведутся
print(c.port, type(c.port))    # 8080 <class 'int'>
print(c.debug, type(c.debug))  # True <class 'bool'>
try:
    c.port = "abc"
except ValueError as e:
    print("err:", e)
`,
      blanks: [
        {
          lines: 10,
          required: ["def __set__", "isinstance", "target_type", "ValueError", "setattr", "try", "except"],
          hint: "def __set__: если isinstance(value, target_type) — setattr и return; иначе try: converted = target_type(value); except (TypeError, ValueError): raise ValueError(...); setattr(instance, self.slot, converted)",
          reference: `    def __set__(self, instance, value):
        if isinstance(value, self.target_type):
            setattr(instance, self.slot, value)
            return
        try:
            converted = self.target_type(value)
        except (TypeError, ValueError) as e:
            raise ValueError(
                f"{self.public}: не получилось привести {value!r} к {self.target_type.__name__}"
            ) from e
        setattr(instance, self.slot, converted)`,
        },
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r12-q1",
      title: "Когда срабатывает __set_name__?",
      question:
        "В какой момент Python вызывает __set_name__ на дескрипторе?",
      answers: [
        "при создании класса",
        "при объявлении класса",
        "когда создаётся owner-класс",
        "когда объявляется владелец",
      ],
      hint: "Не на инстансах. Это про класс-владельца.",
      explanation:
        "__set_name__ вызывается ОДИН раз — когда Python собирает класс-владелец и обнаруживает в нём дескриптор. Это даёт возможность узнать, под каким именем дескриптор привязан, без хака через __dict__.",
    },
    {
      type: "question",
      id: "r12-q2",
      title: "Где хранить значение?",
      question:
        "Почему нельзя хранить значение прямо на самом дескрипторе (например, self.value = value в __set__)?",
      answers: [
        "дескриптор общий для всех инстансов",
        "один дескриптор делится между инстансами",
        "дескриптор живёт на классе",
        "дескриптор один на класс",
      ],
      hint: "Сколько объектов-дескрипторов создаётся для класса?",
      explanation:
        "Дескриптор — это атрибут КЛАССА, один-единственный объект. Если хранить значение на нём, все экземпляры будут перезаписывать друг другу. Поэтому значение всегда кладём в инстанс (через приватный слот в __dict__).",
    },
    {
      type: "question",
      id: "r12-q3",
      title: "data vs non-data descriptor",
      question:
        "Что отличает data descriptor от non-data descriptor (одно слово/метод)?",
      answers: [
        "__set__",
        "наличие __set__",
        "set",
        "наличие set",
      ],
      hint: "Один из дандер-методов.",
      explanation:
        "Data descriptor — у него есть __set__ (или __delete__). Non-data — только __get__. Это важно: data descriptor имеет приоритет над __dict__ инстанса, non-data — нет.",
    },
    {
      type: "question",
      id: "r12-q4",
      title: "instance is None",
      question:
        "Что должен делать __get__, если instance is None (то есть обращение идёт через сам класс, а не через экземпляр)?",
      answers: [
        "вернуть self",
        "return self",
        "вернуть сам дескриптор",
      ],
      hint: "Это стандартный паттерн.",
      explanation:
        "Когда пишут MyClass.attr (не obj.attr), Python зовёт __get__(None, MyClass). Возврат self даёт доступ к самому дескриптору — полезно для интроспекции/тестов.",
    },
    {
      type: "question",
      id: "r12-q5",
      title: "@property vs дескриптор",
      question:
        "Чем отличается @property от написанного руками дескриптора в плане ПЕРЕИСПОЛЬЗОВАНИЯ?",
      answers: [
        "property не переиспользуется между атрибутами",
        "property только для одного атрибута",
        "дескриптор переиспользуем, property — нет",
        "property специфичен для одного метода",
      ],
      hint: "@property пишется внутри класса под конкретное имя.",
      explanation:
        "@property — это удобный синтаксис, но он завязан на конкретный класс и имя. Свой дескриптор-класс (например, Positive) можно навешать на сколько угодно атрибутов в любых классах.",
    },
    {
      type: "question",
      id: "r12-q6",
      title: "functools.cached_property",
      question:
        "Какой стандартный класс из functools кеширует результат @property и не пересчитывает его?",
      answers: [
        "cached_property",
        "functools.cached_property",
        "@cached_property",
      ],
      hint: "Имя говорит само за себя.",
      explanation:
        "functools.cached_property — стандартный дескриптор: первый вызов считает, кладёт результат в __dict__ инстанса, дальнейшие — мгновенные. Минус: нет встроенного __delete__ для инвалидации.",
    },
    {
      type: "question",
      id: "r12-q7",
      title: "Дескриптор и __slots__",
      question:
        "Будет ли работать дескриптор, если класс использует __slots__ без слота под значение?",
      answers: [
        "не будет",
        "нет",
        "упадёт",
        "AttributeError",
        "нужно добавить слот",
      ],
      hint: "У инстанса с __slots__ нет __dict__.",
      explanation:
        "Если в __slots__ нет слота, под который дескриптор пытается записать значение, будет AttributeError. Решение — добавить нужный слот (например, '_salary') в __slots__.",
    },
    {
      type: "question",
      id: "r12-q8",
      title: "Дескриптор и наследование",
      question:
        "Если базовый класс объявляет дескриптор `x = Validator()`, а наследник переопределяет `x = 5`, что произойдёт?",
      answers: [
        "дескриптор перестанет работать",
        "x станет обычным атрибутом",
        "наследник теряет дескриптор",
        "валидация исчезнет",
      ],
      hint: "Атрибут класса полностью затирается.",
      explanation:
        "Класс-наследник перекрывает x на простой int 5. Дескриптор там больше не используется. Это тонкий, но частый баг: «забыл, что валидатор теперь не работает».",
    },
    {
      type: "question",
      id: "r12-q9",
      title: "Дескриптор для метода",
      question:
        "Каким дескриптором по сути является обычная функция, объявленная внутри класса?",
      answers: [
        "non-data descriptor",
        "non data descriptor",
        "non-data",
        "функция-дескриптор",
        "function descriptor",
      ],
      hint: "У функции есть только __get__.",
      explanation:
        "Функции — non-data descriptors. Их __get__ возвращает bound method, привязывая self. Поэтому obj.method работает «магически» — на самом деле это вызов дескриптора.",
    },
    {
      type: "question",
      id: "r12-q10",
      title: "Где я бы НЕ использовал дескрипторы?",
      question:
        "Назови один пример, когда дескриптор — оверкилл и лучше @property (одно слово/фраза).",
      answers: [
        "одиночный атрибут",
        "одно поле",
        "только в одном классе",
        "когда не нужен переиспользуемый код",
        "одноразовый случай",
      ],
      hint: "Если ты пишешь валидатор для ОДНОГО атрибута и больше не планируешь — дескриптор-класс лишний.",
      explanation:
        "Дескриптор-класс окупается переиспользованием. Если поле одно и в одном классе, @property лаконичнее, понятнее и не тащит за собой __set_name__/слоты.",
    },
  ],
  writes: [],
};

// ===========================================================================
// ROUND 13 — Типизация для архитекторов
// ===========================================================================
const round13: Round = {
  number: 13,
  title: "Типизация для архитекторов",
  level: "Эксперт",
  intro:
    "Generic[T], TypeVar с bounds, Self, Protocol — инструменты, без которых большой проект превращается в кашу. Здесь — практика: строгая типизация контейнеров, миксинов и колбэков.",
  fills: [
    {
      type: "fill",
      id: "r13-f1",
      title: "Generic[T] — параметризованный контейнер",
      description:
        "Заполни TypeVar и Generic так, чтобы Box[int]() и Box[str]() корректно типизировались.",
      code: `from typing import {{0}}, Generic

T = TypeVar({{1}})           # имя в кавычках — должно совпасть с переменной слева

class Box(Generic[{{2}}]):    # параметризуем класс типом T
    def __init__(self, value: T) -> None:
        self._value = value

    def get(self) -> {{3}}:    # возврат — того же типа T
        return self._value

    def map(self, fn):
        # Заметь: тип fn — Callable[[T], T2] — но это уже round 13.f3.
        return Box(fn(self._value))


b: Box[int] = Box(42)
print(b.get() + 1)            # 43
s: Box[str] = Box("hi")
print(s.get().upper())        # HI
`,
      answers: [
        ["TypeVar"],
        ["\"T\"", "'T'"],
        ["T"],
        ["T"],
      ],
      hints: [
        "Что импортируется кроме Generic?",
        "Имя TypeVar — строка, точно как переменная.",
        "Внутри Generic[...] — наша TypeVar.",
        "Возврат get — наш generic тип.",
      ],
    },
    {
      type: "fill",
      id: "r13-f2",
      title: "TypeVar с bound — строгое ограничение",
      description:
        "Generic-функция, работающая ТОЛЬКО с потомками Comparable. Mypy будет ругаться на остальное.",
      code: `from typing import TypeVar, Protocol

class Comparable(Protocol):
    def __lt__(self, other) -> bool: ...

# bound= — верхняя граница: T должен быть Comparable или его подтипом.
T = TypeVar("T", bound={{0}})


def min_of(a: T, b: T) -> {{1}}:
    """Возвращает меньший из двух сравнимых элементов."""
    return a if a < b else b


print(min_of(3, 5))           # 3
print(min_of("bbb", "aaa"))   # aaa
# min_of(complex(1,2), complex(3,4))  ← mypy: complex не Comparable

# Альтернатива bound — constraints (несколько разрешённых типов):
NumOrStr = TypeVar("NumOrStr", int, float, str)

def normalize(x: NumOrStr) -> NumOrStr:
    if isinstance(x, str):
        return {{2}}.strip().lower()  # для str — нормализация
    return x

print(normalize("  Hi  "))     # hi
print(normalize(3.14))         # 3.14
# T bound vs T constraint:
# - bound — допускает ЛЮБОЙ ПОДКЛАСС границы
# - constraint — допускает РОВНО один из перечисленных типов
print(TypeVar("X", bound=int).{{3}})   # 'X'
`,
      answers: [
        ["Comparable"],
        ["T"],
        ["x"],
        ["__name__"],
      ],
      hints: [
        "Имя протокола, который мы только что объявили.",
        "Функция возвращает один из аргументов — значит тоже T.",
        "Это аргумент функции normalize.",
        "У TypeVar есть атрибут с его собственным именем.",
      ],
    },
    {
      type: "fill",
      id: "r13-f3",
      title: "Self и кооперативные fluent-builders",
      description:
        "Self из typing (3.11+) корректно типизирует методы, возвращающие self в наследниках.",
      code: `from typing import {{0}}

class QueryBuilder:
    def __init__(self) -> None:
        self._filters: list[str] = []
        self._limit: int | None = None

    def where(self, expr: str) -> {{1}}:
        self._filters.append(expr)
        return {{2}}                       # возвращаем самого себя

    def limit(self, n: int) -> Self:
        self._limit = n
        return self

    def build(self) -> str:
        sql = "SELECT * FROM t"
        if self._filters:
            sql += " WHERE " + " AND ".join(self._filters)
        if self._limit:
            sql += f" LIMIT {self._limit}"
        return sql


class UserQueryBuilder(QueryBuilder):
    def with_role(self, role: str) -> Self:
        return self.where(f"role = '{role}'")


q = UserQueryBuilder().with_role("admin").limit(10).build()
print(q)
# До Self нам пришлось бы объявлять TypeVar T = TypeVar('T', bound='QueryBuilder')
# и писать -> T в каждом методе. Self короче и yet точнее.
print({{3}}.__name__)             # 'Self'
`,
      answers: [
        ["Self"],
        ["Self"],
        ["self"],
        ["Self"],
      ],
      hints: [
        "Что мы импортируем из typing?",
        "Тип возврата — `Self` из typing.",
        "Какой объект мы возвращаем?",
        "У Self есть __name__.",
      ],
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r13-l1",
      title: "Generic-Stack[T] с типизированными методами",
      description:
        "Реализуй push/pop/peek так, чтобы Stack[int] возвращал именно int.",
      code: `from typing import Generic, TypeVar

T = TypeVar("T")


class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    # ─────────────── БЛОК 1: push (~2 строки) ───────────────
    # Принимает значение типа T, ничего не возвращает.
    # Шаблон (4 пробела отступа за классом):
    #     def push(self, value: T) -> None:
    #         self._items.append(value)
{{LINE:0}}

    # ─────────────── БЛОК 2: pop (~4 строки) ───────────────
    # Достаёт верхнее значение. Если пусто — IndexError.
    # Шаблон:
    #     def pop(self) -> T:
    #         if not self._items:
    #             raise IndexError("pop from empty stack")
    #         return self._items.pop()
{{LINE:1}}

    # ─────────────── БЛОК 3: peek (~4 строки) ───────────────
    # Смотрим вершину, не снимая. Тоже IndexError на пустом стеке.
    # Шаблон:
    #     def peek(self) -> T:
    #         if not self._items:
    #             raise IndexError("peek on empty stack")
    #         return self._items[-1]
{{LINE:2}}


s: Stack[int] = Stack()
s.push(1); s.push(2); s.push(3)
print(s.peek())       # 3
print(s.pop(), s.pop(), s.pop())   # 3 2 1
`,
      blanks: [
        {
          lines: 2,
          required: ["def push", "value: T", "self._items.append"],
          hint: "def push(self, value: T) -> None: self._items.append(value)",
          reference: `    def push(self, value: T) -> None:
        self._items.append(value)`,
        },
        {
          lines: 4,
          required: ["def pop", "-> T", "IndexError", "self._items.pop"],
          hint: "def pop(self) -> T: if not self._items: raise IndexError(...); return self._items.pop()",
          reference: `    def pop(self) -> T:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()`,
        },
        {
          lines: 4,
          required: ["def peek", "-> T", "IndexError", "self._items[-1]"],
          hint: "def peek(self) -> T: if not self._items: raise IndexError(...); return self._items[-1]",
          reference: `    def peek(self) -> T:
        if not self._items:
            raise IndexError("peek on empty stack")
        return self._items[-1]`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r13-l2",
      title: "Protocol для duck-typing с типами",
      description:
        "Опиши Protocol, опиши функцию, которая принимает любой объект, удовлетворяющий протоколу.",
      code: `from typing import Protocol, runtime_checkable


# ─────────────── БЛОК 1: Protocol Drawable (~5 строк) ───────────────
# Объяви протокол с одним методом draw() -> str.
# Не забудь @runtime_checkable, чтобы isinstance работал.
# Шаблон (без отступа — модульный уровень):
#     @runtime_checkable
#     class Drawable(Protocol):
#         def draw(self) -> str:
#             ...
{{LINE:0}}


class Circle:
    def draw(self) -> str:
        return "(O)"


class Square:
    def draw(self) -> str:
        return "[#]"


# ─────────────── БЛОК 2: render_all (~3 строки) ───────────────
# Принимает список Drawable, возвращает их склеенные draw() через пробел.
# Шаблон:
#     def render_all(items: list[Drawable]) -> str:
#         return " ".join(item.draw() for item in items)
{{LINE:1}}


print(render_all([Circle(), Square(), Circle()]))    # (O) [#] (O)
print(isinstance(Circle(), Drawable))                # True
print(isinstance("hello", Drawable))                 # False — нет метода draw
`,
      blanks: [
        {
          lines: 5,
          required: ["@runtime_checkable", "class Drawable", "Protocol", "def draw", "..."],
          hint: "@runtime_checkable; class Drawable(Protocol): def draw(self) -> str: ...",
          reference: `@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> str:
        ...`,
        },
        {
          lines: 3,
          required: ["def render_all", "list[Drawable]", "join", "draw()"],
          hint: "def render_all(items: list[Drawable]) -> str: return ' '.join(item.draw() for item in items)",
          reference: `def render_all(items: list[Drawable]) -> str:
    return " ".join(item.draw() for item in items)`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r13-l3",
      title: "ParamSpec: декоратор, сохраняющий сигнатуру",
      description:
        "Реализуй декоратор log_calls, который сохраняет точную сигнатуру декорируемой функции.",
      code: `from typing import ParamSpec, TypeVar, Callable
import functools

P = ParamSpec("P")
R = TypeVar("R")


# ─────────────── БЛОК 1: декоратор log_calls (~7 строк) ───────────────
# Без ParamSpec потеряли бы инфу про аргументы, IDE не подсказала бы.
# Внутренняя функция wrapper принимает *args/**kwargs, типизированные через P.
# Шаблон (без отступа):
#     def log_calls(fn: Callable[P, R]) -> Callable[P, R]:
#         @functools.wraps(fn)
#         def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
#             print(f"-> {fn.__name__}({args}, {kwargs})")
#             result = fn(*args, **kwargs)
#             print(f"<- {fn.__name__} = {result!r}")
#             return result
#         return wrapper
# КЛЮЧ: P.args и P.kwargs — специальные маркеры ParamSpec.
{{LINE:0}}


@log_calls
def greet(name: str, *, formal: bool = False) -> str:
    return f"{'Hello' if formal else 'hi'}, {name}"


print(greet("Alice", formal=True))
# IDE/mypy после декорирования всё равно знает, что greet — (str, *, bool) -> str
`,
      blanks: [
        {
          lines: 7,
          required: ["def log_calls", "Callable[P, R]", "functools.wraps", "P.args", "P.kwargs", "return wrapper"],
          hint: "def log_calls(fn: Callable[P, R]) -> Callable[P, R]: @functools.wraps(fn); def wrapper(*args: P.args, **kwargs: P.kwargs) -> R: ... ; return wrapper",
          reference: `def log_calls(fn: Callable[P, R]) -> Callable[P, R]:
    @functools.wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        print(f"-> {fn.__name__}({args}, {kwargs})")
        result = fn(*args, **kwargs)
        print(f"<- {fn.__name__} = {result!r}")
        return result
    return wrapper`,
        },
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r13-q1",
      title: "TypeVar — что это?",
      question:
        "Что такое TypeVar (в одном словосочетании)?",
      answers: [
        "переменная типа",
        "type variable",
        "обобщённый параметр типа",
        "параметр типа",
      ],
      hint: "Аналог дженерик-параметра T<T> в Java/C#.",
      explanation:
        "TypeVar — это «переменная типа»: маркер, который mypy подставит конкретным типом при использовании. T = TypeVar('T') позволяет описать функции/классы, работающие с произвольным типом.",
    },
    {
      type: "question",
      id: "r13-q2",
      title: "Generic[T]",
      question:
        "Зачем класс должен наследоваться от Generic[T], а не просто использовать T в аннотациях?",
      answers: [
        "чтобы класс можно было параметризовать",
        "для синтаксиса Cls[X]",
        "иначе нельзя писать Cls[int]",
        "для подстановки типа",
        "чтобы использовать квадратные скобки",
      ],
      hint: "Без Generic[T] не работает синтаксис подстановки.",
      explanation:
        "Generic[T] — то, что добавляет классу __class_getitem__ для синтаксиса Box[int]. Без него mypy примет T в аннотациях, но не позволит вызвать Box[int] стилистически.",
    },
    {
      type: "question",
      id: "r13-q3",
      title: "bound vs constraints",
      question:
        "Чем bound у TypeVar отличается от constraints (одно отличие)?",
      answers: [
        "bound допускает подклассы",
        "bound пропускает подтипы",
        "constraints — точно один из типов",
        "constraints — фиксированный набор",
        "bound принимает подтипы, constraints — нет",
      ],
      hint: "Один — про иерархию, другой — про список.",
      explanation:
        "bound=Cls — T может быть Cls или ЛЮБЫМ её подклассом. constraints=(int, str) — T должен быть РОВНО int или РОВНО str, никаких подтипов.",
    },
    {
      type: "question",
      id: "r13-q4",
      title: "Self из typing",
      question:
        "Когда нужен Self из typing вместо собственного TypeVar?",
      answers: [
        "когда метод возвращает self",
        "когда метод возвращает self и важно подкласс",
        "fluent api",
        "для fluent api с наследованием",
        "при возврате self",
      ],
      hint: "Builder, fluent API, цепочки .where().limit().",
      explanation:
        "Self автоматически указывает «тип, в котором метод вызван». В наследнике это будет наследник, в базе — база. До Python 3.11 приходилось городить TypeVar('T', bound='Cls').",
    },
    {
      type: "question",
      id: "r13-q5",
      title: "Protocol vs ABC",
      question:
        "Главное отличие Protocol от ABC (одна фраза)?",
      answers: [
        "structural typing",
        "не нужно наследоваться",
        "duck typing с типами",
        "structural vs nominal",
        "нет наследования",
      ],
      hint: "ABC требует явного наследования. Protocol — нет.",
      explanation:
        "Protocol — структурная типизация: класс «удовлетворяет протоколу», если у него ЕСТЬ нужные методы — без явного наследования. ABC — номинальная: нужно унаследоваться явно.",
    },
    {
      type: "question",
      id: "r13-q6",
      title: "@runtime_checkable",
      question:
        "Зачем нужен декоратор @runtime_checkable на Protocol?",
      answers: [
        "чтобы isinstance работал",
        "для isinstance",
        "isinstance",
        "чтобы проверять через isinstance в рантайме",
        "иначе isinstance падает",
      ],
      hint: "Без него Python не разрешит проверять принадлежность к протоколу в рантайме.",
      explanation:
        "По умолчанию Protocol — это «обещание для type checker». @runtime_checkable добавляет поддержку isinstance(obj, MyProto) в рантайме (но проверяется только наличие имён, а не их сигнатур!).",
    },
    {
      type: "question",
      id: "r13-q7",
      title: "ParamSpec — для чего?",
      question:
        "Какую проблему решает ParamSpec в декораторах?",
      answers: [
        "сохраняет сигнатуру",
        "сохраняет типы аргументов",
        "сохраняет тип параметров",
        "не теряем подсказки IDE",
        "точная сигнатура после декорирования",
      ],
      hint: "До ParamSpec декорированная функция выглядела как (*args, **kwargs).",
      explanation:
        "ParamSpec позволяет декораторам сохранять типизацию параметров оборачиваемой функции. Тогда IDE и mypy после декорирования продолжают видеть точную сигнатуру (greet(name: str)).",
    },
    {
      type: "question",
      id: "r13-q8",
      title: "Optional[X] и X | None",
      question:
        "Чему эквивалентно Optional[int]?",
      answers: [
        "int | None",
        "int или None",
        "int|None",
        "Union[int, None]",
        "int | none",
      ],
      hint: "В Python 3.10+ можно писать через |.",
      explanation:
        "Optional[X] — это сахар над Union[X, None] = X | None. Это означает «либо X, либо None». Не путай с «параметр со значением по умолчанию»!",
    },
    {
      type: "question",
      id: "r13-q9",
      title: "TypeVar invariance",
      question:
        "По умолчанию TypeVar — covariant, contravariant или invariant?",
      answers: [
        "invariant",
        "инвариантен",
        "инвариантный",
      ],
      hint: "Самый строгий вариант — по умолчанию.",
      explanation:
        "TypeVar по умолчанию инвариантен: List[Cat] НЕ совместим с List[Animal], даже если Cat — Animal. Чтобы получить ковариантность, надо TypeVar('T', covariant=True).",
    },
    {
      type: "question",
      id: "r13-q10",
      title: "Когда типизация ВРЕДНА",
      question:
        "Назови один случай, когда добавлять типы — лишняя нагрузка (одно слово/фраза).",
      answers: [
        "одноразовый скрипт",
        "маленький скрипт",
        "прототип",
        "exploration",
        "ad hoc скрипт",
        "research notebook",
        "разовый скрипт",
        "jupyter",
      ],
      hint: "Что-то, что живёт 10 минут.",
      explanation:
        "Для одноразовых скриптов, jupyter-ноутбуков, экспериментов — типы только тормозят. Они окупаются на коде, который читают другие люди и который живёт долго.",
    },
  ],
  writes: [],
};

// ===========================================================================
// ROUND 14 — Тестирование на pytest
// ===========================================================================
const round14: Round = {
  number: 14,
  title: "Тестирование на pytest: пишем тестируемый код",
  level: "Эксперт",
  intro:
    "Без тестов любой OOP-код через полгода превращается в хрупкий лес наследования. На этом раунде — pytest: фикстуры, parametrize, моки, и почему dependency injection делает код тестируемым.",
  fills: [
    {
      type: "fill",
      id: "r14-f1",
      title: "assert в pytest и базовый тест",
      description:
        "Заполни структуру простейшего pytest-теста.",
      code: `# Файл: test_calc.py  (имя ОБЯЗАНО начинаться с test_)
import pytest


def add(a: int, b: int) -> int:
    return a + b


def divide(a: float, b: float) -> float:
    if b == 0:
        raise ZeroDivisionError("деление на ноль")
    return a / b


# pytest сам ищет функции, начинающиеся с test_
def {{0}}_add_basic():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0


# Проверяем, что определённое исключение действительно поднимается
def test_divide_by_zero():
    with pytest.{{1}}({{2}}):
        divide(10, 0)


# Используем match= для проверки текста ошибки (regex):
def test_divide_by_zero_message():
    with pytest.raises(ZeroDivisionError, {{3}}="деление"):
        divide(1, 0)
`,
      answers: [
        ["test"],
        ["raises"],
        ["ZeroDivisionError"],
        ["match"],
      ],
      hints: [
        "Все тесты в pytest начинаются с этого префикса.",
        "Контекстный менеджер для проверки исключений.",
        "Тип исключения, которого мы ждём.",
        "Параметр для проверки текста ошибки regex-ом.",
      ],
    },
    {
      type: "fill",
      id: "r14-f2",
      title: "Фикстуры и parametrize",
      description:
        "Фикстура — переиспользуемый «контекст» для теста. parametrize — запуск ОДНОГО теста с РАЗНЫМИ входами.",
      code: `import pytest


class ShoppingCart:
    def __init__(self):
        self.items: dict[str, int] = {}

    def add(self, item: str, qty: int = 1) -> None:
        self.items[item] = self.items.get(item, 0) + qty

    def total_qty(self) -> int:
        return sum(self.items.values())


# Фикстура — функция с декоратором @pytest.fixture.
# Её ВОЗВРАТ передаётся в тест как аргумент с тем же именем.
@pytest.{{0}}
def cart() -> ShoppingCart:
    c = ShoppingCart()
    c.add("apple", 3)
    return c


def test_initial_cart(cart):              # ← аргумент cart автоматически = фикстура
    assert cart.total_qty() == {{1}}


def test_can_add_more(cart):              # каждому тесту — СВОЯ копия (фикстура зовётся заново)
    cart.add("bread")
    assert cart.total_qty() == 4


# parametrize — запускает один тест для каждого набора аргументов.
@pytest.mark.{{2}}("a, b, expected", [
    (1, 2, 3),
    (-1, 1, 0),
    (0, 0, 0),
    (10, -3, 7),
])
def test_add_table(a, b, expected):
    assert a + b == {{3}}
`,
      answers: [
        ["fixture"],
        ["3"],
        ["parametrize"],
        ["expected"],
      ],
      hints: [
        "Декоратор для создания фикстуры.",
        "В фикстуре мы добавили 3 яблока.",
        "Декоратор для табличных тестов (с одной 'r'!).",
        "Имя аргумента, в котором хранится ожидаемое значение.",
      ],
    },
    {
      type: "fill",
      id: "r14-f3",
      title: "Mock и dependency injection",
      description:
        "Тестируем класс, который лезет в сеть — но без реальной сети.",
      code: `import pytest
from unittest.mock import {{0}}


class WeatherClient:
    """Зависимость, которая ходит в API. В тестах подменяется."""

    def fetch(self, city: str) -> dict:
        raise NotImplementedError    # настоящая реализация ходила бы в HTTP


class WeatherReporter:
    """Тестируемый класс. Получает зависимость через ИНЪЕКЦИЮ (DI)."""

    def __init__(self, client: WeatherClient) -> None:
        self.client = client

    def report(self, city: str) -> str:
        data = self.client.fetch(city)
        return f"{city}: {data['temp']}°C, {data['desc']}"


def test_report_formats_correctly():
    # Создаём ФЕЙКОВЫЙ клиент. Он автоматически имеет любые методы и атрибуты.
    fake_client = MagicMock(spec=WeatherClient)
    # Настраиваем поведение fetch().
    fake_client.fetch.{{1}} = {"temp": 20, "desc": "ясно"}

    reporter = WeatherReporter(fake_client)
    msg = reporter.report("Москва")

    assert msg == "Москва: 20°C, ясно"
    # Можно проверить, что реальный метод был вызван с нужными аргументами:
    fake_client.fetch.{{2}}("Москва")


def test_handles_api_error():
    fake_client = MagicMock(spec=WeatherClient)
    fake_client.fetch.{{3}} = ConnectionError("нет сети")

    reporter = WeatherReporter(fake_client)
    with pytest.raises(ConnectionError):
        reporter.report("Москва")
`,
      answers: [
        ["MagicMock"],
        ["return_value"],
        ["assert_called_once_with", "assert_called_with"],
        ["side_effect"],
      ],
      hints: [
        "Самый универсальный мок-класс.",
        "Что возвращает мок при вызове — задаётся через этот атрибут.",
        "Метод проверки, что мок был вызван с конкретными аргументами.",
        "Чтобы мок поднимал исключение, используется этот атрибут.",
      ],
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r14-l1",
      title: "Тест с фикстурой и tmp_path",
      description:
        "tmp_path — встроенная фикстура pytest, дающая уникальный временный каталог.",
      code: `import pytest
from pathlib import Path


def save_lines(path: Path, lines: list[str]) -> None:
    path.write_text("\\n".join(lines), encoding="utf-8")


def load_lines(path: Path) -> list[str]:
    return path.read_text(encoding="utf-8").splitlines()


# ─────────────── БЛОК 1: тест round-trip с tmp_path (~5 строк) ───────────────
# tmp_path — встроенная фикстура: pytest сам подсунет уникальный Path.
# Сохрани → загрузи → сравни.
# Шаблон (без отступа):
#     def test_save_and_load_round_trip(tmp_path):
#         file = tmp_path / "data.txt"
#         original = ["alpha", "beta", "gamma"]
#         save_lines(file, original)
#         assert load_lines(file) == original
{{LINE:0}}


# ─────────────── БЛОК 2: тест на пустой список (~4 строки) ───────────────
# Проверь, что сохранение/загрузка пустого списка работает корректно.
# Шаблон:
#     def test_empty_round_trip(tmp_path):
#         file = tmp_path / "empty.txt"
#         save_lines(file, [])
#         assert load_lines(file) == []
{{LINE:1}}
`,
      blanks: [
        {
          lines: 5,
          required: ["def test_save_and_load", "tmp_path", "save_lines", "load_lines", "assert"],
          hint: "def test_save_and_load_round_trip(tmp_path): file = tmp_path / 'data.txt'; original = ['alpha', 'beta', 'gamma']; save_lines(file, original); assert load_lines(file) == original",
          reference: `def test_save_and_load_round_trip(tmp_path):
    file = tmp_path / "data.txt"
    original = ["alpha", "beta", "gamma"]
    save_lines(file, original)
    assert load_lines(file) == original`,
        },
        {
          lines: 4,
          required: ["def test_empty", "tmp_path", "save_lines", "[]", "assert"],
          hint: "def test_empty_round_trip(tmp_path): file = tmp_path / 'empty.txt'; save_lines(file, []); assert load_lines(file) == []",
          reference: `def test_empty_round_trip(tmp_path):
    file = tmp_path / "empty.txt"
    save_lines(file, [])
    assert load_lines(file) == []`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r14-l2",
      title: "Параметризованный тест-таблица",
      description:
        "Один тест — много кейсов через @pytest.mark.parametrize.",
      code: `import pytest


def is_palindrome(s: str) -> bool:
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]


# ─────────────── БЛОК 1: parametrize с 5+ кейсами (~10 строк) ───────────────
# Подбери: пустая строка (True), 1 символ (True), палиндром, не палиндром,
# с пробелами/регистром.
# Шаблон (без отступа):
#     @pytest.mark.parametrize("value, expected", [
#         ("", True),
#         ("a", True),
#         ("aba", True),
#         ("abc", False),
#         ("A man a plan a canal Panama", True),
#     ])
#     def test_palindrome(value, expected):
#         assert is_palindrome(value) is expected
{{LINE:0}}


# ─────────────── БЛОК 2: id для читаемого вывода (~6 строк) ───────────────
# Параметр ids= даёт каждому кейсу читаемое имя в выводе pytest.
# Шаблон:
#     @pytest.mark.parametrize(
#         "n, expected",
#         [(0, 1), (1, 1), (5, 120), (7, 5040)],
#         ids=["zero", "one", "five", "seven"],
#     )
#     def test_factorial(n, expected):
#         assert factorial(n) == expected
{{LINE:1}}


def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)
`,
      blanks: [
        {
          lines: 10,
          required: ["@pytest.mark.parametrize", "value, expected", "True", "False", "def test_palindrome", "is_palindrome", "is expected"],
          hint: "@pytest.mark.parametrize('value, expected', [('', True), ('a', True), ('aba', True), ('abc', False), ('A man a plan a canal Panama', True)]); def test_palindrome(value, expected): assert is_palindrome(value) is expected",
          reference: `@pytest.mark.parametrize("value, expected", [
    ("", True),
    ("a", True),
    ("aba", True),
    ("abc", False),
    ("A man a plan a canal Panama", True),
])
def test_palindrome(value, expected):
    assert is_palindrome(value) is expected`,
        },
        {
          lines: 6,
          required: ["@pytest.mark.parametrize", "ids=", "def test_factorial", "factorial(n)", "expected"],
          hint: "@pytest.mark.parametrize('n, expected', [(0, 1), (1, 1), (5, 120), (7, 5040)], ids=['zero', 'one', 'five', 'seven']); def test_factorial(n, expected): assert factorial(n) == expected",
          reference: `@pytest.mark.parametrize(
    "n, expected",
    [(0, 1), (1, 1), (5, 120), (7, 5040)],
    ids=["zero", "one", "five", "seven"],
)
def test_factorial(n, expected):
    assert factorial(n) == expected`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r14-l3",
      title: "Mock внешней зависимости",
      description:
        "Заменяем реальный HTTP-клиент моком. Проверяем и поведение, и факт вызова.",
      code: `import pytest
from unittest.mock import MagicMock


class HttpClient:
    def get(self, url: str) -> dict:
        raise NotImplementedError


class UserService:
    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def get_username(self, user_id: int) -> str:
        data = self.http.get(f"/users/{user_id}")
        return data["name"].upper()


# ─────────────── БЛОК 1: тест на успешный сценарий (~8 строк) ───────────────
# Mock HttpClient, настрой return_value, вызови get_username, проверь результат
# и факт вызова с правильным URL.
# Шаблон (без отступа):
#     def test_get_username_uppercases():
#         fake_http = MagicMock(spec=HttpClient)
#         fake_http.get.return_value = {"name": "alice"}
#
#         service = UserService(fake_http)
#         assert service.get_username(42) == "ALICE"
#
#         fake_http.get.assert_called_once_with("/users/42")
{{LINE:0}}


# ─────────────── БЛОК 2: тест на ошибку (~6 строк) ───────────────
# Настрой side_effect = ConnectionError("...") и убедись через pytest.raises.
# Шаблон:
#     def test_get_username_propagates_network_error():
#         fake_http = MagicMock(spec=HttpClient)
#         fake_http.get.side_effect = ConnectionError("API down")
#
#         service = UserService(fake_http)
#         with pytest.raises(ConnectionError, match="API down"):
#             service.get_username(1)
{{LINE:1}}
`,
      blanks: [
        {
          lines: 8,
          required: ["def test_get_username", "MagicMock", "return_value", "UserService", "ALICE", "assert_called_once_with"],
          hint: "def test_get_username_uppercases(): fake_http = MagicMock(spec=HttpClient); fake_http.get.return_value = {'name': 'alice'}; service = UserService(fake_http); assert service.get_username(42) == 'ALICE'; fake_http.get.assert_called_once_with('/users/42')",
          reference: `def test_get_username_uppercases():
    fake_http = MagicMock(spec=HttpClient)
    fake_http.get.return_value = {"name": "alice"}

    service = UserService(fake_http)
    assert service.get_username(42) == "ALICE"

    fake_http.get.assert_called_once_with("/users/42")`,
        },
        {
          lines: 6,
          required: ["def test_get_username", "MagicMock", "side_effect", "ConnectionError", "pytest.raises"],
          hint: "def test_get_username_propagates_network_error(): fake_http = MagicMock(spec=HttpClient); fake_http.get.side_effect = ConnectionError('API down'); service = UserService(fake_http); with pytest.raises(ConnectionError, match='API down'): service.get_username(1)",
          reference: `def test_get_username_propagates_network_error():
    fake_http = MagicMock(spec=HttpClient)
    fake_http.get.side_effect = ConnectionError("API down")

    service = UserService(fake_http)
    with pytest.raises(ConnectionError, match="API down"):
        service.get_username(1)`,
        },
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r14-q1",
      title: "Имя файла с тестами",
      question:
        "С какого префикса должно начинаться имя файла, чтобы pytest нашёл его автоматически?",
      answers: ["test_", "test", "test_*"],
      hint: "Тот же префикс, что и у тестовых функций.",
      explanation:
        "По умолчанию pytest ищет файлы по паттерну test_*.py или *_test.py. Имена тестовых функций — test_*. Это можно настроить, но 99% проектов оставляют дефолт.",
    },
    {
      type: "question",
      id: "r14-q2",
      title: "Что такое фикстура?",
      question:
        "Что такое фикстура pytest (одна фраза)?",
      answers: [
        "переиспользуемый контекст для теста",
        "переиспользуемый setup",
        "общий сетап",
        "shared setup",
        "функция, готовящая данные для теста",
        "общий контекст",
      ],
      hint: "Это про подготовку данных, которая нужна нескольким тестам.",
      explanation:
        "Фикстура — функция с @pytest.fixture, которая готовит контекст (объект, временный файл, БД-соединение) и передаёт его в тест как параметр с тем же именем. Альтернатива setUp/tearDown в unittest.",
    },
    {
      type: "question",
      id: "r14-q3",
      title: "Скопы фикстур",
      question:
        "Какой scope у фикстуры по умолчанию?",
      answers: ["function", "функция", "function-scope", "scope='function'"],
      hint: "Самый узкий — для каждого теста заново.",
      explanation:
        "По умолчанию scope='function' — фикстура пересоздаётся для каждого теста. Другие варианты: 'class', 'module', 'session' (для дорогих ресурсов вроде запуска БД).",
    },
    {
      type: "question",
      id: "r14-q4",
      title: "parametrize",
      question:
        "Сколько раз pytest запустит тест с @pytest.mark.parametrize по 5 строк параметров?",
      answers: ["5", "пять", "5 раз"],
      hint: "По одному запуску на каждый набор данных.",
      explanation:
        "parametrize запускает функцию N раз — по одному разу на каждый набор аргументов. Это сильно лучше, чем писать 5 похожих тестов руками.",
    },
    {
      type: "question",
      id: "r14-q5",
      title: "MagicMock vs Mock",
      question:
        "Чем MagicMock отличается от обычного Mock из unittest.mock?",
      answers: [
        "поддерживает магические методы",
        "поддерживает дандер-методы",
        "знает магические методы",
        "magic methods",
        "поддержка __методов__",
      ],
      hint: "В названии — подсказка.",
      explanation:
        "MagicMock умеет подменять __len__, __iter__, __enter__/__exit__ и другие dunder-методы — без этого Mock падает при попытке использовать его как итератор/контекст-менеджер.",
    },
    {
      type: "question",
      id: "r14-q6",
      title: "Dependency injection",
      question:
        "Что такое dependency injection (DI) в одном предложении?",
      answers: [
        "зависимости передаются снаружи",
        "зависимости снаружи",
        "передача зависимостей через конструктор",
        "получение зависимости извне",
        "класс не создаёт свои зависимости сам",
      ],
      hint: "Класс не создаёт свои зависимости сам — их кто-то ему даёт.",
      explanation:
        "DI — приём, при котором класс получает свои зависимости (БД, HTTP-клиент) ИЗВНЕ (через конструктор), а не создаёт их внутри. Это единственный способ нормально тестировать класс с внешними зависимостями.",
    },
    {
      type: "question",
      id: "r14-q7",
      title: "tmp_path",
      question:
        "Какая встроенная фикстура pytest даёт уникальный временный каталог для теста?",
      answers: ["tmp_path", "tmp path"],
      hint: "Возвращает pathlib.Path.",
      explanation:
        "tmp_path — встроенная фикстура. Возвращает Path, уникальный для каждого теста. Удалится автоматически. Альтернатива (старее): tmpdir, py.path.local.",
    },
    {
      type: "question",
      id: "r14-q8",
      title: "spec= в Mock",
      question:
        "Зачем при создании MagicMock передавать spec=SomeClass?",
      answers: [
        "чтобы запретить вызывать несуществующие методы",
        "чтобы мок ругался на лишние методы",
        "чтобы isinstance работал",
        "ограничить интерфейс мока",
        "чтобы мок проверял интерфейс",
      ],
      hint: "Иначе мок «отвечает» на любой вызов и баги не ловятся.",
      explanation:
        "Без spec мок ответит на любой method/attr — даже на тот, которого в реальном классе нет. spec=Cls делает мок строгим: попытка вызвать несуществующий метод поднимет AttributeError.",
    },
    {
      type: "question",
      id: "r14-q9",
      title: "TDD: red-green-refactor",
      question:
        "Какой шаг TDD идёт ПОСЛЕ написания упавшего теста (red)?",
      answers: ["green", "зелёный", "сделать тест зелёным", "написать минимум кода"],
      hint: "Цвет светофора.",
      explanation:
        "Red → Green → Refactor. Сначала пишем тест, который падает. Затем пишем МИНИМУМ кода, чтобы он прошёл (green). Затем рефакторим, не ломая зелёный. Ключ: ни строчки production-кода без падающего теста.",
    },
    {
      type: "question",
      id: "r14-q10",
      title: "Почему НЕЛЬЗЯ тестировать приватные методы",
      question:
        "Почему обычно НЕ стоит писать тесты на приватные (_methods) методы класса?",
      answers: [
        "тестируем поведение",
        "это деталь реализации",
        "это implementation detail",
        "это сделает рефакторинг хрупким",
        "приватные методы могут меняться",
        "не часть контракта",
      ],
      hint: "Что важнее — реализация или поведение?",
      explanation:
        "Приватные методы — деталь реализации. Если тестировать их, любой рефакторинг будет ломать тесты, хотя поведение не изменилось. Тестируй ПУБЛИЧНОЕ поведение через публичный интерфейс — приватные методы покрываются как побочный эффект.",
    },
  ],
  writes: [],
};

// ===========================================================================
// ROUND 15 — Concurrency
// ===========================================================================
const round15: Round = {
  number: 15,
  title: "Concurrency: threading vs asyncio vs multiprocessing",
  level: "Эксперт",
  intro:
    "Три модели параллелизма в Python — три разных мира. Threads хорошо для I/O, но связаны GIL. asyncio — кооператив без GIL-проблем, но требует async-кода всюду. multiprocessing — настоящий параллелизм, но дорогой. Здесь — когда что выбирать.",
  fills: [
    {
      type: "fill",
      id: "r15-f1",
      title: "ThreadPoolExecutor — параллельный I/O",
      description:
        "Высокоуровневый API для пула потоков из concurrent.futures.",
      code: `from concurrent.futures import {{0}}
import time
import urllib.request


def fetch_size(url: str) -> int:
    """I/O-bound функция: ждёт сеть."""
    with urllib.request.urlopen(url) as r:
        return len(r.read())


urls = [
    "https://example.com/",
    "https://example.org/",
    "https://example.net/",
]

# С тред-пулом — все три запроса идут одновременно (пока ждут сеть, GIL отдаётся).
t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers={{1}}) as ex:
    sizes = list(ex.{{2}}(fetch_size, urls))   # сохраняет порядок!
print(f"map: {sum(sizes)} bytes за {time.perf_counter() - t0:.2f}s")

# Альтернатива — submit() возвращает Future, его нужно .result()
with ThreadPoolExecutor(max_workers=3) as ex:
    futures = [ex.submit(fetch_size, u) for u in urls]
    sizes = [f.{{3}}() for f in futures]
print(sum(sizes))
`,
      answers: [
        ["ThreadPoolExecutor"],
        ["3"],
        ["map"],
        ["result"],
      ],
      hints: [
        "Класс из concurrent.futures для пула потоков.",
        "Сколько у нас URL-ов?",
        "Применить функцию к каждому элементу — как у обычного map.",
        "Метод Future для получения результата (блокирующий).",
      ],
    },
    {
      type: "fill",
      id: "r15-f2",
      title: "asyncio.gather: параллельные корутины",
      description:
        "Запускаем несколько асинхронных задач одновременно и ждём все.",
      code: `import asyncio
import time


async def fake_fetch(url: str, delay: float) -> str:
    await asyncio.{{0}}(delay)        # «эмулируем» сеть
    return f"OK: {url}"


async def main() -> None:
    t0 = time.perf_counter()

    # gather запускает корутины ПАРАЛЛЕЛЬНО (на одном потоке, кооперативно)
    results = await asyncio.{{1}}(
        fake_fetch("a", 1),
        fake_fetch("b", 1),
        fake_fetch("c", 1),
    )

    print(results)
    print(f"за {time.perf_counter() - t0:.2f}s")  # ≈ 1s, не 3s

# С Python 3.11+ предпочтительнее TaskGroup — он лучше обрабатывает ошибки:
async def main_modern() -> None:
    async with asyncio.{{2}}() as tg:
        t1 = tg.create_task(fake_fetch("a", 1))
        t2 = tg.create_task(fake_fetch("b", 1))
    print(t1.result(), t2.result())


asyncio.{{3}}(main())
`,
      answers: [
        ["sleep"],
        ["gather"],
        ["TaskGroup"],
        ["run"],
      ],
      hints: [
        "asyncio.* — неблокирующая пауза.",
        "Запустить несколько корутин параллельно и собрать результаты.",
        "Современный Python 3.11+ — структурированная конкуррентность.",
        "Точка входа: запустить корутину из синхронного кода.",
      ],
    },
    {
      type: "fill",
      id: "r15-f3",
      title: "multiprocessing: настоящий параллелизм для CPU",
      description:
        "Когда задача упирается в CPU (а не в I/O), потоки бесполезны из-за GIL. Нужны процессы.",
      code: `from concurrent.futures import {{0}}
import math
import time


def is_prime(n: int) -> bool:
    """CPU-bound: считаем — потоки не помогут из-за GIL."""
    if n < 2:
        return False
    for i in range(2, int(math.isqrt(n)) + 1):
        if n % i == 0:
            return False
    return True


numbers = [10**6 + i for i in range(20)]   # 20 крупных чисел

# Однопоточно
t0 = time.perf_counter()
res_single = [is_prime(n) for n in numbers]
print(f"single: {time.perf_counter() - t0:.2f}s")

# С пулом ПРОЦЕССОВ — каждый процесс со своим интерпретатором, без GIL.
t0 = time.perf_counter()
with ProcessPoolExecutor(max_workers={{1}}) as ex:
    res_multi = list(ex.map(is_prime, numbers))
print(f"multi: {time.perf_counter() - t0:.2f}s")

print(res_single == res_multi)             # True — поведение одинаковое

# Важно: multiprocessing СЕРИАЛИЗУЕТ аргументы (pickle).
# Если объект непикабелен (lambda, локальная функция, открытый файл) — упадёт.
# is_prime — обычная функция модуля, поэтому ОК.

# Когда что выбрать:
# - I/O-bound (сеть, диск, БД) → threads / {{2}}
# - CPU-bound (счёт, парсинг, ML) → {{3}}
`,
      answers: [
        ["ProcessPoolExecutor"],
        ["4", "8", "2"],
        ["asyncio"],
        ["multiprocessing", "ProcessPoolExecutor", "процессы"],
      ],
      hints: [
        "Аналог ThreadPoolExecutor, только процессы.",
        "Любое разумное число параллельных воркеров (2/4/8).",
        "Альтернатива потокам для I/O.",
        "Что нужно для CPU-bound задач?",
      ],
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r15-l1",
      title: "ThreadPoolExecutor с обработкой ошибок",
      description:
        "Скачиваем «страницы», часть из которых падает. Соберём результаты и ошибки отдельно.",
      code: `from concurrent.futures import ThreadPoolExecutor, as_completed


def fetch(url: str) -> str:
    if "fail" in url:
        raise ConnectionError(f"can't reach {url}")
    return f"<html>{url}</html>"


urls = ["https://a", "https://fail.b", "https://c", "https://fail.d"]


# ─────────────── БЛОК 1: запуск пула + сбор результатов и ошибок (~10 строк) ───────────────
# Используем submit() + as_completed — итерация В ПОРЯДКЕ ЗАВЕРШЕНИЯ.
# Для каждого Future пробуем .result(), складываем в один из двух списков.
# Шаблон (без отступа):
#     ok: list[str] = []
#     errors: list[tuple[str, Exception]] = []
#     with ThreadPoolExecutor(max_workers=4) as ex:
#         future_to_url = {ex.submit(fetch, u): u for u in urls}
#         for fut in as_completed(future_to_url):
#             url = future_to_url[fut]
#             try:
#                 ok.append(fut.result())
#             except Exception as e:
#                 errors.append((url, e))
#
#     print(f"ok={len(ok)} errors={len(errors)}")
{{LINE:0}}
`,
      blanks: [
        {
          lines: 11,
          required: ["ThreadPoolExecutor", "submit", "as_completed", "future_to_url", "try", "result()", "except", "ok.append", "errors.append"],
          hint: "ok=[]; errors=[]; with ThreadPoolExecutor(max_workers=4) as ex: future_to_url = {ex.submit(fetch, u): u for u in urls}; for fut in as_completed(future_to_url): url = future_to_url[fut]; try: ok.append(fut.result()); except Exception as e: errors.append((url, e))",
          reference: `ok: list[str] = []
errors: list[tuple[str, Exception]] = []
with ThreadPoolExecutor(max_workers=4) as ex:
    future_to_url = {ex.submit(fetch, u): u for u in urls}
    for fut in as_completed(future_to_url):
        url = future_to_url[fut]
        try:
            ok.append(fut.result())
        except Exception as e:
            errors.append((url, e))

print(f"ok={len(ok)} errors={len(errors)}")`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r15-l2",
      title: "asyncio: cancel, timeout, semaphore",
      description:
        "Ограничиваем число одновременных запросов через Semaphore и ставим таймаут на каждый.",
      code: `import asyncio


async def fake_fetch(url: str, delay: float) -> str:
    await asyncio.sleep(delay)
    return url.upper()


# ─────────────── БЛОК 1: ограничитель concurrency (~6 строк) ───────────────
# Semaphore(N) — не больше N корутин одновременно «внутри» async with.
# Шаблон (без отступа):
#     async def fetch_with_limit(sem: asyncio.Semaphore, url: str, delay: float) -> str:
#         async with sem:
#             try:
#                 return await asyncio.wait_for(fake_fetch(url, delay), timeout=2.0)
#             except asyncio.TimeoutError:
#                 return f"TIMEOUT:{url}"
{{LINE:0}}


async def main():
    sem = asyncio.Semaphore(2)         # одновременно — максимум 2

    # ─────────────── БЛОК 2: gather с обработкой ошибок (~3 строки) ───────────────
    # return_exceptions=True — НЕ роняет всех при первой ошибке.
    # Шаблон:
    #     tasks = [fetch_with_limit(sem, f"u{i}", i * 0.3) for i in range(8)]
    #     results = await asyncio.gather(*tasks, return_exceptions=True)
    #     print(results)
{{LINE:1}}


asyncio.run(main())
`,
      blanks: [
        {
          lines: 6,
          required: ["async def fetch_with_limit", "Semaphore", "async with sem", "wait_for", "TimeoutError"],
          hint: "async def fetch_with_limit(sem, url, delay): async with sem: try: return await asyncio.wait_for(fake_fetch(url, delay), timeout=2.0); except asyncio.TimeoutError: return f'TIMEOUT:{url}'",
          reference: `async def fetch_with_limit(sem: asyncio.Semaphore, url: str, delay: float) -> str:
    async with sem:
        try:
            return await asyncio.wait_for(fake_fetch(url, delay), timeout=2.0)
        except asyncio.TimeoutError:
            return f"TIMEOUT:{url}"`,
        },
        {
          lines: 3,
          required: ["fetch_with_limit", "asyncio.gather", "return_exceptions=True"],
          hint: "tasks = [fetch_with_limit(sem, f'u{i}', i * 0.3) for i in range(8)]; results = await asyncio.gather(*tasks, return_exceptions=True); print(results)",
          reference: `    tasks = [fetch_with_limit(sem, f"u{i}", i * 0.3) for i in range(8)]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    print(results)`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r15-l3",
      title: "Lock и потокобезопасный счётчик",
      description:
        "Без Lock инкремент в потоках теряет данные (read-modify-write не атомарно).",
      code: `import threading
from concurrent.futures import ThreadPoolExecutor


class SafeCounter:
    def __init__(self) -> None:
        self.value = 0
        self._lock = threading.Lock()

    # ─────────────── БЛОК 1: атомарный inc через with self._lock (~4 строки) ───────────────
    # КРИТИЧНО: read-modify-write (self.value += n) НЕ атомарен. Без Lock —
    # потеря инкрементов при race condition.
    # Шаблон (4 пробела за классом):
    #     def inc(self, n: int = 1) -> None:
    #         with self._lock:
    #             self.value += n
{{LINE:0}}


def worker(counter: SafeCounter, n: int) -> None:
    for _ in range(n):
        counter.inc()


# ─────────────── БЛОК 2: 8 потоков по 10000 инкрементов каждый (~5 строк) ───────────────
# С Lock результат всегда 80000. Без Lock — меньше (и непредсказуемо).
# Шаблон (без отступа):
#     counter = SafeCounter()
#     with ThreadPoolExecutor(max_workers=8) as ex:
#         for _ in range(8):
#             ex.submit(worker, counter, 10_000)
#     print(counter.value)            # 80000
{{LINE:1}}
`,
      blanks: [
        {
          lines: 4,
          required: ["def inc", "with self._lock", "self.value", "+="],
          hint: "def inc(self, n=1): with self._lock: self.value += n",
          reference: `    def inc(self, n: int = 1) -> None:
        with self._lock:
            self.value += n`,
        },
        {
          lines: 5,
          required: ["SafeCounter()", "ThreadPoolExecutor", "submit", "worker", "counter.value"],
          hint: "counter = SafeCounter(); with ThreadPoolExecutor(max_workers=8) as ex: for _ in range(8): ex.submit(worker, counter, 10_000); print(counter.value)",
          reference: `counter = SafeCounter()
with ThreadPoolExecutor(max_workers=8) as ex:
    for _ in range(8):
        ex.submit(worker, counter, 10_000)
print(counter.value)`,
        },
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r15-q1",
      title: "Что такое GIL?",
      question:
        "Что такое GIL в одной фразе?",
      answers: [
        "глобальная блокировка интерпретатора",
        "global interpreter lock",
        "блокировка интерпретатора",
        "блокировка которая мешает потокам выполняться параллельно",
        "мьютекс на интерпретатор",
      ],
      hint: "Расшифровка аббревиатуры.",
      explanation:
        "GIL (Global Interpreter Lock) — мьютекс, разрешающий выполнять Python-байткод только одному потоку за раз. Из-за этого настоящего CPU-параллелизма в стандартном CPython между потоками нет. Для I/O это не проблема (GIL отдаётся на блокирующих операциях).",
    },
    {
      type: "question",
      id: "r15-q2",
      title: "Когда threads ХОРОШИ",
      question:
        "Для какого типа задач ThreadPoolExecutor реально ускоряет код?",
      answers: [
        "I/O-bound",
        "io bound",
        "io-bound",
        "сетевые запросы",
        "ввод-вывод",
        "I/O",
      ],
      hint: "Когда программа ждёт сеть/диск/БД.",
      explanation:
        "I/O-bound задачи: сеть, файлы, БД. Пока поток ждёт байт от сокета — он отдаёт GIL, и другие потоки работают. Для CPU-вычислений потоки бесполезны (нужны процессы или asyncio тут тоже не поможет).",
    },
    {
      type: "question",
      id: "r15-q3",
      title: "Когда нужны процессы",
      question:
        "Для какого типа задач нужен multiprocessing вместо threading?",
      answers: ["CPU-bound", "cpu bound", "cpu-bound", "счётные", "вычислительные"],
      hint: "Когда программа считает, а не ждёт.",
      explanation:
        "CPU-bound: численные расчёты, обработка изображений, парсинг. У каждого процесса свой интерпретатор и свой GIL — есть настоящий параллелизм. Цена: межпроцессный обмен через pickle, дорогое создание процессов.",
    },
    {
      type: "question",
      id: "r15-q4",
      title: "asyncio модель",
      question:
        "Asyncio — это вытесняющая или кооперативная многозадачность?",
      answers: [
        "кооперативная",
        "cooperative",
        "кооператив",
      ],
      hint: "Корутины сами решают, когда отдать управление (await).",
      explanation:
        "Кооперативная: задача отдаёт управление в точках await. Если корутина зациклилась без await — все остальные стоят. Преимущество: дешёвое переключение, тысячи задач на одном потоке.",
    },
    {
      type: "question",
      id: "r15-q5",
      title: "asyncio.run vs gather",
      question:
        "Чем asyncio.run() отличается от asyncio.gather()?",
      answers: [
        "run — точка входа",
        "run — запуск из синхронного кода",
        "run запускает loop",
        "run — старт event loop",
        "run создаёт event loop",
        "run для синхронного кода, gather — внутри корутины",
      ],
      hint: "Один запускает event loop, другой комбинирует корутины.",
      explanation:
        "asyncio.run(coro) — точка входа: создаёт event loop, выполняет корутину, закрывает loop. asyncio.gather(c1, c2, ...) — комбинатор корутин ВНУТРИ существующего loop.",
    },
    {
      type: "question",
      id: "r15-q6",
      title: "asyncio.sleep vs time.sleep",
      question:
        "Почему в async-коде нужно asyncio.sleep, а не time.sleep?",
      answers: [
        "time.sleep блокирует event loop",
        "time.sleep блокирует",
        "time.sleep заблокирует все задачи",
        "иначе встанет весь event loop",
        "блокирует поток",
      ],
      hint: "time.sleep — блокирующий вызов.",
      explanation:
        "time.sleep блокирует ПОТОК. В asyncio все корутины живут на одном потоке — заблокировал его, и всё встало. asyncio.sleep отдаёт управление обратно loop'у, остальные задачи продолжают работать.",
    },
    {
      type: "question",
      id: "r15-q7",
      title: "Future.result()",
      question:
        "Что произойдёт при f.result(), если задача ещё не закончилась?",
      answers: [
        "блокируется",
        "ждёт",
        "блокирует поток",
        "блокирующий вызов",
        "поток блокируется",
      ],
      hint: "Это синхронный, блокирующий вызов.",
      explanation:
        "Future.result() блокирует вызывающий поток до завершения задачи. Если хочется неблокирующее ожидание с таймаутом — есть concurrent.futures.wait() и as_completed().",
    },
    {
      type: "question",
      id: "r15-q8",
      title: "Race condition",
      question:
        "Почему `self.x += 1` НЕ атомарен в потоках?",
      answers: [
        "это три операции",
        "read-modify-write",
        "три байткод-инструкции",
        "это не одна инструкция",
        "несколько шагов",
      ],
      hint: "Это read + add + write.",
      explanation:
        "x += 1 = три операции: прочитать, прибавить, записать. Между ними поток может быть прерван — другой поток прочитает старое значение, и инкремент потеряется. Lock делает всю операцию атомарной.",
    },
    {
      type: "question",
      id: "r15-q9",
      title: "TaskGroup vs gather",
      question:
        "Какое главное преимущество asyncio.TaskGroup (3.11+) над asyncio.gather?",
      answers: [
        "структурированная конкуррентность",
        "structured concurrency",
        "лучше обрабатывает ошибки",
        "при ошибке отменяет остальные",
        "автоматическая отмена",
        "отменяет другие при exception",
      ],
      hint: "Это про обработку исключений и отмену.",
      explanation:
        "TaskGroup — структурированная конкуррентность: при ошибке в одной задаче ОСТАЛЬНЫЕ автоматически отменяются, а исключения собираются в ExceptionGroup. gather с return_exceptions=True такого не делает.",
    },
    {
      type: "question",
      id: "r15-q10",
      title: "Сколько потоков создавать",
      question:
        "Какое разумное правило для max_workers ThreadPoolExecutor для CPU-bound задач (1 фраза)?",
      answers: [
        "по числу cpu",
        "число ядер",
        "os.cpu_count",
        "число процессоров",
        "столько сколько ядер",
        "не больше числа ядер",
      ],
      hint: "Считай ядра.",
      explanation:
        "Для CPU-bound: max_workers ≈ os.cpu_count(). Больше — переключения между потоками съедят выигрыш. Для I/O-bound можно гораздо больше (десятки/сотни) — потоки большую часть времени ждут.",
    },
  ],
  writes: [],
};

// ===========================================================================
// ROUND 16 — Чистая архитектура
// ===========================================================================
const round16: Round = {
  number: 16,
  title: "Чистая архитектура: Repository, DI, Use Case",
  level: "Архитектор",
  intro:
    "Финальный раунд: как написать код, который НЕ переписывают через два года. Слои, инверсия зависимостей, репозитории, бизнес-логика отдельно от инфраструктуры. Здесь ООП превращается в архитектуру.",
  fills: [
    {
      type: "fill",
      id: "r16-f1",
      title: "Repository — абстракция над хранилищем",
      description:
        "Бизнес-код не должен знать, лежат ли данные в Postgres, Redis или JSON-файле. Репозиторий — фасад.",
      code: `from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class User:
    id: int
    name: str
    email: str


# Абстрактный репозиторий — КОНТРАКТ. Бизнес-логика говорит ТОЛЬКО с ним.
class UserRepository({{0}}):
    @abstractmethod
    def get(self, user_id: int) -> User | None: ...

    @abstractmethod
    def save(self, user: User) -> None: ...

    @abstractmethod
    def find_by_email(self, email: str) -> User | None: ...


# Реализация в памяти — для тестов и прототипов.
class InMemoryUserRepository(UserRepository):
    def __init__(self) -> None:
        self._store: dict[int, User] = {}

    def get(self, user_id: int) -> User | None:
        return self._store.{{1}}(user_id)

    def save(self, user: User) -> None:
        self._store[user.id] = user

    def find_by_email(self, email: str) -> User | None:
        for u in self._store.values():
            if u.email == email:
                return u
        return None


# Реализация для Postgres — отдельный класс. Бизнес-код не меняется!
class PostgresUserRepository(UserRepository):
    def __init__(self, connection):
        self.conn = connection

    def get(self, user_id: int) -> User | None:
        row = self.conn.execute(
            "SELECT id, name, email FROM users WHERE id = %s", (user_id,)
        ).fetchone()
        return User(*row) if row else None

    def save(self, user: User) -> None:
        self.conn.execute(
            "INSERT INTO users VALUES (%s, %s, %s) ON CONFLICT (id) DO UPDATE SET name = %s, email = %s",
            (user.id, user.name, user.email, user.name, user.email),
        )

    def find_by_email(self, email: str) -> User | None:
        row = self.conn.execute(
            "SELECT id, name, email FROM users WHERE email = %s", (email,)
        ).fetchone()
        return User(*row) if row else None


# Тестируем бизнес-логику — без БД!
repo: UserRepository = {{2}}()
repo.save(User(1, "Alice", "a@x.com"))
print(repo.find_by_email("a@x.com"))

# Принцип ИНВЕРСИИ ЗАВИСИМОСТЕЙ (D в SOLID): код высокого уровня
# зависит от {{3}}, а не от конкретной реализации.
`,
      answers: [
        ["ABC"],
        ["get"],
        ["InMemoryUserRepository"],
        ["абстракции", "абстракций", "интерфейса", "контракта"],
      ],
      hints: [
        "Базовый класс для абстрактных классов.",
        "Метод словаря, безопасно возвращающий None для отсутствующего ключа.",
        "Какой репозиторий используем для тестов?",
        "От чего должен зависеть код высокого уровня по DIP.",
      ],
    },
    {
      type: "fill",
      id: "r16-f2",
      title: "Use Case — единица бизнес-логики",
      description:
        "Use Case = одна операция бизнеса, ничего не знающая ни про HTTP, ни про БД.",
      code: `from dataclasses import dataclass


@dataclass(frozen=True)
class RegisterUserCommand:
    """Входные данные операции — простой DTO."""
    name: str
    email: str


@dataclass(frozen=True)
class RegisterUserResult:
    """Выходные данные — тоже DTO."""
    user_id: int
    message: str


class EmailAlreadyTaken(Exception):
    pass


class RegisterUser:
    """Use Case: зарегистрировать нового пользователя.

    Зависит ТОЛЬКО от абстракций. Никакого Flask, никакого SQLAlchemy.
    """

    def __init__(self, repo: UserRepository, notifier: "Notifier") -> None:
        self.repo = repo
        self.notifier = notifier

    def execute(self, cmd: {{0}}) -> RegisterUserResult:
        if self.repo.find_by_email(cmd.email):
            raise {{1}}(cmd.email)

        new_id = (max((u.id for u in self.repo._store.values()), default=0) + 1)
        user = User(id=new_id, name=cmd.name, email=cmd.email)
        self.repo.{{2}}(user)
        self.notifier.welcome(user)

        return RegisterUserResult(
            user_id=user.id,
            message=f"Пользователь {user.name} зарегистрирован",
        )


class Notifier(ABC):
    @abstractmethod
    def welcome(self, user: User) -> None: ...


class ConsoleNotifier(Notifier):
    def welcome(self, user):
        print(f"Welcome, {user.name}!")


# Сборка в одном месте (composition root).
use_case = RegisterUser(
    repo=InMemoryUserRepository(),
    notifier={{3}}(),
)

result = use_case.execute(RegisterUserCommand(name="Alice", email="a@x.com"))
print(result)
`,
      answers: [
        ["RegisterUserCommand"],
        ["EmailAlreadyTaken"],
        ["save"],
        ["ConsoleNotifier"],
      ],
      hints: [
        "DTO для входных данных, который мы только что определили.",
        "Доменная ошибка про занятый email.",
        "Метод репозитория для записи.",
        "Конкретная реализация Notifier для консоли.",
      ],
    },
    {
      type: "fill",
      id: "r16-f3",
      title: "DI-контейнер вручную и слой доставки",
      description:
        "Composition Root собирает всё в одном месте. Транспорт (HTTP/CLI) — лишь тонкий адаптер.",
      code: `# === Слой доставки (HTTP-адаптер) ============================================
class HTTPHandler:
    """Тонкий слой: разбирает HTTP, зовёт use case, формирует ответ."""

    def __init__(self, register_user: RegisterUser) -> None:
        self.register_user = register_user

    def handle_post_users(self, request_body: dict) -> tuple[int, dict]:
        try:
            cmd = RegisterUserCommand(
                name=request_body["name"],
                email=request_body["email"],
            )
            result = self.register_user.{{0}}(cmd)
            return 201, {"id": result.user_id, "message": result.message}
        except EmailAlreadyTaken as e:
            return 409, {"error": str(e)}
        except KeyError as e:
            return 400, {"error": f"missing field: {e}"}


# === Composition Root ========================================================
def build_handler() -> HTTPHandler:
    """Собираем всё дерево зависимостей в ОДНОМ месте."""
    repo = InMemoryUserRepository()
    notifier = ConsoleNotifier()
    use_case = RegisterUser(repo=repo, notifier=notifier)
    return {{1}}(register_user=use_case)


# === Тест === HTTPHandler можно тестировать без HTTP-сервера!
handler = build_handler()
status, body = handler.handle_post_users({"name": "Bob", "email": "b@x.com"})
print(status, body)        # 201 {...}

# Конфликт email:
status, body = handler.handle_post_users({"name": "Bob2", "email": "b@x.com"})
print(status, body)        # 409 {...}

# Невалидный запрос:
status, body = handler.handle_post_users({"name": "no-email"})
print(status, body)        # 400 {...}

# В реальном проекте build_handler() вызывается ОДИН раз при старте приложения.
# Слои:
#   1. Domain (User, бизнес-правила)              — нет зависимостей
#   2. Use Cases (RegisterUser)                   — зависит от Domain + интерфейсов
#   3. Infra (PostgresRepo, EmailNotifier)        — реализует интерфейсы
#   4. {{2}} (HTTPHandler, CLI)                  — самый тонкий слой
# Стрелки зависимостей идут только внутрь — наружу никогда!

# Это и есть инверсия зависимостей: бизнес-код НЕ зависит от инфраструктуры,
# инфраструктура зависит от АБСТРАКЦИЙ, объявленных в {{3}}.
`,
      answers: [
        ["execute"],
        ["HTTPHandler"],
        ["delivery", "доставки", "транспорт", "адаптер", "Delivery"],
        ["domain", "домене", "доменном слое", "core", "Domain"],
      ],
      hints: [
        "Стандартное имя метода use case.",
        "Класс, который мы собираем в build_handler.",
        "Слой обработки внешних запросов.",
        "Самый внутренний слой Clean Architecture.",
      ],
    },
  ],
  fillLines: [
    {
      type: "fill-lines",
      id: "r16-l1",
      title: "Repository: контракт + тестовая реализация",
      description:
        "Объяви абстрактный Repository и реализацию в памяти.",
      code: `from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Order:
    id: int
    total: float


# ─────────────── БЛОК 1: абстрактный OrderRepository (~6 строк) ───────────────
# Три abstractmethod: get(id), save(order), all_above(threshold).
# Шаблон (без отступа):
#     class OrderRepository(ABC):
#         @abstractmethod
#         def get(self, order_id: int) -> Order | None: ...
#         @abstractmethod
#         def save(self, order: Order) -> None: ...
#         @abstractmethod
#         def all_above(self, threshold: float) -> list[Order]: ...
{{LINE:0}}


# ─────────────── БЛОК 2: InMemoryOrderRepository (~10 строк) ───────────────
# Внутри — обычный dict[int, Order].
# Шаблон:
#     class InMemoryOrderRepository(OrderRepository):
#         def __init__(self) -> None:
#             self._store: dict[int, Order] = {}
#
#         def get(self, order_id: int) -> Order | None:
#             return self._store.get(order_id)
#
#         def save(self, order: Order) -> None:
#             self._store[order.id] = order
#
#         def all_above(self, threshold: float) -> list[Order]:
#             return [o for o in self._store.values() if o.total > threshold]
{{LINE:1}}


repo: OrderRepository = InMemoryOrderRepository()
repo.save(Order(1, 100))
repo.save(Order(2, 50))
repo.save(Order(3, 500))
print(repo.all_above(75))           # [Order(1, 100), Order(3, 500)]
`,
      blanks: [
        {
          lines: 6,
          required: ["class OrderRepository", "ABC", "@abstractmethod", "def get", "def save", "def all_above"],
          hint: "class OrderRepository(ABC): @abstractmethod def get(self, order_id: int) -> Order | None: ...; @abstractmethod def save(self, order: Order) -> None: ...; @abstractmethod def all_above(self, threshold: float) -> list[Order]: ...",
          reference: `class OrderRepository(ABC):
    @abstractmethod
    def get(self, order_id: int) -> Order | None: ...

    @abstractmethod
    def save(self, order: Order) -> None: ...

    @abstractmethod
    def all_above(self, threshold: float) -> list[Order]: ...`,
        },
        {
          lines: 11,
          required: ["class InMemoryOrderRepository", "OrderRepository", "_store", "def get", "def save", "def all_above", "if o.total"],
          hint: "class InMemoryOrderRepository(OrderRepository): def __init__: self._store = {}; def get: return self._store.get(...); def save: self._store[order.id] = order; def all_above: return [o for o in self._store.values() if o.total > threshold]",
          reference: `class InMemoryOrderRepository(OrderRepository):
    def __init__(self) -> None:
        self._store: dict[int, Order] = {}

    def get(self, order_id: int) -> Order | None:
        return self._store.get(order_id)

    def save(self, order: Order) -> None:
        self._store[order.id] = order

    def all_above(self, threshold: float) -> list[Order]:
        return [o for o in self._store.values() if o.total > threshold]`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r16-l2",
      title: "Use Case с DI и доменной ошибкой",
      description:
        "Use Case PlaceOrder использует Repository + PaymentGateway, оба через интерфейсы.",
      code: `from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class Order:
    id: int
    total: float
    paid: bool = False


class OrderRepository(ABC):
    @abstractmethod
    def get(self, order_id: int) -> Order | None: ...
    @abstractmethod
    def save(self, order: Order) -> None: ...


class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, order: Order) -> bool: ...


class OrderNotFound(Exception): pass
class PaymentFailed(Exception): pass


# ─────────────── БЛОК 1: Use Case PlaceOrder (~12 строк) ───────────────
# В __init__ принимает repo + gateway. Метод execute(order_id) — основной сценарий.
# Шаги: найти заказ, проверить, оплатить, сохранить, вернуть результат.
# Шаблон (без отступа):
#     class PlaceOrder:
#         def __init__(self, repo: OrderRepository, gateway: PaymentGateway) -> None:
#             self.repo = repo
#             self.gateway = gateway
#
#         def execute(self, order_id: int) -> Order:
#             order = self.repo.get(order_id)
#             if order is None:
#                 raise OrderNotFound(order_id)
#             if not self.gateway.charge(order):
#                 raise PaymentFailed(order_id)
#             order.paid = True
#             self.repo.save(order)
#             return order
{{LINE:0}}
`,
      blanks: [
        {
          lines: 13,
          required: ["class PlaceOrder", "def __init__", "def execute", "self.repo.get", "OrderNotFound", "self.gateway.charge", "PaymentFailed", "order.paid", "self.repo.save", "return order"],
          hint: "class PlaceOrder: def __init__(self, repo, gateway): self.repo, self.gateway = repo, gateway; def execute(self, order_id): order = self.repo.get(order_id); if order is None: raise OrderNotFound(...); if not self.gateway.charge(order): raise PaymentFailed(...); order.paid = True; self.repo.save(order); return order",
          reference: `class PlaceOrder:
    def __init__(self, repo: OrderRepository, gateway: PaymentGateway) -> None:
        self.repo = repo
        self.gateway = gateway

    def execute(self, order_id: int) -> Order:
        order = self.repo.get(order_id)
        if order is None:
            raise OrderNotFound(order_id)
        if not self.gateway.charge(order):
            raise PaymentFailed(order_id)
        order.paid = True
        self.repo.save(order)
        return order`,
        },
      ],
    },
    {
      type: "fill-lines",
      id: "r16-l3",
      title: "Service Layer + транзакция",
      description:
        "Сервис, который оборачивает несколько repo-вызовов в транзакцию (Unit of Work).",
      code: `from abc import ABC, abstractmethod
from contextlib import contextmanager


class UnitOfWork(ABC):
    """Контекст транзакции. На выходе — commit, при ошибке — rollback."""

    @abstractmethod
    def commit(self) -> None: ...

    @abstractmethod
    def rollback(self) -> None: ...

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        if exc_type is None:
            self.commit()
        else:
            self.rollback()
        return False


# ─────────────── БЛОК 1: TransferService с UoW (~10 строк) ───────────────
# Метод transfer(uow_factory, from_id, to_id, amount):
#   - открывает uow через uow_factory() как контекст
#   - дебитует один счёт, кредитует другой
#   - выходит из with — commit/rollback автоматически.
# Шаблон (без отступа):
#     class TransferService:
#         def __init__(self, accounts: dict) -> None:
#             self.accounts = accounts
#
#         def transfer(self, uow_factory, from_id: int, to_id: int, amount: float) -> None:
#             with uow_factory() as uow:
#                 if self.accounts[from_id] < amount:
#                     raise ValueError("недостаточно средств")
#                 self.accounts[from_id] -= amount
#                 self.accounts[to_id] += amount
{{LINE:0}}


# ─────────────── БЛОК 2: фейковый UoW для теста (~8 строк) ───────────────
# Простая реализация, считает commit/rollback.
# Шаблон:
#     class FakeUoW(UnitOfWork):
#         def __init__(self):
#             self.committed = 0
#             self.rolled_back = 0
#
#         def commit(self):
#             self.committed += 1
#
#         def rollback(self):
#             self.rolled_back += 1
{{LINE:1}}


# Сценарий: успешный перевод → commit; ошибка → rollback.
accounts = {1: 100.0, 2: 50.0}
service = TransferService(accounts)

uow = FakeUoW()
service.transfer(lambda: uow, from_id=1, to_id=2, amount=30)
print(accounts, uow.committed, uow.rolled_back)    # {1:70, 2:80} 1 0

uow2 = FakeUoW()
try:
    service.transfer(lambda: uow2, from_id=1, to_id=2, amount=10_000)
except ValueError:
    pass
print(uow2.committed, uow2.rolled_back)            # 0 1
`,
      blanks: [
        {
          lines: 10,
          required: ["class TransferService", "def __init__", "self.accounts", "def transfer", "uow_factory()", "with", "недостаточно", "self.accounts[from_id]"],
          hint: "class TransferService: def __init__(self, accounts): self.accounts = accounts; def transfer(self, uow_factory, from_id, to_id, amount): with uow_factory() as uow: if self.accounts[from_id] < amount: raise ValueError(...); self.accounts[from_id] -= amount; self.accounts[to_id] += amount",
          reference: `class TransferService:
    def __init__(self, accounts: dict) -> None:
        self.accounts = accounts

    def transfer(self, uow_factory, from_id: int, to_id: int, amount: float) -> None:
        with uow_factory() as uow:
            if self.accounts[from_id] < amount:
                raise ValueError("недостаточно средств")
            self.accounts[from_id] -= amount
            self.accounts[to_id] += amount`,
        },
        {
          lines: 8,
          required: ["class FakeUoW", "UnitOfWork", "self.committed", "self.rolled_back", "def commit", "def rollback"],
          hint: "class FakeUoW(UnitOfWork): def __init__(self): self.committed = 0; self.rolled_back = 0; def commit(self): self.committed += 1; def rollback(self): self.rolled_back += 1",
          reference: `class FakeUoW(UnitOfWork):
    def __init__(self):
        self.committed = 0
        self.rolled_back = 0

    def commit(self):
        self.committed += 1

    def rollback(self):
        self.rolled_back += 1`,
        },
      ],
    },
  ],
  questions: [
    {
      type: "question",
      id: "r16-q1",
      title: "S из SOLID",
      question:
        "Что означает буква S в принципах SOLID?",
      answers: [
        "single responsibility",
        "single responsibility principle",
        "принцип единственной ответственности",
        "единственная ответственность",
      ],
      hint: "Один класс — одна причина для изменения.",
      explanation:
        "Single Responsibility Principle: класс должен иметь ровно одну причину меняться. Если класс одновременно валидирует, сохраняет в БД И отправляет email — у него три причины меняться. Лучше разделить.",
    },
    {
      type: "question",
      id: "r16-q2",
      title: "D из SOLID",
      question:
        "Что означает буква D в SOLID?",
      answers: [
        "dependency inversion",
        "dependency inversion principle",
        "инверсия зависимостей",
        "принцип инверсии зависимостей",
      ],
      hint: "Зависим от абстракций, а не от реализаций.",
      explanation:
        "Dependency Inversion Principle: код высокого уровня (use cases) не должен зависеть от кода низкого уровня (БД). Оба зависят от абстракций. Это позволяет менять БД, не трогая бизнес-логику.",
    },
    {
      type: "question",
      id: "r16-q3",
      title: "Repository pattern",
      question:
        "Что прячет от бизнес-логики Repository?",
      answers: [
        "хранилище",
        "бд",
        "источник данных",
        "детали хранения",
        "технологию хранения",
        "БД",
        "детали базы",
      ],
      hint: "Откуда и куда лежат данные.",
      explanation:
        "Repository — фасад над хранилищем. Бизнес-код видит только методы вроде get/save, не зная, идут ли они в Postgres, Redis или memory. Это даёт тестируемость (in-memory repo) и заменяемость технологий.",
    },
    {
      type: "question",
      id: "r16-q4",
      title: "Use Case",
      question:
        "Чем отличается Use Case от Service в Clean Architecture (одна фраза)?",
      answers: [
        "use case — одна операция",
        "use case — одна бизнес-операция",
        "use case — единичный сценарий",
        "service объединяет несколько use cases",
        "use case — атомарный сценарий",
      ],
      hint: "Один — атомарный, второй может объединять.",
      explanation:
        "Use Case = одна бизнес-операция (RegisterUser, PlaceOrder). Service может объединять несколько use cases или содержать чисто доменную логику. В строгой Clean Architecture часто только Use Cases.",
    },
    {
      type: "question",
      id: "r16-q5",
      title: "Composition Root",
      question:
        "Что такое Composition Root?",
      answers: [
        "место сборки зависимостей",
        "место где собираются все зависимости",
        "точка инициализации DI",
        "одно место сборки графа объектов",
        "точка сборки приложения",
      ],
      hint: "Самая «верхняя» точка приложения, где new вызывается явно.",
      explanation:
        "Composition Root — единственное место, где конкретные классы соединяются в граф объектов. Обычно — функция main() или фабрика рядом с ней. Остальной код только потребляет уже собранные зависимости.",
    },
    {
      type: "question",
      id: "r16-q6",
      title: "Зачем DTO",
      question:
        "Почему между слоями обычно передают DTO (dataclass), а не сам ORM-объект?",
      answers: [
        "слабая связность",
        "слой не зависит от orm",
        "избежать утечки orm",
        "чтобы не тащить orm в use case",
        "разделение слоёв",
        "независимость от orm",
        "избежать утечки деталей",
      ],
      hint: "Иначе ORM протекает в слой бизнеса.",
      explanation:
        "Если передавать ORM-объект — use case случайно начнёт лениво подгружать связи (lazy loading), ловить ошибки detached session и зависеть от деталей БД. DTO — чистый «снимок» данных, который безопасно передавать через границы слоёв.",
    },
    {
      type: "question",
      id: "r16-q7",
      title: "Unit of Work",
      question:
        "Какую задачу решает паттерн Unit of Work?",
      answers: [
        "транзакция",
        "транзакционность",
        "коммит и rollback",
        "управление транзакцией",
        "атомарность нескольких операций",
        "границы транзакции",
      ],
      hint: "Это про commit/rollback.",
      explanation:
        "UoW группирует несколько изменений в одну атомарную транзакцию. На выходе из with — commit, при исключении — rollback. Бизнес-код не пишет ни одного SQL-statement про BEGIN/COMMIT.",
    },
    {
      type: "question",
      id: "r16-q8",
      title: "Anemic Domain Model",
      question:
        "Что такое анемичная модель (anemic domain model)?",
      answers: [
        "только данные без поведения",
        "класс без методов",
        "только геттеры и сеттеры",
        "просто DTO без логики",
        "поля без поведения",
        "класс с одними полями",
      ],
      hint: "Класс — только данные, вся логика снаружи.",
      explanation:
        "Анемичная модель — класс с полями без поведения, вся логика — в сервисах. Считается анти-паттерном в DDD: «сущность должна знать свои инварианты». Но в простых CRUD-системах часто это достаточный pragmatic выбор.",
    },
    {
      type: "question",
      id: "r16-q9",
      title: "Тонкий контроллер",
      question:
        "Какое правило для контроллеров (HTTP-handler) в Clean Architecture (1 фраза)?",
      answers: [
        "должен быть тонким",
        "тонкий",
        "тонкий контроллер",
        "минимум кода",
        "только маппинг",
        "только перевод данных",
        "никакой бизнес-логики",
      ],
      hint: "В нём должно быть как можно МЕНЬШЕ кода.",
      explanation:
        "Контроллер должен только: 1) разобрать запрос → DTO, 2) позвать use case, 3) сериализовать ответ. Никакой бизнес-логики, никаких прямых обращений к БД. Если контроллер растёт — это сигнал, что use case не выделен.",
    },
    {
      type: "question",
      id: "r16-q10",
      title: "Когда Clean Architecture — оверкилл",
      question:
        "Назови один случай, когда полная Clean Architecture не нужна (одно слово/фраза).",
      answers: [
        "прототип",
        "MVP",
        "одноразовый скрипт",
        "маленький CRUD",
        "маленькое приложение",
        "POC",
        "учебный проект",
        "простое CRUD",
      ],
      hint: "Что-то небольшое и недолговечное.",
      explanation:
        "Чистая архитектура с чёткими слоями имеет смысл, когда код будут поддерживать долго и людей много. Для прототипа, MVP или одноразового скрипта она тормозит. Архитектура — инструмент, а не самоцель: применять там, где её цена окупается.",
    },
  ],
  writes: [],
};

export const EXTRA_ROUNDS_PART1: Round[] = [round11, round12, round13];
export const EXTRA_ROUNDS_PART2: Round[] = [round14, round15, round16];
export const EXTRA_ROUNDS: Round[] = [...EXTRA_ROUNDS_PART1, ...EXTRA_ROUNDS_PART2];
