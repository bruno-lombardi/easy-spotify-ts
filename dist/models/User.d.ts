import { ExternalUrls } from "./ExternalUrls";
import { Followers } from "./Followers";
import { Image } from "./Image";
export interface User {
    display_name: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    type: string;
    uri: string;
}
