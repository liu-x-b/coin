import Vue from 'vue'
const address = require('./address.json')
const freeAbi = require('./freeAbi.json')
const bankerAbi = require('./bankerAbi.json')
const shopAbi = require('./shopAbi.json')
const routerAbi = require('./routerAbi.json')
const IERC20 = require('./IERC20.json')
const Web3 = require('web3')

import big from "big.js";
big.NE = -40
big.PE = 40

let web3 = undefined
let connectedChainId = null
let connectedNetwork = ''
let currWalletAddress = undefined
let connectedMainNetwork 

const initWeb3 = async () => {
  let web3Provider
  let ethereum = window.ethereum
  if (ethereum) {
    await connectMetaMask()
    connectWallet()
  } else if (window.web3) {
    web3Provider = window.web3.currentProvider
    if (typeof web3Provider !== 'undefined') {
      web3 = new Web3(web3Provider)
      getNetwork()
      connectWallet()
      console.log('Connected wallet success!')
    } else {
      console.log('Connected wallet failed!')
    }
  }
}

const connectMetaMask = () => {
  return new Promise((resolve, reject) => {
    let web3Provider
    let ethereum = window.ethereum
    if (ethereum) {
      web3Provider = ethereum
      try {
        // user auth
        if (ethereum.request != undefined) {
          ethereum.request({ method: 'eth_requestAccounts' })
        } else {
          ethereum.enable()
        }
        resolve(true)
      } catch (error) {
        // user not auth
        reject(error && error.message ? error.message : error)
      }
    } else {
      reject('No Ethereum')
    }

    if (typeof web3Provider !== 'undefined') {
      web3 = new Web3(web3Provider)
      getNetwork()
      if (ethereum.isMetaMask) {
        currWalletType = 'MetaMask'
      } else {
        currWalletType = 'Ethereum'
      }
    }
  })
}

const getNetwork = () => {
  if (!web3 || !web3.eth) {
    connectedMainNetwork = false
    connectedNetwork = ''
    connectedChainId = null
    return
  }
  web3.eth.net.getId().then(res => {
    connectedChainId = res
    if (res === 1) {
      connectedMainNetwork = true
      connectedNetwork = 'Main'
    } else if (res === 3) {
      connectedNetwork = 'Ropsten'
    } else if (res === 42) {
      connectedNetwork = 'Kovan'
    } else if (res === 4) {
      connectedNetwork = 'Rinkeby'
    } else if (res === 5) {
      connectedNetwork = 'Goerli'
    } else {
      connectedMainNetwork = false
      connectedNetwork = ''
    }
  })
  

  let oklinkInfo=[{
    chainId: '0x38',
    // chainId: '0x61',
    chainName: 'BSC',
    nativeCurrency:
        {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  }]
  // let oklinkInfo=[{
  //     chainId: '0x4',
  //     chainName: 'Rinkeby',
  //     nativeCurrency:
  //         {
  //             name: 'ETH',
  //             symbol: 'ETH',
  //             decimals: 18
  //         },
  //     rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  //     blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  // }]


  window.ethereum.request({method: 'wallet_addEthereumChain', params:oklinkInfo})
}


const connectWallet = () => {
  return new Promise((resolve, reject) => {
    if (web3 == undefined) {
      currWalletAddress = undefined;
      reject("no wallet")
      return;
    }
    web3.eth.getAccounts().then(accounts => {
      if (accounts.length > 0) {
        currWalletAddress = accounts[0];
      } else {
        currWalletAddress = undefined;
      }
      resolve(currWalletAddress)
    }).catch((err) => {
      currWalletAddress = undefined;
      console.error('web3.eth.getAccounts error :' + err)
      reject(err)
    })
  })
}
initWeb3()

const onEthereumEvent = () => {
  let ethereum = window.ethereum;
  if (ethereum && ethereum.isMetaMask) {
    ethereum.on('accountsChanged', (accounts) => {
      // Handle the new accounts, or lack thereof.
      // "accounts" will always be an array, but it can be empty.
      Vue.prototype.$eventHub.$emit('walletChanged', null);
    });

    ethereum.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have a very good reason not to.
      // window.location.reload();
      Vue.prototype.$eventHub.$emit('walletChanged', null);
      getNetwork();
    });
  }
}
onEthereumEvent();

let contracts = {
  TokenAddress: address.token,
  TokenContract: web3 ? new web3.eth.Contract(IERC20, address.token) : '',
  USDTAddress: address.USDT,
  USDTContract: web3 ? new web3.eth.Contract(IERC20, address.USDT) : '',
  freeAddress: address.free,
  freeContract: web3 ? new web3.eth.Contract(freeAbi, address.free) : '',
  bankerAddress: address.banker,
  bankerContract: web3 ? new web3.eth.Contract(bankerAbi, address.banker) : '',
  shopAddress: address.shop,
  shopContract: web3 ? new web3.eth.Contract(shopAbi, address.shop) : '',
  routerAddress: address.router,
  routerContract: web3 ? new web3.eth.Contract(routerAbi, address.router) : '',
}

