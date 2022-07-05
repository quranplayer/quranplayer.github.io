let currentIndex = JSON.parse(localStorage.getItem("currentIndex")) || 0;
let currentRecitationsList = JSON.parse(localStorage.getItem("currentRecitationsList")) || [];
let currentRecitation = JSON.parse(localStorage.getItem("currentRecitation")) || null;
let currentTime = JSON.parse(localStorage.getItem("currentTime")) || 0;
//let recentlyPlayed = JSON.parse(localStorage.getItem("recentlyPlayed")) || [];
let favouritesPlaylist = JSON.parse(localStorage.getItem("favouritesPlaylist")) || [];

let curatedPlaylist01 = [];
let curatedPlaylist02 = [];
let curatedPlaylist03 = [];

let isLooping = false;

let bgImageSrc = "https://i.dlpng.com/static/png/7015874_preview.png";

// SETTINGS
let isImageHidden = JSON.parse(localStorage.getItem("isImageHidden")) || false;
let isShowingName = JSON.parse(localStorage.getItem("isShowingName")) || false;
//

let isShuffling = JSON.parse(localStorage.getItem("isShuffling")) || false;
let isPlaylist = JSON.parse(localStorage.getItem("isPlaylist")) || false;

let settings = document.getElementById("settings");

let reciterBtns = [];

let popUpBg = document.getElementById("pop-up-bg");

let storedVersion = JSON.parse(localStorage.getItem("storedVersion")) || null;
let currentVersion = 0.35;

if (currentVersion !== storedVersion) {
    popUpBg.style.display = "flex";
}
else {
    popUpBg.style.display = "none";
}

function closePopUp() {
    storedVersion = localStorage.setItem("storedVersion", JSON.stringify(currentVersion));
    popUpBg.style.display = "none";
}

//#region LOADER
let loader = document.getElementById("loader");

function onceLoaded() {
  loader.remove();
}
//#endregion

if (isImageHidden) settings.children[0].checked = true;
else settings.children[0].checked = false;

if (isShowingName) settings.children[2].checked = true;
else settings.children[2].checked = false;

let hiddenMenu = document.getElementById("hidden-menu");
let arrow = document.querySelector(".arrow");

function menuUp() {
  if (hiddenMenu.classList.contains("up")) {
    hiddenMenu.classList.remove("up");
    hiddenMenu.classList.add("down");
    arrow.classList.add("rotate");
  }
  else {
    hiddenMenu.classList.remove("down");
    hiddenMenu.classList.add("up");
    arrow.classList.remove("rotate");
  }
}

function reset() {
  localStorage.clear();
  location.reload();
}

let canCheck = true;

//#region PLAYER
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let ctr;
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      loop: 0
    },
    events: {
      'onReady': onPlayerReady,
    }
  });
  ctr = document.getElementById("player");
  if (currentRecitation !== null) updateSurah();
}

let icon = document.querySelectorAll(".youtube-icon");

let isStartIcon = true;

function onPlayerReady(event) {
  setTimeText();
  player.setPlaybackRate(playbackOptions[playbackIndex]);
  player.playVideo();
  updateSeek(player.getDuration());

  if (isStartIcon) {
    icon[0].src = "https://www.pngall.com/wp-content/uploads/9/White-Play-Silhoutte-PNG1.png";
    icon[1].src = "https://www.pngall.com/wp-content/uploads/9/White-Play-Silhoutte-PNG1.png";
    isStartIcon = false;
  }
  else {
    icon[0].src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
    icon[1].src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
  }

  canCheck = true;
}

let isPlaying = false;

function playToggle() {
  if (!isPlaying && currentRecitation !== null) {
    player.playVideo();
    icon[0].src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
    icon[1].src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
    isPlaying = true;
  }
  else if (isPlaying) {
    player.pauseVideo();
    icon[0].src = "https://www.pngall.com/wp-content/uploads/9/White-Play-Silhoutte-PNG1.png";
    icon[1].src = "https://www.pngall.com/wp-content/uploads/9/White-Play-Silhoutte-PNG1.png";
    isPlaying = false;
  }
}
//#endregion

let recitersCount = document.getElementById("reciters-count");

function countReciters() {
  recitersCount.innerHTML = `${reciters.length}`;
}

countReciters();

let recitersDiv = document.getElementById("reciters-div");

let surahListParent = null;
let surahList = null;

let myRange = document.querySelectorAll(".myRange");

function updateSeek(maxRange) {
  myRange[0].value = 0;
  myRange[1].value = 0;
  myRange[0].max = maxRange;
  myRange[1].max = maxRange;
}

let isChanging = false;

function startChange() {
  isChanging = true;
}

function changeSeek(value) {
  isChanging = false;
  player.seekTo(value);
}

