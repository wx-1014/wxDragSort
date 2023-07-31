// subpageA/menu/commonMenu/commonMenu.ts
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    safetHeight: app.globalData.safeHeight,
    ischecked: false,
    arr: [
      { id: 1, src: "/imgs/zzsq.png", name: "打卡1", key: 1 },
      { id: 2, src: "/imgs/zzsq.png", name: "打卡2", key: 2 },
      { id: 3, src: "/imgs/zzsq.png", name: "打卡3", key: 3 },
      { id: 4, src: "/imgs/zzsq.png", name: "打卡4", key: 4 },
      { id: 5, src: "/imgs/zzsq.png", name: "打卡5", key: 5 },
      { id: 6, src: "/imgs/zzsq.png", name: "打卡6", key: 6 },
      { id: 7, src: "/imgs/zzsq.png", name: "打卡7", key: 7 },
    ],
    healthItem: [],
    layerItem: [],
    boxWeight: 750, //容器宽度,100%为750，单位rpx
    boxHeight: 0, //容器高度
    height: 150, //滑块总高度,即滑块本身加上边距的高度
    selectId: 0, //当前选中滑块的id
    col: 5, //滑块列数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },
  onReady() { },
  onShow() {
    let { arr, height, boxWeight, col, boxHeight } = this.data;
    arr.forEach((item, i) => {
      item.x = (i % col) * Math.trunc(boxWeight / col)  //区域左上角横坐标
      item.y = Math.trunc(i / col) * height //区域左上角纵坐标
      item.index = i;
    })
    if (Math.trunc(arr.length % col)) {
      boxHeight = (Math.trunc(arr.length / col) + 1) * height
    } else {
      boxHeight = Math.trunc(arr.length / col) * height
    }
    this.setData({
      healthItem: arr,
      layerItem: arr,
      boxHeight,
    })
  },

  /**
   * 点击到滑块时切换隐藏显示
   */
  unlockItem(e) {
    this.setData({
      selectId: e.currentTarget.dataset.id
    })
    console.log('e.currentTarget.dataset.id', e.currentTarget.dataset.id);
  },

  /**
   * 拖动滑块
   */
  touchMove(e) {
    const s = this;
    let { boxWeight, height, layerItem, col } = s.data
    let weight = Math.trunc(boxWeight / col); //每块区域的宽度
    if (e.detail.source === 'touch') {
      let arr = [...layerItem];
      let id = e.currentTarget.dataset.id;
      let centerX = (e.detail.x * 2) + (weight / 2) //当前选中滑块的中心的x坐标
      let centerY = (e.detail.y * 2) + (height / 2) //当前选中滑块的中心的y坐标
      let key = 0; //滑块滑动时的位置
      let index = 0; //滑块滑动前的位置

      //通过id判断当前滑块的index
      layerItem.forEach(item => {
        if (item.id === id) {
          index = item.index
        }
      })

      //根据当前滑块位置确认当前所处在哪个区域
      for (let i = 0; i < arr.length + 1; i++) {
        let x1 = (i % col) * weight //第n个区域的左上角和左下角x坐标
        let x2 = (i % col + 1) * weight //第n个区域的右上角和右下角x坐标
        let y1 = Math.trunc(i / col) * height //第n个区域的左上角和右上角y坐标
        let y2 = Math.trunc(i / col + 1) * height //第n个区域的左下角和右下角y坐标
        //判断当前滑块所属区域
        if (centerX > x1 && centerX < x2 && centerY > y1 && centerY < y2) {
          key = i
        }
      }
      //当key值大于数组长度时，即数组长度为奇数，滑块位于容器右下方无滑块的位置，滑块实际的key值为数组长度减一
      if (key >= arr.length - 1) {
        key = arr.length - 1
      }

      //滑动时位置与滑动前不同时
      if (index != key) {
        //计算数组中其他数据变化后的index
        arr.forEach((item, i) => {
          if (item.id != id) {
            //index前进到key位置
            if (index > key) {
              if (item.index >= key && item.index < index) {
                item.index = item.index + 1
              }
            }
            //index后退到key位置
            if (index < key) {
              if (item.index > index && item.index <= key) {
                item.index = item.index - 1
              }
            }
          } else {
            item.index = key
          }
        })

        //根据数据变化后的index计算改变顺序后的实际位置
        arr.forEach((item, i) => {
          item.x = (item.index % col) * weight
          item.y = Math.trunc(item.index / col) * height
        })

        s.setData({
          layerItem: arr,
          healthItem: arr,
          key, index,
        })
      }
    }
  },


  /**
   * 停止拖动，两数组同步
   */
  touchend(e) {
    let { layerItem } = this.data;

    this.setData({
      healthItem: layerItem,
    })
  },

  chooseMenu() {
    this.setData({
      ischecked: !this.data.ischecked,
    });
  },
});
