const API_URL = "http://localhost:5050/api/diary";

export interface DiaryEntry {
  _id: string;
  albumId: string;
  albumName: string;
  artistName: string;
  artworkUrl: string;
  listenedDate: string;
  mood?: string;
  favoriteTrack?: string;
  note?: string;
  rating?: number;
  createdAt: string;
}

export async function createDiaryEntry(entryData: {
  albumId: string;
  albumName: string;
  artistName: string;
  artworkUrl: string;
  listenedDate: string;
  mood?: string;
  favoriteTrack?: string;
  note?: string;
  rating?: number;
}) {
  const token = localStorage.getItem("musicart_token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create diary entry");
  }

  return data;
}

export async function getMyDiaryEntries(): Promise<DiaryEntry[]> {
  const token = localStorage.getItem("musicart_token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch diary entries");
  }

  return data;
}

export async function deleteDiaryEntry(entryId: string) {
  const token = localStorage.getItem("musicart_token");

  const response = await fetch(`${API_URL}/${entryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete diary entry");
  }

  return data;
}