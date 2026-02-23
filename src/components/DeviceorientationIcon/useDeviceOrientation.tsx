import { useEffect, useState } from 'react';

export function useDeviceOrientation(enabled = true) {
    const [orientation, setOrientation] = useState({
        alpha: null as number | null,
        beta: null as number | null,
        gamma: null as number | null,
    });

    useEffect(() => {
        if (!enabled) return;

        const handler = (event: DeviceOrientationEvent) => {
            setOrientation({
                alpha: event.alpha ?? null,
                beta: event.beta ?? null,
                gamma: event.gamma ?? null,
            });
        };

        window.addEventListener('deviceorientation', handler);
        return () => window.removeEventListener('deviceorientation', handler);
    }, [enabled]);

    return orientation;
}

