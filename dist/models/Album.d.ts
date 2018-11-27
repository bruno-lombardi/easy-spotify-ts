import { Artist } from "./Artist";
import { Copyright } from "./Copyright";
import { ExternalIDS } from "./ExternalIDS";
import { ExternalUrls } from "./ExternalUrls";
import { Image } from "./Image";
import { PagingTracks } from "./Paging";
export declare class Album {
    album_type: string;
    artists: Artist[];
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
