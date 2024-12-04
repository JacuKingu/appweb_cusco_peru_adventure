from flask import Flask, request, jsonify
from dotenv import load_dotenv
import fitz  # PyMuPDF
import base64
import io
import os

load_dotenv()

app = Flask(__name__)

@app.route('/convert-pdf', methods=['POST'])
def convert_pdf():
    try:
        # Obtener el PDF en Base64 desde la solicitud
        pdf_base64 = request.json.get('pdf')
        if not pdf_base64:
            return jsonify({'error': 'PDF no proporcionado'}), 400

        # Decodificar el PDF de Base64 a bytes
        pdf_bytes = base64.b64decode(pdf_base64)

        # Cargar el archivo PDF en PyMuPDF
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        image_base64_list = []

        # Convertir cada página del PDF a imagen en formato JPEG
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            pix = page.get_pixmap()
            
            # Guardar la imagen en memoria y codificarla en Base64
            buffer = io.BytesIO()
            pix.save(buffer, format="JPEG")
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            image_base64_list.append(image_base64)

        pdf_document.close()

        # Retornar las imágenes como Base64 en una lista
        return jsonify({'images': image_base64_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Ejecutar la aplicación en el puerto 5002
if __name__ == '__main__':
    port = int(os.getenv('PORT',5003))
    app.run(host='0.0.0.0', port=port)
    """ app.run(debug=True, port=port) """
