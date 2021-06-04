//-------------------------------------TRENDING--------------------------

//--------------------------VARIABLES---------------------------------------------------
const api_key = "Ju1SIVS3IxuwqcKcscBsqxrNHQw0fM44";
const url_trending = `https://api.giphy.com/v1/gifs/trending?api_key=${api_key}&limit=100`;
const slider = document.getElementById("slider");
const icon_search = "./imagenes/icon-busqueda-sin-resultado.svg";
const results_grid = document.getElementById("results_grid");
const more_btn = document.getElementById("more_btn");
const fav_img = "./imagenes/icon-fav.svg";
const fav_add = "addFavorite";
const fav_remove = "removeFav";
const erase_gifo = "erase";
const fav = "fav";

//----------------------------------------TRENDING GIFOS----------------------------------------------------

function gifoBoxTemplate(gifo, leftButton, leftFunction, type) {
  return `<div class="gifo" onclick="fullGifosMobile('${gifo.images.downsized.url}', '${gifo.id}', '${gifo.slug}', '${gifo.username}', '${gifo.title}')">
            <img class="gifo__img" src=${gifo.images.downsized.url} alt=${gifo.title} >
                <div class="gifo__hover">
                    <div class="gifo__buttons">
                        <button class="gifo__btn">
                            <img src=${leftButton} alt="${type}" class="${type}_btn" id="icon-${type}-${gifo.id}" onclick="${leftFunction}('${gifo.id}')">
                        </button>
                        <button class="gifo__btn">
                            <img src="./imagenes/icon-download-hover.svg" alt="download" class="download_btn" onclick="downloadGifo('${gifo.images.downsized.url}', '${gifo.slug}')">
                        </button>
                        <button class="gifo__btn">
                            <img src="./imagenes/icon-max-hover.svg" alt="fullsize" class="max_btn" onclick="fullGifosDesktop('${gifo.images.downsized.url}', '${gifo.id}', '${gifo.slug}', '${gifo.username}', '${gifo.title}')">
                        </button>
                    </div>
                    <div class="gifo__text">
                        <p>${gifo.username}</p>
                        <h6>${gifo.title}</h6>
                    </div>
                </div>
        </div>`;
}

//-------------------------------------------SIN RESULTADOS-------------------------------------------------
function noResults(iconUrl, place, msg) {
  place.innerHTML = "";
  let cont = document.createElement("div");
  cont.classList.add("error_msg");
  let text = document.createElement("p");
  text.classList.add("no_results_title");
  text.textContent = msg;
  let icon = document.createElement("img");
  icon.src = iconUrl;
  cont.appendChild(icon);
  cont.appendChild(text);
  place.appendChild(cont);
}

//------------------------------------------RENDERIZAR GIFOS-----------------------------------------------
function renderAllGifos(arrayGifos, container, favButton, favFunction, type) {
  let content = "";

  if (arrayGifos.data.length == 0) {
    container.classList.remove("grid");
    noResults(icon_search, results_grid, "Intenta con otra búsqueda");
    more_btn.classList.add("invisible");
  } else {
    for (const gifo of arrayGifos.data) {
      content += gifoBoxTemplate(gifo, favButton, favFunction, type);
      more_btn.classList.remove("invisible");
    }
    container.innerHTML += content;
    if (
      arrayGifos.pagination.total_count <=
      arrayGifos.pagination.offset + 12
    ) {
      more_btn.classList.add("invisible");
    }
  }
}

//------------------------------OBTENER DATOS DE LA API DE GIPHY-------------------------------
function getSectionsData(url, container, favButton, favFunction, type) {
  fetch(url)
    .then((response) => response.json())
    .then((content) => {
      renderAllGifos(content, container, favButton, favFunction, type);
    })
    .catch((error) => console.log(error));
}

