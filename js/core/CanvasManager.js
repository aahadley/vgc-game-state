/**
 * Canvas manager for drawing operations
 */
export class CanvasManager {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.currentTool = 'draw';
        this.brushSize = 5;
        this.brushColor = '#ffffff';
    }
    
    /**
     * Initialize the canvas
     */
    initialize() {
        this.resizeCanvas();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalCompositeOperation = 'source-over';
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    /**
     * Resize canvas to match window size
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Restore drawing properties after resize
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.globalCompositeOperation = this.currentTool === 'erase' ? 'destination-out' : 'source-over';
    }
    
    /**
     * Set the drawing tool
     * @param {string} tool - Tool name
     */
    setTool(tool) {
        this.currentTool = tool;
        
        if (tool === 'erase') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.canvas.style.cursor = 'grab';
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
            this.canvas.style.cursor = 'crosshair';
        }
    }
    
    /**
     * Set brush color
     * @param {string} color - Hex color
     */
    setBrushColor(color) {
        this.brushColor = color;
        this.ctx.strokeStyle = color;
    }
    
    /**
     * Set brush size
     * @param {number} size - Size in pixels
     */
    setBrushSize(size) {
        this.brushSize = size;
        this.ctx.lineWidth = size;
    }
    
    /**
     * Start drawing
     * @param {MouseEvent} e - Mouse event
     */
    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
    }
    
    /**
     * Draw on canvas
     * @param {MouseEvent} e - Mouse event
     */
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        this.ctx.strokeStyle = this.currentTool === 'erase' ? '#000000' : this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        
        this.lastX = currentX;
        this.lastY = currentY;
    }
    
    /**
     * Stop drawing
     */
    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.beginPath();
    }
    
    /**
     * Clear the canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Get canvas image data for history
     * @returns {ImageData} Canvas image data
     */
    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Restore canvas from image data
     * @param {ImageData} imageData - Image data to restore
     */
    restoreImageData(imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }
}
