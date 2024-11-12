# Recomendación de Tours para Grupos

Este proyecto utiliza **OCR** mediante una api y lo despliega como un microservicio usando **Flask**.

## Requisitos

- Python 3.8 o superior
- pip (administrador de paquetes)

## Instalación

1. Clona este repositorio

2. Crea un entorno virtual y actívalo (en caso no funciona por powershell, puedes probar por cmd como administrador en la carpeta del archivo):

```bash
# En Windows:
python -m venv venv
venv\Scripts\activate
# En macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# Para salir
deactivate
exit


3. Instala dependencias:

```bash
pip install -r requirements.txt

4. Ejecutar el microservicio:

```bash
python app.py