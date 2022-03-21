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
  }

class Card extends Component<CardProps> {
  render() {
    const { cardImage, cardTitle, cardType, cardSubtitle, children } = this.props;
    return (
      <>
             <div className="card mt-5">
              <div className="card__img">
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