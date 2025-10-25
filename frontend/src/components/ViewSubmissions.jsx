import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ViewSubmissions.css'

const API_BASE_URL = 'http://localhost:5001/api'
const ADMIN_TOKEN = 'dev-token-12345' // In production, use proper auth

function ViewSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [detailedSubmission, setDetailedSubmission] = useState(null)
  
  useEffect(() => {
    fetchSubmissions()
  }, [])
  
  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        headers: {
          'X-Admin-Token': ADMIN_TOKEN
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Admin token required')
        }
        throw new Error('Failed to fetch submissions')
      }
      
      const data = await response.json()
      setSubmissions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchSubmissionDetails = async (id) => {
    if (expandedId === id) {
      setExpandedId(null)
      setDetailedSubmission(null)
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
        headers: {
          'X-Admin-Token': ADMIN_TOKEN
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch submission details')
      }
      
      const data = await response.json()
      setDetailedSubmission(data)
      setExpandedId(id)
    } catch (err) {
      setError(err.message)
    }
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }
  
  if (loading) {
    return (
      <div className="app-container">
        <header className="header">
          <h1>All Submissions</h1>
        </header>
        <main className="main-content">
          <div className="loading">Loading submissions...</div>
        </main>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="app-container">
        <header className="header">
          <h1>All Submissions</h1>
        </header>
        <main className="main-content">
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
          <Link to="/" className="btn-primary">Back to Form</Link>
        </main>
      </div>
    )
  }
  
  return (
    <div className="app-container">
      <header className="header">
        <h1>All Submissions</h1>
        <p>Admin view - All URLs and sensitive data are redacted</p>
      </header>
      
      <main className="main-content">
        <div className="submissions-header">
          <h2>Total Submissions: {submissions.length}</h2>
          <Link to="/" className="btn-secondary">New Submission</Link>
        </div>
        
        {submissions.length === 0 ? (
          <div className="empty-state">
            <p>No submissions yet.</p>
            <Link to="/" className="btn-primary">Create First Submission</Link>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div key={submission.submission_id} className="submission-card">
                <div className="submission-summary" onClick={() => fetchSubmissionDetails(submission.submission_id)}>
                  <div className="submission-header">
                    <h3>{submission.target_name}</h3>
                    <span className="submission-date">{formatDate(submission.created_at)}</span>
                  </div>
                  
                  <div className="submission-meta">
                    <div className="meta-item">
                      <span className="meta-label">ID:</span>
                      <code className="meta-value">{submission.submission_id}</code>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">URL:</span>
                      <code className="meta-value">{submission.target_url_redacted}</code>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Sensitive Items:</span>
                      <span className="meta-value">{submission.sensitive_count}</span>
                    </div>
                  </div>
                  
                  <p className="mission-excerpt">{submission.mission_excerpt}</p>
                  
                  <button className="expand-btn">
                    {expandedId === submission.submission_id ? '▼ Hide Details' : '▶ Show Details'}
                  </button>
                </div>
                
                {expandedId === submission.submission_id && detailedSubmission && (
                  <div className="submission-details-expanded">
                    <div className="detail-section">
                      <h4>Full Mission</h4>
                      <p className="detail-text">{detailedSubmission.mission}</p>
                    </div>
                    
                    {detailedSubmission.example_prompt && (
                      <div className="detail-section">
                        <h4>Example Prompt</h4>
                        <p className="detail-text">{detailedSubmission.example_prompt}</p>
                      </div>
                    )}
                    
                    {detailedSubmission.known_sensitive.length > 0 && (
                      <div className="detail-section">
                        <h4>Known Sensitive Items</h4>
                        <ul className="sensitive-list">
                          {detailedSubmission.known_sensitive.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="detail-section">
                      <h4>Security Info</h4>
                      <div className="security-grid">
                        <div className="security-item">
                          <span className="security-label">URL Hash:</span>
                          <code className="security-value">{detailedSubmission.target_url_hash.substring(0, 16)}...</code>
                        </div>
                        <div className="security-item">
                          <span className="security-label">Has Auth:</span>
                          <span className="security-value">{detailedSubmission.has_auth ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="security-item">
                          <span className="security-label">Consent:</span>
                          <span className="security-value">{detailedSubmission.consent ? '✓ Confirmed' : '✗ Not confirmed'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <p>All data shown is redacted for security. Target URLs and authorization headers are never displayed in plaintext.</p>
        </div>
      </footer>
    </div>
  )
}

export default ViewSubmissions

