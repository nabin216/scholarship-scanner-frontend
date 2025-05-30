'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '../app/Authentication/context/AuthContext';

interface ClientAuthProviderProps {
  children: ReactNode;
}

const ClientAuthProvider: React.FC<ClientAuthProviderProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ClientAuthProvider;
