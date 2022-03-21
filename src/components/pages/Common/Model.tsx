import * as React from 'react';
import * as numeral from 'numeral';
import { compose } from 'recompose';

import { BaseComponent, ShellErrorHandler } from '../../shellInterfaces'

import { WithTranslation, withTranslation, TFunction, Trans } from 'react-i18next';
import 'react-notifications/lib/notifications.css';

import image from "../../../images/CommonNFT.svg"

import './Model.css';

export type StakingProps = {};

// Call API
 interface TableView{
	 id: string,
	 title:string, 
	 tokentoStake:string,
	 LockupDuration:string,
 }

export type StakingState = {

	data: TableView[],
	
};

class Model extends BaseComponent<StakingProps & WithTranslation, StakingState> {

	constructor(props: StakingProps & WithTranslation) {
		super(props);

	    }

	render() {	
		const state = this.readState();
		const t: TFunction<"translation"> = this.readProps().t;

		return (
            <div className="row row-cols-3 nft-container">
            <div className="col nft-item">
              <div className="d-flex nft-img">
                <img src={image} alt="" />
              </div>
              <div className="nft-text">
                <p></p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint quaerat veniam deleniti veritatis aperiam dicta, praesentium a unde dolor quas aliquid. Accusamus at in tempore voluptatum repudiandae et? Hic, ex?</p>
              </div>
              <div className="nft-action">
                <button
                  className="btn btn-primary btn-md link-dark align-self-center stake-confirm"
                  type="button"
                  onClick={async () => {
                    console.log("I am rofl perfect")
                  }}
                >
                  {t("staking.unstake.title")}
                </button>
              </div>
            </div>
          </div>

		)
	}
}

// ExpandableComponentWithTranlation
const ModelComponentWithTranlation = withTranslation()(Model);

// ExpandableComponentMain
const ModelComponentMain = compose(
// ExpandableComponentWithTranlation
)(ModelComponentWithTranlation);

export default ModelComponentMain;