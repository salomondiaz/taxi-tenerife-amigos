
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear distancia en km o metros
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

// Formatear tiempo relativo (hace X días)
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

// Formatear fecha en formato local
export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
}

// Formatear dinero como euros
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(amount);
}

// Validar número de tarjeta
export function validateCardNumber(cardNumber: string): boolean {
  // Eliminar espacios y guiones
  const number = cardNumber.replace(/[\s-]/g, '');
  
  // Comprobar longitud y que sean solo dígitos
  if (!/^\d{13,19}$/.test(number)) {
    return false;
  }
  
  // Algoritmo de Luhn
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

// Validar fecha de expiración (MM/YY)
export function validateExpiryDate(expiry: string): boolean {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return false;
  }
  
  const [month, year] = expiry.split('/');
  const expiryMonth = parseInt(month, 10);
  const expiryYear = parseInt(`20${year}`, 10); // Convertir a año completo
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth devuelve 0-11
  const currentYear = now.getFullYear();
  
  // Validar que el mes esté entre 1 y 12
  if (expiryMonth < 1 || expiryMonth > 12) {
    return false;
  }
  
  // Comprobar que la fecha no ha expirado
  return (expiryYear > currentYear) || 
         (expiryYear === currentYear && expiryMonth >= currentMonth);
}

// Validar CVV (3 o 4 dígitos)
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}
