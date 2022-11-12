onload = () => {
  const info = document.querySelector("div.info-mobile");

  info.style.display = "flex";

  setTimeout(() => {
    info.style.display = "none";
  }, 5000);
};

let offset = 0;
let limit = 0;

const spinner = document.querySelector("#spinner");
const Backspinner = document.querySelector("#back-spinner");
const cardPokemonDetail = document.querySelector("div#card-pokemon");

function limitPokemonsInWindow() {
  const WIDTH_WINDOWS = window.innerWidth;
  if (WIDTH_WINDOWS < 530) limit = 4;
  else if (WIDTH_WINDOWS < 770 && WIDTH_WINDOWS > 530) limit = 12;
  else if (WIDTH_WINDOWS < 976 && WIDTH_WINDOWS > 770) limit = 15;
  else if (WIDTH_WINDOWS < 1320 && WIDTH_WINDOWS > 976) limit = 24;
  else limit = 40;
}

limitPokemonsInWindow();

function convetPokemon(pokemon) {
  const ability = pokemon.abilty;

  ability.map((el) => `<li>${el}</li>`);

  return `
      <li class="list-pokemon ${pokemon.type}">
        <span class="number">#00${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="details">
          <ul class="types">
            ${pokemon.types
              .map((type) => `<li class="type ${pokemon.type}">${type}</li>`)
              .join(" ")}
          </ul>

          <img
            class="figure"
            src="${pokemon.image}"
            alt="${pokemon.name}"
          />

          <div class="abilities">
              <ul>
                ${ability.map((el) => `<li>${el}</li>`).join(" ")}
              </ul>
          </div>
        </div>
      </li>`;
}

function loadMorePokemons(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((p = []) => {
    const cardPokemon = document.querySelector(".pokemons");

    cardPokemon.innerHTML = p
      .map((pokemon) => convetPokemon(pokemon))
      .join(" ");
  });
}

loadMorePokemons(offset, limit);

document.querySelector("button#load-more").addEventListener("click", () => {
  spinnerLoad();

  setTimeout(() => {
    offset += limit;
    loadMorePokemons(offset, limit);
  }, 800);

  cardPokemonDetail.classList.remove("card-pokemon");
  cardPokemonDetail.innerHTML = "";
});

document.querySelector("button#load-less").addEventListener("click", () => {
  spinnerLoad();

  setTimeout(() => {
    offset -= limit;
    if (offset < 0) {
      offset = 0;
    }
    loadMorePokemons(offset, limit);
  }, 800);

  cardPokemonDetail.classList.remove("card-pokemon");
  cardPokemonDetail.innerHTML = "";
});

document.querySelector("section").addEventListener("click", (e) => {
  let element = e.target.className;
  if (element == "figure") {
    let parent = e.target.parentElement.parentElement.className.substring(13);
    let pokeName = e.target.parentElement.parentElement.children[1].innerHTML;
    let ability = e.target.nextElementSibling.children[0].children;

    let abilities = [];

    for (let i = 0; i < ability.length; i++) {
      abilities.push(ability[i].innerHTML);
    }

    pokemonCardDetails(parent, pokeName, abilities, e.target);
  }
});

function spinnerLoad() {
  spinner.classList.add("spinner");
  Backspinner.classList.add("back-spinner");

  setTimeout(() => {
    spinner.classList.remove("spinner");
    Backspinner.classList.remove("back-spinner");
  }, 1100);
}

function pokemonCardDetails(parent, pokeName, abilities, element) {
  htmlCard = `
      <span id="close" class="${parent}">close</span>
      <div class="figure-pokemon ${parent}">
      <h2 id="name">${pokeName}</h2>
          <div>
            <img
              src="${element.src}"
              alt="Imagem do pokemon"
              width="90px" height="150px"
            />
          </div>
      </div>

    <div class="info-pokemon">
      <div class="ability">
        <h3>Abilities</h3>
        <ul>
          ${abilities
            .map(
              (ab) =>
                `<li><span><i>${ab}</i></span> <span class="${parent}"></span></li>`
            )
            .join(" ")}
        </ul>
      </div>
    </div>
    `;

  cardPokemonDetail.classList.add("card-pokemon");
  cardPokemonDetail.innerHTML = htmlCard;
}

document.querySelector("div#card-pokemon").addEventListener("click", (e) => {
  if (e.target.id == "close") {
    cardPokemonDetail.classList.remove("card-pokemon");
    cardPokemonDetail.innerHTML = "";
  }
});