//------------------------------------RENDERIZAR TRENDING GIFOS----------------------------------
function renderTrendingGifos(
  arrayGifos,
  container,
  favButton,
  favFunction,
  type
) {
  let content = "";

  for (const gifo of arrayGifos.data) {
    content += gifoBoxTemplate(gifo, favButton, favFunction, type);
  }
  container.innerHTML += content;
}

//-----------------------OBTENER DATA DE LA API DE GIPHY--------------------------------------------------------
function getTrendingData(url, container, favButton, favFunction, type) {
  fetch(url)
    .then((response) => response.json())
    .then((content) => {
      renderTrendingGifos(content, container, favButton, favFunction, type);
    })
    .catch((error) => console.log(error));
}

function trendings() {
  getTrendingData(url_trending, slider, fav_img, fav_add, fav);
}

trendings();

// -------------------------------------------------VARIABLES--------------------------------------------------
const search_input = document.getElementById("search_input");
const search_btn = document.getElementById("search_btn");
const right_btn = document.getElementById("right_btn");
const right_icon = document.getElementById("right_icon");
const results_title = document.getElementById("results_title");
const url_search = "https://api.giphy.com/v1/gifs/search?api_key=" + api_key;
const url_suggestions = "https://api.giphy.com/v1/tags/related/";
let autoComp = document.getElementById("autocomplete_content");
let offset = 0;
let value = "";

//-------------------------------------------OBTENER DATOS DE LA API DE GIPHY-----------------------------------
function searchGifos() {
  results_grid.innerHTML = "";
  value = search_input.value.trim();
  results.classList.remove("hide");
  results_title.textContent = value;

  const search = url_search + "&limit=12&q=" + value + "/";
  getSectionsData(search, results_grid, fav_img, fav_add, fav);
  closeAutocompleteSection();
}

//----------------------------------------AUTOCOMPLETAR SUGERENCIAS Y BUSCAR GIFOS CON ENTER EVENT---------------

search_input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchGifos();
    console.log("buscando con enter");
  }

  value = search_input.value;
  if (value.length >= 1) {
    showAutocompleteSection();
    fetch(`${url_suggestions}${value}?api_key=${api_key}`)
      .then((response) => response.json())
      .then((data) => {
        suggestedTerms(data);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    closeAutocompleteSection();
  }
});

//------------------------------------------MOSTRAR SECCION DE AUTOCOMPLETAR-------------------------------------
function showAutocompleteSection() {
  autoComp.style.display = "block";
  right_icon.classList.remove("fa-search");
  right_icon.classList.add("fa-times");
  search_btn.classList.remove("hide");
}

//--------------------------------------------RENDERIZAR RESULTADOS-----------------------------------------------
function suggestedTerms(terms) {
  let suggested = terms.data;
  autoComp.innerHTML = `
    <li class="suggested"> <i class="fas fa-search"></i> <p class="suggested__text">${suggested[0].name}</p></li>
    <li class="suggested"> <i class="fas fa-search"></i> <p class="suggested__text">${suggested[1].name}</p></li>
    <li class="suggested"> <i class="fas fa-search"></i> <p class="suggested__text">${suggested[2].name}</p></li>
    `;
}

//----------------------------------------------OCULTAR AUTOCOMPLETAR---------------------------------------------
function closeAutocompleteSection() {
  autoComp.style.display = "none";
  right_icon.classList.remove("fa-times");
  right_icon.classList.add("fa-search");
  search_btn.classList.add("hide");
}

//----------------------------------------------BUSCAR CON SUGERENCIAS--------------------------------------------
autoComp.addEventListener("click", (li) => {
  search_input.value = li.target.textContent;
  searchGifos();
});

//-----------------------------------------------CANCELAR BUSQUEDA-------------------------------------------------
right_btn.addEventListener("click", (e) => {
  search_input.value = "";
  search_input.placeholder = "Busca GIFOS y más";
  closeAutocompleteSection();
});

//-----------------------------------------------BUSCAR GIFOS CON CLICK EVENT--------------------------------------
search_btn.addEventListener("click", searchGifos);

