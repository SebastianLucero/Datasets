#!/usr/bin/env python3
"""
Preparar datos para análisis Event Study / Difference-in-Differences
del impacto del terremoto de Ecuador 2016 en ventas cantonales
"""
import pandas as pd
import numpy as np
import json
import warnings
warnings.filterwarnings('ignore')

print("="*70)
print("PROCESAMIENTO DE DATOS PARA EVENT STUDY / DIFF-IN-DIFF")
print("="*70)

# Cargar datos
df_ventas = pd.read_excel('ln ventas por provincia.xlsx')
df_terremoto = pd.read_excel('DI_Crosstab65656.xls')

# Limpiar datos de terremoto
df_terremoto.columns = df_terremoto.iloc[0]
df_terremoto = df_terremoto.iloc[1:].reset_index(drop=True)
df_terremoto = df_terremoto[df_terremoto['Cantón'] != 'TOTAL']

# Identificar cantones afectados
cantones_afectados = set(df_terremoto['Cantón'].str.upper())
cantones_ventas = set(df_ventas['canton'].str.upper())
cantones_tratados = cantones_afectados.intersection(cantones_ventas)

print(f"\nCantones tratados (afectados por terremoto): {len(cantones_tratados)}")
print(f"Cantones control (no afectados): {len(cantones_ventas) - len(cantones_tratados)}")

# Crear dataset para event study
years = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019]
event_year = 2016

event_study_data = []

for _, row in df_ventas.iterrows():
    canton = row['canton']
    is_treated = canton.upper() in cantones_tratados

    for year in years:
        event_time = year - event_year  # -4, -3, -2, -1, 0, 1, 2, 3

        event_study_data.append({
            'canton': canton,
            'year': year,
            'event_time': event_time,
            'treated': is_treated,
            'post': 1 if year >= event_year else 0,
            'ln_ventas': float(row[year])
        })

# Calcular promedios por grupo
df_event = pd.DataFrame(event_study_data)

# Promedios por grupo y tiempo
group_means = df_event.groupby(['event_time', 'treated'])['ln_ventas'].mean().reset_index()
group_means['group'] = group_means['treated'].map({True: 'Tratados', False: 'Control'})

# Convertir a JSON
group_data = []
for treated in [True, False]:
    data_subset = group_means[group_means['treated'] == treated]
    group_data.append({
        'group': 'Tratados (Afectados)' if treated else 'Control (No Afectados)',
        'treated': treated,
        'values': [
            {
                'event_time': int(row['event_time']),
                'year': int(event_year + row['event_time']),
                'ln_ventas': float(row['ln_ventas'])
            }
            for _, row in data_subset.iterrows()
        ]
    })

with open('data_event_study.json', 'w', encoding='utf-8') as f:
    json.dump(group_data, f, indent=2, ensure_ascii=False)

print("✓ data_event_study.json creado")

# ============================================================================
# CALCULAR ESTIMADORES DIFF-IN-DIFF
# ============================================================================

# Pre-treatment period: 2012-2015
# Post-treatment period: 2016-2019

pre_treated = df_event[(df_event['year'] < 2016) & (df_event['treated'] == True)]['ln_ventas'].mean()
pre_control = df_event[(df_event['year'] < 2016) & (df_event['treated'] == False)]['ln_ventas'].mean()
post_treated = df_event[(df_event['year'] >= 2016) & (df_event['treated'] == True)]['ln_ventas'].mean()
post_control = df_event[(df_event['year'] >= 2016) & (df_event['treated'] == False)]['ln_ventas'].mean()

# Diff-in-Diff estimator
did_estimator = (post_treated - pre_treated) - (post_control - pre_control)

did_data = {
    'pre_treatment': {
        'treated': float(pre_treated),
        'control': float(pre_control),
        'diff': float(pre_treated - pre_control)
    },
    'post_treatment': {
        'treated': float(post_treated),
        'control': float(post_control),
        'diff': float(post_treated - post_control)
    },
    'did_estimator': float(did_estimator),
    'interpretation': 'Negativo indica impacto negativo del terremoto' if did_estimator < 0 else 'Positivo indica efecto positivo post-terremoto'
}

with open('data_did.json', 'w', encoding='utf-8') as f:
    json.dump(did_data, f, indent=2, ensure_ascii=False)

print("✓ data_did.json creado")

print("\n" + "="*70)
print("RESULTADOS PRELIMINARES")
print("="*70)
print(f"\nPromedio Pre-tratamiento:")
print(f"  Tratados: {pre_treated:.4f}")
print(f"  Control:  {pre_control:.4f}")
print(f"  Diferencia: {pre_treated - pre_control:.4f}")

print(f"\nPromedio Post-tratamiento:")
print(f"  Tratados: {post_treated:.4f}")
print(f"  Control:  {post_control:.4f}")
print(f"  Diferencia: {post_treated - post_control:.4f}")

print(f"\nDiD Estimator: {did_estimator:.4f}")
print(f"Interpretación: {did_data['interpretation']}")

# ============================================================================
# CALCULAR EFECTOS POR AÑO (EVENT STUDY COEFFICIENTS)
# ============================================================================

# Baseline: año -1 (2015, año antes del terremoto)
baseline_treated = df_event[(df_event['year'] == 2015) & (df_event['treated'] == True)]['ln_ventas'].mean()
baseline_control = df_event[(df_event['year'] == 2015) & (df_event['treated'] == False)]['ln_ventas'].mean()

event_coefficients = []

for year in years:
    event_time = year - event_year

    treated_mean = df_event[(df_event['year'] == year) & (df_event['treated'] == True)]['ln_ventas'].mean()
    control_mean = df_event[(df_event['year'] == year) & (df_event['treated'] == False)]['ln_ventas'].mean()

    # Calcular diferencia respecto al baseline
    treated_diff = treated_mean - baseline_treated
    control_diff = control_mean - baseline_control

    # Coeficiente de event study (diferencia de diferencias)
    coefficient = treated_diff - control_diff

    event_coefficients.append({
        'event_time': int(event_time),
        'year': int(year),
        'coefficient': float(coefficient),
        'treated_mean': float(treated_mean),
        'control_mean': float(control_mean)
    })

with open('data_event_coefficients.json', 'w', encoding='utf-8') as f:
    json.dump(event_coefficients, f, indent=2, ensure_ascii=False)

print("✓ data_event_coefficients.json creado")

# ============================================================================
# DATOS INDIVIDUALES POR CANTÓN
# ============================================================================

canton_data = []
for _, row in df_ventas.iterrows():
    is_treated = row['canton'].upper() in cantones_tratados

    values = []
    for year in years:
        values.append({
            'year': year,
            'event_time': year - event_year,
            'ln_ventas': float(row[year])
        })

    canton_data.append({
        'canton': row['canton'],
        'treated': is_treated,
        'values': values
    })

with open('data_cantons_panel.json', 'w', encoding='utf-8') as f:
    json.dump(canton_data, f, indent=2, ensure_ascii=False)

print("✓ data_cantons_panel.json creado")

print("\n" + "="*70)
print("PROCESAMIENTO COMPLETADO")
print("="*70)
print("\nArchivos generados:")
print("  1. data_event_study.json - Promedios por grupo para parallel trends")
print("  2. data_did.json - Estimador DiD y estadísticas")
print("  3. data_event_coefficients.json - Coeficientes de event study")
print("  4. data_cantons_panel.json - Panel completo de cantones")
