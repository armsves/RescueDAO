"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

// Types
export type Animal = {
  id: string;
  nombre: string;
  tipo: "perro" | "gato" | "conejo" | "otro";
  edad: string;
  descripcion: string;
  estado: "disponible" | "adoptado" | "en-tratamiento";
  imagenCID?: string;
};

export type Protectora = {
  address: string;
  nombre: string;
  descripcion?: string;
  balance?: string;
};

export type Donacion = {
  id: string;
  donante: string;
  cantidad: string;
  protectora: string;
  fecha: Date;
  tipo: "one-time" | "recurring";
};

// Storage key
const STORAGE_KEY = "donationSystemData";

// Hook for managing the donation system
export const useDonationSystem = () => {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [listaProtectoras, setListaProtectoras] = useState<Protectora[]>([]);
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [poolBalance, setPoolBalance] = useState("0");

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setListaProtectoras(parsed.protectoras || []);
        setAnimales(parsed.animales || []);
        setDonaciones(parsed.donaciones || []);
        setPoolBalance(parsed.poolBalance || "0");
      } catch (e) {
        console.error("Error loading donation system data:", e);
      }
    }
  };

  const saveData = (data: {
    protectoras?: Protectora[];
    animales?: Animal[];
    donaciones?: Donacion[];
    poolBalance?: string;
  }) => {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const updated = {
      protectoras: data.protectoras || current.protectoras || [],
      animales: data.animales || current.animales || [],
      donaciones: data.donaciones || current.donaciones || [],
      poolBalance: data.poolBalance || current.poolBalance || "0",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Add a shelter (Admin function)
  const agregarProtectora = async (nombre: string, direccion: string, descripcion: string = "") => {
    setIsProcessing(true);
    setMessage("");
    
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newProtectora: Protectora = {
        address: direccion.toLowerCase(),
        nombre,
        descripcion,
        balance: "0",
      };
      
      const updated = [...listaProtectoras, newProtectora];
      setListaProtectoras(updated);
      saveData({ protectoras: updated, animales, donaciones, poolBalance });
      
      setMessage(`✅ Shelter "${nombre}" added successfully!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Make a one-time donation
  const donar = async (cantidad: string, protectoraAddress: string) => {
    setIsProcessing(true);
    setMessage("");
    
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDonacion: Donacion = {
        id: Date.now().toString(),
        donante: address || "unknown",
        cantidad,
        protectora: protectoraAddress.toLowerCase(),
        fecha: new Date(),
        tipo: "one-time",
      };
      
      const updatedDonaciones = [...donaciones, newDonacion];
      
      // Update shelter balance
      const updatedProtectoras = listaProtectoras.map(p => {
        if (p.address.toLowerCase() === protectoraAddress.toLowerCase()) {
          const currentBalance = parseFloat(p.balance || "0");
          const newBalance = currentBalance + parseFloat(cantidad);
          return { ...p, balance: newBalance.toString() };
        }
        return p;
      });
      
      // Update pool balance
      const newPoolBalance = (parseFloat(poolBalance) + parseFloat(cantidad)).toString();
      
      setDonaciones(updatedDonaciones);
      setListaProtectoras(updatedProtectoras);
      setPoolBalance(newPoolBalance);
      saveData({
        protectoras: updatedProtectoras,
        animales,
        donaciones: updatedDonaciones,
        poolBalance: newPoolBalance,
      });
      
      setMessage(`✅ Donation of ${cantidad} USDC sent successfully!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Set up recurring donation
  const donarRecurrente = async (
    cantidadPorPeriodo: string,
    frecuencia: "daily" | "weekly" | "monthly",
    numeroVeces: number,
    protectoraAddress: string,
  ) => {
    setIsProcessing(true);
    setMessage("");
    
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDonacion: Donacion = {
        id: Date.now().toString(),
        donante: address || "unknown",
        cantidad: cantidadPorPeriodo,
        protectora: protectoraAddress.toLowerCase(),
        fecha: new Date(),
        tipo: "recurring",
      };
      
      const updatedDonaciones = [...donaciones, newDonacion];
      setDonaciones(updatedDonaciones);
      saveData({ protectoras: listaProtectoras, animales, donaciones: updatedDonaciones, poolBalance });
      
      setMessage(
        `✅ Recurring donation configured: ${cantidadPorPeriodo} USDC ${frecuencia} for ${numeroVeces} times!`
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Add an animal (Shelter function)
  const agregarAnimal = async (animal: Omit<Animal, "id">) => {
    setIsProcessing(true);
    setMessage("");
    
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAnimal: Animal = {
        ...animal,
        id: Date.now().toString(),
      };
      
      const updated = [...animales, newAnimal];
      setAnimales(updated);
      saveData({ protectoras: listaProtectoras, animales: updated, donaciones, poolBalance });
      
      setMessage(`✅ Pet "${animal.nombre}" added successfully!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Update animal status
  const actualizarEstadoAnimal = async (animalId: string, nuevoEstado: Animal["estado"]) => {
    setIsProcessing(true);
    setMessage("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updated = animales.map(a => (a.id === animalId ? { ...a, estado: nuevoEstado } : a));
      setAnimales(updated);
      saveData({ protectoras: listaProtectoras, animales: updated, donaciones, poolBalance });
      
      setMessage(`✅ Pet status updated to "${nuevoEstado}"!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Withdraw funds (Shelter function)
  const retirarFondos = async (cantidad: string) => {
    setIsProcessing(true);
    setMessage("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update shelter balance
      const updatedProtectoras = listaProtectoras.map(p => {
        if (p.address.toLowerCase() === address?.toLowerCase()) {
          const currentBalance = parseFloat(p.balance || "0");
          const withdrawAmount = parseFloat(cantidad);
          
          if (currentBalance < withdrawAmount) {
            throw new Error("Insufficient balance");
          }
          
          return { ...p, balance: (currentBalance - withdrawAmount).toString() };
        }
        return p;
      });
      
      setListaProtectoras(updatedProtectoras);
      saveData({ protectoras: updatedProtectoras, animales, donaciones, poolBalance });
      
      setMessage(`✅ Successfully withdrew ${cantidad} USDC!`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Refetch pool data
  const refetchPool = () => {
    loadData();
  };

  // Get shelter balance for current address
  const getShelterBalance = (): string => {
    const shelter = listaProtectoras.find(p => p.address.toLowerCase() === address?.toLowerCase());
    return shelter?.balance || "0";
  };

  // Get donations for current address (as donor)
  const getMisDonaciones = (): Donacion[] => {
    return donaciones.filter(d => d.donante.toLowerCase() === address?.toLowerCase());
  };

  // Get donations received by current shelter
  const getDonacionesRecibidas = (): Donacion[] => {
    return donaciones.filter(d => d.protectora.toLowerCase() === address?.toLowerCase());
  };

  return {
    // Data
    listaProtectoras,
    animales,
    donaciones,
    poolBalance,
    
    // Status
    isProcessing,
    message,
    
    // Admin functions
    agregarProtectora,
    
    // Donor functions
    donar,
    donarRecurrente,
    getMisDonaciones,
    
    // Shelter functions
    agregarAnimal,
    actualizarEstadoAnimal,
    retirarFondos,
    getShelterBalance,
    getDonacionesRecibidas,
    
    // Utilities
    refetchPool,
  };
};
