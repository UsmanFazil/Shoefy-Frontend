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

// import CommonWhale from "./ExpandableImage/CommonWhale.svg";
// import CommonTaurus from "./ExpandableImage/CommonTaurus.svg";
// import CommonPhoenix from "./ExpandableImage/CommonPhoenix.svg";
// import CommonPegasus from "./ExpandableImage/CommonPegasus.svg";
import Mystery from "./ExpandableImage/Mystery.svg";

// Common Farming Images
import CommonPegasus from "./ExpandableImage/Preview/01COMMON/COMMON_Pegasus.png";
import CommonPhoenix from "./ExpandableImage/Preview/01COMMON/COMMON_Phoenix.png";
import CommonTaurus from "./ExpandableImage/Preview/01COMMON/COMMON_Taurus.png";
import CommonWhale from "./ExpandableImage/Preview/01COMMON/COMMON_Whale.png";

//Unique Farming Images
import UniquePegasus from "./ExpandableImage/Preview/02UNIQUE/UNIQUE_pegasus.png";
import UniquePhoenix from "./ExpandableImage/Preview/02UNIQUE/UNIQUE_PHOENIX.png";
import UniqueTaurus from "./ExpandableImage/Preview/02UNIQUE/UNIQUE_TAURUS.png";
import UniqueWhell from "./ExpandableImage/Preview/02UNIQUE/UNIQUE_whell.png";

//Rare Farming Images
import RarePegasus from "./ExpandableImage/Preview/03RARE/RARE_pegasus.png";
import RareTaurus from "./ExpandableImage/Preview/03RARE/RARE_taurus.png";
import RarePhoenix from "./ExpandableImage/Preview/03RARE/RARE_phoenix.png";
import Rarehale from "./ExpandableImage/Preview/03RARE/RARE_whale.png";

//Epic Farming Images
import EPIC_Pegasus from "./ExpandableImage/Preview/04EPIC/EPIC_Pegasus.png";
import EPIC_Phoenix from "./ExpandableImage/Preview/04EPIC/EPIC_Phoenix.png";
import EPIC_Taurus from "./ExpandableImage/Preview/04EPIC/EPIC_Taurus.png";
import EPIC_Whale from "./ExpandableImage/Preview/04EPIC/EPIC_Whale.png";

// Legendary Farming
import LEGENDARY_pegasus from "./ExpandableImage/Preview/05LEGENDARY/LEGENDARY_pegasus.png";
import LEGENDARY_phoenix from "./ExpandableImage/Preview/05LEGENDARY/LEGENDARY_phoenix.png";
import LEGENDARY_taurus from "./ExpandableImage/Preview/05LEGENDARY/LEGENDARY_taurus.png";
import LEGENDARY_whale from "./ExpandableImage/Preview/05LEGENDARY/LEGENDARY_whale.png";

// ALIEN MYTHIC Farming
import ALIEN_MYTHIC_PHOENIX from "./ExpandableImage/Preview/06ALIENMYTHIC/ALIEN_MYTHIC_PHOENIX.png";
import ALIEN_MYTHIC_TAURUS from "./ExpandableImage/Preview/06ALIENMYTHIC/ALIEN_MYTHIC_TAURUS.png";
import ALIEN_MYTHIC_PEGASUS from "./ExpandableImage/Preview/06ALIENMYTHIC/ALIEN_MYTHIC_PEGASUS.png";
import ALIEN_MYTHIC_WHALE from "./ExpandableImage/Preview/06ALIENMYTHIC/ALIEN_MYTHIC_WHALE.png";

// DEVIL MYTHIC Farming
import DEVIL_MYTHIC_PHOENIX from "./ExpandableImage/Preview/07MYTHICDEVIL/DEVIL_Mythic_Pegasus.png";
import DEVIL_MYTHIC_TAURUS from "./ExpandableImage/Preview/07MYTHICDEVIL/DEVIL_Mythic_Phoenix.png";
import DEVIL_MYTHIC_PEGASUS from "./ExpandableImage/Preview/07MYTHICDEVIL/DEVIL_Mythic_Taurus.png";
import DEVIL_MYTHIC_WHALE from "./ExpandableImage/Preview/07MYTHICDEVIL/DEVIL_Mythic_Whale.png";

// GOD MYTHIC Farming
import GOD_MYTHIC_PHOENIX from "./ExpandableImage/Preview/08MYTHICGOD/GOD_MYTHIC_PEGASUS.png";
import GOD_MYTHIC_TAURUS from "./ExpandableImage/Preview/08MYTHICGOD/GOD_MYTHIC_PHOENIX.png";
import GOD_MYTHIC_PEGASUS from "./ExpandableImage/Preview/08MYTHICGOD/GOD_MYTHIC_TAURUS.png";
import GOD_MYTHIC_WHALE from "./ExpandableImage/Preview/08MYTHICGOD/GOD_MYTHIC_WHALE.png";

