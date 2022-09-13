import * as React from "react";
import * as numeral from "numeral";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../../shellInterfaces";
import { Wallet } from "../../wallet";
import { withWallet } from "../../walletContext";

import { ShoefyFarming } from "../../contracts/shoeFyFarming";
import { Shoefy } from "../../contracts/shoefy";

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
  farmingData?: any;
  balance?: any;
  allowance?: number;
};

export type StakingState = {
  // ShoefyFarming
  shoefy?: Shoefy;
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

  nftname: string;
  category: string;
  price: string;
  nftImage: string;
  categoryAmount: number;
  categoryName:string;
  description:string;
  assignedNFT:string;

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

  private signatures = [];
  private farmIds = [];
  private tokenURI = [];

  constructor(props: StakingProps & WithTranslation) {
    super(props);

    this.handleInputStake = this.handleInputStake.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      approveFlag: false,
      activeTab: " ",
      isModelOpen: false,
      choosenOpenModel: false,
      harvestAmount: 0,
      userData: [],
      ctValueStake2: 0,
      amount: "",
      nftname: "",
      nftImage: "",
      category: "",
      price: "",
      categoryName: "",
      description:"",
      assignedNFT:''
      
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.farmingData !== state.farmingData) {
      //Change in props
      return {
        userData: props.farmingData,
      };
    }
    return null; // No change to state
  }

  // userData
  toggleModal = () => {
    this.setState({ isModelOpen: !this.state.isModelOpen });
  };
 
  toggleModal2 = (
    _nftImage: string,
    _categoryName:string,
    _category:string,
    _price: string,
    _name: string,
    _description:string,
    _assignedNFT:string
  ) => {
    this.setState({ nftname: _name });
    this.setState({ nftImage: _nftImage });
    this.setState({ category: _category });
    this.setState({categoryName: _categoryName});
    this.setState({ price: _price });
    this.setState({ description: _description });
    this.setState({ assignedNFT: _assignedNFT });

    // assignedNFT
    this.setState({ choosenOpenModel: !this.state.choosenOpenModel });
  };

  selectNFT = (index, data) => {
    try {

      const farmId = data.farmId;

      // Logic for deletion
        if(this._selectedNFT.length ==0){

            this._selectedNFT.push({
            farmId: data.farmId
          });

          this.selectedItems[index] = !this.selectedItems[index];
          this.setState({ harvestAmount: this._selectedNFT.length });

          return 
        }else{
         
         let flag = false;
         let index1;

          for (let i = 0; i<= this._selectedNFT.length-1;i++){
            if (farmId === this._selectedNFT[i].farmId){
              flag = true;
              index1 = i;
            }
          }

          if(!flag){
            this._selectedNFT.push({
              farmId: data.farmId
            });
  
            this.selectedItems[index] = !this.selectedItems[index]; //color selection          
            this.setState({ harvestAmount: this._selectedNFT.length }); //length in the input
          }else{

            this._selectedNFT.splice(index1,1);
            this.selectedItems[index] = !this.selectedItems[index]; //color selection          
            this.setState({ harvestAmount: this._selectedNFT.length }); //length in the input
          }
     
        }

    } catch (e) {
      this.handleError(e);
    }
  };

  setStakeValue(step, value) {
    const r = this.readState().ShoefyFarming;
    if (!r) return;

    const t = r.balance;
    const v = value;

    const temp = this.readState().ctValueStake2;

    temp[step] = v;

    this.updateState({
      ctPercentageStake: Math.floor((100 * v) / t),
      ctValueStake2: temp,
    });

    this.setState({ amount: temp });
  }

  async confirmApprove(): Promise<void> {
    const currentBalance = this.props.balance;

    let web3 = new Web3(window.ethereum);

    const value = this.props.stakeAmount;

    let newValue = value.split(" ")[0] * this.state.amount;

    const constant =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";

    const shoefy = this.readState().shoefy;

    // if user doesn't have enough balance
    if (currentBalance <= 0) {
      NotificationManager.warning(
        "You don't have enough tokens in your account"
      );
      this.updateState({ pending: false });
      return;
    }

    try {
      const state = this.readState();
      this.updateState({ pending: true });
      const flag = await state.ShoefyFarming.approve(constant);

      this.updateState({ pending: false });
      this.setState({ approveFlag: !this.state.approveFlag });

      this.updateOnce(true).then();
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  async confirmStake(currentTab): Promise<void> {
    const value = this.props.stakeAmount;

    const currentAllowence = this.props.allowance;

    const currentBalance = parseInt(this.props.balance);

    let newValue = value.split(" ")[0] * this.state.amount;

    const categoryuserLimit = this.setCategoryAmount();

    const state = this.readState();
    const byteValue = this.findImage("byte");

    if (currentAllowence < newValue) {
      NotificationManager.warning(
        `Not enough allowence, kindly approve token first`
      );
    return 
  }

    if (currentTab === "general") {
      // Stake General NFT
      try {
        const state = this.readState();
        this.updateState({ pending: true });

        // if user has entered a valid amount or not
        if (state.amount > 0) {
          // if user have enough balance in the account
          if (currentBalance > newValue) {
         
            // User can't farm more than 10 tokens
            const generaluserLimit = await state.ShoefyFarming.getUserGeneralLimit(true,byteValue);
            const remainingLimit = (categoryuserLimit > generaluserLimit ?  (categoryuserLimit-generaluserLimit ): (generaluserLimit- categoryuserLimit))

            if (parseInt(state.amount) > remainingLimit ) {
              NotificationManager.warning(
                `Farm amount exceeding user's farmLimit`);

              this.updateState({ pending: false });
              this.setState({ amount: 0 });
              return;
            }

            // User shouldn't exceed the pool limit
            const poolLimit = await state.ShoefyFarming.generalFarmsLeft(byteValue);

            if (parseInt(state.amount) > parseInt(poolLimit) ) {
              NotificationManager.warning(
                `Farm amount exceeding pool limit`);

              this.updateState({ pending: false });
              this.setState({ amount: 0 });
              return;
            }

            await state.ShoefyFarming.stakefarmGeneral(state.amount, byteValue);

            document.getElementById("modalswitch2").click();
          } else {
            NotificationManager.warning(
              "You don't have enough tokens in your account"
            );
            this.updateState({ pending: false });

            return;
          }
        } else {
          NotificationManager.warning("Can't stake a negative amount.");
          return;
        }

        this.updateState({ pending: false });
        this.setState({ amount: 0 });
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
          if (currentBalance > newValue ) {
            
            const rapiduserLimit = await state.ShoefyFarming.getUserRapidLimit(false,byteValue);

            const remainingRapidLimit = (categoryuserLimit > rapiduserLimit ?  (categoryuserLimit-rapiduserLimit ): (rapiduserLimit- categoryuserLimit))
            const poolLimit = await state.ShoefyFarming.rapidFarmsLeft(byteValue);

            if (parseInt(state.amount) > remainingRapidLimit) {
              NotificationManager.warning(
                `Farm amount exceeding user's farmLimit`);
              this.updateState({ pending: false });
              this.setState({ amount: 0 });
              return;
            }

             // User shouldn't exceed the pool limit
             if (parseInt(state.amount) > parseInt(poolLimit) ) {
               NotificationManager.warning(
                 `Farm amount exceeding pool limit!!!`);
 
               this.updateState({ pending: false });
               this.setState({ amount: 0 });
               return;
             }

            await state.ShoefyFarming.stakefarmRapid(state.amount, byteValue);
            document.getElementById("modalswitch2").click();
          } else {
            NotificationManager.warning(
              "You don't have enough tokens in your account"
            );
            this.updateState({ pending: false });
            this.setState({ amount: 0 });
            this.updateOnce(true).then();
            return;
          }
        } else {
          NotificationManager.warning("Can't stake a negative amount.");
          return;
        }

        this.updateState({ pending: false });
        this.setState({ amount: 0 });
        this.updateOnce(true).then();
      } catch (e) {
        this.updateState({ pending: false });
        this.handleError(e);
      }
    }
  }

  async callApi() {
    try {
      // category
      const urlValue = window.location.hash;
      const hash = urlValue.replace("#", "");
      const wallet = this.props.wallet;
      const shoefyFarming = new ShoefyFarming(wallet);

      const { title } = this.props;

      const currentTitle = title.split(" ");

      if (currentTitle.length > 2) {
        const _currentTitle = (currentTitle[0] + currentTitle[1]).toUpperCase();

        let resp = await shoefyFarming.harvestApiCall(
          hash,
          _currentTitle,
          this._selectedNFT
        );

      } else {
        const _currentTitle = currentTitle[0].toUpperCase();
      
        let resp = await shoefyFarming.harvestApiCall(
          hash,
          _currentTitle,
          this._selectedNFT
        );
      }
    } catch (err) {
      console.log("error occured", err);
    }
  }

  async confirmHarvest(): Promise<void> {

    if(this._selectedNFT.length <= 0){
      NotificationManager.warning("Can't stake a negative amount.");
      return
    }

    const urlValue = window.location.hash;
    const currentTab = urlValue.replace("#", "");
    const state = this.readState();
    const byteValue = this.findImage("byte");
    this.updateState({ pending: true });

    const nftData = await this.callApi();

    this.toggleModal();

    this.updateState({ pending: false });
    this.updateOnce(true).then();
      this.readState();

      setTimeout(() => {
      window.location.reload();

      },5000)
    
    // if (currentTab === "general") {
    //   // Harvest General NFT
    //   try {
    //     this.updateState({ pending: true });
    //     await state.ShoefyFarming.harvestfarmGeneral(
    //       this.farmIds,
    //       this.tokenURI,
    //       this.signatures
    //     );
    //     this.toggleModal();

    //     this.updateState({ pending: false });
    //     this.updateOnce(true).then();
    //   } catch (e) {
    //     this.updateState({ pending: false });
    //     this.handleError(e);
    //   }
    // } else {
    //   // Harvest Rapid NFT
    //   try {
    //     const state = this.readState();
    //     this.updateState({ pending: true });
    //     await state.ShoefyFarming.harvestfarmRapid(
    //       this.farmIds,
    //       this.tokenURI,
    //       this.signatures
    //     );
    //     this.toggleModal();

    //     this.updateState({ pending: false });
    //     this.updateOnce(true).then();
    //   } catch (e) {
    //     this.updateState({ pending: false });
    //     this.handleError(e);
    //   }
    // }
  }

  private async updateOnce(resetCt?: boolean): Promise<boolean> {
    const shoefyFarming = this.readState().ShoefyFarming;
    const shoefy = this.readState().shoefy;

    const value = this.findImage();

    if (!!shoefyFarming) {
      try {

        if (resetCt) {
          this.updateState({
            ctPercentageStake: 0,
            ctValueStake: 0,
            ctValueStake2: [],
            userData: shoefyFarming.userNFTs,
            address: this.props.wallet._address,
            balance: shoefyFarming.balance,
            allowance: shoefyFarming.allowance,
            allowance2: shoefyFarming.allowance2,
            balance: shoefy.balance,
          });
        } else {
          this.updateState({
            address: this.props.wallet._address,
            balance: shoefyFarming.balance,
            userData: shoefyFarming.userNFTs,
            stakedBalance: shoefyFarming.stakedBalance,
            stakedBalance2: shoefyFarming.stakedBalance2,
            allowance: shoefyFarming.allowance,
            allowance2: shoefyFarming.allowance2,
            balance: shoefy.balance,
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
    // userData
    try {
      const value = this.findImage();
      this.updateState({ pending: true });
      const wallet = this.props.wallet;
      const result = await wallet.connect();

      const shoefyFarming = new ShoefyFarming(wallet);
      this.setState({ userData: shoefyFarming.userNFTs });

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
    this.setState({ amount: event.target.value });
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

  setCategoryAmount() {
    const currentIndex = this.props.index;
    switch (currentIndex) {
      case 0:
        return 10;
      case 1:
        return 9;
      case 2:
        return 8;
      case 3:
        return 7;
      case 4:
        return 6;
      case 5:
        return 4;
      case 6:
        return 3;
      case 7:
        return 2;
    }
  }

  changeBackground(index: number) {
    this.nftData[index].selected = !this.nftData[index].selected;
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

  getNFTdata = () => {
    let nftData = this.props.userData;

    if (nftData == undefined) {
      return;
    }

    let currentData = [];

    for (let i = 0; i <= nftData.length - 1; i++) {
      currentData.push(nftData[i]);
    }

    return currentData;
  };

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // No longer need to cast to any - hooray for react!
    this.setState({ amount: e.target.value });
    console.log("Value of amount", this.state.amount);
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

    if (nftData.length > 0) {

    }

    const lockPeriod = true;

    return (
      <div>
        <div
          className={
            mysterCheck && nftData.length <= 0 ? " " : "card_container"
          }
        >
          {/* General Farming Pools Option */}
          {(this.props.choosenOption === "General Farming Pools" ||
            this.props.choosenOption === "Rapid Farming Pools") && (
            <div>
              <div className="row">
                <p className="no__margin">
                  {" "}
                  Preview of {this.props.title} {" "}
                </p>
              </div>

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
                          Enter no. of {this.props.title} to farm.
                        </label>
                      </div>
                      <div className="maxValue">
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          onChange={(event) => this.handleInputStake(0, event)}
                          value={this.state.amount}
                        />
                      </div>

                      <div className="d-flex justify-content-center button-row margin_top">
                        {this.props.allowance <= 0 && (
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
                            {t("staking.Farming.ApproveTitle")}
                          </button>
                        )}
                        {this.props.allowance > 0 && (
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
                          One user can farm max. {this.setCategoryAmount()}{" "}
                          {this.props.title}
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

          {/* Dynamic data  */}
          {(this.props.choosenOption === "Your Farms" ||
            this.props.choosenOption === "Your Rapid Farms") && (
            <div>
              {nftData.length > 0 ? (
                <div>
                  <div className="row">
                    {nftData.slice(0, 2).map((data, index) => {
                      return (
                        <div
                          className={
                            nftData.length == 1
                              ? "col-sm-12 col-md-6 col-lg-6"
                              : "col-sm-12 col-md-6 col-lg-3"
                          }
                          key={index}
                        >
                          <Card
                            cardImage={
                              !lockPeriod
                                ? Mystery
                                : nftData[index]?.image || Mystery
                            }
                            cardTitle={
                              nftData[index].currentLayer == 0
                                ? "Character"
                                : "Phoenix"
                            }
                            cardType={this.props.nftType}
                            cardSubtitle={
                              nftData[index].currentLayer == 0
                                ? "Mystery"
                                : "Fire"
                            }
                            backgroundColor={
                              nftData[index].currentLayer == 0 ? "Mystery" : ""
                            }
                            ChoosenOption={this.props.choosenOption}
                          />

                          <div
                            className={
                              nftData.length == 1
                                ? "col-sm-6 col-md-6 col-lg-6"
                                : "col-sm-6 col-md-6 col-lg-12"
                            }
                          >
                            {nftData[index]?.mintStatus === "Completed" && (
                              <button
                                type="button"
                                className={
                                  this.selectedItems[index]
                                    ? "btn btn-outline-Choose NFT btn-block skyblue__button mt-2"
                                    : "btn btn-outline-Choose NFT btn-block white__button mt-2"
                                }
                                onClick={async () => {
                                  this.selectNFT(index, data);
                                }}
                              >
                                Choose NFT
                              </button>
                            )}

                            {nftData[index]?.mintStatus === "Minted" && (
                              <button
                                type="button"
                                className={
                                  "btn btn-outline-Choose NFT btn-block btn-pink mt-2"
                                }
                            onClick={() =>
                                  this.toggleModal2(
                                    nftData[index]?.image,
                                    nftData[index]?.categoryName,
                                    this.props.nftType,
                                    this.props.stakeAmount.split(" ")[0],
                                    nftData[index].currentLayer == 0
                                      ? "Character"
                                      : "Phoenix",
                                      nftData[index]?.description,
                                      nftData[index]?.assignedNFT
                                  )
                                }
                              >
                                Open
                              </button>
                            )}
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
                            className={
                              nftData.length == 1
                                ? "col-sm-12 col-md-6 col-lg-6"
                                : "col-sm-12 col-md-6 col-lg-3"
                            }
                            key={index}
                          >
                            <Card
                              cardImage={
                                !lockPeriod
                                  ? Mystery
                                  : nftData[index + 2]?.image || Mystery
                              }
                              cardTitle={
                                nftData[index + 2].currentLayer == 0
                                  ? "Character"
                                  : "Phoenix"
                              }
                              cardType={this.props.nftType}
                              cardSubtitle={
                                nftData[index + 2].currentLayer == 0
                                  ? "Mystery"
                                  : "Fire"
                              }
                              backgroundColor={
                                nftData[index + 2].currentLayer == 0
                                  ? "Mystery"
                                  : ""
                              }
                              ChoosenOption={this.props.choosenOption}
                            />

                              {/* chnage here */}
                            {nftData[index + 2]?.mintStatus === "Completed" && (
                              <div
                                className={
                                  nftData.length == 1
                                    ? "col-sm-6 col-md-6 col-lg-6"
                                    : "col-sm-6 col-md-6 col-lg-12"
                                }
                              >
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
                          
                          {/* change here */}
                          {nftData[index +2]?.mintStatus === "Minted" && (
                              <button
                                type="button"
                                className={
                                  "btn btn-outline-Choose NFT btn-block btn-pink mt-2"
                                }
                                onClick={() =>
                                  this.toggleModal2(
                                    nftData[index+2]?.image,
                                    nftData[index+2]?.categoryName,
                                    this.props.nftType,
                                    this.props.stakeAmount.split(" ")[0],
                                    nftData[index].currentLayer == 0
                                      ? "Character"
                                      : "Phoenix",
                                      nftData[index+2]?.description,
                                      nftData[index+2]?.assignedNFT
                                  )
                                }
                              >
                                Open
                              </button>
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
                            className={
                              nftData.length == 1
                                ? "col-sm-12 col-md-6 col-lg-6"
                                : "col-sm-12 col-md-6 col-lg-3"
                            }
                            key={index}
                          >
                            <Card
                              cardImage={
                                !lockPeriod
                                  ? Mystery
                                  : nftData[index + 6]?.image || Mystery
                              }
                              cardTitle={
                                nftData[index + 6].currentLayer == 0
                                  ? "Character"
                                  : "Phoenix"
                              }
                              cardType={this.props.nftType}
                              cardSubtitle={
                                nftData[index + 6].currentLayer == 0
                                  ? "Mystery"
                                  : "Fire"
                              }
                              backgroundColor={
                                nftData[index + 6].currentLayer == 0
                                  ? "Mystery"
                                  : ""
                              }
                              ChoosenOption={this.props.choosenOption}
                            />
                            
                            {/* change here  */}
                            {nftData[index + 6]?.mintStatus === "Completed" && (
                              <div
                                className={
                                  nftData.length == 1
                                    ? "col-sm-6 col-md-6 col-lg-6"
                                    : "col-sm-6 col-md-6 col-lg-12"
                                }
                              >
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

                            {/* change here  */}
                           {nftData[index+6]?.mintStatus === "Minted" && (
                              <button
                                type="button"
                                className={
                                  "btn btn-outline-Choose NFT btn-block btn-pink mt-2"
                                }
                                onClick={() =>
                                  this.toggleModal2(
                                    nftData[index+6]?.image,
                                    nftData[index+6]?.categoryName,
                                    this.props.nftType,
                                    this.props.stakeAmount.split(" ")[0],
                                    nftData[index].currentLayer == 0
                                      ? "Character"
                                      : "Phoenix",
                                      nftData[index+6]?.description,
                                      nftData[index+6]?.assignedNFT
                                  )
                                }
                              >
                                Open
                              </button>
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
            title={this.state.nftname}
            type={this.state.category}
            price={this.state.price}
            cardImage={this.state.nftImage}
            isOpen={this.state.choosenOpenModel}
            description={this.state.description}
            categoryName={this.state.categoryName}
            assignedNFT={this.state.assignedNFT}
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
