# Film

Каталог фільмів на React: інформаційна головна сторінка, каталог з пошуком і фільтром за жанрами, форма додавання фільму, світла й темна теми.

## Можливості

- **Головна** — блок «Хто ми» з командою та статистикою, карусель «Top 10» за рейтингом, плитки жанрів, форма підписки на розсилку (поки без бекенду, лише валідація).
- **Каталог** (`/movies`) — сітка карток, пошук за назвою з хедера, фільтр за жанром.
- **Додавання фільму** (`/movies/new`) — форма на react-hook-form з валідацією та підказками жанрів.
- **Тема** — перемикач у хедері; вибір зберігається в `localStorage`, за замовчуванням береться системна тема, без «спалаху» при завантаженні.
- **Адаптивність** — мобільне меню, окремий мобільний пошук, горизонтальна прокрутка чипів і каруселі на малих екранах.
- **404 і сторінка помилки** для невідомих маршрутів і помилок рендеру.

## Стек

| Напрям  | Інструменти                                                  |
| ------- | ------------------------------------------------------------ |
| UI      | React 19, TypeScript 6                                       |
| Збірка  | Vite 8, `@vitejs/plugin-react`                               |
| Стилі   | Tailwind CSS 4 (CSS-first), `clsx` + `tailwind-merge`, Inter |
| Роутинг | React Router 7 (`createBrowserRouter`, вкладені маршрути)    |
| Стан    | Zustand 5 (`devtools`, `persist`)                            |
| Форми   | React Hook Form                                              |
| Іконки  | lucide-react                                                 |
| Якість  | ESLint 10 (flat config, typescript-eslint), Prettier 3       |

## Швидкий старт

Потрібен **Node.js `^20.19` або `>=22.12`**.

```bash
npm install
npm run dev
```

Застосунок відкриється на http://localhost:5173.

## Скрипти

| Команда                | Що робить                                    |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Dev-сервер з HMR                             |
| `npm run build`        | Перевірка типів і production-збірка в `dist` |
| `npm run preview`      | Локальний перегляд production-збірки         |
| `npm run typecheck`    | Лише перевірка типів                         |
| `npm run lint`         | ESLint                                       |
| `npm run lint:fix`     | ESLint з автовиправленням                    |
| `npm run format`       | Форматування Prettier                        |
| `npm run format:check` | Перевірка форматування                       |

## Структура

```
src/
├─ app/                 роутер і константи маршрутів
├─ layouts/root/        RootLayout з <Outlet />, Header, Footer, пошук, перемикач теми
├─ pages/
│  ├─ home/             головна: About, карусель Top 10, жанри, розсилка
│  ├─ movies/           каталог: сторінка, фільтр жанрів, картка фільму
│  ├─ add-movie/        сторінка і форма додавання
│  ├─ not-found/        404
│  └─ error/            сторінка помилки роутера
├─ store/               zustand-стори: фільми та тема
├─ data/                початкові дані
├─ types/               спільні типи
├─ lib/                 утиліти (cn)
└─ styles/index.css     Tailwind: тема, токени, базові стилі
```

Правило: компонент живе поруч зі сторінкою або layout, де використовується. Імпорти між модулями — через аліас `@/` (`@/store/movies.store`).

## Маршрути

| Шлях          | Сторінка         |
| ------------- | ---------------- |
| `/`           | Головна          |
| `/movies`     | Каталог          |
| `/movies/new` | Додавання фільму |
| `*`           | 404              |

Нова сторінка: створити папку в `src/pages/`, додати шлях у `src/app/routes.ts` і дочірній маршрут у `src/app/router.tsx` — вона автоматично відрендериться всередині `RootLayout` через `<Outlet />`. Щоб посилання з'явилося в хедері й футері, додайте його в `src/layouts/root/navigation.ts`.

## Стилі та тема

Tailwind 4 налаштовано без `tailwind.config.js` — усе в `src/styles/index.css`:

- `--color-brand-*` — фірмова палітра (індиго): `bg-brand-600`, `text-brand-400`…
- семантичні токени, які перемикаються темою:

  | Утиліта             | Призначення         |
  | ------------------- | ------------------- |
  | `bg-surface`        | фон сторінки        |
  | `bg-surface-muted`  | фон секцій          |
  | `bg-surface-raised` | картки, поля вводу  |
  | `border-line`       | рамки й роздільники |
  | `text-fg`           | основний текст      |
  | `text-fg-muted`     | другорядний текст   |
  | `bg-chrome`         | хедер і футер       |

- темна тема вмикається класом `.dark` на `<html>`, варіант `dark:` доступний для точкових правок;
- заокруглення стримане: `rounded-xs` / `rounded-sm` / `rounded-md`;
- утиліти `container`, `no-scrollbar`, анімація `animate-fade-in`.

Для VS Code рекомендовані розширення перелічені в `.vscode/extensions.json` (Tailwind CSS IntelliSense, ESLint, Prettier, EditorConfig).

## Стан

- `useMoviesStore` — список фільмів, пошук, вибраний жанр та дії (`addMovie`, `setSearchTerm`, `setGenre`, `toggleGenre`, `browseGenre`, `resetFilters`). Похідні дані — через хуки `useFilteredMovies`, `useGenres`, `useGenreStats`, `useTopMovies`. У dev-режимі стор видно в Redux DevTools.
- `useThemeStore` — поточна тема й `toggleTheme`, зберігається в `localStorage` під ключем `film-theme`.

Дані поки живуть у пам'яті: доданий фільм зникне після перезавантаження сторінки.