import Card from "./Card";
import "./CardContainer.css";

export type StakingProps = {
  choosenOption: string;
  currentTab?: string;
  title?: string;
  index?:number;
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
  FarmingArray: any;
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

  findImage() {

    const currentIndex = this.props.index;
    console.log("Valye if index",currentIndex);
    const CommonCategory = [ CommonPegasus,CommonPhoenix,CommonTaurus,CommonWhale];

    const UniqueCategory = [UniquePegasus,UniquePhoenix,UniqueTaurus,UniqueWhell];

    const RareCategory = [RarePegasus, RareTaurus, RarePhoenix, Rarehale];

    const EpicCategory = [EPIC_Pegasus, EPIC_Phoenix, EPIC_Taurus, EPIC_Whale];

    const LegendaryCategory = [ LEGENDARY_pegasus, LEGENDARY_phoenix, LEGENDARY_taurus, LEGENDARY_whale, ];

    const AlienCategory = [ALIEN_MYTHIC_PHOENIX, ALIEN_MYTHIC_TAURUS,ALIEN_MYTHIC_PEGASUS,ALIEN_MYTHIC_WHALE];

    const DevilCategory = [ DEVIL_MYTHIC_PHOENIX, DEVIL_MYTHIC_TAURUS, DEVIL_MYTHIC_PEGASUS,DEVIL_MYTHIC_WHALE];
  
    const GodCategory = [GOD_MYTHIC_PHOENIX, GOD_MYTHIC_TAURUS, GOD_MYTHIC_PEGASUS,GOD_MYTHIC_WHALE ];

    const ImageCategory = this.props.title;

    switch(currentIndex){
      case 0:
        return CommonCategory;
      case 1: 
         return UniqueCategory;
      case 2:
        return RareCategory;
      case 3: 
        return EpicCategory;
      case 4: 
        return LegendaryCategory;
      case 5:
        return GodCategory;
      case 6: 
        return DevilCategory;
      case 7:
        return AlienCategory;
      default:
        return; 
    }


  }

  render() {
   const TestImage = this.findImage();
   console.log("Value of testImage",TestImage)
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
    console.log("approveFlag value", this.state.approveFlag);

    const mysterCheck = this.props.choosenOption === "Your Farms";

    console.log(
      "Value of choosenOption test check",
      this.props.choosenOption === "Your Farms"
    );

    const testTitle = this.props.title;
    let myArray = testTitle.split(" ");

    console.log("Value of myArray:::", myArray);

    return (
      // className={choosenOption ==="Your Farms"
      <div className="card_container">
        {/* cardImage, cardTitle, cardType, cardSubtitle,  */}
        {/* <Model/> */}

        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={mysterCheck ? Mystery : TestImage[0]}
              cardTitle={mysterCheck ? "Character" : "Phoenix"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Fire"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

            {mysterCheck && (
              <div className="col-sm-6 col-md-6 col-lg-12">
                <button
                  type="button"
                  className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                  onClick={async () => {
                    this.toggleModal();
                  }}
                >
                  Choose NFT
                </button>
              </div>
            )}
          </div>

          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={mysterCheck ? Mystery : TestImage[1]}
              cardTitle={mysterCheck ? "Character" : "Taurus"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Earth"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

            {mysterCheck && (
              <div className="col-sm-6 col-md-6 col-lg-12">
                <button
                type="button"
                className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                onClick={async () => {
                  this.toggleModal();
                }}
              >
                Choose NFT
              </button>
              </div>
            )}
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
              cardImage={mysterCheck ? Mystery : TestImage[2]}
              cardTitle={mysterCheck ? "Character" : "Pegasus"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Wind"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

            {mysterCheck && (
              <div className="col-sm-6 col-md-6 col-lg-12">
                <button
                type="button"
                className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                onClick={async () => {
                  this.toggleModal();
                }}
              >
                Choose NFT
              </button>
              </div>
            )}
          </div>

          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={mysterCheck ? Mystery : TestImage[3]}
              cardTitle={mysterCheck ? "Character" : "Whale"}
              cardType="common"
              cardSubtitle={mysterCheck ? "Mystery" : "Water"}
              backgroundColor={mysterCheck ? "Mystery" : ""}
            />

            {mysterCheck && (
              <div className="col-sm-6 col-md-6 col-lg-12">
                <button
                  type="button"
                  className="btn btn-outline-Choose NFT btn-block white__button mt-2"
                  onClick={async () => {
                    this.toggleModal();
                  }}
                >
                  Choose NFT
                </button>
              </div>
            )}
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
