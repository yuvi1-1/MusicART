import { Link } from "react-router-dom";
import type { Album } from "../types/music";

interface AlbumCardProps {
  album: Album;
}

function AlbumCard({ album }: AlbumCardProps) {
  function saveAlbumForDetails() {
    localStorage.setItem("selected_album", JSON.stringify(album));
  }

  return (
    <Link
      to={`/album/${album.id}`}
      className="album-card-link"
      onClick={saveAlbumForDetails}
    >
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
      </div>
    </Link>
  );
}

export default AlbumCard;