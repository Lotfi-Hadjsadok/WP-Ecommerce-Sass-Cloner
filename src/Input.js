export default function Input({
  label,
  name,
  type = "text",
  suffix,
  register,
  errors,
  placeholder = "",
}) {
  return (
    <label
      htmlFor={name}
      style={{ position: "relative" }}
      className={
        "register-client-form-label" + (errors[name] ? " has-error" : "")
      }
    >
      {label}
      <input
        style={{
          height: 40,
          padding: "0 22px",
        }}
        type={type}
        placeholder={placeholder}
        id={name}
        {...register(name)}
        className="register-client-form-input"
      />

      {suffix && (
        <span
          style={{
            position: "absolute",
            backgroundColor: "var(--register-primary-color)",
            height: 40,
            display: "flex",
            alignItems: "center",
            bottom: errors[name]?.message ? 10 : 0,
            right: 0,
            padding: "0 10px",
            color: "white",
          }}
        >
          {suffix}
        </span>
      )}
      {errors[name]?.message && (
        <p className="error">{errors[name]?.message}</p>
      )}
    </label>
  );
}
