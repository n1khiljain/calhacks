#!/usr/bin/env python3
"""
Example: How to use the test engine to test a GPT wrapper
"""

from test_engine import TestEngine

def example_basic_test():
    """Example 1: Basic test workflow"""
    print("Example 1: Basic Test Workflow")
    print("=" * 60)
    
    # Initialize engine
    engine = TestEngine()
    
    # List available submissions
    print("\n1. Listing all submissions...")
    submissions = engine.list_submissions()
    
    if not submissions:
        print("   No submissions found. Create one first at http://localhost:3000")
        return
    
    print(f"   Found {len(submissions)} submission(s)")
    for sub in submissions[:3]:  # Show first 3
        print(f"   - {sub['id'][:8]}... : {sub['target_name'] or 'Unnamed'}")
    
    # Get first submission
    submission_id = submissions[0]['id']
    print(f"\n2. Testing submission: {submission_id[:8]}...")
    
    # For demo purposes - replace with actual URL
    target_url = "https://api.example.com/chat"
    
    print(f"   ⚠️  Note: Replace '{target_url}' with actual target URL")
    print(f"   Skipping actual test in demo mode")
    
    # Uncomment to run real test:
    # session_id = engine.test_with_url(
    #     submission_id=submission_id,
    #     target_url=target_url,
    #     test_config='quick_test'
    # )
    # 
    # print(f"\n3. Viewing results...")
    # results = engine.get_session_results(session_id)
    # print(f"   Tests: {results['session']['total_tests']}")
    # print(f"   Vulnerable: {results['session']['vulnerable_count']}")


def example_custom_test():
    """Example 2: Testing with custom configuration"""
    print("\n\nExample 2: Custom Test Configuration")
    print("=" * 60)
    
    engine = TestEngine()
    
    # Test with specific config
    submission_id = "your-submission-id"
    target_url = "https://your-api.com/endpoint"
    
    print("\n1. Running stealth test (subtle attacks)...")
    print(f"   Submission: {submission_id[:8]}...")
    print(f"   Config: stealth_test")
    print(f"   ⚠️  Demo mode - not executing actual test")
    
    # Uncomment to run:
    # session_id = engine.test_with_url(
    #     submission_id=submission_id,
    #     target_url=target_url,
    #     test_config='stealth_test',
    #     delay_between_tests=2.0  # 2 seconds between tests
    # )


def example_with_auth():
    """Example 3: Testing API that requires authentication"""
    print("\n\nExample 3: Testing with Authentication")
    print("=" * 60)
    
    engine = TestEngine()
    
    submission_id = "your-submission-id"
    target_url = "https://protected-api.com/chat"
    auth_header = "Bearer sk-your-api-key-here"
    
    print("\n1. Testing authenticated endpoint...")
    print(f"   Submission: {submission_id[:8]}...")
    print(f"   Auth: {auth_header[:20]}...")
    print(f"   ⚠️  Demo mode - not executing actual test")
    
    # Uncomment to run:
    # session_id = engine.test_with_url(
    #     submission_id=submission_id,
    #     target_url=target_url,
    #     test_config='comprehensive_test',
    #     auth_header=auth_header
    # )
    # 
    # # Export results
    # engine.export_results(session_id, f'results_{submission_id[:8]}.json')


def example_analyze_results():
    """Example 4: Analyzing test results"""
    print("\n\nExample 4: Analyzing Results")
    print("=" * 60)
    
    engine = TestEngine()
    
    # Assuming you have a session_id from a previous test
    session_id = "your-session-id"
    
    print(f"\n1. Getting results for session: {session_id[:8]}...")
    print(f"   ⚠️  Demo mode - replace with actual session_id")
    
    # Uncomment to run:
    # results = engine.get_session_results(session_id)
    # 
    # if results:
    #     session = results['session']
    #     test_results = results['results']
    #     
    #     print(f"\n📊 Session Summary:")
    #     print(f"   Status: {session['status']}")
    #     print(f"   Total Tests: {session['total_tests']}")
    #     print(f"   Passed: {session['passed']}")
    #     print(f"   Failed: {session['failed']}")
    #     print(f"   Vulnerabilities: {session['vulnerable_count']}")
    #     
    #     print(f"\n🔍 Vulnerable Tests:")
    #     for result in test_results:
    #         if result['is_vulnerable']:
    #             print(f"   ❌ {result['injection_id']}")
    #             print(f"      Severity: {result['severity']}")
    #             print(f"      Prompt: {result['prompt'][:60]}...")
    #             print(f"      Response: {result['response'][:60]}...")
    #             print()


def example_batch_testing():
    """Example 5: Test multiple submissions"""
    print("\n\nExample 5: Batch Testing Multiple Submissions")
    print("=" * 60)
    
    engine = TestEngine()
    
    print("\n1. Getting all submissions...")
    submissions = engine.list_submissions()
    
    if not submissions:
        print("   No submissions found.")
        return
    
    print(f"   Found {len(submissions)} submission(s)")
    print(f"   ⚠️  Demo mode - would test all submissions")
    
    # Uncomment to run batch test:
    # results_summary = []
    # 
    # for submission in submissions:
    #     print(f"\n   Testing: {submission['target_name'] or 'Unnamed'}")
    #     
    #     # You'd need to get the actual URL somehow
    #     # (maybe prompt user, or store securely)
    #     target_url = input(f"   Enter URL for {submission['id'][:8]}: ")
    #     
    #     session_id = engine.test_with_url(
    #         submission_id=submission['id'],
    #         target_url=target_url,
    #         test_config='quick_test'
    #     )
    #     
    #     results = engine.get_session_results(session_id)
    #     results_summary.append({
    #         'submission': submission['target_name'],
    #         'vulnerable_count': results['session']['vulnerable_count'],
    #         'session_id': session_id
    #     })
    # 
    # print("\n📊 Batch Test Summary:")
    # for summary in results_summary:
    #     print(f"   {summary['submission']}: {summary['vulnerable_count']} vulnerabilities")


def main():
    """Run all examples"""
    print("\n" + "=" * 60)
    print("GPT Wrapper Testing Engine - Examples")
    print("=" * 60)
    
    print("\n📚 This file contains example code for using the test engine.")
    print("   Uncomment the code sections to run actual tests.")
    print()
    
    # Run examples in demo mode
    example_basic_test()
    example_custom_test()
    example_with_auth()
    example_analyze_results()
    example_batch_testing()
    
    print("\n" + "=" * 60)
    print("✅ Examples complete!")
    print("\nTo run real tests:")
    print("1. Create a submission at http://localhost:3000")
    print("2. Get the submission ID: python3 test_engine.py list")
    print("3. Run a test: python3 test_engine.py test <id> <url>")
    print("=" * 60 + "\n")


if __name__ == '__main__':
    main()

