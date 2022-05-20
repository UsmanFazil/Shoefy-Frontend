import * as React from "react";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../../shellInterfaces";

import { Shoefy } from "../../contracts/shoefy";

import { WithTranslation, withTranslation, TFunction } from "react-i18next";

import { fadeInLeft, fadeInRight, pulse } from "react-animations";
import styled, { keyframes } from "styled-components";

import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import CardContainerComponentMain from "./CardContainer";

import "./expandableComponent.css";
import { Footer } from "../footer";

import "../../shellNav.css";
import "../../shellNav.icons.css";

import Common_pop from "./ExpandableImage/Common.svg";

// Dynamically change
import Unique from "./ExpandableImage/Unique.svg";
import Rare from "./ExpandableImage/Rare.svg";
import Epic from "./ExpandableImage/Epic.svg";
import Legendary from "./ExpandableImage/Legendary.svg";
import MythicGodsNFT from "./ExpandableImage/MythicGodsNFT.svg";
import MythicDevilsNFT from "./ExpandableImage/MythicDevilsNFT.svg";
import MythicAliensNFT from "./ExpandableImage/MythicAliensNFT.svg";

import green_down from "../../../images/green_down.svg";
import { RowData } from "../nftFarmingComponent";

const Image_Data = {
  Common_pop: Common_pop,
  Unique: Unique,
  Rare: Rare,
  Epic: Epic,
  Legendary: Legendary,
  MythicGodsNFT: MythicGodsNFT,
  MythicDevilsNFT: MythicDevilsNFT,
  MythicAliensNFT: MythicAliensNFT,
};

export type StakingProps = {
  choosenOption: string;
  data: RowData;
  currentTab?: string;
  index?: number;
  pending?: boolean;
};

// Call API
interface TableView {
  id: string;
  title: string;
  tokentoStake: string;
  LockupDuration: string;
}

interface Row {
  title: "string";
  imagePath: "string";
  stakeAmount: "string";
  lockupDuration: "string";
}

export type StakingState = {
  data: TableView[];
  RowData: Row[];
};

const FadeInLeftAnimation = keyframes`${fadeInLeft}`;
const FadeInLeftDiv = styled.div`
  animation: ease-out 0.8s ${FadeInLeftAnimation};
`;
const FadeInRightAnimation = keyframes`${fadeInRight}`;
const FadeInRightDiv = styled.div`
  animation: ease-out 0.8s ${FadeInRightAnimation};
`;
const PulseAnimation = keyframes`${pulse}`;
const PulseDiv = styled.div`
  animation: infinite 5s ${PulseAnimation};
`;

class expandableComponent extends BaseComponent<
  StakingProps & WithTranslation,
  StakingState
> {
  constructor(props: StakingProps & WithTranslation) {
    super(props);

    this.state = {
      //   approveFlag: false,
      //   approveFlag1: false,
    };
  }

  handleError(error) {
    ShellErrorHandler.handle(error);
  }

  componentWillUnmount() {}

  show_detail(index) {
    if (this.state["flag" + index] === false)
      this.setState({ ["flag" + index]: true });
    //   this.setState({border:"1px solid #08f2f1"});
    else {
      this.setState({ ["flag" + index]: false });
      //   this.setState({border:""});
    }
  }

  find_type(title) {
    const keyWord = [
      "Common",
      "Unique",
      "Rare",
      "Epic",
      "Legend",
      "Devil",
      "God",
      "Alien",
    ];
    let nftType;

    for (let i = 0; i <= keyWord.length - 1; i++) {
      const val = title.indexOf(keyWord[i]);
      if (val != -1) {
        nftType = keyWord[i];
        break;
      }
    }
    return nftType;
  }

  add_border() {}

  render() {
    let detail = ["0px", "0px", "0px", "0px", "", "", "", ""];

    for (let i = 0; i < 4; i++) {
      if (this.state["flag" + i] === false) {
        detail[i] = "";
        detail[4] = "0px 1px 1px 1px";
        detail[5] = "#08f2f1";
        detail[6] = "solid";
        detail[7] = "Show less";
      } else {
        detail[i] = "0px";
        detail[4] = "";
        detail[5] = "";
        detail[6] = "";
        detail[7] = "Show more";
      }
    }

    const { title, Image_Path, stakeAmount, lockUpDuration } = this.props.data;
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
    let test = t(title);

    return (
      <div>
        <div className="content-wrapper">
          <div className="expanding-staking-container">
            <div className="container">
              <div className="row expandable_staking-body">
                <FadeInRightDiv className="your_staking remove_top">
                  <div
                    className="each_element remove_bottom"
                    style={{ transition: "0.3s" }}
                  >
                    <div
                      className="expandable_each_up"
                      style={{
                        height: "120px",
                        border: detail[4],
                        borderStyle: detail[6],
                        borderColor: detail[5],
                      }}
                    >
                      <div className="expand_1">
                        <img
                          src={Image_Data[Image_Path]}
                          width="35px"
                          height="35px"
                        />
                      </div>
                      <div className="expandable_nftdetail">
                        <div className="expand0">
                          <div className="e2_down">
                            <span>{title}</span>
                          </div>
                        </div>
                        <div className="expand1">
                          <div className="e2_up">Tokens to stake</div>
                          <div className="e2_down">{stakeAmount}</div>
                        </div>

                        <div className="expand2">
                          <div className="e2_up">Lockup Duration</div>
                          <div className="e2_down">{lockUpDuration}</div>
                        </div>
                      </div>
                      <div
                        className="expand3"
                        onClick={() => this.show_detail(3)}
                      >
                        <span>{detail[7]} </span>

                        <img src={green_down} width="14px" height="8px"></img>
                      </div>
                    </div>
                    <div
                      className="expand_down"
                      style={{
                        maxHeight: detail[3],
                        borderTop: detail[0],
                        borderStyle: detail[6],
                        borderColor: detail[5],
                        overflow: "hidden",
                      }}
                    >
                      <div className="col-md-12 d-flex">
                        <div className="d-flex flex-column flex-fill ">
                          <CardContainerComponentMain
                            index={this.props.index}
                            nftType={this.find_type(title)}
                            pending={this.props.pending}
                            choosenOption={this.props.choosenOption}
                            title={title}
                            currentTab={this.props.currentTab}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInRightDiv>
              </div>
            </div>
            <NotificationContainer />
          </div>
        </div>

        <div className="part_f">
          <Footer />
        </div>
      </div>
    );
  }
}

// ExpandableComponentWithTranlation
const ExpandableComponentWithTranlation =
  withTranslation()(expandableComponent);

// ExpandableComponentMain
const ExpandableComponentMain = compose()(ExpandableComponentWithTranlation);
// ExpandableComponentWithTranlation

export default ExpandableComponentMain;
