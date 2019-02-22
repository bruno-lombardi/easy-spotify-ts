import { SimplifiedAlbum } from "./Album";
import { SimplifiedTrack } from "./SimplifiedTrack";
import { SimplifiedArtist } from "./Artist";
import { ExternalIDS } from "./ExternalIDS";
import { ExternalUrls } from './ExternalUrls';

export interface TrackLink {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Track {
  album: SimplifiedAlbum;
  artists: SimplifiedArtist[];
  available_markets: string[];
  disc_number: Number;
  duration_ms: Number;
  explicit: Boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: Boolean;
  linked_from: TrackLink;
  name: string;
  restrictions: any;
  popularity: Number;
  preview_url: string;
  track_number: Number;
  type: string;
  uri: string;
}

export interface Tracks {
  tracks: Track[];
}
