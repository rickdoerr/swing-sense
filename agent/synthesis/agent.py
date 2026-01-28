from google.adk.agents.llm_agent import LlmAgent
from . import prompt

AGENT_MODEL = 'gemini-3-flash-preview'

merger_agent = LlmAgent(
    name="SynthesisAgent",
    model=AGENT_MODEL,
    instruction=prompt.MERGER_PROMPT,
    description="Synthesizes analysis from sub-agents into a final JSON report.",
    output_key="final_analysis"
)
