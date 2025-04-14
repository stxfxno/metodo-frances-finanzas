import React from 'react';
import { ResultadoAmortizacion } from '../types/types';
import { calcularFechaVencimiento, calcularTAE } from '../utils/calculadoraAmortizacion';

interface ResumenPrestamoProps {
  resultado: ResultadoAmortizacion;
}

const ResumenPrestamo: React.FC<ResumenPrestamoProps> = ({ resultado }) => {
  const { parametros, totales } = resultado;
  
  // Calculamos la TAE
  const tae = calcularTAE(
    parametros.tasaInteresAnual,
    parametros.frecuenciaPago
  );
  
  // Calculamos la fecha de vencimiento
  const fechaVencimiento = calcularFechaVencimiento(
    resultado.cuadroAmortizacion[0].fecha, // Usamos la fecha del primer período como fecha de inicio
    parametros.plazoAnios,
    parametros.frecuenciaPago
  );
  
  // Formateamos la fecha
  const formatoFecha = (fechaStr: string) => {
    return new Date(fechaStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Resumen del Préstamo</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-medium text-gray-700 mb-2">Datos Básicos</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Capital:</span>
              <span className="font-medium">{parametros.capital.toLocaleString('es-ES')} €</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Tasa Interés Anual:</span>
              <span className="font-medium">{parametros.tasaInteresAnual.toFixed(2)}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">TAE:</span>
              <span className="font-medium">{tae.toFixed(2)}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Plazo:</span>
              <span className="font-medium">{parametros.plazoAnios} años</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Frecuencia:</span>
              <span className="font-medium">
                {parametros.frecuenciaPago === 12 ? "Mensual" :
                 parametros.frecuenciaPago === 4 ? "Trimestral" :
                 parametros.frecuenciaPago === 2 ? "Semestral" : "Anual"}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Total Períodos:</span>
              <span className="font-medium">{parametros.numPeriodos}</span>
            </li>
          </ul>
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-medium text-gray-700 mb-2">Resultados</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Cuota Periódica:</span>
              <span className="font-medium">{parametros.cuotaPeriodica.toLocaleString('es-ES')} €</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Fecha Inicio:</span>
              <span className="font-medium">{formatoFecha(resultado.cuadroAmortizacion[0].fecha)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Fecha Vencimiento:</span>
              <span className="font-medium">{formatoFecha(fechaVencimiento)}</span>
            </li>
            {totales && (
              <>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Intereses:</span>
                  <span className="font-medium">{totales.totalInteres.toLocaleString('es-ES')} €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Pagado:</span>
                  <span className="font-medium">{totales.totalPagado.toLocaleString('es-ES')} €</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Coste Financiero:</span>
                  <span className="font-medium">
                    {((totales.totalPagado / parametros.capital - 1) * 100).toFixed(2)}%
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      {/* Información adicional sobre el método francés */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">Método Francés</h3>
        <p className="text-sm text-gray-600">
          El método francés de amortización mantiene una cuota constante durante todo el préstamo. 
          Al principio, la mayor parte de la cuota se destina al pago de intereses, 
          mientras que hacia el final, la mayoría se destina a amortizar el capital.
        </p>
      </div>
    </div>
  );
};

export default ResumenPrestamo;