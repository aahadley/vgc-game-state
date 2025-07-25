// Main application entry point
import { PokemonWhiteboard } from './core/PokemonWhiteboard.js';

// Initialize the application
const whiteboard = new PokemonWhiteboard();

// Make it globally accessible for debugging/extensions
window.whiteboard = whiteboard;

// Add utility function to toggle icon types
window.toggleTypeIcons = () => {
    whiteboard.useUnicodeIcons = !whiteboard.useUnicodeIcons;
    console.log(`Switched to ${whiteboard.useUnicodeIcons ? 'Unicode' : 'SVG'} icons`);
    // Re-render all cards
    whiteboard.pokemonCards.forEach(card => {
        if (card.pokemon) {
            whiteboard.updatePokemonCard(card.id, card.pokemon);
        }
    });
};

// Check for CORS issues
if (window.location.protocol === 'file:') {
    console.warn('Running from local file system. Pokemon sprites may not load due to CORS restrictions.');
    console.log('To fix this, either:');
    console.log('1. Host the file on a web server (even a local one)');
    console.log('2. Use a browser with disabled CORS for development');
    console.log('3. The app will use fallback Pokemon data');
}

console.log('Pokemon Battle Visualizer loaded.');
console.log('Using Unicode icons by default. Run toggleTypeIcons() in console to switch to SVG.');
console.log('Stat calculations are placeholders - modify calculateFinalStats() for accurate calculations.');
