import * as React from "react";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../../shellInterfaces";

import {
  WithTranslation,
  withTranslation,
  TFunction,
  Trans,
} from "react-i18next";
import "react-notifications/lib/notifications.css";

// import Model from "./Model";
import { Modal } from "./Modal/Modal.component";
import Model from "./Modal//Model";
import { ViewNftcomponent } from "./Modal/ViewNftcomponent";

import CommonWhale from "./ExpandableImage/CommonWhale.svg";
import CommonTaurus from "./ExpandableImage/CommonTaurus.svg";
import CommonPhoenix from "./ExpandableImage/CommonPhoenix.svg";
import CommonPegasus from "./ExpandableImage/CommonPegasus.svg";
import Mystery from "./ExpandableImage/Mystery.svg";

import Card from "./Card";
import "./CardContainer.css";

export type StakingProps = {
  choosenOption: string;
};

// Call API
interface TableView {
  id: string;
  title: string;
  tokentoStake: string;
  LockupDuration: string;
}

export type StakingState = {
  data: TableView[];
  approveFlag: boolean;
  isModelOpen: boolean;
  choosenOpenModel: boolean;
};

class CardContainer extends BaseComponent<
  StakingProps & WithTranslation,
  StakingState
> {
  constructor(props: StakingProps & WithTranslation) {
    super(props);
    this.state = {
      approveFlag: false,
      approveFlag1: false,
      activeTab: " ",
      isModelOpen: false,
      choosenOpenModel: false,
    };
  }

  confirmApprove = () => {
    this.setState({ approveFlag: !this.state.approveFlag });
  };

  toggleModal = () => {
    this.setState({ isModelOpen: !this.state.isModelOpen });
  };

  toggleModal2 = () => {
    this.setState({ choosenOpenModel: !this.state.choosenOpenModel });
  };

  confirmStake() {}
  render() {
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
    console.log("approveFlag value", this.state.approveFlag);

    const mysterCheck = this.props.choosenOption === "Your Farms";

    console.log(
      "Value of choosenOption test check",
      this.props.choosenOption === "Your Farms"
    );

    return (
      // className={choosenOption ==="Your Farms"
      <div className="card_container">
        {/* cardImage, cardTitle, cardType, cardSubtitle,  */}
        {/* <Model/> */}

        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={mysterCheck ? Mystery : CommonPhoenix}
              cardTitle={mysterCheck ? "Character" : "Phoenix"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Fire"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

          {  mysterCheck && (<div className="col-sm-6 col-md-6 col-lg-12">
              <button
                type="button"
                className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                onClick={async () => {
                  this.toggleModal();
                }}
              >
                Choose NFT
              </button>
            </div>)}

          </div>

          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={mysterCheck ? Mystery : CommonTaurus}
              cardTitle={mysterCheck ? "Character" : "Taurus"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Earth"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

         {  mysterCheck && (<div className="col-sm-6 col-md-6 col-lg-12">
              <button
                type="button"
                className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                onClick={async () => {
                  this.toggleModal();
                }}
              >
                Choose NFT
              </button>
            </div>)}
          </div>

          {/* Stake and Approve */}
          <div className="col-sm-12 col-md-12 col-lg-6 mt-5">
            <div className="Main__Container">
              <form className="Center__Container">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label className="form-label right-label">
                    One user can farm max. 10 common sNFTs
                  </label>
                </div>
                <div className="maxValue">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    onChange={() => {}}
                    value={1}
                  />
                </div>

                <div className="d-flex justify-content-center button-row margin_top">
                  <button
                    className="btn btn-md link-dark"
                    style={{
                      width: "100%",
                      backgroundColor: "#CF3279",
                      margin: 0,
                      color: "white",
                    }}
                    type="button"
                    onClick={async () =>
                      this.setState({ approveFlag: !this.state.approveFlag })
                    }
                  >
                    {!this.state.approveFlag
                      ? t("staking.Farming.ApproveTitle")
                      : t("staking.Farming.StakeTitle")}
                  </button>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label className="golden-label">
                    One user can farm max. 10 common sNFTs
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

      
        {/* Second Row */}

        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={mysterCheck ? Mystery : CommonPegasus}
              cardTitle={mysterCheck ? "Character" : "Pegasus"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Wind"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

           {  mysterCheck && (<div className="col-sm-6 col-md-6 col-lg-12">
              <button
                type="button"
                className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                onClick={async () => {
                  this.toggleModal();
                }}
              >
                Choose NFT
              </button>
            </div>)}

          </div>

          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={mysterCheck ? Mystery : CommonWhale}
              cardTitle={mysterCheck ? "Character" : "Whale"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Water"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

             {  mysterCheck && (<div className="col-sm-6 col-md-6 col-lg-12">
              <button
                type="button"
                className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                onClick={async () => {
                  this.toggleModal();
                }}
              >
                Choose NFT
              </button>
            </div>)}

          </div>

          {/* Stake and Approve */}
          <div className="col-sm-0 col-md-2 col-lg-3"></div>

          <div className="col-sm-0 col-md-2 col-lg-3">
            {/* <Card
              cardImage={Mystery}
              cardTitle="Character"
              cardType="common"
              cardSubtitle="Element"
              backgroundColor= "Mystery"
            /> */}

            {/* <Model/> */}
          </div>
        </div>

        <Modal
          title={"You have successfully harvested X number(s) of common sNFTs"}
          isOpen={this.state.isModelOpen}
          onClose={this.toggleModal}
        >
          <p>Your sNFTs have been sent to your wallet</p>
        </Modal>

        {/* <ViewNftcomponent
          title={"You have successfully harvested X number(s) of common sNFTs"}
          isOpen={this.state.choosenOpenModel}
          onClose={this.toggleModal2}
        /> */}
      </div>
    );
  }
}

// ExpandableComponentWithTranlation
const CardContainerComponentWithTranlation = withTranslation()(CardContainer);

// ExpandableComponentMain
const CardContainerComponentMain = compose()(
  CardContainerComponentWithTranlation
);
// ExpandableComponentWithTranlation

export default CardContainerComponentMain;
