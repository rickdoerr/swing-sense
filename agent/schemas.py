from pydantic import BaseModel, Field
import google.genai.types as types

# This schema is used by the agent runtime to determine
# which agent is best suited to respond to individual 
# parts of the client query. 

class AddressAnalysis(BaseModel):
    address_image: types.Blob = Field(
        description="The image of the golfer at address.",
        alias="address_position.jpg" 
    )

class TopOfSwingAnalysis(BaseModel):
    shoulder_rotation: float = Field(description="Calculated shoulder rotation in degrees")
    hip_rotation: float = Field(description="Calculated hip rotation in degrees")
    top_of_swing_image: types.Blob = Field(
        description="The image of the golfer at the top of the swing.",
        alias="top_of_swing.jpg"
    )