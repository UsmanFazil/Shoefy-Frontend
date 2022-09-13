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

export const FarmingAddress = "0xeba88d7B2A100c58d246c9482AED4B835af0Bce0";

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
	private _userlimit: number;
	private _poollimit:number;

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

	async stakefarmGeneral(amount: number, category: string): Promise<void> {
		await this.refresh();
		if (this._balance >= amount) {
			await this._farmingContract.methods
				.farmNFT(category, amount, true)
				.send({ from: this._wallet.getAddress() });
		} else {
			throw "Your shoefy balance is not sufficient to stake this amount";
		}
	}

	async harvestfarmGeneral(farmIds:any, tokenURIs:any, signatures:any): Promise<void> {
		await this.refresh();
		if (this._balance >0) {
			
			await this._farmingContract.methods
				.harvestNFT(farmIds, tokenURIs,  signatures, true)
				.send({ from: this._wallet.getAddress() });
		} else {
			throw "Your shoefy balance is not sufficient to stake this amount";
		}
	}

		async harvestfarmRapid(farmIds:any, tokenURIs:any, signatures:any): Promise<void> {

			await this.refresh();
			if (this._balance >0) {
				
				await this._farmingContract.methods
					.harvestNFT(farmIds, tokenURIs,  signatures, false)
					.send({ from: this._wallet.getAddress() });
			} else {
				throw "Your shoefy balance is not sufficient to stake this amount";
			}
		}


	async stakefarmRapid(amount: number, category: string): Promise<void> {
		await this.refresh();
		if (this._balance >= amount) {
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

	async getUserLimit(tabtype?: boolean, _categoryType?: any):Promise<any>{
     	const valueReturned = 	await this._farmingContract.methods
				.getUserLimit(_categoryType, tabtype)
				.call();

		const updatedValue = await this._farmingContract.methods.generalFarmsUsed(this._wallet.getAddress(), _categoryType).call();

		this._userlimit = valueReturned;
		return valueReturned

	}

	async getUserGeneralLimit(tabtype?: boolean, _categoryType?: any):Promise<any>{
		console.log("Value of catergory input",tabtype,_categoryType)

		const updatedValue = await this._farmingContract.methods.generalFarmsUsed(this._wallet.getAddress(), _categoryType).call();
		console.log("Value of upated Value",updatedValue);

		this._userlimit = updatedValue;
		console.log("Value of this._wallet.getAddress()",this._wallet.getAddress(),tabtype,_categoryType)
		return updatedValue

	}

	async getUserRapidLimit(tabtype?: boolean, _categoryType?: any):Promise<any>{
		const updatedValue = await this._farmingContract.methods.rapidFarmsUsed(this._wallet.getAddress(), _categoryType).call();

		this._userlimit = updatedValue;
		return updatedValue
	}

	async generalFarmsLeft( _categoryType?: any):Promise<any>{
		const valueReturned = 	await this._farmingContract.methods
					.generalFarmsLeft(_categoryType)
					.call();
			this._poollimit = valueReturned;
			return valueReturned
	
		}
		
	async rapidFarmsLeft(_categoryType?: any):Promise<any>{
		const valueReturned = 	await this._farmingContract.methods
					.rapidFarmsLeft(_categoryType)
					.call();
	
			this._poollimit= valueReturned;
			return valueReturned;
	
	}

	async apiCall(tabtype?: string, _categoryType?: string):Promise<any>{
		console.log("Value inside parameters::::",tabtype,_categoryType)
		if (tabtype == undefined || _categoryType == undefined){
			return
		}

		let web3 = new Web3(window.ethereum);
		const userAddress = this._wallet.getAddress();

		const apiURL = "http://3.120.204.209:3000/api/auth/getFarms/userAddress/";

		const URL = `${	apiURL +userAddress +"/typeNFT/" +tabtype +
			"/category/" +
			_categoryType
		}`;

		try {
			return this._userNFTs = await requestAPICall(URL).then((res) => {
				return res.data;
			});
		} catch (err) {
			console.log("Value from expandableComponent inside fetchData", err);
		}
	}

	async harvestApiCall(tabtype?: string, _categoryType?: string,data?:any):Promise<any>{
		if (tabtype == undefined || _categoryType == undefined){
			return
		}

		const sample = [];

		data.forEach(element => {
			sample.push(element.farmId)
		});

		const userData = {
			farmIds:sample
		}
		  
		let web3 = new Web3(window.ethereum);
		const userAddress = this._wallet.getAddress();

		const apiURL = `http://3.120.204.209:3000/api/auth/getSigns/userAddress/${userAddress}/typeNFT/${tabtype}/category/${_categoryType}`;
		try {
			this._userNFTs = await requestAPICallBody(apiURL,userData).then((res) => {
				const {data} = res;
				const {message} = data;

				let farmIdArray = [];
				let signArray = [];
				let tokenURIArray = [];

				message.forEach((element) => {
					farmIdArray.push(element.farmId)
					signArray.push(element.sign)
					tokenURIArray.push((element.tokenURI))
				})

				if(tabtype === 'rapid'){
				   return this.harvestfarmRapid(farmIdArray,tokenURIArray,signArray)
				}else{
				   return this.harvestfarmGeneral(farmIdArray,tokenURIArray,signArray)
				}
				
			});

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
