"""
╔══════════════════════════════════════════════════════════════════════════════╗
║              FastAPI — Полный учебный проект «Книжный магазин»              ║
║                        Покрывает все 10 разделов курса                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

Запуск:
    pip install fastapi uvicorn[standard] sqlalchemy python-jose[cryptography] passlib[bcrypt]
    uvicorn app:app --reload

После запуска:
    http://127.0.0.1:8000        — API
    http://127.0.0.1:8000/docs   — Swagger UI (интерактивная документация)
    http://127.0.0.1:8000/redoc  — ReDoc

Структура файла:
    Раздел 1  — Основы: маршруты, параметры пути/запроса
    Раздел 2  — Pydantic: схемы, Field(), вложенные модели
    Раздел 3  — HTTPException и Depends (зависимости)
    Раздел 4  — response_model и статус-коды
    Раздел 5  — APIRouter (модульная архитектура)
    Раздел 6  — SQLAlchemy (работа с базой данных)
    Раздел 7  — JWT-аутентификация и OAuth2
    Раздел 8  — Middleware, CORS, BackgroundTasks
    Раздел 9  — Тестирование (пример с TestClient)
    Раздел 10 — Async, Lifespan, деплой
"""

# ══════════════════════════════════════════════════════════════════════════════
# ИМПОРТЫ
# ══════════════════════════════════════════════════════════════════════════════

from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Annotated, AsyncGenerator

from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    HTTPException,
    Request,
    Response,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import Column, Integer, String, Float, Boolean, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# JWT / пароли — установи: pip install python-jose[cryptography] passlib[bcrypt]
try:
    from jose import JWTError, jwt
    from passlib.context import CryptContext
    JWT_AVAILABLE = True
except ImportError:
    JWT_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bookstore")


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 10 — Lifespan: код при старте и завершении приложения
# ══════════════════════════════════════════════════════════════════════════════
# Lifespan заменяет @app.on_event("startup") / "shutdown" (устарело).
# Код ДО yield — при старте. Код ПОСЛЕ yield — при завершении.

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # ── Старт ──────────────────────────────────────────────────────────────
    logger.info("🚀 Книжный магазин запускается...")
    # Создаём таблицы в БД при первом запуске
    Base.metadata.create_all(bind=engine)
    # Заполняем тестовыми данными
    _seed_database()
    logger.info("✅ База данных готова")
    yield
    # ── Завершение ─────────────────────────────────────────────────────────
    logger.info("👋 Приложение завершает работу")


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 1 — Основное приложение
# ══════════════════════════════════════════════════════════════════════════════
# FastAPI() принимает метаданные: title, description, version.
# Они отображаются в /docs и /openapi.json.

