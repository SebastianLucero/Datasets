#!/usr/bin/env python3
"""
Script para explorar la estructura de los datasets
"""
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

print("=" * 80)
print("EXPLORACIÓN DE DATASETS")
print("=" * 80)

# Archivo 1: DI_Crosstab65656.xls
print("\n" + "=" * 80)
print("1. DI_Crosstab65656.xls")
print("=" * 80)
try:
    df1 = pd.read_excel('DI_Crosstab65656.xls')
    print(f"\nDimensiones: {df1.shape[0]} filas x {df1.shape[1]} columnas")
    print(f"\nColumnas:\n{df1.columns.tolist()}")
    print(f"\nPrimeras filas:")
    print(df1.head())
    print(f"\nInformación del dataset:")
    print(df1.info())
    print(f"\nEstadísticas descriptivas:")
    print(df1.describe())
except Exception as e:
    print(f"Error al leer archivo: {e}")

# Archivo 2: ln ventas por provincia.xlsx
print("\n" + "=" * 80)
print("2. ln ventas por provincia.xlsx")
print("=" * 80)
try:
    df2 = pd.read_excel('ln ventas por provincia.xlsx')
    print(f"\nDimensiones: {df2.shape[0]} filas x {df2.shape[1]} columnas")
    print(f"\nColumnas:\n{df2.columns.tolist()}")
    print(f"\nPrimeras filas:")
    print(df2.head())
    print(f"\nInformación del dataset:")
    print(df2.info())
    print(f"\nEstadísticas descriptivas:")
    print(df2.describe())
except Exception as e:
    print(f"Error al leer archivo: {e}")

# Archivo 3: TablaPIBRamas2000-2021trimetral.xlsx
print("\n" + "=" * 80)
print("3. TablaPIBRamas2000-2021trimetral.xlsx")
print("=" * 80)
try:
    df3 = pd.read_excel('TablaPIBRamas2000-2021trimetral.xlsx')
    print(f"\nDimensiones: {df3.shape[0]} filas x {df3.shape[1]} columnas")
    print(f"\nColumnas:\n{df3.columns.tolist()}")
    print(f"\nPrimeras filas:")
    print(df3.head(10))
    print(f"\nInformación del dataset:")
    print(df3.info())
    print(f"\nEstadísticas descriptivas:")
    print(df3.describe())
except Exception as e:
    print(f"Error al leer archivo: {e}")
