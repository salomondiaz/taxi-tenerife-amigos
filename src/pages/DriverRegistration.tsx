
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft, CarFront, FileCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Esquema de validación para el formulario de registro de conductor
const driverFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z.string().min(9, "Ingresa un número de teléfono válido"),
  licenseNumber: z.string().min(5, "Número de licencia inválido"),
  licenseExpiry: z.string().min(1, "Fecha de vencimiento requerida"),
  idNumber: z.string().min(9, "DNI/NIE inválido"),
  vehicleMake: z.string().min(1, "Marca del vehículo requerida"),
  vehicleModel: z.string().min(1, "Modelo del vehículo requerido"),
  vehiclePlate: z.string().min(7, "Matrícula inválida"),
  vehicleYear: z.string().regex(/^\d{4}$/, "Año inválido"),
  vehicleColor: z.string().min(1, "Color del vehículo requerido"),
  address: z.string().min(5, "Dirección inválida"),
  city: z.string().min(2, "Ciudad inválida"),
  postalCode: z.string().regex(/^\d{5}$/, "Código postal debe tener 5 dígitos"),
  bankName: z.string().min(2, "Nombre del banco requerido"),
  accountNumber: z.string().min(10, "Número de cuenta inválido"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
  dataProtectionAccepted: z.boolean().refine(val => val === true, {
    message: "Debes aceptar la política de protección de datos",
  }),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

const DriverRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { testMode } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      licenseNumber: "",
      licenseExpiry: "",
      idNumber: "",
      vehicleMake: "",
      vehicleModel: "",
      vehiclePlate: "",
      vehicleYear: "",
      vehicleColor: "",
      address: "",
      city: "",
      postalCode: "",
      bankName: "",
      accountNumber: "",
      termsAccepted: false,
      dataProtectionAccepted: false,
    },
  });

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = Array.from(files).map(file => file.name);
      setUploadedDocuments([...uploadedDocuments, ...newDocs]);
      
      toast({
        title: "Documento subido",
        description: "El documento se ha subido correctamente",
      });
    }
  };

  const nextStep = () => {
    const fieldsToValidate: Record<number, (keyof DriverFormValues)[]> = {
      1: ["name", "email", "phone", "idNumber", "address", "city", "postalCode"],
      2: ["licenseNumber", "licenseExpiry"],
      3: ["vehicleMake", "vehicleModel", "vehiclePlate", "vehicleYear", "vehicleColor"],
    };

    const currentFields = fieldsToValidate[currentStep as keyof typeof fieldsToValidate] || [];
    
    let isValid = true;
    for (const field of currentFields) {
      form.trigger(field).then(result => {
        if (!result) isValid = false;
      });
    }

    if (currentStep === 4) {
      if (!form.getValues("termsAccepted") || !form.getValues("dataProtectionAccepted")) {
        toast({
          title: "Error de validación",
          description: "Debes aceptar los términos y la política de protección de datos",
          variant: "destructive",
        });
        return;
      }
      
      if (uploadedDocuments.length < 2) {
        toast({
          title: "Documentos requeridos",
          description: "Debes subir al menos la licencia de conducir y el permiso de circulación",
          variant: "destructive",
        });
        return;
      }
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = (data: DriverFormValues) => {
    setIsSubmitting(true);
    
    // Simulación de envío del formulario
    setTimeout(() => {
      console.log('Datos del conductor:', data);
      console.log('Documentos subidos:', uploadedDocuments);
      
      toast({
        title: "Registro enviado",
        description: "Tu solicitud para ser conductor ha sido enviada. Te contactaremos pronto.",
      });
      
      setIsSubmitting(false);
      navigate("/home");
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Información personal</h2>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan García Martínez" {...field} />
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
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI/NIE</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle, número, piso..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Santa Cruz de Tenerife" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal</FormLabel>
                    <FormControl>
                      <Input placeholder="38001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Licencia de conducir</h2>
            
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de licencia</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de licencia profesional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="licenseExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de vencimiento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="border border-dashed border-gray-300 rounded-lg p-4">
              <FormLabel htmlFor="license-document" className="block mb-2">
                Subir imagen de licencia
              </FormLabel>
              <Input
                id="license-document"
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocumentUpload}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Formatos aceptados: JPG, PNG, PDF. Máximo 5MB.</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <AlertTriangle className="text-blue-500 mr-2 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-medium text-blue-800">Requisitos legales</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Para trabajar como conductor profesional en España, debes contar con una licencia de conducir profesional válida y cumplir con la normativa de transporte de pasajeros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Información del vehículo</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleMake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Prius" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehiclePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matrícula</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 1234ABC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vehicleYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 2020" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="vehicleColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Blanco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="border border-dashed border-gray-300 rounded-lg p-4">
              <FormLabel htmlFor="vehicle-document" className="block mb-2">
                Subir permiso de circulación
              </FormLabel>
              <Input
                id="vehicle-document"
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocumentUpload}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Formatos aceptados: JPG, PNG, PDF. Máximo 5MB.</p>
            </div>
            
            <div className="border border-dashed border-gray-300 rounded-lg p-4">
              <FormLabel htmlFor="insurance-document" className="block mb-2">
                Subir seguro del vehículo
              </FormLabel>
              <Input
                id="insurance-document"
                type="file"
                accept="image/*,.pdf"
                onChange={handleDocumentUpload}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Formatos aceptados: JPG, PNG, PDF. Máximo 5MB.</p>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Información bancaria y términos</h2>
            
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del banco</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: CaixaBank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IBAN</FormLabel>
                  <FormControl>
                    <Input placeholder="ES1234567890123456789012" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Documentos subidos</h3>
              {uploadedDocuments.length > 0 ? (
                <ul className="space-y-2">
                  {uploadedDocuments.map((doc, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <FileCheck size={16} className="text-green-500 mr-2" />
                      {doc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No has subido ningún documento</p>
              )}
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Comisión de la plataforma</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Por cada viaje completado, la plataforma retendrá un 15% del importe total como comisión por el servicio.
                </p>
                
                <h3 className="font-medium mb-2">Requisitos de servicio</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mb-4">
                  <li>Mantener el vehículo en condiciones óptimas de limpieza y seguridad</li>
                  <li>Ofrecer un trato amable y profesional a los pasajeros</li>
                  <li>Respetar las normas de tráfico y la legislación de transporte vigente</li>
                  <li>Comunicar cualquier incidencia a través de la plataforma</li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="terms"
                  checked={form.getValues("termsAccepted")}
                  onCheckedChange={(checked) => form.setValue("termsAccepted", checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Acepto los términos y condiciones del servicio
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="data-protection"
                  checked={form.getValues("dataProtectionAccepted")}
                  onCheckedChange={(checked) => form.setValue("dataProtectionAccepted", checked)}
                />
                <Label htmlFor="data-protection" className="text-sm">
                  Acepto la política de protección de datos
                </Label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen p-6 pb-24">
        <button
          onClick={() => navigate("/home")}
          className="text-tenerife-blue flex items-center mb-6"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver</span>
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold">Registro de conductor</h1>
          <p className="text-gray-600">Completa el formulario para unirte como conductor</p>
        </div>

        {/* Pasos del formulario */}
        <div className="mb-8">
          <div className="flex justify-between">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > index + 1
                      ? "bg-green-500 text-white"
                      : currentStep === index + 1
                      ? "bg-tenerife-blue text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > index + 1 ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-1">
                  {index === 0
                    ? "Personal"
                    : index === 1
                    ? "Licencia"
                    : index === 2
                    ? "Vehículo"
                    : "Términos"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-tenerife-blue hover:bg-tenerife-blue/90"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-tenerife-blue hover:bg-tenerife-blue/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar solicitud"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        {testMode && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle size={20} className="text-yellow-500 mr-2 mt-1" />
              <div>
                <h3 className="font-medium">Modo de prueba activado</h3>
                <p className="text-sm mt-1">
                  Estás en modo de prueba. Los datos enviados no serán procesados realmente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DriverRegistration;
