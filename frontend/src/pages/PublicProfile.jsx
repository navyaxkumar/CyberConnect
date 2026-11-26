import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/common/Alert.jsx";
import Loader from "../components/common/Loader.jsx";
import ProfileAvatar from "../components/common/ProfileAvatar.jsx";
import { fetchPublicProfile } from "../services/profileService.js";
import parseApiError from "../utils/parseApiError.js";

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError(null);
    fetchPublicProfile(username)
      .then((user) => {
        if (!ignore) setProfile(user);
      })
      .catch((err) => {
        if (!ignore) {
          setProfile(null);
          setError({
            status: err.response?.status,
            message: parseApiError(err).message,
          });
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [username]);

  if (loading) return <Loader label="Loading profile..." />;
  if (error?.status === 404) {
    return <Alert>We couldn&apos;t find a profile for that username.</Alert>;
  }
  if (error) return <Alert>{error.message}</Alert>;
  if (!profile) return null;

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex items-center gap-5">
        <ProfileAvatar username={profile.username} pictureUrl={profile.profilePictureUrl} />
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="mt-3 whitespace-pre-wrap text-slate-300">
            {profile.bio || "No bio yet."}
          </p>
        </div>
      </div>
    </section>
  );
}
