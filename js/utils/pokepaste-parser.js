/**
 * Parse Pokepaste format text into Pokemon data object
 * @param {string} text - Pokepaste formatted text
 * @returns {Object} Pokemon data object
 */
export function parsePokepaste(text) {
    const lines = text.trim().split('\n').filter(line => line.trim());
    
    // Parse first line: nickname (species) (gender) @ item
    const firstLine = lines[0];
    const nicknameMatch = firstLine.match(/^([^(]+)?\s*\(([^)]+)\)/);
    const genderMatch = firstLine.match(/\)\s*\(([MF])\)/);
    const itemMatch = firstLine.match(/@\s*(.+)$/);
    
    const nickname = nicknameMatch ? nicknameMatch[1].trim() : '';
    const species = nicknameMatch ? nicknameMatch[2].trim() : firstLine.split('@')[0].trim();
    const gender = genderMatch ? genderMatch[1] : null;
    const item = itemMatch ? itemMatch[1].trim() : 'None';
    
    // Initialize other attributes
    let ability = 'Unknown';
    let level = 50;
    let shiny = false;
    let teraType = 'Normal';
    let evs = {};
    let nature = 'Hardy';
    let moves = [];
    
    // Parse remaining lines
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('Ability:')) {
            ability = line.replace('Ability:', '').trim();
        } else if (line.startsWith('Level:')) {
            level = parseInt(line.replace('Level:', '').trim());
        } else if (line.startsWith('Shiny:')) {
            shiny = line.includes('Yes');
        } else if (line.startsWith('Tera Type:')) {
            teraType = line.replace('Tera Type:', '').trim();
        } else if (line.startsWith('EVs:')) {
            const evString = line.replace('EVs:', '').trim();
            const evParts = evString.split('/');
            evParts.forEach(part => {
                const match = part.trim().match(/(\d+)\s*(\w+)/);
                if (match) {
                    evs[match[2]] = parseInt(match[1]);
                }
            });
        } else if (line.includes('Nature')) {
            nature = line.replace('Nature', '').trim();
        } else if (line.startsWith('-')) {
            moves.push(line.substring(1).trim());
        }
    }
    
    // Return parsed Pokemon data
    return {
        nickname,
        species,
        gender,
        item,
        ability,
        level,
        shiny,
        teraType,
        evs,
        nature,
        moves,
        types: ['Loading'], // Will be fetched from API
        sprite: null, // Will be fetched from API
        hp: { current: 100, max: 100 } // Default HP values
    };
}
