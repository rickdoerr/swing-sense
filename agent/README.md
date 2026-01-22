# Swing Sense Agent

## Usage

Follow these steps to set up and run the project:

1.  **Clone the repository**

    ```bash
    git clone https://github.com/rickdoerr/swing-sense.git
    ```

2.  **Create a virtual environment**

    In the root of the project, create a new virtual environment:

    ```bash
    cd swing-sense
    python3 -m venv .venv
    source venv/bin/activate
    ```

3.  **Install dependencies**

    Install all required packages from `requirements.txt`:

    ```bash
    pip install -r agent/requirements.txt
    adk --verion
    ```

4.  **Run the Agent**

    Open the ADK debug web application using the ADK CLI:

    ```bash
    adk web
    ```

    or start the development server 

    ```bash
    adk api_server
    ```