function createReciter(reciter) {
  let e = document.createElement("a");
  e.href = `#${reciter.urlName}`;
  backgroundImage = document.createElement("img");
  let image = document.createElement("img");
  let bgDiv = document.createElement("div");
  let name = document.createElement("p");
  e.classList.add("reciter");
  backgroundImage.classList.add("reciter-image");
  image.classList.add("reciter-image");
  bgDiv.classList.add("bg-div");
  name.classList.add("reciter-name");

  backgroundImage.src = bgImageSrc;
  image.src = reciter.image;
  name.innerHTML = reciter.name;

  e.appendChild(backgroundImage);
  e.appendChild(image);
  recitersDiv.appendChild(e);
  e.appendChild(bgDiv);
  bgDiv.appendChild(name);

  e.setAttribute("data-e", JSON.stringify(reciter));
  e.addEventListener("click", toggleDiv);

  if (isImageHidden) {
    image.classList.add("hide-image")
  }

  if (isShowingName) {
    name.classList.add("show-name");
  }
  
  reciterBtns.push(e);
}

let ar = [];

function sortDivs() {
  reciters.sort((a, b) => {
    let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
});

  reciters.forEach(reciter => {
    createReciter(reciter);
  });
}

sortDivs();

let content = document.getElementById("content");
let reciterDiv = document.querySelector(".reciters");
let sectionList;

let eStoredImage = null;

function showWhichImage(storedDataAttribute) {
  if (isImageHidden) return bgImageSrc;
  else return storedDataAttribute.image;
}

function toggleDiv(event) {
  typeIndex = 0;
  let selectedDiv = document.createElement("div");

  if (event.target.hasAttribute("data-e")) {
    eStoredImage = JSON.parse(event.target.getAttribute("data-e")).image;
  }

  if (event.target.classList.contains("reciter")) recitersDiv.appendChild(selectedDiv);
  else content.appendChild(selectedDiv);

  let storedDataAttribute;

  if (event.target.classList.contains("player-image-div")) {
    for (let i = 0; i < reciters.length; i++) {
      if (event.target.getAttribute("data-name") === reciters[i].name) {
        currentReciter = reciters[i];
        storedDataAttribute = JSON.stringify(reciters[i]);
        event.target.href = "#" + currentReciter.urlName;
        break;
      }
    }
  }
  else {
    for (let i = 0; i < reciters.length; i++) {
      if (JSON.parse(event.target.getAttribute("data-e")).name === reciters[i].name) {
        currentReciter = reciters[i];
        break;
      }
    }

    storedDataAttribute = this.getAttribute("data-e");
  }

  storedDataAttribute = JSON.parse(storedDataAttribute);

  let markup = `
  <div class="top">
    <a href="#" class="back-button" onclick="removeDiv(event)">
      <img src="https://i.imgur.com/7t7Oo4W.png" alt="">
    </a>
    <h3 id="selected-reciter-name">${storedDataAttribute.name}</h3>
  </div>
  <div id="selection-content">
    <div id="reciter-info">
      <div id="selected-reciter-image-div">
        <img id="selected-reciter-image" src="${showWhichImage(storedDataAttribute)}" alt="">
      </div>
    </div>
    <div id="surah-section-parent">
      <div id="section-list"></div>
      <div id="surah-search-bar-div" class="search-bar-div">
        <input id="surah-search-bar" class="search-bar" placeholder="Search surah" oninput="searchSurahInput(value)">
      </div>
      <div id="surah-list-parent">
        <p id="no-data">No data</p>
        <div id="surah-list"></div>
      </div>
    </div>
  </div>
  `

  surahSearchBar = document.getElementById("surah-search-bar");

  selectedDiv.classList.add("selection-div");
  selectedDiv.classList.add("page");

  selectedDiv.innerHTML = markup;

  sectionList = document.getElementById("section-list");
  surahListParent = document.getElementById("surah-list-parent");
  surahList = document.getElementById("surah-list");

  createSectionButtons(storedDataAttribute);
  editURL(storedDataAttribute);
  checkPlaying();
}

function toggleDivOnLoad(object) {
  let selectedDiv = document.createElement("div");
  
  content.appendChild(selectedDiv);

  let storedDataAttribute;

  storedDataAttribute = object;
  eStoredImage = storedDataAttribute.image;

  let markup = `
  <div class="top">
    <a href="#" class="back-button" onclick="removeDiv(event)">
      <img src="https://i.imgur.com/7t7Oo4W.png" alt="">
    </a>
    <h3 id="selected-reciter-name">${storedDataAttribute.name}</h3>
  </div>
  <div id="selection-content">
    <div id="reciter-info">
      <div id="selected-reciter-image-div">
        <img id="selected-reciter-image" src="${showWhichImage(storedDataAttribute)}" alt="">
      </div>
    </div>
    <div id="surah-section-parent">
      <div id="section-list"></div>
      <div id="surah-search-bar-div" class="search-bar-div">
        <input id="surah-search-bar" class="search-bar" placeholder="Search surah" oninput="searchSurahInput(value)">
      </div>
      <div id="surah-list-parent">
        <p id="no-data">No data</p>
        <div id="surah-list"></div>
      </div>
    </div>
  </div>
  `

  surahSearchBar = document.getElementById("surah-search-bar");

  selectedDiv.classList.add("selection-div");
  selectedDiv.classList.add("page");

  selectedDiv.innerHTML = markup;

  sectionList = document.getElementById("section-list");
  surahListParent = document.getElementById("surah-list-parent");
  surahList = document.getElementById("surah-list");

  createSectionButtons(storedDataAttribute);
  editURL(storedDataAttribute);
  checkPlaying();
}

