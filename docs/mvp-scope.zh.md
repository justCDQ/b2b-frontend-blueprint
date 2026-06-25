# MVP 边界

B2B Frontend Blueprint 有两个目标：

1. 提供 AI 可用的 2B 控制台交互规则。
2. 提供一个可 scaffold、可阅读、可接真实后端接口的控制台 starter。

MVP 的定位是蓝图和起点，不是完整后台框架。

## MVP 包含什么

当前 MVP 包含：

- 人类可读的组件规则。
- AI 可执行的精简规则。
- 中英文规则文件。
- 按场景组织的 AI rules bundle。
- 框架无关的 vanilla demo。
- 本地 scaffold 脚本。
- `blueprint.config.js` 运行时配置。
- light/dark 主题控制器和 density 模式。
- 最小 i18n runtime 和字典。
- request adapter 和后端错误协议。
- auth / permission 骨架。
- form schema 和校验工具。
- import workflow 契约。
- resource module pattern、module registry 和 CRUD controller。
- 一个可运行的通用资源页示例。

## MVP 不包含什么

当前 MVP 不做：

- 生产级 React/Vue 组件库。
- 完整 RBAC 平台。
- 完整登录、注册、用户账号体系。
- 低代码页面设计器。
- 复杂工作流引擎。
- 完整 E2E 测试工程。
- 浏览器兼容和 polyfill 包。
- 已发布的 npm CLI 包。

这些能力以后可以继续扩展，但不应该影响 MVP 主线。

## 产品边界

这个项目应该保持足够小，让用户能读懂生成出来的代码。

应该优先：

- 明确的契约。
- 可替换的模块。
- 简单示例。
- AI 友好的规则和文件结构。

应该避免：

- 隐藏魔法。
- 绑定特定业务。
- 过早绑定框架。
- 把项目做成一个私有后台大框架。

## MVP 成功标准

当用户可以完成以下事情时，MVP 就是有价值的：

1. 阅读 rules 并理解 2B 交互边界。
2. 通过 scaffold 生成 starter 项目。
3. 在本地运行生成项目。
4. 修改 app name、locale、theme、density、modules、API base URL。
5. 按文档新增一个资源模块。
6. 将 mock API 替换成真实后端 API。
7. 让 AI 编程工具基于 rules 生成或审查页面。
