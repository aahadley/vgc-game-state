// Pokemon API client for fetching Pokemon data
const pokemonIds = {
    'bulbasaur': 1, 'ivysaur': 2, 'venusaur': 3, 'charmander': 4, 'charmeleon': 5, 'charizard': 6,
    'squirtle': 7, 'wartortle': 8, 'blastoise': 9, 'pikachu': 25, 'raichu': 26,
    'gengar': 94, 'gyarados': 130, 'lapras': 131, 'eevee': 133, 'snorlax': 143,
    'dragonite': 149, 'mewtwo': 150, 'mew': 151, 'typhlosion': 157, 'feraligatr': 160,
    'crobat': 169, 'ampharos': 181, 'espeon': 196, 'umbreon': 197, 'tyranitar': 248,
    'blaziken': 257, 'swampert': 260, 'gardevoir': 282, 'sableye': 302, 'aggron': 306,
    'flygon': 330, 'altaria': 334, 'salamence': 373, 'metagross': 376, 'latias': 380,
    'latios': 381, 'kyogre': 382, 'groudon': 383, 'rayquaza': 384, 'garchomp': 445,
    'lucario': 448, 'rotom': 479, 'rotom-heat': 479, 'rotom-wash': 479, 'rotom-frost': 479,
    'rotom-fan': 479, 'rotom-mow': 479, 'dialga': 483, 'palkia': 484, 'giratina': 487,
    'darkrai': 491, 'arceus': 493, 'serperior': 497, 'emboar': 500, 'samurott': 503,
    'excadrill': 530, 'conkeldurr': 534, 'seismitoad': 537, 'krookodile': 553, 'darmanitan': 555,
    'zoroark': 571, 'ferrothorn': 598, 'chandelure': 609, 'haxorus': 612, 'bisharp': 625,
    'hydreigon': 635, 'volcarona': 637, 'tornadus': 641, 'thundurus': 642, 'landorus': 645,
    'landorus-therian': 645, 'kyurem': 646, 'greninja': 658, 'talonflame': 663, 
    'aegislash': 681, 'goodra': 706, 'trevenant': 709, 'zygarde': 718, 'diancie': 719,
    'incineroar': 727, 'primarina': 730, 'decidueye': 724, 'lycanroc': 745, 'lycanroc-dusk': 745,
    'vikavolt': 738, 'toxapex': 748, 'araquanid': 752, 'tsareena': 763, 'mimikyu': 778,
    'tapu-koko': 785, 'tapu-lele': 786, 'tapu-bulu': 787, 'tapu-fini': 788,
    'solgaleo': 791, 'lunala': 792, 'kartana': 798, 'celesteela': 797, 'magearna': 801,
    'rillaboom': 812, 'cinderace': 815, 'inteleon': 818, 'corviknight': 823,
    'drednaw': 834, 'coalossal': 839, 'toxtricity': 849, 'grimmsnarl': 861,
    'hatterene': 858, 'dragapult': 887, 'zacian': 888, 'zacian-crowned': 888,
    'zamazenta': 889, 'zamazenta-crowned': 889, 'eternatus': 890,
    'urshifu': 892, 'urshifu-rapid-strike': 892, 'regieleki': 894, 'regidrago': 895,
    'glastrier': 896, 'spectrier': 897, 'calyrex': 898, 'calyrex-ice': 898, 'calyrex-shadow': 898,
    'amoonguss': 591, 'whimsicott': 547, 'togekiss': 468, 'porygon2': 233, 'dusclops': 356,
    'arcanine': 59, 'gastrodon': 423, 'clefairy': 35, 'gothitelle': 576, 'indeedee': 876,
    'pincurchin': 871, 'dracovish': 882, 'dracozolt': 880, 'comfey': 764, 'torkoal': 324
};

// Form mappings for special Pokemon forms
const formMappings = {
    'rotom-heat': 'rotom-heat',
    'rotom-wash': 'rotom-wash',
    'rotom-frost': 'rotom-frost',
    'rotom-fan': 'rotom-fan',
    'rotom-mow': 'rotom-mow',
    'urshifu-rapid-strike': 'urshifu-rapid-strike',
    'urshifu-single-strike': 'urshifu',
    'calyrex-ice': 'calyrex-ice',
    'calyrex-shadow': 'calyrex-shadow',
    'landorus-therian': 'landorus-therian',
    'thundurus-therian': 'thundurus-therian',
    'tornadus-therian': 'tornadus-therian',
    'lycanroc-dusk': 'lycanroc-dusk',
    'zacian-crowned': 'zacian-crowned',
    'zamazenta-crowned': 'zamazenta-crowned'
};

