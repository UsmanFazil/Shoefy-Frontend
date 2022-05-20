import * as React from "react";
import * as numeral from 'numeral';
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../../shellInterfaces";
import { Wallet } from '../../wallet';
import { withWallet } from '../../walletContext';

import { ShoefyFarming } from '../../contracts/shoeFyFarming';
import { fadeInLeft, fadeInRight, pulse } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import AnimatedNumber from 'animated-number-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import {
  WithTranslation,
  withTranslation,
  TFunction,
  Trans,
} from "react-i18next";
import "react-notifications/lib/notifications.css";

import '../../shellNav.css';
import '../../shellNav.icons.css';

// import Model from "./Model";
import { Modal } from "./Modal/Modal.component";
import Model from "./Modal//Model";
import { ViewNftcomponent } from "./Modal/ViewNftcomponent";

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

import NoDataAvalible from "./ExpandableImage/NoDataAvalible.svg"

import Card from "./Card";
import "./CardContainer.css";

export type StakingProps = {
  choosenOption: string;
  currentTab?: string;
	// wallet?: Wallet,
  title?: string;
  index?:number;
  nftType?:string;
  pending:boolean
};

export type StakingState = {
  // ShoefyFarming
  ShoefyFarming?:ShoefyFarming;
	wallet?: Wallet;
	looping?: boolean;

  // actual set values
	address?: string,
	balance?: number,

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
    pending?: boolean;
    approveFlag: boolean;
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

  constructor(props: StakingProps & WithTranslation) {
    super(props);

		this.handleInputStake = this.handleInputStake.bind(this);
    this.connectWallet = this.connectWallet.bind(this);

    this.state = {
      approveFlag: false,
      activeTab: " ",
      isModelOpen: false,
      choosenOpenModel: false,
    };
  }

  toggleModal = () => {
    this.setState({ isModelOpen: !this.state.isModelOpen });
  };

  toggleModal2 = () => {
    this.setState({ choosenOpenModel: !this.state.choosenOpenModel });
  };

  setStakeValue(step, value) {
    const r = this.readState().ShoefyFarming;
    console.log("Value of rrr:::", value);
    if (!r) return;

    const t = r.balance;
    const v = Math.max(0, Math.min(+(value || 0), r.balance));
    if (step == -1)
      this.updateState({
        ctPercentageStake: Math.floor((100 * v) / t),
        ctValueStake: v,
      });
    else {

      const temp = this.readState().ctValueStake2;
      temp[step] = v;
      this.updateState({
        ctPercentageStake: Math.floor((100 * v) / t),
        ctValueStake2: temp
      });
      console.log(
        this.readState().ctValueStake2[0],
        this.readState().ctValueStake2[1]
      );
    }
  }

  async confirmApprove(step): Promise<void> {
    try {
      const state = this.readState();
      this.updateState({ pending: true });
      this.setState({ approveFlag: !this.state.approveFlag });
      const  flag = await state.ShoefyFarming.approve(state.ctValueStake);

      this.updateState({ pending: false});

    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  async confirmStake(currentTab): Promise<void> {
    // document.getElementById("modalswitch3").click();

    console.log("Value of shoefyStaking confirmStake:::", currentTab);
    const state = this.readState();
    const byteValue = this.findImage("byte");
    console.log("returns the byte value for input",byteValue)

    if(currentTab === "general"){
      // Stake General NFT
      try {
        const state = this.readState();
        this.updateState({ pending: true });

        if (state.ctValueStake >= 0) {
          await state.ShoefyFarming.stakefarmGeneral(state.ctValueStake,byteValue);

          document.getElementById("modalswitch2").click();
        } else {
          NotificationManager.warning("Can't stake a negative amount.");
          return;
        }

        this.updateState({ pending: false });
        this.updateOnce(true).then();
      } catch (e) {
        this.updateState({ pending: false });
        this.handleError(e);
      }
    }else{
      // Stake Rapid NFT
      try {
        const state = this.readState();
        this.updateState({ pending: true });

        if (state.ctValueStake >= 0) {
          await state.ShoefyFarming.stakefarmRapid(state.ctValueStake,byteValue);

          document.getElementById("modalswitch2").click();
        } else {
          NotificationManager.warning("Can't stake a negative amount.");
          return;
        }

        this.updateState({ pending: false });
        this.updateOnce(true).then();
      } catch (e) {
        this.updateState({ pending: false });
        this.handleError(e);
      }
    }
  }
  
  private async updateOnce(resetCt?: boolean): Promise<boolean> {
    console.log("Value of updateOnce")
    const shoefyFarming = this.readState().ShoefyFarming;

    if (!!shoefyFarming) {
      try {
        await shoefyFarming.refresh();
       
        if (resetCt) {
          this.updateState({
            ctPercentageStake: 0,
            ctValueStake: 0,
            ctValueStake2: [],
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

  async connectWallet() {
    try {
      this.updateState({ pending: true });
      const wallet = this.props.wallet;
      const result = await wallet.connect();
      console.log("Value of wallet:::CardContainer", wallet);

      const shoefyFarming = new ShoefyFarming(wallet);

      if (!result) {
        throw "The wallet connection was cancelled.";
      }
      
      this.updateState({
        ShoefyFarming: shoefyFarming,
        wallet: wallet,
        looping: true,
        pending: false,
      });

      this.updateOnce(true).then();

    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

 handleInputStake(type, event) {
    console.log(
      "Value of handleInputStake",
      type,
      event.target.value.toString()
    );
    let temp = event.target.value.toString();
    if (temp[0] === "0") event.target.value = temp.slice(1, temp.length);
    this.setStakeValue(type, event.target.value);
  }

  findImage(contractType:string) {

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
    ]

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
        if(contractType){
          return categories[currentIndex] // return common byte
        }
          return CommonCategory;
      case 1: 
         if(contractType){
           return categories[currentIndex] //  return unique byte
         }
         return UniqueCategory;
      case 2:
        if(contractType){
          return categories[currentIndex] //  return rare byte
        }
        return RareCategory;
      case 3: 
        if(contractType){
         return categories[currentIndex] //  return epic byte
        }
        return EpicCategory;
      case 4: 
        if(contractType){
         return categories[currentIndex] //  return legendary byte
        }
        return LegendaryCategory;
      case 5:
        if(contractType){
          return categories[currentIndex] //  return god byte
        }
        return GodCategory;
      case 6: 
        if(contractType){
          return categories[currentIndex] //  return devil byte
        }
        return DevilCategory;
      case 7:
        if(contractType){
          return categories[currentIndex] //  return alien byte
         }
        return AlienCategory;
      default:
        return; 
    }
  }

  private async loop(): Promise<void> {
    const self = this;
    const cont = await self.updateOnce.call(self);

    if (cont) {
      this._timeout = setTimeout(async () => await self.loop.call(self), 1000);
    }
  }

  handleError(error) {
		ShellErrorHandler.handle(error);
	}

  async componentDidMount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length == 0)
        console.log("User is not logged in to MetaMask");
      else {
        const chainid = Number(
          await window.ethereum.request({ method: "eth_chainId" })
        );
        if (chainid === 56 || chainid === 4 || chainid === 97)
          this.props.wallet.setChainId(Number(chainid));
        this.connectWallet();
      }
    }
  }

  render() {
   const TestImage = this.findImage();
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
    console.log("Value of state CardContainer",state)
    const mysterCheck = this.props.choosenOption === "Your Farms";
    console.log("Value of props in CardContainer",this.props.pending)


    return (

      <div>
      <div className={mysterCheck ? " " : "card_container" }>
        {/* cardImage, cardTitle, cardType, cardSubtitle,  */}
        
        {/* General Farming Pools Option */}
        {this.props.choosenOption != "Your Farms" &&
        <div>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-3">
            <Card
              cardImage={TestImage[0]}
              cardTitle={mysterCheck ? "Character" : "Phoenix"}
              cardType={this.props.nftType}
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
              cardImage={TestImage[1]}
              cardTitle={mysterCheck ? "Character" : "Taurus"}
              cardType={this.props.nftType}
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
                    onChange={(event) => this.handleInputStake(0, event)}
                    value={
                      (state.ctValueStake2 || 0)}
                  />
                </div>

                <div className="d-flex justify-content-center button-row margin_top">
               { state.allowance2 <= 0 &&   <button
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
                      this.confirmApprove()
                    }
                  >
                    {!this.state.approveFlag
                      ? t("staking.Farming.ApproveTitle")
                      : t("staking.Farming.StakeTitle")}
                  </button>}
                      {/* <h1>{state.allowance2}</h1> */}
                  { state.allowance2 > 0 &&<button
                    className="btn btn-md link-dark"
                    style={{
                      width: "100%",
                      backgroundColor: "#CF3279",
                      margin: 0,
                      color: "white",
                    }}
                    type="button"
                    disabled={state.pending}
                    onClick={async () => this.confirmStake(this.props.currentTab)
                    }
                  >
                    {
                      t("staking.Farming.StakeTitle")}
                  </button>}
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
              cardImage={TestImage[2]}
              cardTitle={mysterCheck ? "Character" : "Pegasus"}
              cardType={this.props.nftType}
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
              cardImage={TestImage[3]}
              cardTitle={mysterCheck ? "Character" : "Whale"}
              cardType={this.props.nftType}
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

            {/* <Model/> */}
          </div>
        
        </div>
        </div>
          }

          {
            this.props.choosenOption === "Your Farms" &&
            <div className="">
                <img src={NoDataAvalible} alt="Device" className="noDataAvalible" />
            </div>
          }

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
      <NotificationContainer />

      </div>

      // NoDataAvalible
    );
  }
}

// ExpandableComponentWithTranlation
const CardContainerComponentWithTranlation = withTranslation()(CardContainer);

// ExpandableComponentMain
const CardContainerComponentMain = compose(
	withWallet
)(
  CardContainerComponentWithTranlation
);
// ExpandableComponentWithTranlation

export default CardContainerComponentMain;
