<template>
	<div>
		<div class="guess-game">
			Guess<img src="../assets/zheng.png" />Bitcoin Game
		</div>
		<div class="wallte">
				<div class="wallte-link" v-if="myAddress == undefined" @click="linkPay">
					wallet address
				</div>
				<div class="wallte-link" v-else>{{ myAddress }}</div>
			</div>
		<div class="mode">
			<div @click="mode = 0" :class="mode == 0 ? 'click modeChange' : 'modeChange'">
				PLAY1
			</div>
			<div @click="mode = 1" :class="mode == 1 ? 'click modeChange' : 'modeChange'">
				PLAY2
			</div>
		</div>
		<div class="big" v-show="mode == 0">
			<div class="view">
				<img :src="model1Img" v-if="Model1ViewGame.time ==0"  alt="">
				<img :src="ImgDong" v-else alt="">
				<p v-if="model1Time != 0">{{ model1Time }}</p>
				<p v-else></p>
				<div v-if="model1Time != 0" >Bet Countdown</div>
				<div v-else-if="Model1ViewGame.time ==0" >Lottery Over
					<div style="margin:5px"></div>
					 Start Betting 
				</div>
				<div v-else >
					in The Lottery 
				</div>
			</div>
			<div class="game-main">
				<div class="progress-group">
					<div class="progress clearfix">
						<span class="left progress-name">
            		Positive Bet
            	</span>
            	<span class="right progress-number" style="marginRight:-15px">
            		{{Model1ViewGame.TotalMoney >0? (Model1ViewGame.frontMoney / Model1ViewGame.TotalMoney * 100).toFixed(2)+'%': 0+'%' }}
            	</span>
						<div class="progress-right">
							<div class="progress-right-main" v-if="Model1ViewGame.TotalMoney >0">
								<span>{{scale(Model1ViewGame.frontMoney)}}</span>
								<div class="progress-right-mains" :style="'width:'+Model1ViewGame.frontMoney / Model1ViewGame.TotalMoney * 100+'%'"></div>
							</div>
							<div class="progress-right-main" v-else>
								<span>{{scale(Model1ViewGame.frontMoney)}}</span>
								<div class="progress-right-mains" style="width:0%"></div>
							</div>
						</div>
					</div>
					<div class="pledgable">
						Pledgable Amount：{{scale(Number(myBalance) + Number(totalReward))}}
					</div>
					
					<div class="scales color-red">
						Odds&nbsp;&nbsp;
						<span class="color-red" v-if="Model1ViewGame.contraryMoney != 0 && Model1ViewGame.frontMoney != 0">
							{{(Number(Model1ViewGame.contraryMoney) / Number(Model1ViewGame.frontMoney)).toFixed(2)}}
						</span>
						<span class="color-red" v-else-if="Model1ViewGame.contraryMoney == 0 && Model1ViewGame.frontMoney != 0">
							{{((Number(Model1ViewGame.contraryMoney)+1) / Number(Model1ViewGame.frontMoney)).toFixed(2)}}
						</span>
						<span class="color-red" v-else-if="Model1ViewGame.contraryMoney != 0 && Model1ViewGame.frontMoney == 0">
							{{(Number(Model1ViewGame.contraryMoney) / Number((Model1ViewGame.frontMoney)+1)).toFixed(2)}}
						</span>
						<span class="color-red" v-else>
							{{(Number((Model1ViewGame.contraryMoney) +1) / Number((Model1ViewGame.frontMoney)+1)).toFixed(2)}}
						</span>
					</div>
					<div class="pledgable colorwhite" 
            		v-if="
            		  Model1User.start &&
            		  Model1User.random == 0 &&
            		  Model1User.userIndex == Model1HeightPeriods
            		">
						Pledged：{{scale(Model1User.amount)}}
					</div>
					
					<div class="pledgable colorwhite" v-else>
						Pledged： 0 K TSB
					</div>
					<div class="positive-input clearfix">
						<div class="right positive-bet" 
          				v-if="AllowanceModel1 != 0"
          				@click="Model1Play(true)">
						  	BET
						</div>
						<div class="right positive-bet" v-else @click="model1ApproveFn">
							EMPOWER
						</div>
						 
						<div class="positive-input-main">
							<input type="text" 
							disabled="disabled"
          					@input="Model1FrontAmountFn"
          					placeholder="Please enter the amount pledged"
							:value="scale(Model1FrontAmount)"  
							  />
						</div>
						<div class="positive-button">
							<div class="positive-buttons" @click="Model1FrontAmount = 50000">Min</div>
							<div class="positive-buttons" @click="Model1FrontAmount = Model1FrontAmount * 1.5">1.5x</div>
							<div class="positive-buttons" @click="Model1FrontAmount = Model1FrontAmount * 2">2x</div>
							<div class="positive-buttons" @click="Model1FrontAmount = Model1FrontAmount * 5">5x</div>
						</div>
					</div>
				</div>
				<div class="progress-group">
					<div class="progress clearfix">
						<span class="left progress-name">
            		Negative Bet
            	</span>
            	<span class="right progress-number" style="marginRight:-15px">
            		{{Model1ViewGame.TotalMoney > 0 ? (Model1ViewGame.contraryMoney / Model1ViewGame.TotalMoney * 100).toFixed(2) +"%" : 0 + "%"}}
            	</span>
						<div class="progress-right">
							<div class="progress-right-main" v-if="Model1ViewGame.TotalMoney >0">
								<span>{{scale(Model1ViewGame.contraryMoney)}}</span>
								<div class="progress-right-mains" :style="'width:'+Model1ViewGame.contraryMoney / Model1ViewGame.TotalMoney * 100 +'%'"></div>
							</div>
							<div class="progress-right-main" v-else>
								<span>{{scale(Model1ViewGame.contraryMoney)}}</span>
								<div class="progress-right-mains" style="width:0%"></div>
							</div>
						</div>
					</div>
					<div class="pledgable">
						Pledgable Amount：{{scale(Number(myBalance) + Number(totalReward))}}
					</div>
					<div class="scales color-red">
						Odds&nbsp;&nbsp;
						<span class="color-red" v-if="Model1ViewGame.frontMoney != 0 && Model1ViewGame.contraryMoney != 0">
							{{(Number(Model1ViewGame.frontMoney) / Number(Model1ViewGame.contraryMoney)).toFixed(2)}}
						</span>
						<span class="color-red" v-else-if="Model1ViewGame.frontMoney == 0 && Model1ViewGame.contraryMoney != 0">
							{{((Number(Model1ViewGame.frontMoney)+1) / Number(Model1ViewGame.contraryMoney)).toFixed(2)}}
						</span>
						<span class="color-red" v-else-if="Model1ViewGame.frontMoney != 0 && Model1ViewGame.contraryMoney == 0">
							{{(Number(Model1ViewGame.frontMoney) / Number((Model1ViewGame.contraryMoney)+1)).toFixed(2)}}
						</span>
						<span class="color-red" v-else>
							{{(Number((Model1ViewGame.frontMoney) +1) / Number((Model1ViewGame.contraryMoney)+1)).toFixed(2)}}
						</span>
					</div>
					<div class="pledgable colorwhite" 
            			v-if="
            			  Model1User.start &&
            			  Model1User.random == 1 &&
            			  Model1User.userIndex == Model1HeightPeriods
            			">
						Pledged：{{ scale(Model1User.amount) }}TSB
					</div>
					<div class="pledgable colorwhite" 
            			v-else>
						Pledged： 0 K TSB
					</div>
					<div class="positive-input clearfix">
						<div class="right positive-bet" 
          				v-if="AllowanceModel1 != 0"
          				@click="Model1Play(false)">
						  	BET
						</div>
						<div class="right positive-bet" v-else @click="model1ApproveFn">
							EMPOWER
						</div>
						 
						<div class="positive-input-main">
							<input type="text" 
         					@input="Model1BackAmountFn" 
         					placeholder="Please enter the amount pledged"
							:value="scale(Model1BackAmount)"
							disabled="disabled"
							/>
						</div>
						<div class="positive-button">
							<div class="positive-buttons" @click="Model1BackAmount = 50000">Min</div>
							<div class="positive-buttons" @click="Model1BackAmount = Model1BackAmount * 1.5">1.5x</div>
							<div class="positive-buttons" @click="Model1BackAmount = Model1BackAmount * 2">2x</div>
							<div class="positive-buttons" @click="Model1BackAmount = Model1BackAmount * 5">5x</div>
						</div>
					</div>
				</div>
			</div>
			<div class="main-table">
				<div class="MYmode">
					<div @click="mode1Show = 0" :class="mode1Show == 0 ? 'MYclick MYmodeChange' : 'MYmodeChange'">
						All Bets
					</div>
					<div @click="mode1Show = 1" :class="mode1Show == 1 ? 'MYclick MYmodeChange' : 'MYmodeChange'">
						MyBets
					</div>
				</div>
				<div class="history" v-show="mode1Show == 0">
					<template>
						<el-table stripe :data="model1History" style="width: 100%">
							<el-table-column label="Rounds" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.number }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Result" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.random == 0" style="color: #eb3d00;">Positive</span>
									<span v-else style="color: #6ac334;">Negative</span>
								</template>
							</el-table-column>
							<el-table-column label="Player Ratio" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.frontCounting + "/" + scope.row.contraryCounting }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Positive Bet" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.frontMoney }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Negative Bet" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.contraryMoney }}</span>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</div>
				<div class="history" v-show="mode1Show == 1">
					<template>
						<el-table :data="Model1MyHistory" stripe style="width: 100%">
							<el-table-column label="Rounds" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.number }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Pledge direction" align="center">
								<template slot-scope="scope">
									<span v-show="scope.row.buy == 0 ">Positive</span>
									<span v-show="scope.row.buy == 1 ">Negative</span>
								</template>
							</el-table-column>
							
							<el-table-column label="Result" align="center">
								<template slot-scope="scope">
									<span v-show="scope.row.state ">WIN</span>
									<span v-show="!scope.row.state ">LOSE</span>
								</template>
							</el-table-column>
							<el-table-column prop="amount" align="center" label="Profit">
								<template slot-scope="scope">
									<span style="margin-left: 10px;color:#00b464" v-show="scope.row.state ">+{{scope.row.amount}}</span>
									<span style="margin-left: 10px;color:#fa4d56" v-show="!scope.row.state ">-{{scope.row.amount}}</span>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</div>
			</div>
		</div>
		<div class="big" v-show="mode == 1">
			<div class="view" v-if="Model2Banker.time == 0 || Number(Model2Banker.time)+30 > newTime2">
				<img :src="model2Img" alt="">
				<p v-if="Model2Banker.time == 0"> 30 </p>
				<p v-else>{{ Number(Model2Banker.time)+30 - Number(newTime2) >0?Number(Model2Banker.time)+30 - Number(newTime2):0 }}</p>
				<div>Grab Dealer Countdown</div>
			</div>
			<div class="view" v-else>
				<img :src="model2Img" alt="" v-if="Model2ViewGame.time ==0">
				<img :src="ImgDong" alt="" v-else>

				<p v-if="model2Time != 0">{{ model2Time }}</p>
				<p v-else></p>
				<div v-if="model2Time != 0" >Bet Countdown</div>
				<div v-else-if="Model2ViewGame.time ==0" >Grab Dealer End
					
					<div style="margin:5px"></div>Start Betting 
				</div>
				<div v-else >
					in The Lottery 
				</div>
			</div>
			<div class="game-main">
				<div class="dealers clearfix">
					<div class="right dealersbutton" @click="bankerQuitFn" v-if="Model2Banker.time == 0 || Number(Model2Banker.time)+30 > newTime2">
						Quit Dealer
					</div>
					<div class="right dealersbutton" style="background:#ccc" v-else>
						Quit Dealer
					</div>
					<div class="dealers-main">
						Current Dealer：{{ Model2Banker.bankerAddress }}
						<p>Dealer Pool：{{ scale(Model2Banker.bankerMoney) }}</p>
					</div>
				</div>
				<div class="game-form">
					<div class="clearfix game-input">
						<div class="left game-input-name">
							Positive Odds:
						</div>
						<div class="game-input-right">
							<input type="text" @input="Model2FrontRatioFn" v-model="Model2FrontRatio" disabled="disabled"/>
							<a class="addnumber">
								<img src="../assets/shang.svg" @click="addZeroOne(true)"/>
							</a>
							<a class="delnumber">
								<img src="../assets/xia.svg" @click="subZeroOne(true)"/>
							</a>
						</div>
					</div>
					<div class="clearfix game-input">
						<div class="left game-input-name">
							Negative Odds:
						</div>
						<div class="game-input-right">
							<input type="text" @input="Model2BackRatioFn" v-model="Model2BackRatio" disabled="disabled"/>
							<a class="addnumber">
								<img src="../assets/shang.svg" @click="addZeroOne(false)"/>
							</a>
							<a class="delnumber">
								<img src="../assets/xia.svg" @click="subZeroOne(false)"/>
							</a>
						</div>
					</div>
					<div class="clearfix game-input">
						<div class="left game-input-name">
							Dealer Cost:
						</div>
						<div class="game-input-right">
							<input type="text" @input="Model2BankerAmountFn" disabled="disabled" :value="scale(Model2BankerAmount)"/>
						</div>
					</div>
					<div class="positive-button">
						<div class="positive-buttons" @click="Model2BankerAmount = 2000000">Min</div>
						<div class="positive-buttons" @click="Model2BankerAmount = Model2BankerAmount*1.5">1.5x</div>
						<div class="positive-buttons" @click="Model2BankerAmount = Model2BankerAmount*2">2x</div>
						<div class="positive-buttons" @click="Model2BankerAmount = Model2BankerAmount*5">5x</div>

					<div class="grab-button" @click="bankerChangeRatioFn" v-show="this.Model2Banker[0] == this.myAddressAll" v-if="Model2Banker.time == 0 || Number(Model2Banker.time)+30 > newTime2">Change Ratio</div>				
					<div class="grab-button" style="background:#ccc" v-show="this.Model2Banker[0] == this.myAddressAll" v-else>Change Ratio</div>				

					<div class="grab-button" v-show="AllowanceModel2 != 0 && this.Model2Banker[0] != this.myAddressAll" @click="giveBanker" v-if="Model2Banker.time == 0 || Number(Model2Banker.time)+30 > newTime2">GRABDEALER</div>
					<div class="grab-button" style="background:#ccc" v-show="AllowanceModel2 != 0 && this.Model2Banker[0] != this.myAddressAll" v-else>GRABDEALER</div>

					<div class="grab-button" v-show="AllowanceModel2 == 0 && this.Model2Banker[0] != this.myAddressAll" @click="model2ApproveFn">Empower</div>
					</div>
				</div>
				<div class="progress-group">
					<div class="progress clearfix">
						<span class="left progress-name">
            		Positive Bet
            	</span>
				<span class="right progress-number" style="marginRight:-15px">
            		{{(Model2FrontMaxratio).toFixed(2)}}%
            	</span>
                        <div class="progress-right">
							<div class="progress-right-main">
								<span >{{scale(Model2ViewGame.frontMoney)}} TSB</span>
								<div class="progress-right-mains" :style="'width:'+Model2FrontMaxratio+'%'"></div>
							</div>
						</div>
					</div>
					<div class="scales color-red">
						Odds&nbsp;&nbsp;<span class="color-red">
							{{ Model2ViewGame.time != 0? Model2ViewGame.frontRatio : Model2Banker.frontRatio}}
						</span>
					</div>
					<div class="pledgable color-green" v-if="Number(myBalance) +Number(totalReward) > Number(bankerFrontMax) - Number(Model2ViewGame.frontMoney)">
						Pledgable Amount：{{scale(Number(bankerFrontMax) - Number(Model2ViewGame.frontMoney))}}
					</div>
					<div class="pledgable color-green" v-else>
						Pledgable Amount：{{scale(Number(myBalance) +Number(totalReward))}}
					</div>
					<div class="pledgable colorwhite" 
							v-if=" 
              				Model2User.start &&
            				Model2User.random == 0 &&
      						Model2User.userIndex == Model2HeightPeriods"
						 >
						Pledged：{{scale(Model2User.amount)}} TSB
					</div>
					<div class="pledgable colorwhite" v-else>
						Pledged：0 K TSB
					</div>
					<div class="positive-input clearfix"> 
						<div class="right positive-bet" v-if="AllowanceModel2 != 0" @click="Model2Play(true)">
							BET
						</div>
						<div class="right positive-bet" v-else @click="model2ApproveFn">EMPOWER</div>
						<div class="positive-input-main">
							<input type="text"  @input="Model2FrontAmountFn" disabled="disabled" :value="scale(Model2FrontAmount)"/>
						</div>
						<div class="positive-button">
							<div class="positive-buttons" @click="Model2FrontAmount = 50000">Min</div>
							<div class="positive-buttons" @click="Model2FrontAmount = Model2FrontAmount * 1.5">1.5x</div>
							<div class="positive-buttons" @click="Model2FrontAmount = Model2FrontAmount * 2">2x</div>
							<div class="positive-buttons" @click="Model2FrontAmount = Model2FrontAmount * 5">5x</div>
						</div>
					</div>
				</div>
				<div class="progress-group">
					<div class="progress clearfix">
						<span class="left progress-name">
            		Negative Bet
            	</span>
            	<span class="right progress-number" style="marginRight:-15px">
            		{{(Model2ContraryMaxratio).toFixed(2)}}%
            	</span>
						<div class="progress-right">
							<div class="progress-right-main">								
								<span >{{scale(Model2ViewGame.contraryMoney)}} TSB</span> 
								<div class="progress-right-mains" :style="'width:'+ Model2ContraryMaxratio+'%'"></div>
							</div>
						</div>
					</div>
					<div class="scales color-red">
						Odds&nbsp;&nbsp;<span class="color-red">{{ Model2ViewGame.time != 0? Model2ViewGame.contraryRatio : Model2Banker.contraryRatio}}</span>
					</div> 
					<div class="pledgable color-green" v-if="Number(myBalance) +Number(totalReward) > Number(bankerContraryMax) - Number(Model2ViewGame.contraryMoney)">
						Pledgable Amount：{{scale(Number(bankerContraryMax) - Number(Model2ViewGame.contraryMoney))}}
					</div>
					<div class="pledgable color-green" v-else>
						Pledgable Amount：{{scale(Number(myBalance) +Number(totalReward))}}
					</div>
					<div class="pledgable colorwhite"
						v-if=" 
              			Model2User.start &&
  						Model2User.random == 1 &&
            			Model2User.userIndex == Model2HeightPeriods"
						>
						Pledged：{{scale(Model2User.amount)}} TSB
					</div>
					<div class="pledgable colorwhite"
						v-else>
						Pledged：0 K TSB
					</div>
					<div class="positive-input clearfix">
						<div class="right positive-bet" v-if="AllowanceModel2 != 0" @click="Model2Play(false)">
							BET
						</div>
						<div class="right positive-bet" v-else @click="model2ApproveFn">EMPOWER</div>
						
						<div class="positive-input-main">
							<input type="text" @input="Model2BackAmountFn" disabled="disabled" :value="scale(Model2BackAmount)"/>
						</div>
						<div class="positive-button">
							<div class="positive-buttons" @click="Model2BackAmount = 50000">Min</div>
							<div class="positive-buttons" @click="Model2BackAmount = Model2BackAmount * 1.5">1.5x</div>
							<div class="positive-buttons" @click="Model2BackAmount = Model2BackAmount * 2">2x</div>
							<div class="positive-buttons" @click="Model2BackAmount = Model2BackAmount * 5">5x</div>
						</div>
					</div>
				</div>
			</div>
			<div class="main-table">
				<div class="MYmode">
					<div @click="mode2Show = 0" :class="mode2Show == 0 ? 'MYclick MYmodeChange' : 'MYmodeChange'">
						All Bets
					</div>
					<div @click="mode2Show = 1" :class="mode2Show == 1 ? 'MYclick MYmodeChange' : 'MYmodeChange'">
						MyBets
					</div>
				</div>
				<div class="history" v-show="mode2Show == 0">
					<template>
						<el-table :data="model2History" style="width: 100%">
							<el-table-column label="Rounds" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.number }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Result" align="center">
								<template slot-scope="scope">
									<span v-if="scope.row.random == 0" style="color: #eb3d00;">Positive</span>
									<span v-else style="color: #6ac334;">Negative</span>
								</template>
							</el-table-column>
							<el-table-column label="Player Ratio" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.frontCounting + "/" + scope.row.contraryCounting }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Positive Bet" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.frontMoney }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Negative Bet" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.contraryMoney }}</span>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</div>
				<div class="history" v-show="mode2Show == 1">
					<template>
						<el-table :data="Model2MyHistory" style="width: 100%">
							<el-table-column label="Rounds" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.number }}</span>
								</template>
							</el-table-column>
							<el-table-column label="Pledge direction" align="center">
								<template slot-scope="scope">
									<span v-show="scope.row.buy == 0 ">Positive</span>
									<span v-show="scope.row.buy == 1 ">Negative</span>
									<span v-show="scope.row.buy == 3 ">Dealer</span>
								</template>
							</el-table-column>
							<el-table-column label="Result" align="center">
								<template slot-scope="scope">
									<span v-show="scope.row.state ">WIN</span>
									<span v-show="!scope.row.state ">LOSE</span>
								</template>
							</el-table-column>
							<el-table-column prop="amount" label="Profit" align="center">
								<template slot-scope="scope">
									<span style="color:#00b464" v-show="scope.row.state ">+{{scope.row.amount}}</span>
									<span style="color:#fa4d56" v-show="!scope.row.state ">-{{scope.row.amount}}</span>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</div>
			</div>
		</div>
		<div v-show="curtain" class="curtain"></div>
		<router-view> </router-view>
	</div>
