function createCardElement(title, description, image_url, image_description) {
  let card_el = document.createElement("article")
  card_el.classList.add("card", "mb-2", "me-4")

  let image_el = createImageElement(image_url, image_description)
  image_el.classList.add("card-img-top")

  let card_body_el = document.createElement("div")
  card_body_el.classList.add("card-body")

  let title_el = document.createElement("h3")
  title_el.textContent = title
  title_el.classList.add("card-title")

  let text_el = document.createElement("p")
  text_el.textContent = truncateText(description, 100)
  text_el.classList.add("card-text")

  card_body_el.appendChild(title_el)
  card_body_el.appendChild(text_el)

  card_el.appendChild(image_el)
  card_el.appendChild(card_body_el)

  return card_el
}

function createImageElement(url, description) {
  let el
  if (url && description) {
    el = document.createElement("img")
    el.src = url
    el.alt = description
  } else {
    el = document.createElement("div")
    el.classList.add("img-sample")
  }
  return el
}

function createSampleCardElement() {
  return createCardElement("Carregando...", "...")
}

function truncateText(text, max = 30) {
  if (text.length > max) {
    return text.slice(0, max - 3) + "..."
  }
  return text
}

function displayResultsAsCards(container_el, results) {
  container_el.innerHTML = ""
  for (let result of results) {
    container_el.appendChild(
      createCardElement(
        result.title,
        result.explanation,
        result.url,
        result.title
      )
    )
  }
}

function displayCardPlaceholders(container_el, quantity) {
  container_el.innerHTML = ""
  for (let i = 0; i < quantity; i++) {
    container_el.appendChild(createSampleCardElement())
  }
}

class ApiConnection {
  constructor() {
    // this.API_KEY = "https://api.nasa.gov/planetary/apod"
    // this.API_URL = "DEMO_KEY"
  }

  get API_URL() {
    return "https://api.nasa.gov/planetary/apod"
  }

  get API_KEY() {
    return "DEMO_KEY"
  }

  get API_URL_WITH_KEY() {
    return this.API_URL + "?api_key=" + this.API_KEY
  }

  async getRandomImages(count) {
    const request_url = this.API_URL_WITH_KEY + "&count=" + count

    const resp = await fetch(request_url)
    if (resp.ok) {
      return await resp.json()
    }
    throw new Error("Error fetching API, status: " + resp.status)
  }
  async getImagesForDateRange(start_date, end_date) {
    let request_url = this.API_URL_WITH_KEY
    if (end_date) {
      request_url += "&start_date=" + start_date + "&end_date=" + end_date
    } else {
      request_url += "&start_date=" + start_date
    }

    const resp = await fetch(request_url)
    if (resp.ok) {
      return await resp.json()
    }
    throw new Error("Error fetching API, status: " + resp.status)
  }
}

document.addEventListener("DOMContentLoaded", function startApp() {
  const search_results_el = document.getElementById("search-results")
  const search_form_el = document.getElementById("search-form")
  const search_type_option_els = document.querySelectorAll("[name=search-type]")
  const start_date_el = document.querySelector("[name=start-date]")
  const end_date_el = document.querySelector("[name=end-date]")
  const api_connection = new ApiConnection()

  displayCardPlaceholders(search_results_el, 15)

  api_connection
    .getRandomImages(10)
    .then((results) => displayResultsAsCards(search_results_el, results))
    .catch((err) => console.error(err))

  search_form_el.addEventListener(
    "submit",
    function submitSearchAndLoadResults(event) {
      event.preventDefault()

      const form_data = new FormData(event.target)
      const search_type = form_data.get("search-type")
      const random_count = +form_data.get("random-qty")
      if (search_type === "random" && random_count) {
        displayCardPlaceholders(
          search_results_el,
          random_count <= 15 ? random_count : 15
        )
        api_connection
          .getRandomImages(random_count)
          .then((results) => displayResultsAsCards(search_results_el, results))
          .catch((err) => console.error(err))
      }
    }
  )

  Array.from(search_type_option_els).forEach((opt_el) => {
    opt_el.addEventListener(
      "change",
      function changeEnabledSearchType(event) {
        document.querySelectorAll("[data-search-type-fieldset]").forEach(fs => {
          fs.disabled = event.target.value !== fs.dataset.searchTypeFieldset
        })
      }
    )
  })

  function dateToString(date) {
    const day = String(date.getDate())

    const month_zero_based = date.getMonth()
    const month = String(month_zero_based + 1).padStart(2,0)

    const year = String(date.getFullYear())

    return `${year}-${month}-${day}`
  }


  now_string = dateToString(new Date())
  start_date_el.max = now_string
  end_date_el.max = now_string

  start_date_el.addEventListener("change", function changeStartDateMinLimit(event) {
    if (end_date_el.valueAsDate < event.target.valueAsDate) {
      end_date_el.value = event.target.value
    }
    end_date_el.min = event.target.value
  })
  
  // end_date_el.addEventListener()
})