//-----------------------------------------------VER MAS RESULTADOS-------------------------------------------------
more_btn.addEventListener("click", (e) => {
  e.preventDefault();
  seeMoreResults();
});

//-----------------------------------------------MOSTRAR 12 RESULTADOS MAS---------------------------------------
function seeMoreResults() {
  offset = offset + 12;
  value = search_input.value.trim();
  let search_more = url_search + "&limit=12&q=" + value + "&offset=" + offset;
  getSectionsData(search_more, results_grid, fav_img, fav_add, fav);
}

//------------------------------------------------TRENDING TOPICS----------------------------------------------------

let trend_topics = document.getElementById("trend_topics");
window.onload = trendingTopics();

//------------------------------------------------OBTENER DATOS DE LA API DE GIPHY-----------------------------------
function trendingTopics() {
  let url = `https://api.giphy.com/v1/trending/searches?api_key=${api_key}`;

  return fetch(url)
    .then((resp) => resp.json())
    .then((gifoWords) => {
      let topics = gifoWords.data;
      trend_topics.innerHTML = `
            <p class="trending__links">${topics[0]}</p>, 
            <p class="trending__links">${topics[1]}</p>, 
            <p class="trending__links">${topics[2]}</p>, 
            <p class="trending__links">${topics[3]}</p>, 
            <p class="trending__links">${topics[4]}</p>`;

      let topic_btns = document.getElementsByClassName("trending__links");
      for (let i = 0; i < topic_btns.length; i++) {
        topic_btns[i].addEventListener("click", function (e) {
          search_input.value = topics[i];
          searchGifos();
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}


/*------------------------------------------------VARIABLES------------------------------------*/

const begin_btn = document.getElementById("begin_btn");
const record_btn = document.getElementById("record_btn");
const end_btn = document.getElementById("end_btn");
const upload_btn = document.getElementById("upload_btn");
const step_first = document.getElementById("creategifo_step_first");
const step_second = document.getElementById("creategifo_step_second");
const step_third = document.getElementById("creategifo_step_third");
const counter_recording = document.getElementById("counter_recording");
const counter_repeat = document.getElementById("counter_repeat");
const upload_title = document.getElementById("upload_title");
const upload_text = document.getElementById("upload_text");
const overlay_video = document.getElementById("overlay_video");
const overlay_icon = document.getElementById("overlay_video_icon");
const overlay_text = document.getElementById("overlay_video_text");
const overlay_actions = document.getElementById("overlay_video_actions");

let recorder;
let blob;
let dateStarted;
let form = new FormData();
let myGifosArray = [];
let myGifosString = localStorage.getItem("myGifos");
let video = document.getElementById("recording_video");
let recorded_gifo = document.getElementById("recorded_gifo");

//-----------------COMENZAR---------------------------------

begin_btn.addEventListener("click", getStreamAndRecord);

//------------------PERMISOS--------------------------------
function getStreamAndRecord() {
  begin_btn.classList.add("hide");
  upload_title.innerHTML = "¿Nos das acceso </br>a tu cámara?";
  upload_text.innerHTML =
    "El acceso a tu camara será válido sólo </br>por el tiempo en el que estés creando el GIFO.";
  step_first.classList.add("step_now");

  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { height: { max: 480 } } })
    .then(function (stream) {
      upload_title.classList.add("hide");
      upload_text.classList.add("hide");
      record_btn.classList.remove("hide");
      step_first.classList.remove("step_now");
      step_second.classList.add("step_now");

      //----------------------------VIDEO-------------------------------------
      video.classList.remove("hide");
      video.srcObject = stream;
      video.play();

      recorder = RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function () {
          console.log("Iniciando grabación");
        },
      });
    });
}
//------------------------------------GRABAR-------------------------------------------------
record_btn.addEventListener("click", recordGifo);

function recordGifo() {
  recorder.startRecording();
  record_btn.classList.add("hide");
  end_btn.classList.remove("hide");
  counter_recording.classList.remove("hide");

  //-------------------------------CONTADOR---------------------------------
  dateStarted = new Date().getTime();

  (function looper() {
    if (!recorder) {
      return;
    }
    //------------------------INICIAR CONTADOR----------------------------------
    counter_recording.innerHTML = calculateTimeDuration(
      (new Date().getTime() - dateStarted) / 1000
    );
    setTimeout(looper, 1000);
  })();
}

//-------------------------FINALIZAR GRABACION---------------------------------------
end_btn.addEventListener("click", endingGifo);

function endingGifo() {
  end_btn.classList.add("hide");
  upload_btn.classList.remove("hide");

  counter_recording.classList.add("hide");
  counter_repeat.classList.remove("hide");

  recorder.stopRecording(function () {
    video.classList.add("hide");
    recorded_gifo.classList.remove("hide");

    blob = recorder.getBlob();
    recorded_gifo.src = URL.createObjectURL(recorder.getBlob());

    form.append("file", recorder.getBlob(), "myGifo.gif");
    form.append("api_key", api_key);
  });
}

//--------------------------FUNCION PARA CALCULAR DURACION------------------
function calculateTimeDuration(secs) {
  var hr = Math.floor(secs / 3600);
  var min = Math.floor((secs - hr * 3600) / 60);
  var sec = Math.floor(secs - hr * 3600 - min * 60);
  if (min < 10) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  return hr + ":" + min + ":" + sec;
}

//-----------------------SUBIR GIFO--------------------------------
upload_btn.addEventListener("click", uploadGifo);

function uploadGifo() {
  overlay_video.classList.remove("hide");
  overlay_icon.classList.remove("hide");
  overlay_text.classList.remove("hide");
  step_second.classList.remove("step_now");
  step_third.classList.add("step_now");
  counter_repeat.classList.add("hide");

  //---------------------SUBIR A GIPHY-----------------------------
  fetch("https://upload.giphy.com/v1/gifs", {
    method: "POST",
    body: form,
  })
    .then((response) => {
      return response.json();
    })
    .then((gifo) => {
      let myGifoId = gifo.data.id;

      //---------------------MOSTRAR NUEVO GIFO--------------------
      overlay_actions.classList.remove("hide");
      overlay_icon.src = "./imagenes/check.svg";
      overlay_text.innerText = "GIFO subido con éxito";
      overlay_actions.innerHTML = `
            <button class="gifo__btn" id="download_btn" onclick="downloadMyGifo('${myGifoId}')">
                <img src="./imagenes/icon-download-hover.svg" alt="download">
            </button>
            `;
      upload_btn.classList.add("invisible");



      //------------------- GUARDAR NUEVO GIFO EN LOCALSTORAGE----------------------- 
      if (myGifosString == null) {
        myGifosArray = [];
      } else {
        myGifosArray = JSON.parse(myGifosString);
      }
      myGifosArray.push(myGifoId);
      myGifosString = JSON.stringify(myGifosArray);
      localStorage.setItem("myGifos", myGifosString);
    })
    .catch((error) => console.log(error));
}

//---------------------------REPETIR GRABACION--------------------
counter_repeat.addEventListener("click", repeatRecording);

function repeatRecording() {
  recorder.clearRecordedData();
  counter_repeat.classList.add("hide");
  upload_btn.classList.add("hide");
  recorded_gifo.classList.add("hide");
  record_btn.classList.remove("hide");

  navigator.mediaDevices
    .getUserMedia({ audio: false, video: { height: { max: 480 } } })

    .then(function (stream) {
      step_second.classList.add("step_now");

      video.classList.remove("hide");
      video.srcObject = stream;
      video.play();

      recorder = RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function () {
          console.log("Iniciando grabación");
        },
      });
    });
}
 
 


