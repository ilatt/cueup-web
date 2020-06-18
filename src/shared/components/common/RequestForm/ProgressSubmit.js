import React, { useRef, useEffect, useState } from 'react';
import dot from '../../../assets/dot.svg';

const ProgressSubmit = ({ currentStep, setProgress }) => {
    const [kute, setKute] = useState();
    const stepRef = useRef(currentStep);

    useEffect(() => {
        const loadKute = async () => {
            const k = await import('kute.js');
            await Promise.all([
                import('kute.js/kute-svg'), //  Add SVG Plugin
                import('kute.js/kute-css'), //  Add CSS Plugin
                import('kute.js/kute-attr'), //  Add Attributes Plugin
                import('kute.js/kute-text'), //  Add Text Plugin
            ]);
            setKute(k);
        };
        loadKute();
    }, []);

    // update steps
    useEffect(() => {
        const step = currentStep;
        const lastStep = stepRef.current;

        if (step > 3 || !kute) {
            return;
        }
        const options = {
            easing: 'easingCubicIn',
            duration: 400,
            morphIndex: 135,
            morphPrecision: 1,
        };

        if (step !== lastStep) {
            if (lastStep > 0) {
                kute.fromTo(
                    '#step' + lastStep + '-circle',
                    { path: '#step' + lastStep + '-pin' },
                    { path: 'M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0' },
                    { ...options, morphIndex: 37 }
                ).start();
            }
            if (step > 0) {
                kute.fromTo(
                    '#step' + step + '-circle',
                    { path: '#step' + step + '-circle' },
                    { path: '#step' + step + '-pin' },
                    options
                ).start();
            }
        }
        stepRef.current = currentStep;
    }, [currentStep, kute]);

    // var className = finished ? "done progrezz" : "progrezz"
    const className = 'progrezz';
    const dotBg = 'url(' + dot + ')';
    return (
        <div className="event-submit-wrapper">
            <div className="progrezz-wrapper">
                <div
                    suppressHydrationWarning={true}
                    style={{
                        opacity: currentStep > 0 && currentStep < 4 ? 1 : 0,
                        backgroundImage: dotBg,
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: '50%',
                    }}
                    className={className}
                >
                    <div
                        onClick={() => setProgress(1)}
                        className={currentStep >= 1 ? ' step done' : ' step'}
                    >
                        <p>
                            {/*{currentStep > 1 ? <img className="checkmark" src={checkmark} alt="checkmark"/> : 1}*/}
                            1
                        </p>
                        <svg
                            id="step1"
                            width="49px"
                            height="64px"
                            viewBox="0 0 49 64"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                className="step-circle"
                                id="step1-circle"
                                d="M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0"
                            />
                            <path
                                id="step1-pin"
                                className="step-pin"
                                d="M24.5,64 C43,42 49,38.0309764 49,24.5 C49,10.9690236 38.0309764,0 24.5,0 C10.9690236,0 0,10.9690236 0,24.5 C0,38.0309764 7,42 24.5,64 Z"
                            />
                        </svg>
                    </div>

                    <div
                        onClick={() => setProgress(2)}
                        className={currentStep >= 2 ? 'done step' : ' step'}
                    >
                        <p>
                            {/*{currentStep > 2 ? <img className="checkmark" src={checkmark} alt="checkmark"/> : 2}*/}
                            2
                        </p>
                        <svg
                            id="step2"
                            width="49px"
                            height="64px"
                            viewBox="0 0 49 64"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                id="step2-circle"
                                className="step-circle"
                                d="M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0"
                            />
                            <path
                                id="step2-pin"
                                className="step-pin"
                                d="M24.5,64 C43,42 49,38.0309764 49,24.5 C49,10.9690236 38.0309764,0 24.5,0 C10.9690236,0 0,10.9690236 0,24.5 C0,38.0309764 7,42 24.5,64 Z"
                            />
                        </svg>
                    </div>

                    <div
                        onClick={() => setProgress(3)}
                        className={currentStep >= 3 ? 'step done' : ' step'}
                    >
                        <p>
                            {/*{currentStep > 3 ? <img className="checkmark" src={checkmark} alt="checkmark"/> : 3}*/}
                            3
                        </p>
                        <svg
                            id="step3"
                            width="49px"
                            height="64px"
                            viewBox="0 0 49 64"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                id="step3-circle"
                                className="step-circle"
                                d="M0,24.5a24.5,24.5 0 1,0 49,0a24.5,24.5 0 1,0 -49,0"
                            />
                            <path
                                id="step3-pin"
                                className="step-pin"
                                d="M24.5,64 C43,42 49,38.0309764 49,24.5 C49,10.9690236 38.0309764,0 24.5,0 C10.9690236,0 0,10.9690236 0,24.5 C0,38.0309764 7,42 24.5,64 Z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressSubmit;
