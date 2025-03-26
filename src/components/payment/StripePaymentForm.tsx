
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StripePaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    // En un entorno de producción, aquí se haría una llamada al backend para crear un PaymentIntent
    // Para este demo, simularemos un pago exitoso después de una pequeña espera
    
    try {
      // Simulamos una espera para el procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular el pago exitoso
      setIsProcessing(false);
      toast({
        title: "Pago procesado",
        description: `Se ha procesado tu pago de ${amount.toFixed(2)}€ correctamente`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setIsProcessing(false);
      setCardError("Error al procesar el pago. Inténtalo de nuevo.");
      console.error("Error de pago:", error);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Pagar con tarjeta</h3>
      
      <div className="border border-gray-300 rounded-md p-3">
        <CardElement options={cardElementOptions} />
      </div>
      
      {cardError && (
        <div className="text-red-500 text-sm">
          {cardError}
        </div>
      )}
      
      <div className="flex justify-between mt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="min-w-[120px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            `Pagar ${amount.toFixed(2)}€`
          )}
        </Button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
