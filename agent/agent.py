from google.adk.agents.parallel_agent import ParallelAgent
from google.adk.agents.sequential_agent import SequentialAgent
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from .address_pose_analyst.agent import address_agent
from .swing_analyst.agent import top_of_swing_agent
from .synthesis.agent import merger_agent

# --- 2. Create Parallel Agent ---
parallel_agent = ParallelAgent(
    name="ParallelSwingAnalysisAgent",
    sub_agents=[address_agent, top_of_swing_agent],
    description="Runs address and top of swing analysis in parallel."
)

# --- 4. Create Sequential Pipeline ---
root_agent = SequentialAgent(
    name="GolfSwingAnalysisPipeline",
    sub_agents=[parallel_agent, merger_agent],
    description="Orchestrates the complete golf swing analysis pipeline."
)
