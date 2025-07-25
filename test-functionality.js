// Test script to verify the application is working
console.log('Testing Pokemon Whiteboard functionality...');

// Test if whiteboard is available
if (window.whiteboard) {
    console.log('✅ Whiteboard instance available');
    
    // Test tool switching
    try {
        window.whiteboard.setTool('draw');
        console.log('✅ Draw tool set successfully');
        
        window.whiteboard.setTool('erase');
        console.log('✅ Erase tool set successfully');
        
        window.whiteboard.setTool('pokemon');
        console.log('✅ Pokemon tool set successfully');
        
        // Test color and size changes
        window.whiteboard.setBrushColor('#ff0000');
        console.log('✅ Brush color changed successfully');
        
        window.whiteboard.setBrushSize(10);
        console.log('✅ Brush size changed successfully');
        
        console.log('🎉 All basic functionality tests passed!');
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
    }
} else {
    console.error('❌ Whiteboard instance not found');
}