function editURL(t) {
  let url = window.location.href.split("#")[0];
  url.concat("#" + t.urlName);
}

/*function togglePlaylist() {
  let playlistDiv = document.createElement("div");
  content.appendChild(playlistDiv);

  let markup = `
  <div class="toggle-div page">
    <div class="top c-top">
        <a href="#" class="back-button" onclick="removeDiv(event)">
            <img src="https://i.imgur.com/7t7Oo4W.png" alt="">
        </a>
        <h1>Haramayn</h1>
        <p>Playlist duration: 1h 23m</p>
    </div>
    <div id="selected-playlist-div">
        <button class="recitation-button">
            <img src="https://i1.sndcdn.com/artworks-000534797073-h1ykj2-t500x500.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Haqqah</p>
                <p class="playlist-reciter-name">Mahmoud Khalil Al-Husary</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQeCmGf8cyN1pDZq-AsAsgGlF-tjqNHuEp0XQmGr3ONhfyTkwIUkyrSLg2JY7JlVKFWyk&usqp=CAU" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Burooj</p>
                <p class="playlist-reciter-name">Muhammad At-Tablawi</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="data:image/jpeg;base64,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" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Fajr</p>
                <p class="playlist-reciter-name">Mahmoud Al-Bana</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://static.qurancdn.com/images/reciters/7/mohamed-siddiq-el-minshawi-profile.jpeg?v=1" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Inshiqaaq</p>
                <p class="playlist-reciter-name">Muhammad Al-Minshawi</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://iqna.ir/files/en/news/2021/5/18/74709_686.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Abasa</p>
                <p class="playlist-reciter-name">Abdul-Basit Abdul-Samad</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Mustafa_Ismail_%281%29.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Abasa</p>
                <p class="playlist-reciter-name">Mustafa Ismaeel</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://i1.sndcdn.com/artworks-000534797073-h1ykj2-t500x500.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Haqqah</p>
                <p class="playlist-reciter-name">Mahmoud Khalil Al-Husary</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQeCmGf8cyN1pDZq-AsAsgGlF-tjqNHuEp0XQmGr3ONhfyTkwIUkyrSLg2JY7JlVKFWyk&usqp=CAU" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Burooj</p>
                <p class="playlist-reciter-name">Muhammad At-Tablawi</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="data:image/jpeg;base64,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" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Fajr</p>
                <p class="playlist-reciter-name">Mahmoud Al-Bana</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://static.qurancdn.com/images/reciters/7/mohamed-siddiq-el-minshawi-profile.jpeg?v=1" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Inshiqaaq</p>
                <p class="playlist-reciter-name">Muhammad Al-Minshawi</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://iqna.ir/files/en/news/2021/5/18/74709_686.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Abasa</p>
                <p class="playlist-reciter-name">Abdul-Basit Abdul-Samad</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Mustafa_Ismail_%281%29.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Abasa</p>
                <p class="playlist-reciter-name">Mustafa Ismaeel</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://i1.sndcdn.com/artworks-000534797073-h1ykj2-t500x500.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Haqqah</p>
                <p class="playlist-reciter-name">Mahmoud Khalil Al-Husary</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQeCmGf8cyN1pDZq-AsAsgGlF-tjqNHuEp0XQmGr3ONhfyTkwIUkyrSLg2JY7JlVKFWyk&usqp=CAU" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Burooj</p>
                <p class="playlist-reciter-name">Muhammad At-Tablawi</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="data:image/jpeg;base64,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" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Fajr</p>
                <p class="playlist-reciter-name">Mahmoud Al-Bana</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://static.qurancdn.com/images/reciters/7/mohamed-siddiq-el-minshawi-profile.jpeg?v=1" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Al-Inshiqaaq</p>
                <p class="playlist-reciter-name">Muhammad Al-Minshawi</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://iqna.ir/files/en/news/2021/5/18/74709_686.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Abasa</p>
                <p class="playlist-reciter-name">Abdul-Basit Abdul-Samad</p>
            </div>
        </button>
        <button class="recitation-button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Mustafa_Ismail_%281%29.jpg" alt="">
            <div class="surah-reciter-names-div">
                <p class="playlist-surah-name">Abasa</p>
                <p class="playlist-reciter-name">Mustafa Ismaeel</p>
            </div>
        </button>
    </div>
  </div>
  `

  playlistDiv.innerHTML = markup;
}*/

