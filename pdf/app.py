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
        # Recibir el archivo binario del PDF
        pdf_bytes = request.data

        # Cargar el archivo PDF en PyMuPDF
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        image_base64_list = []

        # Convertir cada página del PDF a imagen en formato JPEG
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            pix = page.get_pixmap()

            # Convertir la imagen a bytes en formato JPEG
            image_bytes = pix.tobytes("jpeg")
            # Codificar la imagen en Base64
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
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
