import useAuth from "../hooks/useAuth.js";

export default function Profile() {
  const { user } = useAuth();

  const rows = [
    ["Username", user.username],
    ["Email", user.email],
    ["Role", user.role],
    ["Member since", new Date(user.createdAt).toLocaleDateString()],
  ];

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Your profile</h1>
      <dl className="mt-6 divide-y divide-slate-800 rounded-md border border-slate-800">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between px-4 py-3">
            <dt className="text-slate-400">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}