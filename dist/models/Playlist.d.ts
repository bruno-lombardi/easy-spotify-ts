import { Followers } from '.';
import { ExternalUrls } from './ExternalUrls';
import { Image } from './Image';
import { PagingPlaylists } from './Paging';
import { User } from './User';
export interface FeaturedPlaylists {
    message: string;
    playlists: PagingPlaylists;
}
interface Tracks {
    href: string;
    total: number;
}
export interface SimplifiedPlaylist {
    collaborative: boolean;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    description: string;
    owner: User;
    public: boolean;
    snapshot_id: string;
    tracks: Tracks;
    type: 'playlist';
    uri: string;
}
export interface CreatePlaylistParams {
    name: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
}
export interface UpdatePlaylistParams {
    name?: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
}
export interface AddPlaylistTracksParams {
    uris: string[];
    position?: number;
}
export interface ReplacePlaylistTracksParams {
    /**
     * An array of uris to set. An uri looks like this: spotify:track:4iV5W9uYEdYUVa79Axb7Rh.
     */
    uris: string[];
    /**
     * The position of the first item to be reordered.
     */
    range_start?: number;
    /**
     * The position where the items should be inserted.
     * To reorder the items to the end of the playlist, simply set insert_before to the position after the last item.
     */
    insert_before?: number;
    /**
     * The amount of items to be reordered. Defaults to 1 if not set.
     * The range of items to be reordered begins from the range_start position, and includes the range_length subsequent items.
     */
    range_length?: number;
    /**
     * The playlist’s snapshot ID against which you want to make the changes.
     */
    snapshot_id?: string;
}
export interface RemovePlaylistTracksParams {
    /**
     * An array of uris to set. An uri looks like this: spotify:track:4iV5W9uYEdYUVa79Axb7Rh.
     */
    uris: string[];
    /**
     * The playlist’s snapshot ID against which you want to make the changes.
     */
    snapshot_id?: string;
}
export interface Playlist extends SimplifiedPlaylist {
    followers: Followers;
}
export {};