function removeDiv(e) {
  e.target.parentElement.parentElement.remove();
}

let volume = 0;

function toggleLoop() {
  isLooping = !isLooping;
}

let typeIndex = 0;
let currentReciter = null;

function createSectionButtons(t) {
  if (t.types[0] !== null) {
    for (let i = 0; i < Object.keys(t.types).length; i++) {
      let btn = document.createElement("button");
      btn.classList.add("section-button");
      btn.innerHTML = t.types[i];
      sectionList.appendChild(btn);
      btn.setAttribute("data-type-index", JSON.stringify(i));
      btn.addEventListener("click", toggleSection);
      toggleSectionColor();
    }
  }

  addSurahs(t);
}

let colors = ["blue", "green", "orange", "purple", "brown", "pink", "navy"]

function addSurahs(reciter) {
  let selectedReciter = reciter;
  for (let i = 0; i < selectedReciter.recitations[typeIndex].length; i++) {
    let btn = document.createElement("button");
    btn.classList.add("surah-button");
    btn.innerHTML = selectedReciter.recitations[typeIndex][i].surah;
    if (selectedReciter.types.length > 1) {
      btn.style.borderBottom = `2px solid ${colors[typeIndex]}`;
    }
    surahList.appendChild(btn);
    
    btn.setAttribute("data-surah", JSON.stringify(selectedReciter.recitations[typeIndex][i]));
    btn.addEventListener("click", updateSurahByLink);
  }

  let noData = document.getElementById("no-data");

  if (selectedReciter.recitations[typeIndex].length === 0) {
    noData.style.display = "inline";
  }
  else noData.style.display = "none"
}

function removeSurahs() {
  Array.from(surahList.children).forEach(el => {
    el.remove();
  });
}

function toggleSection(event) {
  let btn = event.target;
  if (typeIndex !== JSON.parse(btn.getAttribute("data-type-index"))) {
    typeIndex = JSON.parse(btn.getAttribute("data-type-index"));
    removeSurahs();
    addSurahs(currentReciter);
    toggleSectionColor();
    updateSurahsByQuery();
    checkPlaying();
  }
}

function toggleSectionColor() {
  Array.from(sectionList.children).forEach(el => {
    if (typeIndex === JSON.parse(el.getAttribute("data-type-index"))) {
      el.classList.add("selected-section");
    }
    else el.classList.remove("selected-section");
  });
}

let menu = document.getElementById("menu");
let pages = document.querySelectorAll(".page");

function togglePage(id, event) {
  colorPageOption(event.target);

  for (let i = 0; i < pages.length; i++) {
    if (pages[i].classList.contains(id)) {
      content.appendChild(pages[i]);
    }
  }

  let grabbedSelectedDiv = document.querySelector(":scope > .selection-div");
  if (grabbedSelectedDiv !== null) grabbedSelectedDiv.remove();
}

function goBack() {
  let currentTime = player.getCurrentTime();
  player.seekTo(currentTime - 15);
}

function goForward() {
  let currentTime = player.getCurrentTime();
  if ((currentTime + 15) > player.getDuration()) {
    nextSurah();
  }
  else player.seekTo(currentTime + 15);
}

//#region LINE
let currentTimeText = document.querySelectorAll(".current-time");
let fullTimeText = document.querySelectorAll(".full-time");

function updateLine() {
  currentTimeText[0].innerHTML = Math.round(player.getCurrentTime());
  currentTimeText[1].innerHTML = Math.round(player.getCurrentTime());
  currentTime = player.getCurrentTime();
  localStorage.setItem("currentTime", JSON.stringify(currentTime));
  setCurrentTimeText();
  if (!isChanging) {
    myRange[0].value = player.getCurrentTime();
    myRange[1].value = player.getCurrentTime();
  }
  if (player.getDuration() > 0) {
    if (currentTime === player.getDuration() && canCheck) {
      nextSurah();
      canCheck = false;
    }
  }
}

