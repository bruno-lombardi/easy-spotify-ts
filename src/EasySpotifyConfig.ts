const API_URL = 'https://api.spotify.com/v1';

export default class EasySpotifyConfig {
    apiURL?: string = API_URL;
    token: string;

    constructor(token: string) {
        this.token = token;
    }
}