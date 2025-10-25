import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SubmissionForm.css'

const API_BASE_URL = 'http://localhost:5001/api'

function SubmissionForm() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    target_name: '',
    target_url: '',
    mission: '',
    known_sensitive: [],
    example_prompt: '',
    auth_header: '',
    consent: false
  })
  
  const [currentSensitiveItem, setCurrentSensitiveItem] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validateUrl = (url) => {
    if (!url) return 'Target URL is required'
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'URL must use http or https protocol'
      }
      return null
    } catch {
      return 'Please enter a valid URL'
    }
  }

  const validateMission = (mission) => {
    if (!mission.trim()) return 'Mission/Purpose is required'
    if (mission.length > 2000) return 'Mission must be 2000 characters or less'
    return null
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: null }))
  }

  const addSensitiveItem = () => {
    const trimmed = currentSensitiveItem.trim()
    if (trimmed && trimmed.length <= 300) {
      setFormData(prev => ({
        ...prev,
        known_sensitive: [...prev.known_sensitive, trimmed]
      }))
      setCurrentSensitiveItem('')
    }
  }

  const removeSensitiveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      known_sensitive: prev.known_sensitive.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    const newErrors = {}
    
    const urlError = validateUrl(formData.target_url)
    if (urlError) newErrors.target_url = urlError
    
    const missionError = validateMission(formData.mission)
    if (missionError) newErrors.mission = missionError
    
    if (!formData.consent) {
      newErrors.consent = 'You must confirm consent to proceed'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Submit to backend
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }
      
      // Navigate to confirmation page with data
      navigate('/confirmation', { state: { 
        submission_id: data.submission_id,
        summary: data.summary
      }})
      
    } catch (error) {
      setSubmitError(error.message || 'An error occurred while submitting')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Submit GPT Wrapper Mission</h1>
        <p>Safely collect information about GPT wrapper targets for testing</p>
      </header>
      
      <main className="main-content">
        <div className="warning-banner">
          <strong>⚠️ Important Legal Notice</strong>
          <p>Only submit targets you own or have explicit written permission to test. Unauthorized testing may violate laws including the Computer Fraud and Abuse Act (CFAA) and similar regulations worldwide.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="submission-form">
          <div className="form-group">
            <label htmlFor="target_name">
              Target Name <span className="optional">(optional)</span>
            </label>
            <input
              type="text"
              id="target_name"
              name="target_name"
              value={formData.target_name}
              onChange={handleInputChange}
              placeholder="e.g., MathTutor v1"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="target_url">
              Target URL <span className="required">*</span>
            </label>
            <input
              type="text"
              id="target_url"
              name="target_url"
              value={formData.target_url}
              onChange={handleInputChange}
              placeholder="https://example.com/api/chat"
              className={errors.target_url ? 'error' : ''}
            />
            {errors.target_url && (
              <span className="error-message">{errors.target_url}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="mission">
              Mission / Purpose <span className="required">*</span>
            </label>
            <textarea
              id="mission"
              name="mission"
              value={formData.mission}
              onChange={handleInputChange}
              placeholder="Describe the target's intended behavior, constraints, and purpose..."
              rows="5"
              className={errors.mission ? 'error' : ''}
            />
            <div className="char-count">
              {formData.mission.length} / 2000 characters
            </div>
            {errors.mission && (
              <span className="error-message">{errors.mission}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="known_sensitive">
              Known Sensitive Info / Behaviors
            </label>
            <p className="help-text">
              Add specific strings, behaviors, or information the system should protect
            </p>
            <div className="sensitive-input-group">
              <input
                type="text"
                id="known_sensitive"
                value={currentSensitiveItem}
                onChange={(e) => setCurrentSensitiveItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSensitiveItem()
                  }
                }}
                placeholder="e.g., 'final numeric answer'"
                maxLength={300}
              />
              <button
                type="button"
                onClick={addSensitiveItem}
                className="btn-secondary"
                disabled={!currentSensitiveItem.trim() || currentSensitiveItem.length > 300}
              >
                + Add
              </button>
            </div>
            
            {formData.known_sensitive.length > 0 && (
              <ul className="sensitive-items-list">
                {formData.known_sensitive.map((item, index) => (
                  <li key={index}>
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeSensitiveItem(index)}
                      className="btn-remove"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="example_prompt">
              Example Canonical Prompt <span className="optional">(optional)</span>
            </label>
            <textarea
              id="example_prompt"
              name="example_prompt"
              value={formData.example_prompt}
              onChange={handleInputChange}
              placeholder="e.g., What is 5 + 3?"
              rows="3"
            />
          </div>
          
          <div className="form-group auth-group">
            <label htmlFor="auth_header">
              Authorization Header <span className="optional">(optional)</span>
            </label>
            <p className="help-text transient-warning">
              ⚠️ <strong>Never stored.</strong> Transient only, for temporary use.
            </p>
            <input
              type="password"
              id="auth_header"
              name="auth_header"
              value={formData.auth_header}
              onChange={handleInputChange}
              placeholder="Bearer sk-..."
              autoComplete="off"
            />
          </div>
          
          <div className="form-group consent-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                className={errors.consent ? 'error' : ''}
              />
              <span>
                I confirm I own or have explicit written permission to test this target <span className="required">*</span>
              </span>
            </label>
            {errors.consent && (
              <span className="error-message">{errors.consent}</span>
            )}
          </div>
          
          {submitError && (
            <div className="error-banner">
              <strong>Error:</strong> {submitError}
            </div>
          )}
          
          <button
            type="submit"
            className="btn-primary btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Mission'}
          </button>
        </form>
      </main>
      
      <footer className="footer">
        <div className="footer-content">
          <h3>Privacy & Legal Notice</h3>
          <p>All submissions are logged with timestamps and IP addresses for security purposes.</p>
          <p>Target URLs and authorization headers are redacted/hashed and never stored in plaintext.</p>
          <p>Submissions may be purged after 30 days.</p>
          <div className="footer-warning">
            <strong>Use Responsibly:</strong> Unauthorized security testing is illegal and may result in criminal prosecution. Always obtain proper authorization before testing any system you do not own.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SubmissionForm