// -----------------------DESCARGAR NUEVO GIFO---------------------------------------------------
async function downloadMyGifo(gifoImg) {
  let blob = await fetch(
    "https://media.giphy.com/media/" + gifoImg + "/giphy.gif"
  ).then((img) => img.blob());
  invokeSaveAsDialog(blob, "myGifo.gif");
}

/*------------------------------------------------------VARIABLES------------------------------------*/

let fav_gifos = document.getElementById("fav_gifos");
const fav_icon = "./imagenes/icon-fav-sin-contenido.svg";
const fav_act_img = "./imagenes/icon-fav-active.svg";
let favoriteArray = [];
let favoriteString = localStorage.getItem("favoriteGifos");

//----------------------------------------AGREGAR A FAVORITOS------------------------------------
function addFavorite(gifoId) {
  let iconFav = document.getElementById("icon-fav-" + gifoId);
  iconFav.src = fav_act_img;
  addFav(gifoId);
}

function addFav(gifo) {
  if (favoriteString == null) {
    favoriteArray = [];
  } else {
    favoriteArray = JSON.parse(favoriteString);
  }
  favoriteArray.push(gifo);
  favoriteString = JSON.stringify(favoriteArray);
  localStorage.setItem("favoriteGifos", favoriteString);
}

//------------------------------------------RENDERIZAR FAVORITOS------------------------------------
function renderFavorites() {
  fav_gifos.innerHTML = "";
  if (favoriteString == null || favoriteString == "[]") {
    fav_gifos.classList.remove("grid");
    noResults(
      fav_icon,
      fav_gifos,
      "Guarda tu primer GIFO en favoritos para que se muestre aquí"
    );
  } else {
    favoriteArray = JSON.parse(favoriteString);
    let urlFavorites = `https://api.giphy.com/v1/gifs?ids=${favoriteArray.toString()}&api_key=${api_key}`;
    getSectionsData(urlFavorites, fav_gifos, fav_act_img, fav_remove, fav);
  }
}

