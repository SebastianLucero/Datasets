# Informe de Análisis de Datos Económicos de Ecuador

**Fecha:** Enero 2026
**Datasets analizados:** 3
**Período:** 2008-2022

---

## 1. Resumen Ejecutivo

Este informe presenta un análisis integral de tres datasets sobre la economía ecuatoriana:
- Ventas por cantón en la provincia de Manabí (2012-2019)
- PIB trimestral por sectores económicos (2008-2022)
- Impacto del terremoto de 2016 en cantones ecuatorianos

### Hallazgos Principales

1. **Ventas por Cantón**: Se identificaron tendencias mixtas con 5 cantones mostrando crecimiento significativo y 5 con decrecimiento durante el período 2012-2019.

2. **PIB Sectorial**: El sector manufacturero lidera la participación en el PIB (11.81%), seguido por comercio (10.35%) y enseñanza (8.55%).

3. **Impacto del Terremoto**: 18 cantones afectados por el terremoto de abril 2016 muestran patrones de recuperación variables en sus ventas.

---

## 2. Análisis de Ventas por Cantón (2012-2019)

### 2.1 Estadísticas Generales

- **Cantones analizados:** 22
- **Período:** 2012-2019
- **Métrica:** Logaritmo natural de ventas

### 2.2 Top 5 Cantones con Mayor Crecimiento

| Cantón | Crecimiento Promedio Anual (%) |
|--------|-------------------------------|
| Olmedo | 24.56% |
| Flavio Alfaro | 21.57% |
| Junín | 10.37% |
| Montecristi | 7.40% |
| 24 de Mayo | 6.61% |

**Análisis:** Olmedo y Flavio Alfaro destacan con crecimientos superiores al 20% anual, indicando un desarrollo económico acelerado en estos cantones.

### 2.3 Top 5 Cantones con Menor Crecimiento

| Cantón | Crecimiento Promedio Anual (%) |
|--------|-------------------------------|
| Paján | -14.75% |
| Santa Ana | -13.20% |
| Puerto López | -5.98% |
| Jipijapa | -5.02% |
| Rocafuerte | -4.19% |

**Análisis:** Estos cantones muestran contracción económica significativa, requiriendo atención especial en políticas de desarrollo local.

### 2.4 Estadísticas de Ventas (Valores Reales)

| Año | Promedio | Desviación Estándar | Mínimo | Máximo |
|-----|----------|---------------------|--------|--------|
| 2012 | $175,300 | $75,489 | $65,315 | $399,616 |
| 2019 | $218,481 | $139,853 | $55,455 | $670,943 |

**Observación:** Incremento en la dispersión de ventas entre cantones (mayor desviación estándar en 2019).

---

## 3. Análisis del PIB por Sectores Económicos (2008-2022)

### 3.1 Estadísticas del PIB Total

- **PIB Promedio:** $16,455,930,000
- **Mínimo:** $13,200,000,000 (2008)
- **Máximo:** $18,100,000,000 (2021-2022)
- **Crecimiento total:** 37.12%

### 3.2 Participación Promedio de Sectores en el PIB

| Sector | Participación (%) |
|--------|------------------|
| Manufactura | 11.81% |
| Comercio | 10.35% |
| Enseñanza | 8.55% |
| Construcción | 8.50% |
| Agricultura | 7.71% |
| Transporte | 6.91% |
| Alojamiento | 1.77% |

### 3.3 Correlación con el PIB Total

| Sector | Coeficiente de Correlación |
|--------|---------------------------|
| Manufactura | 0.993 (muy alta) |
| Transporte | 0.961 (muy alta) |
| Comercio | 0.950 (muy alta) |
| Enseñanza | 0.944 (muy alta) |
| Agricultura | 0.929 (muy alta) |
| Alojamiento | 0.874 (alta) |
| Construcción | 0.599 (moderada) |

**Análisis Clave:**
- La manufactura muestra la correlación más alta (0.993), indicando que es el principal motor del PIB.
- La construcción tiene correlación moderada (0.599), sugiriendo comportamiento más volátil e independiente.
- Todos los sectores muestran correlación positiva, indicando crecimiento conjunto.

### 3.4 Crecimiento por Sector (2008 vs 2021-2022)

Los sectores que experimentaron mayor crecimiento durante el período analizado:
- **Transporte:** Crecimiento sostenido
- **Manufactura:** Líder en contribución absoluta
- **Comercio:** Crecimiento estable

El sector de **Construcción** mostró mayor volatilidad, típica de este sector económico.

---

## 4. Análisis del Terremoto de 2016

### 4.1 Contexto

- **Fecha:** Abril 2016
- **Cantones afectados registrados:** 41
- **Cantones con datos de ventas disponibles:** 18

### 4.2 Cantones Afectados con Datos de Ventas

Los 18 cantones con información de ventas y terremoto incluyen:
- Manta, Portoviejo, Pedernales, San Vicente (zonas más afectadas)
- Chone, Bolívar, El Carmen, Flavio Alfaro
- Montecristi, Jipijapa, Rocafuerte, entre otros

### 4.3 Análisis del Impacto en Ventas

#### Cantones con Mayor Impacto Negativo (2015-2016)

