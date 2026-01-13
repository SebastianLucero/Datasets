#!/usr/bin/env python3
"""
Análisis Completo de Datos Económicos de Ecuador
- Ventas por provincia
- PIB por sectores económicos
- Datos de terremoto
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Configuración de estilo
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

print("=" * 80)
print("ANÁLISIS COMPLETO DE DATOS ECONÓMICOS DE ECUADOR")
print("=" * 80)

# ============================================================================
# 1. ANÁLISIS DE VENTAS POR CANTÓN (Logaritmo Natural)
# ============================================================================
print("\n" + "=" * 80)
print("1. ANÁLISIS DE VENTAS POR CANTÓN (2012-2019)")
print("=" * 80)

df_ventas = pd.read_excel('ln ventas por provincia.xlsx')

# Transformar de logaritmo natural a valores reales (exponencial)
years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
df_ventas_reales = df_ventas.copy()
for year in years:
    df_ventas_reales[year] = np.exp(df_ventas[year])

print("\n--- Estadísticas de Ventas (Valores Reales) ---")
print(df_ventas_reales[years].describe())

# Calcular crecimiento promedio anual por cantón
df_ventas['crecimiento'] = ((df_ventas[2019] - df_ventas[2012]) / 7) * 100
df_ventas_sorted = df_ventas.sort_values('crecimiento', ascending=False)

print("\n--- Top 5 Cantones con Mayor Crecimiento (2012-2019) ---")
print(df_ventas_sorted[['canton', 'crecimiento']].head())

print("\n--- Top 5 Cantones con Menor Crecimiento (2012-2019) ---")
print(df_ventas_sorted[['canton', 'crecimiento']].tail())

# Visualización 1: Evolución de ventas por cantón
fig, axes = plt.subplots(2, 2, figsize=(16, 12))

# 1.1 Heatmap de ventas (ln)
ax1 = axes[0, 0]
ventas_matrix = df_ventas[['canton'] + years].set_index('canton')
sns.heatmap(ventas_matrix, annot=False, cmap='YlOrRd', ax=ax1, cbar_kws={'label': 'ln(Ventas)'})
ax1.set_title('Mapa de Calor: Logaritmo Natural de Ventas por Cantón (2012-2019)', fontsize=12, fontweight='bold')
ax1.set_xlabel('Año')
ax1.set_ylabel('Cantón')

# 1.2 Top cantones - evolución temporal
ax2 = axes[0, 1]
top_5 = df_ventas_sorted.head(5)
for _, row in top_5.iterrows():
    ax2.plot(years, [row[year] for year in years], marker='o', label=row['canton'], linewidth=2)
ax2.set_title('Top 5 Cantones: Evolución de Ventas (ln)', fontsize=12, fontweight='bold')
ax2.set_xlabel('Año')
ax2.set_ylabel('ln(Ventas)')
ax2.legend()
ax2.grid(True, alpha=0.3)

# 1.3 Gráfico de barras - crecimiento por cantón
ax3 = axes[1, 0]
df_plot = df_ventas_sorted.head(10)
colors = ['green' if x > 0 else 'red' for x in df_plot['crecimiento']]
ax3.barh(df_plot['canton'], df_plot['crecimiento'], color=colors)
ax3.set_title('Top 10 Cantones: Tasa de Crecimiento Promedio Anual', fontsize=12, fontweight='bold')
ax3.set_xlabel('Crecimiento Promedio Anual (%)')
ax3.grid(True, alpha=0.3, axis='x')

# 1.4 Distribución de ventas 2019
ax4 = axes[1, 1]
df_ventas_sorted_2019 = df_ventas.sort_values(2019, ascending=True)
ax4.barh(df_ventas_sorted_2019['canton'], df_ventas_sorted_2019[2019], color='steelblue')
ax4.set_title('Ventas por Cantón en 2019 (ln)', fontsize=12, fontweight='bold')
ax4.set_xlabel('ln(Ventas)')
ax4.grid(True, alpha=0.3, axis='x')

plt.tight_layout()
plt.savefig('analisis_ventas.png', dpi=300, bbox_inches='tight')
print("\n✓ Gráfico guardado: analisis_ventas.png")
plt.close()

# ============================================================================
# 2. ANÁLISIS DE PIB POR SECTORES ECONÓMICOS
# ============================================================================
print("\n" + "=" * 80)
print("2. ANÁLISIS DE PIB POR SECTORES ECONÓMICOS (2008-2022)")
print("=" * 80)

df_pib = pd.read_excel('TablaPIBRamas2000-2021trimetral.xlsx')

# Crear columna de fecha
df_pib['Año'] = df_pib['Texto antes del delimitador']
df_pib['Periodo'] = df_pib['Año'].astype(str) + '-' + df_pib['Trimestre']

# Sectores económicos
sectores = ['Comercio', 'Agricultura', 'Construcción', 'Manufactura',
            'Enseñanza', 'Alojamamiento', 'Transporte']

print("\n--- Estadísticas del PIB Total ---")
print(df_pib['PIB'].describe())

print("\n--- Correlación entre PIB y Sectores ---")
correlacion = df_pib[['PIB'] + sectores].corr()['PIB'].sort_values(ascending=False)
print(correlacion)

# Calcular participación promedio de cada sector en el PIB
participacion = {}
for sector in sectores:
    participacion[sector] = (df_pib[sector].mean() / df_pib['PIB'].mean()) * 100

participacion_sorted = sorted(participacion.items(), key=lambda x: x[1], reverse=True)
print("\n--- Participación Promedio de Sectores en el PIB (%) ---")
for sector, porc in participacion_sorted:
    print(f"{sector:20s}: {porc:6.2f}%")

# Visualización 2: PIB y sectores
fig, axes = plt.subplots(2, 2, figsize=(16, 12))

# 2.1 Evolución del PIB total
ax1 = axes[0, 0]
ax1.plot(range(len(df_pib)), df_pib['PIB']/1e6, marker='o', linewidth=2, color='darkblue')
ax1.fill_between(range(len(df_pib)), df_pib['PIB']/1e6, alpha=0.3, color='lightblue')
ax1.set_title('Evolución del PIB Total (2008-2022)', fontsize=12, fontweight='bold')
ax1.set_xlabel('Trimestre')
ax1.set_ylabel('PIB (Millones)')
ax1.grid(True, alpha=0.3)
# Marcar años específicos
year_changes = df_pib.index[df_pib['Trimestre'] == 'I'].tolist()
for idx in year_changes[::4]:  # Cada 4 años
    if idx < len(df_pib):
        ax1.axvline(x=idx, color='red', linestyle='--', alpha=0.3, linewidth=1)

# 2.2 Evolución de principales sectores
ax2 = axes[0, 1]
for sector in ['Comercio', 'Manufactura', 'Agricultura', 'Construcción']:
    ax2.plot(range(len(df_pib)), df_pib[sector]/1e3, marker='',
             linewidth=2, label=sector, alpha=0.8)
ax2.set_title('Evolución de Principales Sectores Económicos', fontsize=12, fontweight='bold')
ax2.set_xlabel('Trimestre')
ax2.set_ylabel('Valor (Miles de millones)')
ax2.legend()
ax2.grid(True, alpha=0.3)

# 2.3 Participación de sectores (gráfico de pastel)
ax3 = axes[1, 0]
sectores_top = sorted(participacion.items(), key=lambda x: x[1], reverse=True)[:7]
labels = [s[0] for s in sectores_top]
sizes = [s[1] for s in sectores_top]
colors_pie = plt.cm.Set3(range(len(labels)))
ax3.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors_pie)
ax3.set_title('Participación Promedio por Sector en el PIB', fontsize=12, fontweight='bold')

# 2.4 Tendencia de crecimiento por sector
ax4 = axes[1, 1]
crecimiento_sectores = {}
for sector in sectores:
    inicial = df_pib[sector].iloc[:4].mean()  # Promedio primeros 4 trimestres
    final = df_pib[sector].iloc[-4:].mean()   # Promedio últimos 4 trimestres
    crecimiento_sectores[sector] = ((final - inicial) / inicial) * 100

sectores_crecimiento = sorted(crecimiento_sectores.items(), key=lambda x: x[1], reverse=True)
labels_crec = [s[0] for s in sectores_crecimiento]
values_crec = [s[1] for s in sectores_crecimiento]
colors_crec = ['green' if v > 0 else 'red' for v in values_crec]
ax4.barh(labels_crec, values_crec, color=colors_crec)
ax4.set_title('Crecimiento de Sectores (2008 vs 2021-2022)', fontsize=12, fontweight='bold')
ax4.set_xlabel('Crecimiento (%)')
ax4.axvline(x=0, color='black', linewidth=0.5)
ax4.grid(True, alpha=0.3, axis='x')

plt.tight_layout()
plt.savefig('analisis_pib.png', dpi=300, bbox_inches='tight')
print("\n✓ Gráfico guardado: analisis_pib.png")
plt.close()

# ============================================================================
# 3. ANÁLISIS DE DATOS DE TERREMOTO
# ============================================================================
print("\n" + "=" * 80)
print("3. ANÁLISIS DE IMPACTO DE TERREMOTO POR CANTÓN")
print("=" * 80)

df_terremoto = pd.read_excel('DI_Crosstab65656.xls')

# Limpiar datos - la primera fila tiene los nombres de columnas reales
df_terremoto.columns = df_terremoto.iloc[0]
df_terremoto = df_terremoto.iloc[1:].reset_index(drop=True)
df_terremoto = df_terremoto[df_terremoto['Cantón'] != 'TOTAL']

# Convertir columnas numéricas
numeric_cols = df_terremoto.columns[2:]
for col in numeric_cols:
    try:
        df_terremoto[col] = pd.to_numeric(df_terremoto[col], errors='coerce')
    except:
        pass

df_terremoto = df_terremoto.dropna(how='all', axis=1)

print("\n--- Resumen de Datos de Terremoto ---")
print(f"Cantones afectados: {len(df_terremoto)}")
print("\nColumnas disponibles:")
for col in df_terremoto.columns:
    print(f"  - {col}")

# Mostrar cantones más afectados
print("\n--- Cantones Registrados ---")
print(df_terremoto[['Cantón', 'Code']].head(10))

# Visualización 3: Datos de terremoto
fig, ax = plt.subplots(figsize=(12, 8))
cantones = df_terremoto['Cantón'].head(15)
y_pos = np.arange(len(cantones))
ax.barh(y_pos, range(len(cantones), 0, -1), color='orangered', alpha=0.7)
ax.set_yticks(y_pos)
ax.set_yticklabels(cantones)
ax.set_xlabel('Índice de Registro')
ax.set_title('Cantones Afectados por Terremoto en Ecuador', fontsize=14, fontweight='bold')
ax.grid(True, alpha=0.3, axis='x')
plt.tight_layout()
plt.savefig('analisis_terremoto.png', dpi=300, bbox_inches='tight')
print("\n✓ Gráfico guardado: analisis_terremoto.png")
plt.close()

# ============================================================================
# 4. ANÁLISIS INTEGRADO: RELACIÓN ENTRE TERREMOTO Y VENTAS
# ============================================================================
print("\n" + "=" * 80)
print("4. ANÁLISIS INTEGRADO: IMPACTO DEL TERREMOTO EN VENTAS")
print("=" * 80)

# El terremoto de Ecuador fue en abril de 2016
# Vamos a analizar el comportamiento de ventas antes y después

# Cantones en común entre terremoto y ventas
cantones_terremoto = set(df_terremoto['Cantón'].str.upper())
cantones_ventas = set(df_ventas['canton'].str.upper())
cantones_comunes = cantones_terremoto.intersection(cantones_ventas)

print(f"\nCantones en dataset de terremoto: {len(cantones_terremoto)}")
print(f"Cantones en dataset de ventas: {len(cantones_ventas)}")
print(f"Cantones en común: {len(cantones_comunes)}")

if len(cantones_comunes) > 0:
    print("\nCantones comunes:")
    for canton in sorted(cantones_comunes):
        print(f"  - {canton}")

# Analizar impacto del terremoto (2016) en ventas
print("\n--- Análisis del Impacto del Terremoto de 2016 ---")
print("Cambio en ventas 2015-2016 vs 2016-2017:")

for _, row in df_ventas.iterrows():
    canton = row['canton'].upper()
    if canton in cantones_comunes:
        cambio_pre = row[2016] - row[2015]
        cambio_post = row[2017] - row[2016]
        print(f"{canton:20s} | Pre-terremoto: {cambio_pre:6.2f} | Post-terremoto: {cambio_post:6.2f}")

# Visualización 4: Impacto del terremoto en ventas
fig, axes = plt.subplots(2, 1, figsize=(14, 10))

# 4.1 Comparación antes/después del terremoto
ax1 = axes[0]
cantones_analisis = []
cambios_pre = []
cambios_post = []

for _, row in df_ventas.iterrows():
    canton = row['canton'].upper()
    if canton in cantones_comunes:
        cantones_analisis.append(row['canton'])
        cambios_pre.append(row[2016] - row[2015])
        cambios_post.append(row[2017] - row[2016])

if cantones_analisis:
    x = np.arange(len(cantones_analisis))
    width = 0.35
    ax1.bar(x - width/2, cambios_pre, width, label='2015-2016 (Pre-terremoto)', color='steelblue')
    ax1.bar(x + width/2, cambios_post, width, label='2016-2017 (Post-terremoto)', color='coral')
    ax1.set_xlabel('Cantón')
    ax1.set_ylabel('Cambio en ln(Ventas)')
    ax1.set_title('Impacto del Terremoto de 2016 en Ventas por Cantón', fontsize=12, fontweight='bold')
    ax1.set_xticks(x)
    ax1.set_xticklabels(cantones_analisis, rotation=45, ha='right')
    ax1.legend()
    ax1.grid(True, alpha=0.3, axis='y')
    ax1.axhline(y=0, color='black', linewidth=0.5)

# 4.2 Evolución temporal de cantones afectados
ax2 = axes[1]
for _, row in df_ventas.iterrows():
    if row['canton'].upper() in cantones_comunes:
        ax2.plot(years, [row[year] for year in years], marker='o',
                linewidth=2, label=row['canton'], alpha=0.8)

ax2.axvline(x=2016, color='red', linestyle='--', linewidth=2,
           label='Terremoto (Abril 2016)', alpha=0.7)
ax2.set_xlabel('Año')
ax2.set_ylabel('ln(Ventas)')
ax2.set_title('Evolución de Ventas en Cantones Afectados por Terremoto',
             fontsize=12, fontweight='bold')
ax2.legend(loc='best')
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('analisis_impacto_terremoto.png', dpi=300, bbox_inches='tight')
print("\n✓ Gráfico guardado: analisis_impacto_terremoto.png")
plt.close()

print("\n" + "=" * 80)
print("ANÁLISIS COMPLETADO")
print("=" * 80)
print("\nArchivos generados:")
print("  1. analisis_ventas.png - Análisis de ventas por cantón")
print("  2. analisis_pib.png - Análisis de PIB por sectores")
print("  3. analisis_terremoto.png - Cantones afectados por terremoto")
print("  4. analisis_impacto_terremoto.png - Impacto del terremoto en ventas")
