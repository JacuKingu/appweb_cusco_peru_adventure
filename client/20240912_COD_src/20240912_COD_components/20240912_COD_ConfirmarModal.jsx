import React from 'react';
import PropTypes from 'prop-types'; // Asegúrate de importar PropTypes

const ConfirmarModal = ({ isOpen, onClose, onConfirm, mensaje }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4">{mensaje}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmarModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    mensaje: PropTypes.string.isRequired,
};

export default ConfirmarModal;
