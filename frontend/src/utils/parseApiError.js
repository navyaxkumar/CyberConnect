
export default function parseApiError(err) {
  if (!err?.response) {
    return { message: "Cannot reach the server. Please try again.", fields: {} };
  }

  const { status, data } = err.response;
  const fields = {};

  if (Array.isArray(data?.errors)) {
    for (const item of data.errors) {
      if (item.field && !fields[item.field]) fields[item.field] = item.message;
    }
  }

  let message = data?.message || "Something went wrong. Please try again.";
  if (status === 400 && Object.keys(fields).length > 0) {
    message = "Please fix the highlighted fields.";
  }

  return { message, fields };
}