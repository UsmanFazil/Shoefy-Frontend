import React from "react";
import Congratulations from "../ExpandableImage/Congratulations.svg";
import Close from "../ExpandableImage/close.svg";
import image from "../../../../images/CommonNFT.svg"


import './Model.css';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewNftcomponent: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
}) => {
  const outsideRef = React.useRef(null);
  console.log("Value of isOpen", isOpen);
  const handleCloseOnOverlay = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  };

  return isOpen ? (
    <div className={"model"}>
      <div
        ref={outsideRef}
        className={"model__overlay"}
        onClick={handleCloseOnOverlay}
      />
      <div className={"model__box"}>
        <div className={"model__close"} onClick={onClose}>
          <img src={Close} alt={"close"} />
        </div>

        <div className="row row-cols-3 model-nft-container">
            <div className="col nft-item">
              <div className="d-flex nft-img">
                <img src={image} alt="" />
              </div>
              <div className="nft-text">
                <p></p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint quaerat veniam deleniti veritatis aperiam dicta, praesentium a unde dolor quas aliquid. Accusamus at in tempore voluptatum repudiandae et? Hic, ex?</p>
              </div>
              <div className="nft-action">
                <button
                  className="btn btn-primary btn-md link-dark align-self-center stake-confirm"
                  type="button"
                  onClick={async () => {
                    console.log("I am rofl perfect")
                  }}
                >
                  UN STAKE
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  ) : null;
};
