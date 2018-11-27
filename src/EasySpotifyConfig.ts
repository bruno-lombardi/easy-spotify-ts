const API_URL = "https://api.spotify.com/v1";

export default class EasySpotifyConfig {
    public apiURL: string;
    public token: string;

    constructor(token: string, apiURL: string = API_URL) {
        this.token = token;
        this.apiURL = apiURL;
    }
}
