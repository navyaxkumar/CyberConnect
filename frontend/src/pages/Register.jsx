import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import parseApiError from "../utils/parseApiError.js";
import { validateRegister } from "../utils/validators.js";
import Alert from "../components/common/Alert.jsx";
import FormField from "../components/common/FormField.jsx";
import PasswordField from "../components/common/PasswordField.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
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

    const errors = validateRegister(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/", { replace: true });
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
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-slate-400">Join the CyberConnect community.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <Alert>{formError}</Alert>

        <FormField
          id="username"
          label="Username"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          error={fieldErrors.username}
          hint="3-30 characters: letters, numbers and underscores"
        />
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
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          hint="8-72 characters"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-400 hover:underline">
          Log in
        </Link>
      </p>
    </section>
  );
}