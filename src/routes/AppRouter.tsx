import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, NotFoundPage, UserPage } from '../pages/public';
import { PerfilPage, TaskPage } from '../pages/private';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { PublicRoute } from './PublicRouter';

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserPage />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/tasks" element={<TaskPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
};