function setTimeText() {
  let currentDuration = player.getDuration();

  var sec_num = parseInt(currentDuration, 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (seconds < 10) {seconds = "0"+seconds;}
  
  let hour_is_the_max = currentDuration >= 3600 ? true : false;
  let minute_is_the_max = currentDuration >= 60 && currentDuration < 3600 ? true : false;
  let second_is_the_max = currentDuration < 60 ? true : false;

  if (hour_is_the_max) {
    if (minutes < 10) {minutes = "0"+minutes;}
    fullTimeText[0].innerHTML = hours + ':' + minutes + ':' + seconds;
    fullTimeText[1].innerHTML = hours + ':' + minutes + ':' + seconds;
  }
  else if (minute_is_the_max) {
    fullTimeText[0].innerHTML = minutes + ':' + seconds;
    fullTimeText[1].innerHTML = minutes + ':' + seconds;
  }
  else if (second_is_the_max) {
    fullTimeText[0].innerHTML = minutes + ':' + seconds;
    fullTimeText[1].innerHTML = minutes + ':' + seconds;
  }
}

function setCurrentTimeText() {
  let currentElapsedTime = player.getCurrentTime();

  var sec_num = parseInt(currentElapsedTime, 10);
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);
  
  if (seconds < 10) {seconds = "0"+seconds;}
  
  let hour_is_the_max = currentElapsedTime >= 3600 ? true : false;
  let minute_is_the_max = currentElapsedTime >= 60 && currentElapsedTime < 3600 ? true : false;
  let second_is_the_max = currentElapsedTime < 60 ? true : false;

  if (hour_is_the_max) {
    if (minutes < 10) {minutes = "0"+minutes;}
    currentTimeText[0].innerHTML = hours + ':' + minutes + ':' + seconds;
    currentTimeText[1].innerHTML = hours + ':' + minutes + ':' + seconds;
  }
  else if (minute_is_the_max) {
    currentTimeText[0].innerHTML = minutes + ':' + seconds;
    currentTimeText[1].innerHTML = minutes + ':' + seconds;
  }
  else if (second_is_the_max) {
    currentTimeText[0].innerHTML = minutes + ':' + seconds;
    currentTimeText[1].innerHTML = minutes + ':' + seconds;
  }
}

window.setInterval(updateLine, 500);
//#endregion

//#region PLAYBACK RATE
let playbackIndex = 2;
let playbackOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
let playbackText = document.getElementById("playback-text");

function changePlaybackSpeed() {
  if (playbackIndex == playbackOptions.length - 1) playbackIndex = 0;
  else playbackIndex++;
  player.setPlaybackRate(playbackOptions[playbackIndex]);
  playbackText.innerHTML = playbackOptions[playbackIndex];
}
//#endregion

let reciterImage = document.querySelectorAll(".player-image");
let surahName = document.querySelectorAll(".surah-name");
let recitationType = document.querySelectorAll(".recitation-type");
let reciterName = document.querySelectorAll(".player-name");

function keepIndexInCheck(isNext) {
  for (let index = 0; index < currentRecitationsList.length; index++) {
    if (currentRecitation.url === currentRecitationsList[index].url) {
      currentIndex = index;
    }
  }

  if (isNext) {
    if (currentIndex < currentRecitationsList.length - 1) {
      currentIndex++;
      console.log(currentIndex);
    }
  }
  else {
    if (currentIndex > 0) {
      currentIndex--;
      currentRecitation = currentRecitationsList[currentIndex];
      updateSurah();
      console.log(currentIndex);
    }
  }
}

function previousSurah() {
  isPlaying = true;
  keepIndexInCheck(false);
}

function nextSurah() {
  isPlaying = true;
  keepIndexInCheck(true);
  updateSurahByControls();
}

function updateSurahByLink(event) {
  var btn = event.target;
  if (currentRecitationsList[currentRecitationsList.length - 1] !== currentRecitation) {
    for (let index = 0; index < currentRecitationsList.length; index++) {
      if (currentRecitation === currentRecitationsList[index]) {
        currentIndex = index;
      }
    }
    let remainingRecitations = currentRecitationsList.length - currentIndex;
    currentRecitationsList.splice(currentIndex + 1, remainingRecitations - 1);
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  }
  if (currentRecitation !== null) {
    if (currentRecitation.url !== JSON.parse(btn.getAttribute("data-surah")).url) {
      currentRecitation = JSON.parse(btn.getAttribute("data-surah"));
      playlistPush();
      updateSurah();
    }
  }
  else {
    currentRecitation = JSON.parse(btn.getAttribute("data-surah"));
    localStorage.setItem("currentRecitation", JSON.stringify(currentRecitation));
    playlistPush();
    updateSurah();
  }
}

function playlistPush() {
  if (currentRecitationsList.length === 5) {
    currentRecitationsList.shift();
  }
  currentRecitationsList.push(currentRecitation);
  localStorage.setItem("currentRecitation", JSON.stringify(currentRecitation));
  localStorage.setItem("currentRecitationsList", JSON.stringify(currentRecitationsList));
}

function updateSurahByControls() {
  let reciterIndex = 0;
  let typeIndex2 = 0;
  let kIndex;
  let isFinal = false;

  if (currentRecitationsList.length === 0) {
    if (isShuffling) {
      shuffleMode();
    }
  }
  if (currentRecitationsList.length > 0 && currentIndex === currentRecitationsList.length - 1) {
    if (isShuffling) {
      shuffleMode();
    }
    else {
      for (let i = 0; i < reciters.length; i++) {
        if (currentRecitation.name === reciters[i].name) {
          reciterIndex = i;
          break;
        }
      }
      for (let j = 0; j < reciters[reciterIndex].length; j++) {
        if (currentRecitation.type === reciters[reciterIndex].recitations[j][0].type) {
          typeIndex2 = j;
          console.log(typeIndex2);
          break;
        }
      }
      for (let k = 0; k < reciters[reciterIndex].recitations[typeIndex2].length; k++) {
        if (currentRecitation.url === reciters[reciterIndex].recitations[typeIndex2][k].url) {
          if (k === reciters[reciterIndex].recitations[typeIndex2].length - 1) isFinal = true;
          kIndex = k;
          break;
        }
      }
    }
    if (isFinal) {
      console.log("ELSE 200");
      shuffleMode();
    }
    else {
      currentRecitation = reciters[reciterIndex].recitations[typeIndex2][kIndex + 1];
      console.log("IF 100");
      updateSurah();
    }
  }
  else {
    currentRecitation = currentRecitationsList[currentIndex];
    updateSurah();
  }

  playlistPush();
}

