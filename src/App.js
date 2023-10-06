import React from 'react'
import './App.css'
import { SgbTable } from './sgbTable'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { FlrTable } from './FlrTable';


function App() {
  return (
    <div className='App'>
      <Router>

        <Routes>
          <Route exact path="/" element={<SgbTable />} />
        </Routes>

        <Routes>
          <Route path="/flare" element={<FlrTable />} />

        </Routes>

      </Router>

    </div>
  )
}

export default App