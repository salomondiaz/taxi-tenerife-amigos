import React, { useState } from "react";
import {
  User as UserIcon,
  Settings,
  CreditCard,
  MapPin,
  LogOut,
  Trash2,
  Camera,
  CheckCircle,
  AlertCircle,
  Mail,
  Smartphone,
  FileText,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Profile = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAppContext();
  const [activeSection, setActiveSection] = useState("personal");
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+34 612 345 678",
    language: "es",
    isVerified: false,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  const resetForm = () => {
    setProfileData({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+34 612 345 678",
      language: "es",
      isVerified: false,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  const handleDeleteAccount = () => {
    alert("Account deleted!");
    navigate("/");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <UserIcon size={24} className="text-tenerife-blue" />
          Mi Perfil
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 relative">
                  <span className="text-2xl font-semibold text-tenerife-blue">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <button 
                    className="absolute bottom-0 right-0 bg-tenerife-blue text-white rounded-full p-1"
                    onClick={() => setShowProfilePhotoModal(true)}
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{profileData.name}</h2>
                <p className="text-gray-500 text-sm">{profileData.email}</p>
                
                {profileData.isVerified ? (
                  <div className="flex items-center mt-2 text-emerald-600 text-sm">
                    <CheckCircle size={16} className="mr-1" />
                    Verificado
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-amber-600 border-amber-300 hover:bg-amber-50"
                    onClick={() => setShowVerificationModal(true)}
                  >
                    <AlertCircle size={16} className="mr-1" />
                    Verificar cuenta
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveSection("personal")}
                >
                  <User size={18} className="mr-2" />
                  Datos personales
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveSection("preferences")}
                >
                  <Settings size={18} className="mr-2" />
                  Preferencias
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveSection("payment")}
                >
                  <CreditCard size={18} className="mr-2" />
                  Métodos de pago
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setActiveSection("addresses")}
                >
                  <MapPin size={18} className="mr-2" />
                  Direcciones guardadas
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="w-full justify-start mt-4"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <LogOut size={18} className="mr-2" />
                  Cerrar sesión
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start text-gray-500"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={18} className="mr-2" />
                  Eliminar cuenta
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {activeSection === "personal" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b">Datos personales</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone || ""}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled
                        className="mt-1 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Para cambiar el email contacta con soporte</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="language">Idioma preferido</Label>
                      <Select
                        name="language"
                        value={profileData.language || "es"}
                        onValueChange={(value) => 
                          setProfileData({...profileData, language: value})
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-4 flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full sm:w-auto"
                        onClick={() => resetForm()}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        variant="default"
                        className="w-full sm:w-auto"
                      >
                        <Save size={18} className="mr-2" />
                        Guardar cambios
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeSection === "preferences" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b">Preferencias</h2>
                  <p>Aquí puedes configurar tus preferencias.</p>
                </div>
              )}

              {activeSection === "payment" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b">Métodos de pago</h2>
                  <p>Aquí puedes gestionar tus métodos de pago.</p>
                </div>
              )}

              {activeSection === "addresses" && (
                <div>
                  <h2 className="text-xl font-semibold mb-6 pb-4 border-b">Direcciones guardadas</h2>
                  <p>Aquí puedes gestionar tus direcciones guardadas.</p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Logout confirmation modal */}
      <AlertDialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres cerrar la sesión en este dispositivo?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete account confirmation modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cuenta</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente tu cuenta y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile verification modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verificar tu cuenta</DialogTitle>
            <DialogDescription>
              La verificación de cuenta mejora la seguridad y desbloquea todas las funciones.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 rounded-full bg-tenerife-blue/10 items-center justify-center text-tenerife-blue">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold">Verificar correo electrónico</h4>
                <p className="text-sm text-gray-500">Te enviaremos un enlace de verificación</p>
              </div>
              <Button variant="outline" size="sm">
                Enviar
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 rounded-full bg-tenerife-blue/10 items-center justify-center text-tenerife-blue">
                <Smartphone size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold">Verificar número de teléfono</h4>
                <p className="text-sm text-gray-500">Te enviaremos un código por SMS</p>
              </div>
              <Button variant="outline" size="sm">
                Verificar
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 rounded-full bg-tenerife-blue/10 items-center justify-center text-tenerife-blue">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold">Documento de identidad</h4>
                <p className="text-sm text-gray-500">Sube una foto de tu DNI o pasaporte</p>
              </div>
              <Button variant="outline" size="sm">
                Subir
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowVerificationModal(false)} 
              className="w-full sm:w-auto"
            >
              Lo haré más tarde
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Profile photo modal */}
      <Dialog open={showProfilePhotoModal} onOpenChange={setShowProfilePhotoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Actualizar foto de perfil</DialogTitle>
            <DialogDescription>
              Sube una nueva foto para tu perfil.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>TODO: Implement image upload</p>
          </div>
          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={() => setShowProfilePhotoModal(false)} 
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              onClick={() => setShowProfilePhotoModal(false)}
              className="w-full sm:w-auto"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Profile;
