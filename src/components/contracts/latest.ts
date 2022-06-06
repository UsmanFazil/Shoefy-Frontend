import { Wallet } from '../wallet';
import { Contract } from 'web3-eth-contract';
import * as web3 from 'web3-utils';
import Web3 from 'web3';

export const ShoeFyAddress = {
	4: "0x8F973d1C33194fe773e7b9242340C3fdB2453b49",
	97: "0x4c687a9158F31321aD76eC7185C458201B375582",
	56: "0xc0F42b31D154234A0A3eBE7ec52c662101C1D9BC"
};

export const StakingAddress = "0x86bdb4ea03f1b5158229c8fd15dca51310dc4661";

export const Staking2Address = {
	4: "0x5a73c86898fe04d4e92eb1b8ed206ba695ffa96e",
	97: "0x9c43e0274f7182d592fb132157ee0d22a8bb3cc4",
	56: "0x799dae1a15f75184700b0cE7DBD74Db6f0699973",
	1 : ""
};

export const SaleAddress = {
	4: "0x55a0451bc9f9d214bf5a7107e71f81138b26dc25",
	97: "0xcb2ef1dd6a8ff15d6f5dc7dd8df247adf3045988"
}

export class Shoefy {
	private readonly _wallet: Wallet;
	private readonly _contract: Contract;
	private readonly _shoeFyContract: Contract; //Token address
	private readonly _stakingContract: Contract;
	private readonly _staking2Contract: Contract;

	private _balance: number = 0;
	private _stake: number = 0;
	private _balance_eth: string = '';
	private _stake2: any = [];
	private _allowance: number = 0;
	private _allowance2: number = 0;

	constructor(wallet: Wallet) {
		this._wallet = wallet;
		this._stakingContract = wallet.connectToContract(StakingAddress, require('./staking.abi.json'));

		this._shoeFyContract = wallet.connectToContract(ShoeFyAddress[this._wallet.getChainId()], require('./shoefy.abi.json')); // token address
		this._staking2Contract = wallet.connectToContract(Staking2Address[this._wallet.getChainId()], require('./staking2.abi.json')); //Staking Address

		this.stake2 = this.stake2.bind(this);
	}

	// Dynamic loading of General Farming
	// need this
	get contract(): Contract {
		return this._contract;
	}

	// need this
	get wallet(): Wallet {
		return this._wallet;
	}

	// need this
	get balance(): number {
		return this._balance;
	}

	// need this
	get balance_eth(): string {
		return this._balance_eth;
	}

	// need this
	get stakedBalance(): number {
		return this._stake;
	}

	// need this 
	get allowance(): number {
		return this._allowance
	}

	get allowance2(): number {
		return this._allowance2
	}
	
	get stakedBalance2(): any {
		return this._stake2;
	}

	// Need this
	async approve(amount: number): Promise<void> {
		console.log("Value of shoefyStaking approve:::",amount);
		let flag = await this._shoeFyContract.methods.approve(StakingAddress, amount).send({ 'from': this._wallet.getAddress() });
		console.log("Value of _shoeFyContract approve",this._shoeFyContract)
		return flag;
	}

	async approve2(amount: any): Promise<void> {
		console.log("Value of shoefyStaking approve2:::",amount);
		let flag = await this._shoeFyContract.methods.approve(Staking2Address[this.wallet.getChainId()], amount).send({ 'from': this._wallet.getAddress() });
		console.log("Value of _shoeFyContract approve2",this._shoeFyContract)
		return flag
	}

	async stake2(amount: number, stakestep: number): Promise<void> {
		console.log("Value of shoefyStaking stake2:::",amount);
		if (this._balance >= amount) {
			await this._staking2Contract.methods.stake(web3.toWei(String(amount), 'ether'), stakestep).send({ 'from': this._wallet.getAddress() });
		}
		else {
			throw 'Your shoefy balance is not sufficient to stake this amount';
		}
	}

	// Need this
	//farmGeneral(bytes32 category_, uint256 farmAmount_)
    //farmRapid(bytes32 category_, uint256 farmAmount_)
	
	async stake(amount: number): Promise<void> {
		console.log("Value of shoefyStaking stake:::",amount);
		await this.refresh();

		if (this._balance >= amount) {
			await this._stakingContract.methods.stakeIn(web3.toWei(String(amount), 'ether')).send({ 'from': this._wallet.getAddress() });
		}
		else {
			throw 'Your shoefy balance is not sufficient to stake this amount';
		}
	}

	async approveSale(amount: number) {
		console.log("Value of shoefyStaking stake:::",amount);
		await this._shoeFyContract.methods.approve(SaleAddress[this._wallet.getChainId()], web3.toWei(String(amount), 'ether')).send({ from: this._wallet.getAddress() });
	}

	async refresh(): Promise<void> {
		let web3 = new Web3(window.ethereum);
		let balance_eth = await web3.eth.getBalance(this._wallet.getAddress());
		console.log("Value of shoefyStaking balance_eth:::",balance_eth);

		this._balance_eth = parseFloat((web3.utils.fromWei(balance_eth, "ether"))).toFixed(3);

		this._balance = Math.floor(await this._shoeFyContract.methods.balanceOf(this._wallet.getAddress()).call() / (10 ** 12)) / (10 ** 6);

		this._allowance2 = await this._shoeFyContract.methods.allowance(this._wallet.getAddress(), Staking2Address[this.wallet.getChainId()]).call() / (10 ** 18);
		console.log(this._allowance2);
		const stakers = await this._staking2Contract.methods.getStakeData(this._wallet.getAddress()).call();
		const time = await this._staking2Contract.methods.getblocktime().call();
		const fees = await this._staking2Contract.methods.totalFee().call() / 1;

		for (let i = 0; i < 3; i++) {
			this._stake2[i] = 0;
		}

		for (let i = 0; i < stakers.amount.length; i++) {
			this._stake2[i] = stakers.amount[i] / Math.pow(10, 18);
		}

		for (let i = 0; i < 3; i++) {
			this._stake2[i] = await this._staking2Contract.methods.lockedBalance(i).call() / Math.pow(10, 18);
			const tokencaps = Math.ceil(await this._staking2Contract.methods.tokencaps(i).call() / Math.pow(10, 18));
		}

	}
}
