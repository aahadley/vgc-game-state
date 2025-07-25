import { CanvasManager } from './CanvasManager.js';
import { HistoryManager } from './HistoryManager.js';
import { EventManager } from './EventManager.js';
import { PokemonCard } from '../components/PokemonCard.js';
import { Toolbar } from '../components/Toolbar.js';
import { StatusBar } from '../components/StatusBar.js';
import { typeData } from '../data/type-data.js';

/**
 * Main Pokemon Whiteboard application class
 * Orchestrates all components and manages application state
 */
export class PokemonWhiteboard {
    constructor() {
        // Core managers
        this.canvasManager = new CanvasManager();
        this.historyManager = new HistoryManager();
        this.eventManager = new EventManager(this);
        
        // UI components
        this.toolbar = new Toolbar(this);
        this.statusBar = new StatusBar();
        
        // Application state
        this.currentTool = 'draw';
        this.brushSize = 5;
        this.brushColor = '#ffffff';
        
        // Pokemon card system
        this.pokemonCards = [];
        this.cardCounter = 0;
        this.draggedCard = null;
        this.dragOffset = { x: 0, y: 0 };
        
        // Configuration
        this.useUnicodeIcons = true;
        this.typeData = typeData;
        
        this.initialize();
    }
    
    /**
     * Initialize the application
     */
    initialize() {
        this.canvasManager.initialize();
        this.toolbar.init();
        this.eventManager.bindEvents();
        this.historyManager.saveState(this.canvasManager.getImageData());
        
        this.statusBar.showMessage('Ready to draw');
    }
    
    /**
     * Set the current drawing tool
     * @param {string} tool - Tool name ('draw', 'erase', 'pokemon')
     */
    setTool(tool) {
        this.currentTool = tool;
        this.toolbar.setActiveTool(tool);
        this.canvasManager.setTool(tool);
        
        this.statusBar.updateToolStatus(tool);
    }
    
    /**
     * Set brush color
     * @param {string} color - Hex color value
     */
    setBrushColor(color) {
        this.brushColor = color;
        this.canvasManager.setBrushColor(color);
        this.statusBar.showMessage(`Color changed to ${color}`);
    }
    
    /**
     * Set brush size
     * @param {number} size - Brush size in pixels
     */
    setBrushSize(size) {
        this.brushSize = size;
        this.canvasManager.setBrushSize(size);
        this.toolbar.updateSizeDisplay(size);
        this.statusBar.showMessage(`Brush size: ${size}px`);
    }
    
    /**
     * Clear the canvas
     */
    clearCanvas() {
        this.canvasManager.clearCanvas();
        this.historyManager.saveState(this.canvasManager.getImageData());
        this.statusBar.showMessage('Canvas cleared');
    }
    
    /**
     * Undo the last action
     */
    undo() {
        const imageData = this.historyManager.undo();
        if (imageData) {
            this.canvasManager.restoreImageData(imageData);
            this.statusBar.showMessage('Undid last action');
        }
    }
    
    /**
     * Redo the last undone action
     */
    redo() {
        const imageData = this.historyManager.redo();
        if (imageData) {
            this.canvasManager.restoreImageData(imageData);
            this.statusBar.showMessage('Redid action');
        }
    }
    
    /**
     * Handle canvas mouse down events
     * @param {MouseEvent} e - Mouse event
     */
    handleCanvasMouseDown(e) {
        if (this.currentTool === 'pokemon') {
            this.createPokemonCard(e);
        } else {
            this.canvasManager.startDrawing(e);
        }
    }
    
    /**
     * Handle canvas mouse move events
     * @param {MouseEvent} e - Mouse event
     */
    handleCanvasMouseMove(e) {
        if (this.currentTool !== 'pokemon') {
            this.canvasManager.draw(e);
        }
    }
    
    /**
     * Handle canvas mouse up events
     */
    handleCanvasMouseUp() {
        if (this.currentTool !== 'pokemon') {
            this.canvasManager.stopDrawing();
            this.historyManager.saveState(this.canvasManager.getImageData());
        }
    }
    
