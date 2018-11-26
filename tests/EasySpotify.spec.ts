import { expect } from 'chai';
import "mocha";
import EasySpotify from '../src/EasySpotify';
import EasySpotifyConfig from '../src/EasySpotifyConfig';

describe('EasySpotify', () => {

  it('should create an instance of EasySpotify', () => {
    const spotify = new EasySpotify(new EasySpotifyConfig('token'));
    expect(spotify).to.be.instanceof(EasySpotify);
    expect(spotify.config.token).to.not.be.empty;
    expect(spotify.config.apiURL).to.not.be.empty;
  });
});
