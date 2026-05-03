import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  { path: '/auth', Component: Auth },
  {
    Component: Layout,
    children: [
      { path: '/dashboard', Component: Dashboard },
      { path: '/expenses', Component: Expenses },
      { path: '/income', Component: Income },
      { path: '/budget', Component: Budget },
      { path: '/reports', Component: Reports },
      { path: '/profile', Component: Profile },
    ],
  },
]);
