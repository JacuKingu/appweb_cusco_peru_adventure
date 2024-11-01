from flask import Flask, request, jsonify
from passporteye import read_mrz
from PIL import Image
import pytesseract
import io

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def extract():
    # Recibe el archivo PDF
    file = request.files['file']
    
    # Lee la MRZ (zona de lectura mecánica) usando PassportEye
    mrz = read_mrz(file)
    mrz_data = mrz.to_dict() if mrz else None

    # Convierte el PDF a imagen si es necesario
    file.seek(0)  # Resetear el puntero del archivo para leerlo de nuevo
    image = Image.open(io.BytesIO(file.read()))
    
    # Aplica Tesseract para OCR general en la imagen del pasaporte
    text = pytesseract.image_to_string(image)

    return jsonify({
        "mrz_data": mrz_data,
        "ocr_text": text
    })

if __name__ == "__main__":
    app.run(port=5001)
    print("Microservicio de OCR en ejecución en http://127.0.0.1:5001")

