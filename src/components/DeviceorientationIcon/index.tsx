import { useDeviceOrientation } from '@/components/DeviceorientationIcon/useDeviceOrientation';
import { ChangeEvent, CSSProperties, memo, ReactNode, useMemo, useState } from 'react';
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
}) => (
    <div
        className="device-orientation"
        style={
            {
                ['--alpha' as any]: String(alpha ?? 0),
                ['--beta' as any]: String(beta - 90),
                ['--gamma' as any]: String(gamma ?? 0),
            } as CSSProperties
        }
    >
        {children}
    </div>
);

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

export const DeviceorientationIcon = () => {
    const [enabled, setEnabled] = useState(false);
    const { alpha, beta, gamma } = useDeviceOrientation(enabled);
    const [x, setX] = useState(45);

    const [y, setY] = useState(0);
    const [z, setZ] = useState(45);

    const onXChange = (event: ChangeEvent<HTMLInputElement>) => {
        setX(Number(event.target.value));
    };

    const onYChange = (event: ChangeEvent<HTMLInputElement>) => {
        setY(Number(event.target.value));
    };

    const onZChange = (event: ChangeEvent<HTMLInputElement>) => {
        setZ(Number(event.target.value));
    };

    const deviceNode = useMemo(() => <Device />, []);

    return (
        <>
            {!enabled && <EnableMotionButton onGranted={() => setEnabled(true)} />}
            <div>
                <div>Alpha: {alpha?.toFixed(1)}</div>
                <div>Beta: {beta?.toFixed(1)}</div>
                <div>Gamma: {gamma?.toFixed(1)}</div>
            </div>
            <label>
                <input
                    type="range"
                    value={beta ?? 0}
                    min={0}
                    max={360}
                    step={1}
                />
                X
            </label>
            <label>
                <input
                    type="range"
                    value={gamma ?? 0}
                    min={0}
                    max={360}
                    step={1}
                />
                y
            </label>
            <label>
                <input
                    type="range"
                    value={alpha ?? 0}
                    min={0}
                    max={360}
                    step={1}
                />
                z
            </label>
            <DeviceOrientationLayer
                beta={beta ?? 0}
                gamma={gamma ?? 0}
                alpha={alpha ?? 0}
            >
                {deviceNode}
            </DeviceOrientationLayer>
        </>
    );
};
