import Pagination from './Component/Paginatoin'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CveDetails from './Component/CveDetails';

function App() {


  return (
    <>
      <Router>
          <Routes>
            <Route exact path="/cves/list" element={<Pagination />} />
            <Route path="/cves/:id" element={< CveDetails/>} />
          </Routes>
      </Router>
    </>
  )
}

export default App
