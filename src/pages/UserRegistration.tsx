
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, AlertTriangle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Esquema de validación para el formulario de registro
const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
  confirmPassword: z.string(),
  phone: z.string().min(9, {
    message: "Por favor, introduce un número de teléfono válido",
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
  dataProtectionAccepted: z.boolean().refine(val => val === true, {
    message: "Debes aceptar la política de protección de datos",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, testMode } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      termsAccepted: false,
      dataProtectionAccepted: false,
    },
  });

  const onSubmit = (data: UserFormValues) => {
    setIsSubmitting(true);
    
    // Simulación de envío del formulario
    setTimeout(() => {
      console.log("Datos del usuario:", data);
      
      // Crear un nuevo usuario
      const newUser = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        consentTimestamp: new Date(),
        isTestUser: testMode,
      };
      
      // Actualizar el contexto
      setUser(newUser);
      setIsLoggedIn(true);
      
      toast({
        title: "¡Registro completado!",
        description: "Tu cuenta ha sido creada con éxito.",
      });
      
      setIsSubmitting(false);
      navigate("/home");
    }, 1500);
  };

  return (
    <MainLayout hideNavigation>
      <div className="min-h-screen p-6 flex flex-col">
        <button
          onClick={() => navigate("/")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <div className="my-6">
          <h1 className="text-3xl font-bold text-gray-800">Crear una cuenta</h1>
          <p className="text-gray-600 mt-2">
            Regístrate para empezar a utilizar el servicio de taxi
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan García Martínez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de teléfono</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+34 600123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormDescription>
                      La contraseña debe tener al menos 8 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <User className="text-blue-500 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium text-blue-800">Protección de datos</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Sus datos personales serán tratados de acuerdo con nuestra política de privacidad y protegidos según la legislación vigente.
                    </p>
                  </div>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Acepto los términos y condiciones del servicio
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataProtectionAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Acepto la política de protección de datos
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-tenerife-blue hover:bg-tenerife-blue/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    Registrando...
                  </>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-tenerife-blue hover:underline"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </form>
        </Form>

        {testMode && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                El modo de prueba está activo. Este modo simula el comportamiento de la aplicación con datos ficticios.
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserRegistration;
