def generate_insights(score: int):

    if score >= 850:
        return {
            "level": "Elite Developer",
            "description": "Strong real-world signals across projects, platforms, and professional presence.",
            "strengths": [
                "Consistent high-quality project work",
                "Strong GitHub and platform visibility",
                "Well-rounded and credible developer profile",
                "Clear problem-solving and execution ability",
            ],
            "tips": [
                "Mentor juniors through open communities or college clubs",
                "Write technical blogs explaining design decisions and trade-offs",
                "Contribute to large or well-known open-source projects",
                "Lead a project or feature end-to-end and document the impact",
                "Add performance, scale, or user metrics to your projects",
                "Speak at meetups, hackathons, or technical events when possible",
            ],
        }

    if score >= 700:
        return {
            "level": "Advanced Developer",
            "description": "Solid experience with growing credibility and visibility.",
            "strengths": [
                "Multiple practical and deployed projects",
                "Active development and learning habits",
                "Good understanding of core technologies",
                "Improving professional presence",
            ],
            "tips": [
                "Deploy all major projects with proper error handling",
                "Improve GitHub READMEs with screenshots, demos, and setup steps",
                "Refactor older projects to improve code quality and structure",
                "Show project impact clearly on LinkedIn and your portfolio",
                "Start contributing small fixes to open-source repositories",
                "Prepare one project as a strong interview case study",
            ],
        }

    if score >= 500:
        return {
            "level": "Growing Professional",
            "description": "Good foundation with clear progress and improvement opportunities.",
            "strengths": [
                "Hands-on project experience",
                "Basic platform presence established",
                "Willingness to explore different technologies",
            ],
            "tips": [
                "Build complete end-to-end projects with authentication and CRUD",
                "Maintain a consistent GitHub contribution rhythm",
                "Focus on clean folder structure and readable code",
                "Add short project explanations and demo videos",
                "Strengthen one core stack instead of trying many tools",
                "Participate in hackathons or coding challenges regularly",
            ],
        }

    return {
        "level": "Early Stage Developer",
        "description": "You are building momentum. Focus on consistency and fundamentals.",
        "strengths": [
            "Willingness to learn and experiment",
            "Early exposure to development tools",
        ],
        "tips": [
            "Build 2 to 3 small but complete projects from scratch",
            "Practice fundamentals like JavaScript, Python, or DSA regularly",
            "Push code frequently to GitHub, even for learning projects",
            "Follow one structured learning roadmap instead of random tutorials",
            "Create a clean LinkedIn and GitHub profile with basic details",
            "Document what you learn in simple README files",
        ],
    }