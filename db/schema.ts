interface Place {
  places_id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  category: string;
  rating: number;
  created_at: Date;
  image: string;
  latitude: number;
  longitude: number;
  external_link: string | null;
  arabic_name: string | null;
  city: string;
  tags: string;
  maps_id: string;
}

interface Profiles {
  id: string;
  updated_at: Date;
  username: string;
  avatar_url: string;
}

interface SavedPlaces {
  saved_place_id: string;
  place_id: string;
  user_id: string;
  created_at: Date;
}

export { Place, Profiles, SavedPlaces }
