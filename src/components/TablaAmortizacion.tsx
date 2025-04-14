import React, { useState } from 'react';
import { FilaPeriodo } from '../types/types';

interface TablaAmortizacionProps {
  cuadroAmortizacion: FilaPeriodo[];
}

const TablaAmortizacion: React.FC<TablaAmortizacionProps> = ({ cuadroAmortizacion }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(12);
  
  // Calcular índices de paginación
  const indexUltimaFila = paginaActual * filasPorPagina;
  const indexPrimeraFila = indexUltimaFila - filasPorPagina;
  const filasActuales = cuadroAmortizacion.slice(indexPrimeraFila, indexUltimaFila);
  
  // Calcular el número total de páginas
  const totalPaginas = Math.ceil(cuadroAmortizacion.length / filasPorPagina);
  
  // Cambiar la página
  const cambiarPagina = (numeroPagina: number) => {
    if (numeroPagina > 0 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };
  
  // Cambiar la cantidad de filas por página
  const handleFilasPorPaginaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilasPorPagina(parseInt(e.target.value, 10));
    setPaginaActual(1); // Reiniciar a la primera página
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cuadro de Amortización</h2>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="filasPorPagina" className="text-sm text-gray-600">
            Filas por página:
          </label>
          <select
            id="filasPorPagina"
            value={filasPorPagina}
            onChange={handleFilasPorPaginaChange}
            className="p-1 border border-gray-300 rounded text-sm"
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
            <option value="96">96</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuota
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interés
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amortización
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pago Adicional
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capital Pendiente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filasActuales.map((fila) => (
              <tr key={fila.periodo}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {fila.periodo}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(fila.fecha).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {fila.cuota.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {fila.interes.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {fila.amortizacion.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {fila.pagoAdicional > 0 ? 
                    (fila.pagoAdicional.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €') : 
                    '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {fila.capitalPendiente.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{indexPrimeraFila + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(indexUltimaFila, cuadroAmortizacion.length)}
            </span>{' '}
            de <span className="font-medium">{cuadroAmortizacion.length}</span> filas
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className={`px-3 py-1 rounded ${
                paginaActual === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Anterior
            </button>
            
            {/* Mostrar números de página (lógica simplificada) */}
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              // Lógica para mostrar páginas alrededor de la página actual
              let pageNum;
              
              if (totalPaginas <= 5) {
                pageNum = i + 1;
              } else if (paginaActual <= 3) {
                pageNum = i + 1;
              } else if (paginaActual >= totalPaginas - 2) {
                pageNum = totalPaginas - 4 + i;
              } else {
                pageNum = paginaActual - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => cambiarPagina(pageNum)}
                  className={`px-3 py-1 rounded ${
                    paginaActual === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className={`px-3 py-1 rounded ${
                paginaActual === totalPaginas
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaAmortizacion;