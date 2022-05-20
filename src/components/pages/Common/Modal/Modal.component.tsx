import React from "react";
import Congratulations from "../ExpandableImage/Congratulations.svg";
import Close from "../ExpandableImage/close.svg";

import "./Modal.component.css";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
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

  return isOpen ? (
    <div className={"modal"}>
      <div
        ref={outsideRef}
        className={"modal__overlay"}
        onClick={handleCloseOnOverlay}
      />
      <div className={"modal__box"}>
        <div className={"modal__close"} onClick={onClose}>
          <img src={Close} alt={"close"} />
        </div>

        <div className={"modal__center"} >
          <div className="image__container">
          <img src={Congratulations} width="276px" height="240px" alt="" />
          </div>

          <div className={"modal__title"}>{title}</div>
          <div className={"modal__title"}>{children}</div>
        </div>
      </div>
    </div>
  ) : null;
};