app = FastAPI(
    title="Книжный магазин API",
    description=(
        "**Учебный проект** — демонстрация всех возможностей FastAPI.\n\n"
        "Маршруты:\n"
        "- `/books` — каталог книг (CRUD)\n"
        "- `/authors` — авторы\n"
        "- `/auth` — регистрация и JWT-авторизация\n"
        "- `/orders` — заказы (только авторизованным)\n"
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 8 — CORS и Middleware
# ══════════════════════════════════════════════════════════════════════════════
# CORS — Cross-Origin Resource Sharing.
# Без этого браузер блокирует запросы с другого домена (например, фронт на :3000 → API на :8000).
# allow_origins=["*"] — для разработки. В продакшене — конкретный домен.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # в продакшене: ["https://my-frontend.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Middleware — это «обёртка» вокруг каждого запроса.
# Выполняется ДО и ПОСЛЕ обработчика маршрута.
@app.middleware("http")
async def log_requests(request: Request, call_next) -> Response:
    """Логируем каждый запрос с временем выполнения."""
    start = asyncio.get_event_loop().time()
    response = await call_next(request)
    elapsed = (asyncio.get_event_loop().time() - start) * 1000
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({elapsed:.1f}ms)")
    return response


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 6 — База данных (SQLAlchemy)
# ══════════════════════════════════════════════════════════════════════════════
# SQLite — файловая БД, не требует установки сервера. Для продакшена — PostgreSQL.
# create_engine создаёт «движок» — точку подключения к БД.
# connect_args={"check_same_thread": False} — нужно только для SQLite в FastAPI.

DATABASE_URL = "sqlite:///./bookstore.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Базовый класс для всех моделей SQLAlchemy."""
    pass


# ORM-модели описывают таблицы в БД.
# Column(Integer, primary_key=True) — первичный ключ, автоинкремент.

class BookDB(Base):
    """Таблица books в базе данных."""
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    year = Column(Integer)
    price = Column(Float, nullable=False)
    genre = Column(String, default="Без жанра")
    available = Column(Boolean, default=True)


class UserDB(Base):
    """Таблица users в базе данных."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)


def get_db():
    """
    Зависимость (Depends) для получения сессии БД.
    Паттерн: открываем сессию → отдаём маршруту → закрываем в finally.
    yield делает эту функцию «контекстным менеджером» для FastAPI.
    """
    db = SessionLocal()
    try:
        yield db       # ← маршрут получает db здесь
    finally:
        db.close()     # ← всегда закрываем, даже если была ошибка


def _seed_database() -> None:
    """Заполняем БД начальными данными при первом запуске."""
    db = SessionLocal()
    try:
        if db.query(BookDB).count() == 0:
            sample_books = [
                BookDB(title="Чистый код", author="Роберт Мартин", year=2008, price=1200.0, genre="Программирование"),
                BookDB(title="Паттерны проектирования", author="Банда четырёх", year=1994, price=1500.0, genre="Программирование"),
                BookDB(title="Мастер и Маргарита", author="Михаил Булгаков", year=1967, price=450.0, genre="Роман"),
                BookDB(title="Python Tricks", author="Дэн Бейдер", year=2017, price=900.0, genre="Программирование"),
                BookDB(title="Война и мир", author="Лев Толстой", year=1869, price=600.0, genre="Роман"),
            ]
            db.add_all(sample_books)
            db.commit()
    finally:
        db.close()


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 2 — Pydantic-схемы (модели данных)
# ══════════════════════════════════════════════════════════════════════════════
# Pydantic-модели — это «контракты» данных.
# FastAPI использует их для:
#   1. Валидации входящих данных (тело запроса)
#   2. Сериализации исходящих данных (response_model)
#   3. Генерации документации (Swagger)
#
# Наследуй от BaseModel, описывай поля с типами.
# Field() добавляет ограничения и описание.

class BookCreate(BaseModel):
    """Схема для создания книги (тело POST-запроса)."""
    title: str = Field(..., min_length=1, max_length=200, description="Название книги")
    author: str = Field(..., min_length=2, max_length=100, description="Автор")
    year: int | None = Field(None, ge=1000, le=2100, description="Год издания")
    price: float = Field(..., gt=0, le=100000, description="Цена в рублях")
    genre: str = Field("Без жанра", max_length=50, description="Жанр")

    # field_validator — кастомная валидация поля
    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Название не может состоять только из пробелов")
        return v.strip()


class BookUpdate(BaseModel):
    """Схема для обновления книги (тело PATCH-запроса).
    Все поля Optional — можно передавать только нужные.
    """
    title: str | None = Field(None, min_length=1, max_length=200)
    author: str | None = Field(None, min_length=2, max_length=100)
    year: int | None = Field(None, ge=1000, le=2100)
    price: float | None = Field(None, gt=0, le=100000)
    genre: str | None = Field(None, max_length=50)
    available: bool | None = None


class BookResponse(BaseModel):
    """Схема ответа — что видит клиент.
    Включает id и available, которых нет в BookCreate.
    model_config позволяет создавать схему из ORM-объекта (from_attributes).
    """
    id: int
    title: str
    author: str
    year: int | None
    price: float
    genre: str
    available: bool

    model_config = {"from_attributes": True}  # читаем атрибуты ORM-объекта


class UserCreate(BaseModel):
    """Схема регистрации пользователя."""
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: str = Field(..., description="Email пользователя")
    password: str = Field(..., min_length=8, description="Пароль (минимум 8 символов)")


class UserPublic(BaseModel):
    """Публичная схема пользователя — БЕЗ пароля!
    response_model=UserPublic гарантирует, что хэш пароля никогда не попадёт в ответ.
    """
    id: int
    username: str
    email: str
    is_active: bool

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """Схема JWT-токена для ответа /auth/login."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Данные внутри JWT-токена."""
    username: str | None = None


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 7 — JWT-аутентификация
# ══════════════════════════════════════════════════════════════════════════════
# JWT (JSON Web Token) — это подписанный токен, который содержит данные о пользователе.
# Клиент получает токен при логине и передаёт его в заголовке Authorization: Bearer <token>.
# Сервер проверяет подпись и читает данные — без обращения к БД.
#
# SECRET_KEY — секрет для подписи. В продакшене хранить в переменной окружения!
# ALGORITHM — алгоритм подписи (HS256 — стандартный)
# ACCESS_TOKEN_EXPIRE_MINUTES — время жизни токена

SECRET_KEY = "замени-на-случайную-строку-в-продакшене-min-32-символа"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2PasswordBearer — схема авторизации.
# tokenUrl="auth/login" — URL для получения токена (ссылка в Swagger).
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

if JWT_AVAILABLE:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _hash_password(password: str) -> str:
    if JWT_AVAILABLE:
        return pwd_context.hash(password)
    return f"hashed_{password}"  # заглушка без passlib


def _verify_password(plain: str, hashed: str) -> bool:
    if JWT_AVAILABLE:
        return pwd_context.verify(plain, hashed)
    return hashed == f"hashed_{plain}"  # заглушка


def _create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Создаём JWT-токен с данными пользователя и временем истечения."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode["exp"] = expire
    if JWT_AVAILABLE:
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return f"mock_token_{data.get('sub', 'user')}"  # заглушка


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 3 — Зависимости (Depends)
# ══════════════════════════════════════════════════════════════════════════════
# Depends — это система «внедрения зависимостей».
# Зависимость — функция, которая вычисляется ПЕРЕД обработчиком маршрута.
# FastAPI вызывает зависимость, передаёт результат в параметр маршрута.
#
# Зачем? Переиспользование логики: авторизация, пагинация, получение объектов из БД.

def get_pagination(skip: int = 0, limit: int = 20) -> dict:
    """
    Зависимость для пагинации.
    Автоматически добавляет ?skip=0&limit=20 к любому маршруту.
    """
    return {"skip": max(0, skip), "limit": min(100, limit)}


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> UserDB:
    """
    Зависимость для авторизации.
    Получает токен из заголовка Authorization: Bearer <token>,
    декодирует JWT, находит пользователя в БД.
    Если что-то не так — поднимает 401.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось подтвердить учётные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if JWT_AVAILABLE:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str | None = payload.get("sub")
        else:
            username = token.replace("mock_token_", "")
        if username is None:
            raise credentials_exception
    except (JWTError if JWT_AVAILABLE else Exception):
        raise credentials_exception

    user = db.query(UserDB).filter(UserDB.username == username).first()
    if user is None:
        raise credentials_exception
    return user


async def get_active_user(
    current_user: Annotated[UserDB, Depends(get_current_user)],
) -> UserDB:
    """
    Зависимость поверх зависимости (chain).
    Проверяет что пользователь не заблокирован.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Пользователь неактивен")
    return current_user


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 5 — APIRouter (модульная архитектура)
# ══════════════════════════════════════════════════════════════════════════════
# APIRouter — аналог Blueprint во Flask.
# Позволяет разбить большое приложение на логические блоки.
# prefix="/books" — все маршруты роутера начинаются с /books
# tags=["books"] — группировка в документации Swagger

books_router = APIRouter(prefix="/books", tags=["📚 Книги"])
auth_router = APIRouter(prefix="/auth", tags=["🔐 Авторизация"])
orders_router = APIRouter(
    prefix="/orders",
    tags=["🛒 Заказы"],
    dependencies=[Depends(get_active_user)],  # ← весь роутер защищён авторизацией
)


# ══════════════════════════════════════════════════════════════════════════════
# МАРШРУТЫ — Книги (books_router)
# ══════════════════════════════════════════════════════════════════════════════

@books_router.get(
    "/",
    response_model=list[BookResponse],    # ← Раздел 4: фильтрует поля ответа
    summary="Список всех книг",
)
async def list_books(
    pagination: Annotated[dict, Depends(get_pagination)],  # ← Раздел 3: Depends
    genre: str | None = None,                              # ← Раздел 1: query param
    available_only: bool = False,
    db: Annotated[Session, Depends(get_db)] = None,        # ← Раздел 6: БД
) -> list[BookDB]:
    """
    Возвращает список книг с пагинацией и фильтрацией.

    - **genre**: фильтр по жанру (опционально)
    - **available_only**: только доступные книги
    - **skip**, **limit**: пагинация
    """
    query = db.query(BookDB)
    if genre:
        query = query.filter(BookDB.genre == genre)
    if available_only:
        query = query.filter(BookDB.available == True)
    return query.offset(pagination["skip"]).limit(pagination["limit"]).all()


@books_router.get(
    "/{book_id}",
    response_model=BookResponse,
    summary="Книга по ID",
)
async def get_book(
    book_id: int,                              # ← Раздел 1: path parameter
    db: Annotated[Session, Depends(get_db)] = None,
) -> BookDB:
    """
    Возвращает одну книгу по ID.
    Поднимает 404 если книга не найдена.
    """
    book = db.query(BookDB).filter(BookDB.id == book_id).first()
    if not book:
        # Раздел 3: HTTPException вместо return {"error": ...}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Книга с id={book_id} не найдена",
        )
    return book


@books_router.post(
    "/",
    response_model=BookResponse,
    status_code=status.HTTP_201_CREATED,   # ← Раздел 4: правильный статус-код
    summary="Добавить книгу",
)
async def create_book(
    book_data: BookCreate,                  # ← Раздел 2: Pydantic-схема из тела запроса
    db: Annotated[Session, Depends(get_db)] = None,
) -> BookDB:
    """
    Создаёт новую книгу. Принимает JSON в теле запроса.
    FastAPI автоматически валидирует через BookCreate.
    """
    new_book = BookDB(**book_data.model_dump())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)  # обновляем объект из БД (нужно для получения id)
    return new_book


