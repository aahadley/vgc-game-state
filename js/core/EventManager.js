/**
 * Event manager for handling all application events
 */
export class EventManager {
    constructor(whiteboard) {
        this.whiteboard = whiteboard;
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        this.bindToolbarEvents();
        this.bindCanvasEvents();
        this.bindTouchEvents();
        this.bindGlobalEvents();
    }
    
    /**
     * Bind toolbar event listeners
     */
    bindToolbarEvents() {
        // Tool selection
        document.getElementById('drawTool').addEventListener('click', () => 
            this.whiteboard.setTool('draw'));
        document.getElementById('eraseTool').addEventListener('click', () => 
            this.whiteboard.setTool('erase'));
        document.getElementById('pokemonTool').addEventListener('click', () => 
            this.whiteboard.setTool('pokemon'));
        
        // Controls
        document.getElementById('colorPicker').addEventListener('change', (e) => 
            this.whiteboard.setBrushColor(e.target.value));
        document.getElementById('sizeSlider').addEventListener('input', (e) => 
            this.whiteboard.setBrushSize(e.target.value));
        document.getElementById('clearBtn').addEventListener('click', () => 
            this.whiteboard.clearCanvas());
        document.getElementById('undoBtn').addEventListener('click', () => 
            this.whiteboard.undo());
        document.getElementById('redoBtn').addEventListener('click', () => 
            this.whiteboard.redo());
    }
    
    /**
     * Bind canvas event listeners
     */
    bindCanvasEvents() {
        const canvas = this.whiteboard.canvasManager.canvas;
        
        canvas.addEventListener('mousedown', (e) => 
            this.whiteboard.handleCanvasMouseDown(e));
        canvas.addEventListener('mousemove', (e) => 
            this.whiteboard.handleCanvasMouseMove(e));
        canvas.addEventListener('mouseup', () => 
            this.whiteboard.handleCanvasMouseUp());
        canvas.addEventListener('mouseout', () => 
            this.whiteboard.handleCanvasMouseUp());
    }
    
    /**
     * Bind touch event listeners for mobile support
     */
    bindTouchEvents() {
        const canvas = this.whiteboard.canvasManager.canvas;
        
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });
    }
    
    /**
     * Bind global event listeners
     */
    bindGlobalEvents() {
        // Global events for card dragging
        document.addEventListener('mousemove', (e) => 
            this.whiteboard.handleGlobalMouseMove(e));
        document.addEventListener('mouseup', () => 
            this.whiteboard.handleGlobalMouseUp());
    }
}
