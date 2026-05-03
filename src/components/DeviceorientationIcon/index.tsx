import { useDeviceOrientation } from '@/components/DeviceorientationIcon/useDeviceOrientation';
import { mat4, quat } from 'gl-matrix';
import {ChangeEvent, CSSProperties, memo, ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import { requestDeviceOrientationPermission } from './requestDeviceOrientationPermission';

const EnableMotionButton = ({ onGranted }: { onGranted: () => void }) => {
    const handleClick = async () => {
        const granted = await requestDeviceOrientationPermission();

        if (granted) {
            onGranted();
        } else {
            alert('Permission denied');
        }
    };

    return <button onClick={handleClick}>Enable Motion</button>;
};

const DeviceOrientationLayer = ({
    alpha,
    beta,
    gamma,
    children,
}: {
    alpha: number;
    beta: number;
    gamma: number;
    children: ReactNode;
}) => {
    const [matrixString, setMatrixString] = useState('');

    const rotationMatrix = mat4.create();
    const finalQuat = quat.create();
    const quatX = quat.create();
    const quatY = quat.create();
    const quatZ = quat.create();

    useEffect(() => {
        const a = alpha ? (-1 * alpha * Math.PI) / 180 : 0;
        const b = beta ? ((-1 * beta + 90) * Math.PI) / 180 : 90 * Math.PI;
        const g = gamma ? (gamma * Math.PI) / 180 : 0;

        // 2. Erstelle einzelne Quaternions für jede Achse
        quat.setAxisAngle(quatZ, [0, 0, 1], a); // Z-Achse zuerst
        quat.setAxisAngle(quatX, [1, 0, 0], b); // Dann X-Achse
        quat.setAxisAngle(quatY, [0, 1, 0], g); // Dann Y-Achse

        // 3. Kombiniere sie in der W3C-Reihenfolge: Z * X * Y
        // Wir multiplizieren von rechts nach links oder schrittweise:
        quat.multiply(finalQuat, quatZ, quatX);
        quat.multiply(finalQuat, finalQuat, quatY);

        // 4. Quaternion in die 4x4 Matrix umwandeln
        mat4.fromQuat(rotationMatrix, finalQuat);

        setMatrixString(`matrix3d(${rotationMatrix.join(',')})`);
    }, [alpha, beta, gamma]);

    return (
        <div
            className="device-orientation"
            style={{ '--matrix': matrixString } as CSSProperties}
        >
            {children}
        </div>
    );
};

const Device = memo(() => (
    <div className="stage">
        <div className="device-wrap">
            <div className="device">
                <div
                    className="axes"
                    aria-hidden="true"
                >
                    <div className="axis axis-x"></div>
                    <div className="axis axis-y"></div>
                    <div className="axis axis-z"></div>
                </div>

                <div className="side front"></div>
                <div className="side right"></div>
                <div className="side back"></div>
                <div className="side top"></div>
                <div className="side left"></div>
                <div className="side bottom"></div>
            </div>
        </div>
    </div>
));

type Orientation = {
    alpha: number,
    beta: number,
    gamma: number,
}

const lerpFactor = 0.1;

export const DeviceorientationIcon = () => {
    const [enabled, setEnabled] = useState(false);
    const { alpha, beta, gamma } = useDeviceOrientation(enabled);

    const smoothed = useRef({ alpha: 0, beta: 0, gamma: 0 });
    const raw = useRef({ alpha: 0, beta: 0, gamma: 0 });

    const [orientation, setOrientation] = useState<Orientation>({ alpha: 0, beta: 0, gamma: 0 });
    const lerpFactor = 0.1;

    useEffect(() => {

        setOrientation((prev)=>{
            console.log(prev)

            if(!alpha ||! beta ||!gamma){
                return prev;
            }

            const nextAlphaRad = alpha * Math.PI / 180;
            const currAlphaRad = prev.alpha * Math.PI / 180;

            const s = Math.sin(nextAlphaRad) * lerpFactor + Math.sin(currAlphaRad) * (1 - lerpFactor);
            const c = Math.cos(nextAlphaRad) * lerpFactor + Math.cos(currAlphaRad) * (1 - lerpFactor);

            const nextAlpha = Math.atan2(s, c) * 180 / Math.PI;

            // 2. Einfaches Smoothing für Beta & Gamma
            const nextBeta = prev.beta + (beta - prev.beta) * lerpFactor;
            const nextGamma = prev.gamma + (gamma - prev.gamma) * lerpFactor;

            return {
                alpha:nextAlpha,
                beta:nextBeta,
                gamma:nextGamma,
            }
        })

    }, [alpha, beta, gamma]);

    const deviceNode = useMemo(() => <Device />, []);

    return (
        <>
            {!enabled && <EnableMotionButton onGranted={() => setEnabled(true)} />}
            <div>
                <div>Alpha: {orientation.alpha?.toFixed(1)}</div>
                <div>Beta: {orientation.beta?.toFixed(1)}</div>
                <div>Gamma: {orientation.gamma?.toFixed(1)}</div>
            </div>
            <DeviceOrientationLayer
                beta={orientation.beta ?? 0}
                gamma={orientation.gamma ?? 0}
                alpha={orientation.alpha ?? 0}
            >
                {deviceNode}
            </DeviceOrientationLayer>
        </>
    );
};
