export async function requestDeviceOrientationPermission() {
    if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        return response === 'granted';
    }

    return true; // Android / Desktop
}
