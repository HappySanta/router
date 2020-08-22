# Роутер для приложений на VKUI

Гайд
https://vk.com/@-197036977-slozhnaya-navigaciya-na-vkui

пример приложения с роутером
https://github.com/HappySanta/router-example

Описание методов
https://happysanta.github.io/router/


### Install

```bash
npm i @happysanta/router
```

```bash
yarn add @happysanta/router
```

# Локальная разработка

удаляет react react-dom который конфилкнуют если вы линкуете через `npm link` `yarn link` либу в другой проект
```
yarn run fix-for-link
```


Публикация
```bash
yarn run pub
yarn run docs
node pub-docs.js
```