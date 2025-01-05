from dotenv import load_dotenv

load_dotenv()

import re
import os
import numpy as np 
import pandas as pd 
from supabase import create_client, Client

# initialize supabase connection
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

table_name = "places"
response = supabase.table(table_name).select("*").execute()

# Adding basic database client

# Adding CRUD functions

# Adding specific validations methods to make sure communication with db is safe and secured
# Avoid duplicate or redundant places or data
# Avoid invalid or incomplete data
# Avoid deletion of Data

# make backup snapshots of data