const commonCallAndHandler = (method, ...params) => {
  return new Promise((resolve, reject) => {
    method(...params).call({ from: currWalletAddress }).then(result => {
      resolve(result);
    }).catch(error => {
      reject(error);
    })
  })
}


const commonSend = (method, ...params) => {
  return new Promise((resolve, reject) => {
    return method(...params).send({ from: currWalletAddress }).then(result => {
      resolve(result);
    }).catch(error => {
      reject(error);
    })
  })
}

//                     TOKEN
// ?????????
const TokenAllowance = (_address) => { 
  return commonCallAndHandler(contracts.TokenContract.methods.allowance,currWalletAddress, _address);
}

// ?????????
const TokenBalance = () => { 
  return commonCallAndHandler(contracts.TokenContract.methods.balanceOf,currWalletAddress);
}

// ??????
const TokenApprove = ( _address ) => { 
  let bigNumber = web3.utils.toBN;
  var amount = new bigNumber(big('9999999999999999999999').times(10**18));
  return commonSend(contracts.TokenContract.methods.approve,_address,amount );
}

//                      USDT
// ?????????
const USDTAllowance = (_address) => { 
  return commonCallAndHandler(contracts.USDTContract.methods.allowance,currWalletAddress, _address);
}

// ??????
const USDTApprove = ( _address ) => { 
  let bigNumber = web3.utils.toBN;
  var amount = new bigNumber(big('9999999999999999999999').times(10**18));
  return commonSend(contracts.USDTContract.methods.approve,_address,amount );
}

//                     SHOP
// ??????
const shopCharge = (  _amount ) => { 
  let bigNumber = web3.utils.toBN;
  var amount = new bigNumber(big(_amount).times(10**18));
  return commonSend(contracts.shopContract.methods.charge , amount );
}

// ??????
const shopWithdraw = (  _amount ) => { 
  let bigNumber = web3.utils.toBN;
  var amount = new bigNumber(big(_amount).times(10**18));
  return commonSend(contracts.shopContract.methods.withdraw , amount );
}


//                     FREE
// ???????????????
const freeViewHeightPeriods = () => { 
  return commonCallAndHandler(contracts.freeContract.methods.heightPeriods);
}
// ??????????????????
const freeViewGame = ( _periods ) => { 
  return commonCallAndHandler(contracts.freeContract.methods.game,_periods);
} 
// ??????????????????
const freeViewFrontNum = () => { 
  return commonCallAndHandler(contracts.freeContract.methods.frontNum);
} 
// ??????????????????
const freeViewContraryNum = ( ) => { 
  return commonCallAndHandler(contracts.freeContract.methods.contraryNum);
} 
// ??????????????????
const freeViewUser = ( ) => { 
  return commonCallAndHandler(contracts.freeContract.methods.user , currWalletAddress);
} 
// ??????
const freePlay = ( _bool , _amount ) => { 
  let bigNumber = web3.utils.toBN;
  var amount = new bigNumber(big(_amount).times(10**18));
  return commonSend(contracts.freeContract.methods.play,_bool , amount );
}
// ??????
const freeLottery = () => {
  return commonSend(contracts.freeContract.methods.lottery );
}
// ?????????????????????
const freeViewCalc = () => { 
  return commonCallAndHandler(contracts.freeContract.methods.viewCalc ,currWalletAddress);
} 
// ??????????????????
const freeGetMyReward = () => { 
  return commonSend(contracts.freeContract.methods.getMyReward );
} 
// ????????????????????????
const freeViewMyHistoryLength = () => { 
  return commonCallAndHandler(contracts.freeContract.methods.viewMyHistoryLength );
}
// ??????????????????
const freeViewMyHistory = (index) => { 
  return commonCallAndHandler(contracts.freeContract.methods.myHistory,currWalletAddress,index);
}

// ??????????????????
const viewNowTime1 = () => { 
  return commonCallAndHandler(contracts.freeContract.methods.viewTime);
}