/**
 * Fetch Pokemon data from PokeAPI
 * @param {string} pokemonName - Pokemon name
 * @returns {Object} Pokemon data with types and sprite
 */
export async function fetchPokemonData(pokemonName) {
    try {
        // Handle special forms and formatting
        let apiName = pokemonName.toLowerCase();
        
        // Check if there's a specific form mapping
        if (formMappings[apiName]) {
            apiName = formMappings[apiName];
        } else {
            // General formatting: replace spaces and special characters
            apiName = apiName.replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');
        }
        
        console.log('Fetching Pokemon:', apiName);
        
        const pokemonId = pokemonIds[apiName];
        
        // Try to get sprite directly from GitHub
        let sprite = null;
        if (pokemonId) {
            sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
        }
        
        // Try to get type data from the API
        let types = getFallbackData(pokemonName).types;
        
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${apiName}`);
            
            if (response.ok) {
                const data = await response.json();
                types = data.types.map(t => t.type.name);
                
                // If we don't have a sprite yet, get it from the API response
                if (!sprite && data.sprites?.other?.['official-artwork']?.front_default) {
                    sprite = data.sprites.other['official-artwork'].front_default;
                }
            }
        } catch (apiError) {
            console.log('API failed, using fallback types');
        }
        
        return {
            types: types,
            sprite: sprite || getFallbackData(pokemonName).sprite
        };
    } catch (error) {
        console.error('Error in fetchPokemonData:', error);
        return getFallbackData(pokemonName);
    }
}

/**
 * Get fallback data when API fails
 * @param {string} pokemonName - Pokemon name
 * @returns {Object} Fallback types and sprite
 */
export function getFallbackData(pokemonName) {
    // Provide fallback data for common Pokemon
    const fallbackTypes = {
        'pikachu': ['electric'],
        'charizard': ['fire', 'flying'],
        'blastoise': ['water'],
        'venusaur': ['grass', 'poison'],
        'gengar': ['ghost', 'poison'],
        'garchomp': ['dragon', 'ground'],
        'lucario': ['fighting', 'steel'],
        'rotom-heat': ['electric', 'fire'],
        'rotom-wash': ['electric', 'water'],
        'rotom-frost': ['electric', 'ice'],
        'rotom-mow': ['electric', 'grass'],
        'rotom-fan': ['electric', 'flying'],
        'amoonguss': ['grass', 'poison'],
        'incineroar': ['fire', 'dark'],
        'rillaboom': ['grass'],
        'dragapult': ['dragon', 'ghost'],
        'urshifu': ['fighting', 'dark'],
        'urshifu-rapid-strike': ['fighting', 'water'],
        'regieleki': ['electric'],
        'spectrier': ['ghost'],
        'glastrier': ['ice'],
        'calyrex': ['psychic', 'grass'],
        'calyrex-ice': ['psychic', 'ice'],
        'calyrex-shadow': ['psychic', 'ghost'],
        'zacian': ['fairy'],
        'zacian-crowned': ['fairy', 'steel'],
        'zamazenta': ['fighting'],
        'zamazenta-crowned': ['fighting', 'steel'],
        'eternatus': ['poison', 'dragon'],
        'corviknight': ['flying', 'steel'],
        'toxapex': ['poison', 'water'],
        'ferrothorn': ['grass', 'steel'],
        'landorus': ['ground', 'flying'],
        'landorus-therian': ['ground', 'flying'],
        'tapu-koko': ['electric', 'fairy'],
        'tapu-lele': ['psychic', 'fairy'],
        'tapu-bulu': ['grass', 'fairy'],
        'tapu-fini': ['water', 'fairy'],
        'whimsicott': ['grass', 'fairy'],
        'togekiss': ['fairy', 'flying'],
        'porygon2': ['normal'],
        'gastrodon': ['water', 'ground'],
        'dusclops': ['ghost'],
        'grimmsnarl': ['dark', 'fairy'],
        'hatterene': ['psychic', 'fairy'],
        'indeedee': ['psychic', 'normal'],
        'dracovish': ['water', 'dragon'],
        'torkoal': ['fire']
    };
    
    const nameLower = pokemonName.toLowerCase();
    const types = fallbackTypes[nameLower] || ['normal'];
    
    // Use a Pokemon silhouette as fallback sprite
    const fallbackSprite = `data:image/svg+xml;base64,${btoa(`
        <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
            <circle cx="48" cy="48" r="40" fill="#333" opacity="0.3"/>
            <text x="48" y="54" text-anchor="middle" font-size="40" fill="#666">?</text>
        </svg>
    `)}`;
    
    return {
        types: types,
        sprite: fallbackSprite
    };
}
