export const checkAttendanceTiming = async (classId) => {
    const response = await fetch(`/api/classTiming/${classId}`);
    const { startTime } = await response.json();
    const now = new Date();
    const classStart = new Date(startTime);

    return now >= new Date(classStart.getTime() - 5 * 60 * 1000) &&
        now <= new Date(classStart.getTime() + 5 * 60 * 1000);
};

export const checkGeolocation = () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(false);
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const targetLocation = { latitude: 37.766400, longitude: -121.914650 }; // Define your target location
            const distance = calculateDistance(latitude, longitude, targetLocation.latitude, targetLocation.longitude);
            resolve(distance <= 20); // Check if within 20 feet
        }, () => resolve(false));
    });
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3963; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance * 5280; // Convert to feet
};
