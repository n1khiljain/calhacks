#!/bin/bash

echo "🧪 Testing Submission Collector API"
echo "===================================="
echo ""

API_URL="http://localhost:5001/api"
ADMIN_TOKEN="dev-token-12345"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "Test 1: Health Check"
echo "---------------------"
response=$(curl -s -w "\n%{http_code}" "$API_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Health check returned 200"
    echo "   Response: $body"
else
    echo -e "${RED}❌ FAIL${NC} - Health check returned $http_code"
    echo "   Is the backend running? (./start-backend.sh)"
    exit 1
fi
echo ""

# Test 2: Create Valid Submission
echo "Test 2: Create Valid Submission"
echo "--------------------------------"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/submissions" \
  -H "Content-Type: application/json" \
  -d '{
    "target_name": "Test Math Tutor",
    "target_url": "https://example.com/api/chat",
    "mission": "Help students learn addition without giving direct answers",
    "known_sensitive": ["final numeric answer", "step-by-step solution"],
    "example_prompt": "What is 5 + 3?",
    "auth_header": "Bearer test-token-123",
    "consent": true
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Submission created (201)"
    submission_id=$(echo "$body" | grep -o '"submission_id":"[^"]*"' | cut -d'"' -f4)
    echo "   Submission ID: $submission_id"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 201, got $http_code"
    echo "   Response: $body"
fi
echo ""

# Test 3: Create Submission Without Consent
echo "Test 3: Reject Submission Without Consent"
echo "------------------------------------------"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/submissions" \
  -H "Content-Type: application/json" \
  -d '{
    "target_url": "https://example.com/api",
    "mission": "Test mission",
    "consent": false
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "400" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Correctly rejected (400)"
    echo "   Error: $(echo "$body" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 400, got $http_code"
fi
echo ""

# Test 4: Create Submission Without URL
echo "Test 4: Reject Submission Without URL"
echo "--------------------------------------"
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/submissions" \
  -H "Content-Type: application/json" \
  -d '{
    "mission": "Test mission",
    "consent": true
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "400" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Correctly rejected (400)"
    echo "   Error: $(echo "$body" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 400, got $http_code"
fi
echo ""

# Test 5: List Submissions (Admin)
echo "Test 5: List Submissions (Admin)"
echo "---------------------------------"
response=$(curl -s -w "\n%{http_code}" "$API_URL/submissions" \
  -H "X-Admin-Token: $ADMIN_TOKEN")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Successfully retrieved submissions (200)"
    count=$(echo "$body" | grep -o '"submission_id"' | wc -l)
    echo "   Found $count submission(s)"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 200, got $http_code"
fi
echo ""

# Test 6: List Submissions Without Token
echo "Test 6: Reject Unauthorized Access"
echo "-----------------------------------"
response=$(curl -s -w "\n%{http_code}" "$API_URL/submissions")

http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Correctly rejected (401)"
else
    echo -e "${RED}❌ FAIL${NC} - Expected 401, got $http_code"
fi
echo ""

# Test 7: Get Specific Submission
if [ ! -z "$submission_id" ]; then
    echo "Test 7: Get Specific Submission"
    echo "--------------------------------"
    response=$(curl -s -w "\n%{http_code}" "$API_URL/submissions/$submission_id" \
      -H "X-Admin-Token: $ADMIN_TOKEN")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC} - Successfully retrieved submission (200)"
        
        # Check for redacted URL
        if echo "$body" | grep -q "redacted"; then
            echo -e "${GREEN}   ✅ URL is redacted${NC}"
        else
            echo -e "${YELLOW}   ⚠️  URL might not be redacted${NC}"
        fi
        
        # Check that auth header is not in response
        if ! echo "$body" | grep -q "Bearer"; then
            echo -e "${GREEN}   ✅ Auth header not exposed${NC}"
        else
            echo -e "${RED}   ❌ Auth header found in response!${NC}"
        fi
    else
        echo -e "${RED}❌ FAIL${NC} - Expected 200, got $http_code"
    fi
    echo ""
fi

# Summary
echo "===================================="
echo "✅ API Testing Complete!"
echo ""
echo "Next steps:"
echo "  1. Open http://localhost:3000 to test the UI"
echo "  2. Try submitting a form manually"
echo "  3. View submissions at http://localhost:3000/submissions"
echo ""
echo "For comprehensive testing, see TESTING.md"

