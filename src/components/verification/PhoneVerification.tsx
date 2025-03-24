
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface PhoneVerificationProps {
  phone: string;
  onVerificationComplete: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ phone, onVerificationComplete }) => {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // Simulación de verificación
    setTimeout(() => {
      if (code.length === 6) {
        toast({
          title: "Teléfono verificado",
          description: "Tu número de teléfono ha sido verificado correctamente",
        });
        onVerificationComplete();
      } else {
        toast({
          title: "Código incorrecto",
          description: "Por favor verifica el código e intenta nuevamente",
          variant: "destructive",
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Verifica tu teléfono</h3>
        <p className="text-sm text-gray-600">
          Hemos enviado un código de verificación al {phone}
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
          render={({ slots }) => (
            <InputOTPGroup className="gap-2">
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>

      <Button 
        className="w-full" 
        onClick={handleVerify}
        disabled={code.length !== 6 || isVerifying}
      >
        {isVerifying ? "Verificando..." : "Verificar código"}
      </Button>
    </div>
  );
};

export default PhoneVerification;
