<template>
	<div class="gameinfo-main">
		<div class="game-info-title">Gameplay introduction:</div>
		<div class="game-info-text">
			<p>This is a fair, transparent, decentralized, multiplayer game to guess the pros and cons of BTC</p>
<p>Buy TSB through USDT in the menu bar mall to participate in the game,</p>
<p>Conversion ratio: 1USDT: 1000TSB (fixed ratio)</p>
<p>Draw time: 150 seconds once</p>
		</div>
		<div class="game-info-title">How to play 1 introduction:</div>
		<div class="game-info-text">
			<p>Minimum bet amount: <span>1000TSB</span>, enter the amount to bet positive and negative</p>
<p class="game-info-title-small">Profit rules:</p>
<p class="game-info-text-samll">The total amount of the winner is greater than the total amount of the loser, and the winner will distribute the profit according to the proportion of the individual bet amount to the total bet amount of the winner</p>
<p class="game-info-text-samll">If the total amount of the winner is equal to or less than the total amount of the loser, the winner will get a profit of 1:1, and the extra bet amount of the loser will be refunded according to the proportion.</p>
		</div>
		<div class="game-info-title">How to play 2 introduction:</div>
		<div class="game-info-text">
			<p>The minimum amount to grab bankroll: <span>1000000TSB</span>,</p>
<p>Any player can grab the dealer, the dealer with the largest amount</p>
<p>The dealer can set the odds on both sides, the lowest odds are 1:1</p>
<p>When the difference between the positive amount and the negative amount is greater than or equal to the dealer pledge amount, the player can only bet on the party with the smaller amount</p>
<p class="game-info-title-small">Profit rules:</p>
<p class="game-info-text-samll">Pay out according to the odds set by the dealer</p>
		</div>
	</div>
</template>

<script>
</script>

<style  scoped>
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