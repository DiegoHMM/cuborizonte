// services/api.js
export const getPixelValues = async (latitude, longitude) => {
    const response = await fetch('/api/get_pixel_class', {
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
