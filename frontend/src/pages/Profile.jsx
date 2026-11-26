import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/common/Alert.jsx";
import Loader from "../components/common/Loader.jsx";
import ProfileAvatar from "../components/common/ProfileAvatar.jsx";
import { fetchMyProfile, updateMyProfile } from "../services/profileService.js";
import parseApiError from "../utils/parseApiError.js";
import { validateProfile } from "../utils/validators.js";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [retry, setRetry] = useState(0);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", bio: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setLoadError(null);
    fetchMyProfile()
      .then((user) => {
        if (!ignore) {
          setProfile(user);
          setForm({ username: user.username, bio: user.bio || "" });
        }
      })
      .catch((err) => {
        if (!ignore) {
          setLoadError({
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
  }, [retry]);

  const startEditing = () => {
    setForm({ username: profile.username, bio: profile.bio || "" });
    setFieldErrors({});
    setFeedback(null);
    setEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const errors = validateProfile(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    try {
      const updatedProfile = await updateMyProfile({
        username: form.username.trim(),
        bio: form.bio.trim(),
      });
      setProfile(updatedProfile);
      setForm({ username: updatedProfile.username, bio: updatedProfile.bio || "" });
      setEditing(false);
      setFeedback({ type: "success", message: "Your profile was updated." });
    } catch (err) {
      const { message, fields } = parseApiError(err);
      setFieldErrors(fields);
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading your profile..." />;
  if (loadError) {
    return (
      <section className="mx-auto max-w-xl space-y-4">
        <Alert>{loadError.message}</Alert>
        {loadError.status === 401 ? (
          <Link to="/login" className="text-emerald-400 hover:underline">
            Log in again
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setRetry((current) => current + 1)}
            className="rounded-md border border-slate-700 px-4 py-2 hover:bg-slate-800"
          >
            Try again
          </button>
        )}
      </section>
    );
  }
  if (!profile) return null;

  return (
    <section className="mx-auto max-w-xl rounded-lg border border-slate-800 bg-slate-900/50 p-6">
      <Alert type={feedback?.type}>{feedback?.message}</Alert>
      <div className="flex items-center gap-5">
        <ProfileAvatar username={profile.username} pictureUrl={profile.profilePictureUrl} />
        {!editing && (
          <div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="mt-3 whitespace-pre-wrap text-slate-300">
              {profile.bio || "No bio yet."}
            </p>
            <button
              type="button"
              onClick={startEditing}
              className="mt-5 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="profile-username" className="mb-1 block text-sm text-slate-300">
              Username
            </label>
            <input
              id="profile-username"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.username)}
              aria-describedby={fieldErrors.username ? "profile-username-error" : undefined}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
            />
            {fieldErrors.username && (
              <p id="profile-username-error" className="mt-1 text-sm text-red-300">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="profile-bio" className="mb-1 block text-sm text-slate-300">
              Bio
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={300}
              rows={4}
              aria-invalid={Boolean(fieldErrors.bio)}
              aria-describedby={fieldErrors.bio ? "profile-bio-error" : "profile-bio-count"}
              className="w-full resize-y rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-emerald-500"
            />
            {fieldErrors.bio ? (
              <p id="profile-bio-error" className="mt-1 text-sm text-red-300">
                {fieldErrors.bio}
              </p>
            ) : (
              <p id="profile-bio-count" className="mt-1 text-right text-xs text-slate-400">
                {form.bio.length}/300
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setEditing(false);
                setFieldErrors({});
                setFeedback(null);
              }}
              className="rounded-md border border-slate-700 px-4 py-2 hover:bg-slate-800 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
