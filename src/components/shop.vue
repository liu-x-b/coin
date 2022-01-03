<template>
  <div>
    <div class="guess-game">
			Guess<img src="../assets/zheng.png" />Bitcoin Game
	</div>
	<div class="wallte">
		<div class="wallte-link" v-if="myAddress == undefined" @click="linkPay">
			connect wallet
			</div>
			<div class="wallte-link" v-else>{{ myAddress }}</div>
		</div>
	<div class="shopping">
		Shoppingmall
	</div>
	<div class="shop-main">
		<div class="usdt">
			USTD ExchangeTSB&nbsp;&nbsp;&nbsp;1  ：1000
		</div>
		<div class="shop-group clearfix">
			<span class="left">
				Cost：
			</span>
			<span class="right">
				USDT
			</span>
			<div class="shop-group-main">
				<input type="text"  @input="calcBuy" v-model="buy"/>
			</div>
		</div>
		<div class="shop-group clearfix">
			<span class="left color-green">
				Get：{{buyGet}} TSB
			</span>
			<div class="right shop-group-button" v-if="AllowanceBuy != 0" @click="buyFn">
				Exchange
			</div>
			<div class="right shop-group-button" v-else @click="appoveBuy">
				Empower
			</div>
		</div>
		<div class="shop-group clearfix">
			<span class="left colir-red">
				Owned TSB：{{totalReward}} TSB
			</span>
			<div class="right shop-group-button btn-blue" @click="GetRewardFn">
				Withdraw Cash
			</div>
		</div>
		<div class="shop-group clearfix">
			<span class="left">
				Cost：
			</span>
			<span class="right">
				TSB
			</span>
			<div class="shop-group-main">
				<input type="text" @input="calcSell" v-model="sell"/>
			</div>
		</div>
		<div class="shop-group clearfix">
			<span class="left color-green">
				Get：{{ sellGet }} USDT
			</span>
			<div class="right shop-group-button btn-blue" v-if="AllowanceSell != 0" @click="sellFn">
				Withdraw Cash
			</div>
			<div class="right shop-group-button btn-blue" v-else @click="appoveSell">
				Empower
			</div>
		</div>
	</div>
    <div v-show="curtain" class="curtain"></div>
  </div>
</template>

