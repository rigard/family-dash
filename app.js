const MORNING_START = 6 * 60 + 30;
const MORNING_END = 8 * 60;
const DAY_SLIDE_DURATION = 20000;

const morningTasks = [
  '1. Get Dressed',
  '2. Eat Breakfast',
  '3. Brush Teeth',
  '4. Pack Bag',
];

const familyValues = ['Honesty', 'Fun', 'Kindness', 'Responsibility', 'Respect'];

const chores = [
  { task: 'Set the table', owner: 'Everyone' },
  { task: 'Feed the pet', owner: 'Little kid' },
  { task: 'Clear the dishes', owner: 'Big kid' },
  { task: 'Water the plants', owner: 'Grown-ups' },
  { task: 'Tidy the living room', owner: 'Everyone' },
  { task: 'Take out recycling', owner: 'Big kid' },
];

const words = [
  { word: 'Curiosity', definition: 'A little wonder that makes you want to learn more.' },
  { word: 'Resilient', definition: 'Able to try again when something feels tricky.' },
  { word: 'Generous', definition: 'Happy to share your time, help, or good things.' },
  { word: 'Courage', definition: 'Doing something brave, even when you feel nervous.' },
  { word: 'Gratitude', definition: 'Noticing the good things and feeling glad they are here.' },
  { word: 'Inventive', definition: 'Good at coming up with new ideas and ways to play.' },
  { word: 'Patient', definition: 'Giving things time, even when you are excited.' },
];

const highlights = [
  {
    type: 'values',
    kicker: 'The things that make us us',
    title: 'Our family values',
    body: 'Five things we carry with us, wherever the day takes us.',
    note: 'Our family, our way',
  },
  {
    type: 'word',
    kicker: 'A word worth keeping',
    title: '',
    body: '',
    note: 'Can you use it in a sentence?',
  },
  {
    type: 'photo',
    kicker: 'A moment together',
    title: 'More little adventures, please.',
    body: 'The best days are often the ones we did not plan. What should we go and explore together next?',
    note: 'Pick our next family adventure',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Sunlight falling across a leafy woodland trail',
    caption: 'Somewhere new is closer than we think.',
  },
  {
    type: 'fact',
    kicker: 'A curious little fact',
    title: 'Octopuses have three hearts.',
    body: 'Two move blood to the gills. The third keeps it flowing to the rest of the body. What would you do if you had three hearts?',
    note: 'Something to talk about at dinner',
    image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'An octopus resting on the sandy ocean floor',
    caption: 'A little ocean wonder for today.',
  },
  {
    type: 'quote',
    kicker: 'A note for all of us',
    title: 'You do not have to be perfect to be wonderful.',
    body: 'We get to learn as we go. That is part of growing.',
    note: 'A little reminder from home',
  },
];

const storage = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The dashboard remains usable if local storage is unavailable.
    }
  },
};

function dayKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function wordForToday(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  return words[dayOfYear % words.length];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function isMorningTime(date) {
  const minuteOfDay = date.getHours() * 60 + date.getMinutes();
  return minuteOfDay >= MORNING_START && minuteOfDay < MORNING_END;
}

function main() {
  const elements = {
    clock: document.querySelector('#clock'),
    currentDay: document.querySelector('#current-day'),
    currentDate: document.querySelector('#current-date'),
    weatherButton: document.querySelector('#weather-button'),
    weatherIcon: document.querySelector('#weather-icon'),
    weatherTemp: document.querySelector('#weather-temp'),
    weatherPlace: document.querySelector('#weather-place'),
    morningView: document.querySelector('#morning-view'),
    dayView: document.querySelector('#day-view'),
    todoGroups: document.querySelector('#todo-groups'),
    todoProgress: document.querySelector('#todo-progress'),
    morningWord: document.querySelector('#morning-word-heading'),
    morningDefinition: document.querySelector('#morning-definition'),
    dayHeading: document.querySelector('#day-heading'),
    slideKicker: document.querySelector('#slide-kicker'),
    dayFeature: document.querySelector('#day-feature'),
    slideCount: document.querySelector('#slide-count'),
    viewLabel: document.querySelector('#view-label'),
    slidePrevious: document.querySelector('#slide-previous'),
    slideNext: document.querySelector('#slide-next'),
    morningListOpen: document.querySelector('#morning-list-open'),
    morningListClose: document.querySelector('#morning-list-close'),
    morningListPanel: document.querySelector('#morning-list-panel'),
    morningListBackdrop: document.querySelector('#morning-list-backdrop'),
    morningListTodos: document.querySelector('#morning-list-todos'),
    morningListProgress: document.querySelector('#morning-list-progress'),
    choresOpen: document.querySelector('#chores-open'),
    choresClose: document.querySelector('#chores-close'),
    choresPanel: document.querySelector('#chores-panel'),
    choresBackdrop: document.querySelector('#chores-backdrop'),
    choresDate: document.querySelector('#chores-date'),
    choreList: document.querySelector('#chore-list'),
    announcement: document.querySelector('#announcement'),
  };

  let today = wordForToday(new Date());
  let currentSlide = 0;
  let activeView = '';
  let displayedDay = dayKey(new Date());

  elements.morningWord.textContent = today.word;
  elements.morningDefinition.textContent = today.definition;
  elements.choresDate.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  }).format(new Date());

  function renderClock() {
    const now = new Date();
    const currentDay = dayKey(now);
    if (currentDay !== displayedDay) {
      displayedDay = currentDay;
      today = wordForToday(now);
      elements.morningWord.textContent = today.word;
      elements.morningDefinition.textContent = today.definition;
      renderTodos();
      renderChores();
      if (highlights[currentSlide].type === 'word') renderSlide();
      elements.choresDate.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: 'long', month: 'long', day: 'numeric',
      }).format(now);
    }
    elements.clock.dateTime = now.toISOString();
    elements.clock.textContent = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric', minute: '2-digit',
    }).format(now);
    elements.currentDay.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
    }).format(now);
    elements.currentDate.textContent = new Intl.DateTimeFormat(undefined, {
      month: 'long', day: 'numeric', year: 'numeric',
    }).format(now);

    const nextView = isMorningTime(now) ? 'morning' : 'day';
    if (nextView !== activeView) {
      activeView = nextView;
      elements.morningView.hidden = nextView !== 'morning';
      elements.dayView.hidden = nextView !== 'day';
      elements.viewLabel.textContent = nextView === 'morning'
        ? 'Morning rhythm · 6:30–8:00'
        : 'A little inspiration, all day';
      elements.announcement.textContent = nextView === 'morning'
        ? 'Morning dashboard'
        : 'Daytime highlights';
    }
  }

  function renderTodos() {
    const key = `family-dash:todos:${dayKey(new Date())}`;
    const checked = storage.get(key, {});
    let completed = 0;
    const markup = morningTasks.map((task, index) => {
      const id = `todo-${index}`;
      const isChecked = Boolean(checked[id]);
      if (isChecked) completed += 1;
      return `<label class="todo-item"><input type="checkbox" data-todo-id="${id}"${isChecked ? ' checked' : ''}><span>${escapeHtml(task)}</span></label>`;
    }).join('');

    [
      { list: elements.todoGroups, progress: elements.todoProgress },
      { list: elements.morningListTodos, progress: elements.morningListProgress },
    ].forEach(({ list, progress }) => {
      list.innerHTML = markup;
      progress.textContent = `${completed} of ${morningTasks.length} ready`;
      list.querySelectorAll('[data-todo-id]').forEach((input) => {
        input.addEventListener('change', () => {
          const next = storage.get(key, {});
          next[input.dataset.todoId] = input.checked;
          storage.set(key, next);
          renderTodos();
        });
      });
    });
  }

  function renderSlide() {
    const slide = highlights[currentSlide];
    const wordSlide = slide.type === 'word';
    const title = wordSlide ? today.word : slide.title;
    const body = wordSlide ? today.definition : slide.body;
    const values = slide.type === 'values'
      ? `<ol class="family-values-list">${familyValues.map((value, index) => `<li><span class="value-number" aria-hidden="true">${index + 1}</span><strong>${escapeHtml(value)}</strong></li>`).join('')}</ol>`
      : '';
    const image = slide.image
      ? `<div class="feature-image-wrap"><img class="feature-image" src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.imageAlt)}"><span class="feature-image-caption">${escapeHtml(slide.caption)}</span></div>`
      : '';
    const copy = `<div class="feature-copy"><p class="eyebrow">${escapeHtml(slide.kicker)}</p><h2 class="feature-title">${escapeHtml(title)}</h2><p class="feature-body">${escapeHtml(body)}</p>${values}<p class="feature-note">${escapeHtml(slide.note)}</p></div>`;

    elements.dayFeature.className = `day-feature theme-${slide.type}`;
    elements.dayFeature.innerHTML = slide.type === 'quote' ? copy : `${image}${copy}`;
    elements.slideKicker.textContent = slide.kicker;
    elements.dayHeading.textContent = slide.type === 'photo'
      ? 'A little adventure, together'
      : slide.type === 'fact'
        ? 'A curious little discovery'
        : 'A little something for today';
    elements.slideCount.textContent = `${currentSlide + 1} / ${highlights.length}`;
  }

  function stepSlide(direction) {
    currentSlide = (currentSlide + direction + highlights.length) % highlights.length;
    renderSlide();
  }

  function renderChores() {
    const key = `family-dash:chores:${dayKey(new Date())}`;
    const checked = storage.get(key, {});

    elements.choreList.innerHTML = chores.map((chore, index) => {
      const isChecked = Boolean(checked[index]);
      return `<label class="chore-item"><input type="checkbox" data-chore-id="${index}"${isChecked ? ' checked' : ''}><span>${escapeHtml(chore.task)}</span><span class="chore-owner">${escapeHtml(chore.owner)}</span></label>`;
    }).join('');

    elements.choreList.querySelectorAll('[data-chore-id]').forEach((input) => {
      input.addEventListener('change', () => {
        const next = storage.get(key, {});
        next[input.dataset.choreId] = input.checked;
        storage.set(key, next);
      });
    });
  }

  function setChoresOpen(isOpen) {
    elements.choresPanel.classList.toggle('is-open', isOpen);
    elements.choresPanel.setAttribute('aria-hidden', String(!isOpen));
    elements.choresPanel.inert = !isOpen;
    elements.choresBackdrop.hidden = !isOpen;
    elements.choresOpen.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) elements.choresClose.focus();
    else elements.choresOpen.focus();
  }

  function setMorningListOpen(isOpen) {
    elements.morningListPanel.classList.toggle('is-open', isOpen);
    elements.morningListPanel.setAttribute('aria-hidden', String(!isOpen));
    elements.morningListPanel.inert = !isOpen;
    elements.morningListBackdrop.hidden = !isOpen;
    elements.morningListOpen.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) elements.morningListClose.focus();
    else elements.morningListOpen.focus();
  }

  const weatherCodes = new Map([
    [0, ['☀', 'Clear sky']], [1, ['🌤', 'Mostly clear']],
    [2, ['⛅', 'Partly cloudy']], [3, ['☁', 'Cloudy']],
    [45, ['〰', 'Foggy']], [48, ['〰', 'Foggy']],
    [51, ['☂', 'Light drizzle']], [53, ['☂', 'Drizzle']], [55, ['☂', 'Heavy drizzle']],
    [61, ['☂', 'Light rain']], [63, ['☂', 'Rain']], [65, ['☂', 'Heavy rain']],
    [71, ['❄', 'Light snow']], [73, ['❄', 'Snow']], [75, ['❄', 'Heavy snow']],
    [80, ['☂', 'Rain showers']], [81, ['☂', 'Rain showers']], [82, ['☂', 'Heavy showers']],
    [95, ['ϟ', 'Thunderstorms']], [96, ['ϟ', 'Thunderstorms']], [99, ['ϟ', 'Thunderstorms']],
  ]);

  function setWeatherPlaceholder(message = 'Set your location') {
    elements.weatherIcon.textContent = '☀';
    elements.weatherTemp.textContent = '--°C';
    elements.weatherPlace.textContent = message;
    elements.weatherButton.setAttribute('aria-label', `${message} for local weather`);
  }

  async function loadWeather(latitude, longitude) {
    elements.weatherPlace.textContent = 'Loading…';
    try {
      const query = new URLSearchParams({
        latitude: String(latitude), longitude: String(longitude),
        current: 'temperature_2m,weather_code',
        temperature_unit: 'celsius', timezone: 'auto',
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`);
      if (!response.ok) throw new Error('Weather request failed');
      const data = await response.json();
      const [icon, description] = weatherCodes.get(data.current.weather_code) || ['☁', 'Current weather'];
      const place = 'Your area';
      elements.weatherIcon.textContent = icon;
      elements.weatherTemp.textContent = `${Math.round(data.current.temperature_2m)}°C`;
      elements.weatherPlace.textContent = place;
      elements.weatherButton.setAttribute('aria-label', `${description}, ${Math.round(data.current.temperature_2m)} degrees Celsius in ${place}. Tap to refresh.`);
    } catch {
      setWeatherPlaceholder('Weather unavailable');
    }
  }

  function requestWeather() {
    if (!navigator.geolocation) {
      setWeatherPlaceholder('Location unavailable');
      return;
    }
    elements.weatherPlace.textContent = 'Finding you…';
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        storage.set('family-dash:location', { latitude: coords.latitude, longitude: coords.longitude });
        loadWeather(coords.latitude, coords.longitude);
      },
      () => setWeatherPlaceholder('Tap to allow location'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 },
    );
  }

  elements.weatherButton.addEventListener('click', requestWeather);
  elements.slidePrevious.addEventListener('click', () => stepSlide(-1));
  elements.slideNext.addEventListener('click', () => stepSlide(1));
  elements.morningListOpen.addEventListener('click', () => setMorningListOpen(true));
  elements.morningListClose.addEventListener('click', () => setMorningListOpen(false));
  elements.morningListBackdrop.addEventListener('click', () => setMorningListOpen(false));
  elements.choresOpen.addEventListener('click', () => setChoresOpen(true));
  elements.choresClose.addEventListener('click', () => setChoresOpen(false));
  elements.choresBackdrop.addEventListener('click', () => setChoresOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.choresPanel.classList.contains('is-open')) {
      setChoresOpen(false);
    }
    if (event.key === 'Escape' && elements.morningListPanel.classList.contains('is-open')) {
      setMorningListOpen(false);
    }
    if (event.key === 'ArrowRight' && activeView === 'day') stepSlide(1);
    if (event.key === 'ArrowLeft' && activeView === 'day') stepSlide(-1);
  });

  renderTodos();
  renderChores();
  renderSlide();
  renderClock();
  window.setInterval(renderClock, 15000);
  window.setInterval(() => {
    if (activeView === 'day') stepSlide(1);
  }, DAY_SLIDE_DURATION);

  const savedLocation = storage.get('family-dash:location', null);
  if (savedLocation) loadWeather(savedLocation.latitude, savedLocation.longitude);
}

if (typeof document !== 'undefined') main();