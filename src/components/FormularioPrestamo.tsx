import React, { useState } from 'react';
import { PrestamoInput, PagoAdicional, EjemploPrestamo } from '../types/types';

interface FormularioPrestamoProps {
  prestamoInput: PrestamoInput;
  onInputChange: (datos: Partial<PrestamoInput>) => void;
  onCalcular: () => void;
  onCargarEjemplo: (id: string) => void;
  ejemplos: EjemploPrestamo[];
}

const FormularioPrestamo: React.FC<FormularioPrestamoProps> = ({
  prestamoInput,
  onInputChange,
  onCalcular,
  onCargarEjemplo,
  ejemplos
}) => {
  const [nuevoPagoPeriodo, setNuevoPagoPeriodo] = useState<number>(0);
  const [nuevoPagoMonto, setNuevoPagoMonto] = useState<number>(0);
  const [mostrarPagosAdicionales, setMostrarPagosAdicionales] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let valorProcesado: any = value;

    // Convertir a número para campos numéricos
    if (name === 'capital' || name === 'tasaInteresAnual' || name === 'plazoAnios') {
      valorProcesado = parseFloat(value) || 0;
    }

    // Convertir frecuenciaPago a número
    if (name === 'frecuenciaPago') {
      valorProcesado = parseInt(value, 10);
    }

    onInputChange({ [name]: valorProcesado });
  };

  const agregarPagoAdicional = () => {
    if (nuevoPagoPeriodo <= 0 || nuevoPagoMonto <= 0) {
      alert('El período y el monto deben ser mayores que cero');
      return;
    }

    // Verificar si ya existe un pago en este período
    const existePago = prestamoInput.pagosAdicionales?.some(p => p.periodo === nuevoPagoPeriodo);

    if (existePago) {
      alert(`Ya existe un pago adicional para el período ${nuevoPagoPeriodo}`);
      return;
    }

    const nuevoPago: PagoAdicional = {
      periodo: nuevoPagoPeriodo,
      monto: nuevoPagoMonto
    };

    // Agregar el nuevo pago y ordenar por período
    const pagosActualizados = [...(prestamoInput.pagosAdicionales || []), nuevoPago]
      .sort((a, b) => a.periodo - b.periodo);

    onInputChange({ pagosAdicionales: pagosActualizados });

    // Limpiar los campos
    setNuevoPagoPeriodo(0);
    setNuevoPagoMonto(0);
  };

  const eliminarPagoAdicional = (periodo: number) => {
    const pagosActualizados = (prestamoInput.pagosAdicionales || [])
      .filter(p => p.periodo !== periodo);
    
    onInputChange({ pagosAdicionales: pagosActualizados });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Datos del Préstamo</h2>

      {/* Ejemplos predefinidos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ejemplos Predefinidos
        </label>
        <div className="flex flex-wrap gap-2">
          {ejemplos.map((ejemplo) => (
            <button
              key={ejemplo.id}
              type="button"
              onClick={() => onCargarEjemplo(ejemplo.id)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
            >
              {ejemplo.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Formulario principal */}
      <form onSubmit={(e) => { e.preventDefault(); onCalcular(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capital */}
          <div className="col-span-2">
            <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-1">
              Capital (€)
            </label>
            <input
              type="number"
              id="capital"
              name="capital"
              value={prestamoInput.capital}
              onChange={handleChange}
              min="1"
              step="1000"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Tasa de interés */}
          <div>
            <label htmlFor="tasaInteresAnual" className="block text-sm font-medium text-gray-700 mb-1">
              Tasa de Interés Anual (%)
            </label>
            <input
              type="number"
              id="tasaInteresAnual"
              name="tasaInteresAnual"
              value={prestamoInput.tasaInteresAnual}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Plazo en años */}
          <div>
            <label htmlFor="plazoAnios" className="block text-sm font-medium text-gray-700 mb-1">
              Plazo (años)
            </label>
            <input
              type="number"
              id="plazoAnios"
              name="plazoAnios"
              value={prestamoInput.plazoAnios}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Frecuencia de pago */}
          <div>
            <label htmlFor="frecuenciaPago" className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia de Pago
            </label>
            <select
              id="frecuenciaPago"
              name="frecuenciaPago"
              value={prestamoInput.frecuenciaPago}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="12">Mensual</option>
              <option value="4">Trimestral</option>
              <option value="2">Semestral</option>
              <option value="1">Anual</option>
            </select>
          </div>

          {/* Fecha de inicio */}
          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={prestamoInput.fechaInicio}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Sección de pagos adicionales */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setMostrarPagosAdicionales(!mostrarPagosAdicionales)}
            className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center"
          >
            <span className="mr-2">{mostrarPagosAdicionales ? '−' : '+'}</span>
            <span>Pagos Adicionales</span>
          </button>

          {mostrarPagosAdicionales && (
            <div className="mt-3 p-4 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label htmlFor="nuevoPagoPeriodo" className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <input
                    type="number"
                    id="nuevoPagoPeriodo"
                    value={nuevoPagoPeriodo}
                    onChange={(e) => setNuevoPagoPeriodo(parseInt(e.target.value, 10) || 0)}
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="nuevoPagoMonto" className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (€)
                  </label>
                  <input
                    type="number"
                    id="nuevoPagoMonto"
                    value={nuevoPagoMonto}
                    onChange={(e) => setNuevoPagoMonto(parseFloat(e.target.value) || 0)}
                    min="1"
                    step="100"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={agregarPagoAdicional}
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Lista de pagos adicionales */}
              {prestamoInput.pagosAdicionales && prestamoInput.pagosAdicionales.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left font-medium">Período</th>
                      <th className="text-left font-medium">Monto (€)</th>
                      <th className="text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestamoInput.pagosAdicionales.map((pago) => (
                      <tr key={pago.periodo}>
                        <td>{pago.periodo}</td>
                        <td>{pago.monto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => eliminarPagoAdicional(pago.periodo)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm italic">No hay pagos adicionales definidos</p>
              )}
            </div>
          )}
        </div>

        {/* Botón de calcular */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Calcular Amortización
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPrestamo;