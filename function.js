let currentIndex = JSON.parse(localStorage.getItem("currentIndex")) || 0;
let currentPlaylist = JSON.parse(localStorage.getItem("currentPlaylist")) || [];
let currentRecitation = JSON.parse(localStorage.getItem("currentRecitation")) || null;
let currentTime = JSON.parse(localStorage.getItem("currentTime")) || 0;

let isLooping = false;

//#region LOADER
let loader = document.getElementById("loader");

loader.remove();

function onceLoaded() {
  //loader.remove();
}
//#endregion

let menu = document.getElementById("menu");
let arrow = document.querySelector(".arrow");

function menuUp() {
  if (menu.classList.contains("up")) {
    menu.classList.remove("up");
    menu.classList.add("down");
    arrow.classList.remove("rotate");
  }
  else {
    menu.classList.remove("down");
    menu.classList.add("up");
    arrow.classList.add("rotate");
  }
}

function reset() {
  localStorage.clear();
  location.reload();
}

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

let isStartIcon = true;

function onPlayerReady(event) {
  setTimeText();
  player.setPlaybackRate(playbackOptions[playbackIndex]);
  player.playVideo();
  updateSeek(player.getDuration());

  if (isStartIcon) {
    icon.src = "https://www.pngall.com/wp-content/uploads/9/White-Play-Silhoutte-PNG1.png";
    isStartIcon = false;
  }
  else {
    icon.src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
  }
}

let icon = document.getElementById("youtube-icon");
icon.style.transform = "translateX(1.5px)";

let isPlaying = false;

function playToggle() {
  if (isPlaying) {
    player.playVideo();
    icon.src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
    icon.style.transform = "translateX(0)";
    isPlaying = false;
  }
  else if (!isPlaying && currentRecitation !== null) {
    player.pauseVideo();
    icon.src = "https://www.pngall.com/wp-content/uploads/9/White-Play-Silhoutte-PNG1.png";
    icon.style.transform = "translateX(1.5px)";
    isPlaying = true;
  }
}
//#endregion

let recitersCount = document.getElementById("reciters-count");

function countReciters() {
  recitersCount.innerHTML = `${reciters.length} reciters`;
}

countReciters();

let recitersDiv = document.getElementById("reciters-div");

let surahListParent = document.getElementById("surah-list-parent");
let surahList = document.getElementById("surah-list");

let canShowPhotos = JSON.parse(localStorage.getItem("canShowPhotos"));

/*let imageToggle = document.getElementById("image-toggle");

if (canShowPhotos) imageToggle.style.backgroundColor = "blue";
else imageToggle.style.backgroundColor = "white";

function togglePhotos() {
  let toggleItems = document.querySelectorAll(".toggleOff");

  toggleItems.forEach(item => {
    item.classList.remove("toggleOff");
  });
}*/

let myRange = document.getElementById("myRange");

function updateSeek(maxRange) {
  myRange.value = 0;
  myRange.max = maxRange;
}

let isChanging = false;

function startChange() {
  isChanging = true;
  console.log(isChanging);
}

function changeSeek() {
  console.log(myRange.value);
  player.seekTo(myRange.value);
  isChanging = false;
}

function createReciter(reciter) {
  let e = document.createElement("button");
  let image = document.createElement("img");
  let bgDiv = document.createElement("div");
  let name = document.createElement("p");
  e.classList.add("reciter");
  image.classList.add("reciter-image");
  bgDiv.classList.add("bg-div");
  name.classList.add("reciter-name");

  image.src = reciter.image;
  name.innerHTML = reciter.name;

  e.appendChild(image);
  recitersDiv.appendChild(e);
  e.appendChild(bgDiv);
  bgDiv.appendChild(name);

  e.setAttribute("data-e", JSON.stringify(reciter));
  e.addEventListener("click", toggleDiv);
}

reciters.forEach(reciter => {
  createReciter(reciter);
});

let reciterDiv = document.querySelector(".reciters");
let selectionDiv = document.getElementById("selection-div");
let selectedReciterName = document.getElementById("selected-reciter-name");
let selectedReciterImageDiv = document.getElementById("selected-reciter-image-div");
let selectedReciterImage = document.getElementById("selected-reciter-image");
let sectionList = document.getElementById("section-list");

function toggleDiv() {
  if (selectionDiv.classList.contains("hidden")) {
    selectionDiv.classList.remove("hidden");
    reciterDiv.classList.add("hidden");
    selectedReciterImage.src = JSON.parse(this.getAttribute("data-e")).image;
    selectedReciterName.innerHTML = JSON.parse(this.getAttribute("data-e")).name;
    currentReciter = this;
  }
  else {
    selectionDiv.classList.add("hidden");
    reciterDiv.classList.remove("hidden");
    reciterDiv.classList.add("active");
    typeIndex = 0;
  }

  removeSelectionButtons();
  createSectionButtons(this);
  checkPlaying();
}

let volume = 0;

function toggleLoop() {
  isLooping = !isLooping;
  volume += 10;
  player.setVolume(volume);
}

let typeIndex = 0;
let currentReciter = null;

function createSectionButtons(t) {
  if (JSON.parse(t.getAttribute("data-e")).types[0] !== null) {
    for (let i = 0; i < Object.keys(JSON.parse(t.getAttribute("data-e")).types).length; i++) {
      let btn = document.createElement("button");
      btn.classList.add("section-button");
      btn.innerHTML = JSON.parse(t.getAttribute("data-e")).types[i];
      sectionList.appendChild(btn);
      btn.setAttribute("data-type-index", JSON.stringify(i));
      btn.addEventListener("click", toggleSection);
      toggleSectionColor();
    }
  }

  addSurahs(0);
}

function removeSelectionButtons() {
  Array.from(sectionList.children).forEach(el => {
    el.remove();
  });
  removeSurahs();
}

let noData = document.getElementById("no-data");

function addSurahs() {
  t = currentReciter;
  for (let i = 0; i < JSON.parse(t.getAttribute("data-e")).recitations[typeIndex].length; i++) {
    let btn = document.createElement("button");
    btn.classList.add("surah-button");
    btn.innerHTML = JSON.parse(t.getAttribute("data-e")).recitations[typeIndex][i].surah;
    surahList.appendChild(btn);
    
    btn.setAttribute("data-reciter", JSON.stringify(JSON.parse(t.getAttribute("data-e"))));
    btn.setAttribute("data-surah", JSON.stringify(JSON.parse(t.getAttribute("data-e")).recitations[typeIndex][i]));
    btn.addEventListener("click", updateSurahByLink);
  }

  if (JSON.parse(t.getAttribute("data-e")).recitations[typeIndex].length === 0) {
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
    addSurahs();
    toggleSectionColor();
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

const pages = document.querySelectorAll(".page");

function togglePage(href) {
    for (let page = 0; page < pages.length; page++) {
        if (pages[page].className.split("page ").pop() === href.split("#").pop()) {
            console.log(pages[page].className.split("page ").pop(), href.split("#").pop())
            pages[page].classList.add("active");
        }
        else if (pages[page].className !== href.split("#").pop()) {
            pages[page].classList.remove("active");
        }
    }
}

function goBack() {
  let currentTime = player.getCurrentTime();
  player.seekTo(currentTime - 15);
}

function goForward() {
  let currentTime = player.getCurrentTime();
  player.seekTo(currentTime + 15);
}

//#region LINE
let currentTimeText = document.getElementById("current-time");
let fullTimeText = document.getElementById("full-time");

function updateLine() {
  currentTimeText.innerHTML = Math.round(player.getCurrentTime());
  currentTime = player.getCurrentTime();
  localStorage.setItem("currentTime", JSON.stringify(currentTime));
  setCurrentTimeText();
  if (!isChanging) myRange.value = player.getCurrentTime();
  if (player.getCurrentTime() === player.getDuration()) {
    //player.seekTo(0);
    //nextSurah();
    //if (!isLooping) nextSurah();
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
    fullTimeText.innerHTML = hours + ':' + minutes + ':' + seconds;
  }
  else if (minute_is_the_max) fullTimeText.innerHTML = minutes + ':' + seconds;
  else if (second_is_the_max) fullTimeText.innerHTML = minutes + ':' + seconds;
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
    currentTimeText.innerHTML = hours + ':' + minutes + ':' + seconds;
  }
  else if (minute_is_the_max) currentTimeText.innerHTML = minutes + ':' + seconds;
  else if (second_is_the_max) currentTimeText.innerHTML = minutes + ':' + seconds;
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


let reciterImage = document.getElementById("player-image");
let surahName = document.getElementById("surah-name");
let recitationType = document.getElementById("recitation-type");
let reciterName = document.getElementById("reciter-name");

function keepIndexInCheck(isNext) {
  if (isNext) {
    if (currentIndex < currentPlaylist.length - 1) {
      currentIndex++;
    }
  }
  else {
    if (currentIndex > 0) {
      currentIndex--;
    }
  }
}

function previousSurah() {
  isPlaying = true;
  keepIndexInCheck(false);
  localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  updateSurahByControls();
  //icon.src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
}

function nextSurah() {
  isPlaying = true;
  keepIndexInCheck(true);
  localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  updateSurahByControls();
  //icon.src = "https://icons.veryicon.com/png/o/object/material-design-icons-1/pause-38.png";
  console.log("next");
}

function findIndex() {
  for (let i = 0; i < currentPlaylist.length; i++) {
    if (currentPlaylist[i].url === currentRecitation.url) {
      return i;
    }
  }
}

function updateSurahByLink(event) {
  var btn = event.target;
  if (currentRecitation !== null) {
    if (currentRecitation.url !== JSON.parse(btn.getAttribute("data-surah")).url) {
      currentRecitation = JSON.parse(btn.getAttribute("data-surah"));
      currentPlaylist.push(currentRecitation);
      updateSurah();
    }
  }
  else {
    currentRecitation = JSON.parse(btn.getAttribute("data-surah"));
    currentPlaylist.push(currentRecitation);
    updateSurah();
  }
}

function updateSurahByControls() {
  if (currentPlaylist.length > 0) {
    if (currentRecitation.url !== currentPlaylist[currentIndex].url) {
      currentRecitation = currentPlaylist[currentIndex];
      updateSurah();
    }
  }
}

function updateSurah() {
  ctr.src = `https://www.youtube.com/embed/${currentRecitation.url}?autoplay=1&loop=0&enablejsapi=1&widgetid=1`;
  reciterImage.src = currentRecitation.image;
  surahName.innerHTML = currentRecitation.surah;
  if (currentRecitation.type !== null) recitationType.innerHTML = `(${currentRecitation.type})`;
  else recitationType.innerHTML = "";
  reciterName.innerHTML = currentRecitation.name;
  localStorage.setItem("currentIndex", JSON.stringify(currentIndex));
  localStorage.setItem("currentRecitation", JSON.stringify(currentRecitation));
  localStorage.setItem("currentPlaylist", JSON.stringify(currentPlaylist));
  checkPlaying();
  updateSeek(player.getDuration());
}

function checkPlaying() {
  for (let index = 0; index < surahList.children.length; index++) {
    var dataSurah = JSON.parse(surahList.children[index].getAttribute("data-surah"));
    if (currentRecitation.url === dataSurah.url) {
      surahList.children[index].classList.add("selected");
    }
    else surahList.children[index].classList.remove("selected");
  }
}