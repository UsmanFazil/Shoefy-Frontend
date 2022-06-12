import { Wallet } from "../wallet";
import { Contract } from "web3-eth-contract";
// import { ethers } from 'ethers';
import * as web3 from "web3-utils";
import Web3 from "web3";
import { requestAPICall,requestAPICallBody } from "../../helpers/apiService";

export const ShoeFyAddress = {
	4: "0x8F973d1C33194fe773e7b9242340C3fdB2453b49",
	97: "0x4c687a9158F31321aD76eC7185C458201B375582",
	56: "0xc0F42b31D154234A0A3eBE7ec52c662101C1D9BC",
};

export const FarmingAddress = "0x005152D60516D761112A284ec623FB72d6FE12E0";

export class ShoefyFarming {
	private readonly _wallet: Wallet;
	private readonly _contract: Contract;
	private readonly _shoeFyContract: Contract;
	private readonly _farmingContract: Contract;
	private _userNFTs: Array<any> = [];
	private _balance_eth: string = "";

	private _stake: number = 0;
	private _stake2: any = [];
	private _allowance: number = 0;
	private _allowance2: number = 0;
	private _balance: number = 0;

	constructor(wallet: Wallet) {
		this._wallet = wallet;
		// this._stakingContract = wallet.connectToContract(StakingAddress, require('./staking.abi.json'));
		this._shoeFyContract = wallet.connectToContract(
			ShoeFyAddress[this._wallet.getChainId()],
			require("./shoefy.abi.json")
		);
		this._farmingContract = wallet.connectToContract(
			FarmingAddress,
			require("./shoeFyFarming.abi.json")
		);
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
		return this._allowance;
	}

	get userNFTs(): Array<any> {
		return this._userNFTs;
	}

	get allowance2(): number {
		return this._allowance2;
	}

	get stakedBalance2(): any {
		return this._stake2;
	}

	// Need this
	async approve(amount: string): Promise<void> {
		console.log("Value of shoefyStaking approve:::", amount);
		let flag = await this._shoeFyContract.methods
			.approve(FarmingAddress, amount)
			.send({ from: this._wallet.getAddress() });
		console.log("Value of _shoeFyContract approve", this._shoeFyContract);
		return flag;
	}

	// farmNFT(bytes32 category_, uint256 farmAmount_, bool generalFarm_)
	// harvestNFT(uint256[] memory farmIds_,string[] memory tokenURIs_,bytes[] memory signatures_,bool generalFarm_)

	async stakefarmGeneral(amount: number, category: string): Promise<void> {
		await this.refresh();
		if (this._balance >= amount) {
			console.log("value of farmamount", category);
			await this._farmingContract.methods
				.farmNFT(category, amount, true)
				.send({ from: this._wallet.getAddress() });
		} else {
			throw "Your shoefy balance is not sufficient to stake this amount";
		}
	}

	async stakefarmRapid(amount: number, category: string): Promise<void> {
		await this.refresh();
		if (this._balance >= amount) {
			console.log("value of farmamount", category);
			await this._farmingContract.methods
				.farmNFT(category, amount, false)
				.send({ from: this._wallet.getAddress() });
		} else {
			throw "Your shoefy balance is not sufficient to stake this amount";
		}
	}

	async stake(amount: number): Promise<void> {
		await this.refresh();

		if (this._balance >= amount) {
			await this._farmingContract.methods
				.stakeIn(web3.toWei(String(amount), "ether"))
				.send({ from: this._wallet.getAddress() });
		} else {
			throw "Your shoefy balance is not sufficient to stake this amount";
		}
	}

	async apiCall(tabtype?: string, _categoryType?: string):Promise<any>{

		if (tabtype == undefined || _categoryType == undefined){
			return
		}

		const testAddress = "0x4d23c8E0e601C5e37b062832427b2D62777fAEF9";
		let web3 = new Web3(window.ethereum);
		const userAddress = this._wallet.getAddress();

		const apiURL = "http://3.120.204.209:3000/api/auth/getFarms/userAddress/";

		const URL = `${	apiURL +testAddress +"/typeNFT/" +tabtype +
			"/category/" +
			_categoryType
		}`;

		const returnData =[];

		try {
			this._userNFTs = await requestAPICall(URL).then((res) => {
				return res.data;
			});
			return this._userNFTs;

		} catch (err) {
			console.log("Value from expandableComponent inside fetchData", err);
		}
	}

	async harvestApiCall(tabtype?: string, _categoryType?: string,data?:any):Promise<any>{
		console.log("harvestApiCall:::",tabtype);
		console.log("harvestApiCall:::",_categoryType);
		console.log("harvestApiCall:::",data)

		if (tabtype == undefined || _categoryType == undefined){
			return
		}

		const userData = {
			farmIds:data
		  }
		  
		const testAddress = "0x4d23c8E0e601C5e37b062832427b2D62777fAEF9";
		let web3 = new Web3(window.ethereum);
		const userAddress = this._wallet.getAddress();

		

		// http://3.120.204.209:3000/api/auth/getSigns/userAddress/0x4d23c8E0e601C5e37b062832427b2D62777fAEF9/typeNFT/general/category/COMMON
		// http://3.120.204.209:3000/api/auth/getSigns/userAddress/0x4d23c8E0e601C5e37b062832427b2D62777fAEF9/typeNFT/general/category/COMMON
		// const apiURL = `http://3.120.204.209:3000/api/auth/getSigns/userAddress/${userAddress}/typeNFT/${tabtype}/category/${_categoryType}`;
		const apiURL = `http://3.120.204.209:3000/api/auth/getSigns/userAddress/${testAddress}/typeNFT/${tabtype}/category/${_categoryType}`;


		console.log("harvestApiCall:::",apiURL)

		const returnData =[];

		try {
			this._userNFTs = await requestAPICallBody(apiURL,userData).then((res) => {
				return res.data;
			});
			return this._userNFTs;

		} catch (err) {
			console.log("Value from expandableComponent inside fetchData", err);
		}
	}

	async refresh(): Promise<void> {
	
		let web3 = new Web3(window.ethereum);
		let balance_eth = await web3.eth.getBalance(this._wallet.getAddress());

		//Math to 3 decimals
		const truncateByDecimalPlace = (value, numDecimalPlaces) =>
			Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
			Math.pow(10, numDecimalPlaces);

		this._balance_eth = parseFloat(
			web3.utils.fromWei(balance_eth, "ether")
		).toFixed(3);

		this._balance = Math.floor(
				(await this._shoeFyContract.methods
					.balanceOf(this._wallet.getAddress())
					.call()) /
					10 ** 12
			) /
			10 ** 6;

		this._allowance2 =
			(await this._shoeFyContract.methods.allowance(this._wallet.getAddress(), FarmingAddress).call()) /10 ** 18;

		
		// const nftData = await requestAPICall(tokenURI).then(res => {
		// 	// console.log('IPFS Data', res.data)
		// 	return res.data
		// })

		// parseInt
		// const stakers = await this._staking2Contract.methods.getStakeData(this._wallet.getAddress()).call();
		// const time = await this._staking2Contract.methods.getblocktime().call();
		// const fees = await this._staking2Contract.methods.totalFee().call() / 1;
		// const claims = await this._staking2Contract.methods.totalreward.call().call() / Math.pow(10, 18);

		// for (let i = 0; i < 3; i++) {
		// 	this._unstakable[i] = -1;
		// 	this._stake2[i] = 0;
		// }
	}
}
