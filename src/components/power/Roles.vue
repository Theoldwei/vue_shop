<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table row-key="id" :data="roleList" border stripe>
        <!-- 添加展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 利用栅格系统 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二，三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限  -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形组件
    show-checkbox:显示复选框
    node-key:设置选中节点对应的值
    default-expand-all:是否默认展开所有节点
    :default-checked-keys 设置默认选中项的数组
    ref:设置引用 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        //通过label设置树形节点文本展示authName
        label: 'authName',
        //设置通过children属性展示子节点信息
        children: 'children',
      },
      //设置树形控件中默认选中的内容
      defKeys: [],
      //保存正在操作的角色id
      roleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      //如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败')
      // //如果返回状态正常，将请求的数据保存在data中
      this.roleList = res.data
    },
    async removeRightById(role, rightId) {
      //弹窗提示用户是否要删除
      const confirmResult = await this.$confirm(
        '请问是否要删除该权限',
        '删除提示',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      //如果用户点击确认，则confirmResult 为'confirm'
      //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult != 'confirm') {
        return this.$message.info('已经取消删除')
      }

      //用户点击了确定表示真的要删除
      //当发送delete请求之后，返回的数据就是最新的角色权限信息
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200)
        return this.$message.error('删除角色权限失败')

      //无需再重新加载所有权限
      //只需要对现有的角色权限进行更新即可
      role.children = res.data
      // this.getRoleList();
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      //如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) return this.$message.error('获取权限树失败')
      //如果返回状态正常，将请求的数据保存在data中
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      //该函数会获取到当前角色的所有三级权限id并添加到defKeys中
      //如果当前节点不包含children属性，则表示node为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      //递归调用
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    setRightDialogClose() {
      //当用户关闭树形权限对话框的时候，清除掉所有选中状态
      this.defKeys = []
    },
    async allotRights() {
      //当用户在树形权限对话框中点击确定，将用户选择的
      //权限发送请求进行更新

      //获取所有选中及半选的内容
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      //将数组转换为 , 拼接的字符串
      const idStr = keys.join(',')

      //发送请求完成更新
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')

      this.$message.success('分配权限成功')
      this.getRoleList()
      //关闭对话框
      this.setRightDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>