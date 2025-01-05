from dotenv import load_dotenv

load_dotenv()

import re
import os
import csv
from supabase import create_client, Client
import googlemaps
import wikipediaapi

# initialize supabase connection
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Set your API key
api_key = os.environ.get("MAPS_API_KEY")
# Initialize the Google Maps client
gmaps = googlemaps.Client(key=api_key)

# Initialize the Wikipedia API with a custom user agent
user_agent = "Bena/1.0 (bena@example.com)"
wiki = wikipediaapi.Wikipedia(user_agent=user_agent)


# inserting famous places in Egypt

def search_place_in_maps(place_name: str):

    maps_data = {
        "name": place_name,
        "address": "Default address",
        "latitude": 0.0,
        "longitude": 0.0,
        "category": "Default Type",
        "external_link": "No external link yet",
        "city": "Default city",
        "tags": "Default tags",
        "maps_id": "NOT AVAILABLE",
    }
    results = gmaps.places(query=place_name)
    if results['status'] == 'OK' and results['results']:
        place_info = results['results'][0]
        maps_data["address"] = place_info["formatted_address"]
        maps_data["latitude"] = place_info["geometry"]["location"]["lat"]
        maps_data["longitude"] = place_info["geometry"]["location"]["lng"]
        maps_data["category"] = place_info["types"][0]
        maps_data["maps_id"] = place_info["place_id"]
        # extract the city from the address
        formated_address = place_info["formatted_address"].split(',')[-2]
        cleaned_formated_address = re.sub(r'\d+', '', formated_address).strip()
        maps_data["city"] = cleaned_formated_address    
        # fetch the place more detailed info
        place = gmaps.place(place_id=maps_data["maps_id"])
        # get the place maps url from the place details
        maps_data["external_link"] = place["result"]["url"]
        
    return maps_data

def search_place_in_wiki(place_name: str):
    wiki_data = {
        "description": "No description yet",
        "arabic_name": "Not available yet",
        "tags": "Not available yet",
    }
    page = wiki.page(place_name)
    
    if page.exists():
        wiki_data["description"] = f"{page.summary[:500]}"

        # Get categories for the page and clean them
        categories = page.categories
        cleaned_categories = [category.replace("Category:", "") for category in categories.keys()]
        # Combine all categories into a single string
        wiki_data["tags"] = ", ".join(cleaned_categories)
        
        if 'ar' in page.langlinks:
            arabic_page = page.langlinks['ar']
            wiki_data["arabic_name"] = arabic_page.title
    else:
        print(f"Page for {place_name} does not exist.")
    return wiki_data

def read_places_from_csv(csv_file_path: str):
    
    exported_places = []
    # Dictionary to store unique places
    unique_places = {}
    places = []

    # Reading Places Dataset
    try:
        with open(csv_file_path, mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file) # read the csv file

            # Cleaning Redundant places
            for row in reader:
                place_landmark = row["landmark_id"]
                if place_landmark not in unique_places:
                    unique_places[place_landmark] = 1
                    places.append(row)
            print("number of new data:", len(places))

            # Loop through rows in the cleaned places names data
            for row in places:
                place_name = row["name"].replace('_', ' ') # get the place name and replace the clean it

                # Query Google Places API
                maps_place_info = search_place_in_maps(place_name)
                
                # Query Wikipedia API
                wiki_place_info = search_place_in_wiki(place_name)

                #  Mapping to database columns
                data = {
                    "name": place_name, # from main dataset
                    "image": row["url"], # from main dataset
                    # from google maps
                    "address": maps_place_info["address"],
                    "category": maps_place_info["category"],
                    "latitude": maps_place_info["latitude"],
                    "longitude": maps_place_info["longitude"],
                    "external_link": maps_place_info["external_link"],
                    "city": maps_place_info["city"],
                    "maps_id": maps_place_info["maps_id"],
                    # from wikipedia
                    "description": wiki_place_info["description"],
                    "arabic_name": wiki_place_info["arabic_name"],
                    "tags": wiki_place_info["tags"],
                    "location": "Default location",
                    "rating": 0.0,  
                }

                exported_places.append(data)

                # Insert into the Supabase table
                # response = supabase.table("places").insert(data).execute()
                
    except Exception as e:
        print(f"An error occurred: {e}")
    
    return exported_places

