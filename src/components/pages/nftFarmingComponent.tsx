import * as React from "react";
import * as numeral from "numeral";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../shellInterfaces";
import { Wallet } from "../wallet";
import { withWallet } from "../walletContext";
import { Modal } from "./Common/Modal/Modal.component";
// import data from "public/locales/en/translation.json";

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
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { NavLink}  from "react-router-dom";
import ExpandableComponentMain from "./Common/expandableComponent";

//  "./Model";
import ModelComponentMain from "./Common/Model";
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
  wallet?: Wallet;
  looping?: boolean;
  expandingRow:RowData[];
  show?:boolean;
  
  // actual set values
  address?: string;
  balance?: number;

  // values pending to be set
  pending?: boolean;
  approveFlag: boolean;
  isModelOpen: boolean;
  chooseButton?:string;
  currentTab?:string;
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

  constructor(props: StakingProps & WithTranslation) {
    super(props);
    this.connectWallet = this.connectWallet.bind(this);
    this.disconnectWallet = this.disconnectWallet.bind(this);

    this.state = {
      approveFlag: false,
      approveFlag1: false,
      activeTab: " ",
      isModelOpen: false,
      chooseButton:'General Farming Pools',
      expandingRow:[],
      data:[],
      show:false,
      currentTab:"general"
    };
  }

  handleError(error) {
    ShellErrorHandler.handle(error);
  }

  async confirmStake(step): Promise<void> {

    this.setState({ chooseButton: step });
    // this.setState({ show: !this.state.show});

  }

  componentWillUnmount() {
    if (!!this._timeout) {
      clearTimeout(this._timeout);
    }
    this.updateState({ shoefy: null, looping: false });
  }

  toggleModal = () => {
    this.setState({ isModelOpen: !this.state.isModelOpen });
  };

  async componentDidMount() {
    const urlValue = window.location.hash;
    const hash = urlValue.replace("#", "");
    console.log("Hash value1", hash);
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

        console.log("value of data", data);
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

  private async loop(): Promise<void> {
    const self = this;
    const cont = await self.updateOnce.call(self);

    if (cont) {
      this._timeout = setTimeout(async () => await self.loop.call(self), 1000);
    }
  }

  private async updateOnce(resetCt?: boolean): Promise<boolean> {
    const shoefy = this.readState().shoefy;

    if (!!shoefy) {
      try {
        await shoefy.refresh();
        if (!this.readState().looping) {
          return false;
        }
        if (resetCt) {
          this.updateState({
            address: this.props.wallet._address,
            balance: shoefy.balance,
          });
        } else {
          this.updateState({
            address: this.props.wallet._address,
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
    try {
      this.updateState({ pending: true });
      const wallet = this.props.wallet;
      const result = await wallet.connect();

      if (!result) {
        throw "The wallet connection was cancelled.";
      }
      console.log(wallet);
      const shoefy = new Shoefy(wallet);

      this.updateState({
        shoefy: shoefy,
        wallet: wallet,
        looping: true,
        pending: false,
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
        looping: false,
        pending: false,
        balance: 0,
      });
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  show_detail(index) {
    if (this.state["flag" + index] == false)
      this.setState({ ["flag" + index]: true });
    else {
      this.setState({ ["flag" + index]: false });
    }
  }

  onRapid(){
    this.setState({ activeTab: "rapid" });
    location.replace("/nftFarming#rapid");
    this.setState({ expandingRow:this.state.data.ExpandingRapidRow });
    this.setState({ show: !this.state.show});
    this.setState({ currentTab:'rapid' });
  }

  onGeneral(){
    this.setState({ activeTab: "general" });
    location.replace("/nftFarming#general");
    console.log("Value of rapid",window.location.href);
    this.setState({ expandingRow:this.state.data.ExpandingRow });
    this.setState({ show: !this.state.show});
    this.setState({ currentTab:'general' });

  }

  render() {
    console.log(this.state.isModelOpen);
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
                <NavLink className="link_letter" to="nftFarming">
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
                                    0 ShoeFy don't know 1
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

                {/* <ModelComponentMain/> */}

                <div className="d-flex justify-content-left button-row margin_top">
                  <button
                    className="btn btn-md link-dark"
                    style={{
                      width: "213px",
                      backgroundColor: "#CF3279",
                      color: "white",
                      margin: "0px 16px",
                    }}
                    disabled={state.pending}
                    type="button"
                    onClick={async () => {
                      this.confirmStake(" General Farming Pools")
                    }}
                  >
                    {this.state.currentTab === 'general' ? 'General Farming Pools':'Rapid Farming Pools'}
                    
                  </button>

                  <button
                    className="btn btn-md link-dark"
                    style={{
                      width: "130px",
                      height: "40px",
                      backgroundColor: "#120059",
                      margin: "0px 16px",
                      color: "white",
                    }}
                    disabled={state.pending}
                    type="button"
                    onClick={async () => this.confirmStake("Your Farms")}
                  >
                    {/* {this.state.currentTab === 'rapid' ? 'Your Rapid Farms':'Your Farms'} */}
                    {this.state.currentTab === 'rapid' ? 'Your Farms':'Your Farms'}
                  </button>
                </div>
                  
                {/* General Farming */}
                {!this.state.show && this.state.expandingRow.map((item,index)=>(<ExpandableComponentMain data={item} index={index} key={item.title} currentTab={this.state.currentTab} choosenOption={this.state.chooseButton}/>))}

                {/* Rapid Farming */}
                {this.state.show && this.state.expandingRow.map((item,index)=>(<ExpandableComponentMain data={item} index={index} key={item.title}  currentTab={this.state.currentTab} choosenOption={this.state.chooseButton}/>))}
                
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
