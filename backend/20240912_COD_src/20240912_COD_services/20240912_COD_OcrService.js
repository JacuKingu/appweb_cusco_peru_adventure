import * as clienteModel from '../20240912_COD_models/20240912_COD_clientesModel.js';
import * as pasaporteModel from '../20240912_COD_models/20240912_COD_pasaporteModel.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { convert } from 'pdf-poppler';
import path from 'path';

export const procesarImagenes = async (imagenes) => {
    try {
        // Crear un objeto FormData para enviar archivos como multipart/form-data
        const formData = new FormData();

        // Agregar cada imagen al FormData bajo el campo 'imagenes'
        imagenes.forEach((imagen, index) => {
            const fileStream = fs.createReadStream(imagen);
            formData.append('imagenes', fileStream, `temp-${index}.jpeg`);
        });

        // Hacer la solicitud POST al microservicio Flask
        const response = await axios.post('http://localhost:5002/procesar_imagenes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...formData.getHeaders() // Agregar los encabezados necesarios para multipart/form-data
            }
        });

        // Retornar la respuesta JSON con los resultados
        return response.data;
    } catch (error) {
        console.error('Error al procesar imágenes (Servicio):', error);
        throw new Error('Error al comunicarse con el microservicio Flask');
    }
};

export const guardarClientesYPasaportes = async (resultadosOcr, id) => {
    try {
        for (const resultado of resultadosOcr) {
            const { text_fields } = resultado;
            const {
                given_names,
                surname,
                date_of_birth,
                document_number,
                nationality,
                date_of_expiry
            } = text_fields;

            // Insertar cliente y obtener el id generado
            const cliente = await clienteModel.insertarCliente(
                given_names,      // nombre
                surname,          // apellido
                null,             // email (puedes reemplazar con un valor o dejar null)
                null,             // telefono
                date_of_birth,    // fecha_nacimiento
                id              // id_grupo
            );
            const id_cliente = cliente[0].id_cliente; // Obtén el id generado al insertar el cliente

            // Insertar pasaporte usando el id_cliente generado
            await pasaporteModel.insertarPasaporte(
                id_cliente,           // id_cliente
                document_number,       // numero_pasaporte
                nationality,           // pais_emision
                date_of_expiry         // fecha_expiracion
            );
        }

        return { success: true, message: 'Datos guardados en ambas tablas correctamente' };

    } catch (error) {
        console.error('Error al guardar clientes y pasaportes:', error);
        throw error;
    }
};