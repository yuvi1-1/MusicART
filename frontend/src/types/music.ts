export interface Album {
  id: number;
  name: string;
  artistName: string;
  artworkUrl: string;
  releaseDate: string;
  trackCount: number;
  genre: string;
  albumUrl: string;
}

export interface Track {
  id: number;
  name: string;
  trackNumber: number;
  durationMs: number;
  previewUrl?: string;
}