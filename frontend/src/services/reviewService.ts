const API_URL = "http://localhost:5050/api/reviews";

export interface ReviewUser {
  _id: string;
  username: string;
  avatarUrl?: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  albumId: string;
  albumName: string;
  artistName: string;
  artworkUrl: string;
  rating: number;
  reviewText: string;
  mood?: string;
  favoriteTrack?: string;
  createdAt: string;
}

export interface AlbumReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export async function getAlbumReviews(
  albumId: string
): Promise<AlbumReviewsResponse> {
  const response = await fetch(`${API_URL}/album/${albumId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
}

export async function createReview(reviewData: {
  albumId: string;
  albumName: string;
  artistName: string;
  artworkUrl: string;
  rating: number;
  reviewText: string;
  mood?: string;
  favoriteTrack?: string;
}) {
  const token = localStorage.getItem("musicart_token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create review");
  }

  return data;
}