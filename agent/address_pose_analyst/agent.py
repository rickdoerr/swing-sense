from google.adk.agents.llm_agent import LlmAgent
from ..schemas import AddressAnalysis
from . import prompt

AGENT_MODEL = 'gemini-3-flash-preview'

address_agent = LlmAgent(
    name="AddressAgent",
    model=AGENT_MODEL,
    instruction=prompt.ADDRESS_ANALYSIS_PROMPT,
    description="Analyzes the address position of the golf swing.",
    input_schema=AddressAnalysis,
    output_key="address_analysis_result"
)