//----------------------------------------ELIMINAR FAVORITOS----------------------------------------
function removeFav(gifo) {
  let arrayAux = [];
  arrayAux = JSON.parse(favoriteString);
  let index = arrayAux.indexOf(gifo);
  arrayAux.splice(index, 1);

  let newFavoritesString = JSON.stringify(arrayAux);
  localStorage.setItem("favoriteGifos", newFavoritesString);

  //----CAMBIAR ICONO------
  let eraseIconFav = document.getElementById("icon-fav-" + gifo);
  eraseIconFav.setAttribute("src", "./imagenes/icon-fav-hover.svg");

  //----RECARGAR PAGINA----
  location.reload();
}

//-----DESCARGAR GIFO------
async function downloadGifo(gifoImg, gifoName) {
  let blob = await fetch(gifoImg).then((img) => img.blob());
  invokeSaveAsDialog(blob, gifoName + "myGifo.gif");
}


//-------------------------------------------------GO TOP----------------------------------------
let intervalId = 0;

function scrollStep() {
  if (window.pageYOffset === 0) {
    clearInterval(intervalId);
  }
  window.scroll(window.pageYOffset, 0);
}

//------------------------------------CAMBIO EN EL NAVBAR CUANDO SE HACE SCROLLDOWN-------------
const debounce = (fn) => {
    let frame;
    return (...params) => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        fn(...params);
      });
    };
};
  
  const storeScroll = () => {
    document.documentElement.dataset.scroll = window.scrollY;
  };
  document.addEventListener("scroll", debounce(storeScroll), { passive: true });
  storeScroll();
  
  //-----------------------CAMBIO DE IMAGEN EN NAVBAR CUANDO SE HACE HOVER-----------------------
  const create_img = document.getElementById("create_img");
  
  create_img.addEventListener("mouseover", () => {
    if (body.classList == "") {
      create_img.src = "./imagenes/CTA-crear-gifo-hover.svg";
    } else {
      create_img.src = "./imagenes/CTA-crear-gifo-hover-modo-noc.svg";
    }
  });
  
  create_img.addEventListener("mouseout", () => {
    if (body.classList == "") {
      create_img.src = "./imagenes/button-crear-gifo.svg";
    } else {
      create_img.src = "./imagenes/CTA-crear-gifo-modo-noc.svg";
    }
  });
  
