from google.adk.agents.llm_agent import LlmAgent
from schemas import ImpactAnalysis
from . import prompt

AGENT_MODEL = 'gemini-3-flash-preview'

impact_agent = LlmAgent(
    name="ImpactAnalysisAgent",
    model=AGENT_MODEL,
    instruction=prompt.IMPACT_ANALYSIS_PROMPT,
    description="Analyzes the impact frame of the golf swing frames to identify mishits.",
    input_schema=ImpactAnalysis,
    output_key="impact_analysis_result"
)
