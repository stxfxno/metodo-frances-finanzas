// Definición de tipos para la aplicación de amortización

export interface PrestamoInput {
    capital: number;            // Monto del préstamo
    tasaInteresAnual: number;   // En porcentaje (ej: 6 para 6%)
    plazoAnios: number;         // Duración en años
    frecuenciaPago: number;     // 12 para mensual, 4 para trimestral, etc.
    fechaInicio: string;        // Fecha de inicio del préstamo en formato YYYY-MM-DD
    pagosAdicionales?: PagoAdicional[]; // Opcional: array de pagos adicionales
  }
  
  export interface PagoAdicional {
    periodo: number;
    monto: number;
  }
  
  export interface FilaPeriodo {
    periodo: number;
    fecha: string;
    cuota: number;
    interes: number;
    amortizacion: number;
    capitalPendiente: number;
    pagoAdicional: number;
  }
  
  export interface ResultadoAmortizacion {
    parametros: {
      capital: number;
      tasaInteresAnual: number;
      tasaInteresPeriodica: number;
      plazoAnios: number;
      frecuenciaPago: number;
      numPeriodos: number;
      cuotaPeriodica: number;
    };
    cuadroAmortizacion: FilaPeriodo[];
    totales?: {
      totalPagado: number;
      totalInteres: number;
      totalAmortizacion: number;
    };
  }
  
  // Ejemplos predefinidos para cargar en la aplicación
  export interface EjemploPrestamo {
    id: string;
    nombre: string;
    prestamo: PrestamoInput;
  }