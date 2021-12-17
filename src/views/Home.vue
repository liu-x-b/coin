<template>
	<div class="bodys">
		<div class="menu">
			<div class="to-left clearfix"> <img src="../assets/zheng.png" class="left" alt=""> <span class="left">FLIPBTC</span> </div>
			<div class="to-right">
				<el-dropdown trigger="click">
					<span class="el-dropdown-link">
         <img src="../assets/menu.svg" />
          </span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="to('/')">Home</el-dropdown-item>
						<el-dropdown-item @click.native="to('/shop')">ShoppingMall</el-dropdown-item>
						<el-dropdown-item @click.native="to('/withdraw')">Draw Money</el-dropdown-item>
						<el-dropdown-item @click.native="to('/history')">FundRecord</el-dropdown-item>
						<el-dropdown-item>Share</el-dropdown-item>
						<el-dropdown-item @click.native="to('/gameInfo')">GamePlay</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
		<div class="mains">
			<div class="text" v-if="myAddress == undefined">
				<p>There are no provider to interact with Thundercore network</p>
			
				<p>
					you can use,
					<span class="black-font">ImToken,Metamask,Coinbase,MathWaller or TrustWallet</span
        >
        to open this site :)
				</p>
				
			</div>
			<div class="main-bottom">
			<div class="wallte">
				<div class="wallte-link" v-if="myAddress == undefined" @click="linkPay">
					wallet address
				</div>
				<div class="wallte-link" v-else>{{ myAddress }}</div>
			</div>
      
			<router-view></router-view>
			</div>
		</div>
	    <div class="footer">Copyright©2021All FlipRights Reserved.Ltd</div>
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
				mode: 0,
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
					if(address != undefined) {
						this.myAddress = address.substr(0, 4) + "..." + address.substr(38, 4);
					} else {
						this.myAddress = address;
					}
				});
			},
			// 跳转
			to(e) {
				this.$router.push(e);
			},
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
		},
	};
</script>

<style lang="scss" scoped>
.footer{color: #fff;text-align: center;padding: 10px 5px;font-size: 12px;}
.el-dropdown-link{display: inline-block;border: 1px solid #fff;border-radius: 3px;padding: 3px 8px;line-height: 20px;}
.el-dropdown-link img{width: 20px;display: inline-block;vertical-align: middle;}
  .bodys{background: #383431;}
	.mains {
		margin-top: 46px;
		min-height: 850px;
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
	
	.menu {
		background-color: #383431;
		line-height: 30px;
		padding: 8px 10px;
		width: 100%;
		position: fixed;
		left: 0;
		top: 0;
		box-sizing: border-box;
		height: 46px;
		z-index: 1100;
	}
	
	.menu .to-left {
		// font-size: 18px;
		display: inline-block;
		color: #fff;
		img {
			width: 30px;
			vertical-align: -3px;
			margin-right: 10px;
		}
	}
	
	.menu .to-right {
		float: right;
	}
	
	.menu .to-right .el-icon-s-fold {
		font-size: 24px;
		color: #fff;
	}
	
	.wallte {
		text-align: center;
	}
	
	.wallte .wallte-link {
		display: inline-block;
		font-size: 14px;
		color: #db137a;
		padding: 30px 0px 20px 0px;
	}
	
	.text {
		text-align: center;
		font-size: 12px;
		background-color: #84c225;
		line-height: 18px;
		padding: 8px 0;
		color: #fff;
	
		p{margin: 0;}
		.greatbig{font-size: 14px;margin: 5px 0px;}
	}
	
	.text .black-font {
		color: #161511;
	}
	@media (max-width:767px) {
		.mains{min-height: 500px;}
	}
</style>