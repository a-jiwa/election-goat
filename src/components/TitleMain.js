import React, { useState, useEffect } from 'react';

function TitleMain() {
    const [phrase, setPhrase] = useState({ text: 'Labour', color: 'red' });
    const [opacity, setOpacity] = useState(1);

    const phrases = [
        { text: 'Labour', color: '#E4003B' },
        { text: 'the Tories', color: '#0087DC' },
        { text: 'the Greens', color: '#49b90c' },
        { text: 'the Lib Dems', color: '#efbb39' },
        { text: 'SNPs', color: '#ae0fe5' }
    ];

    let currentIndex = 0;

    useEffect(() => {
        const switchPhrase = () => {
            currentIndex = (currentIndex + 1) % phrases.length;
            setPhrase(prevPhrase => ({ ...prevPhrase, text: phrases[currentIndex].text })); // Change text first
            setTimeout(() => {
                setPhrase(phrases[currentIndex]); // Then change color when opacity is 0
                setOpacity(1); // fade in the new phrase
            }, 0);
        };

        const interval = setInterval(() => {
            setOpacity(0); // start fade-out effect
            setTimeout(switchPhrase, 1000); // switch the phrase after 2 seconds (when opacity is 0)
        }, 5000);  // Switching every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="title-main">
            How popular are{" "}
            <span
                style={{
                    opacity: opacity,
                    transition: 'opacity 1s', // Only transition the opacity
                    color: phrase.color
                }}>
                {phrase.text}
            </span>
            ?
        </div>
    );
}

export default TitleMain;
