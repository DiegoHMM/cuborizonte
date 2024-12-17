const baseApiURL = process.env.REACT_APP_API_BASE_URL || '/api/'; 

// services/api.js


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



export const get_classified_products = async () => {
    const response = await fetch(`${baseApiURL}/get_classified_products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao obter os produtos classificados');
    }

    return response.json();
};


export const get_ortho_products = async () => {
    const response = await fetch(`${baseApiURL}/get_ortho_products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao obter os produtos de ortofotos');
    }

    return response.json();
};


export const get_plan_products = async () => {
    const response = await fetch(`${baseApiURL}/get_plan_products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao obter os produtos de plantas');
    }

    return response.json();
};
