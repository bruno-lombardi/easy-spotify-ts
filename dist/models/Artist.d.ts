import { ExternalUrls } from './ExternalUrls';
import { Followers } from './Followers';
import { Image } from './Image';
import { OptionalRequestParams } from './Request';
export interface SimplifiedArtist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}
export interface GetArtistAlbumsOptions extends OptionalRequestParams {
    include_groups?: string;
}
export declare class Artist implements SimplifiedArtist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
    followers: Followers;
    genres: string[];
    images: Image[];
    popularity: number;
    constructor(response: any);
}
