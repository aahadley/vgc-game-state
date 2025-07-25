/**
 * Toolbar component for managing drawing tools and controls
 */
export class Toolbar {
    constructor(whiteboard) {
        this.whiteboard = whiteboard;
        this.activeToolElement = null;
    }
    
    /**
     * Initialize the toolbar
     */
    init() {
        this.initializeToolButtons();
        this.initializeControls();
        this.setActiveTool('draw');
    }
    
    /**
     * Initialize tool buttons
     */
    initializeToolButtons() {
        // Map element IDs to tool names
        const toolMap = {
            'drawTool': 'draw',
            'eraseTool': 'erase',
            'pokemonTool': 'pokemon'
        };
        
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(button => {
            if (toolMap[button.id]) {
                button.addEventListener('click', () => {
                    this.whiteboard.setTool(toolMap[button.id]);
                });
            }
        });
    }
    
    /**
     * Initialize control elements
     */
    initializeControls() {
        const colorPicker = document.getElementById('colorPicker');
        const sizeSlider = document.getElementById('sizeSlider');
        const sizeDisplay = document.querySelector('.size-display');
        const clearBtn = document.getElementById('clearBtn');
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (colorPicker) {
            colorPicker.value = '#ffffff';
            colorPicker.addEventListener('change', (e) => {
                this.whiteboard.setBrushColor(e.target.value);
            });
        }
        
        if (sizeSlider) {
            sizeSlider.value = '5';
            if (sizeDisplay) {
                sizeDisplay.textContent = '5px';
            }
            
            sizeSlider.addEventListener('input', (e) => {
                this.whiteboard.setBrushSize(parseInt(e.target.value));
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.whiteboard.clearCanvas();
            });
        }
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                this.whiteboard.undo();
            });
        }
        
        if (redoBtn) {
            redoBtn.addEventListener('click', () => {
                this.whiteboard.redo();
            });
        }
    }
    
    /**
     * Set the active tool
     */
    setActiveTool(tool) {
        // Remove active class from previous tool
        if (this.activeToolElement) {
            this.activeToolElement.classList.remove('active');
        }
        
        // Map tool names to element IDs
        const toolElementIds = {
            'draw': 'drawTool',
            'erase': 'eraseTool', 
            'pokemon': 'pokemonTool'
        };
        
        const toolId = toolElementIds[tool];
        const toolElement = document.getElementById(toolId);
        if (toolElement) {
            toolElement.classList.add('active');
            this.activeToolElement = toolElement;
        }
    }
    
    /**
     * Get current color
     */
    getCurrentColor() {
        const colorPicker = document.getElementById('colorPicker');
        return colorPicker ? colorPicker.value : '#000000';
    }
    
    /**
     * Get current brush size
     */
    getCurrentSize() {
        const sizeSlider = document.getElementById('sizeSlider');
        return sizeSlider ? parseInt(sizeSlider.value) : 5;
    }
    
    /**
     * Update undo/redo button states
     */
    updateUndoRedoButtons(canUndo, canRedo) {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn) {
            undoBtn.disabled = !canUndo;
        }
        
        if (redoBtn) {
            redoBtn.disabled = !canRedo;
        }
    }
    
    /**
     * Update the size display
     */
    updateSizeDisplay(size) {
        const sizeDisplay = document.querySelector('.size-display');
        if (sizeDisplay) {
            sizeDisplay.textContent = size + 'px';
        }
    }
}
