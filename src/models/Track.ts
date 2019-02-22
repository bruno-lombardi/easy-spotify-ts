import { SimplifiedAlbum } from "./Album";
import { SimplifiedArtist } from "./Artist";
import { ExternalIDS } from "./ExternalIDS";
import { ExternalUrls } from "./ExternalUrls";
import { SimplifiedTrack } from "./SimplifiedTrack";

export interface TrackLink {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export class Track {
  public album: SimplifiedAlbum;
  public artists: SimplifiedArtist[];
  public available_markets: string[];
  public disc_number: number;
  public duration_ms: number;
  public explicit: boolean;
  public external_ids: ExternalIDS;
  public external_urls: ExternalUrls;
  public href: string;
  public id: string;
  public is_playable: boolean;
  public linked_from: TrackLink;
  public name: string;
  public restrictions: any;
  public popularity: boolean;
  public preview_url: string;
  public track_number: number;
  public type: string;
  public uri: string;

  constructor(response: any) {
    this.album = response.album;
    this.artists = response.artists;
    this.available_markets = response.available_markets;
    this.disc_number = response.disc_number;
    this.duration_ms = response.duration_ms;
    this.explicit = response.explicit;
    this.external_ids = response.external_ids;
    this.external_urls = response.external_urls;
    this.href = response.href;
    this.id = response.id;
    this.is_playable = response.is_playable;
    this.linked_from = response.linked_from;
    this.name = response.name;
    this.restrictions = response.restrictions;
    this.popularity = response.popularity;
    this.preview_url = response.preview_url;
    this.track_number = response.track_number;
    this.type = response.type;
    this.uri = response.uri;
  }
}
