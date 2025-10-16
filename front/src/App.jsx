import './tailwind.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { lazy, useEffect } from 'react'

import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import PrivateLayout from "./components/PrivateLayout";
import { autoLogin } from './services/authService'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Transfers = lazy(() => import('./pages/Transactions'))
const Profile = lazy(() => import('./pages/Profile'))
const Accounts = lazy(() => import('./pages/Accounts'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Cards = lazy(() => import('./pages/Cards'))
const Loans = lazy(() => import('./pages/Loans'))

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    autoLogin(dispatch)
  }, [dispatch])

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
        <Route element={<ProtectedRoute><PrivateLayout></PrivateLayout></ProtectedRoute>}>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
          <Route path='/profile' element={<Profile></Profile>}></Route>
          <Route path='/accounts' element={<Accounts></Accounts>}></Route>
          <Route path='/transfers' element={<Transfers></Transfers>}></Route>
          <Route path='/cards' element={<Cards></Cards>}></Route>
          <Route path='/loans' element={<Loans></Loans>}></Route> {/* 🆕 Добавляем маршрут для Loans */}
        </Route>

        {/* Если путь не найден(404) */}
        <Route path='*' element={
          <Navigate to='/profile' replace></Navigate>
        }>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App