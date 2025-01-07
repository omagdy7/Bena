# backend models
from app.cat_model import recommend_places
from app.cat_model import users_has_interactions
# FastAPI
from typing import Union
from fastapi import FastAPI

# initialize FastAPI
app = FastAPI()

# Recommendation API
@app.get("/recommend/{user_id}")
def read_item(user_id: str, method: Union[str, None] = None, length: Union[int, None] = None):
    warnings = ""
    # manage length margins and fix wrong inputs
    if length is None or length < 1 or length > 10: 
        length = 10
        warnings = warnings + "Length entered is not valid, 10 recommendations are generated." + "\n"
    # validate method and fix wrong inputs 
    if method is None: method = "hybrid"
    else :
        method = method.lower()
        if method not in ["content_based", "near_bookmarks", "hybrid", "random"]:
            method = "hybrid"
            warnings = warnings + "Method entered is not valid, hybrid recommendations are generated." + "\n"
    # check if user has any past bookmarks or interactions
    if not users_has_interactions(user_id): 
        method = "random"
        warnings = warnings + "No past bookmarks or interactions found for this user, random recommendations is generated." + "\n"
    # get recommendations
    recommendations = recommend_places(user_id=user_id, n=length, method=method)
    # send the response
    return {"recommendations": recommendations.to_dict(orient="records"), "method": method, "length": length, "warnings": warnings}

# suggested trips API
# route to get suggested trips

# search APIs
@app.get("/search/places/{query}")
def read_item(query: str):
    return {"query": query}