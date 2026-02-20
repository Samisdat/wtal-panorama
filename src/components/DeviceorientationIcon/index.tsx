import { ChangeEvent, CSSProperties, useState } from 'react';

export const DeviceorientationIcon = () => {
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

    return (
        <>
            <label>
                <input
                    type="range"
                    value={x}
                    onChange={onXChange}
                    min={0}
                    max={360}
                    step={1}
                />
                X
            </label>
            <label>
                <input
                    type="range"
                    value={y}
                    onChange={onYChange}
                    min={0}
                    max={360}
                    step={1}
                />
                y
            </label>
            <label>
                <input
                    type="range"
                    value={z}
                    onChange={onZChange}
                    min={0}
                    max={360}
                    step={1}
                />
                z
            </label>
            <div
                className="device-orientation-icon-wrapper"
                style={
                    {
                        ['--x-axis' as string]: String(x),
                        ['--y-axis' as string]: String(y),
                        ['--z-axis' as string]: String(z),
                    } as CSSProperties
                }
            >
                <div className="device-orientation-icon">
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
        </>
    );
};
