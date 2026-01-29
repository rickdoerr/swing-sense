from google.adk.agents.llm_agent import LlmAgent
from schemas import TopOfSwingAnalysis
from . import prompt

AGENT_MODEL = 'gemini-3-flash-preview'

top_of_swing_agent = LlmAgent(
    name="TopOfSwingAgent",
    model=AGENT_MODEL,
    instruction=prompt.TOP_OF_SWING_ANALYSIS_PROMPT,
    description="Analyzes the top of swing position and rotation metrics.",
    input_schema=TopOfSwingAnalysis,
    output_key="top_of_swing_analysis_result"
)
