import * as React from "react";
import * as numeral from "numeral";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../../shellInterfaces";
import { Wallet } from "../../wallet";
import { withWallet } from "../../walletContext";

import { ShoefyFarming } from "../../contracts/shoeFyFarming";
import { fadeInLeft, fadeInRight, pulse } from "react-animations";
import styled, { keyframes } from "styled-components";
import AnimatedNumber from "animated-number-react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import {
  WithTranslation,
  withTranslation,
  TFunction,
  Trans,
} from "react-i18next";
import "react-notifications/lib/notifications.css";

import "../../shellNav.css";
import "../../shellNav.icons.css";

// import Model from "./Model";
import { Modal } from "./Modal/Modal.component";
import Model from "./Modal//Model";
import { ViewNftcomponent } from "./Modal/ViewNftcomponent";

import Web3 from "web3";

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

import NoDataAvalible from "./ExpandableImage/NoDataAvalible.svg";

import Card from "./Card";
import "./CardContainer.css";

export type StakingProps = {
  choosenOption: string;
  currentTab?: string;
  title?: string;
  index?: number;
  nftType?: string;
  pending: boolean;
  stakeAmount?: any;
  CardData?: any;
  userData?: any;
  farmingData?:any;
};

export type StakingState = {
  // ShoefyFarming
  ShoefyFarming?: ShoefyFarming;
  wallet?: Wallet;
  looping?: boolean;

  // actual set values
  address?: string;
  balance?: number;
  harvestAmount?: number;

  // No need
  stakedBalance?: number;
  stakedBalance2?: Array;
  allowance: number;
  allowance2: number;
  isModelOpen: boolean;
  choosenOpenModel: boolean;
  FarmingArray: any;

  // values pending to be set
  ctPercentageStake?: number;
  ctValueStake?: number;
  ctValueStake2?: Array;
  userData?: Array;
  pending?: boolean;
  approveFlag: boolean;
  amount?: any;
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

class CardContainer extends BaseComponent<
  StakingProps & WithTranslation,
  StakingState
> {
  private _timeout: any = null;
  private _selectedNFT: any = [];
  private selectedItems = [];

  constructor(props: StakingProps & WithTranslation) {
    super(props);

    this.handleInputStake = this.handleInputStake.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      approveFlag: false,
      activeTab: " ",
      isModelOpen: false,
      choosenOpenModel: false,
      harvestAmount: 0,
      userData: [],
      ctValueStake2:0,
      amount:'',
      choosenOption:''
      // farmingData:[]
    };
  }

  // userData
  toggleModal = () => {
    this.setState({ isModelOpen: !this.state.isModelOpen });
  };

  toggleModal2 = () => {
    this.setState({ choosenOpenModel: !this.state.choosenOpenModel });
  };

  selectNFT = (index, data) => {
    try {
      // let test = this._selectedNFT.splice(index,index,{
      //   farmId: data.farmId,
      //   assignedNFT: data.assignedNFT,
      //   mintStatus: data.mintStatus,
      // });
      // console.log("Value of Troon:::removed", test);
      // console.log("Value of Troon:::removednot", this.selectedItems);

      // console.log("Value of Troon", data,index);
      // const { farmId, assignedNFT, mintStatus } = data;

      // if selectedItems == true then remove the index from array 
      // else add
      // if undefinde then add and false add 
      this._selectedNFT.push({
        farmId: data.farmId,
        assignedNFT: data.assignedNFT,
        mintStatus: data.mintStatus,
      });
      this.setState({ harvestAmount: this._selectedNFT.length });
      this.selectedItems[index] = !this.selectedItems[index];
      // check for false and true
      if(this.selectedItems[index] === false || this.selectedItems[index] === undefined){
        // this._selectedNFT.push({
        //   farmId: data.farmId,
        //   assignedNFT: data.assignedNFT,
        //   mintStatus: data.mintStatus,
        // });
        // this.setState({ harvestAmount: this._selectedNFT.length });
        // this.selectedItems[index] = !this.selectedItems[index];
      }else{
        // this._selectedNFT.splice(index,1);
        // this.setState({ harvestAmount: this._selectedNFT.length });
        // this.selectedItems[index] = !this.selectedItems[index];
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  setStakeValue(step, value) {
    const r = this.readState().ShoefyFarming;
    if (!r) return;

    console.log("Value of setStakeValue",step,value);

    const t = r.balance;
    console.log("Value of setStakeValue t",t);

    const v = value;

    console.log("Value of setStakeValue",v);

    const temp = this.readState().ctValueStake2;

    console.log("Value of setStakeValue",temp);

    temp[step] = v;

    console.log("Value of setStakeValue",temp[step],value);

    this.updateState({
      ctPercentageStake: Math.floor((100 * v) / t),
      ctValueStake2: temp,
    });

    console.log("value of tempState",temp[0])
    this.setState({ amount: temp });

    console.log(
      this.readState().ctValueStake2[0],
      this.readState().ctValueStake2[1]
    );

  }

  async confirmApprove(): Promise<void> {
    let web3 = new Web3(window.ethereum);

    const value = this.props.stakeAmount;
    let newValue = value.split(" ")[0] * this.state.amount;

    const testvalue = newValue.toString();

    let approve = web3.utils.toWei(testvalue, "ether");

    try {
      const state = this.readState();
      this.updateState({ pending: true });
      const flag = await state.ShoefyFarming.approve(approve);

      this.updateState({ pending: false });
      this.setState({ approveFlag: !this.state.approveFlag });
      
      this.updateOnce(true).then();
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  async confirmStake(currentTab): Promise<void> {
    const state = this.readState();
    const byteValue = this.findImage("byte");

    if (currentTab === "general") {
      // Stake General NFT
      try {
        const state = this.readState();
        this.updateState({ pending: true });

      
        if (state.amount > 0) {

          if(state.amount > 10){
            NotificationManager.warning("One user can farm max. 10 common sNFTs");
            this.updateState({ pending: false });
            this.setState({amount:0})
            return
          }
  
          await state.ShoefyFarming.stakefarmGeneral(state.amount, byteValue);

          document.getElementById("modalswitch2").click();
        } else {
          NotificationManager.warning("Can't stake a negative amount.");
          return;
        }

        this.updateState({ pending: false });
        this.setState({amount:0})
        this.updateOnce(true).then();
      } catch (e) {
        this.updateState({ pending: false });
        this.handleError(e);
      }
    } else {
      // Stake Rapid NFT
      try {
        const state = this.readState();
        this.updateState({ pending: true });

        if (state.amount >= 0) {

          if(state.amount > 10){
            NotificationManager.warning("One user can farm max. 10 common sNFTs");
            this.updateState({ pending: false });
            this.setState({amount:0})
            return
          }

          await state.ShoefyFarming.stakefarmRapid(state.amount, byteValue);
          document.getElementById("modalswitch2").click();
          
        } else {
          NotificationManager.warning("Can't stake a negative amount.");
          return;
        }

        this.updateState({ pending: false });
        this.setState({amount:0})
        this.updateOnce(true).then();
      } catch (e) {
        this.updateState({ pending: false });
        this.handleError(e);
      }
    }
  }

  async confirmHarvest(currentTab): Promise<void> {
    // document.getElementById("modalswitch3").click();

    const state = this.readState();
    const byteValue = this.findImage("byte");

    this.toggleModal();
    // this.setState({harvestAmount:0})
    // this._selectedNFT = []

    if (currentTab === "general") {
      // Harvest General NFT
      // try {
      //   const state = this.readState();
      //   this.updateState({ pending: true });
      //   if (state.ctValueStake >= 0) {
      //     await state.ShoefyFarming.stakefarmGeneral(
      //       state.ctValueStake,
      //       byteValue
      //     );
      //     document.getElementById("modalswitch2").click();
      //   } else {
      //     NotificationManager.warning("Can't stake a negative amount.");
      //     return;
      //   }
      //   this.updateState({ pending: false });
      //   this.updateOnce(true).then();
      // } catch (e) {
      //   this.updateState({ pending: false });
      //   this.handleError(e);
      // }
    } else {
      // Harvest Rapid NFT
      // try {
      //   const state = this.readState();
      //   this.updateState({ pending: true });
      //   if (state.ctValueStake >= 0) {
      //     await state.ShoefyFarming.stakefarmRapid(
      //       state.ctValueStake,
      //       byteValue
      //     );
      //     document.getElementById("modalswitch2").click();
      //   } else {
      //     NotificationManager.warning("Can't stake a negative amount.");
      //     return;
      //   }
      //   this.updateState({ pending: false });
      //   this.updateOnce(true).then();
      // } catch (e) {
      //   this.updateState({ pending: false });
      //   this.handleError(e);
      // }
    }
  }


  private async updateOnce(resetCt?: boolean): Promise<boolean> {
    const shoefyFarming = this.readState().ShoefyFarming;
    const value = this.findImage();

    if (!!shoefyFarming) {
      try {
        // await shoefyFarming.refresh(this.props.currentTab,this.props.index);

        if (resetCt) {
          this.updateState({
            ctPercentageStake: 0,
            ctValueStake: 0,
            ctValueStake2: [],
            // userData: shoefyFarming.userNFTs,
            address: this.props.wallet._address,
            balance: shoefyFarming.balance,
            stakedBalance: shoefyFarming.stakedBalance,
            stakedBalance2: shoefyFarming.stakedBalance2,
            allowance: shoefyFarming.allowance,
            allowance2: shoefyFarming.allowance2,
          });
        } else {
          this.updateState({
            address: this.props.wallet._address,
            balance: shoefyFarming.balance,
            // userData: shoefyFarming.userNFTs,
            stakedBalance: shoefyFarming.stakedBalance,
            stakedBalance2: shoefyFarming.stakedBalance2,
            allowance: shoefyFarming.allowance,
            allowance2: shoefyFarming.allowance2,
          });
        }
      } catch (e) {
        console.warn("Unable to update staking status", e);
      }
    } else {
      return false;
    }
    return true;
  }

  handleInputStake(type, event) {
    this.setState({amount:event.target.value})
    console.log("Value of amount",this.state.amount)

		// let temp = event.target.value.toString();

    // console.log("value of temp:::",temp)
		// if (temp[0] === '0')
		// 	event.target.value = temp.slice(1, temp.length);
		// this.setStakeValue(type, event.target.value);
	}

  findImage(contractType?: string) {
    const currentIndex = this.props.index;

    const categories = [
      "0x3955032f1b4fd3485213d1c8a0e4ced5c0b5d4e9ffa466e04ca90c624d38a252", //common
      "0x7876765697b67ef92ea049557e63bf2e2e65bbccace3318b91b901e293c1946d", //unique
      "0x2cf735e2c7740b1996c475c19261a0b7dc86863c4718b4dfa4b90956a5ece4ff", //rare
      "0x04f4f20a2d65eb0f15d7fb252c9027859568c706ff77f8b4471a76adbed564c4", //epic
      "0x5b62d0d589d39df21aaf5ecafa555f3f0c1bfcfe9655dbed3f07da10f5e39875", // legendary
      "0x26d053d43cd0108003f60e6e90adfb10b90203969f78f4c831e6f61a20da5ff5", //mythic-god
      "0x44e32297331fe14111706e1cb9bd9190b17b12743186529932199f3fd6d31352", //mythic-devil
      "0xc997682c8ea1bbd29746fc05468bbcae2ae8133425ce5f23be32e09774956e82", //mythic-alien
    ];

    const CommonCategory = [
      CommonPhoenix,
      CommonTaurus,
      CommonPegasus,
      CommonWhale,
    ];

    const UniqueCategory = [
      UniquePhoenix,
      UniqueTaurus,
      UniquePegasus,
      UniqueWhell,
    ];

    const RareCategory = [RarePhoenix, RareTaurus, RarePegasus, Rarehale];

    const EpicCategory = [EPIC_Phoenix, EPIC_Taurus, EPIC_Pegasus, EPIC_Whale];

    const LegendaryCategory = [
      LEGENDARY_phoenix,
      LEGENDARY_taurus,
      LEGENDARY_pegasus,
      LEGENDARY_whale,
    ];

    const AlienCategory = [
      ALIEN_MYTHIC_PHOENIX,
      ALIEN_MYTHIC_TAURUS,
      ALIEN_MYTHIC_PEGASUS,
      ALIEN_MYTHIC_WHALE,
    ];

    const DevilCategory = [
      DEVIL_MYTHIC_PHOENIX,
      DEVIL_MYTHIC_TAURUS,
      DEVIL_MYTHIC_PEGASUS,
      DEVIL_MYTHIC_WHALE,
    ];

    const GodCategory = [
      GOD_MYTHIC_PHOENIX,
      GOD_MYTHIC_TAURUS,
      GOD_MYTHIC_PEGASUS,
      GOD_MYTHIC_WHALE,
    ];

    const ImageCategory = this.props.title;

    switch (currentIndex) {
      case 0:
        if (contractType) {
          return categories[currentIndex]; // return common byte
        }
        return CommonCategory;
      case 1:
        if (contractType) {
          return categories[currentIndex]; //  return unique byte
        }
        return UniqueCategory;
      case 2:
        if (contractType) {
          return categories[currentIndex]; //  return rare byte
        }
        return RareCategory;
      case 3:
        if (contractType) {
          return categories[currentIndex]; //  return epic byte
        }
        return EpicCategory;
      case 4:
        if (contractType) {
          return categories[currentIndex]; //  return legendary byte
        }
        return LegendaryCategory;
      case 5:
        if (contractType) {
          return categories[currentIndex]; //  return god byte
        }
        return GodCategory;
      case 6:
        if (contractType) {
          return categories[currentIndex]; //  return devil byte
        }
        return DevilCategory;
      case 7:
        if (contractType) {
          return categories[currentIndex]; //  return alien byte
        }
        return AlienCategory;
      default:
        return;
    }
  }

  changeBackground(index: number) {
    this.nftData[index].selected = !this.nftData[index].selected;
  }

  handleError(error) {
    ShellErrorHandler.handle(error);
  }
  
  shouldComponentUpdate(nextProps: Readonly<StakingProps & WithTranslation<"translation">>, nextState: Readonly<StakingState>, nextContext: any): boolean {
    if(this.props.farmingData.length != nextProps.farmingData.length){
      console.log("nftFarming MainProps CardContainer",this.props.farmingData)
      return true
    }else{
      return false
    }
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // No longer need to cast to any - hooray for react!
    this.setState({amount: e.target.value});
    console.log("Value of amount",this.state.amount)
  }

  checkClassName = (data?: any) => {
    const { farmId } = data;
    let value = false;
    for (let i = 0; i < this._selectedNFT; i++) {
      if (farmId === data[i].farmId) {
        value = true;
      }
    }
    return value;
  };

  render() {
    const TestImage = this.findImage();
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
    const mysterCheck = this.props.choosenOption === "Your Farms";

    const array = [{ image: "", type: "", lockperiod: "" }];
    const nftData = this.props.farmingData?.message?.result || [];

    // if (nftData.length > 0) {
    // }

    const lockPeriod = true;

    return (
      <div>
        <div
          className={
            mysterCheck && nftData.length <= 0 ? " " : "card_container"
          }
        >

          {this.props.choosenOption}
          {/* General Farming Pools Option */}
          {(this.props.choosenOption === "General Farming Pools" || this.props.choosenOption === 'Rapid Farming Pools' ) && (
            <div>
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <Card
                    cardImage={TestImage[0]}
                    cardTitle={"Phoenix"}
                    cardType={this.props.nftType}
                    cardSubtitle="Fire"
                    backgroundColor=""
                    ChoosenOption={this.props.choosenOption}
                  />
                </div>

                <div className="col-sm-12 col-md-6 col-lg-3">
                  <Card
                    cardImage={TestImage[1]}
                    cardTitle="Taurus"
                    cardType={this.props.nftType}
                    cardSubtitle="Earth"
                    backgroundColor=""
                    ChoosenOption={this.props.choosenOption}
                  />
                </div>

                {/* Stake and Approve */}
                <div className="col-sm-12 col-md-12 col-lg-6 mt-5">
                  <div className="Main__Container">
                    <form className="Center__Container">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label className="form-label right-label">
                          Stake in multiples of {this.props.stakeAmount}
                        </label>
                      </div>
                      <div className="maxValue">
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          onChange={(event) => this.handleInputStake(0, event)}
                          value={this.state.amount}
                          // defaultValue={0}
                          // value={state.amount || 0}
                          // value={state.ctValueStake2}
                        />
                      </div>

                      <div className="d-flex justify-content-center button-row margin_top">
                        {!state.approveFlag && (
                          <button
                            className="btn btn-md link-dark"
                            style={{
                              width: "100%",
                              backgroundColor: "#CF3279",
                              margin: 0,
                              color: "white",
                            }}
                            type="button"
                            disabled={state.pending}
                            onClick={async () => this.confirmApprove()}
                          >
                            {/* {!this.state.approveFlag
                              ? t("staking.Farming.ApproveTitle")
                              : t("staking.Farming.StakeTitle")
                              } */}

                            {t("staking.Farming.ApproveTitle")}
                          </button>
                        )}
                        {state.approveFlag && (
                          <button
                            className="btn btn-md link-dark"
                            style={{
                              width: "100%",
                              backgroundColor: "#CF3279",
                              margin: 0,
                              color: "white",
                            }}
                            type="button"
                            disabled={state.pending}
                            onClick={async () =>
                              this.confirmStake(this.props.currentTab)
                            }
                          >
                            {t("staking.Farming.StakeTitle")}
                          </button>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label className="golden-label">
                          One user can farm max. 10 common sNFTs
                        </label>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <a
                          onClick={() =>
                            this.setState({
                              approveFlag: !this.state.approveFlag,
                            })
                          }
                        >
                          <label className="golden-label">
                            Already approved stake tokens
                          </label>
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Second Row */}

              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-3">
                  <Card
                    cardImage={TestImage[2]}
                    cardTitle="Pegasus"
                    cardType={this.props.nftType}
                    cardSubtitle="Wind"
                    backgroundColor=""
                    ChoosenOption={this.props.choosenOption}
                  />
                </div>

                <div className="col-sm-12 col-md-6 col-lg-3">
                  <Card
                    cardImage={TestImage[3]}
                    cardTitle="Whale"
                    cardType={this.props.nftType}
                    cardSubtitle="Water"
                    backgroundColor=""
                    ChoosenOption={this.props.choosenOption}
                  />
                </div>

                {/* Stake and Approve */}
                <div className="col-sm-0 col-md-2 col-lg-3"></div>

                <div className="col-sm-0 col-md-2 col-lg-3">
                  {/* <Model/> */}
                </div>
              </div>
            </div>
          )}

    {/* // 'Your Farms' 
    // 'Your Rapid Farms' */} 

          {(this.props.choosenOption === "Your Farms" || this.props.choosenOption  === 'Your Rapid Farms') && (
            <div>
              {nftData.length > 0 ? (
                <div>
                  <div className="row">
                    {nftData.slice(0, 2).map((data, index) => {
                      return (
                        <div
                          // className="col-sm-12 col-md-6 col-lg-3"
                          className={nftData.length ==1? "col-sm-12 col-md-6 col-lg-6":"col-sm-12 col-md-6 col-lg-3"}
                          key={index}
                        >
                          {/* {nftData[index]} */}
                          <Card
                            cardImage={
                              !lockPeriod
                                ? Mystery
                                : nftData[index]?.image || Mystery
                            }
                            cardTitle={nftData[index].currentLayer == 0 ? "Character" : "Phoenix"}
                            cardType={this.props.nftType}
                            cardSubtitle={nftData[index].currentLayer == 0? "Mystery" : "Fire"}
                            backgroundColor={nftData[index].currentLayer == 0 ? "Mystery" : ""}
                            ChoosenOption={this.props.choosenOption}
                          />
                          {/* image, farmId, assignedNFT, mintStatus if mint is Complete */}
                          {/* className="btn btn-outline-Choose NFT btn-block white__button mt-2" */}
                          {/* {nftData[index]?.mintStatus === "Completed" && (
                          className={nftData.length ==1? "className="col-sm-6 col-md-6 col-lg-6":"className="col-sm-6 col-md-6 col-lg-12"} */}

                            <div className={nftData.length ==1? "col-sm-6 col-md-6 col-lg-6":"col-sm-6 col-md-6 col-lg-12"}>
                              {nftData[index]?.mintStatus === "Completed" &&(<button
                                type="button"
                                // this.changeBackground(index)?
                                className={
                                  this.selectedItems[index]
                                    ? "btn btn-outline-Choose NFT btn-block skyblue__button mt-2"
                                    : "btn btn-outline-Choose NFT btn-block white__button mt-2"
                                }
                                // className={`${this.changeBackground(index)? "":""}` }
                                onClick={async () => {
                                  this.selectNFT(index, data);
                                }}
                              >
                                Choose NFT
                              </button>)}
                            </div>
                          
                        </div>
                      );
                    })}

                    {/*Harvest remains constant */}
                    <div className="col-sm-12 col-md-12 col-lg-6 mt-5">
                      <div className="Main__Container">
                        <form className="Center__Container">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <label className="form-label right-label">
                              Harvest your farmed sNFTs
                            </label>
                          </div>
                          <div className="maxValue">
                            <input
                              type="number"
                              className="form-control form-control-lg"
                              readOnly
                              value={this._selectedNFT.length}
                            />
                          </div>
                          {/* {this._selectedNFT.length} */}
                          {/* {this.state.harvestAmount} */}
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
                              disabled={state.pending}
                              onClick={async () =>
                                this.confirmHarvest(this.props.currentTab)
                              }
                            >
                              Harvest
                            </button>

                            {/* <button
                              className="btn btn-md link-dark"
                              style={{
                                width: "100%",
                                backgroundColor: "#CF3279",
                                margin: 0,
                                color: "white",
                              }}
                              type="button"
                              disabled={state.pending}
                              onClick={async () =>
                                this.toggleModal2()
                              }
                            >
                              Open
                            </button> */}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Second Row */}
                  {nftData.length > 2 && (
                    <div className="row">
                      {nftData.slice(2, 6).map((data, index) => {
                        return (
                          <div
                            className={nftData.length ==1? "col-sm-12 col-md-6 col-lg-6":"col-sm-12 col-md-6 col-lg-3"}
                            key={index}
                          >
                            {/* {nftData[index + 2]} */}
                            <Card
                              cardImage={
                                nftData[index+2].currentLayer == 0 ? Mystery : [TestImage[index]]
                              }
                              cardTitle={nftData[index+2].currentLayer == 0 ? "Character" : "Phoenix"}
                              cardType={this.props.nftType}
                              cardSubtitle={nftData[index+2].currentLayer == 0 ? "Mystery" : "Fire"}
                              backgroundColor={nftData[index+2].currentLayer == 0 ? "Mystery" : ""}
                              ChoosenOption={this.props.choosenOption}
                            />

                            {nftData[index + 2]?.mintStatus === "Completed" && (
                            <div className={nftData.length ==1? "col-sm-6 col-md-6 col-lg-6":"col-sm-6 col-md-6 col-lg-12"}>

                                <button
                                  type="button"
                                  className={
                                    this.selectedItems[index + 2]
                                      ? "btn btn-outline-Choose NFT btn-block skyblue__button mt-2"
                                      : "btn btn-outline-Choose NFT btn-block white__button mt-2"
                                  }
                                  onClick={async () => {
                                    this.selectNFT(index + 2, data);
                                  }}
                                >
                                  Choose NFT
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Third Row */}
                  {nftData.length > 6 && (
                    <div className="row">
                      {nftData.slice(6, 10).map((data, index) => {
                        return (
                          <div
                          className={nftData.length ==1? "col-sm-12 col-md-6 col-lg-6":"col-sm-12 col-md-6 col-lg-3"}
                            key={index}
                          >
                            {/* {nftData[index + 6]} */}

                            <Card
                              cardImage={
                                nftData[index+6].currentLayer == 0? Mystery : [TestImage[index]]
                              }
                              cardTitle={nftData[index+6].currentLayer == 0 ? "Character" : "Phoenix"}
                              cardType={this.props.nftType}
                              cardSubtitle={nftData[index+6].currentLayer == 0 ? "Mystery" : "Fire"}
                              backgroundColor={nftData[index+2].currentLayer == 0 ? "Mystery" : ""}
                              ChoosenOption={this.props.choosenOption}
                            />

                            {nftData[index + 6]?.mintStatus === "Completed" && (
                            <div className={nftData.length ==1? "col-sm-6 col-md-6 col-lg-6":"col-sm-6 col-md-6 col-lg-12"}>

                                <button
                                  type="button"
                                  className={
                                    this.selectedItems[index + 6]
                                      ? "btn btn-outline-Choose NFT btn-block skyblue__button mt-2"
                                      : "btn btn-outline-Choose NFT btn-block white__button mt-2"
                                  }
                                  onClick={async () => {
                                    this.selectNFT(index + 6, data);
                                  }}
                                >
                                  Choose NFT
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <img
                    src={NoDataAvalible}
                    alt="Device"
                    className="noDataAvalible"
                  />
                    {/* <button
                              className="btn btn-md link-dark"
                              style={{
                                width: "100%",
                                backgroundColor: "#CF3279",
                                margin: 0,
                                color: "white",
                              }}
                              type="button"
                              disabled={state.pending}
                              onClick={async () =>
                                this.toggleModal2()
                              }
                            >
                              Open
                            </button> */}
                </div>
              )}
            </div>
          )}

          <Modal
            title={`You have successfully harvested ${this.state.harvestAmount} number(s) of common sNFTs`}
            isOpen={this.state.isModelOpen}
            onClose={this.toggleModal}
          >
            <p>Your sNFTs have been sent to your wallet</p>
          </Modal>

          <ViewNftcomponent
            title={`You have successfully harvested ${this.state.harvestAmount} number(s) of common sNFTs`}
            isOpen={this.state.choosenOpenModel}
            onClose={this.toggleModal2}
          />
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

// ExpandableComponentWithTranlation
const CardContainerComponentWithTranlation = withTranslation()(CardContainer);

// ExpandableComponentMain
const CardContainerComponentMain = compose(withWallet)(
  CardContainerComponentWithTranlation
);
// ExpandableComponentWithTranlation

export default CardContainerComponentMain;
