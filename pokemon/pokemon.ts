import axios from 'axios';

export interface EvolutionVariation {
    name: string;
    variations: EvolutionVariation[];
}

export interface EvolutionChain {
    name: string;
    variations: EvolutionVariation[];
}

export async function getEvolutionChain(pokemonName: string): Promise<EvolutionChain> {
    try {
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const speciesUrl = pokemonResponse.data.species.url;

        const speciesResponse = await axios.get(speciesUrl);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

        const evolutionChainResponse = await axios.get(evolutionChainUrl);
        const evolutionChainData = evolutionChainResponse.data.chain;

        return buildEvolutionChain(evolutionChainData);
    } catch (error: any) {
        console.error('Error:', error);
        throw error;
    }
}

export function buildEvolutionChain(data: any): EvolutionVariation {
    const name = data.species.name;
    const variations: EvolutionVariation[] = [];

    if (data.evolves_to && data.evolves_to.length > 0) {
        data.evolves_to.forEach((evolution: any) => {
            const variation = buildEvolutionChain(evolution);
            variations.push(variation);
        });
    }

    return { name, variations };
}

// Example usage
// const pokemonName = 'rattata';
// getEvolutionChain(pokemonName)
//     .then((evolutionChain) => {
//         const jsonString = JSON.stringify(evolutionChain);
//         console.log(jsonString);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
