import { ImportModal } from './ImportModal.js';
import { typeData } from '../data/type-data.js';
import { calculateFinalStats } from '../utils/stat-calculator.js';

/**
 * Pokemon card component for displaying and managing Pokemon
 */
export class PokemonCard {
    constructor(pokemonData, x, y) {
        this.pokemonData = pokemonData;
        this.x = x;
        this.y = y;
        this.width = 320;
        this.height = 0; // Auto height
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.element = null;
        this.isExpanded = false;
        this.importModal = null;
        
        this.createElement();
        this.updateContent();
    }
    
    /**
     * Create the DOM element for the Pokemon card
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'pokemon-card';
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        
        this.bindEvents();
        
        // Add to canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.appendChild(this.element);
        }
    }
    
    /**
     * Update card content based on Pokemon data
     */
    updateContent() {
        if (!this.pokemonData) {
            this.element.innerHTML = this.getEmptyCardHTML();
        } else {
            this.element.innerHTML = this.getPokemonCardHTML(this.pokemonData);
        }
        
        // Re-bind events after content update
        this.bindCardEvents();
    }
    
    /**
     * Get HTML for empty card
     */
    getEmptyCardHTML() {
        return `
            <div class="stats-toggle" style="display: none;">
                <span>▶</span>
            </div>
            
            <div class="pokemon-card-content">
                <div class="main-card-content">
                    <div class="card-header">
                        <div class="card-title-section">
                            <div class="pokemon-name">Empty Slot</div>
                            <div class="pokemon-nickname">Click import to add Pokemon</div>
                        </div>
                        <div class="card-actions">
                            <button class="card-btn import-btn" title="Import Pokemon">📥</button>
                            <button class="card-btn close-btn" title="Remove Card">✕</button>
                        </div>
                    </div>
                    <div class="sprite-container">
                        <div class="sprite-placeholder">🎴</div>
                    </div>
                    <div style="text-align: center; color: rgba(255,255,255,0.5); padding: 20px;">
                        Import a Pokemon using Pokepaste format
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Get HTML for populated Pokemon card
     */
    getPokemonCardHTML(pokemon) {
        // Calculate stats
        const baseStats = this.getBaseStats(pokemon.species || pokemon.name);
        const finalStats = calculateFinalStats(pokemon);
        
        // Create stats panel HTML
        const statsHTML = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'].map(stat => {
            const base = baseStats[stat] || 0;
            const final = finalStats[stat] || 0;
            const maxStat = stat === 'HP' ? 714 : 658; // Max possible stats
            const basePercentage = (base / 255) * 100; // Base stats max at 255
            const finalPercentage = (final / maxStat) * 100;
            
            return `
                <div class="stat-item">
                    <div class="stat-label">${stat}</div>
                    <div class="stat-value base">${base}</div>
                    <div class="stat-value final">${final}</div>
                    <div class="stat-bar">
                        <div class="stat-bar-fill base-bar" style="width: ${basePercentage}%"></div>
                        <div class="stat-bar-fill final-bar" style="width: ${finalPercentage}%; display: none;"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Create type badges
        const typeHTML = pokemon.types.map(type => {
            const typeLower = type.toLowerCase();
            const typeColor = typeData[typeLower]?.color || '#A8A878';
            const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
            
            return `<div class="type-badge" style="background: ${typeColor};">
                <span>${typeCapitalized}</span>
            </div>`;
        }).join('');
        
        // Tera type
        const teraType = pokemon.teraType || pokemon.types[0];
        const teraTypeLower = teraType.toLowerCase();
        const teraTypeColor = typeData[teraTypeLower]?.color || '#A8A878';
        
        // Moves
        const movesHTML = (pokemon.moves || []).map(move => 
            `<div class="move-item">${move}</div>`
        ).join('');
        
        // HP calculation
        const hp = pokemon.hp || { current: finalStats.HP || 100, max: finalStats.HP || 100 };
        const hpPercent = (hp.current / hp.max) * 100;
        
        return `
            <div class="stats-toggle">
                <span>▶</span>
            </div>
            
            <div class="pokemon-card-content">
                <div class="stats-panel">
                    <div class="stats-content" title="Hover to see final stats with EVs, IVs, and nature">
                        ${statsHTML}
                    </div>
                </div>
                
                <div class="main-card-content">
                    <div class="card-header">
                        <div class="card-title-section">
                            <div class="pokemon-name">${pokemon.species || pokemon.name}</div>
                            ${pokemon.nickname ? `<div class="pokemon-nickname">"${pokemon.nickname}"</div>` : ''}
                        </div>
                        <div class="card-actions">
                            <button class="card-btn import-btn" title="Import Pokemon">📥</button>
                            <button class="card-btn close-btn" title="Remove Card">✕</button>
                        </div>
                    </div>
                    
                    <div class="card-info">
                        <div class="info-left">
                            <div class="info-item">
                                <span class="info-label">Item:</span>
                                <span>${pokemon.item || 'None'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Ability:</span>
                                <span>${pokemon.ability || 'Unknown'}</span>
                            </div>
                        </div>
                        <div class="info-right">
                            <div class="type-badges">${typeHTML}</div>
                            <div class="tera-type">
                                <span class="info-label">Tera:</span>
                                <div class="type-badge" style="background: ${teraTypeColor}; display: inline-flex;">
                                    <span>${teraType}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sprite-container">
                        ${pokemon.sprite 
                            ? `<img src="${pokemon.sprite}" alt="${pokemon.species || pokemon.name}" style="width: 100%; height: 100%; object-fit: contain;">` 
                            : '<div class="sprite-placeholder">🎮</div>'
                        }
                    </div>
                    
                    ${movesHTML ? `
                        <div class="moves-section">
                            <div class="moves-grid">${movesHTML}</div>
                        </div>
                    ` : ''}
                    
                    <div class="hp-section">
                        <div class="hp-info">
                            <span>HP</span>
                            <span>${hp.current}/${hp.max} (${Math.round(hpPercent)}%)</span>
                        </div>
                        <div class="hp-bar">
                            <div class="hp-fill" style="width: ${hpPercent}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Get base stats for a Pokemon
     */
    getBaseStats(pokemonName) {
        // Placeholder base stats - in real implementation, this would fetch from a Pokemon database
        return {
            HP: 100,
            Atk: 100,
            Def: 100,
            SpA: 100,
            SpD: 100,
            Spe: 100
        };
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        if (!this.element) return;
        
        // Mouse events for dragging
        this.element.addEventListener('mousedown', (e) => this.startDrag(e));
    }
    
    /**
     * Bind card-specific event listeners (called after content updates)
     */
    bindCardEvents() {
        if (!this.element) return;
        
        // Stats toggle button
        const statsToggle = this.element.querySelector('.stats-toggle');
        if (statsToggle) {
            statsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleStats();
            });
        }
        
        // Import button
        const importBtn = this.element.querySelector('.import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openImportModal();
            });
        }
        
        // Close button
        const closeBtn = this.element.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.remove();
            });
        }
    }
    
    /**
     * Toggle stats panel expansion
     */
    toggleStats() {
        this.isExpanded = !this.isExpanded;
        this.element.classList.toggle('expanded', this.isExpanded);
        
        const statsToggle = this.element.querySelector('.stats-toggle span');
        if (statsToggle) {
            statsToggle.textContent = this.isExpanded ? '◀' : '▶';
        }
        
        // Show/hide stats toggle when there's Pokemon data
        if (this.pokemonData) {
            const statsToggleElement = this.element.querySelector('.stats-toggle');
            if (statsToggleElement) {
                statsToggleElement.style.display = 'flex';
            }
        }
    }
    
    /**
     * Open import modal
     */
    openImportModal() {
        if (!this.importModal) {
            this.importModal = new ImportModal();
        }
        
        // Pass callback to update this specific card
        this.importModal.open((pokemonData) => {
            if (pokemonData) {
                // Update this card with the imported Pokemon
                this.pokemonData = pokemonData;
                this.updateContent();
                
                // Update status bar if whiteboard is available
                if (window.whiteboard) {
                    window.whiteboard.statusBar.showSuccess(`Imported ${pokemonData.species || pokemonData.name}!`);
                }
            }
        });
    }
    
    /**
     * Start dragging the card
     */
    startDrag(e) {
        // Don't drag if clicking buttons or stats areas
        if (e.target.classList.contains('card-btn') || 
            e.target.closest('.stats-toggle') ||
            e.target.closest('.stats-content') ||
            e.target.closest('.import-textarea')) {
            return;
        }
        
        e.preventDefault();
        this.isDragging = true;
        
        const rect = this.element.getBoundingClientRect();
        this.dragOffsetX = e.clientX - rect.left;
        this.dragOffsetY = e.clientY - rect.top;
        
        this.element.style.zIndex = '1000';
        this.element.classList.add('dragging');
        
        // Add global event listeners
        document.addEventListener('mousemove', this.handleDrag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
    }
    
    /**
     * Handle dragging
     */
    handleDrag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        
        const canvasContainer = document.querySelector('.canvas-container');
        if (!canvasContainer) return;
        
        const rect = canvasContainer.getBoundingClientRect();
        
        this.x = e.clientX - rect.left - this.dragOffsetX;
        this.y = e.clientY - rect.top - this.dragOffsetY;
        
        // Constrain to canvas bounds
        this.x = Math.max(0, Math.min(this.x, rect.width - this.width));
        this.y = Math.max(0, this.y);
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }
    
    /**
     * Stop dragging
     */
    stopDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.element.style.zIndex = '';
        this.element.classList.remove('dragging');
        
        // Remove global event listeners
        document.removeEventListener('mousemove', this.handleDrag.bind(this));
        document.removeEventListener('mouseup', this.stopDrag.bind(this));
    }
    
    /**
     * Remove the card
     */
    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // Notify whiteboard of removal
        if (window.whiteboard) {
            window.whiteboard.removePokemonCard(this);
        }
    }
    
    /**
     * Get card position
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    /**
     * Set card position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        
        if (this.element) {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
        }
    }
}
