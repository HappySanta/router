# @happysanta/router

Роутер для приложений на VKUI

причины создания этой поделки описаный в статье
https://vk.com/@-197036977-navigaciya-mini-apps-vkui

пример приложения с роутером
https://github.com/HappySanta/router-example/tree/master/src

## Как использовать

### Определить роуты 

```ts
import {Page, Router} from "@happysanta/router"

const PAGE_MAIN = '/'
const PAGE_PRODUCT = '/product/:id([0-9]+)'

const PANEL_MAIN = "panel_main"
const PANEL_PRODUCT = "panel_product"

const VIEW_MAIN = "view_main"

const routes: { [key: string]: Page } = {
  [PAGE_MAIN]: new Page(PANEL_MAIN,VIEW_MAIN),
  [PAGE_PRODUCT]: new Page(PANEL_PRODUCT,VIEW_MAIN),
}

const router = new Router(routes)
setGlobalRouter(router)
```

### HOC withSantaRouter

В компоненте App использовать withSantaRouter чтобы получить текущий роут
```withSantaRouter``` передаст в пропсы объекты ```route:Route``` и ```routeState:State```

```route.getViewId()``` id View передается в VKUI как есть ```<Root activeView={route.getViewId()}>```

```getPanelIdInView(route, viewId),``` передается в ```activePanel``` у ```<View>```

```route.hasOverlay() ? [] : getViewHistory(route, viewId)``` передается в ```history``` у ```<View>```

```route.getModalId()``` ```pushModal/replaceModal```

```route.getPopupId()``` ```pushPopup/replacePopup```

### Методы для перехода между экраноами

```pushPage(PAGE, params = {})```
```pushModal(MODAL, params = {})```
```pushPopup(POPOUT, params = {})```

```replacePage(PAGE, params = {})```
```replaceModal(MODAL, params = {})```
```replacePopup(POPOUT, params = {})```

```popPage()```
```popPageIfModalOrPopup()``` -- перейдет назад по истории только если сейчас показана маодалка или попап


```pushPageAfterPreviews(OLD_PAGE, PAGE, params = {})``` -- откатиться по истории до OLD_PAGE и запушить после нее PAGE

### Получить текущую страницу

```getCurrentRoute():Route```

```useRoute()```

Обратите внимание что данные меняются не синхронно со сменой панелей в VKUI, поэтому эти данные надо сохранять в компоненте


### Подписаться на изменения роута

```ts
getGlobalRouter().on("update", (next:Route, old:Route|undefined, isNewRoute:boolean) => {
    if (isNewRoute) {
	  // Переход на новый экран после методов pushPage replacePage  
    } else {
	  // Переход назад popPage или бразурные кнопки
    }
    console.log("new route id", next)
    if (old) {
        console.log("old route was", old)
    }
})
``` 

или можно сделать это там где определяем роуты

```
export const routes: { [key: string]: Page } = {
   	[PAGE_MAIN]: new Page().onEnter((r:Route) => console.log('enter on main page', r) ),  
};
```

У Page есть колбеки ```onEnter``` ```onLeave``` 
 
## Фичи

```withThrottlingRouter``` позвонят обходить проблему со слишком частой сменой панелей из-за которой VKUI может зависнуть
передает то же самое что и ```withSantaRouter``` + колбек onTransitionEnd который надо вызывать на событиях onTransition у <View> и <Panel>


```useHomePageCheck``` -- вернет true если мы находимся на первой странице


#### Бесконечные панели

1) Пометить роут как ```makeInfinity```
2) использовать ````getViewHistoryWithLastPanel```` для получения списков панелей которые надо отрендерить
3) ```isInfinityPanel(panelId)``` и ```getInfinityPanelId(panelId)``` чтобы понять какой компонент рендерить


## Ограничения

Нельзя вызвать синхронно методы роутера одни за другим
```js
pushPage("/")
pushPage("/user")
popPage()
replacePage("/info")
```    

Сейчас такой код не будет работать корректно (планируем исправить в будущем), если очень надо вызвать методы подряд то надо сделать это с небольшой задержкой. 

Например так:
```js
pushPage("/")
await delay(10)
pushPage("/user")
await delay(10)
popPage()
await delay(10)
replacePage("/info")
 ```


## Changelog

**0.1.0**

Добавлены методы 

```ts
router.onEnterPage('/', () => { console.log('enter on main page') })
router.onLeavePage('/', () => { console.log('leave from main page') })
```

Удалены `rootId` из `Page`

Оставлены хуки и hoc: `withRouter` `withThrottlingRouter` `useRouter` `useFirstPageCheck` `useParams`

**0.0.7**

Добавлено новое поле в событие ```update``` ```isNewRoute:boolean```.

`true` - когда событие вызвано после методов `push*` `replace*`

`false`- когда событие вызвано переходом по истории назад или вперед

Это поле нужно использовать когда в событии `update` находится логика загрузки данных для предотвращения повторной загрузки когда осуществляется переход назад.

```ts
getGlobalRouter().on("update", (next:Route, old:Route|undefined, isNewRoute:boolean) => {
    if (isNewRoute) {
	  // Переход на новый экран после методов pushPage replacePage  
    } else {
	  // Переход назад popPage или бразурные кнопки
    }
    console.log("new route id", next)
    if (old) {
        console.log("old route was", old)
    }
})
``` 