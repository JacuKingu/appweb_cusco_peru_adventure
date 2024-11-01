from flask import Flask, request, jsonify
from passporteye import read_mrz
import fitz  # PyMuPDF para manejar el PDF
import os

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def extract_mrz():
    files = request.files.getlist('file')
    if not files:
        return jsonify({"error": "No files provided"}), 400

    results = []
    for file in files:
        # Guardar cada archivo PDF temporalmente
        pdf_path = "./temp_passport.pdf"
        file.save(pdf_path)

        # Extraer la primera página como imagen
        doc = fitz.open(pdf_path)
        page = doc.load_page(0)
        pix = page.get_pixmap()
        image_path = "./temp_passport.png"
        pix.save(image_path)

        # Procesar la imagen con PassportEye
        mrz = read_mrz(image_path)
        doc.close()
        
        # Borrar archivos temporales
        os.remove(pdf_path)
        os.remove(image_path)

        if mrz is None:
            results.append({"file": file.filename, "error": "No MRZ found"})
        else:
            # Convertir el resultado a un diccionario
            results.append({"file": file.filename, "data": mrz.to_dict()})

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
