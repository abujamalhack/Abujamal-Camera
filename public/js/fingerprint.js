class DeviceFingerprinter {
    constructor() {
        this.fingerprint = {};
    }

    async generateFingerprint() {
        await this.collectCanvasFingerprint();
        this.collectWebGLInfo();
        this.collectAudioContext();
        this.collectScreenInfo();
        this.collectTimezone();
        this.collectPlugins();
        
        return this.hashFingerprint();
    }

    collectCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Advanced fingerprint', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Advanced fingerprint', 4, 17);
        
        this.fingerprint.canvas = canvas.toDataURL();
    }

    collectWebGLInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            this.fingerprint.webgl = {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                version: gl.getParameter(gl.VERSION)
            };
        }
    }

    collectScreenInfo() {
        this.fingerprint.screen = {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
        };
    }

    hashFingerprint() {
        const str = JSON.stringify(this.fingerprint);
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return hash.toString();
    }
}
