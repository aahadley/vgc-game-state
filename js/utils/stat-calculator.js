import { baseStatsData, defaultBaseStats } from '../data/pokemon-data.js';
import { natureModifiers } from '../data/nature-data.js';

/**
 * Calculate final stats with EVs, IVs, and nature
 * @param {Object} pokemon - Pokemon data
 * @returns {Object} Final stat values
 */
export function calculateFinalStats(pokemon) {
    const baseStats = getBaseStats(pokemon.species);
    const finalStats = {};
    
    // Define stat names
    const stats = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'];
    
    // Calculate each stat
    stats.forEach(stat => {
        const base = baseStats[stat] || 100;
        const iv = 31; // Placeholder IV - modify as needed
        const ev = pokemon.evs?.[stat] || 0;
        const level = pokemon.level || 50;
        
        if (stat === 'HP') {
            // HP has a different formula
            // Formula: ((2 * base + IV + EV/4) * level / 100) + level + 10
            finalStats[stat] = Math.floor(((2 * base + iv + ev/4) * level / 100) + level + 10);
        } else {
            // Other stats
            // Formula: ((2 * base + IV + EV/4) * level / 100) + 5
            let value = Math.floor(((2 * base + iv + ev/4) * level / 100) + 5);
            
            // Apply nature modifier
            const natureData = natureModifiers[pokemon.nature?.toLowerCase()];
            
            if (natureData) {
                if (stat === natureData.boost) {
                    value = Math.floor(value * 1.1);
                } else if (stat === natureData.lower) {
                    value = Math.floor(value * 0.9);
                }
            }
            
            // TODO: Add stat stage modifiers here
            // TODO: Add ability modifiers here
            // TODO: Add item modifiers here
            
            finalStats[stat] = value;
        }
    });
    
    return finalStats;
}

/**
 * Get base stats for a Pokemon species
 * @param {string} species - Pokemon species name
 * @returns {Object} Base stat values
 */
export function getBaseStats(species) {
    const speciesLower = species.toLowerCase();
    return baseStatsData[speciesLower] || defaultBaseStats;
}
