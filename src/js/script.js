const elements = {
  searchForm: document.querySelector('.js-search-form'),
  list: document.querySelector('.js-list'),
};

elements.searchForm.addEventListener('submit', handlerSearch);

function handlerSearch(evt) {
  evt.preventDefault();

  const { city, days } = evt.currentTarget.elements;
  console.dir(city.value);
  console.dir(days.value);

  // Call the request function on the backend, get data and create markup
  serviceWeather(city.value, days.value)
    .then(
      data =>
        (elements.list.innerHTML = createMarkup(data.forecast.forecastday))
    )
    .catch(err => console.log(err))
    // Clearing the form after a request
    .finally(() => evt.target.reset());
}

// Backend request function
function serviceWeather(city, days) {
  const BASE_URL = 'https://api.weatherapi.com/v1';
  const END_POINT = '/forecast.json';
  const API_KEY = '6410346f89264d6e919165208231505';

  // an instance of the URLSearchParams class for composing a string of parameters
  const params = new URLSearchParams({
    key: API_KEY,
    q: city,
    days: days,
    lang: 'ru',
  });

  return fetch(`${BASE_URL}${END_POINT}?${params}`).then(resp => {
    console.log(resp);
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    return resp.json();
  });
}

// Markup function
function createMarkup(arr) {
  return arr
    .map(
      ({
        date,
        day: {
          avgtemp_c,
          condition: { icon, text },
        },
      }) => `<li class="weather-card">
    <img src="${icon}" alt="${text}" class="weather-icon"/>
    <h2 class="date">${date}</h2>
    <h3 class="weather-text">${text}</h3>
    <h3 class="temperature">${avgtemp_c} °C</h3>
</li>`
    )
    .join('');
}
