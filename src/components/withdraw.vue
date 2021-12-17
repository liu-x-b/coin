<template>
  <div>
    <div class="shop">
      <div class="shop-top">
        <div @click="model=0" :class="model == 0 ? 'click modeChange' : 'modeChange'">PLAY1</div>
        <div @click="model=1" :class="model == 1 ? 'click modeChange' : 'modeChange'">PLAY2</div>
      </div>
      <div v-if="model == 0">
        <div class="get">
          Available : {{ model1Amount }} TSB
        </div>
        <div class="swap" @click="getModel1">Receive</div>
      </div>
      <div v-else>
        <div class="get">
          Available : {{ model2Amount }} TSB
        </div>
        <div class="swap" @click="getModel2">Receive</div>
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
      model1Amount: 0,
      model2Amount: 0
    };
  },
  methods: {
    // 领取1
    getModel1() {
        this.curtain = true;
        this.$contract.freeGetMyReward().then(data => {
          this.$message({
            message: '领取成功',
            type: 'success'
          }); 
          this.curtain = false;
        })
        .catch((error) => {
          this.$message.error('领取失败');
          this.curtain = false;
        })
    },
    // 领取2
    getModel2() {
        this.curtain = true;
        this.$contract.bankGetMyReward().then(data => {
          this.$message({
            message: '领取成功',
            type: 'success'
          }); 
          this.curtain = false;
        })
        .catch((error) => {
          this.$message.error('领取失败');
          this.curtain = false;
        })
    },
    // 查询
    medol1viewCalc() { 
        this.$contract.freeViewCalc().then(data => {
          this.model1Amount = NumSplic(
            big(data)
              .div(10 ** 18)
              .toString(),
            4
          );
        })
    },
    // 查询
    medol2viewCalc() {
        this.$contract.bankViewCalc().then(data => {
          this.model2Amount = NumSplic(
            big(data)
              .div(10 ** 18)
              .toString(),
            4
          );
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
      this.medol1viewCalc()
      this.medol2viewCalc()
      clearInterval(this.fnShop);
      this.fnShop = setInterval(this.whileFN, 3000);
    },
    whileFN() {
      this.medol1viewCalc();
      this.medol2viewCalc();
    },
  },
  mounted() { 
    this.loadingData();
    this.$eventHub.$on("walletChanged", () => {
      this.loadingData();
    });
  },
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
input {
  outline: none;
}
.shop-top{text-align: center;}
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
  margin-top: 50px
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