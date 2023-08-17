import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Jot from './pages/Jot';
import NavBar from './components/navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Entry from './pages/Entry';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className='p-4'>
        <Toaster />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jot" element={<Jot />} />
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/jots/:id' element={<Entry />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
