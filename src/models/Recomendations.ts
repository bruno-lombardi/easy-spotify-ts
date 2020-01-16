import { SimplifiedTrack } from ".";

export class Recommendations {
  seeds: RecommendationsSeed[];
  tracks: SimplifiedTrack[];
}

export interface RecommendationsSeed{
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string;
  id: string;
  initialPoolSize: number;
  type: "artist" | "genre" | "track";
}

export interface RecommendationsQuery {
  limit?: number;
  market?: string;
  /** A list of any genres in the set of available genre seeds. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres. */
  seed_artists?: string[];
  /** A list of any genres in the set of available genre seeds. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres. */
  seed_tracks?: string[];
  /** A list of any genres in the set of available genre seeds. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres. */
  seed_genres?: string[];


  max_acousticness?: number;
  min_acousticness?: number;
  /** A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic. */
  target_acousticness?: number;

  max_danceability?: number;
  min_danceability?: number;
  /** Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable. */
  target_danceability?: number;

  min_duration_ms?: number;
  max_duration_ms?: number;
  /** The duration of the track in milliseconds. */
  target_duration_ms?: number;

  min_energy?: number;
  max_energy?: number;
  /** Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. */
  target_energy?: number;

  min_instrumentalness?: number;
  max_instrumentalness?: number;
  /** Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. */
  target_instrumentalness?: number;

  min_key?: number;
  max_key?: number;
  /** The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. */
  target_key?: number;

  min_liveness?: number;
  max_liveness?: number;
  /** Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live. */
  target_liveness?: number;

  min_loudness?: number;
  max_loudness?: number;
  /** The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typical range between -60 and 0 db. */
  target_loudness?: number;

  min_popularity?: number;
  max_popularity?: number;
  /** 	The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are. */
  target_popularity?: number;

  min_speechiness?: number;
  max_speechiness?: number;
  /** Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. */
  target_speechiness?: number;

  min_tempo?: number;
  max_tempo?: number;
  /** The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration. */
  target_tempo?: number;

  min_time_signature?: number;
  max_time_signature?: number;
  /**	An estimated overall time signature of a track. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). */
  target_time_signature?: number;

  min_valence?: number;
  max_valence?: number;
  /** A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry). */
  target_valence?: number;

  /** Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0. */
  target_mode?: 0 | 1;
}