# 前端项目NGINX部署

## 安装NGINX
Mac上可以直接用homebrew来安装
```bash
brew install nginx
```
安装完后就是如下图所示：Docroot是NGINX服务器默认指向的资源路径，'/usr/local/etc/nginx/nginx.conf'是nginx的配置文件。
![nginx](../imgs/nginx.png)

## nginx.conf配置
通常现在前端项目build后都会生成类似dist这样的目录，如果要想dist文件夹能被nginx服务器识别，就需要修改nginx.conf这个配置文件。
大致修改如下：
```
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    # root 就是你build后的文件夹路径（下面是我电脑上一个项目的路径，直接pwd就可以查看了）
    location / {
      root   /Users/zyq/Documents/react-cnode/build;
      index  index.html index.htm;
    }
 }
```
然后nginx -s reload，重启nginx就OK了。

