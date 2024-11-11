import { useEffect, useState, useRef } from "react";
import Card from "./Card.jsx";
import cardDraw from '../assets/cardDraw.wav';
import shiny from '../assets/shiny.mp3';

export default function CardContainer({
                                          handleCardClick,
                                          numberOfCards,
                                          maxPokedexNumber,
                                          minPokedexNumber,
                                          shinyChance,
                                          restartGame,
                                          selectedOption,
                                          selectedImage,
                                      }) {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardContainerRef = useRef(null);
    const audioRef = useRef(new Audio());
    const audioRef2 = useRef(new Audio(cardDraw));
    const audioRef3 = useRef(new Audio(cardDraw));
    const audioRef4 = useRef(new Audio(shiny));
    audioRef4.current.volume = 0.5;
    audioRef.current.volume = 0.1;
    // Fetch Pokemon data
    const getPokemon = async (id, shiny) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const { name, sprites, cries } = await res.json();
        const image = sprites[shiny ? "front_shiny" : "front_default"];
        if (shiny){
            audioRef4.current.play();
        }
        const cry = cries["latest"];
        return { id, name, image, shiny, cry };
    };

    // Fetch unique pokemon
    const fetchUniquePokemon = async () => {
        setLoading(true);
        const uniquePokemon = new Set();
        const pokemonData = [];

        while (pokemonData.length < numberOfCards) {
            const id = Math.floor(Math.random() * (maxPokedexNumber - minPokedexNumber + 1)) + minPokedexNumber;
            if (!uniquePokemon.has(id)) {
                uniquePokemon.add(id);
                const shiny = Math.random() < shinyChance;
                const pokemon = await getPokemon(id, shiny);
                pokemonData.push(pokemon);
            }
        }

        setPokemon(pokemonData);
        setLoading(false);
    };

    // Shuffle Pokémon after each click
    const shufflePokemon = () => {

        const cardElements = cardContainerRef.current.querySelectorAll(".card-inner");
        cardElements.forEach((card) => {
            audioRef2.current.play();
            card.style.transition = "transform 0.6s ease";
            card.style.transform = "rotateY(180deg)";
            card.closest(".card").classList.add("flipping");
            card.closest(".card-tilt").classList.add("flipping");
        });


        setTimeout(() => {
            setPokemon((prevPokemon) => {
                const shuffled = [...prevPokemon];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            });

            setTimeout(() => {
                cardElements.forEach((card) => {
                    audioRef3.current.play();
                    card.style.transform = "rotateY(0deg)";
                    card.closest(".card").classList.remove("flipping");
                    card.closest(".card-tilt").classList.remove("flipping");
                });
            }, 600);
        }, 600);
    };

    const handleClick = (id, cry) => {
        handleCardClick(id);
        audioRef.current.src = cry;
        audioRef.current.play();
        shufflePokemon();
    };

    useEffect(() => {
        const abortController = new AbortController();
        fetchUniquePokemon(abortController.signal);
        return () => {
            abortController.abort();
        };
    }, [restartGame]);

    return (
        <>
            {loading ? (
                <div className="card-container">
                <h1>Catching wild Pokemon...</h1>
                </div>
            ) : (
                <div ref={cardContainerRef} className="card-container">
                    {pokemon.map((p) => (
                        <Card
                            key={p.id}
                            url={p.image}
                            title={p.name}

                            onCardClick={() => handleClick(p.id, p.cry)}
                            cardBackAlt={selectedOption}
                            cardBack={selectedImage}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
