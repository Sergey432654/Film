import React from 'react'
import ReactDOM from 'react-dom/client'
import Movies from './App'
import './index.css'
import Header from './components/Header'
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header/>
      <Movies />
    </BrowserRouter>
  </React.StrictMode>,
)
