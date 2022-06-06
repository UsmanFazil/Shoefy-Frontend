// let's use React.js
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
// import {createWeb3ReactRoot, Web3ReactProvider} from '@web3-react/core';

// and bootstrap
import 'bootstrap';

// with our own theme
import './index.css';

// with custom packages for the fallback loader
import { ClipLoader } from 'react-spinners';
import { css } from 'styled-components';

// now all the components
import { Shell } from './components/shell';
import Dashboard from './components/pages/dashboard/dashboard';
import StakingComponent from './components/pages/stakingComponent'; //this one to copy
import Staking2Component from './components/pages/staking2Component';
// nftFarmingComponent
import NFTStakingComponent from './components/pages/nftStakingComponent';
import nftFarmingComponent from './components/pages/nftFarmingComponent';

import Chart from './components/pages/chart';
import Comming from './components/pages/comming';
import Sales from './components/pages/Sales';

import { Wallet } from './components/wallet';
import WalletContext from './components/walletContext.js';
import './i18n';

const pagesInNavigator = [
    { id: 'home', title: 'Home', component: Dashboard },
    { id: 'shoefyStaking', title: 'NFT Staking', component: StakingComponent }, //this one to copy
    { id: 'snftStaking', title: 'SHOE Staking', component: NFTStakingComponent },
    // { id: 'nftStaking', title: 'Farm', component: NFTStakingComponent},
    { id: 'nftStaking', title: 'Farm', component: Comming },
    { id: 'shoefyStaking2', title: 'Booster NFTsdadads', component: Staking2Component},
    { id: 'boosterNFT', title: 'Booster NFTs', component: Comming },
    { id: 'nftFarming', title: 'nft Farming', component: nftFarmingComponent }, // paste here
    { id: 'chart', title: 'Chart', component: Chart },
    { id: 'sales', title: 'Sales', component: Sales },
];

// pagesInNavigator
// position: relative;
// width: 280px;
// height: 148px;

const overrideCss = css `
	margin-left: 50%
`;

// import {getLibrary} from './utils/getLibrary';

// const NetworkContextName = `${new Date().getTime()}-NETWORK`;
// const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

{ /*<Web3ReactProvider getLibrary={getLibrary}>*/ }

// initialize modals
Modal.setAppElement('#root');
// and render our app into the "root" element!

ReactDOM.render( <
        WalletContext.Provider value = { new Wallet() } >
        <
        React.Suspense fallback = { < ClipLoader color = { "#FFFFFF" }
            css = { overrideCss }
            />}> <
            Shell pages = { pagesInNavigator }
            /> <
            /React.Suspense> <
            /WalletContext.Provider>,
            document.getElementById('root')
        );