@books_router.patch(
    "/{book_id}",
    response_model=BookResponse,
    summary="Обновить книгу",
)
async def update_book(
    book_id: int,
    book_data: BookUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
) -> BookDB:
    """
    Частичное обновление книги (PATCH).
    Обновляем только переданные поля (exclude_unset=True).
    """
    book = db.query(BookDB).filter(BookDB.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail=f"Книга с id={book_id} не найдена")

    # exclude_unset=True — пропускаем поля, которые не были переданы в запросе
    update_data = book_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)

    db.commit()
    db.refresh(book)
    return book


@books_router.delete(
    "/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT,   # 204 = удалено, тело пустое
    summary="Удалить книгу",
)
async def delete_book(
    book_id: int,
    db: Annotated[Session, Depends(get_db)] = None,
) -> None:
    book = db.query(BookDB).filter(BookDB.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail=f"Книга с id={book_id} не найдена")
    db.delete(book)
    db.commit()
    # 204 No Content — возвращаем None, FastAPI не добавит тело


# ══════════════════════════════════════════════════════════════════════════════
# МАРШРУТЫ — Авторизация (auth_router)
# ══════════════════════════════════════════════════════════════════════════════

@auth_router.post(
    "/register",
    response_model=UserPublic,               # ← пароль НЕ попадёт в ответ
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация пользователя",
)
async def register(
    user_data: UserCreate,
    db: Annotated[Session, Depends(get_db)] = None,
) -> UserDB:
    """Регистрирует нового пользователя. Хэширует пароль через bcrypt."""
    # Проверяем уникальность username
    if db.query(UserDB).filter(UserDB.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем уже существует",
        )
    if db.query(UserDB).filter(UserDB.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Этот email уже зарегистрирован",
        )

    new_user = UserDB(
        username=user_data.username,
        email=user_data.email,
        hashed_password=_hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@auth_router.post(
    "/login",
    response_model=Token,
    summary="Получить JWT-токен",
)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[Session, Depends(get_db)] = None,
) -> dict:
    """
    Логин через форму (username + password).
    OAuth2PasswordRequestForm — стандартная форма OAuth2.
    Возвращает JWT access_token.
    """
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user or not _verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = _create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.get(
    "/me",
    response_model=UserPublic,
    summary="Текущий пользователь",
)
async def get_me(
    current_user: Annotated[UserDB, Depends(get_active_user)],  # ← защита через Depends
) -> UserDB:
    """Возвращает данные текущего авторизованного пользователя."""
    return current_user


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 8 — BackgroundTasks
# ══════════════════════════════════════════════════════════════════════════════
# BackgroundTasks — задачи, которые выполняются ПОСЛЕ отправки ответа клиенту.
# Полезно для: отправки email, логирования, обновления кэша.
# НЕ используй для тяжёлых задач (используй Celery или ARQ).

