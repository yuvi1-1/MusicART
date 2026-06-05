import type { Album } from "../types/music";

interface AlbumCardProps {
  album: Album;
}

function AlbumCard({ album }: AlbumCardProps) {
  return (
    <div className="album-card">
      <img src={album.artworkUrl} alt={album.name} />

      <h3>{album.name}</h3>

      <p>Artist: {album.artistName}</p>

      <p>
        Released:{" "}
        {album.releaseDate
          ? new Date(album.releaseDate).toLocaleDateString()
          : "Unknown"}
      </p>

      <p>Genre: {album.genre}</p>

      <p>{album.trackCount} tracks</p>

      <a href={album.albumUrl} target="_blank" rel="noreferrer">
        Open in Apple Music
      </a>
    </div>
  );
}

export default AlbumCard;