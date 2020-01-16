import { ExternalUrls } from "./ExternalUrls";
import { Image } from "./Image";
import { User } from "./User";
import { PagingPlaylists } from "./Paging";
export interface FeaturedPlaylists {
    message: string;
    playlists: PagingPlaylists;
}
export interface SimplifiedPlaylist {
    collaborative: boolean;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: User;
    primary_color: null;
    public: any;
    snapshot_id: string;
    tracks: Tracks;
    type: string;
    uri: string;
}
interface Tracks {
    href: string;
    total: number;
}
export {};
