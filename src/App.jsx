
import React, {useEffect, useRef, useState} from "react";
import CardContainer from "./components/CardContainer.jsx";
import DropdownList from "./components/Dropdown.jsx";
import Mewtwo from './assets/mewtwo.jpg';
import Meowth from './assets/meowth.jpg';
import Gardevoir from './assets/gardevoir.jpg';
import Eevee from './assets/eevee.jpg';
import Default from './assets/back.png';
import Special from './assets/specialset01.jpg';
import Erika from './assets/erikaandvileplume.jpg';
import Gamelost from './assets/loss.mp3';
import Achievement from './assets/AchievementPopup.wav';
import LoopMusic from './assets/music_loop.mp3';

import Modal from "./components/Modal.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import myVideo from './assets/background.mp4';

function App() {
  /*
  * Variables for the game.
  * numberOfCards decides how many cards to make and fetches Pokémon data for those.
  * maxPokedexNumber decides how many possible Pokémon that are in play, 1026 is full national dex. 152 would be the original gen 1 Pokémon
  * shinyChance is just for fun, has a low chance of fetching the shiny sprite instead of the regular sprite.
  * */
    const [maxPokedexNumber, setMaxPokedexNumber] = useState(1026);
    const [minPokedexNumber, setMinPokedexNumber] = useState(0);
    const [changeMessage, setChangeMessage] = useState("Will fetch the full National dex!");
    const numberOfCards = 5; //Maybe make it so they can select difficulty easy, medium or hard (6,12,18 cards?)
    const shinyChance = 0.01; //chance of getting shiny



    /*
    * For game logic
    * */

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStart, setIsGameStart] = useState(true);
  const [clickedIds, setClickedIds] = useState(new Set());
  const [restartGame, setRestartGame] = useState(false);
    const [music, setMusic] = useState(false);

    const loop = useRef(new Audio(LoopMusic));

    //For card backs
    const initialOptions = [
        { value: "Default", label: "Default", image: Default }
    ];
    const [options, setOptions] = useState(initialOptions);
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const [selectedImage, setSelectedImage] = useState(options[0].image);
    const [unlockMessage, setUnlockMessage] = useState("");
    const audioRef = useRef(new Audio());
    audioRef.current.volume = 0.3;




    const handleOptionChange = (value) => {
        setSelectedOption(value);
        // Find the card back image associated with the selected option
        const selectedOptionData = options.find(option => option.value === value);
        if (selectedOptionData) {
            setSelectedImage(selectedOptionData.image);
        }
    };

    //POKEDEX OPTIONS
    const [selectedPokedexOption, setSelectedPokedexOption] = useState(options[0].value);
    const pokedexOptions = [
        { value: "full National", label: "National", min:0,max:1026 },
        { value: "Kanto", label: "Kanto", min:0,max:152 }, //fetch 0 to 151,
        { value: "Jotho", label: "Jotho", min:151,max:252 }, //152 to 251
        { value: "Hoenn", label: "Hoenn", min:251,max:387 }, //etc etc you get the point
        { value: "Sinnoh", label: "Sinnoh", min:386,max:494 },
        { value: "Unova", label: "Unova", min:493,max:650 },
        { value: "Kalos", label: "Kalos", min:649,max:722 },
        { value: "Alola", label: "Alola", min:721,max:808 },
        { value: "Galar", label: "Galar", min:807,max:899 },
        { value: "Paldea", label: "Paldea", min:898 ,max:1026 },

    ];

    const handlePokedexChange= (value) => {
        setSelectedPokedexOption(value);
        const selectedOptionData = pokedexOptions.find(option => option.value === value);
        if (selectedOptionData) {
            setMaxPokedexNumber(selectedOptionData.max);
            setMinPokedexNumber(selectedOptionData.min);
            setChangeMessage("Will fetch the " + selectedOptionData.value + " dex!");
        }
    };


  useEffect(() => {
    if (score === numberOfCards * round ) {
      startNewRound();
    }
    if(score > maxScore){
      setMaxScore(score);
      if (maxScore === 4){
          setOptions((prevOptions) => [
              ...prevOptions,
              { value: "Eevee", label: "Eevee", image: Eevee }
          ]);
          setUnlockMessage("Eevee cardback has been unlocked!");
          audioRef.current.src = Achievement;
          audioRef.current.play();
      }
        if (maxScore === 9){
            setOptions((prevOptions) => [
                ...prevOptions,
                { value: "Meowth", label: "Meowth", image: Meowth }
            ]);
            setUnlockMessage("Meowth cardback has been unlocked!");
            audioRef.current.src = Achievement;
            audioRef.current.play();
        }
        if (maxScore === 14){
            setOptions((prevOptions) => [
                ...prevOptions,
                { value: "Erika", label: "Erika", image: Erika }
            ]);
            setUnlockMessage("Erika cardback has been unlocked!");
            audioRef.current.src = Achievement;
            audioRef.current.play();
        }
        if (maxScore === 19){
            setOptions((prevOptions) => [
                ...prevOptions,
                { value: "Gardevoir", label: "Gardevoir", image: Gardevoir }
            ]);
            setUnlockMessage("Gardevoir cardback has been unlocked!");
            audioRef.current.src = Achievement;
            audioRef.current.play();
        }
        if (maxScore === 24){
            setOptions((prevOptions) => [
                ...prevOptions,
                { value: "Mewtwo", label: "Mewtwo", image: Mewtwo }
            ]);
            setUnlockMessage("Mewtwo cardback has been unlocked!");
            audioRef.current.src = Achievement;
            audioRef.current.play();

        }
        if (maxScore === 29){
            setOptions((prevOptions) => [
                ...prevOptions,
                { value: "Special", label: "Special", image: Special }
            ]);
            setUnlockMessage("Special card back has been unlocked!");
            audioRef.current.src = Achievement;
            audioRef.current.play();

        }
        if (unlockMessage) {
            setTimeout(() => setUnlockMessage(""), 3000);
        }}
    }, [score]);


  const handleCardClick = (id) => {
    if (isGameOver || clickedIds.has(id)) {
        loop.current.pause();
        loop.current.currentTime = 0;
        audioRef.current.src = Gamelost;
        audioRef.current.play();
      setIsGameOver(true);
      return;
    }
    setClickedIds((prev) => new Set(prev).add(id));
    setScore((prevScore) => prevScore + 1);
  };


  //Lets user keep playing until game over
  const startNewRound = () => {
    setRound((prevRound) => prevRound + 1);
    setClickedIds(new Set());
    setRestartGame((prev) => !prev);
  };

  //lets user fully restart (except for max score which remains until page refresh at least)
  const handleRestart = () => {
      setScore(0);
      setIsGameStart(false);
      setClickedIds(new Set());
      setRestartGame((prev) => !prev);
      setRound(1);
      loop.current.loop = true;
      loop.current.play().catch((e) => console.error("Audio play error:", e));
  }
    const handleGameOver = () =>{
        setIsGameStart(true);
        setIsGameOver(false);
    }


    //MUTE/UNMUTE MUSIC
    useEffect(() => {
        if (loop.current) {
            loop.current.volume = music ? 0 : 0.1;
        }
    }, [music]);

    return (
        <>
            <video autoPlay muted loop id="myVideo">
                <source src={myVideo} type="video/mp4"/>
            </video>
            <Header
                music={music}
                setMusic={setMusic}
                score={score}
                maxScore={maxScore}
                options={options}
                handleOptionChange={handleOptionChange}
                selectedOption={selectedOption}
                unlockMessage={unlockMessage}
            />

            <Modal isOpen={isGameStart} title="Start Game">
                <p>Get points by clicking on an image, but don't click on any more than once!<br/> Get new card backs by reaching high scores.</p>
                <DropdownList className="select" id="test" options={pokedexOptions} label={"Choose Pokedex: "} onChange={handlePokedexChange}
                              selectedValue={selectedPokedexOption}></DropdownList>
                <p>{changeMessage}</p>
                <button onClick={handleRestart}>Play!</button>

            </Modal>


            <Modal isOpen={isGameOver} onClose={() => handleRestart} title="Game Over">
                <p>Sorry, you had already clicked that one :(<br/>
                 You got a score of <strong>{score}</strong> this time and your high score
                    is <strong>{maxScore}</strong></p>
                <button onClick={handleGameOver}>Try again?</button>
            </Modal>

            {!isGameStart &&
                <CardContainer handleCardClick={handleCardClick} numberOfCards={numberOfCards} shinyChance={shinyChance}
                               maxPokedexNumber={maxPokedexNumber} minPokedexNumber={minPokedexNumber}
                               restartGame={restartGame}
                               selectedOption={selectedOption} selectedImage={selectedImage}>

                </CardContainer>
            }
            <Footer></Footer>
        </>

    )
        ;
}

export default App;