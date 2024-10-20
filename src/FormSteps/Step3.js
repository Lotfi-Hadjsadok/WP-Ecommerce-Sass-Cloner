import Input from "../Input";

export default function Step3({ register, errors }) {
  return (
    <>
      <Input label="Titre" name="title" register={register} errors={errors} />

      <Input
        label="Sous-domaine"
        name="subdomain"
        register={register}
        errors={errors}
        suffix={"." + window.location.hostname}
      />
    </>
  );
}