</template>

<script>
	import big from "big.js";

	big.NE = -40
	big.PE = 40
	import { NumSplic , scale } from "../unit/tool";
	export default {
		data() {
			return {
				positiveamount1: '100k',
				positiveamount2: '5M',
				positiveamount3: 1,
				positiveamount4: 1,
				ImgDong: require('../assets/BTC.gif'),
				model1Img: require('../assets/zheng.png'),
				model2Img: require('../assets/zheng.png'),
				newTime1: 0,
				newTime1Temp: 0,
				newTime2: 0,
				newTime2Temp: 0,
				model1Time: 0,
				model2Time: 0,
				// 遮罩
				curtain: false,
				// 菜单
				menu: false, 
				myAddress: undefined,
				myAddressAll: undefined,
				// 模式切换
				mode: 1,
				mode1Show: 0,
				mode2Show: 0,
				// 余额
				myBalance : 0,
				// 可领取奖励 
				totalReward : 0,
				//                                     模式一
				// 授权额度
				AllowanceModel1: 0,
				// 正面授权开关
				AllowanceModel1FrontBool: true,
				// 背面授权开关
				AllowanceModel1BackBool: true,
				// 正面输入质押量
				Model1FrontAmount: 50000,
				// 背面输入质押量
				Model1BackAmount: 50000,
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
				// 用户历史记录
				Model1MyHistory: [],
				// 历史记录
				model1History: [],
				//                                      模式二
				// 授权额度
				AllowanceModel2: 0,
				// 正面授权开关
				AllowanceModel2FrontBool: true,
				// 背面授权开关
				AllowanceModel2BackBool: true,
				// 正面输入质押量
				Model2FrontAmount: 50000,
				// 背面输入质押量
				Model2BackAmount: 50000,
				// 当前最高期数
				Model2HeightPeriods: 0,
				// 当前最高期数信息
				Model2ViewGame: {},
				// 正面总数
				Model2FrontNum: 0,
				// 反面总数
				Model2ContraryNum: 0,
				// 用户信息
				Model2User: {
				},
				// 庄家信息
				Model2Banker: {},
				// 正面赔付率
				Model2FrontRatio: 1,
				// 反面赔付率
				Model2BackRatio: 1,
				// 抢庄金额
				Model2BankerAmount: 2000000,
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
				// 用户历史
				Model2MyHistory: [],
				// 历史记录
				model2History: [{
					contraryMoney: 0,
					end: false,
					frontMoney: 0,
					random: 0,
				}, ],
			};
		},
		created() {

		},
		methods: {
			scale(val) {
				return scale(val)
			},
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
			// 余额
			TokenBalanceFn() {
				// model1 
				this.$contract
					.TokenBalance()
					.then((data) => {
						this.myBalance = 
								big(data)
								.div(10 ** 18)
								.toString(); 
					})
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
							message: 'Authorization success',
							type: 'success'
						});
						this.curtain = false;
					})
					.catch((error) => {
						this.$message.error('Authorization failure');
						this.curtain = false;
					});
			},
			// model1正面input输入质押量
			Model1FrontAmountFn(e) {
				if(e.target.value >= 0) {
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
				if(e.target.value >= 0) {
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
				if(Number(this.Model1ViewGame.time) + 150 > Number(this.newTime1) || this.Model1ViewGame.time == 0) {

				} else {
					this.$message({
						showClose: true,
						message: 'Exceed the pledge time',
						type: 'warning'
					});
					return
				}

				var amount;
				if(bool) {
					// 正面
					if(this.Model1User.userIndex == this.Model1HeightPeriods && this.Model1User.start && this.Model1User.random == 1) {
						this.$message({
							showClose: true,
							message: 'You cannot pledge your opposite',
							type: 'warning'
						});
						return
					}
					if(this.Model1FrontAmount < 50000) {
						this.$message({
							message: "Minimum pledge 50K",
							type: "warning",
						});
						return;
					}
					amount = this.Model1FrontAmount;
				} else {
					// 反面
					if(this.Model1User.userIndex == this.Model1HeightPeriods && this.Model1User.start && this.Model1User.random == 0) {
						this.$message({
							showClose: true,
							message: 'You cannot pledge your opposite',
							type: 'warning'
						});
						return
					}
					if(this.Model1BackAmount < 50000) {
						this.$message({
							message: "Minimum pledge 50K",
							type: "warning",
						});
						return;
					}
					amount = this.Model1BackAmount;
				}
				this.curtain = true;
				this.$contract.freePlay(bool, amount).then((data) => {
					this.$message({
						message: 'The pledge success',
						type: 'success'
					});
					this.curtain = false;
					this.Model1FrontAmount = 50000
					this.Model1BackAmount = 50000
				}).catch((error) => {
					this.$message.error('The pledge failure');
					this.curtain = false;
				});;
			},
			// model1开奖
			Model1Lottery() {
				if(this.Model1ViewGame.frontMoney == 0 && this.Model1ViewGame.contraryMoney == 0) {
					this.$message({
						showClose: true,
						message: 'The current period has not yet begun',
						type: 'warning'
					});
					return
				}
				if(Number(this.Model1ViewGame.time) + 150 > Number(this.newTime1)) {
					this.$message({
						showClose: true,
						message: 'The drawing time is not here yet',
						type: 'warning'
					});
					return
				}
				this.curtain = true;
				this.$contract
					.freeLottery()
					.then((data) => {
						this.$message({
							message: 'The lottery success',
							type: 'success'
						});
						this.curtain = false;
						// 查询最高期数
						this.$contract.freeViewHeightPeriods().then(height => {
							this.$contract.freeViewGame(Number(height) - 1).then((msg) => {
								// console.log(msg.random,"zhengfan")
								if(msg.random == 0) {
									this.model1Img = require("../assets/zheng.png");
								} else {
									this.model1Img = require("../assets/fan.png");
								}
								// setTimeout(() => {
								// 	this.model1Img = require("../assets/BTC.gif");
								// }, 3000)
							})
						})
					})
					.catch((error) => {
						this.$message.error('The lottery failure');
						this.curtain = false;
					});
			},
			// model1 上一期
			model1Last() {
				this.$contract.freeViewHeightPeriods().then(height => {
					if(height!=0) { 
						this.$contract.freeViewGame(Number(height) - 1).then((msg) => {
							// console.log(msg.random,"zhengfan")
							if(msg.random == 0) {
								this.model1Img = require("../assets/zheng.png");
							} else {
								this.model1Img = require("../assets/fan.png");
							}
						})
					}
				})
			},
			// mode1查询当前最高期数
			freeViewHeightPeriodsFn() {
				this.$contract.freeViewHeightPeriods().then((data) => {
					this.Model1HeightPeriods = data;
					this.freeViewGameFn(data);
					let length = 10;
					if(data > 10) {
						length = Number(data);
					}
					let arr = [];
					for(let i = length; i >= length - 10; i--) {
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
						if(element.end) {
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
						}
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
					this.Model1ViewGame.TotalMoney = Number(this.Model1ViewGame.contraryMoney) + Number(this.Model1ViewGame.frontMoney)
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
			// model1用户信息最高
			freeViewMyHistoryLengthFn() {
				this.$contract.freeViewMyHistoryLength().then(data => {
					let arr = [];
					let length = Number(data);
					if(data < 10) {
						for(let i = length; i > 0; i--) {
							arr.push(i - 1);
						}
					} else {
						for(let i = length; i > length - 10; i--) {
							arr.push(i - 1);
						}
					}
					this.freeViewMyHistoryFn(arr);
				});
			},
			// 用户历史信息
			freeViewMyHistoryFn(arr) {
				Promise.all(
					arr.map(data => {
						return this.$contract.freeViewMyHistory(data);
					})
				).then(async data => {
					let newArr = [];
					// console.log(this.Model1User.amount != 0 && this.Model1HeightPeriods != this.Model1User.userIndex,"log")
					if(this.Model1User.amount != 0 && this.Model1HeightPeriods != this.Model1User.userIndex) {
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
					data.map(element => {
						let obj = element;
						obj.amount = NumSplic(
							big(element.amount)
							.div(10 ** 18)
							.toString(),
							4
						);
						newArr.push(obj);
						// console.log(element,"newaaaaaaaaaaaaaaaaaaaaaaa")
					});
					this.Model1MyHistory = newArr;
					// console.log(data)
				});
			},

			//                                                       model2
			// 加0.1
			addZeroOne(bool){
				if(bool) {
					this.Model2FrontRatio = big(this.Model2FrontRatio).plus(0.1)
				}else {
					this.Model2BackRatio = big(this.Model2BackRatio).plus(0.1)
				}
			},
 			// 减0.1
			subZeroOne(bool) { 
				if(bool) {
					if(this.Model2FrontRatio > 1) {
						this.Model2FrontRatio = big(this.Model2FrontRatio).minus(0.1)
					}
				}else {
					if(this.Model2BackRatio > 1) {
						this.Model2BackRatio = big(this.Model2BackRatio).minus(0.1)
					}
					
				}
			},
			// 授权
			model2ApproveFn() {
				// model2
				this.curtain = true;
				this.$contract
					.TokenApprove(this.$contract.getContractsAddress().banker)
					.then((data) => {
						this.$message({
							message: 'Authorization success',
							type: 'success'
						});
						this.curtain = false;
					})
					.catch((error) => {
						this.$message.error('Authorization failure');
						this.curtain = false;
					});
			},
			// model2正面input输入质押量
			Model2FrontAmountFn(e) {
				if(e.target.value > 0) {
					var re = /([0-9]+\.[0-9]{18})[0-9]*/;
					this.Model2FrontAmount = e.target.value.replace(re, "$1");
					if(e.target.value > Number(this.bankerFrontMax) - Number(this.Model2ViewGame.frontMoney)) {
						this.Model2FrontAmount = Number(this.bankerFrontMax) - Number(this.Model2ViewGame.frontMoney);
					}
				} else {
					this.Model2FrontAmount = 0;
				}
				this.AllowanceModel2FrontBool = !big(this.AllowanceModel2).lt(
					big(this.Model2FrontAmount)
				);
			},
			// model2背面input输入质押量
			Model2BackAmountFn(e) {
				if(e.target.value > 0) {
					var re = /([0-9]+\.[0-9]{18})[0-9]*/;
					this.Model2BackAmount = e.target.value.replace(re, "$1");
					if(e.target.value > Number(this.bankerContraryMax) - Number(this.Model2ViewGame.contraryMoney)) {
						this.Model2BackAmount = Number(this.bankerContraryMax) - Number(this.Model2ViewGame.contraryMoney);
					}
				} else {
					this.Model2BackAmount = 0;
				}
				this.AllowanceModel2BackBool = !big(this.AllowanceModel2).lt(
					big(this.Model2BackAmount)
				);
			},
			// model2质押
			Model2Play(bool) {
				if(Number(this.Model2ViewGame.time) + 150 > Number(this.newTime2) || this.Model2ViewGame.time == 0) {

				} else {
					this.$message({
						showClose: true,
						message: 'Exceed the pledge time',
						type: 'warning'
					});
					return
				}

				var amount;

				if(bool) {
					// 正面

					if(this.Model2User.userIndex == this.Model2HeightPeriods && this.Model2User.start && this.Model2User.random == 1) {
						this.$message({
							showClose: true,
							message: 'You cannot pledge your opposite',
							type: 'warning'
						});
						return
					}

					if(this.Model2FrontAmount < 50000) {
						this.$message({
							message: "Minimum pledge 50K",
							type: "warning",
						});
						return;
					}
					amount = this.Model2FrontAmount;
				} else {
					// 反面
					if(this.Model2User.userIndex == this.Model2HeightPeriods && this.Model2User.start && this.Model2User.random == 0) {
						this.$message({
							showClose: true,
							message: 'You cannot pledge your opposite',
							type: 'warning'
						});
						return
					}

					if(this.Model2BackAmount < 50000) {
						this.$message({
							message: "Minimum pledge 50K",
							type: "warning",
						});
						return;
					}
					amount = this.Model2BackAmount;
				}
				this.curtain = true;
				this.$contract.bankerPlay(bool, amount).then((data) => {
					this.$message({
						message: 'The pledge success',
						type: 'success'
					});
					this.curtain = false;
					this.Model2FrontAmount = 50000
					this.Model2BackAmount = 50000
				}).catch((error) => {
					this.$message.error('The pledge failure');
					this.curtain = false;
				});;
			},
			// model2开奖
			Model2Lottery() {
				if(this.Model2ViewGame.frontMoney == 0 && this.Model2ViewGame.contraryMoney == 0) {
					this.$message({
						showClose: true,
						message: 'The current period has not yet begun',
						type: 'warning'
					});
					return
				}
				if(Number(this.Model2ViewGame.time) + 150 > Number(this.newTime2)) {
					this.$message({
						showClose: true,
						message: 'The drawing time is not here yet',
						type: 'warning'
					});
					return
				}
				this.curtain = true;
				this.$contract
					.bankerLottery()
					.then((data) => {
						this.$message({
							message: 'The lottery success',
							type: 'success'
						});
						this.curtain = false;

						// 查询最高期数
						this.$contract.bankerViewHeightPeriods().then(height => {
							this.$contract.bankerViewGame(Number(height) - 1).then((msg) => {
								if(msg.random == 0) {
									this.model2Img = require("../assets/zheng.png");
								} else {
									this.model2Img = require("../assets/fan.png");
								}
								// setTimeout(() => {
								// 	this.model2Img = require("../assets/BTC.gif");
								// }, 3000)
							})
						})
						// setTimeout (() => {
						// },1500)
					})
					.catch((error) => {
						this.$message.error('The lottery failure');
						this.curtain = false;
					});
			},
			// 模式2上一期 
			model2Last() {
				// 查询最高期数
				this.$contract.bankerViewHeightPeriods().then(height => {
					if(height!=0){ 
						this.$contract.bankerViewGame(Number(height) - 1).then((msg) => { 
							if(msg.random == 0) {
								this.model2Img = require("../assets/zheng.png");
							} else {
								this.model2Img = require("../assets/fan.png");
							}
							// setTimeout(() => {
							// 	this.model2Img = require("../assets/BTC.gif");
							// }, 3000)
						})
					}
				})
			},
			// mode2查询当前最高期数
			bankerViewHeightPeriodsFn() {
				this.$contract.bankerViewHeightPeriods().then((data) => {
					this.Model2HeightPeriods = data;
					this.bankerViewGameFn(data);
					let length = 8;
					if(data > 8) {
						length = Number(data);
					}
					let arr = [];
					for(let i = length; i >= length - 8; i--) {
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
						if(element.end) {
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
						}
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
					obj.frontRatio = NumSplic(
						big(data.frontRatio)
						.div(10)
						.toString(),
						1
					);
					obj.contraryRatio = NumSplic(
						big(data.contraryRatio)
						.div(10)
						.toString(),
						1
					);
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
					obj.frontRatio = NumSplic(
						big(data.frontRatio)
						.div(10)
						.toString(),
						1
					);
					obj.contraryRatio = NumSplic(
						big(data.contraryRatio)
						.div(10)
						.toString(),
						1
					);
					if(obj.bankerAddress == "0x0000000000000000000000000000000000000000") {
						obj.bankerAddress = "none"
					} else {
						obj.bankerAddress = data.bankerAddress.substr(0, 4) + "..." + data.bankerAddress.substr(38, 4);
					}
					this.Model2Banker = obj
				});
			},
			// model2正面input输入赔付率
			Model2FrontRatioFn(e) {
				if(e.target.value >= 0) {
					var re = /([0-9]+\.[0-9]{1})[0-9]*/;
					this.Model2FrontRatio = e.target.value.replace(re, "$1");
				} else {
					this.Model2FrontRatio = null;
				}
			},
			// model2背面input输入赔付率
			Model2BackRatioFn(e) {
				if(e.target.value >= 0) {
					var re = /([0-9]+\.[0-9]{1})[0-9]*/;
					this.Model2BackRatio = e.target.value.replace(re, "$1");
				} else {
					this.Model2BackRatio = null;
				}
			},
			// model2抢庄金额
			Model2BankerAmountFn(e) {
				if(e.target.value >= 0) {
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
				if(this.Model2FrontRatio < 1) {
					this.$message({
						message: 'Please set the positive loss ratio, minimum 1',
						type: 'warning'
					});
					return
				}
				if(this.Model2BackRatio < 1) {
					this.$message({
						message: 'Please set the negative loss ratio, the minimum is 1',
						type: 'warning'
					});
					return
				}

				if(Number(this.Model2BankerAmount) < 2000000) {
					this.$message({
						message: 'Please enter the correct amount of pledge, minimum 2M',
						type: 'warning'
					});
					return
				}
				if(Number(this.Model2BankerAmount) < Number(this.Model2Banker.bankerMoney) + 200000) {
					this.$message({
						message: 'Please enter the correct amount of pledge',
						type: 'warning'
					});
					return
				}

				this.curtain = true;
				this.$contract.bankerRob(this.Model2BankerAmount, this.Model2FrontRatio, this.Model2BackRatio).then((data) => {
					this.$message({
						message: 'Rob zhuang successful',
						type: 'success'
					});
					this.curtain = false;
				}).catch((error) => {
					this.$message.error('Rob zhuang failure');
					this.curtain = false;
				});
			},
			// model2查询可质押最大量
			bankMaxDepositFn() {
				if(this.Model2Banker.bankerAddress == "none") {
					this.Model2ContraryMaxratio = 0
					this.Model2FrontMaxratio = 0
					return
				}

				// 正面
				this.$contract.bankMaxDeposit(true).then((data) => {
					let frontMax = big(data).div(10 ** 18).toString();
					this.bankerFrontMax = frontMax;
					this.Model2FrontMaxratio = Number(NumSplic(big(this.Model2ViewGame.frontMoney).div(big(frontMax)).times(100).toString(), 2));
					if(this.Model2ViewGame.frontMoney == 0) {
						this.Model2FrontMaxratio = 0
					}
				}).catch(error => {
					// console.log(error,"***************")  
					this.Model2FrontMaxratio = 0
				});
				// 反面
				this.$contract.bankMaxDeposit(false).then((data) => {
					let contraryMax = big(data).div(10 ** 18).toString();
					this.bankerContraryMax = contraryMax;
					this.Model2ContraryMaxratio = Number(NumSplic(big(this.Model2ViewGame.contraryMoney).div(big(contraryMax)).times(100).toString(), 2));
					if(this.Model2ViewGame.contraryMoney == 0) {
						this.Model2ContraryMaxratio = 0
					}
				}).catch(error => {
					// console.log(error,"***************")   
					this.Model2ContraryMaxratio = 0
				});
			},
			// model2退庄
			bankerQuitFn() {
				if(this.Model2Banker[0] != this.myAddressAll) {
					this.$message({
						message: 'The current dealer is not you',
						type: 'warning'
					});
					return
				}
				this.curtain = true;
				this.$contract.bankerQuit().then(data => {
					this.$message({
						message: 'Refund success zhuang',
						type: 'success'
					});
					this.curtain = false;
				}).catch((error) => {
					this.$message.error('Zhuang failed back');
					this.curtain = false;
				});
			},
			// model2修改赔率 
			bankerChangeRatioFn() {
				if(this.Model2Banker[0] != this.myAddressAll) {
					this.$message({
						message: 'The current dealer is not you',
						type: 'warning'
					});
					return
				}
				if(this.Model2FrontRatio <= 0) {
					this.$message({
						message: 'Please set positive loss ratio',
						type: 'warning'
					});
					return
				}
				if(this.Model2BackRatio <= 0) {
					this.$message({
						message: 'Please set negative loss rate',
						type: 'warning'
					});
					return
				}
				this.curtain = true;
				this.$contract.bankerChangeRatio(this.Model2FrontRatio, this.Model2BackRatio).then(data => {
					this.$message({
						message: 'modify successfully',
						type: 'success'
					});
					this.curtain = false;
				}).catch((error) => {
					this.$message.error('fail to modify');
					this.curtain = false;
				});
			},
			// model2用户信息最高
			bankViewMyHistoryLengthFn() {
				this.$contract.bankViewMyHistoryLength().then(data => {
					let arr = [];
					let length = Number(data);
					// console.log(length,"-------")
					if(data < 10) {
						for(let i = length; i > 0; i--) {
							arr.push(i - 1);
						}
					} else {
						for(let i = length; i > length - 10; i--) {
							arr.push(i-1);
						}
					}
					// console.log(arr,"-------")
					this.bankViewMyHistoryFn(arr);
				});
			},
			// 用户历史信息
			bankViewMyHistoryFn(arr) { 
				Promise.all(
					arr.map(data => {
						return this.$contract.bankViewMyHistory(data);
					})
				).then(async data => {
					let newArr = [];
					if(this.Model2User.amount != 0 && this.Model2HeightPeriods != this.Model2User.userIndex) {
						await this.$contract.bankerViewGame(this.Model2User.userIndex).then(newData => {
							// console.log(newAddArr,"new BankerViewGame")
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
					this.Model2MyHistory = newArr;
					// console.log(newArr, "newArr")
				});
			},
			// 计算可领取奖励
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
			
			// 时间
			giveNowTime () {
				this.$contract.viewNowTime1().then(data => {
					if(this.newTime1Temp != data ) {
						this.newTime1Temp = Number(data)
						this.newTime1 = Number(data)
					}
				})
				// 
				this.$contract.viewNowTime2().then(data => {
					if(this.newTime2Temp != data ) {
						this.newTime2Temp = Number(data)
						this.newTime2 = Number(data)
					}
				})
			},
			//                                                    加载钱包后操作
			create() { 
				this.routerViewCalcFn()
				this.giveNowTime() 
				 
				this.queryAllowance();
				this.freeViewHeightPeriodsFn();
				this.freeViewFrontNumFn();
				this.freeViewContraryNumFn();
				this.freeViewUserFn();
				this.freeViewMyHistoryLengthFn(); 
				this.model1Last(); 

				this.bankerViewHeightPeriodsFn();
				this.bankerViewFrontNumFn();
				this.bankerViewContraryNumFn();
				this.bankerViewUserFn();
				this.bankerNowBankerFn()
				this.bankMaxDepositFn()
				this.bankViewMyHistoryLengthFn()
				this.model2Last()

				clearInterval(this.fn);
				this.fn = setInterval(this.whileFN, 3000); 
			},
			whileFN() {
	  			this.routerViewCalcFn()
	  			this.giveNowTime()
	  
				this.queryAllowance();
				this.TokenBalanceFn();
				this.freeViewHeightPeriodsFn();
				this.freeViewFrontNumFn();
				this.freeViewContraryNumFn();
				this.freeViewUserFn();
				this.freeViewMyHistoryLengthFn();
				this.model1Last();

				this.bankerViewHeightPeriodsFn();
				this.bankerViewFrontNumFn();
				this.bankerViewContraryNumFn();
				this.bankerViewUserFn();
				this.bankerNowBankerFn()
				this.bankMaxDepositFn()
				this.bankViewMyHistoryLengthFn()
				this.model2Last()
			},
			whileTime() {
				this.newTime1 ++;
				this.newTime2 ++;  
				if(Number(this.Model1ViewGame.time) + 150 > Number(this.newTime1)) {
					this.model1Time = Number(this.Model1ViewGame.time) + 150 - Number(this.newTime1);
				} else {
					this.model1Time = "0"
				} 
				if(Number(this.Model2ViewGame.time) + 150 > Number(this.newTime2)) {
					this.model2Time = Number(this.Model2ViewGame.time) + 150 - Number(this.newTime2);
				} else {
					this.model2Time = "0"
				}
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
		}
	};
</script>

<style lang="scss" scoped>
.progress-number{color: #da251d;font-size: 14px;line-height: 30px;}
.color-green{color: #84c225!important;}
.colorwhite{color: #fff!important;}
.color-red{color: #da251d!important;font-size:18px;}
.scales{font-size: 14px;color: #fff;margin-top: 10px;}
.scale-number{color: #d71377;line-height: 30px;}
.dealers{margin-top: 20px;}
.wallte {
		text-align: center;
	}
	
	.wallte .wallte-link {
		display: inline-block;
		font-size: 14px;
		color: #db137a;
		padding: 10px 0px 0px 0px;
	}
input:focus{outline: none;}
.addnumber,.delnumber{cursor: pointer;display: inline-block;line-height: 38px;width:40px;border-left: 1px solid #aed770;text-align: center;position: absolute;top: 0;}
.delnumber{right: 0;}
.addnumber{right: 41px;}
.delnumber img,.addnumber img{width: 20px;display: inline-block;vertical-align: middle;}
	.game-input {
		margin-bottom: 15px;
	}
	
	.game-input-name {
		font-size: 14px;
		color: #fff;
		line-height: 38px;
		height: 38px!important;
	}
	
	.game-input-right {
		margin-left: 110px;
		position: relative;
	}
	
	.game-input-right input {
		-webkit-appearance: none;
		color: #ea862f;
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
	
	.game-form {
		border: 1px solid #fff;
		border-radius: 5px;
		padding: 15px;
		margin-top: 20px;
	}
	
	.dealers-main {
		margin-right: 125px;
		color: #fff;
		font-size: 14px;
	}
	
	.dealers-main p {
		color: #da251d;
		margin: 0;
		margin-top: 5px;
	}
	
	.dealersbutton {
		display: inline-block;
		background: #84c225;
		color: #fff;
		font-size: 16px;
		padding: 0 5px;
		line-height: 28px;
		margin-top: 8px;
		margin-right: 15px;
	}
	
	.positive-buttons {
		display: inline-block;
		width: 60px;
		cursor: pointer;
		line-height: 38px;
		font-size: 14px;
		text-align: center;
		color: #fff;
		background: #0093dd;
		margin-top: 10px;
		margin-right: 10px;
	}
	.grab-button{display: inline-block;background: #da251d;font-size: 14px;padding: 0 5px;line-height: 38px;cursor: pointer;color: #fff;}
	.positive-bet {
		display: inline-block;
		cursor: pointer;
		line-height: 38px;
		width: 120px;
		font-size: 16px;
		text-align: center;
		color: #fff;
		background: #da251d;
	}
	
	.positive-input-main {
		margin-right: 130px;
	}
	
	.positive-input-main input {
		-webkit-appearance: none;
		color: #ea862f;
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
	
	.progress-group {
		margin-top: 30px;
	}
	
	.game-main {
		width: 500px;
		margin: 0 auto;
	}
	
	.progress-name {
		font-size: 14px;
		color: #fff;
		line-height: 30px;
	}
	
	.pledgable {
		color: #da251d;
		font-size: 14px;
		margin: 10px 0px;
	}
	
	.progress-right-main {
		position: relative;
		height: 30px;
		background: #c2c1c1;
		text-align: center;
		line-height: 30px;
		color: #da251d;
	}
	
	.progress-right-mains {
		display: inline-block;
		position: absolute;
		left: 0;
		height: 30px;
		background: #84c225;
		top: 0;
	}
	
	.progress-right-main span {
		display: block;
		position: relative;
		z-index: 1;
	}
	
	.progress-right {
		margin-left:90px;
		margin-right: 35px;
	}
	
	.main-button {
		width: 100px;
	}
	
	@media (max-width:767px) {
		.game-main {
			width: 94%;
		}
		.positive-button{padding-right: 100px;}
		.positive-buttons {
			width: 22%;
			font-size: 12px;
			line-height: 40px;
			margin-right: 3%;
			vertical-align: top;
		}
		.positive-buttons:last-child{margin-right: 0;}
		.game-form .positive-buttons{margin-top: 0px;width: 14%;margin-right: 3%;}
		.game-form .positive-button{padding: 0;}
		.positive-bet {
			line-height: 40px;
			width: 90px;
			font-size: 14px;
		}
		.positive-input-main {
			margin-right: 95px;
		}
		.positive-input-main input,
		.game-input-right input {
			height: 40px!important;
			line-height: 40px;
		}
		.game-input-name {
			line-height: 40px;
			height: 40px!important;
		}
		.grab-button{line-height: 40px;}
		.game-form .grab-button{width: 32%;box-sizing: border-box;text-align: center;}
		.addnumber,.delnumber{height: 40px;line-height: 40px;width: 32px;}
		.addnumber{right: 33px;}
		.addnumber img,.delnumber img{width: 12px;vertical-align: 1px;}
	}
	
	.main-table {
		background: #fff;
		padding: 50px 0px;
		margin-top: 50px;
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
	
	.guess-game {
		text-align: center;
		font-size: 22px;
		color: #fff;
		margin-top: 20px;
	}
	
	.guess-game img {
		width: 20px;
		vertical-align: middle;
		margin: 0 5px;
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
		border: 1px solid #b3b3b3;
		border-radius: 4px;
		height: 40px !important;
		padding-left: 10px;
		box-sizing: border-box;
	}
	
	.top {
		height: 65px;
		background-color: #2780e3;
		line-height: 70px;
		padding: 0 100px;
	}
	
	.mode {
		margin-top: 20px;
		margin-bottom: 30px;
		text-align: center;
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
	
	.MYmode {
		padding: 0 10px;
		text-align: center;
	}
	
	.MYmodeChange {
		display: inline-block;
		margin: 0 10px;
		line-height: 35px;
		color: #fff;
		display: inline-block;
		background-color: #e086aa;
		border-radius: 5px;
		padding: 0 10px;
		min-width: 125px;
		cursor: pointer;
	}
	
	.MYclick {
		background-color: #dd137b !important;
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
		text-align: center;
		position: relative;
		color: #fff;
		p {
			font-size: 30px;
			margin: 0;
		}
	}
	
	.view>div {
		background-color: #fff;
		display: inline-block;
		text-align: center;
		font-size: 14px;
		color: #fff;
		background-color: #da251d;
		padding: 2px 10px 5px 10px;
		margin: 10px 0px;
		cursor: pointer;
	}
	
	.view>img {
		width: 130px;
	}
	
	.dispostBig {
		width: 50%;
		margin: 0 auto;
		.dispost {
			width: 50%;
			box-sizing: border-box;
			padding: 0 30px;
			color: #fff;
			margin-top: 30px;
			.dispostAmount {
				height: 20px;
				outline: none;
				width: 100%;
				margin-top: 10px;
				-webkit-appearance: none;
				border-radius: 0;
			}
			.tip {
				div {
					font-size: 14px;
					margin-top: 10px;
					border-radius: 0px;
				}
				.title {
					width: 100%;
					text-align: left;
					color: #79ae26;
					margin-bottom: 20px;
					font-size: 18px;
				}
			}
			.goButton {
				text-align: center;
			}
			.submit {
				display: inline-block;
				line-height: 40px;
				border-radius: 5px;
				background-color: #84c225;
				min-width: 100px;
				text-align: center;
				color: #fff;
				font-size: 18px;
				margin: 0 10px;
				cursor: pointer;
			}
			.raisebutton {
				background: #e77817;
			}
		}
	}
	
	.historyRatio {
		background-color: #70869c;
		color: #fff;
		padding: 50px 0px;
		text-align: center;
	}
	
	.historyRatio>.tip {
		font-size: 30px;
	}
	
	.historyRatio>.num {
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
	/* 模式二 */
	
	.banker {
		border: 1px solid #fff;
		border-radius: 10px;
		color: #fff;
		width: 50%;
		padding: 30px;
		box-sizing: border-box;
		margin: 20px auto;
		font-size: 14px;
		.banker-main {
			margin-right: 120px;
		}
		.banker-main-text {
			display: inline-block;
			width: 100%;
			line-height: 16px;
			margin-bottom: 31px;
		}
		.main {
			margin: auto;
			position: relative;
			.nowBanker {
				margin-top: 10px;
				margin-bottom: 10px;
				display: block;
				width: 45%;
			}
			.nowBankerAmount {
				display: block;
				margin-top: 10px;
				margin-bottom: 10px;
				width: 45%;
			}
			.getBankerFront {
				display: inline-block;
				margin-right: 0px;
				input {
					width: 100%;
					box-sizing: border-box;
				}
				span {
					display: block;
					line-height: 40px;
				}
			}
			.getBankerFrontinput {
				margin-left: 100px;
			}
			.getBankerBack {
				display: inline-block;
				input {
					width: 100%;
					box-sizing: border-box;
				}
				span {
					display: block;
					line-height: 40px;
				}
			}
			.BankerChange {
				display: block;
				width: 100%;
				line-height: 40px;
				background-color: #0093dd;
				color: #fff;
				text-align: center;
				border-radius: 0px;
				margin: 30px 0px;
				cursor: pointer;
			}
			.submit {
				display: block;
				width: 100%;
				text-align: center;
				border-radius: 0px;
				background-color: #dd137b;
				line-height: 40px;
				color: #fff;
				cursor: pointer;
			}
			.bye {
				background-color: #84c225;
				display: block;
				width: 100%;
				text-align: center;
				;
				border-radius: 0px;
				color: #fff;
				line-height: 40px;
				cursor: pointer;
			}
		}
	}
	
	.getBankerFrontinput input {
		width: 100px;
		border-radius: 0;
		-webkit-appearance: none;
	}
	
	.banker .main .getBankerFront {
		margin-right: 0;
		width: 45%;
		display: block;
	}
	
	.banker .main .getBankerBack {
		display: block;
		width: 45%;
	}
	
	.getBankerFrontInpt {
		margin-right: 100px;
	}
	
	.getBankerFrontInpt input {
		width: 100%;
		border-radius: 0;
		background: none;
		border: 1px solid #54692c;
		color: #fff;
		-webkit-appearance: none;
	}
	
	.getBankerAmount span {
		line-height: 40px;
	}
	
	.getBankerAmountButton {
		width: 100px;
		line-height: 40px;
		background: #e77817;
		color: #fff;
		text-align: center;
		cursor: pointer;
	}
	
	.getBankerAmountMain {
		margin-left: 90px;
		margin-right: 120px;
	}
	
	.getBankerAmountMain input {
		width: 100%;
		border-radius: 0;
		-webkit-appearance: none;
	}
	
	.getBankerMain {
		display: inline-block;
		width: 100%;
		margin-bottom: 25px;
	}
	
	.bankerss {
		position: relative;
	}
	
	.main-button {
		position: absolute;
		right: 0;
		top: 0;
	}
	
	@media (min-width:1080px) {
		.modeChange:hover,
		.view>div:hover {
			opacity: 0.8;
		}
		.MYmodeChange:hover {
			opacity: 0.8;
		}
		.submit:hover {
			opacity: 0.8;
		}
		.BankerChange:hover {
			opacity: 0.8;
		}
		.bye:hover,
		.getBankerAmountButton:hover {
			opacity: 0.8;
		}
	}
	
	@media (max-width:1200px) {
		.dispostBig {
			width: 100%;
		}
		.banker {
			width: 90%;
		}
	}
	
	@media (max-width:767px) {
		.dispostBig .dispost {
			width: 100%;
			padding: 0 15px;
		}
		.history {
			width: 95%;
			margin-bottom: 0px;
			margin-top: 20px;
		}
		.MYmodeChange {
			margin: 0 5px;
			min-width: 100px;
			font-size: 14px;
		}
		.el-table {
			font-size: 12px;
		}
		.banker .main .getBankerBack,
		.banker .main .getBankerFront {
			width: 100%;
		}
		.main-button {
			position: static;
			width: 100%;
			text-align: center;
			margin-top: 15px;
		}
		.banker .banker-main {
			margin-right: 0;
		}
		.banker {
			padding: 15px 10px;
			position: relative;
		}
		.banker .main .nowBanker {
			display: block;
			width: 100%;
		}
		.banker .main .nowBankerAmount {
			display: block;
			width: 100%;
		}
		.banker .banker-main-text {
			margin-bottom: 5px;
		}
		.banker .main .getBankerFront {
			margin-bottom: 15px;
		}
		.getBankerAmountButton {
			width: 70px;
		}
		.getBankerAmountMain {
			margin-right: 70px;
			margin-left: 100px;
		}
		.getBankerMain {
			margin-bottom: 10px;
			box-sizing: border-box;
			padding-right: 70px;
		}
		.banker .main .bye,
		.banker .main .BankerChange,
		.banker .main .submit {
			display: inline-block;
			width: 85px;
			vertical-align: top;
			line-height: 35px;
		}
		.banker .main .BankerChange {
			position: absolute;
			right: 0px;
			top: 80px;
			width: 50px;
		}
		.dispostBig .dispost .tip div {
			margin: 0;
			font-size: 12px;
			min-width: 80px;
			vertical-align: top;
		}
		.dispost-position {
			position: relative;
		}
		.goButton {
			display: inline-block;
			position: absolute;
			right: 0;
			top: 10px;
		}
		.dispost-position-input {
			margin-right: 165px!important;
		}
		.processmain-name {
			font-size: 12px!important;
			position: absolute;
			left: 0;
			top: 0;
		}
		.processmain {
			position: relative;
		}
		.processmain-right {
			margin-left: 90px!important;
		}
		.banker .main .submit {
			margin-left: 20px;
		}
		.goButton .submit {
			margin-left: 5px!important;
		}
	}
</style>