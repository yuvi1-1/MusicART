// Spotify API credentials
const CLIENT_ID = '7c6999af0ece469f9cc107b387e5e8d3'; // Replace with your Spotify Client ID
const CLIENT_SECRET = '84dc4f0805c64cd6bde6c03e92078ff8'; // Replace with your Spotify Client Secret

// Spotify API endpoints
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';
const ALBUM_ENDPOINT = 'https://api.spotify.com/v1/albums';

// Cache for storing access token
let accessToken = null;
let tokenExpirationTime = null;

// Get access token from Spotify
async function getAccessToken() {
    // Check if the token is still valid
    if (accessToken && Date.now() < tokenExpirationTime) {
        return accessToken;
    }

    try {
        const response = await fetch(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        accessToken = data.access_token;
        tokenExpirationTime = Date.now() + data.expires_in * 1000; // Set expiration time
        return accessToken;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

// Fetch albums by artist (Kendrick Lamar in this case)
async function fetchAlbums() {
    const accessToken = await getAccessToken();
    if (!accessToken) return;

    try {
        const response = await fetch(`${SEARCH_ENDPOINT}?q=artist:Kendrick%20Lamar&type=album&limit=10`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        return data.albums.items;
    } catch (error) {
        console.error('Error fetching albums:', error);
        return [];
    }
}

// Fetch tracks for a specific album
async function fetchTracks(albumId) {
    const accessToken = await getAccessToken();
    if (!accessToken) return;

    try {
        const response = await fetch(`${ALBUM_ENDPOINT}/${albumId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching tracks:', error);
        return [];
    }
}

// Create an album card with tracks
async function createAlbumCard(album) {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");

    // Album cover
    const albumImage = document.createElement("img");
    albumImage.src = album.images[0].url;
    albumImage.alt = album.name;
    albumImage.loading = "lazy"; // Lazy loading for better performance

    // Album title
    const albumTitle = document.createElement("h3");
    albumTitle.textContent = album.name;

    // Album release date
    const albumReleaseDate = document.createElement("p");
    albumReleaseDate.textContent = `Released: ${new Date(album.release_date).toLocaleDateString()}`;

    // Fetch and display tracks
    const trackList = document.createElement("div");
    trackList.classList.add("track-list");

    const trackListHeader = document.createElement("h4");
    trackListHeader.textContent = "Tracks:";

    const trackListItems = document.createElement("ul");

    const tracks = await fetchTracks(album.id);
    tracks.forEach(track => {
        const trackItem = document.createElement("li");
        trackItem.textContent = track.name;
        trackListItems.appendChild(trackItem);
    });

    trackList.appendChild(trackListHeader);
    trackList.appendChild(trackListItems);

    // Append all elements to the album card
    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumTitle);
    albumCard.appendChild(albumReleaseDate);
    albumCard.appendChild(trackList);

    return albumCard;
}

// Load albums into the grid
async function loadAlbums() {
    const albumGrid = document.getElementById("album-grid");
    albumGrid.innerHTML = "<p>Loading albums...</p>"; // Loading placeholder

    const albums = await fetchAlbums();
    if (albums.length === 0) {
        albumGrid.innerHTML = "<p>No albums found.</p>";
        return;
    }

    albumGrid.innerHTML = ""; // Clear loading placeholder

    for (const album of albums) {
        const albumCard = await createAlbumCard(album);
        albumGrid.appendChild(albumCard);
    }
}

// Search functionality
async function handleSearch() {
    const searchInput = document.getElementById("search-bar");
    const query = searchInput.value.trim();

    if (query === "") {
        loadAlbums(); // Reload all albums if search is empty
        return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) return;

    try {
        const response = await fetch(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&type=album&limit=10`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        const albums = data.albums.items;

        const albumGrid = document.getElementById("album-grid");
        albumGrid.innerHTML = ""; // Clear existing content

        if (albums.length === 0) {
            albumGrid.innerHTML = "<p>No albums found.</p>";
            return;
        }

        for (const album of albums) {
            const albumCard = await createAlbumCard(album);
            albumGrid.appendChild(albumCard);
        }
    } catch (error) {
        console.error('Error searching albums:', error);
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadAlbums(); // Load albums on page load

    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", handleSearch);

    const searchInput = document.getElementById("search-bar");
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });
});