import { ExternalUrls } from "./ExternalUrls";
import { Followers } from "./Followers";
import { Image } from "./Image";

export interface SimplifiedArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Artist extends SimplifiedArtist {
  followers: Followers;
  genres: string[];
  images: Image[];
  popularity: number;
}
