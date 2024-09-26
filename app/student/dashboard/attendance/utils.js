// Check if the current time is within 5 minutes before and 10 minutes after class start time
export const checkAttendanceTiming = async (classId) => {
    const response = await fetch(`/api/classTiming/${classId}`);
    const { timings } = await response.json(); // Get the timings for the class
    const now = new Date();

    // Find the current day
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const classTime = timings.find(timing => timing.day === currentDay);

    if (!classTime) return false; // No class today

    const [startTimeStr] = classTime.time.split(" - ");
    const classStart = new Date(now.toDateString() + ' ' + startTimeStr);

    // Check if within the time window (5 mins before to 10 mins after)
    return now >= new Date(classStart.getTime() - 5 * 60 * 1000) &&
        now <= new Date(classStart.getTime() + 10 * 60 * 1000);
};

// Check if the user is within 20 feet of the class location
export const checkGeolocation = () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ success: false });
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            // Fetch the class location (latitude and longitude)
            const classResponse = await fetch(`/api/classLocation/${classId}`);
            const { latitude: targetLat, longitude: targetLon } = await classResponse.json();

            const distance = calculateDistance(latitude, longitude, targetLat, targetLon);

            // Resolve with success if distance is within 20 feet
            resolve({ success: distance <= 20, latitude, longitude });
        }, () => resolve({ success: false }));
    });
};

// Calculate the distance between two coordinates (returns distance in feet)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3963; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInMiles = R * c; // Distance in miles
    return distanceInMiles * 5280; // Convert to feet
};
