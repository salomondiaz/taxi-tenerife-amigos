
import React from "react";
import { User } from "@/integrations/supabase/types";

interface UserGreetingProps {
  user: User | null;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ user }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Hola, {user?.name?.split(' ')[0] || 'Usuario'}</h1>
        <p className="text-white/80 text-sm mt-1">¿A dónde quieres ir hoy?</p>
      </div>
      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
        {user?.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt="Foto de perfil" 
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-white font-medium text-lg">
            {user?.name?.charAt(0) || 'U'}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserGreeting;
