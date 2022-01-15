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

```bash
yarn run fix-for-link
```
Команда удаляет react и react-dom которые конфликтуют с локальными зависимостями, если вы линкуете через `npm link` / `yarn link` либу в другой проект.


Публикация
```bash
yarn run pub
yarn run docs
node pub-docs.js
```
