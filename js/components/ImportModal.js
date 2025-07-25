/**
 * Import modal for importing individual Pokemon
 */
export class ImportModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.onImportCallback = null;
        
        this.createModal();
        this.bindEvents();
    }
    
    /**
     * Create the modal element
     */
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'import-modal';
        this.modal.style.display = 'none';
        this.modal.innerHTML = `
            <div class="import-content">
                <div class="import-title">Import Pokemon</div>
                <textarea class="import-textarea" placeholder="Paste Pokemon data in Pokepaste format:

Archaludon @ Assault Vest
Ability: Stamina
Level: 50
Tera Type: Flying
EVs: 140 HP / 4 Def / 76 SpA / 252 SpD / 36 Spe
Modest Nature
IVs: 0 Atk
- Snarl
- Body Press
- Electro Shot
- Draco Meteor"></textarea>
                <div class="import-status"></div>
                <div class="import-actions">
                    <button class="import-btn secondary" id="cancelBtn">Cancel</button>
                    <button class="import-btn primary" id="importBtn">Import</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        if (!this.modal) return;
        
        // Cancel button
        const cancelBtn = this.modal.querySelector('#cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }
        
        // Import button
        const importBtn = this.modal.querySelector('#importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.handleImport());
        }
        
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    /**
     * Open the modal
     */
    open(onImportCallback = null) {
        this.onImportCallback = onImportCallback;
        
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.isOpen = true;
            
            // Focus on textarea
            setTimeout(() => {
                const textarea = this.modal.querySelector('.import-textarea');
                if (textarea) {
                    textarea.focus();
                }
            }, 100);
        }
    }
    
    /**
     * Close the modal
     */
    close() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.isOpen = false;
            this.clearInputs();
        }
    }
    
    /**
     * Handle import
     */
    async handleImport() {
        try {
            this.showStatus('Importing...', 'loading');
            
            const textarea = this.modal.querySelector('.import-textarea');
            const input = textarea.value.trim();
            
            if (!input) {
                throw new Error('Please enter Pokemon data');
            }
            
            const pokemonData = this.parsePokepaste(input);
            
            // Fetch additional data from API if needed
            try {
                const apiData = await this.fetchPokemonData(pokemonData.species);
                if (apiData) {
                    pokemonData.types = apiData.types;
                    pokemonData.sprite = apiData.sprite;
                }
            } catch (apiError) {
                console.warn('Could not fetch Pokemon API data:', apiError);
                // Use fallback data
                pokemonData.types = pokemonData.types || ['normal'];
                pokemonData.sprite = null;
            }
            
            // Calculate final stats
            pokemonData.finalStats = this.calculateFinalStats(pokemonData);
            
            this.showStatus('Successfully imported Pokemon!', 'success');
            
            // Call the callback if provided
            if (this.onImportCallback) {
                this.onImportCallback(pokemonData);
            }
            
            setTimeout(() => {
                this.close();
            }, 1500);
            
        } catch (error) {
            this.showStatus(`Import failed: ${error.message}`, 'error');
        }
    }
    
    /**
     * Parse Pokepaste format
     */
    parsePokepaste(text) {
        const lines = text.trim().split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
            throw new Error('No Pokemon data provided');
        }
        
        // Parse first line
        const firstLine = lines[0];
        const nicknameMatch = firstLine.match(/^([^(]+)?\s*\(([^)]+)\)/);
        const genderMatch = firstLine.match(/\)\s*\(([MF])\)/);
        const itemMatch = firstLine.match(/@\s*(.+)$/);
        
        const nickname = nicknameMatch ? nicknameMatch[1].trim() : '';
        const species = nicknameMatch ? nicknameMatch[2].trim() : firstLine.split('@')[0].trim();
        const gender = genderMatch ? genderMatch[1] : null;
        const item = itemMatch ? itemMatch[1].trim() : 'None';
        
        // Parse other attributes
        let ability = 'Unknown';
        let level = 50;
        let shiny = false;
        let teraType = 'Normal';
        let evs = { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 };
        let ivs = { HP: 31, Atk: 31, Def: 31, SpA: 31, SpD: 31, Spe: 31 };
        let nature = 'Hardy';
        let moves = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('Ability:')) {
                ability = line.replace('Ability:', '').trim();
            } else if (line.startsWith('Level:')) {
                level = parseInt(line.replace('Level:', '').trim()) || 50;
            } else if (line.startsWith('Shiny:')) {
                shiny = line.includes('Yes');
            } else if (line.startsWith('Tera Type:')) {
                teraType = line.replace('Tera Type:', '').trim();
            } else if (line.startsWith('EVs:')) {
                const evString = line.replace('EVs:', '').trim();
                const evParts = evString.split('/');
                evParts.forEach(part => {
                    const match = part.trim().match(/(\d+)\s+(\w+)/);
                    if (match) {
                        const value = parseInt(match[1]);
                        const stat = match[2];
                        evs[stat] = value;
                    }
                });
            } else if (line.startsWith('IVs:')) {
                const ivString = line.replace('IVs:', '').trim();
                const ivParts = ivString.split('/');
                ivParts.forEach(part => {
                    const match = part.trim().match(/(\d+)\s+(\w+)/);
                    if (match) {
                        const value = parseInt(match[1]);
                        const stat = match[2];
                        ivs[stat] = value;
                    }
                });
            } else if (line.includes('Nature')) {
                nature = line.replace('Nature', '').trim();
            } else if (line.startsWith('-')) {
                moves.push(line.substring(1).trim());
            }
        }
        
        return {
            nickname,
            species,
            name: species, // For compatibility
            gender,
            item,
            ability,
            level,
            shiny,
            teraType,
            evs,
            ivs,
            nature,
            moves,
            types: ['Loading'], // Will be updated from API
            sprite: null,
            hp: { current: 100, max: 100 } // Will be calculated
        };
    }
    
    /**
     * Fetch Pokemon data from API
     */
    async fetchPokemonData(pokemonName) {
        try {
            let apiName = pokemonName.toLowerCase().replace(/\s+/g, '-');
            
            // Handle special forms
            const formMappings = {
                'rotom-heat': 'rotom-heat',
                'rotom-wash': 'rotom-wash',
                'rotom-frost': 'rotom-frost',
                'rotom-fan': 'rotom-fan',
                'rotom-mow': 'rotom-mow',
                'archaludon': 'archaludon'
            };
            
            if (formMappings[apiName]) {
                apiName = formMappings[apiName];
            }
            
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${apiName}`);
            
            if (!response.ok) {
                throw new Error(`Pokemon not found: ${pokemonName}`);
            }
            
            const data = await response.json();
            
            return {
                types: data.types.map(t => t.type.name),
                sprite: data.sprites.front_default,
                baseStats: {
                    HP: data.stats[0].base_stat,
                    Atk: data.stats[1].base_stat,
                    Def: data.stats[2].base_stat,
                    SpA: data.stats[3].base_stat,
                    SpD: data.stats[4].base_stat,
                    Spe: data.stats[5].base_stat
                }
            };
        } catch (error) {
            console.warn('API fetch failed:', error);
            return null;
        }
    }
    
    /**
     * Calculate final stats
     */
    calculateFinalStats(pokemon) {
        const baseStats = {
            HP: 100, Atk: 100, Def: 100, SpA: 100, SpD: 100, Spe: 100
        };
        
        // Use API base stats if available
        if (pokemon.baseStats) {
            Object.assign(baseStats, pokemon.baseStats);
        }
        
        const finalStats = {};
        
        Object.keys(baseStats).forEach(stat => {
            const base = baseStats[stat];
            const ev = pokemon.evs[stat] || 0;
            const iv = pokemon.ivs[stat] || 31;
            const level = pokemon.level || 50;
            
            if (stat === 'HP') {
                finalStats[stat] = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
            } else {
                let final = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
                
                // Apply nature modifiers (simplified)
                const natureModifiers = {
                    'Modest': { SpA: 1.1, Atk: 0.9 },
                    'Adamant': { Atk: 1.1, SpA: 0.9 },
                    'Timid': { Spe: 1.1, Atk: 0.9 },
                    'Jolly': { Spe: 1.1, SpA: 0.9 },
                    'Bold': { Def: 1.1, Atk: 0.9 },
                    'Calm': { SpD: 1.1, Atk: 0.9 }
                };
                
                const modifier = natureModifiers[pokemon.nature]?.[stat] || 1;
                final = Math.floor(final * modifier);
                
                finalStats[stat] = final;
            }
        });
        
        // Update HP values
        pokemon.hp = {
            current: finalStats.HP,
            max: finalStats.HP
        };
        
        return finalStats;
    }
    
    /**
     * Show status message
     */
    showStatus(message, type = 'info') {
        const statusElement = this.modal.querySelector('.import-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `import-status ${type}`;
        }
    }
    
    /**
     * Clear all inputs
     */
    clearInputs() {
        const textarea = this.modal.querySelector('.import-textarea');
        if (textarea) {
            textarea.value = '';
        }
        
        this.showStatus('', 'info');
    }
}
