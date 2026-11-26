import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section>
      <h1 className="text-2xl font-bold">404: Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-emerald-400 hover:underline">
        Back to home
      </Link>
    </section>
  );
}