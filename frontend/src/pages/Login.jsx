import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import parseApiError from "../utils/parseApiError.js";
import { validateLogin } from "../utils/validators.js";
import Alert from "../components/common/Alert.jsx";
import FormField from "../components/common/FormField.jsx";
import PasswordField from "../components/common/PasswordField.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute sends people here with the page they were trying to open.
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors((errs) => ({ ...errs, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const errors = validateLogin(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const { message, fields } = parseApiError(err);
      setFormError(message);
      setFieldErrors(fields);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="mt-1 text-sm text-slate-400">Welcome back to CyberConnect.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <Alert>{formError}</Alert>

        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        New here?{" "}
        <Link to="/register" className="text-emerald-400 hover:underline">
          Create an account
        </Link>
      </p>
    </section>
  );
}