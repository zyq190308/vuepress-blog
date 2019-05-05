# scroll遇见的问题

最近遇见在iOS上scroll滚动条的一些小技巧，很多网上是例如这种:
```js
#box::-webkit-scrollbar {
  display: none;
}
```
经实验这种并不是所有浏览器都生效,后面通过设置DOM元素的padding或者设置的高度大于scrolbar的高度，来把scrollbar挤到下面，然后父容器overflow:hidden截断。