// const userTab = document.querySelector("[data-]");
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grantLocationContainer");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAceessBtn = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput");
const errorContainer = document.querySelector(".error-container");

let API_KEY = "3cff447ffbf00c1f92c6a42fefd14d75";
let currentTab = userTab;
currentTab.classList.add("current-tab");

// initially
getfromSessionStorage();

function switchTab(clickedTab) {
  errorContainer.classList.remove('active');

  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      // kya search form wala container is invisible, if yes then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // main pehle search wale tab par the, ab uour weather tab visible karna h
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // ab main your weather tab me aagya hu, toh weaather bhi display karna padega, so let's check local storage firsst for coordiantes, if we haved saved them there.
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  errorContainer.classList.remove('active');

  // pass clicked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  errorContainer.classList.remove('active');

  switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordiantes) {
  const { lat, lon } = coordiantes;
  // make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    console.log(data);
    errorContainer.classList.remove('active');
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    errorContainer.classList.remove('active');
    loadingScreen.classList.remove("active");
    // hw
    userInfoContainer.innerHTML = err;
  }
}

function renderWeatherInfo(weatherInfo) {
  // firstly, we have to fetch the elements


  if (!(weatherInfo?.cod == 404)) {
    // console.log(weatherInfo)

    errorContainer.classList.remove("active");

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherInnfo object and put it UI elements
    cityName.innerText = `${weatherInfo?.name}`;
    countryIcon.src = `https://flagcdn.com/96x72/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = `${weatherInfo?.weather?.[0]?.description}`;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
  } else {
    userInfoContainer.classList.remove("active");
    userContainer.classList.remove("active");
    errorContainer.classList.add("active");
    // let div = document.createElement("div");
    // div.innerHTML =
    //   ' <img src="./asset/404_a-removebg.png" alt="" height="400px" width="500px" loading="lazy">';
    // // let p = document.createElement('p');
    // // p.innerHTML = 'City Not Found!'
    // userContainer.appendChild(div);
    // // userContainer.appendChild(p);
  }
}

grantAceessBtn.addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("geolocation is not supported");
  }
}
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

searchForm.addEventListener("submit", (e) => {
  errorContainer.classList.remove('active');

  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    // console.log(data);
    loadingScreen.classList.remove("active");
    errorContainer.classList.remove('active');
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    errorContainer.classList.remove('active');
    userInfoContainer.innerText = err;
  }
}
