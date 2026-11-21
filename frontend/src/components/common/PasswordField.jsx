import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import FormField from "./FormField.jsx";

export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      }
    />
  );
}