import { SimplifiedArtist } from "./Artist";
import { Copyright } from "./Copyright";
import { ExternalIDS } from "./ExternalIDS";
import { ExternalUrls } from "./ExternalUrls";
import { Image } from "./Image";
import { PagingTracks } from "./Paging";
export interface SimplifiedAlbum {
    album_group?: string;
    album_type: string;
    artists: SimplifiedArtist[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    type: string;
    uri: string;
}
export declare class Album implements SimplifiedAlbum {
    album_type: string;
    artists: SimplifiedArtist[];
    available_markets: string[];
    copyrights: Copyright[];
    external_ids: ExternalIDS;
    external_urls: ExternalUrls;
    genres: any[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    release_date: string;
    release_date_precision: string;
    tracks: PagingTracks;
    type: string;
    uri: string;
    constructor(response: any);
}
