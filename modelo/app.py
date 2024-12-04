from flask import Flask, request, jsonify
from dotenv import load_dotenv
import joblib  
import numpy as np  
import pandas as pd
import os

load_dotenv()

# Crear la aplicación Flask
app = Flask(__name__)

# Cargar el modelo entrenado
model = joblib.load('tour_recomendacion_model.pkl')

# Definir la ruta para hacer predicciones
@app.route('/recomendar_tour', methods=['POST'])
def recomendar_tour():
    # Obtener los datos del grupo desde el cuerpo de la solicitud POST
    data = request.json
    
    # Validar que todos los campos necesarios están en la solicitud
    required_fields = ['edades', 'destino_preferido', 'duracion_viaje', 'nivel_actividad', 'presupuesto', 'tipo_actividades']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Falta el campo: {field}'}), 400
            
    edades = data['edades']
    destino_preferido = data['destino_preferido']
    duracion_viaje = data['duracion_viaje']
    nivel_actividad = data['nivel_actividad']
    presupuesto = data['presupuesto']
    tipo_actividades = data['tipo_actividades']
    
    # Calcular edad promedio y rango de edades
    edad_promedio = sum(edades) / len(edades)
    rango_edad = max(edades) - min(edades) if len(edades) > 1 else 0
    cantidad_personas = len(edades)

    # Crear un DataFrame para la entrada del modelo
    entrada_df = pd.DataFrame([{
        'Cantidad de Personas': cantidad_personas,
        'Edad promedio': edad_promedio,
        'Duracion del Viaje': duracion_viaje,
        'Rango de Edad': rango_edad,
        'Destino Preferido': destino_preferido,
        'Nivel de actividad Fisica': nivel_actividad,
        'Presupuesto': presupuesto,
        'Tipo de Actividades': tipo_actividades
    }])

    # Preprocesar las variables categóricas de entrada
    entrada_df = pd.get_dummies(entrada_df, columns=['Rango de Edad', 'Destino Preferido', 
                                                      'Nivel de actividad Fisica', 'Presupuesto', 
                                                      'Tipo de Actividades'], drop_first=True)

    # Alinear las columnas del DataFrame de entrada con las columnas del modelo
    # Esto asegura que la entrada tenga las mismas características que se usaron para entrenar el modelo
    entrada_df = entrada_df.reindex(columns=model.feature_names_in_, fill_value=0)

    # Hacer la predicción
    tour_recomendado = model.predict(entrada_df)[0]

    # Devolver la recomendación en formato JSON
    return jsonify({
        'cantidad_personas': cantidad_personas,
        'edad_promedio': edad_promedio,
        'rango_edad': rango_edad,
        'tour_recomendado': tour_recomendado
    })

# Iniciar la aplicación Flask
if __name__ == '__main__':
    port = int(os.getenv('PORT',5000))
    app.run(host='0.0.0.0', port=port)
    """ app.run(debug=True, port=port) """
