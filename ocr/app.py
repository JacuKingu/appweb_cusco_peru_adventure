# Debemos poner una aplicación en Py para poder crear un microservicio 
# para poder extraer los datos de los pasaportes.

from fastapi import FastAPI, File, UploadFile
import requests
import base64

app = FastAPI()

API_KEY = 'MNN6kUVJEQTOSuRTt7zM0f5AkuuIbWAu'  # Reemplaza con tu clave de API real
API_URL = 'https://dochorizon.klippa.com/api/services/document_capturing/v1/identity'  # URL correcta del endpoint

def encode_image_to_base64(file):
    return base64.b64encode(file.read()).decode('utf-8')

def create_payload(image_base64):
    return {
        "documents": [
            {
                "data": image_base64
            }
        ]
    }

def send_request(image_base64):
    headers = {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
    }
    payload = create_payload(image_base64)
    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()  # Convertir la respuesta a JSON
        text_fields = data.get("data", {}).get("components", {}).get("text_fields", {})
        return {"status": "success", "text_fields": text_fields}
    else:
        return {"status": "error", "code": response.status_code, "message": response.text}

@app.post("/upload/")
async def upload_image(files: list[UploadFile] = File(...)):
    results = []
    for file in files:
        # Leer y codificar el archivo en Base64
        image_base64 = encode_image_to_base64(file.file)
        # Enviar la solicitud a la API externa
        result = send_request(image_base64)
        results.append({"filename": file.filename, "result": result})
    
    return {"files": results}