function updateSurah() {
  ctr.src = `https://www.youtube.com/embed/${currentRecitation.url}?autoplay=1&loop=0&enablejsapi=1&widgetid=1`;
  if (!isImageHidden) { 
    reciterImage[0].src = currentRecitation.image;
    reciterImage[1].src = currentRecitation.image;
  }
  else {
    reciterImage[0].src = bgImageSrc;
    reciterImage[1].src = bgImageSrc;
  }
  reciterImage[0].parentElement.setAttribute("data-name", currentRecitation.name);
  surahName[0].innerHTML = currentRecitation.surah;
  surahName[1].innerHTML = currentRecitation.surah;
  if (currentRecitation.type !== null) {
    recitationType[0].innerHTML = `(${currentRecitation.type})`;
    recitationType[1].innerHTML = `(${currentRecitation.type})`;
  }
  else {
    recitationType[0].innerHTML = "";
    recitationType[1].innerHTML = "";
  }
  reciterName[0].innerHTML = currentRecitation.name;
  reciterName[1].innerHTML = currentRecitation.name;
  localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  localStorage.setItem("currentRecitation", JSON.stringify(currentRecitation));
  localStorage.setItem("currentRecitationsList", JSON.stringify(currentRecitationsList));
  checkPlaying();
  updateSeek(player.getDuration());
}

function checkPlaying() {
  let surahList = document.getElementById("surah-list");
  if (currentRecitation !== null && surahList !== null) {
    for (let index = 0; index < surahList.children.length; index++) {
      var dataSurah = JSON.parse(surahList.children[index].getAttribute("data-surah"));
      if (currentRecitation.url === dataSurah.url) {
        surahList.children[index].classList.add("selected");
      }
      else surahList.children[index].classList.remove("selected");
    }
  }
}

function toggleImage() {
  isImageHidden = !isImageHidden;

  let selectedReciterImage = document.getElementById("selected-reciter-image");

  if (isImageHidden) {
    reciterBtns.forEach(reciterBtn => {
      reciterBtn.children[1].classList.add("hide-image");
    });
    reciterImage[0].src = bgImageSrc;
    reciterImage[1].src = bgImageSrc;
    selectedReciterImage.src = bgImageSrc;
  }
  else {
    reciterBtns.forEach(reciterBtn => {
      reciterBtn.children[1].classList.remove("hide-image");
    });
    if (currentRecitation !== null) {
      reciterImage[0].src = currentRecitation.image;
      reciterImage[1].src = currentRecitation.image;
    }
    
    selectedReciterImage.src = eStoredImage;
  }

  localStorage.setItem("isImageHidden", JSON.stringify(isImageHidden));
}

function toggleName() {
  isShowingName = !isShowingName;
  if (isShowingName) {
    reciterBtns.forEach(reciterBtn => {
            reciterBtn.children[2].firstElementChild.classList.add("show-name");
        });
    }
    else {
        reciterBtns.forEach(reciterBtn => {
            reciterBtn.children[2].firstElementChild.classList.remove("show-name");
        });
    }
    localStorage.setItem("isShowingName", JSON.stringify(isShowingName));
}

let tagsDiv = document.getElementById("tags-div");

let tags = ["Murattal", "Mujawwad", "Warsh", "Qaloon", "Khalaf 'an Hamzah", "Al-Bazzi"];
let selectedTags = [];

function createTag() {
  for (let i = 0; i < tags.length; i++) {
    let tagBtn = document.createElement("button");
    tagBtn.innerHTML = tags[i];
    tagBtn.classList.add("tag");
    tagBtn.addEventListener("click", toggleTag);
    tagsDiv.appendChild(tagBtn);
  }
}

createTag();

let lowerCaseReciterValue = "";
let lowerCaseReciterName = "";

let lowerCaseSurahValue = "";
let lowerCaseSurahName = "";

let lowerCaseSurahValue2 = "";
let lowerCaseSurahName2 = "";

function toggleTag(event) {
  let tag = event.target;
  if (selectedTags.includes(tag.innerHTML)) {
    tag.classList.remove("selected-tag");
    selectedTags.splice(selectedTags.indexOf(tag.innerHTML), 1);
  }
  else {
    tag.classList.add("selected-tag");
    selectedTags.push(`${tag.innerHTML}`);
  }
  updateRecitersByQuery();
}