//--------------------------------------MENU HAMBURGUESA-----------------------------------------

const burger = document.getElementById("burger");
const burger_icon = document.getElementById("burger_icon");
const menu = document.getElementById("menu");

burger.addEventListener("click", () => {
  burger_icon.classList.toggle("fa-bars");
  burger_icon.classList.toggle("fa-times");
  menu.classList.toggle("invisible");
  menu.classList.toggle("visible");
});

//-------------------------------------------VARIABLES---------------------------------------------------
const max_btn = document.querySelectorAll(".max_btn");
const download_btn = document.querySelectorAll(".download_btn");
let modal;

//------------------------ MAXIMIZAR EN MOBILE--------------------
function fullGifosMobile(img, id, slug, user, title) {
  if (window.matchMedia("(max-width: 899px)").matches) {
    fullGifos(img, id, slug, user, title);
  }
}

//------------------------MAXIMIZAR EN DESKTOP--------------------------------
function fullGifosDesktop(img, id, slug, user, title) {
  if (window.matchMedia("(min-width: 900px)").matches) {
    fullGifos(img, id, slug, user, title);
  }
}

function fullGifos(img, id, slug, user, title) {
  modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = ` 
    <div class="modal__container">
            <button class="close_modal_btn" onclick="closefullGifos()"><i class="fas fa-times"></i></button>
            <img src="${img}" alt="${id}" class="modal__img">
            <div class="modal__info">
                <div class="modal__text">
                    <p class="modal__user">${user}</p>
                    <p class="modal__title">${title}</p>
                </div>
                <div>
                    <button class="fav_btn" onclick="addFavorite('${id}')"><img src="./imagenes/icon-fav-hover.svg" alt="fav-gif" id="icon-fav-${id}"></button>
                    <button class="download_btn" onclick="downloadGifo('${img}','${slug}')"><img src="./imagenes/icon-download.svg" alt="download-gif"></button>
                </div>
            </div>
        </div>
    `;
  document.body.appendChild(modal);
}

//----------------CERRAR GIFO------------
function closefullGifos() {
  document.body.removeChild(modal);
}


//---------------------------------------------MODO OSCURO---------------------------------------------

//--------------VARIABLES-----------------------------
const theme_btn = document.getElementById("theme_btn");
const body = document.getElementById("body");
const logo = document.getElementById("logo");
const camera = document.getElementById("camera");
const film_reel = document.getElementById("film_reel");
const theme_link = document.getElementById("theme_link");

theme_btn.addEventListener("click", (e) => {
  e.preventDefault();

  if (body.classList == "") {
    body.classList.add("dark");
    create_img.src = "./imagenes/CTA-crear-gifo-modo-noc.svg";
    logo.src = "./imagenes/Logo-modo-noc.svg";
    camera.src = "./imagenes/camara-modo-noc.svg";
    film_reel.src = "./imagenes/pelicula-modo-noc.svg";
    theme_link.textContent = "Modo diurno";
  } else {
    body.classList.remove("dark");
    create_img.src = "./imagenes/button-crear-gifo.svg";
    logo.src = "./imagenes/logo-mobile.svg";
    camera.src = "./imagenes/camara.svg";
    film_reel.src = "./imagenes/pelicula.svg";
    theme_link.textContent = "Modo nocturno";
  }
});


// ------------------------------------------------MOSTRAR FAVORITOS---------------------------------------
const fav_link = document.getElementById("fav_link");
const favorites = document.getElementById("favorites");
const hero = document.getElementById("hero");
const results = document.getElementById("results");
const create = document.getElementById("create");

fav_link.addEventListener("click", (e)=> {
  e.preventDefault();
  scrollStep(); 
  hero.classList.add("hide");
  results.classList.add("hide");
  my_gifos.classList.add("hide");
  create.classList.add("hide");
  favorites.classList.remove("hide");
  renderFavorites();
});

