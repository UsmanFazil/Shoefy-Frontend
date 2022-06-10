import * as React from "react";
import { compose } from "recompose";

import { BaseComponent, ShellErrorHandler } from "../../shellInterfaces";

import { Shoefy } from "../../contracts/shoefy";

import { WithTranslation, withTranslation, TFunction } from "react-i18next";

import { fadeInLeft, fadeInRight, pulse } from "react-animations";
import styled, { keyframes } from "styled-components";

import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import CardContainerComponentMain from "./CardContainer";
import { ShoefyFarming } from "../../contracts/shoeFyFarming";
import { Wallet } from "../../wallet";
import { withWallet } from "../../walletContext";

import "./expandableComponent.css";
import { Footer } from "../footer";

import "../../shellNav.css";
import "../../shellNav.icons.css";

import Common_pop from "./ExpandableImage/Common.svg";

// Dynamically change
import Unique from "./ExpandableImage/Unique.svg";
import Rare from "./ExpandableImage/Rare.svg";
import Epic from "./ExpandableImage/Epic.svg";
import Legendary from "./ExpandableImage/Legendary.svg";
import MythicGodsNFT from "./ExpandableImage/MythicGodsNFT.svg";
import MythicDevilsNFT from "./ExpandableImage/MythicDevilsNFT.svg";
import MythicAliensNFT from "./ExpandableImage/MythicAliensNFT.svg";

import green_down from "../../../images/green_down.svg";
import { RowData } from "../nftFarmingComponent";

const Image_Data = {
  Common_pop: Common_pop,
  Unique: Unique,
  Rare: Rare,
  Epic: Epic,
  Legendary: Legendary,
  MythicGodsNFT: MythicGodsNFT,
  MythicDevilsNFT: MythicDevilsNFT,
  MythicAliensNFT: MythicAliensNFT
};

export type StakingProps = {
  choosenOption: string;
  data: RowData;
  currentTab?: string;
  index?: number;
  pending?: boolean;
  propData?:any
};

// Call API
interface TableView {
  id: string;
  title: string;
  tokentoStake: string;
  LockupDuration: string;
}

interface Row {
  title: "string";
  imagePath: "string";
  stakeAmount: "string";
  lockupDuration: "string";
}

