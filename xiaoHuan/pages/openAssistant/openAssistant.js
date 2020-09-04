import Helper from "../../utils/Helper";
import { copyText } from "../../utils/btn.js"
Page({
  data: {
    steps: [
      {
        text: '第一步',
        desc: '修改微信群名称',
      },
      {
        text: '第二步',
        desc: '选择您的群人数',
      },
      {
        text: '第三步',
        desc: '去开通助理',
      }
    ],
    active: 0,
    text: '50<=群人数<=100',
    groupText: '',
    snGroup: ''
  },
  onLoad: function (options) {

  },
  // 点击下一步
  goNextStep() {
    let i = this.data.active + 1
    if (i === 3) {
      i - 1
    } else {
      this.setData({ active: i++ })
      return
    }
  },
  // 复制苏宁群号
  cvSnGroup(e) {
    let { sntext } = e.currentTarget.dataset
    copyText(sntext)
  },
  // 复制群助理微信号
  cvGroup(e) {
    let { group } = e.currentTarget.dataset
    copyText(group)
  },

})