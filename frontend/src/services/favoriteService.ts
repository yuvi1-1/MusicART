const API_URL = "http://localhost:5050/api/favorites";

export interface FavoriteAlbum {
  _id: string;
  albumId: string;
  albumName: string;
  artistName: string;
  artworkUrl: string;
  genre?: string;
  albumUrl?: string;
  createdAt: string;
}

export async function addFavorite(albumData: {
  albumId: string;
  albumName: string;
  artistName: string;
  artworkUrl: string;
  genre?: string;
  albumUrl?: string;
}) {
  const token = localStorage.getItem("musicart_token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(albumData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save album");
  }

  return data;
}

export async function getMyFavorites(): Promise<FavoriteAlbum[]> {
  const token = localStorage.getItem("musicart_token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch saved albums");
  }

  return data;
}

export async function removeFavorite(albumId: string) {
  const token = localStorage.getItem("musicart_token");

  const response = await fetch(`${API_URL}/${albumId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove album");
  }

  return data;
}