import requests
import sys
import json
from datetime import datetime, timezone, timedelta
import uuid

class TutorIAAPITester:
    def __init__(self, base_url="https://tutoria-demo.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_token = None
        self.user_id = None
        self.test_child_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                self.log(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def create_test_user_session(self):
        """Use existing test user and session"""
        self.log("🔧 Using existing test user and session...")
        
        # Use existing test credentials from review request
        self.session_token = "test_session_1767119972159"
        self.test_child_id = "child_5f51fb1c51ca"
        
        self.log(f"✅ Using existing session token: {self.session_token}")
        self.log(f"✅ Using existing child ID: {self.test_child_id}")
        return True

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        self.log("\n📋 Testing Basic Endpoints...")
        
        # Test root API endpoint
        self.run_test("Root API", "GET", "", 200)
        
        # Test skills endpoint (public)
        self.run_test("Skills endpoint", "GET", "skills", 200)
        
        # Test children endpoint without auth (should return 401)
        self.run_test("Children without auth", "GET", "children", 401)

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        self.log("\n🔐 Testing Auth Endpoints...")
        
        # Test /auth/me with valid session
        success, user_data = self.run_test("Auth me", "GET", "auth/me", 200)
        if success and user_data:
            self.log(f"   User: {user_data.get('name', 'Unknown')}")
        
        return success

    def test_children_crud(self):
        """Test children CRUD operations"""
        self.log("\n👶 Testing Children CRUD...")
        
        # Get children (should be empty initially)
        success, children = self.run_test("Get children", "GET", "children", 200)
        if success:
            self.log(f"   Found {len(children)} children")
        
        # Create a child
        child_data = {
            "name": "Test Child",
            "age": 8,
            "grade": 3
        }
        success, child = self.run_test("Create child", "POST", "children", 200, child_data)
        if success and child:
            self.test_child_id = child.get('child_id')
            self.log(f"   Created child: {self.test_child_id}")
        
        # Get specific child
        if self.test_child_id:
            self.run_test("Get specific child", "GET", f"children/{self.test_child_id}", 200)
        
        return success

    def test_exercises_and_attempts(self):
        """Test exercise generation and attempts"""
        if not self.test_child_id:
            self.log("⚠️  Skipping exercises test - no test child")
            return False
            
        self.log("\n📝 Testing Exercises & Attempts...")
        
        # Generate exercise
        success, exercise = self.run_test(
            "Generate exercise", 
            "POST", 
            f"exercises/generate?child_id={self.test_child_id}&subject=matematicas", 
            200
        )
        
        if success and exercise:
            exercise_id = exercise.get('exercise_id')
            self.log(f"   Generated exercise: {exercise_id}")
            self.log(f"   Question: {exercise.get('question', 'N/A')[:50]}...")
            
            # Record attempt
            attempt_data = {
                "exercise_id": exercise_id,
                "answer_given": "test answer",
                "hints_used": 0
            }
            self.run_test("Record attempt", "POST", "attempts", 200, attempt_data)
        
        return success

    def test_chat_endpoints(self):
        """Test chat functionality"""
        if not self.test_child_id:
            self.log("⚠️  Skipping chat test - no test child")
            return False
            
        self.log("\n💬 Testing Chat Endpoints...")
        
        # Send chat message
        chat_data = {
            "message": "Hola, ¿puedes ayudarme con matemáticas?",
            "context": "homework"
        }
        success, response = self.run_test(
            "Send chat message", 
            "POST", 
            f"chat/{self.test_child_id}", 
            200, 
            chat_data
        )
        
        if success:
            self.log(f"   AI Response: {response.get('message', 'N/A')[:50]}...")
        
        # Get chat history
        self.run_test("Get chat history", "GET", f"chat/{self.test_child_id}/history", 200)
        
        return success

    def test_progress_and_reports(self):
        """Test progress and reporting endpoints"""
        if not self.test_child_id:
            self.log("⚠️  Skipping progress test - no test child")
            return False
            
        self.log("\n📊 Testing Progress & Reports...")
        
        # Get progress
        self.run_test("Get progress", "GET", f"progress/{self.test_child_id}", 200)
        
        # Get weekly report
        self.run_test("Get weekly report", "GET", f"report/{self.test_child_id}/weekly", 200)
        
        return True

    def test_checkin_endpoints(self):
        """Test daily check-in functionality"""
        if not self.test_child_id:
            self.log("⚠️  Skipping checkin test - no test child")
            return False
            
        self.log("\n✅ Testing Check-in Endpoints...")
        
        # Create check-in
        checkin_data = {
            "mood": "happy",
            "energy": 4,
            "note": "Feeling good today!"
        }
        self.run_test("Create checkin", "POST", f"checkin/{self.test_child_id}", 200, checkin_data)
        
        # Get today's check-in
        self.run_test("Get today checkin", "GET", f"checkin/{self.test_child_id}/today", 200)
        
        return True

    def cleanup(self):
        """Skip cleanup for existing test data"""
        self.log("\n🧹 Skipping cleanup for existing test data...")
        self.log("✅ Test completed")

    def run_all_tests(self):
        """Run all tests"""
        self.log("🚀 Starting TutorIA API Tests...")
        self.log(f"   Base URL: {self.base_url}")
        
        # Create test user and session
        if not self.create_test_user_session():
            self.log("❌ Failed to create test user - stopping tests")
            return 1
        
        # Run test suites
        self.test_basic_endpoints()
        
        if self.test_auth_endpoints():
            self.test_children_crud()
            self.test_exercises_and_attempts()
            self.test_chat_endpoints()
            self.test_progress_and_reports()
            self.test_checkin_endpoints()
        
        # Cleanup
        self.cleanup()
        
        # Print results
        self.log(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            self.log("\n❌ Failed Tests:")
            for test in self.failed_tests:
                self.log(f"   - {test.get('test', 'Unknown')}: {test.get('error', test.get('actual', 'Unknown error'))}")
        
        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = TutorIAAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())