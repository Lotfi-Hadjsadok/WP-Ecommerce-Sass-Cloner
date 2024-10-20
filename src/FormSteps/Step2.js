import Input from "../Input";

export default function Step2({ register, errors }) {
  return (
    <>
      <Input
        label="Votre code de validation"
        name="email_validation"
        register={register}
        errors={errors}
      />
    </>
  );
}