let reciterSearchBar = document.getElementById("reciter-search-bar");
let surahSearchBar;

reciterSearchBar.value = "";

function searchReciterInput(value) {
  lowerCaseReciterValue = value;
  updateRecitersByQuery();
}

function updateRecitersByQuery() {
  for (let i = 0; i < recitersDiv.children.length; i++) {
    lowerCaseReciterName = JSON.parse(recitersDiv.children[i].getAttribute("data-e")).name.toLowerCase().replaceAll("-", " ");
    formattedText = lowerCaseReciterValue.toLowerCase().replaceAll("-", " ");
    lowerCaseReciterName = " " + lowerCaseReciterName;
    regex = RegExp(`\\s${formattedText}`);
    let typeData = JSON.parse(recitersDiv.children[i].getAttribute("data-e")).types;

    if (selectedTags.every((val) => typeData.includes(val)) && lowerCaseReciterName.match(regex)) {

      recitersDiv.children[i].classList.remove("hidden-reciter");

      /*if (lowerCaseReciterValue !== "") {
        const target = recitersDiv.children[i].children[2].firstElementChild;
        const text = target.textContent;
        const start = text.indexOf(lowerCaseReciterValue);
        const end = start + lowerCaseReciterValue.length;

        const span = document.createElement('span');
        span.textContent = lowerCaseReciterValue;

        target.replaceChildren(document.createTextNode(text.slice(0,start)), span, document.createTextNode(text.slice(end)));
      }*/
    }
    else recitersDiv.children[i].classList.add("hidden-reciter");
  }
  
  /*if (selectedTags.length == 0 && lowerCaseReciterValue === "") {
    for (let i = 0; i < recitersDiv.children.length; i++) {
      //recitersDiv.children[i].children[2].firstElementChild.classList.remove("search-highlight");
    }
  }*/

  queryResultCount();
}

function searchSurahInput(value) {
  lowerCaseSurahValue = value;
  updateSurahsByQuery();
}

function updateSurahsByQuery() {
  for (let i = 0; i < surahList.children.length; i++) {
    let lowerCaseSurahName = JSON.parse(surahList.children[i].getAttribute("data-surah")).surah.toLowerCase().replaceAll("-", " ");
    formattedText = lowerCaseSurahValue.toLowerCase().replaceAll("-", " ");
    lowerCaseSurahName = " " + lowerCaseSurahName;
    regex = RegExp(`\\s${formattedText}`);

    if (lowerCaseSurahName.match(regex)) surahList.children[i].classList.remove("hidden-reciter");
    else surahList.children[i].classList.add("hidden-reciter");
  }
}

let queryResultCountText = document.getElementById("query-result-count");
let noResults =  document.querySelector(".no-results");

queryResultCountText.innerHTML = `${reciters.length}/${reciters.length} showing`;

function queryResultCount() {
  let resultsLength = document.getElementsByClassName("hidden-reciter").length;
  let differenceOfLengths = reciters.length - resultsLength;
  queryResultCountText.innerHTML = `${differenceOfLengths}/${reciters.length} showing`;

  if (differenceOfLengths === 0) noResults.classList.remove("hidden");
  else noResults.classList.add("hidden");
}

//let recentlyPlayedDiv = document.getElementById("recently-played-div");
//let favouritesListDiv = document.getElementById("favourites-list-div");

/*function createRecentlyPlayed(recitation) {
  let rec = document.createElement("btn");

  rec.classList.add("recently-played-recitation");

  let img = document.createElement("img");
  let div = document.createElement("div");
  let h3 = document.createElement("h3");
  let p = document.createElement("p");

  div.appendChild(h3);
  div.appendChild(p);
  rec.appendChild(img);
  rec.appendChild(div);

  img.src = recitation.image;
  h3.innerHTML = recitation.surah;
  p.innerHTML = recitation.name;

  recentlyPlayedDiv.append(rec);

  rec.setAttribute("data-surah", JSON.stringify(recitation));
  rec.addEventListener("click", updateSurahByLink);
}*/

