from google.adk.agents.parallel_agent import ParallelAgent

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from address_pose_analyst.agent import address_agent
from swing_analyst.agent import top_of_swing_agent
from impact_analyst.agent import impact_agent
from synthesis.agent import merger_agent

root_agent = ParallelAgent(
    name="GolfSwingAnalysisPipeline",
    sub_agents=[address_agent, top_of_swing_agent, impact_agent, merger_agent],
    description="Runs address, top of swing, impact, and synthesis analysis in parallel."
)
