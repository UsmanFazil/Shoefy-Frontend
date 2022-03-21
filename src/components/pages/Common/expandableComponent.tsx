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
import Unique from "./ExpandableImage/Unique.svg"
import Rare from "./ExpandableImage/Rare.svg"
import Epic from "./ExpandableImage/Epic.svg"
import Legendary from "./ExpandableImage/Legendary.svg"
import MythicGodsNFT from "./ExpandableImage/MythicGodsNFT.svg"
import MythicDevilsNFT from "./ExpandableImage/MythicDevilsNFT.svg"
import MythicAliensNFT from "./ExpandableImage/MythicAliensNFT"

import green_down from "../../../images/green_down.svg";

export type StakingProps = {};

// Call API
interface TableView {
  id: string;
  title: string;
  tokentoStake: string;
  LockupDuration: string;

}

interface Row {
  title:'string',
  imagePath:'string',
  stakeAmount:'string',
  lockupDuration:'string'
}

interface Profile {
  name: string;
  title: string;
}

const NewPerson: Profile = {
  name: "John Smith",
  title: "Software Engineer"
}

export type StakingState = {
  data: TableView[];
  RowData: Row[];
  shoefy?: Shoefy;
  looping?: boolean;

  // actual set values
  address?: string;
  balance?: number;
  stakedBalance?: number;
  stakedBalance2?: Array;
  pendingRewards?: number;
  pendingRewards2?: Array;
  claimedRewards?: number;
  claimedRewards2?: Array;
  lockedBalance2?: number;
  unstakeBlanace2?: Array;
  tokencaps2?: Array;

  apr?: number;
  allowance: number;
  allowance2: number;

  // values pending to be set
  ctPercentageStake?: number;
  ctValueStake?: number;
  ctValueStake2?: Array;
  ctPercentageUnstake?: number;
  ctValueUnstake?: number;
  ctValueUnstake2?: Array;
  pending?: boolean;

  approveFlag: boolean;
  totalclaim: number;
  unstakable: Array;
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
  private _timeout: any = null;

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

  componentWillUnmount() {
    if (!!this._timeout) {
      clearTimeout(this._timeout);
    }
    this.updateState({ shoefy: null, looping: false });
  }

  private async loop(): Promise<void> {
    const self = this;
    const cont = await self.updateOnce.call(self);

    if (cont) {
      this._timeout = setTimeout(async () => await self.loop.call(self), 1000);
    }
  }

  show_detail(index) {
    console.log("Value of index", index);
    if (this.state["flag" + index] == false)
      this.setState({ ["flag" + index]: true });
    //   this.setState({border:"1px solid #08f2f1"});
    else {
      this.setState({ ["flag" + index]: false });
      //   this.setState({border:""});
    }
  }

  add_border() {}

  render() {
    // Ask Salman
    let detail = ["0px", "0px", "0px", "0px", "", "","",""];
    console.log("Value of the detail", detail);
    for (let i = 0; i < 4; i++) {
      if (this.state["flag" + i] == false) {
        detail[i] = "";
        detail[4] = "0px 1px 1px 1px";
        detail[5] = "#08f2f1";
        detail[6] = "solid";
        detail[7] = "Show less"
      } else {
        detail[i] = "0px";
        detail[4] = "";
        detail[5] = "";
        detail[6] = "";
        detail[7] = "Show more"
      }
    }

    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
	  let test = t('ExpandingRow.CommonNFT.title');

    return (
      <div>
        <div className="content-wrapper">
          <div className="expanding-staking-container">
          <div className="container">

            <div className="row expandable_staking-body mt-5">

              <FadeInRightDiv className="expandable_your_staking container">
                <div
                  className="expandable_each_element"
                  style={{ transition: "0.3s" }}
                >
                  <div
                    className="expandable_each_up "
                    style={{
                      height: "120px",
                      border: detail[4],
                      borderBottom: detail[0],
                      borderStyle: detail[6],
                      borderColor: detail[5]
                    }}
                  >
                    <div className="expand_1">
                      <img src={Common_pop} width="35px" height="35px" />
                    </div>
                    <div className="expandable_nftdetail">
                      <div className="expand0">
                        <div className="e2_down"><span>Common sNFT</span></div>
                      </div>
                      <div className="expand1">
                        <div className="e2_up">Tokens to stake</div>
                        <div className="e2_down">2000 SHOE</div>
                      </div>

                      <div className="expand2">
                        <div className="e2_up">Lockup Duration</div>

                        <div className="e2_down">
                          {state.tokencaps2 ? state.tokencaps2[2] : "0"}
                          60 Days
                          {/* Test Here */}
						            {/* <h2>{ t('ExpandingRow.CommonNFT.Image_Path')}</h2> */}
                        </div>
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
                      border: detail[4],
                      borderTop: detail[0],
                      borderStyle: detail[6],
                      borderColor: detail[5],
                      overflow: "hidden",
                    }}
                  >
                    <div className="col-md-11 d-flex">
                      <div className="d-flex flex-column flex-fill ">
                        <CardContainerComponentMain />
                      </div>
                    </div>
                  </div>
                </div>


                {/* To remove */}
                {/* It is another row to show to salman */}
						    {/* <h2>{ t('ExpandingRow.CommonNFT.Image_Path')}</h2> */}

                <div
                  className="expandable_each_element"
                  style={{ transition: "0.3s" }}
                >
                  <div
                    className="expandable_each_up "
                    style={{
                      height: "120px",
                      border: detail[4],
                      borderBottom: detail[0],
                      borderStyle: detail[6],
                      borderColor: detail[5]
                    }}
                  >
                    <div className="expand_1">
                      <img src={Unique} width="35px" height="35px" />
                    </div>
                    <div className="expandable_nftdetail">
                      <div className="expand0">
                        <div className="e2_down"><span>Unique sNFT</span></div>
                      </div>
                      <div className="expand1">
                        <div className="e2_up">Tokens to stake</div>
                        <div className="e2_down">2000 SHOE</div>
                      </div>

                      <div className="expand2">
                        <div className="e2_up">Lockup Duration</div>

                        <div className="e2_down">
                          {state.tokencaps2 ? state.tokencaps2[2] : "0"}
                          60 Days

                        </div>
                      </div>
                    </div>
                    <div
                      className="expand3"
                      onClick={() => this.show_detail(4)}
                    >
                      <span>{detail[7]} </span>

                      <img src={green_down} width="14px" height="8px"></img>
                    </div>
                  </div>
                  <div
                    className="expand_down"
                    style={{
                      maxHeight: detail[3],
                      border: detail[4],
                      borderTop: detail[0],
                      borderStyle: detail[6],
                      borderColor: detail[5],
                      overflow: "hidden",
                    }}
                  >
                    <div className="col-md-11 d-flex">
                      <div className="d-flex flex-column flex-fill ">
                      <CardContainerComponentMain />

                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove till here */}
                
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
