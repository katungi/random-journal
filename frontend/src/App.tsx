import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Jot from './pages/Jot';
import NavBar from './components/navbar';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className='p-4'>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jot" element={<Jot />} />
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/jot/:id' element={<Jot />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
