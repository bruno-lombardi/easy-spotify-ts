import { EasySpotify, EasySpotifyConfig } from '../src'

async function main(): Promise<void> {
  const token = process.env.SPOTIFY_ACCESS_TOKEN
  if (!token)
    throw new Error(
      'Set SPOTIFY_ACCESS_TOKEN to an authorized Spotify OAuth token'
    )

  const spotify = new EasySpotify(new EasySpotifyConfig(token))
  const query = process.env.SPOTIFY_SEARCH_QUERY ?? 'Miles Davis'
  const tracks = await spotify.searchTracks(query, { limit: 10 })
  console.log(
    tracks.items.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      uri: track.uri
    }))
  )
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
