# Spendly — Project Guidelines

## 1. Project Overview

Spendly is a React-based personal finance web application.
It helps users track expenses, manage budgets, and visualize spending patterns.
Built with React 18, TypeScript, Tailwind CSS, Recharts, and Framer Motion.

---

## 2. Folder Structure Rules

- All pages go inside `src/pages/`
- Reusable components go inside `src/components/`
- UI primitives (buttons, inputs, cards) go inside `src/components/ui/`
- Global state and data models go inside `src/context/AppContext.tsx`
- Route configuration stays in `src/routes.ts`
- Global styles go inside `src/styles/`

---

## 3. Coding Standards

### General
- Use **TypeScript** for all files — no plain `.js` files
- Always define types/interfaces for data (no `any` type)
- Use **functional components** only — no class components
- Keep each component focused on one job (Single Responsibility)

### Naming
- Components: `PascalCase` → `ExpenseForm.tsx`
- Functions/variables: `camelCase` → `handleSubmit`, `totalAmount`
- Constants: `UPPER_SNAKE_CASE` → `CATEGORY_COLORS`
- CSS classes: Tailwind utility classes only

### State Management
- Use `AppContext` for global state (expenses, income, budgets, user)
- Use `useState` for local UI state (form fields, toggle, modal open/close)
- Use `useMemo` for derived/computed values (totals, filtered lists)

---

## 4. Component Guidelines

- Every component must have **typed props**
- Avoid inline styles — use Tailwind classes
- Use Lucide React for all icons
- Animations via Framer Motion only (no CSS keyframes)
- Charts via Recharts only — always wrap in `ResponsiveContainer`

---

## 5. Data Guidelines

- All expense categories must use the `EXPENSE_CATEGORIES` constant
- All currency formatting must use the `formatCurrency()` helper from AppContext
- Dates must be stored as ISO strings (`YYYY-MM-DD`)
- IDs must be UUID strings (use `crypto.randomUUID()`)
- Data is persisted via `localStorage` — never use `sessionStorage`

---

## 6. Git & Version Control

- Commit messages should be clear: `feat: add expense delete confirmation`
- Branch naming: `feature/budget-alerts`, `fix/chart-resize`
- Never commit `node_modules/` or `.env` files
- Always test before committing

---

## 7. Responsive Design Rules

- Mobile first approach using Tailwind breakpoints
- `sm:` → 640px and above
- `md:` → 768px and above
- `lg:` → 1024px and above
- `xl:` → 1280px and above
- Test every new page/component at 375px, 768px, and 1440px

---

## 8. Performance Guidelines

- Use `useMemo` for expensive calculations (monthly totals, filtered data)
- Use `useCallback` for functions passed as props to child components
- Lazy load pages using `React.lazy()` for better initial load time
- Keep component re-renders minimal — avoid unnecessary state updates

---

## 9. Theme Guidelines

- Dark/Light mode is controlled by `isDark` in `AppContext`
- Never hardcode colors — always compute based on `isDark`
- Dark background: `#080814` (page), `#161628` (card)
- Light background: `#F8F9FF` (page), `#FFFFFF` (card)
- Primary accent color: `#6366F1` (violet/indigo)