/*function createFavourite(recitation) {
  let rec = document.createElement("btn");

  rec.classList.add("recently-played-recitation");

  let img = document.createElement("img");
  let div = document.createElement("div");
  let h3 = document.createElement("h3");
  let p = document.createElement("p");

  div.appendChild(h3);
  div.appendChild(p);
  rec.appendChild(img);
  rec.appendChild(div);

  img.src = recitation.image;
  h3.innerHTML = recitation.surah;
  p.innerHTML = recitation.name;

  favouritesListDiv.append(rec);

  rec.setAttribute("data-surah", JSON.stringify(recitation));
  rec.addEventListener("click", updateSurahByLink);
}

function addRecentlyPlayed() {
  for (let index = recentlyPlayed.length - 1; index >= 0; index--) {
    createRecentlyPlayed(recentlyPlayed[index]);
  }
}

function addFavourites() {
  for (let index = favouritesPlaylist.length - 1; index >= 0; index--) {
    createFavourite(favouritesPlaylist[index]);
  }
}

function updateRecentlyPlayed(recitation) {
  if (recentlyPlayed.length === 0) {
    recentlyPlayed.push(recitation);
  }
  else {
    if (recentlyPlayed.length - 1 === 4) {
      recentlyPlayed.shift();

      for (let i = recentlyPlayed.length - 1; i >= 0; i--) {
        if (recitation.url === recentlyPlayed[i].url) {
          recentlyPlayed.splice(i, 1);
          break;
        }
        else {
          if (i === recentlyPlayed.length - 1) {
            recentlyPlayed.push(recitation);
          }
        }
      }
    }
    else {
      for (let i = recentlyPlayed.length - 1; i >= 0; i--) {
        if (recitation.url === recentlyPlayed[i].url) {
          recentlyPlayed.splice(i, 1);
          break;
        }
        else {
          if (i === recentlyPlayed.length - 1) {
            recentlyPlayed.push(recitation);
          }
        }
      }
    }
  }

  localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));

  Array.from(recentlyPlayedDiv.children).forEach(rpd => {
      rpd.remove();
  });
  
  addRecentlyPlayed();
}*/

let shuffle = document.querySelectorAll(".shuffle");

function toggleShuffle() {
  if (!isShuffling) {
    shuffle[0].classList.add("shuffle-active");
    shuffle[1].classList.add("shuffle-active");
    isShuffling = true;
  }
  else {
    shuffle[0].classList.remove("shuffle-active");
    shuffle[1].classList.remove("shuffle-active");
    isShuffling = false;
  }
  localStorage.setItem("isShuffling", JSON.stringify(isShuffling));
}

function checkShuffle() {
  if (isShuffling) {
    shuffle[0].classList.add("shuffle-active");
    shuffle[1].classList.remove("shuffle-active");
  }
  else {
    shuffle[0].classList.remove("shuffle-active");
    shuffle[1].classList.remove("shuffle-active");
  }
}

checkShuffle();

/*function toggleFavourite() {
  if (favouritesPlaylist.length === 0) {
    favouritesPlaylist.push(currentRecitation);
    console.log("REC x2");
  }
  else {
    for (let i = 0; i < favouritesPlaylist.length; i++) {
      if (currentRecitation.url === favouritesPlaylist[i].url) {
        favouritesPlaylist.splice(i, 1);
        console.log(i);
        console.log("OLD", currentRecitation.url, favouritesPlaylist[i].url);
        break;
      }
      else {
        favouritesPlaylist.push(currentRecitation);
        console.log("NEW", currentRecitation.url, favouritesPlaylist[i].url);
      }
    }
  }

  localStorage.setItem("favouritesPlaylist", JSON.stringify(favouritesPlaylist));

  Array.from(favouritesListDiv.children).forEach(rpd => {
    rpd.remove();
  });

  addFavourites();
}*/

//addRecentlyPlayed();

//addFavourites();

let pageOptions = document.querySelectorAll(".page-option");
let activePageLine = document.getElementById("active-page-line");

function colorPageOption(et) {
  et.appendChild(activePageLine);

  for (let i = 0; i < pageOptions.length; i++) {
    if (et === pageOptions[i]) pageOptions[i].classList.add("active-page-option");
    else pageOptions[i].classList.remove("active-page-option");
  }
}

function shuffleMode() {
  let randomReciter = reciters[Math.floor(Math.random() * reciters.length)];
  let randomType = randomReciter.recitations[Math.floor(Math.random() * randomReciter.recitations.length)];
  let randomRecitation = randomType[Math.floor(Math.random() * randomType.length)];
  currentRecitation = randomRecitation;
  updateSurah();
}

//let homePageOption = document.getElementById("home");
//let homePage = document.querySelector(".home");

let recitersPageOption = document.getElementById("reciters");
let recitersPage = document.querySelector(".reciters");

//homePageOption.classList.add("active-page-option");
//homePageOption.appendChild(activePageLine);
//content.appendChild(homePage);

recitersPageOption.classList.add("active-page-option");
recitersPageOption.appendChild(activePageLine);
content.appendChild(recitersPage);

function checkReciterURL() {
  let url = window.location.href;
  split_side = url.split("#")[1];

  for (let i = 0; i < reciters.length; i++) {
    if (split_side === reciters[i].urlName) {
      toggleDivOnLoad(eval(split_side));
      break;
    }
  }
}

checkReciterURL();

let nowPlaying = document.querySelector(".now-playing");

function toggleNowPlaying() {
  if (!nowPlaying.classList.contains("move-now-playing-up")) {
    nowPlaying.classList.add("move-now-playing-up");
  }
  else {
    nowPlaying.classList.remove("move-now-playing-up");
  }
}