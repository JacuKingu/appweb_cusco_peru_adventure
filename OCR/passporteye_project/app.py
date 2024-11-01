from flask import Flask, request, jsonify
from PIL import Image
import pytesseract
import io
import re

app = Flask(__name__)

# Especifica la ruta de tesseract si es necesario
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.route('/extract', methods=['POST'])
def extract():
    # Recibe la imagen
    file = request.files['file']
    image = Image.open(io.BytesIO(file.read()))

    # Aplica Tesseract para extraer texto
    text = pytesseract.image_to_string(image)

    # Muestra el texto extraído para depuración
    print("Texto extraído:\n", text)

    # Lógica para extraer nombres, apellidos y nacionalidad
    extracted_info = extract_info_from_mrz(text)

    return jsonify({
        "extracted_text": text,  # Devuelve el texto extraído
        "extracted_info": extracted_info
    })

def extract_info_from_mrz(text):
    # Patrón MRZ para capturar país, apellido y nombres
    mrz_pattern = r'P<([A-Z]{3})([A-Z<]+)<<([A-Z<]+)'
    match = re.search(mrz_pattern, text.replace('\n', ''))

    if match:
        country = match.group(1)
        surname = match.group(2).replace('<', ' ').strip()
        given_names = match.group(3).replace('<', ' ').strip()

        return {
            "pais": country,
            "apellido": surname,
            "nombres": given_names
        }

    return {"error": "No MRZ data found"}

if __name__ == "__main__":
    app.run(port=5001)
