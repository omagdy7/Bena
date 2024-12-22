from dotenv import load_dotenv
load_dotenv()

import os
import csv
from supabase import create_client, Client
import pandas as pd
import googlemaps
import time
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

            print("number of new data:",len(places))
            # print(places)
            # Loop through rows in the cleaned places names data
            for row in places:
                place_name = row["name"].replace('_',' ')

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
                    #print(results)
                    place_info = results['results'][0]
                    #print(place_info)
                    maps_addr = place_info["formatted_address"]
                    maps_lat = place_info["geometry"]["location"]["lat"]
                    maps_long = place_info["geometry"]["location"]["lng"]
                    maps_type = place_info["types"][0]
                    maps_link = "https://www.google.com/maps/place/?q=place_id:"+place_info["place_id"]
                    #print(maps_lat)

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
                    "name": place_name ,
                    "image": row["url"], # from main dataset
                    "description": quick_desc,  # Assign default values
                    "address": maps_addr,
                    "location": "Default location",
                    "category": maps_type,
                    "rating": 0.0,
                    "latitude": maps_lat,
                    "longitude": maps_long,
                    "external_link":maps_link,
                    "arabic_name":ar_title

                }
                #print(data)

                #Insert into the Supabase table
                response = supabase.table("places").insert(data).execute()


    except Exception as e:
        print(f"An error occurred: {e}")



    # Load the CSV file with place names
    # input_file = "places.csv"  # Change to your file name
    # output_file = "places_results.csv"

    # # Read the CSV file into a DataFrame
    # df = pd.read_csv(input_file)
    #
    # # Make sure the column with place names is correctly labeled
    # # Replace 'Place Name' with the column name in your CSV file
    # place_column = 'Place Name'
    #
    # # Initialize lists to store the results
    # locations = []
    # descriptions = []
    # ratings = []

    # Iterate through each place and query Google Maps
    # for place in df[place_column]:


                # Extract location (latitude and longitude)
    #             location = place_info['geometry']['location']
    #             locations.append(f"{location['lat']}, {location['lng']}")
    #
    #             # Extract description (if available)
    #             descriptions.append(place_info.get('name', 'N/A'))
    #
    #             # Extract average rating (if available)
    #             ratings.append(place_info.get('rating', 'N/A'))
    #         else:
    #             # If no results found
    #             locations.append('N/A')
    #             descriptions.append('N/A')
    #             ratings.append('N/A')
    #
    #         # Add delay to avoid rate limits
    #         time.sleep(0.5)
    #     except Exception as e:
    #         print(f"Error fetching details for {place}: {e}")
    #         locations.append('Error')
    #         descriptions.append('Error')
    #         ratings.append('Error')
    #
    # # Add the results to the DataFrame
    # df['Location'] = locations
    # df['Description'] = descriptions
    # df['Average Rating'] = ratings
    #
    # # Save the updated DataFrame to a new CSV file
    # df.to_csv(output_file, index=False)
    #
    # print(f"Results saved to {output_file}")



# Usage example
csv_file_path = "data_sets/places_imgs.csv"
insert_data_from_csv(csv_file_path)

#print(response)

