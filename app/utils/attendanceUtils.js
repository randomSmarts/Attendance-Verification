export const checkGeolocation = () => {
    console.log('Checking geolocation...');
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.log('Geolocation not supported in this browser.');
            resolve({ withinLocation: false, currentCoords: null });
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            console.log('User location:', { latitude, longitude });

            const targetLocation = { latitude: 37.7662739142613, longitude: -121.91465778737411 }; // Replace with real values

            const distance = calculateDistance(latitude, longitude, targetLocation.latitude, targetLocation.longitude);
            console.log('Distance from target location (in feet):', distance);

            resolve({
                withinLocation: distance <= 20,  // Check if within 20 feet
                currentCoords: { latitude, longitude },
            });
        });
    });
};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3963;  // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;  // Distance in miles
    return distance * 5280;  // Convert to feet
};
