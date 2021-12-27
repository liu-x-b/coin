<template>
  <div>
    <div class="mode">
      <div
        class="left"
        @click="mode = 0"
        :class="mode == 0 ? 'click modeChange' : 'modeChange'"
      >
        玩法一
      </div>
      <div
        class="right"
        @click="mode = 1"
        :class="mode == 1 ? 'click modeChange' : 'modeChange'"
      >
        玩法二
      </div>
    </div>
    <div class="interval"></div>
    <div class="game-animation" v-show="mode == 0">
      <div class="btc-gif">
        <img src="../assets/BTC.gif" style="height: 100%" alt="" />
      </div>
    </div>
    <div class="num">35</div>
    <div class="open-prize" @click="Model1Lottery" v-show="!model1Open">
      <div class="text">开奖</div>
    </div>

    <div class="dispost">
      <div class="tip left">
        <div class="rule-title">押正:</div>
        <div class="impawn">
          <div class="left">总质押: {{ Model1ViewGame.frontMoney }} TSB</div>
          <div
            class="right"
            v-if="
              Model1User.start &&
              Model1User.random == 0 &&
              Model1User.userIndex == Model1HeightPeriods
            "
          >
            已质押: {{ Model1User.amount }} TSB
          </div>
          <div class="right" v-else>已质押: 0.0000 TSB</div>
        </div>
        质押:
        <input
          type="text"
          class="dispostAmount"
          @input="Model1FrontAmountFn"
          v-model="Model1FrontAmount"
          placeholder="请输入质押金额"
        />
        <div
          class="btn"
          v-if="AllowanceModel1 != 0 && AllowanceModel1FrontBool"
          @click="Model1Play(true)"
        >
          投注
        </div>
        <div class="btn" v-else @click="model1ApproveFn">授权</div>
      </div>
      <div class="tip right">
        <div class="rule-title">押反</div>
        <div class="impawn">
          <div class="left">总质押: {{ Model1ViewGame.contraryMoney }} TSB</div>
          <div
            class="right"
            v-if="
              Model1User.start &&
              Model1User.random == 1 &&
              Model1User.userIndex == Model1HeightPeriods
            "
          >
            已质押: {{ Model1User.amount }} TSB
          </div>
          <div class="right" v-else>已质押: 0.0000 TSB</div>
          质押:
          <input
            type="text"
            class="dispostAmount"
            @input="Model1BackAmountFn"
            v-model="Model1BackAmount"
            placeholder="请输入质押金额"
          />
          <div
            class="btn"
            v-if="AllowanceModel1 != 0 && AllowanceModel1BackBool"
            @click="Model1Play(false)"
          >
            投注
          </div>
          <div class="btn" v-else @click="model1ApproveFn">授权</div>
        </div>
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
      model1Open: false,
      model2Open: false,
      newTime: 0,
      // 遮罩
      curtain: false,
      // 菜单
      menu: false,
      myAddress: undefined,
      // 模式切换
      mode: 0,
      //                                     模式一
      // 授权额度
      AllowanceModel1: 0,
      // 正面授权开关
      AllowanceModel1FrontBool: true,
      // 背面授权开关
      AllowanceModel1BackBool: true,
      // 正面输入质押量
      Model1FrontAmount: null,
      // 背面输入质押量
      Model1BackAmount: null,
      // 当前最高期数
      Model1HeightPeriods: 0,
      // 当前最高期数信息
      Model1ViewGame: {},
      // 正面总数
      Model1FrontNum: 0,
      // 反面总数
      Model1ContraryNum: 0,
      // 用户信息
      Model1User: {},
      // 历史记录
      model1History: [
        {
          contraryMoney: 0,
          end: false,
          frontMoney: 0,
          random: 0,
        },
      ],
      //                                      模式二
      // 授权额度
      AllowanceModel2: 0,
      // 正面授权开关
      AllowanceModel2FrontBool: true,
      // 背面授权开关
      AllowanceModel2BackBool: true,
      // 正面输入质押量
      Model2FrontAmount: null,
      // 背面输入质押量
      Model2BackAmount: null,
      // 当前最高期数
      Model2HeightPeriods: 0,
      // 当前最高期数信息
      Model2ViewGame: {},
      // 正面总数
      Model2FrontNum: 0,
      // 反面总数
      Model2ContraryNum: 0,
      // 用户信息
      Model2User: {},
      // 庄家信息
      Model2Banker: {},
      // 正面赔付率
      Model2FrontRatio: 1,
      // 反面赔付率
      Model2BackRatio: 1,
      // 抢庄金额
      Model2BankerAmount: null,
      // 抢庄授权开关
      AllowanceModel2BankerAmountBool: true,
      // 正面最大质押量
      bankerFrontMax: 0,
      // 反面最大质押量
      bankerContraryMax: 0,
      // 正面质押进度条
      Model2FrontMaxratio: 0,
      // 反面质押进度条
      Model2ContraryMaxratio: 0,
      // 历史记录
      model2History: [
        {
          contraryMoney: 0,
          end: false,
          frontMoney: 0,
          random: 0,
        },
      ],
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
        if (address != undefined) {
          this.myAddress = address.substr(0, 4) + "..." + address.substr(38, 4);
        } else {
          this.myAddress = address;
        }
      });
    },
    // 查询授权额度
    queryAllowance() {
      // model1
      this.$contract
        .TokenAllowance(this.$contract.getContractsAddress().free)
        .then((data) => {
          this.AllowanceModel1 =
            NumSplic(
              big(data)
                .div(10 ** 18)
                .toString(),
              2
            ) - 0;
          // console.log(this.AllowanceModel1);
        });
      // model2
      this.$contract
        .TokenAllowance(this.$contract.getContractsAddress().banker)
        .then((data) => {
          this.AllowanceModel2 =
            NumSplic(
              big(data)
                .div(10 ** 18)
                .toString(),
              2
            ) - 0;
          // console.log(this.AllowanceModel2);
        });
    },

    //                                            模式1
    // 授权
    model1ApproveFn() {
      // model1
      this.curtain = true;
      this.$contract
        .TokenApprove(this.$contract.getContractsAddress().free)
        .then((data) => {
          this.$message({
            message: "授权成功",
            type: "success",
          });
          this.curtain = false;
        })
        .catch((error) => {
          this.$message.error("授权失败");
          this.curtain = false;
        });
    },
    // model1正面input输入质押量
    Model1FrontAmountFn(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.Model1FrontAmount = e.target.value.replace(re, "$1");
      } else {
        this.Model1FrontAmount = null;
      }
      this.AllowanceModel1FrontBool = !big(this.AllowanceModel1).lt(
        big(this.Model1FrontAmount)
      );
      // console.log(this.AllowanceModel1FrontBool);
    },
    // model1背面input输入质押量
    Model1BackAmountFn(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.Model1BackAmount = e.target.value.replace(re, "$1");
      } else {
        this.Model1BackAmount = null;
      }
      this.AllowanceModel1BackBool = !big(this.AllowanceModel1).lt(
        big(this.Model1BackAmount)
      );
    },
    // model1质押
    Model1Play(bool) {
      if (
        Number(this.Model1ViewGame.time) + 150 > Number(this.newTime) ||
        this.Model1ViewGame.time == 0
      ) {
      } else {
        this.$message({
          showClose: true,
          message: "超出质押时间",
          type: "warning",
        });
        return;
      }

      var amount;
      if (bool) {
        // 正面
        if (
          this.Model1User.userIndex == this.Model1HeightPeriods &&
          this.Model1User.start &&
          this.Model1User.random == 1
        ) {
          this.$message({
            showClose: true,
            message: "不能质押自己对立面",
            type: "warning",
          });
          return;
        }
        if (this.Model1FrontAmount < 1000) {
          this.$message({
            message: "最小质押1000",
            type: "warning",
          });
          return;
        }
        amount = this.Model1FrontAmount;
      } else {
        // 反面
        if (
          this.Model1User.userIndex == this.Model1HeightPeriods &&
          this.Model1User.start &&
          this.Model1User.random == 0
        ) {
          this.$message({
            showClose: true,
            message: "不能质押自己对立面",
            type: "warning",
          });
          return;
        }
        if (this.Model1BackAmount < 1000) {
          this.$message({
            message: "最小质押1000",
            type: "warning",
          });
          return;
        }
        amount = this.Model1BackAmount;
      }
      this.curtain = true;
      this.$contract
        .freePlay(bool, amount)
        .then((data) => {
          this.$message({
            message: "质押成功",
            type: "success",
          });
          this.curtain = false;
          this.Model1FrontAmount = null;
          this.Model1BackAmount = null;
        })
        .catch((error) => {
          this.$message.error("质押失败");
          this.curtain = false;
        });
    },
    // model1开奖
    Model1Lottery() {
      console.log("dasdasd");
      if (
        this.Model1ViewGame.frontMoney == 0 &&
        this.Model1ViewGame.contraryMoney == 0
      ) {
        this.$message({
          showClose: true,
          message: "当期暂未开始",
          type: "warning",
        });
        return;
      }
      // console.log(Number(this.Model1ViewGame.time) + 150 > Number(this.newTime))
      // console.log(Number(this.Model1ViewGame.time) + 150)
      // console.log(Number(this.newTime))
      if (Number(this.Model1ViewGame.time) + 150 > Number(this.newTime)) {
        this.$message({
          showClose: true,
          message: "开奖时间未到",
          type: "warning",
        });
        return;
      }
      this.curtain = true;
      this.$contract
        .freeLottery()
        .then((data) => {
          this.$message({
            message: "开奖成功",
            type: "success",
          });
          this.curtain = false;
          // this.model1Open = true;
          // setTimeout (() => {
          //   this.model1Open = false;
          // },1500)
        })
        .catch((error) => {
          this.$message.error("开奖失败");
          this.curtain = false;
        });
    },
    // mode1查询当前最高期数
    freeViewHeightPeriodsFn() {
      this.$contract.freeViewHeightPeriods().then((data) => {
        this.Model1HeightPeriods = data;
        this.freeViewGameFn(data);
        let length = 8;
        if (data > 8) {
          length = Number(data);
        }
        let arr = [];
        for (let i = length; i >= length - 8; i--) {
          arr.push(i);
        }
        this.freeViewHistory(arr);
      });
    },
    // model1查询历史
    freeViewHistory(arr) {
      Promise.all(
        arr.map((data) => {
          return this.$contract.freeViewGame(data);
        })
      ).then((data) => {
        let newArr = [];
        data.map((element) => {
          let obj = element;
          obj.contraryMoney = NumSplic(
            big(element.contraryMoney)
              .div(10 ** 18)
              .toString(),
            4
          );
          obj.frontMoney = NumSplic(
            big(element.frontMoney)
              .div(10 ** 18)
              .toString(),
            4
          );
          newArr.push(obj);
        });
        this.model1History = newArr;
      });
    },
    // model1查询期数详细信息
    freeViewGameFn(_periods) {
      this.$contract.freeViewGame(_periods).then((data) => {
        let obj = data;
        obj.contraryMoney = NumSplic(
          big(data.contraryMoney)
            .div(10 ** 18)
            .toString(),
          4
        );
        obj.frontMoney = NumSplic(
          big(data.frontMoney)
            .div(10 ** 18)
            .toString(),
          4
        );
        this.Model1ViewGame = obj;
      });
    },
    // model1查询正面总数
    freeViewFrontNumFn() {
      this.$contract.freeViewFrontNum().then((data) => {
        this.Model1FrontNum = data;
      });
    },
    // model1查询反面总数
    freeViewContraryNumFn() {
      this.$contract.freeViewContraryNum().then((data) => {
        this.Model1ContraryNum = data;
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

    //                                                       model2
    // 授权
    model2ApproveFn() {
      // model2
      this.curtain = true;
      this.$contract
        .TokenApprove(this.$contract.getContractsAddress().banker)
        .then((data) => {
          this.$message({
            message: "授权成功",
            type: "success",
          });
          this.curtain = false;
        })
        .catch((error) => {
          this.$message.error("授权失败");
          this.curtain = false;
        });
    },
    // model2正面input输入质押量
    Model2FrontAmountFn(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.Model2FrontAmount = e.target.value.replace(re, "$1");
        if (
          e.target.value >
          Number(this.bankerFrontMax) - Number(this.Model2ViewGame.frontMoney)
        ) {
          this.Model2FrontAmount =
            Number(this.bankerFrontMax) -
            Number(this.Model2ViewGame.frontMoney);
        }
      } else {
        this.Model2FrontAmount = null;
      }
      this.AllowanceModel2FrontBool = !big(this.AllowanceModel2).lt(
        big(this.Model2FrontAmount)
      );
    },
    // model2背面input输入质押量
    Model2BackAmountFn(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.Model2BackAmount = e.target.value.replace(re, "$1");
        if (
          e.target.value >
          Number(this.bankerContraryMax) -
            Number(this.Model2ViewGame.contraryMoney)
        ) {
          this.Model2BackAmount =
            Number(this.bankerContraryMax) -
            Number(this.Model2ViewGame.contraryMoney);
        }
      } else {
        this.Model2BackAmount = null;
      }
      this.AllowanceModel2BackBool = !big(this.AllowanceModel2).lt(
        big(this.Model2BackAmount)
      );
    },
    // model2质押
    Model2Play(bool) {
      if (
        Number(this.Model2ViewGame.time) + 150 > Number(this.newTime) ||
        this.Model2ViewGame.time == 0
      ) {
      } else {
        this.$message({
          showClose: true,
          message: "超出质押时间",
          type: "warning",
        });
        return;
      }

      var amount;

      if (bool) {
        // 正面

        if (
          this.Model2User.userIndex == this.Model2HeightPeriods &&
          this.Model2User.start &&
          this.Model2User.random == 1
        ) {
          this.$message({
            showClose: true,
            message: "不能质押自己对立面",
            type: "warning",
          });
          return;
        }

        if (this.Model2FrontAmount < 1000) {
          this.$message({
            message: "最小质押1000",
            type: "warning",
          });
          return;
        }
        amount = this.Model2FrontAmount;
      } else {
        // 反面
        if (
          this.Model2User.userIndex == this.Model2HeightPeriods &&
          this.Model2User.start &&
          this.Model2User.random == 0
        ) {
          this.$message({
            showClose: true,
            message: "不能质押自己对立面",
            type: "warning",
          });
          return;
        }

        if (this.Model2BackAmount < 1000) {
          this.$message({
            message: "最小质押1000",
            type: "warning",
          });
          return;
        }
        amount = this.Model2BackAmount;
      }
      this.curtain = true;
      this.$contract
        .bankerPlay(bool, amount)
        .then((data) => {
          this.$message({
            message: "质押成功",
            type: "success",
          });
          this.curtain = false;
          this.Model2FrontAmount = null;
          this.Model2BackAmount = null;
        })
        .catch((error) => {
          this.$message.error("质押失败");
          this.curtain = false;
        });
    },
    // model2开奖
    Model2Lottery() {
      if (
        this.Model2ViewGame.frontMoney == 0 &&
        this.Model2ViewGame.contraryMoney == 0
      ) {
        this.$message({
          showClose: true,
          message: "当期暂未开始",
          type: "warning",
        });
        return;
      }
      if (Number(this.Model2ViewGame.time) + 150 > Number(this.newTime)) {
        this.$message({
          showClose: true,
          message: "开奖时间未到",
          type: "warning",
        });
        return;
      }
      this.curtain = true;
      this.$contract
        .bankerLottery()
        .then((data) => {
          this.$message({
            message: "开奖成功",
            type: "success",
          });
          this.curtain = false;
          // this.model2Open = true;
          // setTimeout (() => {
          //   this.model2Open = false;
          // },1500)
        })
        .catch((error) => {
          this.$message.error("开奖失败");
          this.curtain = false;
        });
    },
    // mode2查询当前最高期数
    bankerViewHeightPeriodsFn() {
      this.$contract.bankerViewHeightPeriods().then((data) => {
        this.Model2HeightPeriods = data;
        this.bankerViewGameFn(data);
        let length = 8;
        if (data > 8) {
          length = Number(data);
        }
        let arr = [];
        for (let i = length; i >= length - 8; i--) {
          arr.push(i);
        }
        this.bankerViewHistory(arr);
      });
    },
    // model2查询历史
    bankerViewHistory(arr) {
      Promise.all(
        arr.map((data) => {
          return this.$contract.bankerViewGame(data);
        })
      ).then((data) => {
        let newArr = [];
        data.map((element) => {
          let obj = element;
          obj.contraryMoney = NumSplic(
            big(element.contraryMoney)
              .div(10 ** 18)
              .toString(),
            4
          );
          obj.frontMoney = NumSplic(
            big(element.frontMoney)
              .div(10 ** 18)
              .toString(),
            4
          );
          newArr.push(obj);
        });
        this.model2History = newArr;
      });
    },
    // model2查询期数详细信息
    bankerViewGameFn(_periods) {
      this.$contract.bankerViewGame(_periods).then((data) => {
        let obj = data;
        obj.contraryMoney = NumSplic(
          big(data.contraryMoney)
            .div(10 ** 18)
            .toString(),
          4
        );
        obj.frontMoney = NumSplic(
          big(data.frontMoney)
            .div(10 ** 18)
            .toString(),
          4
        );
        obj.bankerMoney = NumSplic(
          big(data.bankerMoney)
            .div(10 ** 18)
            .toString(),
          1
        );
        obj.frontRatio = NumSplic(big(data.frontRatio).div(10).toString(), 1);
        obj.contraryRatio = NumSplic(
          big(data.contraryRatio).div(10).toString(),
          1
        );
        // console.log(obj)
        this.Model2ViewGame = obj;
      });
    },
    // model2查询正面总数
    bankerViewFrontNumFn() {
      this.$contract.bankerViewFrontNum().then((data) => {
        this.Model2FrontNum = data;
      });
    },
    // model2查询反面总数
    bankerViewContraryNumFn() {
      this.$contract.bankerViewContraryNum().then((data) => {
        this.Model2ContraryNum = data;
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
        // console.log(this.Model2User);
      });
    },
    // model2查询当前庄家
    bankerNowBankerFn() {
      this.$contract.bankerNowBanker().then((data) => {
        let obj = data;
        obj.bankerMoney = NumSplic(
          big(data.bankerMoney)
            .div(10 ** 18)
            .toString(),
          4
        );
        obj.frontRatio = NumSplic(big(data.frontRatio).div(10).toString(), 1);
        obj.contraryRatio = NumSplic(
          big(data.contraryRatio).div(10).toString(),
          1
        );
        if (obj.bankerAddress == "0x0000000000000000000000000000000000000000") {
          obj.bankerAddress = "无";
        } else {
          obj.bankerAddress =
            data.bankerAddress.substr(0, 4) +
            "..." +
            data.bankerAddress.substr(38, 4);
        }
        this.Model2Banker = obj;
        // console.log(obj,'dasdasdasdasd!!!!!!!!!!!!')
      });
    },
    // model2正面input输入赔付率
    Model2FrontRatioFn(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{1})[0-9]*/;
        this.Model2FrontRatio = e.target.value.replace(re, "$1");
      } else {
        this.Model2FrontRatio = null;
      }
    },
    // model2背面input输入赔付率
    Model2BackRatioFn(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{1})[0-9]*/;
        this.Model2BackRatio = e.target.value.replace(re, "$1");
      } else {
        this.Model2BackRatio = null;
      }
    },
    // model2抢庄金额
    Model2BankerAmountFn(e) {
      if (e.target.value >= 0) {
        var re = /([0-9]+\.[0-9]{18})[0-9]*/;
        this.Model2BankerAmount = e.target.value.replace(re, "$1");
      } else {
        this.Model2BankerAmount = null;
      }
      this.AllowanceModel2BankerAmountBool = !big(this.AllowanceModel2).lt(
        big(this.Model2BankerAmount)
      );
    },
    // 抢庄
    giveBanker() {
      if (this.Model2FrontRatio <= 0) {
        this.$message({
          message: "请设置正面赔付率",
          type: "warning",
        });
        return;
      }
      if (this.Model2BackRatio <= 0) {
        this.$message({
          message: "请设置反面赔付率",
          type: "warning",
        });
        return;
      }

      if (Number(this.Model2BankerAmount) < 1000000) {
        this.$message({
          message: "请输入正确的质押量",
          type: "warning",
        });
        return;
      }
      if (
        Number(this.Model2BankerAmount) <
        Number(this.Model2Banker.bankerMoney) + 200000
      ) {
        this.$message({
          message: "请输入正确的质押量",
          type: "warning",
        });
        return;
      }

      this.curtain = true;
      this.$contract
        .bankerRob(
          this.Model2BankerAmount,
          this.Model2FrontRatio,
          this.Model2BackRatio
        )
        .then((data) => {
          this.$message({
            message: "抢庄成功",
            type: "success",
          });
          this.curtain = false;
        })
        .catch((error) => {
          this.$message.error("抢庄失败");
          this.curtain = false;
        });
    },
    // model2查询可质押最大量
    bankMaxDepositFn() {
      if (this.Model2Banker.bankerAddress == "无") {
        this.Model2ContraryMaxratio = 0;
        this.Model2FrontMaxratio = 0;
        return;
      }

      // 正面
      this.$contract
        .bankMaxDeposit(true)
        .then((data) => {
          let frontMax = big(data)
            .div(10 ** 18)
            .toString();
          this.bankerFrontMax = frontMax;
          this.Model2FrontMaxratio = Number(
            NumSplic(
              big(this.Model2ViewGame.frontMoney)
                .div(big(frontMax))
                .times(100)
                .toString(),
              2
            )
          );
          if (this.Model2ViewGame.frontMoney == 0) {
            this.Model2FrontMaxratio = 0;
          }
        })
        .catch((error) => {
          // console.log(error,"***************")
          this.Model2FrontMaxratio = 0;
        });
      // 反面
      this.$contract
        .bankMaxDeposit(false)
        .then((data) => {
          let contraryMax = big(data)
            .div(10 ** 18)
            .toString();
          this.bankerContraryMax = contraryMax;
          this.Model2ContraryMaxratio = Number(
            NumSplic(
              big(this.Model2ViewGame.contraryMoney)
                .div(big(contraryMax))
                .times(100)
                .toString(),
              2
            )
          );
          if (this.Model2ViewGame.contraryMoney == 0) {
            this.Model2ContraryMaxratio = 0;
          }
        })
        .catch((error) => {
          // console.log(error,"***************")
          this.Model2ContraryMaxratio = 0;
        });
    },
    //                                                    加载钱包后操作
    create() {
      this.queryAllowance();
      this.freeViewHeightPeriodsFn();
      this.freeViewFrontNumFn();
      this.freeViewContraryNumFn();
      this.freeViewUserFn();

      this.bankerViewHeightPeriodsFn();
      this.bankerViewFrontNumFn();
      this.bankerViewContraryNumFn();
      this.bankerViewUserFn();
      this.bankerNowBankerFn();
      this.bankMaxDepositFn();

      clearInterval(this.fn);
      this.fn = setInterval(this.whileFN, 3000);
    },
    whileFN() {
      this.queryAllowance();
      this.freeViewHeightPeriodsFn();
      this.freeViewFrontNumFn();
      this.freeViewContraryNumFn();
      this.freeViewUserFn();

      this.bankerViewHeightPeriodsFn();
      this.bankerViewFrontNumFn();
      this.bankerViewContraryNumFn();
      this.bankerViewUserFn();
      this.bankerNowBankerFn();
      this.bankMaxDepositFn();
    },
    whileTime() {
      this.newTime = Date.parse(new Date()).toString().substr(0, 10);
    },
  },
  mounted() {
    this.loadingData();
    this.$eventHub.$on("walletChanged", () => {
      this.loadingData();
    });

    this.timer = setInterval(this.whileTime, 1000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.fn);
  },
};
</script>

<style scoped>
.mode {
  margin: 0 auto;
  width: 50%;
  height: 20px;
}
.left {
  float: left;
}
.right {
  float: right;
}

.interval {
  height: 20px;
}

.game-animation {
  width: 50%;
  margin: 0 auto;
  padding-bottom: 50%;
  height: 0;
  position: relative;

  border: 1px solid #ededed;
}
.game-animation .btc-gif {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}
.num {
  text-align: center;
  font-size: 26px;
}
.open-prize {
  text-align: center;
}
.open-prize .text {
  display: inline-block;
  background-color: #da251d;
  color: #fff;
  padding: 0 15px;
  border-radius: 5px;
  line-height: 20px;
}
.dispost {
  margin-top: 20px;
  line-height: 30px;
}
.dispost .tip {
  width: 50%;
  padding: 0 20px;
  box-sizing: border-box;
}
.tip .rule-title {
  color: #f70389;
}
.impawn {
  width: 10%0;
}
.impawn .left {
  width: 50%;
  float: left;
}
.impawn .right {
  width: 50%;
  float: right;
}

.btn {
  display: inline-block;
  font-size: 10px;
  background-color: #82c121;
  line-height: 22px;
  padding: 0 15px;
  margin-left: 10px;
}
</style>