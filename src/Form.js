import { useState, useRef, useEffect } from "react";
import Step1 from "./FormSteps/Step1";
import FormHeader from "./FormHeader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Step2 from "./FormSteps/Step2";
import Step3 from "./FormSteps/Step3";
import axios from "axios";
import QueryString from "qs";

export default function Form() {
  const [step, setStep] = useState(parseInt(RegisterScript.step) || 1);
  const [steps, setSteps] = useState([
    "Inscription",
    // "Validation de l'email",
    "Site Web",
  ]);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(null);

  const validationScheme = [
    yup.object({
      display_name: yup
        .string()
        .min(3, "Le nom complet doit contenir au moins 3 caractères"),
      email: yup
        .string()
        .email("L'email n'est pas valide")
        .required("L'email est requis"),
      password: yup
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
      phone: yup
        .string()
        .matches(
          /^(?:\+213\s?(\d{9})|0(\d{9})|213(\d{9}))$/,
          "Le numéro de téléphone n'est pas valide"
        ),
    }),
    // yup.object({
    //   email_validation: yup
    //     .string()
    //     .min(6, "Le code de validation doit contenir 6 caractères"),
    // }),
    yup.object({
      subdomain: yup
        .string()
        .min(3, "Le sous-domaine doit contenir au moins 3 caractères")
        .matches(
          /^(?!-)[a-z0-9-]{3,}(?<!-)$|^([a-z0-9]{3,})$/,
          "Le sous-domaine doit être valide."
        ),
      title: yup
        .string()
        .min(3, "Le titre doit contenir au moins 3 caractères"),
    }),
  ];
  const resolver = yupResolver(validationScheme[step - 1]);
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver,
    mode: "onBlur",
  });

  const handleStep1 = () => {
    axios
      .post(
        RegisterScript.ajax_url,
        QueryString.stringify({
          action: "register_user_as_subscriber",
          nonce: RegisterScript.nonce,
          email: watch("email"),
          display_name: watch("display_name"),
          phone: watch("phone"),
          password: watch("password"),
        })
      )
      .then((res) => {
        if (!res.data.success) {
          setError(res.data.data.message);
        } else {
          window.location.reload();
        }
      });
  };

  const handleStep2 = () => {};

  const handleStep3 = (data) => {
    axios
      .post(
        RegisterScript.ajax_url,
        QueryString.stringify({
          action: "create_subsite",
          nonce: RegisterScript.nonce,
          title: data.title,
          subdomain: data.subdomain,
        })
      )
      .then((res) => {
        if (!res.data.success) {
          setError(res.data.data);
        } else {
          setSuccess(res.data.data.message);
          window.location.replace(res.data.data.url);
        }
      });
  };

  const handleNext = async () => {
    setError(null);
    setSuccess(null);
    const valid = await trigger();
    if (valid) {
      step === 1 && handleStep1();
      // step === 2 && handleStep2();
    }
  };

  const OnSubmit = async (data) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    handleStep3(data);
  };

  return (
    <>
      <FormHeader steps={steps} currentStep={step} />
      <form>
        {step === 1 && <Step1 register={register} errors={errors} />}
        {/* {step === 2 && <Step2 register={register} errors={errors} />} */}
        {step === 2 && <Step3 register={register} errors={errors} />}

        {error && (
          <div style={{ marginBottom: 20, marginTop: -10 }} className="error">
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginBottom: 20, marginTop: -10 }} className="success">
            {success}
          </div>
        )}

        {steps.length > step && (
          <button
            className="is-style-button"
            type="button"
            onClick={handleNext}
          >
            Suivant
          </button>
        )}
        {steps.length == step && (
          <button
            type="button"
            disabled={loading}
            className="is-style-button"
            onClick={handleSubmit(OnSubmit)}
          >
            {loading ? <span className="loader"></span> : "Créer"}
          </button>
        )}
      </form>
    </>
  );
}
