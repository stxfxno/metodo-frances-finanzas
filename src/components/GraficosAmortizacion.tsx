import React, { useState } from 'react';
import { ResultadoAmortizacion } from '../types/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface GraficosAmortizacionProps {
  resultado: ResultadoAmortizacion;
}

const GraficosAmortizacion: React.FC<GraficosAmortizacionProps> = ({ resultado }) => {
  const [tipoGrafico, setTipoGrafico] = useState<'evolucion' | 'distribucion' | 'composicion'>('evolucion');
  
  // Preparar datos para gráfico de evolución del capital
  const datosEvolucion = resultado.cuadroAmortizacion.map((fila) => ({
    periodo: fila.periodo,
    capitalPendiente: fila.capitalPendiente,
    cuota: resultado.parametros.cuotaPeriodica,
  }));
  
  // Datos simplificados para mostrar evolución (tomamos muestras)
  const datosSimplificados = () => {
    const total = resultado.cuadroAmortizacion.length;
    
    // Para préstamos con muchos períodos, tomar muestras
    if (total > 60) {
      const muestras = [];
      const intervalo = Math.ceil(total / 60);
      
      for (let i = 0; i < total; i += intervalo) {
        muestras.push(datosEvolucion[i]);
      }
      
      // Asegurarse de incluir el último período
      if (muestras[muestras.length - 1]?.periodo !== total) {
        muestras.push(datosEvolucion[total - 1]);
      }
      
      return muestras;
    }
    
    return datosEvolucion;
  };
  
  // Preparar datos para gráfico de distribución capital-interés
  const datosDistribucion = resultado.cuadroAmortizacion.map((fila) => ({
    periodo: fila.periodo,
    interes: fila.interes,
    amortizacion: fila.amortizacion - fila.pagoAdicional,
    pagoAdicional: fila.pagoAdicional,
  }));
  
  // Datos simplificados para la distribución
  const datosDistribucionSimplificados = () => {
    const total = resultado.cuadroAmortizacion.length;
    
    if (total > 48) {
      const muestras = [];
      const intervalo = Math.ceil(total / 48);
      
      for (let i = 0; i < total; i += intervalo) {
        muestras.push(datosDistribucion[i]);
      }
      
      if (muestras[muestras.length - 1]?.periodo !== total) {
        muestras.push(datosDistribucion[total - 1]);
      }
      
      return muestras;
    }
    
    return datosDistribucion;
  };
  
  // Datos para gráfico de composición total
  const datosComposicion = [
    { name: 'Capital', value: resultado.parametros.capital },
    { name: 'Intereses', value: resultado.totales?.totalInteres || 0 },
  ];
  
  // Colores para los gráficos
  const colores = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];
  
  // Formatear valores para el tooltip
  const formatearDinero = (valor: number) => {
    return valor.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €';
  };
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gráficos</h2>
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              tipoGrafico === 'evolucion'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setTipoGrafico('evolucion')}
          >
            Evolución
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              tipoGrafico === 'distribucion'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setTipoGrafico('distribucion')}
          >
            Distribución
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              tipoGrafico === 'composicion'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setTipoGrafico('composicion')}
          >
            Composición
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {tipoGrafico === 'evolucion' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={datosSimplificados()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="periodo" 
                label={{ value: 'Período', position: 'insideBottomRight', offset: -10 }} 
              />
              <YAxis 
                tickFormatter={formatearDinero}
                label={{ value: 'Capital Pendiente (€)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value: number) => formatearDinero(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="capitalPendiente"
                name="Capital Pendiente"
                stroke="#3B82F6"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="cuota"
                name="Cuota"
                stroke="#10B981"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {tipoGrafico === 'distribucion' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={datosDistribucionSimplificados()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              stackOffset="expand"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="periodo" 
                label={{ value: 'Período', position: 'insideBottomRight', offset: -10 }} 
              />
              <YAxis 
                tickFormatter={(value) => formatearDinero(value)}
                label={{ value: 'Importe (€)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value: number) => formatearDinero(value)} />
              <Legend />
              <Bar 
                dataKey="interes" 
                name="Interés" 
                stackId="a" 
                fill="#EF4444" 
              />
              <Bar 
                dataKey="amortizacion" 
                name="Amortización" 
                stackId="a" 
                fill="#3B82F6" 
              />
              {resultado.cuadroAmortizacion.some(fila => fila.pagoAdicional > 0) && (
                <Bar 
                  dataKey="pagoAdicional" 
                  name="Pago Adicional" 
                  stackId="a" 
                  fill="#10B981" 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {tipoGrafico === 'composicion' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosComposicion}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {datosComposicion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatearDinero(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Instrucciones del gráfico */}
      <div className="mt-3 text-sm text-gray-600">
        {tipoGrafico === 'evolucion' && (
          <p>Este gráfico muestra la evolución del capital pendiente a lo largo del tiempo.</p>
        )}
        {tipoGrafico === 'distribucion' && (
          <p>Este gráfico muestra la distribución de cada cuota entre interés y amortización.</p>
        )}
        {tipoGrafico === 'composicion' && (
          <p>Este gráfico muestra la proporción entre el capital prestado y los intereses totales pagados.</p>
        )}
      </div>
    </div>
  );
};

export default GraficosAmortizacion;