| Cantón | Cambio Pre-Terremoto | Cambio Post-Terremoto | Recuperación |
|--------|---------------------|----------------------|--------------|
| Jama | -1.04 | +0.29 | ✓ Recuperación positiva |
| San Vicente | -0.92 | +0.62 | ✓ Fuerte recuperación |
| Pedernales | -0.16 | +0.06 | ✓ Recuperación leve |

#### Cantones con Recuperación Destacada

| Cantón | Cambio Pre-Terremoto | Cambio Post-Terremoto | Análisis |
|--------|---------------------|----------------------|----------|
| Santa Ana | +0.03 | +0.60 | Aceleración significativa |
| San Vicente | -0.92 | +0.62 | Recuperación fuerte |
| 24 de Mayo | +0.28 | +0.57 | Crecimiento sostenido |
| Pichincha | -0.27 | +0.55 | Reversión de tendencia |

**Observaciones Importantes:**

1. **San Vicente** y **Jama**, dos de los cantones más afectados, muestran una notable recuperación en el período 2016-2017.

2. **Olmedo** presenta un patrón atípico: alto crecimiento pre-terremoto (+1.29) pero decrecimiento post-terremoto (-0.65), sugiriendo factores adicionales.

3. La mayoría de cantones muestran **mejora en las tendencias de ventas** en el período post-terremoto (2016-2017), posiblemente debido a:
   - Esfuerzos de reconstrucción
   - Inversión pública
   - Ayuda nacional e internacional
   - Resiliencia económica local

---

## 5. Conclusiones y Recomendaciones

### 5.1 Conclusiones Principales

1. **Heterogeneidad Regional**: Existe alta variabilidad en el desempeño económico entre cantones de Manabí, con diferencias de hasta 39 puntos porcentuales en tasas de crecimiento.

2. **Estructura Económica Equilibrada**: El PIB ecuatoriano muestra diversificación sectorial saludable, con manufactura, comercio y enseñanza como pilares principales.

3. **Resiliencia Post-Terremoto**: Los cantones afectados demostraron capacidad de recuperación, con tendencias de ventas mejorando en el año siguiente al desastre.

4. **Tendencias de Largo Plazo**: El PIB muestra crecimiento sostenido con correlación alta entre sectores, indicando desarrollo económico integrado.

### 5.2 Recomendaciones

#### Para Cantones de Bajo Crecimiento
- Investigar factores específicos detrás del decrecimiento en Paján, Santa Ana y Puerto López
- Implementar programas de desarrollo económico local focalizados
- Evaluar infraestructura y acceso a mercados

#### Para Política Económica Nacional
- Fortalecer sectores con alta correlación al PIB (manufactura, transporte, comercio)
- Atender la volatilidad del sector construcción con políticas anticíclicas
- Continuar apoyando la diversificación económica

#### Para Preparación ante Desastres
- Documentar y sistematizar estrategias de recuperación exitosas de San Vicente y Jama
- Desarrollar planes de continuidad comercial para zonas sísmicas
- Mantener fondos de emergencia y reconstrucción

---

## 6. Archivos Generados

Este análisis generó los siguientes archivos de visualización:

1. **analisis_ventas.png** - Análisis visual de ventas por cantón
   - Mapa de calor de ventas
   - Evolución temporal top 5 cantones
   - Crecimiento por cantón
   - Distribución de ventas 2019

2. **analisis_pib.png** - Análisis visual del PIB
   - Evolución del PIB total
   - Tendencias de principales sectores
   - Participación por sector
   - Crecimiento sectorial

3. **analisis_terremoto.png** - Cantones afectados por terremoto
   - Visualización de cantones registrados

4. **analisis_impacto_terremoto.png** - Impacto del terremoto en ventas
   - Comparación pre/post terremoto
   - Evolución temporal de cantones afectados

---

## 7. Metodología

### 7.1 Datos Utilizados

- **DI_Crosstab65656.xls**: Datos de impacto del terremoto por cantón
- **ln ventas por provincia.xlsx**: Logaritmo natural de ventas por cantón (2012-2019)
- **TablaPIBRamas2000-2021trimetral.xlsx**: PIB trimestral por sectores (2008-2022)

### 7.2 Herramientas

- Python 3.11
- Pandas para manipulación de datos
- Matplotlib y Seaborn para visualizaciones
- NumPy para cálculos numéricos

### 7.3 Limitaciones

- Los datos de ventas están en logaritmo natural, limitando interpretación directa de magnitudes absolutas
- Datos de terremoto limitados en variables cuantitativas de impacto
- Período de análisis termina en 2019 para ventas, no capturando impacto COVID-19
- No se dispone de información socioeconómica adicional para análisis multivariado

---

## 8. Próximos Pasos Sugeridos

1. **Análisis Econométrico**: Modelar relación causal entre terremoto y ventas con variables de control
2. **Actualización de Datos**: Incorporar datos 2020-2025 para análisis de impacto COVID-19
3. **Análisis Espacial**: Mapeo geográfico de tendencias económicas
4. **Análisis Predictivo**: Modelos de forecasting para PIB y ventas sectoriales
5. **Análisis de Clusters**: Agrupar cantones por patrones similares de desarrollo

---

**Elaborado por:** Análisis Automatizado de Datos
**Contacto:** Para consultas sobre esta metodología o datos adicionales
