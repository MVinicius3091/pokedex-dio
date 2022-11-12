const pokeApi = {};

function convertPokemonDetails(pokemonDetail) {
  const pokemon = new Pokemon();

  pokemon.number = pokemonDetail.order;
  pokemon.name = pokemonDetail.name;

  const types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.image = pokemonDetail.sprites.other.dream_world.front_default;

  const abilities = pokemonDetail.abilities.map(
    (ability) => ability.ability.name
  );

  pokemon.abilty = abilities;
  return pokemon;
}

pokeApi.getPokemonDetail = (pokemonTypes) => {
  return fetch(pokemonTypes.url)
    .then((response) => response.json())
    .then(convertPokemonDetails);
};

pokeApi.getPokemons = async (offset = 0, limit = 10) => {
  const URL = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return await fetch(URL)
    .then(async (resp) => {
      const resposta = resp.json();
      return await resposta.then((jsonBody) => jsonBody.results);
    })
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailsRequests) => Promise.all(detailsRequests))
    .then((pokemonDetails) => pokemonDetails)
    .catch((err) => {
      console.error(err);
    });
};
