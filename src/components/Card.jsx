import Tilt from "react-parallax-tilt";

export default function Card({ url, title, onCardClick, cardBack, cardBackAlt }) {

    const Capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);




    return (
        <Tilt className="card-tilt"  glareEnable={true}>
            <div className="card" onClick={onCardClick}>
                <div className="card-inner">
                    <div className="card-front">
                        <img src={url} alt={title}/>
                        <h3>{Capitalize(title)}</h3>
                    </div>
                    <div className="card-back">
                        <img src={cardBack} alt={cardBackAlt} className="card-image"/>
                    </div>
                </div>
            </div>
        </Tilt>
    );
}
