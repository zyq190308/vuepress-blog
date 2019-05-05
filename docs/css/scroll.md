# scroll遇见的问题

## 滚动条问题
最近遇见在iOS上scroll滚动条的一些小技巧，很多网上是例如这种:
```js
#box::-webkit-scrollbar {
  display: none;
}
```
经实验这种并不是所有浏览器都生效,后面通过设置DOM元素的padding或者设置的高度大于scrolbar的高度，来把scrollbar挤到下面，然后父容器overflow:hidden截断。

## 滚动切换位置问题
当你有一个tab选项卡，如果你的tab内容有横向滚动，此时你正在滚动当前tab，然后在没停止时，立刻切换tab，你会发现切换后的tab的位置还是切换前的tab位置(android不会产生这个问题，android手一拿开立刻就停止滚动，iOS有惯性手指离开还会滚动):
```js
// 这个是前提， 不加iOS滚动会很不流畅，加之后就会产生上述问题
-webkit-overflow-scrolling: touch;
```
解决方案，其实就是在切换时把他的滚动惯性去掉，然后再恢复，差不多是下面这个意思。
```js
tab.style['-webkit-overflow-scrolling'] = 'auto'
tab.scrollLeft = 0
tab.style['-webkit-overflow-scrolling'] = 'touch'
```