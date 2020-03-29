import React, { useState, useEffect } from 'react';
import './index.css';
import shuffle from 'lodash/shuffle';
import { DJs } from '../../../../constants/constants';
import DJCard from '../../../../components/common/DJCard';

export default () => {
    const [cards, setCards] = useState(DJs);

    useEffect(() => {
        setCards(shuffle(DJs));
    }, []);

    return (
        <div className="dj-cards">
            <div>
                {cards.slice(0, 3).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
            <div>
                {cards.slice(3, 7).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
            <div>
                {cards.slice(7, 11).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
            <div>
                {cards.slice(11, 13).map((dj, idx) => (
                    <DJCard key={`dj-card-${idx}`} dj={dj} />
                ))}
            </div>
        </div>
    );
};