//                     banker
// ???????????????
const bankerViewHeightPeriods = () => { 
  return commonCallAndHandler(contracts.bankerContract.methods.heightPeriods);
}
// ??????????????????
const bankerViewGame = ( _periods ) => { 
  return commonCallAndHandler(contracts.bankerContract.methods.game,_periods);
} 
// ??????????????????
const bankerViewFrontNum = () => { 
  return commonCallAndHandler(contracts.bankerContract.methods.frontNum);
} 
// ??????????????????
const bankerViewContraryNum = ( ) => { 
  return commonCallAndHandler(contracts.bankerContract.methods.contraryNum);
} 
// ??????????????????
const bankerViewUser = ( ) => { 
  return commonCallAndHandler(contracts.bankerContract.methods.user , currWalletAddress);
} 
// ??????
const bankerPlay = ( _bool , _amount ) => { 
  let bigNumber = web3.utils.toBN;
  var amount = new bigNumber(big(_amount).times(10**18));
  return commonSend(contracts.bankerContract.methods.play , _bool , amount );
} 
// ??????
const bankerLottery = () => {
  return commonSend(contracts.bankerContract.methods.lottery );
}
// ??????????????????
const bankerNowBanker = () => {
  return commonCallAndHandler(contracts.bankerContract.methods.nowBanker );
}
// ??????
const bankerRob = ( _amount , _front , _contrart) => {
  let bigNumber = web3.utils.toBN;
  var amount = new bigNumber(big(_amount).times(10**18));
  var front = new bigNumber(big(_front).times(10));
  var contrart = new bigNumber(big(_contrart).times(10));
  // console.log(amount,front,contrart)
  return commonSend(contracts.bankerContract.methods.rob , amount , front , contrart );
}
// ?????????????????????
const bankMaxDeposit = (_bool) => {
  return commonCallAndHandler(contracts.bankerContract.methods.viewMaxDeposit , _bool);
}
// ?????????????????????
const bankViewCalc = () => { 
  return commonCallAndHandler(contracts.bankerContract.methods.viewCalc ,currWalletAddress);
} 
// ??????????????????
const bankGetMyReward = () => { 
  return commonSend(contracts.bankerContract.methods.getMyReward );
} 
// ????????????????????????
const bankViewMyHistoryLength = () => { 
  return commonCallAndHandler(contracts.bankerContract.methods.viewMyHistoryLength );
}
// ??????????????????
const bankViewMyHistory = (index) => { 
  return commonCallAndHandler(contracts.bankerContract.methods.myHistory,currWalletAddress,index);
}
// ????????????
const bankerChangeRatio = ( _front , _contrart) => { 
  let bigNumber = web3.utils.toBN;
  var front = new bigNumber(big(_front).times(10));
  var contrart = new bigNumber(big(_contrart).times(10));
  return commonSend(contracts.bankerContract.methods.changeRatio,front,contrart );
} 

// ??????
const bankerQuit = () => { 
  return commonSend(contracts.bankerContract.methods.quit );
} 

// ??????????????????
const viewNowTime2 = () => { 
  return commonCallAndHandler(contracts.bankerContract.methods.viewTime);
}



//                        router
// ??????????????????
const routerViewCalc = () => { 
  return commonCallAndHandler(contracts.routerContract.methods.viewTotalCalc);
}

// ??????
const routerGetReward = () => { 
  return commonSend(contracts.routerContract.methods.getMyTotalReward );
} 




//                     Tool
// ??????????????????
const getConnectedChainId = () => {
  return connectedChainId
}

const getConnectedNetwork = () => {
  return connectedNetwork
}

const getWeb3 = () => {
  return web3
}

const toBigNumber = () => {
  return web3.utils.toBN
}


const getContractsAddress = () => {
  return address
}

const getCurrWalletAddress = () => {
  return currWalletAddress;
}


export default {
  initWeb3,
  connectMetaMask,
  getConnectedChainId,
  getConnectedNetwork,
  getWeb3,
  toBigNumber,
  initWeb3,
  getContractsAddress,
  getCurrWalletAddress,
  connectWallet,

  // nowTime
  viewNowTime1,
  viewNowTime2,

  // token
  TokenAllowance,
  TokenApprove,
  TokenBalance,

  // USDT
  USDTAllowance,
  USDTApprove,

  // shop
  shopCharge,
  shopWithdraw,

  // free
  freeViewHeightPeriods,
  freeViewGame,
  freeViewFrontNum,
  freeViewContraryNum,
  freeViewUser,
  freePlay,
  freeLottery,
  freeViewCalc,
  freeGetMyReward,
  freeViewMyHistoryLength,
  freeViewMyHistory,

  
  // banker
  bankerViewHeightPeriods,
  bankerViewGame,
  bankerViewFrontNum,
  bankerViewContraryNum,
  bankerViewUser,
  bankerPlay,
  bankerLottery,
  bankerNowBanker,
  bankerRob,
  bankMaxDeposit,
  bankViewCalc,
  bankGetMyReward,
  bankViewMyHistoryLength,
  bankViewMyHistory,
  bankerChangeRatio,
  bankerQuit,


  // router 
  routerViewCalc,
  routerGetReward,
}
