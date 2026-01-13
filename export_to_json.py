#!/usr/bin/env python3
"""
Exportar datos a formato JSON para D3.js
"""
import pandas as pd
import numpy as np
import json
import warnings
warnings.filterwarnings('ignore')

print("Exportando datos a JSON...")

# 1. VENTAS POR CANTÓN
print("\n1. Procesando ventas por cantón...")
df_ventas = pd.read_excel('ln ventas por provincia.xlsx')

ventas_data = []
years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]

for _, row in df_ventas.iterrows():
    canton_data = {
        'canton': row['canton'],
        'values': []
    }
    for year in years:
        canton_data['values'].append({
            'year': year,
            'ln_ventas': float(row[year]),
            'ventas': float(np.exp(row[year]))
        })

    # Calcular crecimiento
    crecimiento = ((row[2019] - row[2012]) / 7) * 100
    canton_data['crecimiento'] = float(crecimiento)

    ventas_data.append(canton_data)

# Ordenar por crecimiento
ventas_data_sorted = sorted(ventas_data, key=lambda x: x['crecimiento'], reverse=True)

with open('data_ventas.json', 'w', encoding='utf-8') as f:
    json.dump(ventas_data_sorted, f, indent=2, ensure_ascii=False)

print("✓ data_ventas.json creado")

# 2. PIB POR SECTORES
print("\n2. Procesando PIB por sectores...")
df_pib = pd.read_excel('TablaPIBRamas2000-2021trimetral.xlsx')

sectores = ['Comercio', 'Agricultura', 'Construcción', 'Manufactura',
            'Enseñanza', 'Alojamamiento', 'Transporte']

pib_data = []
for idx, row in df_pib.iterrows():
    trimestre_data = {
        'año': int(row['Texto antes del delimitador']),
        'trimestre': row['Trimestre'],
        'periodo': f"{int(row['Texto antes del delimitador'])}-{row['Trimestre']}",
        'pib': int(row['PIB']),
        'sectores': {}
    }

    for sector in sectores:
        trimestre_data['sectores'][sector] = int(row[sector])

    pib_data.append(trimestre_data)

with open('data_pib.json', 'w', encoding='utf-8') as f:
    json.dump(pib_data, f, indent=2, ensure_ascii=False)

print("✓ data_pib.json creado")

# Calcular participación promedio de sectores
participacion = {}
for sector in sectores:
    participacion[sector] = {
        'sector': sector,
        'participacion': float((df_pib[sector].mean() / df_pib['PIB'].mean()) * 100),
        'correlacion': float(df_pib[['PIB', sector]].corr().iloc[0, 1])
    }

participacion_list = sorted(participacion.values(), key=lambda x: x['participacion'], reverse=True)

with open('data_sectores.json', 'w', encoding='utf-8') as f:
    json.dump(participacion_list, f, indent=2, ensure_ascii=False)

print("✓ data_sectores.json creado")

# 3. DATOS DE TERREMOTO
print("\n3. Procesando datos de terremoto...")
df_terremoto = pd.read_excel('DI_Crosstab65656.xls')
df_terremoto.columns = df_terremoto.iloc[0]
df_terremoto = df_terremoto.iloc[1:].reset_index(drop=True)
df_terremoto = df_terremoto[df_terremoto['Cantón'] != 'TOTAL']

terremoto_data = []
for _, row in df_terremoto.iterrows():
    if pd.notna(row['Cantón']) and pd.notna(row.get('Code')):
        terremoto_data.append({
            'canton': str(row['Cantón']),
            'code': str(row['Code'])
        })

with open('data_terremoto.json', 'w', encoding='utf-8') as f:
    json.dump(terremoto_data, f, indent=2, ensure_ascii=False)

print("✓ data_terremoto.json creado")

# 4. ANÁLISIS DE IMPACTO DEL TERREMOTO
print("\n4. Procesando impacto del terremoto en ventas...")
cantones_terremoto = set(df_terremoto['Cantón'].str.upper())
cantones_ventas = set(df_ventas['canton'].str.upper())
cantones_comunes = cantones_terremoto.intersection(cantones_ventas)

impacto_data = []
for _, row in df_ventas.iterrows():
    if row['canton'].upper() in cantones_comunes:
        impacto_data.append({
            'canton': row['canton'],
            'afectado': True,
            'cambio_pre_terremoto': float(row[2016] - row[2015]),
            'cambio_post_terremoto': float(row[2017] - row[2016]),
            'recuperacion': float(row[2017] - row[2016]) > float(row[2016] - row[2015]),
            'ventas_2015': float(row[2015]),
            'ventas_2016': float(row[2016]),
            'ventas_2017': float(row[2017]),
            'ventas_2018': float(row[2018]),
            'ventas_2019': float(row[2019])
        })

impacto_data_sorted = sorted(impacto_data, key=lambda x: x['cambio_post_terremoto'], reverse=True)

with open('data_impacto.json', 'w', encoding='utf-8') as f:
    json.dump(impacto_data_sorted, f, indent=2, ensure_ascii=False)

print("✓ data_impacto.json creado")

print("\n" + "="*50)
print("Exportación completada exitosamente")
print("="*50)
