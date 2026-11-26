import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, LogIn, Mail } from "lucide-react";
import useAuth from "../../hooks/useAuth.js";
import parseApiError from "../../utils/parseApiError.js";
import { validateLogin } from "../../utils/validators.js";
import Alert from "./Alert.jsx";
import FormField from "./FormField.jsx";
import PasswordField from "./PasswordField.jsx";

const REMEMBERED_EMAIL_KEY = "cyberconnect_remembered_email";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: localStorage.getItem(REMEMBERED_EMAIL_KEY) || "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(Boolean(localStorage.getItem(REMEMBERED_EMAIL_KEY)));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const errors = validateLogin(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, form.email.trim());
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
      setSuccessMessage("Login successful.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const { message, fields } = parseApiError(error);
      setFormError(message);
      setFieldErrors(fields);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setFormError("Password recovery is not connected yet.");
  };

  return (
    <div className="relative z-10 flex min-h-[440px] items-center bg-white px-7 py-9 sm:px-10 md:mr-[-28px] md:px-12">
      <div className="w-full">
        <h1 className="text-center text-xl font-semibold text-slate-800 underline decoration-slate-300 decoration-1 underline-offset-[10px]">
          Login Please
        </h1>

        <form onSubmit={handleSubmit} noValidate className="mt-9 space-y-5">
          <Alert type="error">{formError}</Alert>
          <Alert type="success">{successMessage}</Alert>

          <FormField
            id="email"
            label="Email or User ID"
            type="email"
            autoComplete="email"
            placeholder="Input your user ID or Email"
            leftIcon={Mail}
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />
          <PasswordField
            id="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Input your password"
            leftIcon={Lock}
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
          />

          <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-brand"
              />
              Remember me
            </label>
            <button type="button" onClick={handleForgotPassword} className="font-medium text-slate-500 underline underline-offset-2 hover:text-brand">
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mx-auto flex h-11 min-w-36 items-center justify-center gap-2 rounded-[4px] bg-brand px-7 text-sm font-bold text-white shadow-[0_8px_18px_rgba(22,119,255,0.24)] transition hover:bg-brand-dark focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={16} aria-hidden="true" />
            {submitting ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>
      </div>
    </div>
  );
}
