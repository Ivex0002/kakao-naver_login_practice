import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Callback } from './util/Callback.jsx'
import { AppWrapper } from './AppWrapper.jsx'

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppWrapper />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  </BrowserRouter>
);
