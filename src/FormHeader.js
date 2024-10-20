export default function FormHeader({ steps, currentStep }) {
  return (
    <div className="register-client-steps">
      <ul>
        {steps.map((step, index) => (
          <li
            key={index}
            className={
              "register-client-step-menu2" +
              (index + 1 === currentStep ? " active" : "")
            }
          >
            <span>{index + 1}</span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
