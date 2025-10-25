import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SubmissionForm from './components/SubmissionForm'
import ConfirmationPage from './components/ConfirmationPage'
import ViewSubmissions from './components/ViewSubmissions'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SubmissionForm />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/submissions" element={<ViewSubmissions />} />
      </Routes>
    </Router>
  )
}

export default App

