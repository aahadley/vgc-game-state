/**
 * History manager for undo/redo functionality
 */
export class HistoryManager {
    constructor() {
        this.history = [];
        this.historyStep = -1;
        this.maxHistorySize = 50; // Limit history to prevent memory issues
    }
    
    /**
     * Save current state to history
     * @param {ImageData} imageData - Canvas image data
     */
    saveState(imageData) {
        // Remove any states after current step (when undoing then doing new action)
        if (this.historyStep < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyStep + 1);
        }
        
        // Add new state
        this.history.push(imageData);
        this.historyStep++;
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
            this.historyStep--;
        }
    }
    
    /**
     * Undo last action
     * @returns {ImageData|null} Previous state or null if can't undo
     */
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            return this.history[this.historyStep];
        }
        return null;
    }
    
    /**
     * Redo last undone action
     * @returns {ImageData|null} Next state or null if can't redo
     */
    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            return this.history[this.historyStep];
        }
        return null;
    }
    
    /**
     * Check if undo is possible
     * @returns {boolean} True if can undo
     */
    canUndo() {
        return this.historyStep > 0;
    }
    
    /**
     * Check if redo is possible
     * @returns {boolean} True if can redo
     */
    canRedo() {
        return this.historyStep < this.history.length - 1;
    }
}
