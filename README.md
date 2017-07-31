### 幸运大转盘
这是一个基于zepto的幸运大转盘demo，根据网上的例子修改后的效果。  
主要功能是点击抽奖按钮后，

扫描下方二维码即可浏览demo效果  
![lottery-draw](http://o8l2fza1x.bkt.clouddn.com/lottery-draw.png)  

水平垂直居中是依靠position+transform来实现的
```css
.box .outer {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(0deg);
}
```
活动状态的改变是通过css sprite来实现的，
```css
.box .inner.start {
    background-position: 0 0;
}
.box .inner.no-start {
    background-position: -5rem 0;
}
.box .inner.completed {
    background-position: -10rem 0;
}
```
这里主要的抽奖功能是通过kinerLottery.js插件来实现的
