import Input from "../Input";

export default function Step1({ register, errors }) {
  return (
    <div>
      <Input
        label="Nom complet"
        name="display_name"
        register={register}
        errors={errors}
      />
      <Input label="Email" name="email" register={register} errors={errors} />
      <Input
        label="Mot de pass"
        name="password"
        type="password"
        register={register}
        errors={errors}
      />
      <Input
        label="Numéro de téléphone"
        name="phone"
        register={register}
        errors={errors}
      />
    </div>
  );
}
