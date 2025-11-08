"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

type RoleConfig = {
  admin?: string;
  protectoras: Record<string, { nombre: string }>;
  donantes: Record<string, { nombre: string }>;
};

const STORAGE_KEY = "donationSystemRoles";

export const RoleConfig = () => {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [adminAddress, setAdminAddress] = useState("");
  const [protectoraAddress, setProtectoraAddress] = useState("");
  const [protectoraNombre, setProtectoraNombre] = useState("");
  const [config, setConfig] = useState<RoleConfig>({ protectoras: {}, donantes: {} });
  const [donanteAddress, setDonanteAddress] = useState("");
  const [donanteNombre, setDonanteNombre] = useState("");

  // Cargar configuración al montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RoleConfig;
        setConfig({
          admin: parsed.admin,
          protectoras: parsed.protectoras || {},
          donantes: parsed.donantes || {},
        });
        setAdminAddress(parsed.admin || "");
      } catch (e) {
        console.error("Error al cargar configuración:", e);
      }
    } else {
      // Configuración inicial por defecto
      const adminAddr: string = "0x16b67e7cdc48Ea1E9aCB44965f26dDc6a1107c65".toLowerCase();
      const protectoraAddr: string = "0x925d17c8Ebb340F04dDA7545Ad6F193b353B29f3".toLowerCase();
      const protectorasObj: Record<string, { nombre: string }> = {};
      const donantesObj: Record<string, { nombre: string }> = {};
      protectorasObj[protectoraAddr] = { nombre: "Protectora" };
      donantesObj[adminAddr] = { nombre: "Donante Demo" };
      
      const defaultConfig: RoleConfig = {
        admin: adminAddr,
        protectoras: protectorasObj,
        donantes: donantesObj,
      };
      setConfig(defaultConfig);
      setAdminAddress(adminAddr);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
    }
  }, []);

  const handleSetAdmin = () => {
    if (!adminAddress) {
      alert("Por favor ingresa una dirección");
      return;
    }
    const newConfig: RoleConfig = {
      ...config,
      admin: adminAddress.toLowerCase(),
    };
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setAdminAddress("");
    alert("Admin configurado exitosamente");
  };

  const handleAddProtectora = () => {
    if (!protectoraAddress || !protectoraNombre) {
      alert("Por favor completa todos los campos");
      return;
    }
    const newConfig: RoleConfig = {
      ...config,
      protectoras: {
        ...config.protectoras,
        [protectoraAddress.toLowerCase()]: { nombre: protectoraNombre },
      },
    };
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setProtectoraAddress("");
    setProtectoraNombre("");
    alert("Protectora agregada exitosamente");
  };

  const handleAddDonante = () => {
    if (!donanteAddress || !donanteNombre) {
      alert("Por favor completa todos los campos");
      return;
    }
    const newConfig: RoleConfig = {
      ...config,
      donantes: {
        ...config.donantes,
        [donanteAddress.toLowerCase()]: { nombre: donanteNombre },
      },
    };
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setDonanteAddress("");
    setDonanteNombre("");
    alert("Donante agregado exitosamente");
  };

  const handleRemoveProtectora = (addr: string) => {
    const newProtectoras = { ...config.protectoras };
    delete newProtectoras[addr];
    const newConfig: RoleConfig = {
      ...config,
      protectoras: newProtectoras,
    };
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    alert("Protectora eliminada");
  };

  const handleRemoveDonante = (addr: string) => {
    const newDonantes = { ...config.donantes };
    delete newDonantes[addr];
    const newConfig: RoleConfig = {
      ...config,
      donantes: newDonantes,
    };
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    alert("Donante eliminado");
  };

  const handleClearAll = () => {
    if (confirm("¿Estás seguro de que quieres eliminar toda la configuración?")) {
      localStorage.removeItem(STORAGE_KEY);
      setConfig({ protectoras: {}, donantes: {} });
      setAdminAddress("");
      setDonanteAddress("");
      setDonanteNombre("");
      alert("Configuración eliminada");
    }
  };

  const sectionClass = "bg-blue-50 border-2 border-blue-300 shadow-lg p-4 mb-4 text-gray-900 rounded-lg";
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900";
  const buttonClass =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-500 text-white hover:bg-blue-600";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        title="Configurar Roles"
      >
        ⚙️ {isOpen ? "✕" : "Roles"}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 bg-white border-2 border-blue-300 shadow-xl rounded-lg p-4 max-h-[80vh] overflow-y-auto">
          <div className={sectionClass}>
            <h3 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
              ⚙️ Configuración de Roles
            </h3>

            {/* Configurar Admin */}
            <div className="mb-4 pb-4 border-b border-blue-300">
              <h4 className="font-semibold mb-2 text-gray-800">👑 Administrador</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={adminAddress}
                  onChange={e => setAdminAddress(e.target.value)}
                  placeholder="0x..."
                  className={inputClass}
                />
                <button onClick={handleSetAdmin} className={buttonClass + " w-full"}>
                  Establecer como Admin
                </button>
                {config.admin && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-300">
                    <p className="text-sm text-gray-700">
                      <strong>Admin actual:</strong>
                    </p>
                    <p className="text-xs font-mono text-gray-600 break-all">{config.admin}</p>
                    {address?.toLowerCase() === config.admin.toLowerCase() && (
                      <span className="text-xs text-green-600 font-semibold">← Esta es tu cuenta</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Agregar Protectora */}
            <div className="mb-4 pb-4 border-b border-blue-300">
              <h4 className="font-semibold mb-2 text-gray-800">🐾 Agregar Protectora</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={protectoraAddress}
                  onChange={e => setProtectoraAddress(e.target.value)}
                  placeholder="Dirección (0x...)"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={protectoraNombre}
                  onChange={e => setProtectoraNombre(e.target.value)}
                  placeholder="Nombre de la protectora"
                  className={inputClass}
                />
                <button onClick={handleAddProtectora} className={buttonClass + " w-full"}>
                  Agregar Protectora
                </button>
              </div>
            </div>

            {/* Agregar Donante */}
            <div className="mb-4 pb-4 border-b border-blue-300">
              <h4 className="font-semibold mb-2 text-gray-800">🤝 Agregar Donante</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={donanteAddress}
                  onChange={e => setDonanteAddress(e.target.value)}
                  placeholder="Dirección (0x...)"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={donanteNombre}
                  onChange={e => setDonanteNombre(e.target.value)}
                  placeholder="Nombre del donante"
                  className={inputClass}
                />
                <button onClick={handleAddDonante} className={buttonClass + " w-full"}>
                  Agregar Donante
                </button>
              </div>
            </div>

            {/* Lista de Protectoras */}
            {Object.keys(config.protectoras).length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-800">Protectoras Configuradas:</h4>
                <div className="space-y-2">
                  {Object.entries(config.protectoras).map(([addr, info]) => (
                    <div key={addr} className="p-2 bg-white rounded border border-gray-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{info.nombre}</p>
                          <p className="text-xs font-mono text-gray-600 break-all">{addr}</p>
                          {address?.toLowerCase() === addr.toLowerCase() && (
                            <span className="text-xs text-green-600 font-semibold">← Esta es tu cuenta</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveProtectora(addr)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de Donantes */}
            {Object.keys(config.donantes).length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-800">Donantes Configurados:</h4>
                <div className="space-y-2">
                  {Object.entries(config.donantes).map(([addr, info]) => (
                    <div key={addr} className="p-2 bg-white rounded border border-gray-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{info.nombre}</p>
                          <p className="text-xs font-mono text-gray-600 break-all">{addr}</p>
                          {address?.toLowerCase() === addr.toLowerCase() && (
                            <span className="text-xs text-green-600 font-semibold">← Esta es tu cuenta</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveDonante(addr)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Limpiar todo */}
            <div className="pt-2 border-t border-blue-300">
              <button onClick={handleClearAll} className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold">
                🗑️ Limpiar Configuración
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 p-2 bg-yellow-50 border border-yellow-300 rounded text-xs text-gray-700">
              <p className="font-semibold mb-1">ℹ️ Instrucciones:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Configura el admin con la dirección de la cuenta admin</li>
                <li>Agrega protectoras y donantes con sus direcciones y nombres</li>
                <li>Cambia de cuenta en tu wallet para ver cada panel</li>
                <li>La configuración se guarda en localStorage</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Función helper para obtener la configuración
export const getRoleConfig = (): RoleConfig => {
  // Check if we're on the client side
  if (typeof window === "undefined") {
    return { protectoras: {}, donantes: {} };
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<RoleConfig>;
      return {
        admin: parsed.admin,
        protectoras: parsed.protectoras || {},
        donantes: parsed.donantes || {},
      };
    } catch {
      return { protectoras: {}, donantes: {} };
    }
  }
  return { protectoras: {}, donantes: {} };
};

