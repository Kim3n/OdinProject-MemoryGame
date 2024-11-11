// GameHeader.js

import React from 'react';
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import Dropdown from "./Dropdown.jsx";

function GameHeader({
                        music,
                        setMusic,
                        score,
                        maxScore,
                        options,
                        handleOptionChange,
                        selectedOption,
                        unlockMessage,
                    }) {
    return (
        <div className="header">
            <div className="header-top">
                <div className="header-left">
                    <h1>Pokémon Memory Game</h1>
                    <button className="muteButton" onClick={() => setMusic(prevState => !prevState)}>
                        {music ? <MdVolumeOff/> : <MdVolumeUp/>}
                    </button>
                </div>


                    <>
                        <div className="scores-container">
                            <h1>Score: {score}</h1>
                            <h1>High score: {maxScore}</h1>

                                <Dropdown
                                    className="select select-back"
                                    options={options}
                                    label={"Card back: "}
                                    onChange={handleOptionChange}
                                    selectedValue={selectedOption}
                                />
                                <p className="unlock-message">{unlockMessage}</p>

                        </div>
                    </>

            </div>


        </div>
    );
}

export default GameHeader;
