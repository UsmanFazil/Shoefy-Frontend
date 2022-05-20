import React, { Component } from 'react';

interface TitleProps {
  title: string;
  subtitle?: string;
}


interface CardProps {
    cardImage: string;
    cardTitle: string;
    cardType:string;
    cardSubtitle:string;
    backgroundColor?:string;

  }

class Card extends Component<CardProps> {
  render() {
    const { cardImage, cardTitle, cardType, cardSubtitle, children, backgroundColor} = this.props;
    const backgroundColorcheck = (backgroundColor != "") 

    return (
      <>
             <div className={backgroundColorcheck ? "card mt-5 colorful_card": "card mt-5 "} >
              {/* <div className="card__img"> */}
              <div className={backgroundColorcheck ? "card__img colorful_card": "card__img"}>

                <img src={cardImage} alt="Device" />
              </div>
              <span className="card__title card__text ">{cardType}</span>
              <div className="card__footer">
                <p className="footer_top_tag">{cardTitle}</p>
                <p className="footer_bottom_tag">{cardSubtitle}</p>
              </div>

            </div>
      </>
    );
  }
}

export default Card;