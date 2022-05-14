import { Wallet } from '../wallet';
import { Contract } from 'web3-eth-contract';
// import { ethers } from 'ethers';
import * as web3 from 'web3-utils';
import Web3 from 'web3';

export const ShoeFyAddress = {
	4: "0x8F973d1C33194fe773e7b9242340C3fdB2453b49",
	97: "0x4c687a9158F31321aD76eC7185C458201B375582",
	56: "0xc0F42b31D154234A0A3eBE7ec52c662101C1D9BC"
};

export const FarmingAddress = "0x76018d4b5C1410D75c8Ce847c0d576236EA53aA0";

export class ShoefyFarming{
    private readonly _wallet: Wallet;
	private readonly _contract: Contract;
	private readonly _shoeFyContract: Contract;
	private readonly _farmingContract: Contract;

    private _balance: number = 0;
	private _stake: number = 0;
	private _allowance: number = 0;

    constructor(wallet: Wallet) {
		this._wallet = wallet;
		// this._stakingContract = wallet.connectToContract(StakingAddress, require('./staking.abi.json'));
		this._shoeFyContract = wallet.connectToContract(ShoeFyAddress[this._wallet.getChainId()], require('./shoefy.abi.json'));
		this._farmingContract = wallet.connectToContract(FarmingAddress[this._wallet.getChainId()], require('./shoeFyFarming.abi.json'));
        
	}



}