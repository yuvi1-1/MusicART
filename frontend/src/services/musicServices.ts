import type { Album } from "../types/music";

const API_URL = "http://localhost:5050/api/music";

export async function searchAlbums(query: string): Promise<Album[]> {
  const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Failed to search albums");
  }

  return response.json();
}