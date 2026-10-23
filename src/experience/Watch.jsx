import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlay, FiPlus, FiCheck, FiFilm } from "react-icons/fi";
import { Screen, Loading, ErrorState } from "./Shared";
import { getTitle, videoSource } from "./service";
import { readSaved } from "./catalog.mjs";
export function VideoPlayer({ value, title }) {
  const source = videoSource(value);
  const [failed, setFailed] = useState(false);
  if (!source)
    return (
      <div className="state-panel">
        <FiFilm />
        <h2>No video is linked yet.</h2>
        <p>You can still explore this title or save it for later.</p>
      </div>
    );
  return (
    <div className="video-player">
      {source.type === "youtube" ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${source.value}?autoplay=1`}
          title={`${title} trailer`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          src={source.value}
          controls
          autoPlay
          onError={() => setFailed(true)}
        />
      )}
      <div className="player-note">
        {source.type === "youtube" ? (
          <>
            Trailer playback is provided by YouTube.{" "}
            <a
              href={`https://www.youtube.com/watch?v=${source.value}`}
              target="_blank"
              rel="noreferrer"
            >
              Open on YouTube ↗
            </a>
          </>
        ) : failed ? (
          <span role="alert">
            This video could not be loaded. Please check the video URL.
          </span>
        ) : (
          <span>
            Use the player controls for captions and full screen when available.
          </span>
        )}
      </div>
    </div>
  );
}
export default function Watch() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const playback = pathname.startsWith("/play/");
  const kind = pathname.startsWith("/tvshow")
    ? "tv"
    : pathname.startsWith("/trending")
      ? "trending"
      : "movie";
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(!playback);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(playback);
  const [saved, setSaved] = useState(() => readSaved());
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setError("");
    setPlaying(playback);
    window.scrollTo(0, 0);
    if (playback) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getTitle(id, kind)
      .then((m) => {
        if (active) setMovie(m);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, kind, playback, retry]);
  const save = () => {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    try {
      localStorage.setItem("streamflix-list", JSON.stringify(next));
      setSaved(next);
      setNotice(
        next.includes(id) ? "Added to your list." : "Removed from your list.",
      );
    } catch {
      setNotice(
        "Your browser could not save the list. Please check its storage settings.",
      );
    }
  };
  return (
    <Screen>
      <section className="watch-page section-wrap">
        <Link className="text-link" to={kind === "tv" ? "/tvshows" : "/movie"}>
          <FiArrowLeft /> Back to the collection
        </Link>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState
            message={error}
            onRetry={() => setRetry(retry + 1)}
            back="/movie"
          />
        ) : playback ? (
          <>
            <h1 className="player-heading">Take a front row seat.</h1>
            <VideoPlayer key={id} value={id} title="Streamflix" />
          </>
        ) : (
          movie && (
            <>
              {playing ? (
                <VideoPlayer
                  key={movie.id}
                  value={movie.video}
                  title={movie.title}
                />
              ) : (
                <div
                  className="watch-backdrop"
                  style={{
                    backgroundImage: `linear-gradient(0deg,#101112,transparent 70%),url('${movie.backdrop || movie.image}')`,
                  }}
                />
              )}
              <div className="watch-info">
                <div>
                  <span className="eyebrow">
                    {movie.type === "tv"
                      ? "YOUR NEXT GREAT SERIES"
                      : "A STORY WORTH YOUR TIME"}
                  </span>
                  <h1>{movie.title}</h1>
                  <div className="metadata">
                    <span className="rating">★ {movie.rating}</span>
                    <span>{movie.year}</span>
                    <span>{movie.duration}</span>
                    <span>{movie.genre}</span>
                  </div>
                  <p className="watch-description">{movie.description}</p>
                  <div className="button-row">
                    <button
                      className="button primary"
                      disabled={!videoSource(movie.video)}
                      onClick={() => {
                        setPlaying(true);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                    >
                      <FiPlay />
                      {videoSource(movie.video)?.type === "youtube"
                        ? "Watch trailer"
                        : "Play video"}
                    </button>
                    <button className="button secondary" onClick={save}>
                      {saved.includes(id) ? <FiCheck /> : <FiPlus />}
                      {saved.includes(id) ? "In my list" : "My list"}
                    </button>
                  </div>
                  <p className="small-note" role="status">
                    {notice}
                  </p>
                </div>
                <aside>
                  <h2>Behind the story</h2>
                  <p>
                    <span>CAST</span>
                    {movie.cast || "Cast details unavailable"}
                  </p>
                  <p>
                    <span>GENRE</span>
                    {movie.genre}
                  </p>
                  <p>
                    <span>RELEASED</span>
                    {movie.year || "Unknown"}
                  </p>
                </aside>
              </div>
            </>
          )
        )}
      </section>
    </Screen>
  );
}
