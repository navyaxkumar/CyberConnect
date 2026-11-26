import { useState } from "react";

export default function ProfileAvatar({ username, pictureUrl }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (pictureUrl && !imageFailed) {
    return (
      <img
        src={pictureUrl}
        alt={`${username}'s profile`}
        onError={() => setImageFailed(true)}
        className="h-24 w-24 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${username}'s profile picture placeholder`}
      className="grid h-24 w-24 place-items-center rounded-full bg-slate-800 text-3xl font-semibold text-emerald-400"
    >
      {username?.charAt(0).toUpperCase() || "?"}
    </div>
  );
}