def _send_order_confirmation(user_email: str, book_title: str) -> None:
    """Имитация отправки email-уведомления (выполняется в фоне)."""
    logger.info(f"📧 Email отправлен на {user_email}: заказ '{book_title}' принят")


@orders_router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Создать заказ",
)
async def create_order(
    book_id: int,
    background_tasks: BackgroundTasks,                          # ← BackgroundTasks
    current_user: Annotated[UserDB, Depends(get_active_user)],
    db: Annotated[Session, Depends(get_db)] = None,
) -> dict:
    """
    Создаёт заказ на книгу.
    Отправляет email-подтверждение в фоне (не блокирует ответ).
    """
    book = db.query(BookDB).filter(BookDB.id == book_id, BookDB.available == True).first()
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена или недоступна")

    # Добавляем фоновую задачу — клиент уже получил ответ когда она выполнится
    background_tasks.add_task(
        _send_order_confirmation,
        user_email=current_user.email,
        book_title=book.title,
    )

    return {
        "message": f"Заказ на «{book.title}» принят",
        "user": current_user.username,
        "book_id": book.id,
        "price": book.price,
        "ordered_at": datetime.now(timezone.utc).isoformat(),
    }


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 1 — Базовые маршруты на корневом приложении
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["🏠 Главная"], summary="Статус API")
async def root() -> dict:
    """Проверка работоспособности API (health check)."""
    return {
        "status": "ok",
        "service": "Книжный магазин API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health", tags=["🏠 Главная"], summary="Health check")
