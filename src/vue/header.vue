<template>
  <header>
    <a href=/Home>
      <img width=200 height=58 class=vm :src="'../../contents/image/logo.png'">
    </a>
    <nav class=tc>
      <a href=/Home class=vm :class='{sel:sel == "file"}'>文件</a>
      <a href=javascript:; class=vm :class='{sel:sel == "share"}'>分享</a>
    </nav>
  </header>
</template>

<script>
  export default {
    props: ['sel']
  }
</script>

<style scoped>
  header{width:100%;min-width:1004px;height:58px;background:#0078D7;line-height:58px;}
  img,nav a{font-size:20px;color:#FFF;}
  nav a{display:inline-block;width:156px;}
  nav a:hover,.sel{background:#006ECD;}
</style>