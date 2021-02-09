<template>
  <el-container class="home-container">
    <!-- 头部模块 -->
    <el-header>
      <div>
        <img src="../assets/头像.jpg" alt="" />
        <span>共享租赁平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <el-container>
      <!-- 侧边栏模块 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏折叠模块 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体模块 -->
      <el-main>
        <!-- 子路由的占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的动态地址，以实现菜单高亮显示
      activePath: '',
    }
  },
  //生命周期，页面一加载就调用函数
  created() {
    // 在created阶段请求左侧菜单数据
    this.getMenuList(),
      (this.activePath = window.sessionStorage.getItem('activePath'))
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      // 发送请求获取左侧菜单数据
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(path) {
      //点击二级菜单的时候保存被点击的二级菜单信息
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 45px;
      border-radius: 50%;
    }
    span {
      color: #eaedf1;
      font-size: 20px;
      margin: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 8px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
