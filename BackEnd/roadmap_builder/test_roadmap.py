import os
import sys

# Add backend directory to path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from roadmap_builder.schemas import RoadmapRequest
from roadmap_builder.service import generate_roadmap_ai

def run_test():
    print("==================================================")
    print("Testing Nested Month/Week Roadmap Builder Service")
    print("==================================================")
    
    # 1. Check API Key
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("[FAIL] OPENROUTER_API_KEY environment variable is not set!")
        sys.exit(1)
    else:
        masked_key = api_key[:8] + "..." + api_key[-4:] if len(api_key) > 12 else "***"
        print(f"[OK] Found API Key: {masked_key}")

    # 2. Define mock request (exactly matching the user request)
    mock_request = RoadmapRequest(
        current_skills=["HTML", "CSS", "JS", "Python", "Machine Learning", "Artificial Intelligence"],
        target_role="Generative AI Developer",
        time_limit="2 months"
    )
    
    print(f"Generating roadmap for:")
    print(f"  Current Skills: {mock_request.current_skills}")
    print(f"  Target Role:    {mock_request.target_role}")
    print(f"  Time Limit:     {mock_request.time_limit}")
    print("Please wait, querying OpenRouter...")

    try:
        # 3. Call generate_roadmap_ai
        roadmap = generate_roadmap_ai(mock_request)
        
        print("\n[SUCCESS] Roadmap generated successfully!\n")
        
        # 4. Verify fields
        assert roadmap["target_role"] == mock_request.target_role, "Target role mismatch"
        assert roadmap["time_limit"] == mock_request.time_limit, "Time limit mismatch"
        assert len(roadmap["roadmap_months"]) > 0, "Roadmap months should not be empty"
        
        # Print general output info
        print(f"Target Role: {roadmap['target_role']}")
        print(f"Time Limit: {roadmap['time_limit']}")
        print(f"Recommended Weekly Hours: {roadmap['weekly_hours_recommended']}")
        print(f"Recognized Skills: {', '.join(roadmap['current_skills_recognized'])}")
        print(f"Skill Gaps: {', '.join(roadmap['skill_gaps'])}")
        print("\nRoadmap Months:")
        for idx, m_plan in enumerate(roadmap["roadmap_months"]):
            print(f"\nMonth {m_plan['month_number']}: {m_plan['month_title']}")
            for w_plan in m_plan['weeks']:
                print(f"  Week {w_plan['week_number']}: {w_plan['week_title']}")
                print(f"    Topics:")
                for topic in w_plan['topics']:
                    print(f"      - {topic}")
                print(f"    Learn:")
                for tool in w_plan['learn']:
                    print(f"      - {tool}")
                print(f"    Project: {w_plan['project']}")
                print()

        print("General Tips:")
        for tip in roadmap["general_tips"]:
            print(f"  - {tip}")
            
        print("\n==================================================")
        print("Test Passed: Schema structure matches expectations!")
        print("==================================================")

    except AssertionError as ae:
        print(f"\n[FAIL] Assertion failed: {ae}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] Test encountered an exception: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    run_test()