async def health() -> JSONResponse:
    """
    Раздел 4: JSONResponse — явный контроль над ответом.
    Полезно когда нужны кастомные заголовки или точный контроль над статус-кодом.
    """
    return JSONResponse(
        status_code=200,
        content={"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()},
        headers={"X-Service": "bookstore-api"},
    )


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 10 — Async маршруты
# ══════════════════════════════════════════════════════════════════════════════
# async def — асинхронный обработчик.
# Используй для I/O операций: HTTP-запросы, файлы, внешние API.
# НЕ делай синхронные блокирующие операции внутри async (используй asyncio.to_thread).

@app.get("/stats", tags=["🏠 Главная"], summary="Статистика магазина")
async def get_stats(db: Annotated[Session, Depends(get_db)] = None) -> dict:
    """Возвращает статистику: количество книг, жанры, ценовой диапазон."""
    # asyncio.sleep — имитация async I/O (например, запрос к внешнему сервису)
    await asyncio.sleep(0)

    total = db.query(BookDB).count()
    available = db.query(BookDB).filter(BookDB.available == True).count()
    books = db.query(BookDB).all()
    prices = [b.price for b in books]
    genres = list({b.genre for b in books})

    return {
        "total_books": total,
        "available_books": available,
        "genres": sorted(genres),
        "price_range": {
            "min": min(prices) if prices else 0,
            "max": max(prices) if prices else 0,
            "avg": round(sum(prices) / len(prices), 2) if prices else 0,
        },
    }


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 5 — Подключение роутеров к приложению
# ══════════════════════════════════════════════════════════════════════════════
# include_router присоединяет роутер к главному приложению.
# Маршруты из books_router станут: /books/, /books/{id}, и т.д.

app.include_router(books_router)
app.include_router(auth_router)
app.include_router(orders_router)


# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 9 — Пример тестирования (запускать отдельно: pytest test_app.py)
# ══════════════════════════════════════════════════════════════════════════════
"""
Сохрани этот блок в test_app.py и запусти: pytest test_app.py -v

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_list_books():
    response = client.get("/books/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_book_not_found():
    response = client.get("/books/99999")
    assert response.status_code == 404
    assert "не найдена" in response.json()["detail"]

def test_create_book():
    book_data = {
        "title": "Тестовая книга",
        "author": "Тестовый автор",
        "price": 500.0,
        "genre": "Тест"
    }
    response = client.post("/books/", json=book_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Тестовая книга"
    assert data["id"] is not None

def test_register_and_login():
    # Регистрация
    reg_response = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepass123"
    })
    assert reg_response.status_code == 201

    # Логин
    login_response = client.post("/auth/login", data={
        "username": "testuser",
        "password": "securepass123"
    })
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

def test_protected_route_without_token():
    response = client.get("/auth/me")
    assert response.status_code == 401
"""

# ══════════════════════════════════════════════════════════════════════════════
# РАЗДЕЛ 10 — Запуск в продакшене
# ══════════════════════════════════════════════════════════════════════════════
# В продакшене НЕ используй --reload.
# Gunicorn + Uvicorn workers = несколько процессов для высокой нагрузки.
#
# Команда для продакшена:
#   gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker
#
# Для Docker (Dockerfile):
#   CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

if __name__ == "__main__":
    import uvicorn
    # Запуск напрямую: python app.py
    uvicorn.run(
        "app:app",
        host="127.0.0.1",
        port=8000,
        reload=True,   # только для разработки!
        log_level="info",
    )
