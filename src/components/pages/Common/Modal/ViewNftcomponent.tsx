import React from "react";
import Close from "../ExpandableImage/close.svg";
import image from "../../../../images/CommonNFT.svg";
import Card from "./ModalCard";

import "./ViewNft.css";

interface ModalProps {
  cardImage: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  type?: string;
  price?: string;
  category?: string;
  description?: string;
  categoryName?: string;
  assignedNFT?: string;
}

export const ViewNftcomponent: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  cardImage,
  type,
  price,
  description,
  categoryName,
  assignedNFT,
}) => {
  const outsideRef = React.useRef(null);
  const handleCloseOnOverlay = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  };
  const backgroundColorcheck = "#030843";

  const Image = `data:image/png;base64,${cardImage}`;

  function truncate(str, no_words) {
    return str.split(" ").splice(0,no_words).join(" ");
}

  return isOpen ? (
    <div className={"modal"}>
      <div
        ref={outsideRef}
        className={"modal__overlay"}
        onClick={handleCloseOnOverlay}
      />
      <div className={"modal__nft__box"}>
        <div className={"modal__close"} onClick={onClose}>
          <img src={Close} alt={"close"} />
        </div>

        <div className={"view_card_nft"}>
          <div className={"card__nft__img"}>
            <div>
              <img src={Image} alt="Device" className="ImageBoarder" />
            </div>
          </div>

          <div className="view_nft_footer_bottom_tag">
            <p className="footer_nft_top_tag_title ">SNFT# {assignedNFT}</p>
            <span className="card__nft__title card__text card__type ">
              {type}
            </span>
            <p className="view_nft_footer_nft_top_tag set__paragraph ">Price</p>
            <p className="view_nft_footer_nft_top_tag card__price ">{price}</p>

            <p className="card__what">What is it?</p>
            <p className="card__description">
              {/* {`${truncate(description, 35)}`}..... */}
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
