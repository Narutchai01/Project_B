import './App.css'
import { Routes,Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Register from './pages/Register'
function App() {

  return (
    <>
    <h1>Fluek</h1>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
