import React from "react";
import Close from "../ExpandableImage/close.svg";
import image from "../../../../images/CommonNFT.svg";
import Card from "./ModalCard";

import "./Model.css";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  type?: string;
  price?: 4000;
}

export const ViewNftcomponent: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
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

        <div className={"card_nft mt-5"}>
          <div className={"card__nft__img"}>
            <div className="ImageBoarder">
            <img src={image} alt="Device" />
            </div>
          </div>
          <p className="footer_nft_top_tag">Name NFT</p>

          <span className="card__nft__title card__text ">UNIQUE</span>
          <p className="footer_bottom_tag">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi culpa,
            suscipit, accusantium, facere dolorem minima sint odit laudantium
            iusto aut exercitationem assumenda ipsum molestias! Incidunt tempora
            illum magni consectetur a!
          </p>
        </div>
      </div>
    </div>
  ) : null;
};
