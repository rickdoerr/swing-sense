from google.adk.agents.llm_agent import Agent
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import prompt

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='You are a golf swing analyst.',
    instruction=prompt.GOLF_ANALYSIS_PROMPT,
)
