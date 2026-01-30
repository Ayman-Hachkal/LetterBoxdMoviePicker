import sys
import os

# Add your project directory to Python's path
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import the 'app' object from your application's main file (e.g., app.py)
# The variable name is often 'application' by convention for WSGI
from runner import app as application 

# The 'if __name__ == "__main__":' block is for local testing and can be omitted in a 
# production wsgi file, or retained for local execution outside the server.
# if __name__ == "__main__":
#     application.run()

