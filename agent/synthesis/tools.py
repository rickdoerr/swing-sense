import sqlite3
import json
import os
from typing import Optional

# Hardcoded path to the session database as per project structure
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'agent/.adk/session.db')

def get_previous_analysis(user_id: str) -> str:
    """
    Retrieves the analysis/recommendation from the user's previous session.
    
    Args:
        user_id: The ID of the user.
        
    Returns:
        The content of the previous analysis, or "No previous analysis found." if none exists.
    """
    if not os.path.exists(DB_PATH):
        return "No previous analysis found. (Database missing)"

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        query_sessions = """
            SELECT id 
            FROM sessions 
            WHERE user_id = ? 
            ORDER BY update_time DESC 
            LIMIT 2
        """
        cursor.execute(query_sessions, (user_id,))
        rows = cursor.fetchall()
        
        target_session_id = None
        
        if len(rows) < 2:
            conn.close()
            return "No previous analysis found."
        
        target_session_id = rows[1][0]
        
        query_events = """
            SELECT event_data 
            FROM events 
            WHERE session_id = ? 
            ORDER BY timestamp DESC
        """
        cursor.execute(query_events, (target_session_id,))
        event_rows = cursor.fetchall()
        
        conn.close()
        
        for event_row in event_rows:
            try:
                event_data = json.loads(event_row[0])
                
                if 'content' in event_data and event_data['content'].get('role') == 'model':
                    parts = event_data['content'].get('parts', [])
                    if parts and 'text' in parts[0]:
                        return f"Previous analysis: {parts[0]['text']}"
            except json.JSONDecodeError:
                continue
                
        return "No previous analysis found in the last session."

    except Exception as e:
        return f"Error retrieving previous analysis: {str(e)}"
