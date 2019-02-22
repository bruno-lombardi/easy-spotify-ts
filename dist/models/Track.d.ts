import { SimplifiedAlbum } from "./Album";
import { SimplifiedArtist } from "./Artist";
import { ExternalIDS } from "./ExternalIDS";
import { ExternalUrls } from "./ExternalUrls";
export interface TrackLink {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
}
export declare class Track {
    album: SimplifiedAlbum;
    artists: SimplifiedArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIDS;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: TrackLink;
    name: string;
    restrictions: any;
    popularity: boolean;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    constructor(response: any);
}
