import * as React from "react";
import * as numeral from "numeral";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../shellInterfaces";
import { Wallet } from "../wallet";
import { withWallet } from "../walletContext";
import { Modal } from "./Common/Modal/Modal.component";
// import data from "public/locales/en/translation.json";

import {ShoefyFarming } from "../contracts/shoeFyFarming";

import { Shoefy } from "../contracts/shoefy";

import {
  WithTranslation,
  withTranslation,
  TFunction,
  Trans,
} from "react-i18next";
import { fadeInLeft, fadeInRight, pulse } from "react-animations";
import styled, { keyframes } from "styled-components";
import AnimatedNumber from "animated-number-react";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { NavLink}  from "react-router-dom";
import ExpandableComponentMain from "./Common/expandableComponent";

//  "./Model";
import "./nftFarmingComponent.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Footer } from "./footer";

import "../shellNav.css";
import "../shellNav.icons.css";

import mark from "../../../src/images/mark.png";

export type StakingProps = {
};

// Call API
export interface RowData{
  title:string,
  Image_Path:string,
  stakeAmount: string,
  lockUpDuration: string
}

interface TableView {
  id: string;
  title: string;
  tokentoStake: string;
  LockupDuration: string;
}

export type FarmingState = {
  data: TableView[];
  shoefy?: Shoefy;
  ShoefyFarming?: ShoefyFarming;
  wallet?: Wallet;
  looping?: boolean;
  expandingRow:RowData[];
  show?:boolean;
  
  // actual set values
  address?: string;
  balance?: number;

  allowance: number,
	allowance2: number,

  // values pending to be set
  pending?: boolean;
  approveFlag: boolean;
  chooseButton?:string;
  currentTab?:string;
  selected?:boolean;
	approveFlag1: boolean,
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

class nftFarmingComponent extends BaseComponent<StakingProps & WithTranslation,FarmingState> {
  private _timeout: any = null;
  private _categories: Array<string> = [
    "COMMON",
    "UNIQUE",
    "RARE",
    "EPIC",
    "LEGENDARY",
    "MYTHICGOD",
    "MYTHICDEVIL",
    "MYTHICALIEN"
  ]

  constructor(props: StakingProps & WithTranslation) {
    super(props);
    this.connectWallet = this.connectWallet.bind(this);
    this.disconnectWallet = this.disconnectWallet.bind(this);

    this.state = {
      approveFlag: false,
      approveFlag1: false,
      activeTab: " ",
      chooseButton:'General Farming Pools',
      expandingRow:[],
      data:[],
      show:false,
      currentTab:"general",
      selected:false
    };
  }

  handleError(error) {
    ShellErrorHandler.handle(error);
  }

  async confirmStake(step): Promise<void> {

    const urlValue = window.location.hash;
    const hash = urlValue.replace("#", "");

    if(step === "Pools" && hash === 'general'){

      this.setState({selected: false})
      this.setState({ chooseButton:  'General Farming Pools' });
      
    }

    if( step === "Pools" && hash === 'rapid'){
      this.setState({selected: false})
      this.setState({ chooseButton: 'Rapid Farming Pools' });

    }

    if( step === "Farms" && hash === 'general'){
      this.setState({selected: true})
      this.setState({ chooseButton: 'Your Farms' });

    }

    if( step === "Farms" && hash === 'rapid'){
      this.setState({selected: true})
      this.setState({ chooseButton:  'Your Rapid Farms'});
    }
  }

  componentWillUnmount() {
    if (!!this._timeout) {
      clearTimeout(this._timeout);
    }
    this.updateState({ shoefy: null, looping: false });
  }

  async componentDidMount() {
    
    const urlValue = window.location.hash;
    const hash = urlValue.replace("#", "");
    this.setState({ activeTab: hash });

    fetch("./locales/en/translation.json")
      .then((res) => res.json())
      .then((data) => {
        // ExpandingRapidRow
        this.setState({ data:data });
        if (hash =='rapid'){
        this.setState({ expandingRow:data.ExpandingRapidRow });
        this.setState({ currentTab:'rapid' });
        }else{
        this.setState({ expandingRow:data.ExpandingRow });
        }
      });


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

  async componentDidUpdate(prevProps, prevState){

    const urlValue = window.location.hash;
    const hash = urlValue.replace("#", "");

    if(prevState.currentTab != hash){
      if(hash == 'rapid'){
            // this.callApi(hash,this._categories.slice(0, 3))
      }else{
          //  this.callApi(hash,this._categories)
      }
    }
  }

  async callApi(currentTitle:string,categories:Array<string>){

    const wallet = this.props.wallet;
    const shoefyFarming = new ShoefyFarming(wallet);

    let _currentTitle = currentTitle;
   
    if(_currentTitle == ' '){
      _currentTitle = 'general'
    }
    
    let test = []
    if (typeof(shoefyFarming) != undefined) {
      try {

        for (const element of categories) {
          let resp = await shoefyFarming.apiCall(_currentTitle,element);   
          test.push(resp);       
        }
        
      } catch (e) {
        console.warn("Unable to update staking status", e);
      }
    }  

  }

  private async loop(): Promise<void> {
    const self = this;
    const cont = await self.updateOnce.call(self);

    if (cont) {
      this._timeout = setTimeout(async () => await self.loop.call(self), 10000);
    }
  }

  private async updateOnce(resetCt?: boolean): Promise<boolean> {
    const shoefy = this.readState().shoefy;

    const wallet = this.props.wallet;
    const shoefyFarming = new ShoefyFarming(wallet);

    if (!!shoefy && !!shoefyFarming) {
      try {
        await shoefy.refresh();
        await  shoefyFarming.refresh();
        if (!this.readState().looping) {
          return false;
        }
        if (resetCt) {
          this.updateState
          ({
            address: this.props.wallet._address,
            balance: shoefy.balance,
						allowance2: shoefyFarming.allowance2            
          });
        } else {
          this.updateState({
            address: this.props.wallet._address,
            balance: shoefy.balance,
						allowance2: shoefyFarming.allowance2
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

      if (!result) {
        throw "The wallet connection was cancelled.";
      }
      const shoefy = new Shoefy(wallet);

      this.updateState({
        shoefy: shoefy,
        ShoefyFarming: ShoefyFarming,
        wallet: wallet,
        looping: true,
        pending: false
      });

      this.updateOnce(true).then();

      this.loop().then();
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  async disconnectWallet() {
    try {
      this.updateState({ pending: true });
      const result = await this.props.wallet.disconnect();

      if (result) {
        throw "The wallet connection was cancelled.";
      }

      this.updateState({
        shoefy: null,
        wallet: null,
        address: null,
        ShoefyFarming:null,
        looping: false,
        pending: false,
        balance: 0,
      });
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  onRapid(){
    this.setState({ activeTab: "rapid" });
    location.replace("/nftFarming#rapid");
    this.setState({ expandingRow:this.state.data.ExpandingRapidRow });
    this.setState({ show: !this.state.show});
    this.setState({ chooseButton: 'Rapid Farming Pools' });
    this.setState({ currentTab:'rapid' });
    this.setState({selected: false})

    // this.callApi("rapid",this._categories.slice(0, 3))
  }

  onGeneral(){
    this.setState({ activeTab: "general" });
    location.replace("/nftFarming#general");
    this.setState({ expandingRow:this.state.data.ExpandingRow });
    this.setState({ show: !this.state.show});
    this.setState({ chooseButton:  'General Farming Pools' });
    this.setState({ currentTab:'general'});
    this.setState({selected: false})
    // this.callApi("general",this._categories)
  }

  render() {
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
    let test = t("ExpandingRow");

    const accountEllipsis = this.props.wallet._address
      ? `${this.props.wallet._address.substring(
          0,
          4
        )}...${this.props.wallet._address.substring(
          this.props.wallet._address.length - 4
        )}`
      : "___";

    return (
      <div>
        {/* Nav Bar */}
        <div className="navigation-wrapper">
          <div className="logo-wrapper">
            <a href="/home">
              <img src={mark} className="img-logo" alt="ShoeFy Finance" />
              <span className="font_logo">ShoeFy</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-target="#mainNav"
              data-bs-toggle="collapse"
              aria-controls="navbarSupportedContent"
              aria-label="Toggle navigation"
              ref={this.collapseRef}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <nav id="mainNav">
            <ul className="navbar-nav">
              <li className="nav_letter1">
                <NavLink className="link_letter" to="sales">
                  Sales
                </NavLink>
              </li>
              <li className="nav_letter1">
                <NavLink className="link_letter" to="nftStaking">
                  sNFT Staking
                </NavLink>
              </li>
              <li className="nav_letter">
                <NavLink className="link_letter" to="shoefyStaking">
                  SHOE Staking
                </NavLink>
              </li>
              <li className="nav_letter">
                <NavLink className="link_letter" to="nftFarming#general" onClick={() => this.callApi('general',this._categories)}>
                  Farm
                </NavLink>
              </li>
              <li className="nav_letter">
                <NavLink className="link_letter" to="boosterNFT">
                  Booster NFTs
                </NavLink>
              </li>
              <li className="nav_letter">
                <select
                  className="networkselect"
                  value={this.props.wallet.getChainId()}
                  onChange={(e) => {
                    this.props.wallet.setChainId(Number(e.target.value));
                    this.disconnectWallet();
                  }}
                >
                  <option value={4}>Rinkeby Testnet</option>
                  <option value={97}>BSC Testnet</option>
                  <option value={56}>BSC Mainnet</option>
                </select>
              </li>
              <li className="nav_letter">
                {this.props.wallet._address ? (
                  <div
                    onClick={this.disconnectWallet}
                    className="wallet-connect"
                  >
                    {state.pending && (
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      >
                        {" "}
                      </span>
                    )}
                    <span className="ih_rtext">{accountEllipsis}</span>
                  </div>
                ) : (
                  <div onClick={this.connectWallet} className="wallet-connect">
                    {state.pending && (
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      >
                        {" "}
                      </span>
                    )}
                    <span className="ih_rtext">
                      {t("staking.connect_wallet")}
                    </span>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Nav Bar End */}
        {/* Start of Wallet Connection */}
        <div className="content-wrapper">
          <div className="nftfarming-container">
            <div className="container">
              <div className="row staking-body mt-5">
                <FadeInRightDiv className="col-md-12 d-flex mt-5">
                  <div className="shadow d-flex flex-column flex-fill gradient-card dark">
                    <div style={{ margin: "-20px" }}>
                      <ul
                        role="tablist"
                        className="nav nav-tabs"
                        style={{ padding: "10px", paddingBottom: "0" }}
                      >
                        <li role="presentation" className="nav-item">
                          <a
                            role="tab"
                            data-bs-toggle="tab"
                            className={`nav-link ${
                              this.state.activeTab === "general" ? "active" : ""
                            }`}
                            // remove this
                            onClick={() => this.onGeneral()
                          }
                          >
                            {t("NFTFarming.GeneralFarming.title")}
                             {/* here */}
                          </a>
                        </li>
                        <li role="presentation" className="nav-item">
                          <a
                            role="tab"
                            data-bs-toggle="tab"
                            className={`nav-link ${
                              this.state.activeTab === "rapid" ? "active" : ""
                            }`}
                            // remove this
                            onClick={() => this.onRapid()
                          }
                          >
                            {t("NFTFarming.RapidFarming.title")}
                            {/* there */}
                          </a>
                        </li>
                      </ul>

                      {/* from here */}
                      <div className="tab-content">
                        <div
                          role="tabpanel"
                          className={`tab-pane ${
                            this.state.activeTab === "general" ? "active" : ""
                          }`}
                          id="ctl-stake"
                        >
                          {/* Here is the General Tab */}
                          <div className="col-md-12 d-flex mt-5">
                            <div className="shadow d-flex flex-column flex-fill gradient-card primary user-info">
                              <h1 className="user-info-title">
                                {t("NFTFarming.GeneralFarming.title")}
                              </h1>

                              <p>
                                {/* description */}
                                {t("NFTFarming.GeneralFarming.description")}
                              </p>
                              <div className="user-info-body">
                                <div className="infoitem">
                                  <h2>{t("staking.your_info.tradeable")}</h2>
                                  <AnimatedNumber
                                    value={numeral(state.balance || 0).format(
                                      "0.00"
                                    )}
                                    duration="500"
                                    formatValue={(value) =>
                                      `${Number(
                                        parseFloat(value).toFixed(2)
                                      ).toLocaleString("en", {
                                        minimumFractionDigits: 2
                                      })}`
                                    }
                                    className="staking-info"
                                  >
                                  </AnimatedNumber>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Use this in the other NFT tab */}
                        </div>

                        {/* Other Tab starts */}
                        <div
                          role="tabpanel"
                          className={`tab-pane ${
                            this.state.activeTab === "rapid" ? "active" : ""
                          }`}
                          id="ctl-unstake"
                        >
                          {/* Here is the rapid tab */}
                          <div className="col-md-12 d-flex">
                            <div className="shadow d-flex flex-column flex-fill gradient-card primary user-info mt-5">
                              <h1 className="user-info-title">
                                {t("NFTFarming.RapidFarming.title")} 
                              </h1>

                              <p>
                                {/* Description */}
                                {t("NFTFarming.RapidFarming.description")}
                              </p>
                              <div className="user-info-body">
                                <div className="infoitem">
                                  <h2>{t("staking.your_info.tradeable")}</h2>
                                  <AnimatedNumber
                                    value={numeral(state.balance || 0).format(
                                      "0.00"
                                    )}
                                    duration="1000"
                                    formatValue={(value) =>
                                      `${Number(
                                        parseFloat(value).toFixed(2)
                                      ).toLocaleString("en", {
                                        minimumFractionDigits: 2,
                                      })}`
                                    }
                                    className="staking-info"
                                  >
                                    0 ShoeFy
                                  </AnimatedNumber>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* to there */}
                    </div>
                  </div>
                </FadeInRightDiv>

                <div className="d-flex justify-content-left button-row margin_top">
                  <button
                    className={!this.state.selected? "btn btn-md link-dark btn-pink" : "btn btn-md link-dark"}
                    style={{
                      width: "213px",
                      backgroundColor: "#120059",
                      color: "white",
                      margin: "0px 16px",
                    }}
                    type="button"
                    onClick={async () => {
                      this.confirmStake("Pools")
                    }}
                  >
                    {this.state.currentTab === 'general' ? 'General Farming Pools':'Rapid Farming Pools'}
                    
                  </button>
                  
                  <button
                    className={this.state.selected? "btn btn-md link-dark btn-pink" : "btn btn-md link-dark"}
                    style={{
                      width: "184px",
                      height: "40px",
                      backgroundColor: "#120059",
                      margin: "0px 16px",
                      color: "white",
                    }}
                    disabled={state.pending}
                    type="button"
                    onClick={async () => this.confirmStake("Farms")}
                  >
                    {this.state.currentTab === 'rapid' ? 'Your Rapid Farms':'Your Farms'}
                  </button>
                </div>
                  
                 {/* General Farming Pool */}
                 {( this.state.chooseButton === 'General Farming Pools') && this.state.expandingRow.map((item,index)=>(<ExpandableComponentMain allowance={this.state.allowance2} balance={numeral(state.balance || 0).format(
                                                   "0.00")}  data={item} index={index} pending={state.pending}   key={item.title} currentTab={this.state.currentTab} choosenOption="General Farming Pools"/>))}
                 
                 {/* General Farming */}
                 {/* Your Farms */}
                 {( this.state.chooseButton === 'Your Farms') && this.state.expandingRow.map((item,index)=>(<ExpandableComponentMain allowance={this.state.allowance2} balance={numeral(state.balance || 0).format(
                                                   "0.00")}  data={item} index={index} pending={state.pending}   key={item.title} currentTab={this.state.currentTab} choosenOption="Your Farms"/>))}
                             
                 {/* Rapid */}
                 {(this.state.chooseButton === 'Rapid Farming Pools') && this.state.expandingRow.map((item,index)=>(<ExpandableComponentMain allowance={this.state.allowance2}  balance={numeral(state.balance || 0).format(
                                                   "0.00")} data={item} index={index} pending={state.pending}  key={item.title}   currentTab={this.state.currentTab} choosenOption="Rapid Farming Pools"/>))}
                 {(this.state.chooseButton === 'Your Rapid Farms') && this.state.expandingRow.map((item,index)=>(<ExpandableComponentMain  allowance={this.state.allowance2} balance= {numeral(state.balance || 0).format(
                                                   "0.00")} data={item} index={index} pending={state.pending}  key={item.title}  currentTab={this.state.currentTab} choosenOption="Your Rapid Farms"/>))}
 
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

const FarmComponentWithTranlation = withTranslation()(nftFarmingComponent);

const FarmingComponentMain = compose(withWallet)(FarmComponentWithTranlation);

export default FarmingComponentMain;
