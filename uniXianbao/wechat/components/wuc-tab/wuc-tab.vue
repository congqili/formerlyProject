<template>
  <scroll-view class="wuc-tab" :class="tabClass" :style="tabStyle" scroll-with-animation scroll-x :scroll-left="scrollLeft">
    <div v-if="!textFlex">
      <div class="wuc-tab-item" :class="[index === tabCur ? selectClass + ' cur':'']" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
        <span>{{item[nameKey]}}</span>
      </div>
    </div>

    <div class="flex text-center" v-if="textFlex">
      <div class="wuc-tab-item flex-sub" :class="index === tabCur ? selectClass + ' cur':''" v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
        <text :class="item.icon"></text>
        <span>{{item[nameKey]}}</span>
      </div>
    </div>
  </scroll-view>
</template>
<script>
export default {
    name: 'wuc-tab',
    data() {
        return {};
    },
    props: {
        tabList: {
            type: Array,
            default() {
                return [];
            }
        },
        tabCur: {
            type: Number,
            default() {
                return 0;
            }
        },
		nameKey: {
			type: String,
			default() {
			    return 'name';
			}
		},
        tabClass: {
            type: String,
            default() {
                return '';
            }
        },
        tabStyle: {
            type: String,
            default() {
                return '';
            }
        },
        textFlex: {
            type: Boolean,
            default() {
                return false;
            }
        },
        selectClass: {
            type: String,
            default() {
                return 'text-active';
            }
        }
    },
    methods: {
        tabSelect(index, e) {
            if (this.currentTab === index) return false;
            this.$emit('update:tabCur', index);
            this.$emit('change', index);
        }
    },
    computed: {
        scrollLeft() {
			let w = 21, c = 0, s = 0
			for (var i = 0; i < this.tabList.length; i++) {
				c += this.tabList[i].title.length
				if(i == this.tabCur-1){
					console.log(c)
					
					if(this.tabCur <= parseInt(this.tabList.length / 2)){
						s = 80
					}
					return c * w - s
				}
			}
            // return (this.tabCur - 1) * 30;
        }
    }
};
</script>
<style lang="scss">
div,
scroll-view,
swiper {
	box-sizing: border-box;
}
.wuc-tab {
	background-color: #fff;
    white-space: nowrap;
	.wuc-tab-item {
		height: 76upx;
		display: inline-block;
		line-height: 76upx;
		margin: 0 28upx;
		&.cur {
			border-bottom: 6upx solid;
		}
	}

	&.fixed {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1024;
		box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
	}
}
.flex {
    display: flex;
}
.text-center {
    text-align: center;
}
.flex-sub {
    flex: 1;
}
.text-active{
  color:$uni-color-primary;
}
.text-white{
  color:#ffffff;
}
.bg-white{
    background-color: #ffffff;
}
.bg-blue{
    background-color: #0081ff;
}
.text-orange{
  color: #f37b1d
}

.text-xl {
	font-size: 28upx;
}
</style>
