import * as React from "react";
import * as numeral from "numeral";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../shellInterfaces";
import { Wallet } from "../wallet";
import { withWallet } from "../walletContext";

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
import { NavLink, useLocation } from "react-router-dom";
import ExpandableComponentMain from "./Common/expandableComponent";
//  "./Model";
import ModelComponentMain from "./Common/Model";
import "./nftFarmingComponent.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Footer } from "./footer";

import "../shellNav.css";
import "../shellNav.icons.css";

import image from "../../images/CommonNFT.svg";
import down from "../../images/down.png";
import mark from "../../../src/images/mark.png";
import { flexbox } from "@mui/system";

export type StakingProps = {};

// Call API
interface TableView {
  id: string;
  title: string;
  tokentoStake: string;
  LockupDuration: string;
}

export type StakingState = {
  data: TableView[];
  shoefy?: Shoefy;
  wallet?: Wallet;
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

class nftFarmingComponent extends BaseComponent<
  StakingProps & WithTranslation,
  StakingState
> {
  private _timeout: any = null;

  constructor(props: StakingProps & WithTranslation) {
    super(props);

    this.handleStakeSlider = this.handleStakeSlider.bind(this);
    this.handleUnstakeSlider = this.handleUnstakeSlider.bind(this);
    this.handleInputStake = this.handleInputStake.bind(this);
    this.handleInputUnstake = this.handleInputUnstake.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.disconnectWallet = this.disconnectWallet.bind(this);
    this.state = {
      approveFlag: false,
      approveFlag1: false,
    };
  }

  handleStakeSlider(event) {
    this.setStakePercentage(event.target.value);
  }
  handleUnstakeSlider(event) {
    this.setUnstakePercentage(event.target.value);
  }
  handleInputStake(type, event) {
    let temp = event.target.value.toString();
    if (temp[0] === "0") event.target.value = temp.slice(1, temp.length);
    this.setStakeValue(type, event.target.value);
  }
  handleInputUnstake(event) {
    let temp = event.target.value.toString();
    if (temp[0] === "0") event.target.value = temp.slice(1, temp.length);
    this.setUnstakeValue(event.target.value);
  }
  handleError(error) {
    ShellErrorHandler.handle(error);
  }

  async confirmStake(step): Promise<void> {
    if (step >= 0) {
      try {
        const state = this.readState();
        console.log(state.unstakeBlanace2[step]);
        const dates = [30, 60, 90];
        if (state.unstakeBlanace2[step] != 0) {
          NotificationManager.warning(
            `You already staked in ${dates[step]}days`
          );
          return;
        }
        if (state.tokencaps2[step] < state.ctValueStake2[step]) {
          NotificationManager.warning(
            "Staking Balance exceeds Token Cap amount"
          );
          return;
        }
        if (state.ctValueStake2[step] >= 0) {
          this.updateState({ pending: true });
          console.log("ctVa:", state.ctValueStake2[step]);
          await state.shoefy.stake2(state.ctValueStake2[step], step);
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
    } else {
      try {
        const state = this.readState();
        this.updateState({ pending: true });

        if (state.ctValueStake >= 0) {
          //console.log("ctVa:", state.ctValueStake);
          await state.shoefy.stake(state.ctValueStake);

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

  async confirmUnstake(step): Promise<void> {
    try {
      const state = this.readState();
      if (state.unstakable[step] < 0) {
        NotificationManager.warning("Staking period not matured!");
        return;
      }
      if (Number(state.ctValueUnstake2[step]) > 0) {
        this.updateState({ pending: true });

        await state.shoefy.withdraw(step);
        document.getElementById("modalswitch3").click();
      } else {
        NotificationManager.warning("Can't unstake a negative amount.");
        return;
      }

      this.updateState({ pending: false });
      this.updateOnce(true).then();
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  async confirmClaim(): Promise<void> {
    try {
      const state = this.readState();
      this.updateState({ pending: true });

      await state.shoefy.claim();

      this.updateState({ pending: false });
      this.updateOnce(true).then();
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  async confirmApprove(step): Promise<void> {
    try {
      const state = this.readState();
      this.updateState({ pending: true });
      let flag;
      let temp =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      if (step >= 0) {
        flag = await state.shoefy.approve2(temp);
        this.updateState({ pending: false, approveFlag1: flag.status });
      } else {
        flag = await state.shoefy.approve(temp);
        this.updateState({ pending: false, approveFlag: flag.status });
      }
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  componentWillUnmount() {
    if (!!this._timeout) {
      clearTimeout(this._timeout);
    }
    this.updateState({ shoefy: null, looping: false });
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
            ctPercentageStake: 0,
            ctValueStake: 0,
            ctValueStake2: [],
            ctPercentageUnstake: 0,
            ctValueUnstake: 0,
            ctValueUnstake2: [],
            address: this.props.wallet._address,
            balance: shoefy.balance,
            claimedRewards: shoefy.claimRewards,
            stakedBalance: shoefy.stakedBalance,
            stakedBalance2: shoefy.stakedBalance2,
            allowance: shoefy.allowance,
            allowance2: shoefy.allowance2,
            pendingRewards: shoefy.pendingStakeRewards,
            pendingRewards2: shoefy.pendingRewards2,
            claimedRewards2: shoefy.claimedRewards2,
            lockedBalance2: shoefy.lockedBalance2,
            unstakeBlanace2: shoefy.unstakeBlanace2,
            tokencaps2: shoefy.tokencaps,
            apr: shoefy.apr,
            totalclaim: shoefy.totalclaim,
            unstakable: shoefy.unstakable,
          });
        } else {
          this.updateState({
            address: this.props.wallet._address,
            balance: shoefy.balance,
            stakedBalance: shoefy.stakedBalance,
            stakedBalance2: shoefy.stakedBalance2,
            allowance: shoefy.allowance,
            allowance2: shoefy.allowance2,
            pendingRewards: shoefy.pendingStakeRewards,
            apr: shoefy.apr,
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
        ctPercentageStake: 0,
        ctValueStake: 0,
        ctPercentageUnstake: 0,
        ctValueUnstake: 0,
        shoefy: null,
        wallet: null,
        address: null,
        looping: false,
        pending: false,
        balance: 0,
        stakedBalance: 0,
        apr: 0,
      });
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  setStakePercentage(step, percent) {
    const r = this.readState().shoefy;
    if (!r) return;

    const p = Math.max(0, Math.min(+(percent || 0), 100));
    const v = Math.min(r.balance * (p * 0.01), r.balance * 1);
    this.setStakeValue(step, v);
  }

  setUnStakePercentage(percent) {
    const r = this.readState().stakedBalance;
    if (!r) return;

    const p = Math.max(0, Math.min(+(percent || 0), 100));
    const v = Math.min(r * (p * 0.01), r * 1);

    this.updateState({
      ctValueUnstake: v,
    });
  }

  setUnstake2Max(step) {
    let temp = this.readState().ctValueUnstake2;
    temp[step] = this.readState().unstakeBlanace2[step];
    this.updateState({ ctValueUnstake2: temp });
  }

  setStakeValue(step, value) {
    const r = this.readState().shoefy;
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
        ctValueStake2: temp,
      });
      console.log(
        this.readState().ctValueStake2[0],
        this.readState().ctValueStake2[1]
      );
    }
  }
  setUnstakeValue(value) {
    const v = Math.max(
      0,
      Math.min(+(value || 0), this.readState().stakedBalance)
    );
    this.updateState({
      ctValueUnstake: v,
    });
  }

  show_detail(index) {
    if (this.state["flag" + index] == false)
      this.setState({ ["flag" + index]: true });
    else {
      this.setState({ ["flag" + index]: false });
    }
  }

  render() {
    let detail = ["0px", "0px", "0px", "0px"];
    for (let i = 0; i < 4; i++) {
      if (this.state["flag" + i] == false) {
        detail[i] = "";
      } else {
        detail[i] = "0px";
      }
    }

    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;

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
                            className="nav-link active"
                            href="#ctl-stake"
                          >
                            {t("NFTFarming.GeneralFarming.title")}
                          </a>
                        </li>
                        <li role="presentation" className="nav-item">
                          <a
                            role="tab"
                            data-bs-toggle="tab"
                            className="nav-link"
                            href="#ctl-unstake"
                          >
                            {t("NFTFarming.RapidFarming.title")}
                          </a>
                        </li>
                      </ul>

                      {/* from here */}
                      <div className="tab-content">
                        <div
                          role="tabpanel"
                          className="tab-pane active"
                          id="ctl-stake"
                        >
                          {/* Here is the General Tab */}
                          <div className="col-md-12 d-flex">
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
                                    0 ShoeFy
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
                          className="tab-pane"
                          id="ctl-unstake"
                        >
                          {/* Here is the rapid tab */}
                          <div className="col-md-12 d-flex">
                            <div className="shadow d-flex flex-column flex-fill gradient-card primary user-info">
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
                    onClick={async () =>
                      console.log("Clicked General Farming Pool")
                    }
                  >
                    General Farming Pools
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
                    onClick={async () => console.log("Clicked Your Farms ")}
                  >
                    Your Farms
                  </button>
                </div>
                <ExpandableComponentMain />
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
