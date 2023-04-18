- websocket server.
- random updating task in background.
- long list render.
- table, menu, total component.
- cache and keep async

## requirement key points

- unit tests and integration tests
- table should run smoothly with 10000+ records

## Tech stack

- react
- styled-components
- react-table
- react-window
- rxjs
- websocket
- servicework + data cache with indexDB

## mechanism

- long list render
- right click to open menu

## reference

[交易系统需求](https://houbb.github.io/2020/06/19/system-design-how-to-design-trade-system-01-first-sight#%E4%BA%A4%E6%98%93%E7%B3%BB%E7%BB%9F%E9%9C%80%E6%B1%82)

- high availability
- high performance
- high security

[cache summaries](https://juejin.cn/post/6844904106499260430#heading-19)
[service worker](https://pwa.alienzhou.com/3-rang-ni-de-webapp-li-xian-ke-yong#3.-ru-he-shi-yong-service-worker-shi-xian-li-xian-ke-yong-de-miao-kai-ying-yong)
[websocket authentication authorization](http://www.moye.me/2017/02/10/websocket-authentication-and-authorization/)
