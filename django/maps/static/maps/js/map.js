var map = L.map('map').setView([-19.917299, -43.934559], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

var drawnRectangle;
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
    },
    draw: {
        polygon: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
        rectangle: {
            shapeOptions: {
                clickable: true,
            },
        },
    },
});

map.addControl(drawControl);

map.on('draw:created', function (e) {
    if (drawnRectangle) {
        map.removeLayer(drawnRectangle);
    }
    drawnRectangle = e.layer;
    map.addLayer(drawnRectangle);

    // Obter as coordenadas do retângulo
    var bounds = drawnRectangle.getBounds();
    var northEast = bounds.getNorthEast();
    var southWest = bounds.getSouthWest();

    // Preencher o formulário com as coordenadas
    document.getElementById('latitude_inicial').value = southWest.lat;
    document.getElementById('longitude_inicial').value = southWest.lng;
    document.getElementById('latitude_final').value = northEast.lat;
    document.getElementById('longitude_final').value = northEast.lng;

    drawnItems.addLayer(drawnRectangle);
});

map.on('click', function () {
    if (drawnRectangle) {
        map.removeLayer(drawnRectangle);
        drawnRectangle = null;

        document.getElementById('latitude_inicial').value = '';
        document.getElementById('longitude_inicial').value = '';
        document.getElementById('latitude_final').value = '';
        document.getElementById('longitude_final').value = '';
    }
});



function enviarRequisicaoJson(url, dados) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(dados)
    });
}

// Função auxiliar para obter o valor do cookie CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function buscarDados() {
    // Obtenha as coordenadas do formulário
    var latitudeInicial = document.getElementById('latitude_inicial').value;
    var longitudeInicial = document.getElementById('longitude_inicial').value;
    var latitudeFinal = document.getElementById('latitude_final').value;
    var longitudeFinal = document.getElementById('longitude_final').value;

    // Construindo o objeto com os dados
    var dados = {
        latitude_inicial: latitudeInicial,
        longitude_inicial: longitudeInicial,
        latitude_final: latitudeFinal,
        longitude_final: longitudeFinal,
    };

    // Enviando a requisição AJAX
    enviarRequisicaoJson('/get_images/', dados)
    .then(response => response.json())
    .then(data => {
        // Exibir cada imagem no mapa
        data.images.forEach(urlDaImagem => {
            exibirImagemNoMapa(urlDaImagem);
        });
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}


function downloadDados() {
    var dados = {
        latitude_inicial: document.getElementById('latitude_inicial').value,
        longitude_inicial: document.getElementById('longitude_inicial').value,
        latitude_final: document.getElementById('latitude_final').value,
        longitude_final: document.getElementById('longitude_final').value
    };

    enviarRequisicaoJson('/download_cube/', dados)
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Falha no download');
    })
    .then(blob => {
        // Cria um link para download
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'datacube_images.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Erro ao baixar dados:', error));
}




function exibirImagemNoMapa() {
    // Obter as coordenadas do formulário
    var latitudeInicial = document.getElementById('latitude_inicial').value;
    var longitudeInicial = document.getElementById('longitude_inicial').value;
    var latitudeFinal = document.getElementById('latitude_final').value;
    var longitudeFinal = document.getElementById('longitude_final').value;

    // Construir a URL da imagem
    var urlDaImagem = `http://localhost:8000/wms?service=WMS&version=1.3.0&request=GetMap&layers=bh_aerial_image_1999&styles=&crs=EPSG:4326&bbox=${latitudeInicial},${longitudeInicial},${latitudeFinal},${longitudeFinal}&width=400&height=200&format=image/png`;

    // Definir os limites da imagem
    var imageBounds = [[latitudeInicial, longitudeInicial], [latitudeFinal, longitudeFinal]];

    // Adicionar a imagem como uma sobreposição ao mapa
    L.imageOverlay(urlDaImagem, imageBounds).addTo(map);
}



function calcularBboxWidthHeight() {
    // Obter as coordenadas do formulário e convertê-las para números
    var latitudeInicial = parseFloat(document.getElementById('latitude_inicial').value);
    var longitudeInicial = parseFloat(document.getElementById('longitude_inicial').value);
    var latitudeFinal = parseFloat(document.getElementById('latitude_final').value);
    var longitudeFinal = parseFloat(document.getElementById('longitude_final').value);

    // Calcular bbox
    var bbox = [
        Math.max(longitudeInicial, longitudeFinal),
        Math.max(latitudeInicial, latitudeFinal),
        Math.min(longitudeInicial, longitudeFinal),
        Math.min(latitudeInicial, latitudeFinal),
    ];

    // Calcular width e height mantendo a proporção
    var width = Math.abs(longitudeFinal - longitudeInicial);
    var height = Math.abs(latitudeFinal - latitudeInicial);

    return { bbox, width, height };
}

function addWMSLayer() {
    var button = document.getElementById('buscarDadosButton');
    button.disabled = true;  // Disable the button

    var { bbox, width, height } = calcularBboxWidthHeight();

    var wmsLayer = L.tileLayer.wms('http://localhost:8000', {
        layers: 'bh_aerial_image_1999',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG4326,
        bbox: bbox.join(','),
        width: width,
        height: height,
    });

    wmsLayer.on('tileloadstart', function (event) {
        console.log('Iniciando o carregamento do azulejo:', event.coords);
    });

    wmsLayer.on('tileloadend', function (event) {
        console.log('Concluído o carregamento do azulejo:', event.coords);
        button.disabled = false;  // Re-enable the button after loading is complete
    });

    wmsLayer.addTo(map);
}

