//Funções da API MAPBOX
function get_map() {
  //token de acesso
  mapboxgl.accessToken = 'pk.eyJ1IjoiampvYW9tIiwiYSI6ImNscGd4Nnc4NjAyMzEyaXFxZXZxcnB5Y3MifQ.O5MMC3OgpvDBoi_vSuw4MA';

  //posição inicial
  const initialPosition = [-43.91667, -19.91667];

  //renderiza o mapa no site
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/jjoaom/clpjxuw1900ea01p86xfd9ojf', // style URL
    attributionControl: false,
    center: initialPosition, // posição inicial [lng, lat]
    zoom: -1, // starting zoom
  });


  return map;
}
function get_card_marker(albums) {
  return `<a class="text-decoration-none text-reset" "href="./detalhe_album.html?id=${albums.id}" target="_blank">
    <img src="${albums.cover}" class="card-img-top img-fluid" alt="${albums.name}">
    <div class="card-body" id="scroll-container">
        <h5 class="card-title text-nowrap text-dark" id="scroll-text">${albums.name}</h5>
        <p class="card-text text-dark">${albums.location_name}</p>
    </div>
    </a>`
}


//fetch(url).then(response).then(faça outra coisa)
function get_locations(map) {
  const url = 'https://trabalho-pratico-2--joaomarcos157.repl.co/albums'
  fetch(url)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((albums) => {
        albums.forEach((item) => {
        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(get_card_marker(item));
        const marker = new mapboxgl.Marker({ color: "black" })
          .setLngLat(item.location_coordinates)
          .setPopup(popup)
          .addTo(map);
      });
    });
}


const map = get_map();
get_locations(map);


//Funções para buscar os albuns
function cardalbums(albums) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "col-sm-8 col-md-6 col-xl-2 p-2";
  cardDiv.innerHTML = `
         <div class="card mb-3 d-flex flex-column h-100">
            <img src="${albums.cover}" alt="imagem" height="200px" class="card-img-top object-fit-cover">
            <div class="card-body">
              <h5 class="card-title">${albums.name}</h5>
              <p class="card-text">${albums.description}</p>            
            </div>
            <div class="card-footer text-center">
              <a href="./detalhe_album.html?id=${albums.id}" class="btn btn-dark cor-site ">Vá para álbuns</a>
            </div>
          </div>
        </div>`;
  return cardDiv;
}

function get_albuns() {

  const url = 'https://trabalho-pratico-2--joaomarcos157.repl.co/albums'
  fetch(url)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((albums) => {
        albums.forEach((item) => {
        const albums = document.getElementById("conteudoalbums");
          albums.appendChild(cardalbums(item));

      });
    });
}
get_albuns();


// Função para buscar dados da API e adicionar banners ao carousel
function carregarBanners() {
  fetch('https://trabalho-pratico-2--joaomarcos157.repl.co/destaques/?_expand=album')
    .then(response => response.json())
    .then(data => {
      const carouselIndicators = document.getElementById('carouselIndicators');
      const carouselInner = document.getElementById('carouselInner');

      // Para cada item, criar um indicador e um banner no carousel
      data.forEach((item, index) => {
        // Criar o indicador
        const indicator = document.createElement('button');
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
        indicator.setAttribute('data-bs-slide-to', index.toString());
        if (index === 0) {
          indicator.classList.add('active');
        }
        carouselIndicators.appendChild(indicator);

        // Criar o banner
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
          carouselItem.classList.add('active');
        }
        const banner = `
          <img src="${item.album.cover}" class="d-block w-100 destaqueImg" alt="${item.album.name}">
          <div class="carousel-caption d-none d-md-block">
            <h5>${item.album.name}</h5>
          </div>
        `;
        carouselItem.innerHTML = banner;
        carouselInner.appendChild(carouselItem);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar dados:', error);
      // Lidar com erros ou exibir uma mensagem se necessário
    });
}

// Chamar a função para carregar os banners quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', carregarBanners);
