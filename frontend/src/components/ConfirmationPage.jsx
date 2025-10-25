import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import './ConfirmationPage.css'

function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { submission_id, summary } = location.state || {}
  
  useEffect(() => {
    if (!submission_id) {
      navigate('/')
    }
  }, [submission_id, navigate])
  
  if (!submission_id) {
    return null
  }
  
  return (
    <div className="app-container">
      <header className="header">
        <h1>Submission Successful</h1>
      </header>
      
      <main className="main-content">
        <div className="confirmation-card">
          <div className="success-icon">✅</div>
          <h2>Your submission has been saved!</h2>
          
          <div className="submission-details">
            <div className="detail-row">
              <span className="detail-label">Submission ID:</span>
              <code className="detail-value submission-id">{submission_id}</code>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Target Name:</span>
              <span className="detail-value">{summary?.target_name || 'Unnamed'}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Mission Excerpt:</span>
              <p className="detail-value mission-excerpt">{summary?.mission_excerpt}</p>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Sensitive Items Count:</span>
              <span className="detail-value">{summary?.sensitive_count || 0}</span>
            </div>
          </div>
          
          <div className="info-box">
            <strong>What happens next?</strong>
            <ul>
              <li>Your submission has been securely stored with redacted URLs and hashed credentials</li>
              <li>All sensitive data is protected and never exposed in logs</li>
              <li>Submissions are logged with timestamps for audit purposes</li>
              <li>Data may be automatically purged after 30 days</li>
            </ul>
          </div>
          
          <div className="action-buttons">
            <Link to="/" className="btn-primary">
              Submit Another
            </Link>
            <Link to="/submissions" className="btn-secondary">
              View All Submissions (Admin)
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <p>Thank you for using the GPT Wrapper Submission Collector responsibly.</p>
        </div>
      </footer>
    </div>
  )
}

export default ConfirmationPage