<script>
import big from "big.js";
big.NE = -40
big.PE = 40
import { NumSplic } from "../unit/tool";
export default {
  data() {
    return {
	  myAddress: undefined,
	  myAddressAll: undefined,
      curtain: false,
      model: 0,
      buy: null,
      buyGet: 0,
      AllowanceBuy: 0,
      AllowanceBuyBool : true,
      sell: null,
      sellGet: 0,
      AllowanceSell: 0,
      AllowanceSellBool : true,


      // 可领取奖励
      totalReward: 0,
    };
  },
  methods: {
	// 连接钱包
	linkPay() {
		this.$contract.initWeb3();
	},
	// 加载钱包
	loadingData() {
		this.$contract.connectWallet().finally(() => {
			let address = this.$contract.getCurrWalletAddress();
			this.create();
			if(address != undefined) {
				this.myAddress = address.substr(0, 4) + "..." + address.substr(38, 4);
			} else {
				this.myAddress = address;
			}
			this.myAddressAll = address
		});
	},
    calcBuy(e) {
      if (e.target.value > 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.buy = e.target.value.replace(re, "$1");
      } else {
        this.buy = 0;
      }
      this.AllowanceBuyBool = !big(this.AllowanceBuy).lt(
        big(this.buy)
      );
      this.buyGet = big(this.buy).times(1000)
    },
    calcSell(e){
      if (e.target.value > 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.sell = e.target.value.replace(re, "$1");
      } else {
        this.sell = 0;
      }
      this.AllowanceSellBool = !big(this.AllowanceSell).lt(
        big(this.sell)
      );
      this.sellGet = big(this.sell).div(1000).times(0.95)
    },
    buyFn(){ 
      if(this.buy > 0){
      }else{
        this.$message({
          message: 'The input amount cannot be zero',
          type: 'warning'
        });
        return 
      }
      this.curtain = true;
      this.$contract.shopCharge(this.buy).then(data=>{
        this.buy = null;
        this.buyGet = 0,
        this.$message({
          message: 'For successful',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('For failure');
        this.curtain = false;
      })
    },
    GetRewardFn(){ 
      if(this.totalReward == 0){ 
        this.$message({
          message: 'For failure',
          type: 'warning'
        });
        return 
      }
      this.curtain = true;
      this.$contract.routerGetReward().then(data=>{  
        this.$message({
          message: 'Get the success',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('Get the failure');
        this.curtain = false;
      })
    },
    sellFn() { 
      if(this.sell > 0){
      }else { 
        this.$message({
          message: 'The input amount cannot be zero',
          type: 'warning'
        });
        return
      }
      this.curtain = true;
      this.$contract.shopWithdraw(this.sell).then(data=>{
        this.sell = null;
        this.sellGet = 0;
        this.$message({
          message: 'For successful',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('For failure');
        this.curtain = false;
      })

    },
    // 查询授权额度
    queryAllowance() {
      // console.log('dasd')
      // Token
      this.$contract
        .USDTAllowance(this.$contract.getContractsAddress().shop)
        .then((data) => {
          this.AllowanceBuy =
            NumSplic(
              big(data)
                .div(10 ** 18)
                .toString(),
              2
            ) - 0;
        });
      // USDT
      this.$contract
        .TokenAllowance(this.$contract.getContractsAddress().shop)
        .then((data) => {
          this.AllowanceSell =
            NumSplic(
              big(data)
                .div(10 ** 18)
                .toString(),
              2
            ) - 0;
        });
    },
    routerViewCalcFn() { 
      this.$contract
        .routerViewCalc()
        .then((data) => {
          this.totalReward = 
              big(data)
                .div(10 ** 18)
                .toString() 
        });
    },
    // 授权USDT
    appoveBuy (){
      this.curtain = true;
      this.$contract.USDTApprove(this.$contract.getContractsAddress().shop).then(data => {
        this.$message({
          message: 'Authorization success',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('Authorization failure');
        this.curtain = false;
      })
    },
    // 授权Token
    appoveSell (){
      this.curtain = true;
      this.$contract.TokenApprove(this.$contract.getContractsAddress().shop).then(data => {
        this.$message({
          message: 'Authorization success',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('Authorization failure');
        this.curtain = false;
      })
    },
    create() {
      this.queryAllowance()
      this.routerViewCalcFn()
      clearInterval(this.fnShop);
      this.fnShop = setInterval(this.whileFN, 3000);
    },
    whileFN() {
      this.queryAllowance();
      this.routerViewCalcFn()
    },
  },
  mounted() { 
    this.loadingData();
    this.$eventHub.$on("walletChanged", () => {
      this.loadingData();
    });
  },
  beforeDestroy() {
    clearInterval(this.fnShop);
  }
};
</script>

<style scoped>

.curtain {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
}
	.color-green{color: #84c225!important;}
	.colir-red{color: #da251d!important;}
	.btn-blue{background: #0093dd!important;}
	.wallte {
		text-align: center;
	}
	
	.wallte .wallte-link {
		display: inline-block;
		font-size: 14px;
		color: #db137a;
		padding: 10px 0px 0px 0px;
	}
	.shop-group-button{display: inline-block;line-height: 38px;color: #fff;font-size: 14px;padding: 0 6px;background: #eb3d00;cursor: pointer;}
	.usdt{color: #eb3d00;font-size: 14px;margin-bottom: 20px;}
	.shop-main{border: 1px solid #fff;border-radius: 5px;padding: 15px;box-sizing: border-box;width: 500px;margin: 0 auto;margin-bottom: 220px;}
	.shopping{font-size: 18px;color: #6ac334;text-align: center;margin: 14px 0px;}
.guess-game {
		text-align: center;
		font-size: 22px;
		color: #fff;
		margin-top: 20px;
	}
	input:focus{outline: none;}
	.shop-group{margin-bottom: 20px;}
	.shop-group-main{margin-left: 45px;margin-right: 45px;}
	.shop-group span{font-size: 14px;color: #fff;line-height: 38px;}
	.shop-group-main input {
		-webkit-appearance: none;
		color: #333;
		height: 38px!important;
		border-radius: 0;
		width: 100%;
		background: #fff;
		border: none;
		font-size: 14px;
		line-height: 38px;
		box-sizing: border-box;
		padding: 0 10px;
	}
	.guess-game img {
		width: 20px;
		vertical-align: middle;
		margin: 0 5px;
	}
	@media (max-width:767px) {
		.shop-main{width: 94%;}
		.shop-group-main input{height: 40px!important;line-height: 40px;}
		.shop-group span{line-height:  40px;}
		.shop-group-button{line-height: 40px;}
	}
	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
	}
	/* Hides from IE-mac \*/
	
	*:first-child+html .clearfix {
		zoom: 1;
	}
	/* IE7 */
	
	* html .clearfix {
		height: 1%;
		zoom: 1;
	}
	
	.clearfix {
		display: block;
	}
	
	.left {
		float: left;
	}
	
	.right {
		float: right;
	}

</style>