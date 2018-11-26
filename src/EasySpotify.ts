import EasySpotifyConfig from './EasySpotifyConfig';

export default class EasySpotify {
    config: EasySpotifyConfig;

    constructor(config: EasySpotifyConfig) {
        this.config = config;
    }

    setToken(token: string): void {
        if(token.trim() === '')
            throw new Error('Cannot set an empty token');
        this.config.token = token;
    }

    setApiUrl(apiURL: string): void {
        if(apiURL.trim() === '')
            throw new Error('Cannot set an empty API Url');
        this.config.apiURL = apiURL;
    }

    private buildHeaders(): any {
        return {
            headers: {
                Authorization: `Bearer ${this.config.token}`
              }
        }
    }
}