import LoginForm from "../components/common/LoginForm.jsx";
import WelcomePanel from "../components/common/WelcomePanel.jsx";

export default function Login() {
  return (
    <main className="login-card grid w-full max-w-[920px] overflow-hidden rounded-[22px] bg-white shadow-[0_20px_55px_rgba(43,54,74,0.14)] md:grid-cols-[43%_57%]">
      <LoginForm />
      <WelcomePanel />
    </main>
  );
}
