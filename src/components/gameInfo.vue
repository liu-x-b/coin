<template>
	<div>
	<div class="wallte">
				<div class="wallte-link" v-if="myAddress == undefined" @click="linkPay">
					connect wallet
				</div>
				<div class="wallte-link" v-else>{{ myAddress }}</div>
			</div>
	<div class="gameinfo-main">
		<div class="game-info-title">Gameplay introduction:</div>
		<div class="game-info-text">
			<p>This is a fair, transparent, decentralized, multiplayer game to guess the pros and cons of BTC</p>
<p>Buy TSB through USDT in the menu bar mall to participate in the game,</p>
<p>Conversion ratio: 1USDT: 1000TSB</p>
<p>Draw time: 150 seconds once</p>
		</div>
		<div class="game-info-title">How to play 1 introduction:</div>
		<div class="game-info-text">
			<p>Minimum bet amount: <span>50K</span> TSB, enter the pledge amount for both parties to bet, and players can only choose one side to bet in each round.</p>
			<p> The game will start the "150-second bet countdown" when both parties are betting, the betting ends at 0 seconds, and the 15-second draw countdown will take place.</p>
<p class="game-info-title-small">Profit rules:</p>
<p class="game-info-text-samll">The winner wins the total pledge amount of the loser, and the winner will distribute the profit according to the proportion of the personal pledge amount and the total pledge amount.</p>
<p class="game-info-text-samll">Note: Because players continue to make positive and negative pledges before the bet, its odds change in real time before the bet ends.</p>
		</div>
		<div class="game-info-title">How to play 2 introduction:</div>
		<div class="game-info-text">
			<p> Minimum amount to grab bankroll: <span>2M</span> TSB,</p>
<p> After each round, there will be a 30-second grab time. Any player can grab the banker within these 30 seconds, as long as the pledge amount is greater than the current banker pledge deposit amount of <span>200K</span></p>
<p>The dealer can set the respective odds of the front and back before grabbing the banker, with the lowest odds of 1:1.</p>
<p>After determining who is the dealer, as long as anyone on either side of the bank makes a bet, the 150-second draw countdown starts, and the betting can be made within 150 seconds, and the draw is automatically drawn at 0 seconds. When one party's pledge deposit amount minus the other's pledge deposit amount is greater than the banker's pledge deposit amount.  This party cannot bet, only the other party</p>
<p class="game-info-title-small">Profit rules:</p>
<p class="game-info-text-samll">Pay out according to the odds set by the dealer</p>
		</div>
	</div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
	  			myAddress: undefined,
	  			myAddressAll: undefined,
			}
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
					this.myAddressAll = address
				});
			},
		},
		mounted() { 
  		  this.loadingData();
  		  this.$eventHub.$on("walletChanged", () => {
  		    this.loadingData();
  		  });
  		},
	}
</script>

<style  scoped>
	.wallte {
		text-align: center;
	}
	
	.wallte .wallte-link {
		display: inline-block;
		font-size: 14px;
		color: #db137a;
		padding: 30px 0px 20px 0px;
	}
	.gameinfo-main{width: 94%;margin: 50px auto;border: 1px solid #fff;padding:60px 80px;box-sizing: border-box;border-radius: 10px;max-width: 1200px;color: #fff;font-size: 14px;line-height: 32px;}
	.game-info-title{color: #84c225;font-size: 18px;margin-bottom: 10px;}
	.game-info-title-small{font-size: 16px;}
	.game-info-text{margin-bottom: 20px;}
	.game-info-text p{margin: 0;}
	.game-info-text span{color: #84c225;font-weight: bold;}
	@media (max-width:767px) {
		.game-info-title{font-size: 16px;margin-bottom: 5px;}
		.game-info-title-small{font-size: 14px;}
		.game-info-text{margin-bottom: 10px;}
		.gameinfo-main{padding:15px 10px;margin: 10px auto 30px auto;font-size: 12px;line-height: 25px;}
	}
</style>