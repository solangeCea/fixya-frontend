import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { Usuario } from "../types/auth";

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export function AuthProvider({
  children,
}: {
  children: React