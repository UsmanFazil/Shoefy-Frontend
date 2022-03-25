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
import MythicAliensNFT from "./ExpandableImage/MythicAliensNFT.svg"

import green_down from "../../../images/green_down.svg";
import { RowData } from "../nftFarmingComponent";

const Image_Data = {"Common_pop":Common_pop,"Unique":Unique,"Rare":Rare,"Epic":Epic,"Legendary":Legendary,"MythicGodsNFT":MythicGodsNFT,"MythicDevilsNFT":MythicDevilsNFT,"MythicAliensNFT":MythicAliensNFT}

export type StakingProps = {
  choosenOption:string;
  data:RowData
};

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

    console.log("Value of props in expandable component",props)
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
    if (this.state["flag" + index] === false)
      this.setState({ ["flag" + index]: true });
    //   this.setState({border:"1px solid #08f2f1"});
    else {
      this.setState({ ["flag" + index]: false });
      //   this.setState({border:""});
    }
  }

  add_border() {}

  render() {
  
    let detail = ["0px", "0px", "0px", "0px", "", "","",""];
    console.log("Value of the detail", detail);
    // row =>{css}
    // height: "120px",
    // border: detail[4],
    // borderBottom: detail[0],
    // borderStyle: detail[6],
    // borderColor: detail[5]

    for (let i = 0; i < 4; i++) {
      if (this.state["flag" + i] === false) {
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
    
    const {  title, Image_Path, stakeAmount,lockUpDuration} = this.props.data
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
	  let test = t(title);

    return (
      <div>
        <div className="content-wrapper">
          <div className="expanding-staking-container">
          <div className="container">

            <div className="row expandable_staking-body">

            <FadeInRightDiv className="your_staking">
									<div className="each_element" style={{ transition: '0.3s' }}>
										<div className="each_up" style={{ height: '120px' }}>
											<div className="expand_1">
												<img src={Image_Data[Image_Path]} width="35px" height="35px" />
											</div>
											<div className="nftdetail">
												<div className="stake2" >
													<div className="s2_up" >{title} </div>
													<div className="s2_down" >Static Time (60days)</div>
												</div>
												<div className="stake1">
													<div className="s2_up">{stakeAmount}</div>
													<div className="s2_down">2000 SHOE</div>
												</div>

												<div className="stake2">
													<div className="s2_up">{lockUpDuration}</div>
													<div className="s2_down">{state.tokencaps2 ? state.tokencaps2[1] : "60 days"}</div>
												</div>
											</div>
											<div className="stake3" onClick={() => this.show_detail(2)}>
												Detail<img src={green_down} width="14px" height="8px"></img>
											</div>
										</div>
										<div className="each_down" style={{ maxHeight: detail[2], overflow: 'hidden' }}>
											<div className="col-md-11 d-flex">
												<div className="shadow d-flex flex-column flex-fill gradient-card ">
													<div style={{ margin: "-20px" }}>
                          {/* Start */}
                          <CardContainerComponentMain choosenOption={this.props.choosenOption} />
                            {/* End */}
													</div>
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
