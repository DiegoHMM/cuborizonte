var map = L.map('map', {
    center: [-19.917299, -43.934559],
    zoom: 10,
    minZoom: 16, 
    maxZoom: 18,
    zoomSnap: 2,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var drawnRectangle;
var drawnBounds;
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

const produtosData = {
    "planta": [
        {"date": ["1942-01-01","1942-12-01"], "product": "bh_planta_1942"},
        {"date": ["1972-01-01","1972-12-01"], "product": "bh_planta_1972_1989"},
        {"date": ["1989-01-01","1989-12-01"], "product": "bh_planta_1972_1989"}
    ],
    "ortofoto": [
        {"date": ["1999-01-01","1999-12-01"], "product": "bh_ortophoto_1999"},
        {"date": ["2007-01-01","2007-12-01"], "product": "bh_ortophoto_2007_2015"},
        {"date": ["2015-01-01","2015-12-01"], "product": "bh_ortophoto_2007_2015"}
    ]
};


function startDrawing(event) {
    if (event) event.preventDefault();
    // Ativa o modo de desenho de retângulo
    new L.Draw.Rectangle(map, drawControl.options.rectangle).enable();
}


map.addControl(drawControl);

map.on('draw:created', function (e) {
    if (drawnRectangle) {
        map.removeLayer(drawnRectangle);
    }
    drawnRectangle = e.layer;
    drawnBounds = e.layer.getBounds();
    map.addLayer(drawnRectangle);

    // Ajustar o zoom do mapa para o retângulo desenhado
    map.fitBounds(drawnBounds);

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

function atualizarProdutosFiltrados() {
    let categoriaSelecionada = document.getElementById('produto').value;
    let startDate = new Date(document.getElementById('start_date').value);
    let endDate = new Date(document.getElementById('end_date').value);

    let produtosFiltrados = filtrarProdutosPorData(categoriaSelecionada, startDate, endDate);
    adicionarBulletPoints(produtosFiltrados);
}


function filtrarProdutosPorData(categoriaSelecionada, startDate, endDate) {
    let produtosFiltrados = [];
    let categoriasParaFiltrar = categoriaSelecionada === 'todos' ? Object.keys(produtosData) : [categoriaSelecionada];

    categoriasParaFiltrar.forEach(categoria => {
        produtosData[categoria].forEach(item => {
            let itemStartDate = new Date(item.date[0]);
            let itemEndDate = new Date(item.date[1]);
            if (itemStartDate <= endDate && itemEndDate >= startDate) {
                produtosFiltrados.push(item);
            }
        });
    });

    return produtosFiltrados;
}



function adicionarBulletPoints(produtosFiltrados) {
    const linhaDoTempo = document.getElementById('linhaDoTempo');
    linhaDoTempo.innerHTML = '';

    if (produtosFiltrados.length > 0) {
        document.getElementById('imageSliderLabel').style.display = 'block';
    }

    produtosFiltrados.sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));

    produtosFiltrados.forEach(item => {
        const bulletPoint = document.createElement('div');
        bulletPoint.classList.add('bulletPoint');
        bulletPoint.setAttribute('title', `${item.product} - De ${item.date[0]} até ${item.date[1]}`);
        linhaDoTempo.appendChild(bulletPoint);

        bulletPoint.addEventListener('click', () => {
            console.log(`Bullet point para o produto ${item.product} com intervalo de datas ${item.date} clicado.`);
            addWMSLayer(item);
        });
    });
}

function addWMSLayer(item) {
    console.log(map.getZoom());
    if (!drawnRectangle || !map.hasLayer(drawnRectangle)) {
        alert("Por favor, desenhe um retângulo no mapa primeiro.");
        return;
    }

    var wmsLayer = L.tileLayer.wms('http://localhost:8000', {
        layers: item.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        // Use os limites de drawnRectangle diretamente
        bounds: drawnRectangle.getBounds(),
        time: `${item.date[0]}/${item.date[1]}`,
    });

    wmsLayer.addTo(map);
}
