# Análisis Económico de Ecuador - Visualización Interactiva D3.js

Visualización interactiva de datos económicos de Ecuador usando D3.js v7.

## 🌐 Ver en GitHub (Online)

**¿Quieres ver la visualización directamente desde GitHub?**

👉 **[Lee las instrucciones completas aquí: COMO_VER_EN_GITHUB.md](COMO_VER_EN_GITHUB.md)**

### Enlaces Rápidos (después de habilitar GitHub Pages):

**GitHub Pages:** `https://sebastianlucero.github.io/Datasets/`

**HTMLPreview:**
```
https://htmlpreview.github.io/?https://github.com/SebastianLucero/Datasets/blob/claude/perform-analysis-B5ZkJ/index.html
```

**Raw.githack:**
```
https://raw.githack.com/SebastianLucero/Datasets/claude/perform-analysis-B5ZkJ/index.html
```

---

## 🚀 Inicio Rápido (Local)

### Opción 1: Abrir directamente en navegador
```bash
# Navegar al directorio
cd /home/user/Datasets

# Abrir index.html en tu navegador
# En Linux:
xdg-open index.html

# En macOS:
open index.html

# En Windows:
start index.html
```

### Opción 2: Servidor HTTP local
```bash
# Python 3
python3 -m http.server 8000

# Luego abre: http://localhost:8000
```

### Opción 3: Live Server (VS Code)
1. Instalar extensión "Live Server"
2. Click derecho en `index.html` → "Open with Live Server"

## 📊 Contenido

### Datasets Analizados
1. **Ventas por Cantón** (2012-2019)
   - 22 cantones de la provincia de Manabí
   - Datos en logaritmo natural de ventas

2. **PIB por Sectores** (2008-2022)
   - Datos trimestrales
   - 7 sectores económicos principales

3. **Impacto Terremoto 2016**
   - 41 cantones afectados
   - Análisis comparativo pre/post terremoto

### Visualizaciones Disponibles

#### 📈 Resumen Ejecutivo
- Estadísticas clave del análisis
- Hallazgos principales destacados

#### 🏪 Ventas por Cantón
- **Gráfico de barras**: Crecimiento promedio anual
- **Gráfico de líneas**: Evolución temporal top 10 cantones
- Tooltips interactivos con datos detallados

#### 💼 PIB por Sectores
- **Gráfico de área**: Evolución del PIB total
- **Gráfico multi-líneas**: Tendencias sectoriales
- Período: 2008-2022 (trimestral)

#### 📊 Análisis Sectorial
- **Gráfico de barras**: Participación en el PIB
- **Gráfico horizontal**: Correlación con PIB
- 7 sectores económicos analizados

#### 🌍 Impacto Terremoto 2016
- **Gráfico comparativo**: Cambios pre/post terremoto
- **Gráfico de líneas**: Evolución 2015-2019
- Identificación de cantones con recuperación

## 🎨 Características

- ✅ **100% Interactivo**: Hover sobre elementos para ver detalles
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Navegación por tabs**: Explora diferentes secciones fácilmente
- ✅ **Animaciones suaves**: Transiciones visuales agradables
- ✅ **Tooltips informativos**: Información contextual al pasar el mouse
- ✅ **Colores diferenciados**: Codificación visual clara
- ✅ **Sin backend requerido**: Solo HTML, CSS y JavaScript

## 📁 Estructura de Archivos

```
Datasets/
├── index.html              # Página principal
├── visualizations.js       # Código D3.js
├── data_ventas.json        # Datos de ventas
├── data_pib.json          # Datos de PIB
├── data_sectores.json     # Datos sectoriales
├── data_impacto.json      # Datos de impacto terremoto
├── data_terremoto.json    # Lista de cantones afectados
├── export_to_json.py      # Script para generar JSONs
├── analisis_completo.py   # Script de análisis Python
├── explore_data.py        # Script de exploración
├── INFORME_ANALISIS.md    # Informe completo
└── README.md              # Este archivo
```

## 🔧 Tecnologías Utilizadas

- **D3.js v7**: Visualización de datos
- **HTML5**: Estructura
- **CSS3**: Estilos y animaciones
- **JavaScript ES6+**: Lógica de interacción
- **Python 3**: Procesamiento de datos

## 📝 Hallazgos Principales

### Ventas por Cantón
- **Olmedo**: +24.56% crecimiento anual (líder)
- **Flavio Alfaro**: +21.57% crecimiento anual
- **Paján**: -14.75% decrecimiento anual
- **Santa Ana**: -13.20% decrecimiento anual

### PIB Sectorial
- **Manufactura**: 11.81% del PIB (sector líder)
- **Comercio**: 10.35% del PIB
- **Enseñanza**: 8.55% del PIB
- **Correlación más alta**: Manufactura (0.993)

### Terremoto 2016
- **18 cantones** con datos comparables
- **Recuperación notable**: San Vicente, Jama, Santa Ana
- Mayoría muestra mejora en 2016-2017

## 🎯 Uso de las Visualizaciones

1. **Navegar**: Usa los botones superiores para cambiar de sección
2. **Explorar**: Pasa el mouse sobre gráficos para ver detalles
3. **Comparar**: Observa tendencias y patrones visuales
4. **Analizar**: Lee los tooltips para información específica

## 🐛 Solución de Problemas

### No se cargan los datos
- Asegúrate de tener todos los archivos JSON en el mismo directorio
- Verifica que el servidor HTTP esté correcto si usas uno
- Abre la consola del navegador (F12) para ver errores

### Gráficos no se muestran
- Verifica que D3.js se cargue correctamente (conexión a CDN)
- Revisa que `visualizations.js` esté en el mismo directorio
- Asegúrate de usar un navegador moderno (Chrome, Firefox, Safari, Edge)

### Regenerar datos JSON
```bash
python3 export_to_json.py
```

## 📊 Datos Fuente

- **DI_Crosstab65656.xls**: Datos de terremoto
- **ln ventas por provincia.xlsx**: Ventas por cantón
- **TablaPIBRamas2000-2021trimetral.xlsx**: PIB sectorial

## 📄 Licencia

Este proyecto es de código abierto para propósitos educativos y de investigación.

## 👨‍💻 Desarrollo

Para modificar las visualizaciones:
1. Edita `visualizations.js`
2. Recarga la página en el navegador
3. Usa las herramientas de desarrollo (F12) para debugging

## 📧 Contacto

Para preguntas o sugerencias sobre el análisis de datos.

---

**Última actualización:** Enero 2026
