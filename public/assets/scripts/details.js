async function fetchAlbum(albumId) {
  const response = await fetch(`https://json-server-practice-html.vercel.app/albums/${albumId}`);
  if (!response.ok) {
    throw new Error('Erro ao buscar o álbum');
  }
  return response.json();
}


function albumDetails(albums) {
  document.getElementById('albumName').textContent = albums.name;
  document.getElementById('albumCover').src = albums.cover;
  document.getElementById('albumDescription').textContent = albums.description;
  document.getElementById('locationName').textContent = albums.location_name;
  document.getElementById('locationLat').textContent = albums.location_coordinates[1];
  document.getElementById('locationLong').textContent = albums.location_coordinates[0];
  document.getElementById('albumDate').textContent = albums.date;
}



//função para renderizar página
async function renderDetails() {
  const URLParams = new URLSearchParams(window.location.search);
  const albumId = URLParams.get('id');

  try {
    const album = await fetchAlbum(albumId);
    albumDetails(album);
  } catch (error) {
    alert(error.message);
  }

}

renderDetails();





//Funções para buscar as fotos do album
function cardalbums(fotos) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "col-sm-8 col-md-6 col-xl-2 p-2";
  cardDiv.innerHTML = `
         <div class="card mb-3 d-flex flex-column h-100">
            <div class="card-body">
            <img src="${fotos.image}" alt="imagem" class="fotosImg img-fluid">
            <hr class="cor-site">
              <p class="card-text">${fotos.description}</p>            
            </div>
            <div class="card-footer text-center">
              <button type="button" class="btn btn-dark cor-site" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Ver detalhes
</button>
            </div>
          </div>
        </div>`;
  return cardDiv;
}
function get_albuns() {
  const URLParams = new URLSearchParams(window.location.search);
  const albumId = URLParams.get('id');

  const url = `https://json-server-practice-html.vercel.app/fotos?albumId=${albumId}`;
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
//https://trabalho-pratico-2--joaomarcos157.repl.co/fotos/?_expand=album&albumId=${albumId}
// Função para buscar dados da API e adicionar banners ao carousel
function carregarBanners(albumId) {
  fetch(`https://json-server-practice-html.vercel.app/fotos?albumId=${albumId}`)
    .then(response => response.json())
    .then(data => {
      const carouselIndicators = document.getElementById('carouselIndicators');
      const carouselInner = document.getElementById('carouselInner');

      data.forEach((item, index) => {
        const indicator = document.createElement('button');
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('data-bs-target', '#carouselExampleIndicators');
        indicator.setAttribute('data-bs-slide-to', index.toString());
        if (index === 0) {
          indicator.classList.add('active');
        }
        carouselIndicators.appendChild(indicator);

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
          carouselItem.classList.add('active');
        }
        const banner = `
          <img src="${item.image}" class="d-block img-fluid" alt="${item.description}">
          <div class="carousel-caption d-none d-md-block">
            <h5>${item.description}</h5>
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

//Função do checkbox
let idDestaque = null;

async function initiateCheckbox() {
  const urlParams = new URLSearchParams(window.location.search);
  const albumId = urlParams.get('id');

  try {
    const response = await fetch(`https://json-server-practice-html.vercel.app/destaques?albumId=${albumId}`);
    const data = await response.json();
    setHighlight(data);
  } catch (error) {
    console.error('Album não é destaque', error);
  }

  const checkbox = document.getElementById('highlight');

  checkbox.addEventListener('change', function(event) {
    if (event.target.checked) {
      addHighlight();
      console.log('Checkbox está marcado');
    } else {
      removeHighlight();
      console.log('Checkbox está desmarcado');
    }
  });
}

function setHighlight(highlights) {
  const checkbox = document.getElementById('highlight');

  if (highlights && highlights[0]) {
    checkbox.checked = true;
    idDestaque = highlights[0].id;
  }
}

function addHighlight() {
  const urlParams = new URLSearchParams(window.location.search);
  const albumId = urlParams.get('id');
  idDestaque = albumId;

  const url = `https://json-server-practice-html.vercel.app/destaques`;
  const data = { albumId: parseInt(albumId) };
  const request = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  };
  fetch(url, request).then((response) => {
    console.log(response);
  });
  return true;
}

function removeHighlight() {
  const url = `https://json-server-practice-html.vercel.app/destaques/${idDestaque}`;
  const request = {
    method: "DELETE"
  };
  fetch(url, request).then((response) => {
    console.log(response);
  });
  return true;
}



// Chamar a função para carregar os banners de um álbum específico quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const URLParams = new URLSearchParams(window.location.search);
  const albumId = URLParams.get('id');
  carregarBanners(albumId);
  initiateCheckbox();
});
