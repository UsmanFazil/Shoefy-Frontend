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

import Model from "./Model";
import CommonWhale from "./ExpandableImage/CommonWhale.svg";
import CommonTaurus from "./ExpandableImage/CommonTaurus.svg";
import CommonPhoenix from "./ExpandableImage/CommonPhoenix.svg";
import CommonPegasus from "./ExpandableImage/CommonPegasus.svg";

import Card from "./Card";
import "./CardContainer.css";

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
};

class CardContainer extends BaseComponent<
  StakingProps & WithTranslation,
  StakingState
> {
  constructor(props: StakingProps & WithTranslation) {
    super(props);
  }

  render() {
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;

    return (
      <div className="card_container">
        {/* cardImage, cardTitle, cardType, cardSubtitle,  */}
        {/* <Model/> */}

        <div className="row">
          <div className="col-sm-2 col-md-3">
            <Card
              cardImage={CommonPhoenix}
              cardTitle="Phoenix"
              cardType="common"
              cardSubtitle="Fire"
            />
          </div>

          <div className="col-sm-2 col-md-3">
            <Card
              cardImage={CommonTaurus}
              cardTitle="Taurus"
              cardType="common"
              cardSubtitle="Earth"
            />
          </div>

          {/* Stake and Approve */}
          <div className="col-sm-2 col-md-6 mt-4">
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
                    disabled
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
                    disabled={state.pending}
                    type="button"
                    onClick={async () => this.confirmUnstake(2)}
                  >
                    {t("staking.unstake.title")}
                  </button>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label className=" golden-label">
                    One user can farm max. 10 common sNFTs
                  </label>
                </div>
              </form>
            </div>
            {/* <div role="tabpanel" className="tab-pane active mt-4 ml-3 test_container" id="ctl-unstake">
              <form id="unstaking-form">
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
                    disabled
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
                    disabled={state.pending}
                    type="button"
                    onClick={async () => this.confirmUnstake(2)}
                  >
                    {t("staking.unstake.title")}
                  </button>

                  <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label className="form-label right-label">
                    One user can farm max. 10 common sNFTs
                  </label>
                </div>
              
                </div>
              </form>
            </div> */}
          </div>
        </div>

        {/* Second Row */}

        <div className="row">
          <div className="col-sm-2 col-md-3">
            <Card
              cardImage={CommonPegasus}
              cardTitle="Pegasus"
              cardType="common"
              cardSubtitle="Wind"
            />
          </div>

          <div className="col-sm-2 col-md-3">
            <Card
              cardImage={CommonWhale}
              cardTitle="Whale"
              cardType="common"
              cardSubtitle="Water"
            />
          </div>

          {/* Stake and Approve */}
          <div className="col-sm-2 col-md-3"></div>

          <div className="col-sm-2 col-md-3"></div>
        </div>
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
