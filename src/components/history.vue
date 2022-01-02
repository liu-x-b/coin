<template>
  <div class="history">
  	<div class="wallte">
				<div class="wallte-link" v-if="myAddress == undefined" @click="linkPay">
					wallet address
				</div>
				<div class="wallte-link" v-else>{{ myAddress }}</div>
			</div>
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
        <el-table-column label="Pledge direction" align="center">
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
    	myAddress: undefined,
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
      model2page: 0,



      Model2User: {},
      Model2HeightPeriods: 0,





      Model1User: {},
      Model1HeightPeriods: 0,
    };
  },

  methods: {
  	// 连接钱包
			linkPay() {
				this.$contract.initWeb3();
			},
    model1Change(e) {
      this.freeViewMyHistoryFn(e);
    },
    modle2Change(e) {
      this.bankViewMyHistoryFn(e);
    },

    freeViewMyHistoryFn(data) {
      let arr = [];
      
      for (let i = this.model1page - ((data-1) * 10); i > this.model1page - (data * 10) && i>=0; i--) {
        if (i < this.model1page) {
          arr.push(i);
        }
      }
      Promise.all(
        arr.map(data => {
          return this.$contract.freeViewMyHistory(data);
        })
      ).then(async arrdata => {
					let newArr = []; 
					if(this.Model1User.amount != 0 && this.Model1HeightPeriods != this.Model1User.userIndex && data == 1) {
						await this.$contract.freeViewGame(this.Model1User.userIndex).then(newData => {
							let newAddArr = {}
							newAddArr.number = newData.number
							newAddArr.state = this.Model1User.random == newData.random
							newAddArr.buy = this.Model1User.random
							if(this.Model1User.random == newData.random) {
							// 	// win
								newAddArr.amount = NumSplic(this.Model1User.amount* 95 /100,4)
							}else {
							// 	// lost
								newAddArr.amount = this.Model1User.amount
							}
							newArr.push(newAddArr)
						})
					}
        arrdata.map(element => {
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
      for (let i = this.model2page - ((data-1) * 10); i > this.model2page - (data * 10) && i>=0; i--) {
        if (i < this.model2page) {
          arr.push(i);
          console.log(i,"for")      
        }
      }
      Promise.all(
        arr.map(data => {
          return this.$contract.bankViewMyHistory(data);
        })
      ).then(async arrdata => {
				let newArr = [];
				if(this.Model2User.amount != 0 && this.Model2HeightPeriods != this.Model2User.userIndex && data == 1) {
					await this.$contract.bankerViewGame(this.Model2User.userIndex).then(newData => {
						console.log(newAddArr,"new BankerViewGame")
						let newAddArr = {}
						newAddArr.number = newData.number
						newAddArr.state = this.Model2User.random == newData.random
						newAddArr.buy = this.Model2User.random
						let myRatio = this.Model2User.random == 0 ? newData.frontRatio : newData.contraryRatio
						if(this.Model2User.random == newData.random) {
							// win
							newAddArr.amount = NumSplic(this.Model2User.amount*myRatio / 10 * 95 /100,4)
						}else {
							// lost
							newAddArr.amount = this.Model2User.amount
						}
						newArr.push(newAddArr)
					})
				}
        arrdata.map(element => {
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
    // model2查询用户
		bankerViewUserFn() {
			this.$contract.bankerViewUser().then((data) => {
				let obj = data;
				obj.amount = NumSplic(
					big(data.amount)
					.div(10 ** 18)
					.toString(),
					4
				);
				this.Model2User = obj; 
			});
    },
    // mode2查询当前最高期数
		bankerViewHeightPeriodsFn() {
		  this.$contract.bankerViewHeightPeriods().then((data) => {
				this.Model2HeightPeriods = data;
			});
    },
    
    // model1查询用户
		freeViewUserFn() {
			this.$contract.freeViewUser().then((data) => {
				let obj = data;
				obj.amount = NumSplic(
					big(data.amount)
					.div(10 ** 18)
					.toString(),
					4
				);
				this.Model1User = obj;
				// console.log(this.Model1User);
			});
    },
    // mode1查询当前最高期数
		freeViewHeightPeriodsFn() {
			this.$contract.freeViewHeightPeriods().then((data) => {
				this.Model1HeightPeriods = data; 
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
      this.bankerViewHeightPeriodsFn();
      this.bankerViewUserFn();
      this.freeViewUserFn();
      this.freeViewHeightPeriodsFn();
      clearInterval(this.fnHistory);
      this.fnHistory = setInterval(this.whileFN, 3000);
    },
    whileFN() {
      this.freeViewMyHistoryLengthFn();
      this.bankViewMyHistoryLengthFn();
      this.bankerViewHeightPeriodsFn();
      this.bankerViewUserFn();
      this.freeViewUserFn();
      this.freeViewHeightPeriodsFn();
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
	.wallte {
		text-align: center;
	}
	
	.wallte .wallte-link {
		display: inline-block;
		font-size: 14px;
		color: #db137a;
		padding: 30px 0px 20px 0px;
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
		padding:8px 30px;
}
.history-main{
	width: 94%;
	margin: 50px auto 30px auto;
	max-width: 1200px;
}
</style>