def insert_data_from_csv(csv_file_path: str):
    # Dictionary to store unique places
    unique_places = {}
    places = []

    # Reading Places Dataset
    try:
        with open(csv_file_path, mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)

            # Cleaning Redundant places
            for row in reader:
                place_landmark = row["landmark_id"]
                if place_landmark not in unique_places:
                    unique_places[place_landmark] = 1
                    places.append(row)

            print("number of new data:", len(places))
            # print(places)
            # Loop through rows in the cleaned places names data
            for row in places:
                place_name = row["name"].replace('_', ' ')

                maps_addr = "Default address"
                maps_lat = 0.0
                maps_long = 0.0
                maps_type = "Default Type"
                maps_link = "No external link yet"
                quick_desc = "No description yet"
                ar_title = "Not available yet"

                # Query Google Places API
                results = gmaps.places(query=place_name)

                if results['status'] == 'OK' and results['results']:
                    # print(results)
                    place_info = results['results'][0]
                    # print(place_info)
                    maps_addr = place_info["formatted_address"]
                    maps_lat = place_info["geometry"]["location"]["lat"]
                    maps_long = place_info["geometry"]["location"]["lng"]
                    maps_type = place_info["types"][0]
                    maps_link = "https://www.google.com/maps/place/?q=place_id:" + place_info["place_id"]
                    # print(maps_lat)

                # Get the page for the place
                page = wiki.page(place_name)

                # Check if the page exists
                if page.exists():
                    quick_desc = f"Description: {page.summary[:500]}"
                    if 'ar' in page.langlinks:
                        arabic_page = page.langlinks['ar']
                        ar_title = arabic_page.title
                else:
                    print(f"Page for {place_name} does not exist.")

                # Map CSV columns to database columns
                data = {
                    "name": place_name,
                    "image": row["url"],  # from main dataset
                    "description": quick_desc,  # Assign default values
                    "address": maps_addr,
                    "location": "Default location",
                    "category": maps_type,
                    "rating": 0.0,
                    "latitude": maps_lat,
                    "longitude": maps_long,
                    "external_link": maps_link,
                    "arabic_name": ar_title

                }
                print(data)

                # Insert into the Supabase table
                response = supabase.table("places").insert(data).execute()

    except Exception as e:
        print(f"An error occurred: {e}")

def fetch_data_from_supabase():
    response = supabase.table("places").select("*").execute()
    # print(response.data)
    return response.data

def clean_tags(tags):
    # Split the tags into a list
    tags_list = tags.split(", ")

    # Define a list of keywords to remove article-related tags
    article_keywords = [
        "articles", "Article", "containing", "CS1", "Infobox", "Pages", "short description",
        "Coordinates", "Wikidata", "Kartographer", "WikiMiniAtlas"
    ]

    # Filter out tags that contain article-related keywords
    cleaned_tags = [tag for tag in tags_list if not any(keyword.lower() in tag.lower() for keyword in article_keywords)]

    # Return the cleaned tags as a string
    return ", ".join(cleaned_tags)

def clean():
    # Fetch data from the 'places' table
    response = supabase.table("places").select("places_id, tags").execute()

    if len(response.data) > 0:
        places_data = response.data

        for place in places_data:
            places_id = place["places_id"]
            tags = place["tags"]

            if tags:
                # Clean the tags
                cleaned_tags = clean_tags(tags)

                print(cleaned_tags)

                # Update the cleaned tags back to the database
                supabase.table("places").update({"tags": cleaned_tags}).eq("places_id", places_id).execute()

        print("Tags cleaned and updated successfully!")
    else:
        print("No data found in the places table.")

clean()
# csv_file_path = "data_sets/places_imgs.csv"
# read_places_from_csv(csv_file_path)
