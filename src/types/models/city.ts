export interface CityApiProps {
  data: Daum[];
  metadata: Metadata;
}

export interface Daum {
  id: number;
  wikiDataId: string;
  type: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  regionWdId: string;
  latitude: number;
  longitude: number;
  population: number;
  distance: any;
  placeType: string;
}

export interface Metadata {
  currentOffset: number;
  totalCount: number;
}
