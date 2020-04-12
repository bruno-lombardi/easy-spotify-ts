import { SimplifiedAlbum } from "./Album";
import { SimplifiedArtist } from "./Artist";
import { Category } from "./Category";
import { SimplifiedPlaylist } from "./Playlist";
import { SimplifiedTrack } from "./SimplifiedTrack";
export interface Paging {
    href: string;
    items: any[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}
export interface PagingTracks extends Paging {
    items: SimplifiedTrack[];
}
export interface PagingAlbums extends Paging {
    items: SimplifiedAlbum[];
}
export interface PagingArtists extends Paging {
    items: SimplifiedArtist[];
}
export interface PagingPlaylists extends Paging {
    items: SimplifiedPlaylist[];
}
export interface PagingCategories extends Paging {
    items: Category[];
}
export interface PagingSearch {
    tracks: PagingTracks;
    albums: PagingAlbums;
    artists: PagingArtists;
    playlists: PagingPlaylists;
}