    /**
     * Create a new Pokemon card
     * @param {MouseEvent} e - Mouse event for positioning
     */
    createPokemonCard(e) {
        this.cardCounter++;
        
        // Get canvas container position for proper positioning
        const canvasContainer = document.querySelector('.canvas-container');
        const containerRect = canvasContainer.getBoundingClientRect();
        
        // Calculate position relative to canvas container
        const x = e.clientX - containerRect.left - 160; // Center card on click
        const y = e.clientY - containerRect.top - 100;  // Center card on click
        
        // Create enhanced sample Pokemon data
        const samplePokemons = [
            {
                name: 'Charizard',
                species: 'Charizard',
                nickname: 'Blaze',
                level: 50,
                types: ['fire', 'flying'],
                teraType: 'Dragon',
                ability: 'Solar Power',
                item: 'Choice Specs',
                stats: {
                    HP: 78,
                    Atk: 84,
                    Def: 78,
                    SpA: 109,
                    SpD: 85,
                    Spe: 100
                },
                moves: ['Heat Wave', 'Air Slash', 'Solar Beam', 'Focus Blast'],
                sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
                hp: { current: 297, max: 297 }
            },
            {
                name: 'Garchomp',
                species: 'Garchomp',
                level: 50,
                types: ['dragon', 'ground'],
                teraType: 'Steel',
                ability: 'Rough Skin',
                item: 'Rocky Helmet',
                stats: {
                    HP: 108,
                    Atk: 130,
                    Def: 95,
                    SpA: 80,
                    SpD: 85,
                    Spe: 102
                },
                moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Protect'],
                sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png',
                hp: { current: 358, max: 358 }
            },
            {
                name: 'Rotom-Wash',
                species: 'Rotom-Wash',
                level: 50,
                types: ['electric', 'water'],
                teraType: 'Fairy',
                ability: 'Levitate',
                item: 'Sitrus Berry',
                stats: {
                    HP: 50,
                    Atk: 65,
                    Def: 107,
                    SpA: 105,
                    SpD: 107,
                    Spe: 86
                },
                moves: ['Hydro Pump', 'Thunderbolt', 'Will-O-Wisp', 'Protect'],
                sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/479.png',
                hp: { current: 227, max: 227 }
            }
        ];
        
        // Select a sample Pokemon cyclically
        const selectedPokemon = samplePokemons[(this.cardCounter - 1) % samplePokemons.length];
        
        // Create new Pokemon card instance (start with empty, user can import)
        const pokemonCard = new PokemonCard(null, x, y);
        this.pokemonCards.push(pokemonCard);
        
        this.statusBar.showMessage(`Pokemon card ${this.cardCounter} created - click import to add Pokemon`);
        this.statusBar.updatePokemonCount(this.pokemonCards.length);
    }
    
    /**
     * Update a Pokemon card with new data
     * @param {PokemonCard} pokemonCard - Pokemon card instance
     * @param {Object} pokemon - Pokemon data
     */
    updatePokemonCard(pokemonCard, pokemon) {
        pokemonCard.pokemonData = pokemon;
        pokemonCard.updateContent();
    }
    
    /**
     * Remove a Pokemon card
     * @param {PokemonCard} pokemonCard - Pokemon card instance
     */
    removePokemonCard(pokemonCard) {
        const cardIndex = this.pokemonCards.findIndex(card => card === pokemonCard);
        if (cardIndex !== -1) {
            this.pokemonCards.splice(cardIndex, 1);
            this.statusBar.showMessage('Pokemon card removed');
            this.statusBar.updatePokemonCount(this.pokemonCards.length);
        }
    }
    
    /**
     * Import a team of Pokemon
     * @param {Array} pokemonTeam - Array of Pokemon data
     */
    importPokemonTeam(pokemonTeam) {
        if (!Array.isArray(pokemonTeam) || pokemonTeam.length === 0) {
            this.statusBar.showError('No Pokemon data to import');
            return;
        }
        
        // Clear existing cards if desired
        // this.pokemonCards.forEach(card => card.remove());
        // this.pokemonCards = [];
        
        // Create cards for each Pokemon
        pokemonTeam.forEach((pokemon, index) => {
            this.cardCounter++;
            
            // Position cards in a grid
            const cardsPerRow = 3;
            const cardWidth = 220;
            const cardHeight = 300;
            const startX = 50;
            const startY = 50;
            
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            
            const x = startX + (col * cardWidth);
            const y = startY + (row * cardHeight);
            
            const pokemonCard = new PokemonCard(pokemon, x, y);
            this.pokemonCards.push(pokemonCard);
        });
        
        this.statusBar.showSuccess(`Imported ${pokemonTeam.length} Pokemon`);
        this.statusBar.updatePokemonCount(this.pokemonCards.length);
    }
    
    /**
     * Handle global mouse move for card dragging
     * @param {MouseEvent} e - Mouse event
     */
    handleGlobalMouseMove(e) {
        // Card dragging is now handled by individual PokemonCard instances
        // This method is kept for compatibility with EventManager
    }
    
    /**
     * Handle global mouse up for card dragging
     */
    handleGlobalMouseUp() {
        // Card dragging is now handled by individual PokemonCard instances
        // This method is kept for compatibility with EventManager
    }
}
