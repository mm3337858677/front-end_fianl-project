<template>
	<view class="index-content">

		<!-- 搜索板块 -->
		<view class="index-header">
			<view class="icon_header">
				<view class="index-search" @tap="toSearchIndex">
					<view class="icon_search">
						<text class="iconfont icon-search"></text>
						<text>请输入您需要搜索的商品名称</text>
					</view>
				</view>
				<view class="icon_suji" @tap="toZujiIndex">
					<text class="iconfont icon-zuji"></text>
				</view>
			</view>
		</view>
		<!-- 搜索板块 -->

		<!-- banner板块 -->
		<view class="index-banner">
			<view class="swiper" v-if="banner.length > 0">
				<swiper class="swiper-container" :autoplay="true" :interval="4000" :circular="true" :indicator-dots="true"
				 indicator-active-color="#FC3F78" indicator-color="#cccccc">
					<block v-for="(item,index) in banner" :key="index">
						<swiper-item class="swiper-wrapper">
							<image :src="item.image" mode="widthFix"></image>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</view>
		<!-- banner -->

		<!-- 导航栏板块 -->
		<view class="index-navlist s-grids has-bg-white has-pdtb-10" v-if="navlist.length > 0">
			<view class="is-col-1-5 is-center" v-for="(nav,index) in navlist" :key="index" @tap="toNavList(nav.url,nav.title)">
				<view class="has-pdtb-5">
					<image :src="nav.image" mode="widthFix"></image>
					<view class="is-size-14">{{nav['title']}}</view>
				</view>
			</view>
		</view>
		<!-- 导航栏板块 -->

		<!-- 聚拼团板块 -->
		<view class="home_ant_juhuasuan has-bg-white" v-if="juhuasuanlist.length > 0">
			<view class="juhuasuan-tab s-row">
				<text class="fl-jutext">聚拼团</text>
				<text class="fr-jutext">查看更多拼团</text>
			</view>
			<view class="s-row juhuasuan-list">
				<view class="juhuasuan-list-goods" v-for="(item,index) in juhuasuanlist" :key="index" @tap="toGoodsInfo(item.itemid)">
					<view class="image">
						<image :src="item.picture" mode="widthFix"></image>
						<view class="name">
							<text class="pinname">￥{{item.price}}</text>
							<text class="price"></text>
						</view>
					</view>

				</view>
			</view>
		</view>
		<!-- 聚拼团板块 -->

		<!-- 领券直播 -->
		<view class="index-coupon has-bg-white has-pd-10">
			<view class="coupon-tab s-row">
				<text class="fl-jutext">领券直播</text>
				<text class="fr-jutext">专享超值优惠券</text>
			</view>
			<view class="goods-list" v-if="couponlist.length > 0">
				<view class="coupon-page s-row" v-for="(item,index) in couponlist" :key="index" @tap="toGoodsInfo(item.itemid)">
					<view class="image">
						<image :src="item.picture"></image>
					</view>
					<view class="content">
						<view class="title">{{item.title}}</view>
						<view class="num s-row">
							<text class="tmprice"> 天猫价 ¥{{item.price}}</text>
							<text class="volume">已售{{item.volume}}件</text>
						</view>
						<view class="money s-row">
							<text class="coupon-price">券后价<text>¥{{item.yprice}}</text></text>
							<text class="quan">
								<i></i>{{item.coupon}}元券<i></i>
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 领券直播 -->
		
		<!-- 加载更多提示 -->
		<view class="s-col is-col-24" v-if="couponlist.length > 0">
			<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
		</view>
		<!-- 加载更多提示 -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banner: [],
				navlist: [],
				juhuasuanlist: [],
				couponlist: [],
				page: 1,
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				}
			}
		},
		methods: {
			loadBanner: function(Refresh) {
				var indexBanner = this.$SysCache.get("app_index_banner");
				if(indexBanner && Refresh == undefined ){
					this.banner  = indexBanner;
				}else{
					this.$Request.post(this.$api.home.banner).then(res => {
						if (res.code == 200) {
							this.banner = res.data;
							this.$SysCache.put("app_index_banner",res.data,43200);
						}
					})
				}
			},
			loadNavList: function() {
				var indexNav = this.$SysCache.get("app_index_navlist");
				if(indexNav){
					this.navlist = indexNav;
				}else{
					this.$Request.post(this.$api.home.navlist).then(res => {
						if (res.code == 200) {
							this.navlist = res.data;
							this.$SysCache.put("app_index_navlist",res.data,86400);
						}
					})	
				}
			},
			loadJuhuasuanlist: function() {
				this.$Request.post(this.$api.home.juhusuan).then(res => {
					if (res.code == 200) {
						this.juhuasuanlist = res.data;
					}
				})
			},
			loadCouponList: function(type) {
				this.loadingType = 1; 
				this.$Request.post(this.$api.common.couponlist, {
					page: this.page
				}).then(res => {
					this.loadingType = 0; 
					if (res.code == 200) {
						if (this.page == 1) {
							this.couponlist = [];
						}
						res.data.forEach(d => {
							this.couponlist.push(d);
						})
					}else{
						this.loadingType = 2; 
					}
					if (type == "Refresh") {
						uni.stopPullDownRefresh(); // 停止刷新
					}
					setTimeout(t=>{
						this.loadBanner("Refresh"); // 当首页数据加载完毕后 刷新banner
					},1000); 
				}).catch(err=>{
// 					this.loadingType = 2; 
// 					this.contentText.contentnomore = "网络繁忙，请稍后再试"
				})
			},
			toNavList: function(url, title) {
				uni.showToast({
					title: title,
					mask: false,
					duration: 1500,
					icon: "none"
				});
			},
			toGoodsInfo: function(itemid) {
				uni.navigateTo({
					url:"/pages/detail/goodsinfo?itemid="+itemid,
				})
			},
			toSearchIndex:function(){
				uni.navigateTo({
					url:"/pages/search/index"
				})
			},
			toZujiIndex:function(){
				uni.showToast({
					title: "去足迹页面",
					mask: false,
					duration: 1500,
					icon: "none"
				});
			}
		},
		onReady:function(){
			this.loadCouponList();
		},
		onLoad: function() {
			this.loadBanner();
			this.loadNavList();
			this.loadJuhuasuanlist();
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.loadCouponList();
		},
		onPullDownRefresh: function() {
			this.page = 1;
			this.loadJuhuasuanlist();
			this.loadCouponList("Refresh");
		}
	}
</script>

<style>
	@import "../../static/css/index.css";
</style>
