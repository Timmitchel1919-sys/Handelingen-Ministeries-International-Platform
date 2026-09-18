import { Route, Routes } from 'react-router-dom';
import { MyServingPage } from './MyServingPage';

export function MyServingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MyServingPage />} />
    </Routes>
  );
}

