<template>
  <div>
    <div class="top">
      <div class="topLeft">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link topLeftA">
          菜单
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="to('/')">游戏</el-dropdown-item>
          <el-dropdown-item @click.native="to('/shop')">商城</el-dropdown-item>
          <el-dropdown-item @click.native="to('/withdraw')">提现</el-dropdown-item>
          <el-dropdown-item @click.native="to('/history')">资金记录</el-dropdown-item>
          <el-dropdown-item>分享</el-dropdown-item>
          <el-dropdown-item>帮助</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
      <div class="topRight" v-if="myAddress == undefined" @click="linkPay">钱包连接</div>
      <div class="topRightAddress" v-else>{{ myAddress }}</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import big from "big.js";
import { NumSplic } from "../unit/tool";
export default {
  data() {
    return {
      newTime: 0,
      // 遮罩
      curtain: false,
      // 菜单
      menu: false,
      myAddress: undefined,
      // 模式切换
      mode: 0
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
        if (address != undefined) {
          this.myAddress = address.substr(0, 4) + "..." + address.substr(38, 4);
        } else {
          this.myAddress = address;
        }
      });
    },
    // 跳转
    to(e) {
      this.$router.push(e);
    }
  },
  mounted() {
    this.loadingData();
    this.$eventHub.$on("walletChanged", () => {
      this.loadingData();
    });
  },

  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.fn);
  }
};
</script>

<style  scoped>
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
.top {
  height: 65px;
  background-color: #2780e3;
  line-height: 70px;
  padding: 0 100px;
}
.mode {
  width: 50%;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 30px;
}
.modeChange {
  text-align: center;
  width: 20%;
  margin: 0 15%;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-weight: 500;
  display: inline-block;
  background-color: #f0ad4e;
}
.click {
  background-color: #ff7518;
}
.topLeftA {
 color:#fff;
 font-size: 18px
}
.topLeft {
  position: relative;
  display: inline-block;
  color: #eee;
}
.topRight {
  margin: 15px 0px;
  width: 100px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius: 50px;
  background-color: #3fb618;
  float: right;
  color: #eee;
}
.topRightAddress {
  margin: 15px 0px;
  width: 150px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius: 50px;
  background-color: #3fb618;
  float: right;
  color: #eee;
}
.menu {
  width: 100px;
  padding: 0px 50px;
  position: absolute;
  top: 55px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: #000;
}

/* 模式一 */
.view {
  width: 80%;
  margin: auto;
  height: 300px;
  line-height: 300px;
  text-align: center;
  border: 1px solid #ccc;
}

.dispost {
  width: 80%;
  margin: auto;
  margin-top: 80px;
}
.dispost > .tip {
  width: 90%;
  height: 50px;
  /* line-height: 50px; */
  display: inline-block;
  /* border: 1px solid #000; */
}
.dispostAmount {
  height: 20px;
  outline: none;
}
.dispost > .submit {
  float: right;
  padding: 5px 10px;
  background-color: #ff0039;
  color: #fff;
  font-weight: 400;
}
.dispost > .tip > div {
  display: inline-block;
  width: 30%;
}
.dispost > .tip > div:nth-child(1) {
  display: inline-block;
  width: 10%;
}
.historyRatio {
  background-color: #ccc;
  padding: 50px 0px;
  text-align: center;
}
.historyRatio > .tip {
  font-size: 30px;
}
.historyRatio > .num {
  display: inline-block;
  margin-top: 30px;
  font-size: 30px;
}
.history {
  width: 80%;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 50px;
}
.history > .title {
  text-align: center;
  font-size: 30px;
  margin-bottom: 30px;
}
.history > .tableHead {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.history > .tableHead > div {
  display: inline-block;
  width: 19%;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-weight: 600;
}
.history > .table:nth-child(odd) {
  color: #373a3c;
  background-color: #eee;
}
.history > .table:nth-child(even) {
  color: #373a3c;
}

.history > .table > div {
  display: inline-block;
  width: 19%;
  text-align: center;
  height: 40px;
  line-height: 40px;
}

/* 模式二 */
.banker {
  background-color: #ccc;
  padding: 20px 0;
  margin: 20px 0;
}
.banker > .main {
  width: 80%;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 30px;
}
.banker > .main > div:nth-child(1) {
  display: inline-block;
  width: 30%;
}
.banker > .main > div:nth-child(2) {
  display: inline-block;
  width: 30%;
}
.banker > .main > div:nth-child(3) {
  display: inline-block;
  width: 30%;
}
.banker > .main > .submit {
  display: inline-block;
  float: right;
  padding: 5px 10px;
  background-color: #ff0039;
  color: #fff;
}
.banker > .main > .nowBanker {
  margin-top: 10px;
}
.banker > .main > .nowBankerAmount {
  margin-top: 10px;
}

@media only screen and (max-width: 700px) {
  input {
    outline: none;
  }
  
.topLeftA {
 color:#fff;
 font-size: 15px
}
  .top {
    height: 65px;
    background-color: #2780e3;
    line-height: 70px;
    padding: 0 10px;
  }
  .mode {
    width: 50%;
    margin: auto;
    margin-top: 40px;
    margin-bottom: 30px;
  }
  .modeChange {
    text-align: center;
    width: 20%;
    margin: 0 15%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-weight: 500;
    display: inline-block;
    background-color: #f0ad4e;
  }
  .click {
    background-color: #ff7518;
  }
  .topLeft {
    position: relative;
  display: inline-block;
  color: #eee;
  }
  .topRight {
    margin: 15px 0px;
    width: 100px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-radius: 50px;
    background-color: #3fb618;
    float: right;
    color: #eee;
  }
  .topRightAddress {
    margin: 15px 0px;
    width: 150px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-radius: 50px;
    background-color: #3fb618;
    float: right;
    color: #eee;
  }
  .menu {
    width: 100px;
    padding: 0px 50px;
    position: absolute;
    top: 55px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: #000;
  }
}
</style>