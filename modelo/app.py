from flask import Flask, request, jsonify  # type: ignore 
import joblib  # type: ignore 
import numpy as np  
# Crear la aplicación Flask
app = Flask(__name__)

# Cargar el modelo entrenado
model = joblib.load('tour_recomendacion_model.pkl')

# Definir la ruta para hacer predicciones
@app.route('/recomendar_tour', methods=['POST'])
def recomendar_tour():
    # Obtener los datos del grupo desde el cuerpo de la solicitud POST
    data = request.json
    edades = data.get('edades')
    
    if not edades:
        return jsonify({'error': 'Se requiere un grupo con edades.'}), 400
    
    # Calcular edad promedio y rango de edades
    edad_promedio = sum(edades) / len(edades)
    rango_edad = max(edades) - min(edades) if len(edades) > 1 else 0
    cantidad_personas = len(edades)

    # Crear la entrada para el modelo
    entrada_modelo = np.array([[cantidad_personas, edad_promedio, rango_edad]])

    # Hacer la predicción
    tour_recomendado = model.predict(entrada_modelo)[0]

    # Devolver la recomendación en formato JSON
    return jsonify({
        'cantidad_personas': cantidad_personas,
        'edad_promedio': edad_promedio,
        'rango_edad': rango_edad,
        'tour_recomendado': tour_recomendado
    })

# Iniciar la aplicación Flask
if __name__ == '__main__':
    app.run(debug=True)
