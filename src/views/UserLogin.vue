<template>
  <div class="login-container">
    <el-row
      ><el-col> <el-divider content-position="center">欢迎使用燃烧英语</el-divider></el-col></el-row
    >
    <el-form label-width="100px">
      <el-form-item label="用户名">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button>取消</el-button>
        <el-button type="primary">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less" scoped>
.login-container {
  width: 500px;
  margin: 200px auto;
}
</style>
