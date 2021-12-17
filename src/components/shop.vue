<template>
  <div>
    <div class="shop">
      <div class="shop-top">
        <div @click="model=0" :class="model == 0 ? 'click modeChange' : 'modeChange'">Buy</div>
        <div @click="model=1" :class="model == 1 ? 'click modeChange' : 'modeChange'">Sell</div>
      </div>
      <div v-if="model == 0">
        <div class="need clearfix">
        	<span class="left">
          Cost :
          </span>
          <span class="right">USDT</span>
          <div class="need-main">
          <input type="text" @input="calcBuy" v-model="buy"/>
          </div>
          
        </div> 
        <div class="get clearfix">
        	<span class="left">
         Get :
         </span>
          <div class="need-main">
         {{ buyGet }} TSB
         </div>
        </div>
        <div class="appove" v-if="AllowanceBuy != 0 && AllowanceBuyBool" @click="buyFn">Buy</div>
        <div class="swap" v-else @click="appoveBuy">Empower</div>
      </div>
      <div v-else>
        <div class="need clearfix">
        	<span class="left">
         Cost :
         </span>
          <span class="right">TSB</span>
          <div class="need-main">
          <input type="text" @input="calcSell" v-model="sell"/>
          </div>
        </div> 
        <div class="get">
          Get : {{ sellGet }} USDT
        </div>
        <div class="appove" v-if="AllowanceSell != 0 && AllowanceSellBool" @click="sellFn">Sell</div>
        <div class="swap" v-else @click="appoveSell">Empower</div>
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

    };
  },
  methods: {
    calcBuy(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.buy = e.target.value.replace(re, "$1");
      } else {
        this.buy = null;
      }
      this.AllowanceBuyBool = !big(this.AllowanceBuy).lt(
        big(this.buy)
      );
      this.buyGet = big(this.buy).times(1000)
    },
    calcSell(e){
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.sell = e.target.value.replace(re, "$1");
      } else {
        this.sell = null;
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
          message: '输入金额不能为零',
          type: 'warning'
        });
        return 
      }
      this.curtain = true;
      this.$contract.shopCharge(this.buy).then(data=>{
        this.buy = null;
        this.buyGet = 0,
        this.$message({
          message: '兑换成功',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('兑换失败');
        this.curtain = false;
      })
    },
    sellFn() { 
      if(this.sell > 0){
      }else { 
        this.$message({
          message: '输入金额不能为零',
          type: 'warning'
        });
        return
      }
      this.curtain = true;
      this.$contract.shopWithdraw(this.sell).then(data=>{
        this.sell = null;
        this.sellGet = 0;
        this.$message({
          message: '兑换成功',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('兑换失败');
        this.curtain = false;
      })

    },
    // 查询授权额度
    queryAllowance() {
      console.log('dasd')
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
    // 授权USDT
    appoveBuy (){
      this.curtain = true;
      this.$contract.USDTApprove(this.$contract.getContractsAddress().shop).then(data => {
        this.$message({
          message: '授权成功',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('授权失败');
        this.curtain = false;
      })
    },
    // 授权Token
    appoveSell (){
      this.curtain = true;
      this.$contract.TokenApprove(this.$contract.getContractsAddress().shop).then(data => {
        this.$message({
          message: '授权成功',
          type: 'success'
        });
        this.curtain = false;
      }).catch(error => {
        this.$message.error('授权失败');
        this.curtain = false;
      })
    },
    // 加载钱包
    loadingData() {
      this.$contract.connectWallet().finally(() => {
        let address = this.$contract.getCurrWalletAddress();
        this.create();
      });
    },
    create() {
      this.queryAllowance()
      clearInterval(this.fnShop);
      this.fnShop = setInterval(this.whileFN, 3000);
    },
    whileFN() {
      this.queryAllowance();
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
.curtain {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
}
input {
  outline: none;
}
.shop {
  width: 400px;
  height: 300px;
  border: 1px solid #fff;
  margin: auto;
  margin-top: 150px;
  border-radius: 10px;
  padding: 50px 100px;
  color: #fff;
}
.shop-top{text-align: center;}
.modeChange {
  text-align: center;
		display: inline-block;
		padding: 6px 20px;
		color: #fff;
		font-weight: 500;
		display: inline-block;
		background-color: #bcd93d;
		font-size: 12px;
		cursor: pointer;
}
.click {
  background-color: #84c225;
		font-size: 14px;
		padding: 8px 30px;
}

.need {
  margin-top: 50px;
}
.get {
  margin-top: 20px
}

.appove {
  width: 100px;
  height: 50px;
  line-height: 50px;
  text-align: center; 
  background-color: #70869c;
  color: #fff;
  margin: auto;
  margin-top: 80px;
  border-radius: 20px;
}
.swap {
  width: 100px;
  line-height: 40px;
  text-align: center;
  background-color: #e77817;
  color: #fff;
  margin: auto;
  margin-top: 80px;
  border-radius: 0px;
  cursor: pointer;
}
.need-main{margin-left: 70px;margin-right: 70px;}
.need-main input{height: 30px;line-height: 30px;width: 100%;-webkit-appearance: none;border-radius: 0;}
.need span{line-height: 30px;}
@media (min-width:1080px) {
	.modeChange:hover,.swap:hover{opacity: 0.8;}
}
@media (max-width:767px) {
	.shop{width: 94%;box-sizing: border-box;padding:50px 10px;margin: 10px auto 30px auto;height: auto;}
	.swap{margin-top: 40px;}
	.need span{font-size: 14px;}
	.need-main{margin-left: 50px;margin-right: 50px;}
}
</style>