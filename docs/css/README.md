# getBoundingClientRect

Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。

## 基本概念

```js
rectObject = object.getBoundingClientRect();
```
返回值是一个 DOMRect 对象，这个对象是由该元素的 getClientRects() 方法返回的一组矩形的集合, 即：是与该元素相关的CSS 边框集合 。

DOMRect 对象包含了一组用于描述边框的只读属性——left、top、right和bottom，单位为像素。除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。

<img src="https://mdn.mozillademos.org/files/15087/rect.png" width="200" />

空边框盒（译者注：没有内容的边框）会被忽略。如果所有的元素边框都是空边框，那么这个矩形给该元素返回的 width、height 值为0，left、top值为第一个css盒子（按内容顺序）的top-left值。

当计算边界矩形时，会考虑视口区域（或其他可滚动元素）内的滚动操作，也就是说，当滚动位置发生了改变，top和left属性值就会随之立即发生变化（因此，它们的值是相对于视口的，而不是绝对的）。如果你需要获得相对于整个网页左上角定位的属性值，那么只要给top、left属性值加上当前的滚动位置（通过window.scrollX和window.scrollY），这样就可以获取与当前的滚动位置无关的值。

DOMRect包含的参数：
```js
{
  bottom: 388.6875
  height: 66.6875
  left: 212
  right: 312
  top: 322
  width: 100
  x: 212
  y: 322
}
```
##  应用场景
这是常见的对是否出现在可视区域的一个典型例子，图片通过margin隐藏在可视区域外，然后滚动后通过getBoundingClientRect().top和offsetTop来判断出现的条件。
```html
<html>
<head>
	<meta charset="UTF-8">
	<title></title>
	<style>
		* {
			margin: 0;
			padding: 0;
		}
		.box {
			position: relative;
			width: 200px;
			height: 180px;
			background-color: orange;
			overflow: auto;
		}
		.inner {
			width: 100px;
			height: 300px;
			background-color: #eee;
		}
		img {
			margin-top: 200px;
		}

	</style>
</head>
<body>
	<div class="box">
		<div class="inner">
			<img src="1" alt="image" width="100">
		</div>		
	</div>

	<input type="button" value="click" onclick="addLeft()" />
	<script>
		const box = document.querySelector('.box')
		const inner = document.querySelector('.inner')
		const img = document.querySelector('img')
		
		box.addEventListener('scroll', () => {
			const rect = img.getBoundingClientRect()
			if (rect.top < img.offsetTop) {
        if (!img.loaded) {
          setTimeout(() => {
            img.loaded = true
            img.src = img.getAttributes('data-src')
          }, 4000)
        }
				console.log('来到可视区了')
			}
		})
		
	</script>
</body>
</html>
```