import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import FormInput from "@/components/ui/FormInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, Lock, Check, FileText } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, testMode } = useAppContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptDataPolicy: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
    acceptDataPolicy?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
    } = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }

    if (formData.phone && !/^\+?[0-9]{9,15}$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {
      password?: string;
      confirmPassword?: string;
      acceptTerms?: string;
      acceptDataPolicy?: string;
    } = {};

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos y condiciones";
    }

    if (!formData.acceptDataPolicy) {
      newErrors.acceptDataPolicy = "Debes aceptar la política de datos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step === 1) {
      handleNextStep();
      return;
    }

    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUser({
        id: "new-user-1",
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        consentTimestamp: new Date(),
        isTestUser: testMode,
      });

      setIsLoggedIn(true);

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
      });

      navigate("/home");
    } catch (error) {
      toast({
        title: "Error en el registro",
        description: "No se pudo completar el registro. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout hideNavigation className="bg-gray-50">
      <div className="min-h-screen p-6 flex flex-col">
        <button
          onClick={() => (step === 1 ? navigate("/") : handlePrevStep())}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label={step === 1 ? "Volver a la página de inicio" : "Volver al paso anterior"}
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>{step === 1 ? "Volver" : "Atrás"}</span>
        </button>

        <div className="my-8">
          <h1 className="text-3xl font-bold text-gray-800">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">
            {step === 1
              ? "Ingresa tus datos personales"
              : "Configura tu cuenta y privacidad"}
          </p>
        </div>

        <div className="flex mb-8">
          <div className="flex-1">
            <div
              className={`h-2 rounded-l-full ${
                step >= 1 ? "bg-tenerife-blue" : "bg-gray-200"
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <div
              className={`h-2 rounded-r-full ${
                step >= 2 ? "bg-tenerife-blue" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {step === 1 ? (
            <>
              <FormInput
                id="name"
                name="name"
                type="text"
                label="Nombre completo"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                autoComplete="name"
                aria-describedby={errors.name ? "name-error" : undefined}
                icon={<User size={20} className="text-gray-400" />}
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Correo Electrónico"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                autoComplete="email"
                aria-describedby={errors.email ? "email-error" : undefined}
                icon={<Mail size={20} className="text-gray-400" />}
              />

              <FormInput
                id="phone"
                name="phone"
                type="tel"
                label="Teléfono (opcional)"
                placeholder="+34 612 345 678"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                autoComplete="tel"
                aria-describedby={errors.phone ? "phone-error" : undefined}
                icon={<Phone size={20} className="text-gray-400" />}
              />

              <div className="mt-6 py-4">
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={handleNextStep}
                >
                  Continuar
                </Button>
              </div>
            </>
          ) : (
            <>
              <FormInput
                id="password"
                name="password"
                type="password"
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                autoComplete="new-password"
                aria-describedby={errors.password ? "password-error" : undefined}
                icon={<Lock size={20} className="text-gray-400" />}
              />

              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirmar Contraseña"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
                icon={<Lock size={20} className="text-gray-400" />}
              />

              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-tenerife-blue focus:ring-tenerife-blue"
                      aria-describedby={
                        errors.acceptTerms ? "acceptTerms-error" : undefined
                      }
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="acceptTerms"
                      className="font-medium text-gray-700"
                    >
                      Acepto los{" "}
                      <a
                        href="#"
                        className="text-tenerife-blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        términos y condiciones
                      </a>
                    </label>
                    {errors.acceptTerms && (
                      <p
                        id="acceptTerms-error"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptDataPolicy"
                      name="acceptDataPolicy"
                      type="checkbox"
                      checked={formData.acceptDataPolicy}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-tenerife-blue focus:ring-tenerife-blue"
                      aria-describedby={
                        errors.acceptDataPolicy
                          ? "acceptDataPolicy-error"
                          : undefined
                      }
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="acceptDataPolicy"
                      className="font-medium text-gray-700"
                    >
                      Acepto la{" "}
                      <a
                        href="#"
                        className="text-tenerife-blue hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        política de privacidad
                      </a>{" "}
                      y el tratamiento de mis datos
                    </label>
                    {errors.acceptDataPolicy && (
                      <p
                        id="acceptDataPolicy-error"
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.acceptDataPolicy}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 py-4">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Cargando..." : "Crear Cuenta"}
                </Button>
              </div>
            </>
          )}

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-tenerife-blue hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 text-center">
            Al registrarte, aceptas nuestra política de privacidad y términos de uso.
            Tus datos serán tratados de acuerdo al RGPD.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
