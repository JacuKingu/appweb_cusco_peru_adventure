import pandas as pd
from sklearn.model_selection import train_test_split 
from sklearn.ensemble import RandomForestClassifier 
import joblib 
import json

# Cargar el archivo JSON
with open('dataset.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Convertir los datos a un DataFrame de pandas
df = pd.DataFrame(data)

# Imprimir las primeras filas del DataFrame para verificar
print(df.head())

# Variables de entrada (X) y la variable objetivo (y)
X = df[['cantidad_personas', 'edad_promedio', 'rango_edad']]
y = df['tour_recomendado']

# Dividir los datos en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entrenar el modelo de Random Forest
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Guardar el modelo entrenado
joblib.dump(model, 'tour_recomendacion_model.pkl')
print("Modelo entrenado y guardado como 'tour_recomendacion_model.pkl'")