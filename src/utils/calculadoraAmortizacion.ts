import { PrestamoInput, ResultadoAmortizacion, FilaPeriodo } from '../types/types';

/**
 * Calcula el cuadro de amortización utilizando el método francés
 * @param prestamoInput Datos del préstamo
 * @returns Resultado completo con cuadro de amortización
 */
export function calcularAmortizacionFrances(prestamoInput: PrestamoInput): ResultadoAmortizacion {
  // Extraer parámetros
  const { capital, tasaInteresAnual, plazoAnios, frecuenciaPago, fechaInicio, pagosAdicionales = [] } = prestamoInput;

  // Calcular parámetros derivados
  const numPeriodos = plazoAnios * frecuenciaPago;
  const tasaInteresPeriodica = tasaInteresAnual / 100 / frecuenciaPago;

  // Calcular cuota periódica
  const cuotaPeriodica = capital * (tasaInteresPeriodica * Math.pow(1 + tasaInteresPeriodica, numPeriodos)) /
                         (Math.pow(1 + tasaInteresPeriodica, numPeriodos) - 1);

  // Inicializar cuadro de amortización
  const cuadroAmortizacion: FilaPeriodo[] = [];
  let capitalPendiente = capital;
  let fecha = new Date(fechaInicio);

  // Variables para calcular los totales
  let totalPagado = 0;
  let totalInteres = 0;
  let totalAmortizacion = 0;

  // Generar cuadro de amortización
  for (let periodo = 1; periodo <= numPeriodos; periodo++) {
    // Avanzar fecha según frecuencia de pago
    fecha = avanzarFecha(fecha, frecuenciaPago);

    // Calcular interés del período
    const interesPeriodo = capitalPendiente * tasaInteresPeriodica;

    // Calcular amortización del período
    let amortizacionPeriodo = cuotaPeriodica - interesPeriodo;

    // Verificar si hay pago adicional en este período
    let pagoAdicional = 0;
    const pagoAdicionalObj = pagosAdicionales.find(p => p.periodo === periodo);
    if (pagoAdicionalObj) {
      pagoAdicional = pagoAdicionalObj.monto;
    }

    // Ajustar amortización con pago adicional
    amortizacionPeriodo += pagoAdicional;

    // Actualizar capital pendiente
    capitalPendiente -= amortizacionPeriodo;

    // Si el capital pendiente es muy pequeño (por errores de redondeo), ajustarlo a cero
    if (Math.abs(capitalPendiente) < 0.01) {
      capitalPendiente = 0;
    }

    // Acumular totales
    totalInteres += interesPeriodo;
    totalAmortizacion += amortizacionPeriodo;
    totalPagado += cuotaPeriodica + pagoAdicional;

    // Añadir fila al cuadro de amortización
    cuadroAmortizacion.push({
      periodo,
      fecha: fecha.toISOString().split('T')[0],
      cuota: redondearDecimal(cuotaPeriodica, 2),
      interes: redondearDecimal(interesPeriodo, 2),
      amortizacion: redondearDecimal(amortizacionPeriodo, 2),
      capitalPendiente: redondearDecimal(capitalPendiente, 2),
      pagoAdicional: redondearDecimal(pagoAdicional, 2)
    });

    // Si ya no hay capital pendiente, terminar
    if (capitalPendiente <= 0) {
      break;
    }
  }

  return {
    parametros: {
      capital,
      tasaInteresAnual,
      tasaInteresPeriodica: redondearDecimal(tasaInteresPeriodica * 100, 4), // Convertir a porcentaje
      plazoAnios,
      frecuenciaPago,
      numPeriodos,
      cuotaPeriodica: redondearDecimal(cuotaPeriodica, 2)
    },
    cuadroAmortizacion,
    totales: {
      totalPagado: redondearDecimal(totalPagado, 2),
      totalInteres: redondearDecimal(totalInteres, 2),
      totalAmortizacion: redondearDecimal(totalAmortizacion, 2)
    }
  };
}

/**
 * Calcula la Tasa Anual Equivalente (TAE)
 * @param tasaNominal Tasa nominal anual en porcentaje
 * @param frecuenciaPago Frecuencia de pago (12 para mensual, etc.)
 * @param comisiones Comisiones (opcional)
 * @param capital Capital del préstamo (necesario si hay comisiones)
 * @returns TAE en porcentaje
 */
export function calcularTAE(
  tasaNominal: number, 
  frecuenciaPago: number, 
  comisiones: number = 0, 
  capital: number = 0
): number {
  const tasaPeriodicaNominal = tasaNominal / 100 / frecuenciaPago;
  let tae = Math.pow(1 + tasaPeriodicaNominal, frecuenciaPago) - 1;

  // Ajustar por comisiones si es necesario
  if (comisiones > 0 && capital > 0) {
    const capitalEfectivo = capital - comisiones;
    // Este es un cálculo simplificado. Un cálculo completo de TAE con comisiones
    // requeriría un método iterativo para resolver la ecuación.
    tae = (Math.pow(capital / capitalEfectivo, 1 / plazoAnios) - 1) * frecuenciaPago;
  }

  return redondearDecimal(tae * 100, 2); // Convertir a porcentaje
}

/**
 * Calcula la fecha de vencimiento final del préstamo
 * @param fechaInicio Fecha de inicio del préstamo
 * @param plazoAnios Plazo en años
 * @param frecuenciaPago Frecuencia de pago
 * @returns Fecha de vencimiento final
 */
export function calcularFechaVencimiento(
  fechaInicio: string, 
  plazoAnios: number, 
  frecuenciaPago: number
): string {
  const fechaFinal = new Date(fechaInicio);

  if (frecuenciaPago === 12) { // Mensual
    fechaFinal.setMonth(fechaFinal.getMonth() + (plazoAnios * 12));
  } else if (frecuenciaPago === 4) { // Trimestral
    fechaFinal.setMonth(fechaFinal.getMonth() + (plazoAnios * 4 * 3));
  } else if (frecuenciaPago === 2) { // Semestral
    fechaFinal.setMonth(fechaFinal.getMonth() + (plazoAnios * 2 * 6));
  } else { // Anual
    fechaFinal.setFullYear(fechaFinal.getFullYear() + plazoAnios);
  }

  return fechaFinal.toISOString().split('T')[0];
}

// Función auxiliar para avanzar la fecha según la frecuencia de pago
function avanzarFecha(fecha: Date, frecuenciaPago: number): Date {
  const nuevaFecha = new Date(fecha);
  switch (frecuenciaPago) {
    case 12: // Mensual
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
      break;
    case 4: // Trimestral
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 3);
      break;
    case 2: // Semestral
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 6);
      break;
    case 1: // Anual
      nuevaFecha.setFullYear(nuevaFecha.getFullYear() + 1);
      break;
  }
  return nuevaFecha;
}

// Función para redondear a un número específico de decimales
export function redondearDecimal(valor: number, decimales: number = 2): number {
  const factor = Math.pow(10, decimales);
  return Math.round(valor * factor) / factor;
}