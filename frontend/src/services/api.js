const baseApiURL = process.env.REACT_APP_API_BASE_URL || '/api/'; 

// services/api.js

export const get_all_areas = async (tableName = "bairro_popular") => {
    const response = await fetch(`${baseApiURL}/areas?table_name=${encodeURIComponent(tableName)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao obter as áreas');
    }

    return response.json();
};


export const getPixelValues = async (latitude, longitude) => {
    const response = await fetch(`${baseApiURL}/get_pixel_class`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude })
    });

    if (!response.ok) {
        throw new Error('Erro ao obter os valores de pixels');
    }

    return response.json();
};



export const get_products = async (product_prefix = '') => {
    const response = await fetch(`${baseApiURL}/get_products?product_prefix=${product_prefix}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao obter os produtos.');
    }

    return response.json();
};