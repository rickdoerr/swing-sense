from google.adk.agents.parallel_agent import ParallelAgent
from google.adk.agents.sequential_agent import SequentialAgent
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from .address_pose_analyst.agent import address_agent
from .swing_analyst.agent import top_of_swing_agent
from .impact_analyst.agent import impact_agent
from .synthesis.agent import merger_agent

parallel_agent = ParallelAgent(
    name="ParallelSwingAnalysisAgent",
    sub_agents=[address_agent, top_of_swing_agent, impact_agent],
    description="Runs address, top of swing and impact analysis in parallel."
)

root_agent = SequentialAgent(
    name="GolfSwingAnalysisPipeline",
    sub_agents=[parallel_agent, merger_agent],
    description="Orchestrates the complete golf swing analysis pipeline."
)
