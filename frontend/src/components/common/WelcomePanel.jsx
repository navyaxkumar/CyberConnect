import { Link } from "react-router-dom";

export default function WelcomePanel() {
  return (
    <section className="auth-wave relative isolate flex min-h-[440px] flex-col items-center justify-center overflow-hidden px-8 py-10 text-center text-white md:pl-14">
      <div className="pointer-events-none absolute -left-28 top-[-40px] h-64 w-64 rounded-full border-[42px] border-white/8" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full border-[48px] border-white/7" />
      <div className="pointer-events-none absolute bottom-16 right-12 h-20 w-20 rounded-full bg-white/5 blur-sm" />

      <div className="relative z-10 flex max-w-sm flex-col items-center">
        <img
          src="/cyberconnect-logo.png"
          alt="CyberConnect"
          className="mb-7 h-auto w-[250px] max-w-full object-contain"
        />
        <h2 className="text-lg font-bold tracking-[0.08em]">WELCOME!</h2>
        <p className="mt-3 max-w-[290px] text-sm leading-6 text-blue-50/90">
          Connect with the cybersecurity community. Share knowledge, explore security insights and grow together.
        </p>
        <Link
          to="/register"
          className="mt-7 rounded-[4px] border border-white/45 bg-white/10 px-9 py-3 text-xs font-bold tracking-[0.16em] shadow-lg transition hover:bg-white hover:text-brand-dark focus:outline-none focus:ring-4 focus:ring-white/20"
        >
          SIGN UP
        </Link>
      </div>
    </section>
  );
}
