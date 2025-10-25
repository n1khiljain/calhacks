# Quick Start Guide

Get the application running in under 5 minutes!

## 🚀 Quick Setup

### Option 1: Using Helper Scripts (Recommended)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd /Users/ajay/Desktop/CSProjects/hackathon
chmod +x start-backend.sh
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
cd /Users/ajay/Desktop/CSProjects/hackathon
chmod +x start-frontend.sh
./start-frontend.sh
```

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd /Users/ajay/Desktop/CSProjects/hackathon
pip install -r requirements.txt
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd /Users/ajay/Desktop/CSProjects/hackathon/frontend
npm install
npm run dev
```

## 🌐 Access the Application

Once both servers are running:

- **Main Form**: http://localhost:3000
- **View Submissions**: http://localhost:3000/submissions
- **API Health Check**: http://localhost:5000/api/health

## ✅ Quick Test

1. Open http://localhost:3000
2. Fill out the form:
   - Target URL: `https://example.com/api`
   - Mission: `Test submission for demo`
   - Check the consent box
3. Click "Submit Mission"
4. You should see a confirmation page with a submission ID
5. Click "View All Submissions (Admin)" to see your submission

## 📝 Notes

- Backend runs on port **5000**
- Frontend runs on port **3000**
- Admin token for dev: `dev-token-12345`
- Database is auto-created on first run at `backend/submissions.db`

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Dependencies not installing?**
```bash
# Update pip
pip install --upgrade pip

# Update npm
npm install -g npm@latest
```

**Backend won't start?**
```bash
# Check Python version (need 3.8+)
python3 --version

# Try with python instead of python3
python app.py
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [TESTING.md](TESTING.md) for testing instructions
- Review the API endpoints section for integration details

---

**Happy submitting! Remember to only test systems you own or have permission to test. 🔒**

