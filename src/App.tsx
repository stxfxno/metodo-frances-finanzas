import { useState, useEffect } from 'react';
import FormularioPrestamo from './components/formularioPrestamo';
import TablaAmortizacion from './components/TablaAmortizacion';
import ResumenPrestamo from './components/ResumenPrestamo';
import GraficosAmortizacion from './components/GraficosAmortizacion';
import { PrestamoInput, ResultadoAmortizacion } from './types/types';
import { calcularAmortizacionFrances } from './utils/calculadoraAmortizacion';
import ejemplosPrestamos from './data/ejemplosPrestamos.json';

function App() {
  const [prestamoInput, setPrestamoInput] = useState<PrestamoInput>({
    capital: 100000,
    tasaInteresAnual: 6,
    plazoAnios: 5,
    frecuenciaPago: 12,
    fechaInicio: new Date().toISOString().split('T')[0],
    pagosAdicionales: []
  });

  const [resultado, setResultado] = useState<ResultadoAmortizacion | null>(null);
  const [mostrarTabla, setMostrarTabla] = useState<boolean>(false);
  const [mostrarGraficos, setMostrarGraficos] = useState<boolean>(false);
  
  // Calcular amortización cuando cambian los inputs
  useEffect(() => {
    calcularAmortizacion();
  }, []);

  const calcularAmortizacion = () => {
    try {
      const resultado = calcularAmortizacionFrances(prestamoInput);
      setResultado(resultado);
      setMostrarTabla(true);
      setMostrarGraficos(true);
    } catch (error) {
      console.error("Error al calcular la amortización:", error);
      alert("Ocurrió un error al calcular la amortización. Verifique los datos ingresados.");
    }
  };

  const handleCalcular = () => {
    calcularAmortizacion();
  };

  const handleInputChange = (nuevosDatos: Partial<PrestamoInput>) => {
    setPrestamoInput((prev) => ({ ...prev, ...nuevosDatos }));
  };

  const cargarEjemplo = (id: string) => {
    const ejemplo = ejemplosPrestamos.find(e => e.id === id);
    if (ejemplo) {
      setPrestamoInput(ejemplo.prestamo);
      // Asegurémonos de que los pagosAdicionales estén definidos
      if (!ejemplo.prestamo.pagosAdicionales) {
        setPrestamoInput((prev) => ({ ...prev, pagosAdicionales: [] }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Calculadora de Amortización</h1>
          <p className="mt-2">Método Francés (Sistema de Cuota Fija)</p>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FormularioPrestamo 
                prestamoInput={prestamoInput}
                onInputChange={handleInputChange}
                onCalcular={handleCalcular}
                onCargarEjemplo={cargarEjemplo}
                ejemplos={ejemplosPrestamos}
              />
            </div>
            
            {resultado && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <ResumenPrestamo resultado={resultado} />
              </div>
            )}
          </div>
          
          {/* Columna derecha */}
          <div className="lg:col-span-8">
            {mostrarGraficos && resultado && (
              <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                <GraficosAmortizacion resultado={resultado} />
              </div>
            )}
            
            {mostrarTabla && resultado && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <TablaAmortizacion cuadroAmortizacion={resultado.cuadroAmortizacion} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 mt-12">
        <div className="container mx-auto">
          <p className="text-center">© {new Date().getFullYear()} - Calculadora de Amortización - Método Francés</p>
        </div>
      </footer>
    </div>
  );
}

export default App;