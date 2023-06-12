import axios from 'axios';
import { getEvolutionChain, buildEvolutionChain, EvolutionChain, EvolutionVariation } from './pokemon';

// Mocking axios.get method
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getEvolutionChain', () => {
  it('should return the evolution chain for a given Pokemon', async () => {
    const pokemonName = 'pikachu';
    const speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species/25/';
    const evolutionChainUrl = 'https://pokeapi.co/api/v2/evolution-chain/10/';
    const evolutionChainData = {
      chain: {
        species: { name: 'pikachu' },
        evolves_to: [
          {
            species: { name: 'raichu' },
            evolves_to: [],
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce({ data: { species: { url: speciesUrl } } });
    mockedAxios.get.mockResolvedValueOnce({ data: { evolution_chain: { url: evolutionChainUrl } } });
    mockedAxios.get.mockResolvedValueOnce({ data: evolutionChainData });

    const expectedEvolutionChain: EvolutionChain = {
      name: 'pikachu',
      variations: [
        {
          name: 'raichu',
          variations: [],
        },
      ],
    };

    const result = await getEvolutionChain(pokemonName);

    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    expect(mockedAxios.get).toHaveBeenCalledWith(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    expect(mockedAxios.get).toHaveBeenCalledWith(speciesUrl);
    expect(mockedAxios.get).toHaveBeenCalledWith(evolutionChainUrl);
    expect(result).toEqual(expectedEvolutionChain);
  });

  it('should throw an error if an error occurs during the API calls', async () => {
    const pokemonName = 'pikachu';

    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    await expect(getEvolutionChain(pokemonName)).rejects.toThrow('API error');
  });
});

describe('buildEvolutionChain', () => {
  it('should build the evolution chain correctly from the given data', () => {
    const evolutionChainData = {
      species: { name: 'pikachu' },
      evolves_to: [
        {
          species: { name: 'raichu' },
          evolves_to: [],
        },
      ],
    };

    const expectedEvolutionChain: EvolutionVariation = {
      name: 'pikachu',
      variations: [
        {
          name: 'raichu',
          variations: [],
        },
      ],
    };

    const result = buildEvolutionChain(evolutionChainData);

    expect(result).toEqual(expectedEvolutionChain);
  });
});
