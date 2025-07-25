/**
 * Status bar for displaying information and notifications
 */
export class StatusBar {
    constructor() {
        this.statusElement = document.querySelector('.status-bar');
        this.createStatusBar();
    }
    
    /**
     * Create status bar element if it doesn't exist
     */
    createStatusBar() {
        if (!this.statusElement) {
            this.statusElement = document.createElement('div');
            this.statusElement.className = 'status-bar';
            this.statusElement.innerHTML = `
                <div class="status-content">
                    <span id="toolStatus">Draw Tool Active</span>
                    <span id="canvasInfo">Canvas: 1200x800</span>
                    <span id="pokemonCount">Pokemon: 0</span>
                </div>
            `;
            document.body.appendChild(this.statusElement);
        }
    }
    
    /**
     * Update tool status
     */
    updateToolStatus(tool) {
        const toolStatus = document.getElementById('toolStatus');
        if (toolStatus) {
            const toolNames = {
                'draw': 'Draw Tool Active',
                'erase': 'Erase Tool Active',
                'pokemon': 'Pokemon Tool Active'
            };
            toolStatus.textContent = toolNames[tool] || 'Unknown Tool';
        }
    }
    
    /**
     * Update canvas info
     */
    updateCanvasInfo(width, height) {
        const canvasInfo = document.getElementById('canvasInfo');
        if (canvasInfo) {
            canvasInfo.textContent = `Canvas: ${width}x${height}`;
        }
    }
    
    /**
     * Update Pokemon count
     */
    updatePokemonCount(count) {
        const pokemonCount = document.getElementById('pokemonCount');
        if (pokemonCount) {
            pokemonCount.textContent = `Pokemon: ${count}`;
        }
    }
    
    /**
     * Show temporary message
     */
    showMessage(message, duration = 3000) {
        const messageElement = document.createElement('div');
        messageElement.className = 'status-message';
        messageElement.textContent = message;
        
        this.statusElement.appendChild(messageElement);
        
        // Animate in
        requestAnimationFrame(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
        
        // Remove after duration
        setTimeout(() => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, duration);
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.showMessage(`Error: ${message}`, 5000);
    }
    
    /**
     * Show success message
     */
    showSuccess(message) {
        this.showMessage(`Success: ${message}`, 2000);
    }
}
