from flask import Flask, request, jsonify
import base64
import requests

app = Flask(__name__)

API_KEY = 'MNN6kUVJEQTOSuRTt7zM0f5AkuuIbWAu'  # Reemplaza con tu clave de API real
url = 'https://dochorizon.klippa.com/api/services/document_capturing/v1/identity'  # URL correcta del endpoint

def encode_image_to_base64(file_path):
    """Convierte la imagen en una cadena base64"""
    with open(file_path, 'rb') as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def create_payload(image_base64):
    """Crea el payload que se enviará a la API con la imagen codificada en base64"""
    return {
        "documents": [
            {
                "data": image_base64,
                "type": "jpeg"  # Puedes cambiar a "png", "pdf", etc., según lo que requiera la API externa
            }
        ]
    }

def send_request(image_base64):
    """Envía la solicitud a la API externa con la imagen codificada en base64"""
    headers = {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
    }
    payload = create_payload(image_base64)
    response = requests.post(url, headers=headers, json=payload)

    return response

@app.route('/procesar_imagenes', methods=['POST'])
def procesar_imagenes():
    """Recibe y procesa varias imágenes, enviándolas a la API externa"""
    
    if 'imagenes' not in request.files:
        return jsonify({'error': 'No se encontraron archivos de imagen'}), 400
    
    imagenes = request.files.getlist('imagenes')
    
    if not imagenes:
        return jsonify({'error': 'No se encontraron imágenes'}), 400
    
    resultados = []
    
    for imagen in imagenes:
        # Codificar cada imagen a base64
        image_base64 = base64.b64encode(imagen.read()).decode('utf-8')
        
        # Enviar la imagen a la API externa
        response = send_request(image_base64)
        
        if response.status_code == 200:
            data = response.json()  # Convertir la respuesta a JSON
            text_fields = data.get("data", {}).get("components", {}).get("text_fields", {})
            resultados.append({
                'status': 'success',
                'text_fields': text_fields
            })
        else:
            resultados.append({
                'status': 'error',
                'message': response.text
            })
    
    return jsonify(resultados)

# Ejecutar la aplicación en el puerto 5002
if __name__ == '__main__':
    app.run(debug=True, port=5002)
