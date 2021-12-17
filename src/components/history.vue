<template>
  <div class="history">
    <div class="shop-top">
      <div @click="model=0" :class="model == 0 ? 'click modeChange' : 'modeChange'">PLAY1</div>
      <div @click="model=1" :class="model == 1 ? 'click modeChange' : 'modeChange'">PLAY2</div>
    </div>
    <div class="history-main">
    <div v-show="model == 0">
      <el-table :data="model1" style="width: 100%">
        <el-table-column label="Rounds" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Pledge direction" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-show="scope.row.buy == 0 ">Positive</span>
            <span style="margin-left: 10px" v-show="scope.row.buy == 1 ">Negative</span>
          </template>
        </el-table-column>
        <el-table-column label="Result" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-show="scope.row.state ">WIN</span>
            <span style="margin-left: 10px" v-show="!scope.row.state ">LOSE</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="ProFit" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px;color:#00b464" v-show="scope.row.state " >+{{scope.row.amount}}</span>
            <span style="margin-left: 10px;color:#fa4d56" v-show="!scope.row.state " >-{{scope.row.amount}}</span>
          </template>
        </el-table-column>
      </el-table>
     
      <el-pagination layout="prev, pager, next" @current-change="model1Change" :total="model1page"></el-pagination>
    </div>
    <div v-show="model == 1">
      <el-table :data="model2" style="width: 100%">
        <el-table-column label="Rounds" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.number }}</span>
          </template>
        </el-table-column>
        <el-table-column label="PositiveBet" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-show="scope.row.buy == 0 ">Positive</span>
            <span style="margin-left: 10px" v-show="scope.row.buy == 1 ">Negative</span>
            <span style="margin-left: 10px" v-show="scope.row.buy == 3 ">Dealer</span>
          </template>
        </el-table-column>
        <el-table-column label="Result" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-show="scope.row.state ">WIN</span>
            <span style="margin-left: 10px" v-show="!scope.row.state ">LOSE</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="ProFit" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px;color:#00b464" v-show="scope.row.state " >+{{scope.row.amount}}</span>
            <span style="margin-left: 10px;color:#fa4d56" v-show="!scope.row.state " >-{{scope.row.amount}}</span>
          </template>
        </el-table-column>
      </el-table>
     
      <el-pagination layout="prev, pager, next" @current-change="modle2Change" :total="model2page"></el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
import big from "big.js";
big.NE = -40;
big.PE = 40;
import { NumSplic } from "../unit/tool";
export default {
  data() {
    return {
      model: 0,
      model1: [
        // {
        //   number: "0",
        //   state: "true",
        //   buy: "0",
        //   amount: "10000"
        // },
        // {
        //   number: "0",
        //   state: "false",
        //   buy: "1",
        //   amount: "10000"
        // }
      ],
      model1page: 0,
      model2: [
        // {
        //   number: "0",
        //   state: "true",
        //   buy: "0",
        //   amount: "10000"
        // },
        // {
        //   number: "0",
        //   state: "false",
        //   buy: "1",
        //   amount: "10000"
        // }
      ],
      model2page: 0
    };
  },

  methods: {
    model1Change(e) {
      this.freeViewMyHistoryFn(e);
    },
    modle2Change(e) {
      this.bankViewMyHistoryFn(e);
    },

    freeViewMyHistoryFn(data) {
      let arr = [];
      for (let i = data * 10 - 10; i < data * 10; i++) {
        if (i < this.model1page) {
          arr.push(i);
        }
      }
      Promise.all(
        arr.map(data => {
          return this.$contract.freeViewMyHistory(data);
        })
      ).then(data => {
        let newArr = [];
        data.map(element => {
          let obj = element;
          obj.amount = NumSplic(
            big(element.amount)
              .div(10 ** 18)
              .toString(),
            4
          );
          newArr.push(obj);
        });
        this.model1 = newArr;
      });
    },

    freeViewMyHistoryLengthFnFirst() {
      this.$contract.freeViewMyHistoryLength().then(data => {
        console.log(data);
        this.model1page = Number(data);
        this.freeViewMyHistoryFn(1);
      });
    },
    freeViewMyHistoryLengthFn() {
      this.$contract.freeViewMyHistoryLength().then(data => {
        console.log(data);
        this.model1page = Number(data);
      });
    },
    // model2
    bankViewMyHistoryFn(data) {
      let arr = [];
      for (let i = data * 10 - 10; i < data * 10; i++) {
        if (i < this.model2page) {
          arr.push(i);
        }
      }
      Promise.all(
        arr.map(data => {
          return this.$contract.bankViewMyHistory(data);
        })
      ).then(data => {
        let newArr = [];
        data.map(element => {
          let obj = element;
          obj.amount = NumSplic(
            big(element.amount)
              .div(10 ** 18)
              .toString(),
            4
          );
          newArr.push(obj);
        });
        this.model2 = newArr;
      });
    },

    bankViewMyHistoryLengthFnFirst() {
      this.$contract.bankViewMyHistoryLength().then(data => {
        console.log(data);
        this.model2page = Number(data);
        this.bankViewMyHistoryFn(1);
      });
    },
    bankViewMyHistoryLengthFn() {
      this.$contract.bankViewMyHistoryLength().then(data => {
        console.log(data);
        this.model2page = Number(data);
      });
    },
    // 加载钱包
    loadingData() {
      this.$contract.connectWallet().finally(() => {
        let address = this.$contract.getCurrWalletAddress();
        this.create();
      });
    },
    create() {
      this.freeViewMyHistoryLengthFnFirst();
      this.bankViewMyHistoryLengthFnFirst();
      clearInterval(this.fnHistory);
      this.fnHistory = setInterval(this.whileFN, 3000);
    },
    whileFN() {
      this.freeViewMyHistoryLengthFn();
      this.bankViewMyHistoryLengthFn();
    }
  },
  mounted() {
    this.loadingData();
    this.$eventHub.$on("walletChanged", () => {
      this.loadingData();
    });
  },
  beforeDestroy() {
    clearInterval(this.fnHistory);
  }
};
</script>

<style scoped>
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
		padding:8px 30px;
}
.history-main{
	width: 94%;
	margin: 50px auto 30px auto;
	max-width: 1200px;
}
</style>