import * as React from 'react';
import * as numeral from 'numeral';

import { BaseComponent, ShellErrorHandler } from '../shellInterfaces';
import { Wallet } from '../wallet';
import { ShoefyNFTStaking } from '../contracts/nftStaking';
import { WithTranslation, withTranslation, TFunction, Trans } from 'react-i18next';
import { fadeInLeft, fadeInRight, pulse } from 'react-animations';
import styled, { keyframes } from 'styled-components';
import AnimatedNumber from 'animated-number-react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export type StakingProps = {
};

export type StakingState = {
	nftStaking?: ShoefyNFTStaking,
	wallet?: Wallet,
	looping?: boolean,

	// actual set values
	address?: string,
	balance?: number,
	balance_eth?: number,
	stakedBalance?: number,
	pendingRewards?: number,
	userNFTs?: Array<any>,
	stakedNFTs?: Array<any>,
	apr?: number,

	// values pending to be set
	ctPercentageStake?: number,
	ctValueStake?: number,
	ctPercentageUnstake?: number,
	ctValueUnstake?: number,
	pending?: boolean
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

class NFTStakingComponent extends BaseComponent<StakingProps & WithTranslation, StakingState> {

	private _timeout: any = null;

	constructor(props: StakingProps & WithTranslation) {
		super(props);

		this.state = {
			
		};
	}

	handleError(error) {
		ShellErrorHandler.handle(error);
	}

	async confirmStake(_id): Promise<void> {
		try {
			
			console.log("Value of the stake",_id)

		}
		catch (e) {
			this.handleError(e);
		}
	}

	async confirmUnstake(_id): Promise<void> {
		try {
			const state = this.readState();
			this.updateState({ pending: true });

			if (state.stakedNFTs.length > 0) {
				await state.nftStaking.unstakeAndClaim(_id);
			}
			else {
				NotificationManager.warning("Can't unstake a negative id.");
				return;
			}

			this.updateState({ pending: false });
			this.updateOnce(true).then();
		}
		catch (e) {
			this.updateState({ pending: false });
			this.handleError(e);
		}
	}

	async confirmClaimRewards(): Promise<void> {
		try {
			const state = this.readState();
			this.updateState({ pending: true });

			await state.nftStaking.claim();

			this.updateState({ pending: false });
			this.updateOnce(true).then();
		}
		catch (e) {
			this.updateState({ pending: false });
			this.handleError(e);
		}
	}

	async componentDidMount() {
		if (window.ethereum) {
			const accounts = await window.ethereum
				.request({ method: 'eth_accounts' })
			if (accounts.length == 0) console.log("User is not logged in to MetaMask");
			else {
				const chainid = Number(await window.ethereum.request({ method: 'eth_chainId' }));
				if (chainid === 56 || chainid === 5 || chainid === 97)
                    this.props.wallet.setChainId(Number(chainid));
                this.connectWallet();
			}
		}
	}

	componentWillUnmount() {
		if (!!this._timeout) {
			clearTimeout(this._timeout);
		}
		this.updateState({ nftStaking: null, looping: false });
	}

	private async loop(): Promise<void> {
		const self = this;
		const cont = await self.updateOnce.call(self);

		if (cont) {
			this._timeout = setTimeout(async () => await self.loop.call(self), 1000);
		}
	}
	
	private async updateOnce(resetCt?: boolean): Promise<boolean> {
		const nftStaking = this.readState().nftStaking;

		if (!!nftStaking) {
			try {
				await nftStaking.refresh();
				if (!this.readState().looping) {
					return false;
				}
				this.updateState({
					address: nftStaking.wallet.currentAddress,
					userNFTs: nftStaking.userNFTs,
					stakedNFTs: nftStaking.stakedNFTs,
					pendingRewards: nftStaking.pendingStakeRewards,
					apr: nftStaking.apr,
					balance_eth: nftStaking.balance_eth,
				});

				if (resetCt) {
					this.updateState({
						ctPercentageStake: 0,
						ctValueStake: 0,
						ctPercentageUnstake: 0,
						ctValueUnstake: 0
					})
				}

			}
			catch (e) {
				console.warn('Unable to update staking status', e);
			}
		}
		else {
			return false;
		}

		return true;
	}

	async connectWallet() {
		try {
			this.updateState({ pending: true });
			const wallet = new Wallet();
			const result = await wallet.connect();

			if (!result) {
				throw 'The wallet connection was cancelled.';
			}

			const nftStaking = new ShoefyNFTStaking(wallet);
			await nftStaking.refresh();

			this.updateState({ nftStaking: nftStaking, wallet: wallet, looping: true, pending: false });
			this.updateOnce(true).then();

			this.loop().then();
		}
		catch (e) {
			this.updateState({ pending: false });
			this.handleError(e);
		}
	}

	render() {
		const state = this.readState();
		const t: TFunction<"translation"> = this.readProps().t;

		return <div className="staking-container">

			<div className="container">
				
				<div className="col staking-body mt-5">
				
					<FadeInRightDiv className="col-md-12 d-flex mt-5">
						<div className="shadow d-flex flex-column flex-fill gradient-card dark">
							<div style={{ margin: "-20px" }}>
							<ul role="tablist" className="nav nav-tabs" style={{ padding: "10px", paddingBottom: "0" }}>
									<li role="presentation" className="nav-item"><a role="tab" data-bs-toggle="tab" className="nav-link active" href="#ctl-stake">{t('staking.stake.title')}</a></li>
									<li role="presentation" className="nav-item"><a role="tab" data-bs-toggle="tab" className="nav-link" href="#ctl-unstake">{t('staking.unstake.title')}</a></li>
								</ul>
								<div className="tab-content">
									<div role="tabpanel" className="tab-pane active" id="ctl-stake">
										<div className="row row-cols-3 nft-container">
											{
												state.userNFTs && state.userNFTs.map((item) => (
													<div className="col nft-item">
														<div className="d-flex nft-img">
															<img src={item.img} alt="" />
														</div>
														<div className="nft-text">
															<p>{item.title}</p>
															<p>{item.description}</p>
														</div>
														<div className="nft-action">
															<button className="btn btn-primary btn-md link-dark align-self-center stake-confirm" type="button" onClick={() => {console.log("I am perfect")}}>{t('staking.stake.title')}</button>
														</div>
													</div>
												))
											}
										</div>
									</div>
									<div role="tabpanel" className="tab-pane" id="ctl-unstake">
										<div className="row row-cols-3 nft-container">
											{
												state.stakedNFTs && state.stakedNFTs.map((item) => (
													<div className="col nft-item">
														<div className="d-flex nft-img">
															<img src={item.img} alt="" />
														</div>
														<div className="nft-text">
															<p>{item.title}</p>
															<p>{item.description}</p>
														</div>
														<div className="nft-action">
														<button className="btn btn-primary btn-md link-dark align-self-center stake-confirm" type="button" onClick={async () => {console.log("I am perfect")}}>{t('staking.unstake.title')}</button>
														</div>
													</div>
												))
											}
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
	}
}

export default withTranslation()(NFTStakingComponent);