export type StakingState = {
  ShoefyFarming?: ShoefyFarming;
  wallet?: Wallet;
  looping?: boolean;
  address?: string;
  balance?: number;
  data: TableView[];
  RowData: Row[];
  userData?:Array;
  propData:[],
  test:''
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

class expandableComponent extends BaseComponent<
  StakingProps & WithTranslation,
  StakingState
> {
  constructor(props: StakingProps & WithTranslation) {
    super(props);

    this.state = {
    
      propData:[],
      test:''
    };
  }

  handleError(error) {
    ShellErrorHandler.handle(error);
  }

  componentDidMount() {
    // const wallet = this.props.wallet;
    // console.log("Value of wallet:::expandable component",wallet)
    try{

    // const testValue = require('./test.json')
    // const {message} = testValue;
    // const {result} = message
     
    // const nftData = []
    // for(let i = 0;i<= result.length-1;i++){          
    // }
    
    // console.log("value of message:::",message,result)  
    // this.setState({userData:result})
    // this.fetchData();

    }
    catch(err){
      console.log("Value of error",err)
    }
    // try{
    // const { title } = this.props.data;
    // // const currentTitle = title.replace(/\s/g, '').toUpperCase()
    // const currentTitle = title.split(" ");
    // const wallet = this.props.wallet;
    // const shoefyFarming = new ShoefyFarming(wallet);

    // if(currentTitle.length > 2){
    //       this.fetchData(shoefyFarming,(currentTitle[0]+currentTitle[1]).toUpperCase())
    //   }else{
    //       this.fetchData(shoefyFarming,(currentTitle[0]).toUpperCase())
    //   }

    // }catch{
    // }
  }

  // async fetchData(){
  //   try{
  //     const { title } = this.props.data;
  //     // const currentTitle = title.replace(/\s/g, '').toUpperCase()
  //     const currentTitle = title.split(" ");
  //     const wallet = this.props.wallet;
  //     console.log("Value of wallet:::expandable component",wallet)
  //     const shoefyFarming = new ShoefyFarming(wallet);

  //     if(currentTitle.length > 2){
  //           const _currentTitle = currentTitle[0]+currentTitle[1]
  //           await shoefyFarming.refresh(this.props.currentTab,_currentTitle.toUpperCase());

  //           this.setState({userData:shoefyFarming.userNFTs})
  //       }else{
  //           const _currentTitle = currentTitle[0]
  //           await shoefyFarming.refresh(this.props.currentTab,_currentTitle.toUpperCase());

  //           this.setState({userData:shoefyFarming.userNFTs})
  //       }
  
  //     }catch(err){
  //       console.log("error occured",err)
  //     }
  // }

  componentWillUnmount() {}

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ test: nextProps.choosenOption });  
  // }
  

  async callApi(){

      try{

      // category 
      const urlValue = window.location.hash;
      const hash = urlValue.replace("#", "");
      const wallet = this.props.wallet;
      console.log("Value of wallet:::expandable component",wallet)
      const shoefyFarming = new ShoefyFarming(wallet);
      // private _categories: Array<string> = [
      //   "COMMON",
      //   "UNIQUE",
      //   "RARE",
      //   "EPIC",
      //   "LEGENDARY",
      //   "MYTHICGOD",
      //   "MYTHICDEVIL",
      //   "MYTHICALIEN"
      // ]
      const { title } = this.props.data;

      console.log("Title expandableComponent::: callApi")
      const currentTitle = title.split(" ");

      if(currentTitle.length > 2){
            const _currentTitle = (currentTitle[0]+currentTitle[1]).toUpperCase();
            console.log("cool not running::::",_currentTitle)

            let resp = await shoefyFarming.apiCall(hash,_currentTitle);   
            this.setState({propData:resp})

        }else{
            const _currentTitle = currentTitle[0].toUpperCase();
            console.log("cool not running::::",_currentTitle)

            let resp = await shoefyFarming.apiCall(hash,_currentTitle);   
            this.setState({propData:resp})
        }
  
      }catch(err){
        console.log("error occured",err)
      }
  }

  show_detail(index,value) {
    if (this.state["flag" + index] === false){
      this.setState({ ["flag" + index]: true });
    // else{
    //   console.log("You dummy i am not working:::else")
    //   }
    }
    else {
      this.setState({ ["flag" + index]: false });
      if(value === "Your Farms" || value  === 'Your Rapid Farms'){
        console.log("You dummy i am not working:::")
        // (this.props.choosenOption === "Your Farms" || this.props.choosenOption  === 'Your Rapid Farms') 
        this.callApi();
      }
      // else{
      //    this.setState({propData:[]})
      // }
    }
  }

  find_type(title) {
    const keyWord = [
      "Common",
      "Unique",
      "Rare",
      "Epic",
      "Legend",
      "Devil",
      "God",
      "Alien",
    ];
    let nftType;

    for (let i = 0; i <= keyWord.length - 1; i++) {
      const val = title.indexOf(keyWord[i]);
      if (val != -1) {
        nftType = keyWord[i];
        break;
      }
    }
    return nftType;
  }

  add_border() {}

  private async updateOnce(resetCt?: boolean): Promise<boolean> {
    const shoefyFarming = this.readState().ShoefyFarming;

    // const value = this.findImage()

    if (!!shoefyFarming) {
      try {
       const value =  await shoefyFarming.refresh();
        console.log("Value of shoefyFarming",value);
        if (resetCt) {
          // this.updateState({
          //   userData: shoefyFarming.userNFTs,
          //   address: this.props.wallet._address,
          //   balance: shoefyFarming.balance,
          // });
        } else {
          // this.updateState({
          //   address: this.props.wallet._address,
          //   balance: shoefyFarming.balance,
          //   userData: shoefyFarming.userNFTs,
          // });
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
      const wallet = this.props.wallet;
      const shoefyFarming = new ShoefyFarming(wallet);

      await shoefyFarming.refresh();

      this.setState({userData:shoefyFarming.userNFTs})

      if (!result) {
        throw "The wallet connection was cancelled.";
      }

      this.updateState({
        ShoefyFarming: shoefyFarming,
        wallet: wallet,
        looping: true,
        pending: false,
      });

      this.updateOnce(true).then();
    } catch (e) {
      this.updateState({ pending: false });
      this.handleError(e);
    }
  }

  render() {
    let detail = ["0px", "0px", "0px", "0px", "", "", "", ""];

    for (let i = 0; i < 4; i++) {
      if (this.state["flag" + i] === false) {
        detail[i] = "";
        detail[4] = "0px 1px 1px 1px";
        detail[5] = "#08f2f1";
        detail[6] = "solid";
        detail[7] = "Show less";
      } else {
        detail[i] = "0px";
        detail[4] = "";
        detail[5] = "";
        detail[6] = "";
        detail[7] = "Show more";
      }
    }

    const { title, Image_Path, stakeAmount, lockUpDuration } = this.props.data;
    const state = this.readState();
    const t: TFunction<"translation"> = this.readProps().t;
    let test = t(title);

    const value = this.props.choosenOption 

    return (
      <div>
        <div className="content-wrapper">
          <div className="expanding-staking-container">
            {/* <div className="container"> */}
            <div>
             
              <div className="row expandable_staking-body">
      
                <FadeInRightDiv className="your_staking remove_top">
                  <div
                    className="each_element remove_bottom"
                    style={{ transition: "0.3s" }}
                  >
                    <div
                      className="expandable_each_up"
                      style={{
                        height: "120px",
                        border: detail[4],
                        borderStyle: detail[6],
                        borderColor: detail[5],
                      }}
                    >
                      <div className="expand_1">
                        <img
                          src={Image_Data[Image_Path]}
                          width="35px"
                          height="35px"
                        />
                      </div>
                      <div className="expandable_nftdetail">
                        <div className="expand0">
                          <div className="e2_down">
                            <span>{title}</span>
                          </div>
                        </div>
                        <div className="expand1">
                          <div className="e2_up">Tokens to stake</div>
                          <div className="e2_down">{stakeAmount}</div>
                        </div>

                        <div className="expand2">
                          <div className="e2_up">Lockup Duration</div>
                          <div className="e2_down">{lockUpDuration}</div>
                        </div>
                      </div>
                      <div
                        className="expand3"
                        onClick={() => this.show_detail(3,value)}
                      >
                        <span>{detail[7]} </span>
                        {value}
                        <img src={green_down} width="14px" height="8px"></img>
                      </div>
                    </div>
                    <div
                      className="expand_down"
                      style={{
                        maxHeight: detail[3],
                        borderTop: detail[0],
                        borderStyle: detail[6],
                        borderColor: detail[5],
                        overflow: "hidden"
                      }}
                    >
                      <div className="col-md-12 d-flex">
                        <div className="d-flex flex-column flex-fill ">
                          <CardContainerComponentMain
                            index={this.props.index}
                            nftType={this.find_type(title)}
                            pending={this.props.pending}
                            choosenOption={value}
                            title={title}
                            currentTab={this.props.currentTab}
                            stakeAmount= {stakeAmount}
                            farmingData={this.state.propData}
                            testOption={value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInRightDiv>
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

// ExpandableComponentWithTranlation
const ExpandableComponentWithTranlation =
  withTranslation()(expandableComponent);

// ExpandableComponentMain
const ExpandableComponentMain = compose(withWallet)(ExpandableComponentWithTranlation);
// ExpandableComponentWithTranlation

export default ExpandableComponentMain;
