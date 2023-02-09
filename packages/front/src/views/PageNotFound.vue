<template>

<div class="page-not-found">
    <div class="wrapper">
    <div class="content">
        <span>Страница не найдена</span>
        <span>Перейти на <a href="/">главную</a></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-not-found .wrapper {
    width: 75vw;
    margin-left: auto;
    margin-right: auto;
}
  .page-not-found div.content {
  /* display:table-cell; */
  vertical-align:middle;
  text-align:center;
  position: absolute;
  top: 32%;
  left: 40%;
  text-align: start;
}
.page-not-found div.content span:first-child {
  font-size: 1.8rem;
  display: block;
  margin-bottom: .4rem;
}
.page-not-found div.content span:not(:first-child) {
  font-size: 1.3rem;
}

.page-not-found div.content span:not(:first-child) a{
  color: #000;
}
</style>
