export interface Place {
  places_id: string;
  name: string;
  description: string;
  address: string;
  location: string;
  category: string;
  rating: number;
  created_at: string;
  image: string;
  latitude: number;
  longitude: number;
  external_link: string | null;
  arabic_name: string | null;
}
