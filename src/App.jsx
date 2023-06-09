import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import SignupPage from './pages/SignupPage/SignupPage'

import 'react-toastify/dist/ReactToastify.css';
import './App.scss'
import SessionPage from './pages/SessionPage/SessionPage'

function App() {

  return (
    <div className="App">
      <ToastContainer position='top-center' theme='colored' />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/session' element={<SessionPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