// -----------------------------------------------MOSTRAR GIFOS-------------------------------------------------

//-------------------VARIABLES--------------------------------
const my_gifos_link = document.getElementById("my_gifos_link");
const my_gifos = document.getElementById("my_gifos");

my_gifos_link.addEventListener("click", (e)=> {
  e.preventDefault();
  scrollStep(); 
  hero.classList.add("hide");
  results.classList.add("hide");
  favorites.classList.add("hide");
  create.classList.add("hide");
  my_gifos.classList.remove("hide");
  renderMyGifos();
});

//------------------------------------------------VARIABLES-------------------------------

const my_gifos_gifos = document.getElementById("my_gifos_gifos");
const my_gifos_icon = "./imagenes/icon-mis-gifos-sin-contenido.svg";
const trash_img = "./imagenes/icon-trash-hover.svg";
myGifosArray = [];
myGifosString = localStorage.getItem("myGifos");

//-------------------------- RENDERIZA GIFOS------------------
renderMyGifos();

function renderMyGifos() {
  my_gifos_gifos.innerHTML = "";

  if (myGifosString == null || myGifosString == "[]") {
    my_gifos_gifos.classList.remove("grid");
    noResults(
      my_gifos_icon,
      my_gifos_gifos,
      "¡Animate a crear tu primer GIFO!"
    );
  } else {
    myGifosArray = JSON.parse(myGifosString);
    let urlMyGifos = `https://api.giphy.com/v1/gifs?ids=${myGifosArray.toString()}&api_key=${api_key}`;
    getSectionsData(
      urlMyGifos,
      my_gifos_gifos,
      trash_img,
      erase_gifo,
      erase_gifo
    );
  }
}

function erase(gifo) {
  let Array;
}

//-------------------------ELIMINAR GIF FAVORITO---------------
function erase(gifo) {
  let arrayAux = [];
  arrayAux = JSON.parse(myGifosString);
  let index = arrayAux.indexOf(gifo);
  arrayAux.splice(index, 1);

  let newMyGifosString = JSON.stringify(arrayAux);
  localStorage.setItem("myGifos", newMyGifosString);

  location.reload();
}

// -------------------------RELOAD PAGE-----------------------------------------------

logo.addEventListener("click", ()=> {
    location.reload();
  });

//-------------------------SHOW CREATE GIFOS-------------------------------------

const create_link = document.getElementById("create_link");
const trending = document.getElementById("trending");

create_link.addEventListener("click", (e)=> {
  e.preventDefault();
  scrollStep(); 
  hero.classList.add("hide");
  results.classList.add("hide");
  favorites.classList.add("hide");
  trending.classList.add("hide");
  my_gifos.classList.add("hide");
  create.classList.remove("hide");
});

//-------------------------------------SLIDER----------------------------

//------------------------VARIABLES-----------------------
const trendslider = document.getElementById("trendslider");
let start;
let change;

//-----------------SLIDER MOBILE----------------------------
trendslider.addEventListener("touchstart", (e) => {
  start = e.touches[0].clientX;
});

trendslider.addEventListener("touchmove", (e) => {
  e.preventDefault();
  let touch = e.touches[0];
  change = start - touch.clientX;
});

trendslider.addEventListener("touchend", slideShow);

function slideShow() {
  if (change > 0) {
    trendslider.scrollLeft += 200;
  } else {
    trendslider.scrollLeft -= 200;
  }
}

//---------------SLIDER DESKTOP-------------------
const prev_btn = document.getElementById("prev");
const next_btn = document.getElementById("next");

prev_btn.addEventListener("click", (e) => {
  e.preventDefault();
  trendslider.scrollLeft -= 500;
});

next_btn.addEventListener("click", (e) => {
  e.preventDefault();
  trendslider.scrollLeft += 500;
});
