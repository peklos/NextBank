import './tailwind.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transfers = lazy(() => import('./pages/Transfers'))

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Публичные страницы */}
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }></Route>

        <Route path='/register' element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }>
        </Route>

        {/* Приватные страницы */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
        </Route>

        <Route path='/transfers' element={
          <ProtectedRoute>
            <Transfers />
          </ProtectedRoute>
        }></Route>

        {/* Если путь не найден(404) */}
        <Route path='*' element={
          <Navigate to='/login' replace></Navigate>
        }>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
