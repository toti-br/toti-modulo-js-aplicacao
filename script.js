function createCard(title, description, image_url, image_description) {
  let card_el = document.createElement("article")
  card_el.classList.add("card", "mb-2", "me-4")

  let image_el = createImage(image_url, image_description)
  image_el.classList.add("card-img-top")

  let card_body_el = document.createElement("div")
  card_body_el.classList.add("card-body")

  let title_el = document.createElement("h3")
  title_el.textContent = title
  title_el.classList.add("card-title")

  let text_el = document.createElement("p")
  text_el.textContent = description
  text_el.classList.add("card-text")

  card_body_el.appendChild(title_el)
  card_body_el.appendChild(text_el)

  card_el.appendChild(image_el)
  card_el.appendChild(card_body_el)

  return card_el
}

function createImage(url, description) {
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

function createSampleCard() {
  return createCard('Carregando...', '...')
}
