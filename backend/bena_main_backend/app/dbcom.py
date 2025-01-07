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

def get_places():
    # get all places from supabase
    table_name = "places"
    response = supabase.table(table_name).select("*").execute()
    return response

def get_place(place_id):
    # get all places from supabase
    table_name = "places"
    response = supabase.table(table_name).select("*").eq("places_id", place_id).execute()
    return response.data

def get_places_dataframe():
    # get all places from supabase
    table_name = "places"
    response = supabase.table(table_name).select("*").execute()
    return pd.DataFrame(response.data)



# Adding basic database client

# Adding CRUD functions

# Adding specific validations methods to make sure communication with db is safe and secured
# Avoid duplicate or redundant places or data
# Avoid invalid or incomplete data
# Avoid deletion of Data

# make backup snapshots of data