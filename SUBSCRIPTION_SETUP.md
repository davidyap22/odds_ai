# 订阅系统设置指南

## 📋 概述

订阅系统包含3个订阅层级：
- **基础版 (Basic)** - RM 29.90/月 或 RM 299/年
- **专业版 (Pro)** - RM 79.90/月 或 RM 799/年 - ⭐ 最受欢迎
- **尊享版 (Premium)** - RM 199.90/月 或 RM 1999/年

## 🚀 快速设置

### 第1步：在Supabase中创建数据库表

1. 登录你的 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query**
5. 复制 `supabase/migrations/create_subscriptions.sql` 文件的全部内容
6. 粘贴到SQL编辑器中
7. 点击 **Run** 执行SQL

这将创建以下表：
- `subscription_plans` - 订阅计划表（已包含3个默认计划）
- `user_subscriptions` - 用户订阅表
- `payment_history` - 支付历史表

### 第2步：验证表已创建

在Supabase Dashboard中：
1. 点击左侧 **Table Editor**
2. 应该能看到3个新表：`subscription_plans`, `user_subscriptions`, `payment_history`
3. 点击 `subscription_plans` 表，应该能看到3条预设的订阅计划

### 第3步：访问订阅页面

本地开发：
```bash
npm run dev
```

访问: `http://localhost:3000/pricing`

## 📊 数据库结构

### subscription_plans 表
- 存储所有订阅计划
- 已预设3个计划（Basic, Pro, Premium）
- 包含价格、功能、权限等信息

### user_subscriptions 表
- 存储用户的订阅信息
- 每个用户只能有一个活跃订阅
- 包含订阅状态、周期、过期时间等

### payment_history 表
- 存储所有支付记录
- 用于跟踪交易历史

## 🎨 订阅功能

### 前端页面
- `/pricing` - 订阅计划展示页面
- 3个精美设计的订阅卡片
- 月付/年付切换
- 常见问题FAQ

### 订阅层级对比

| 功能 | 基础版 | 专业版 | 尊享版 |
|------|--------|--------|--------|
| AI预测数量 | 10/天 | 50/天 | 无限 |
| 实时赔率 | ❌ | ✅ | ✅ |
| 高级分析 | ❌ | ✅ | ✅ |
| 优先支持 | ❌ | ❌ | ✅ |
| API访问 | ❌ | ❌ | ✅ |

## 🔐 权限控制 (RLS)

已设置Row Level Security (RLS)：
- 任何人都可以查看活跃的订阅计划
- 用户只能查看和管理自己的订阅
- 用户只能查看自己的支付历史

## 💳 下一步 - 集成支付网关

目前订阅按钮会显示提醒。要实现真实支付，需要集成支付网关：

### 推荐的支付网关（马来西亚）:
1. **Stripe** - 国际支付，支持信用卡
2. **iPay88** - 马来西亚本地支付
3. **Billplz** - 马来西亚在线银行转账
4. **Revenue Monster** - 马来西亚多种支付方式

### 集成步骤（以Stripe为例）:

1. 安装Stripe:
```bash
npm install stripe @stripe/stripe-js
```

2. 在 `.env.local` 添加Stripe密钥:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

3. 创建支付API路由
4. 更新 `PricingCard.tsx` 中的 `handleSubscribe` 函数

## 📱 用户体验

- 未登录用户点击订阅 → 跳转到登录页面
- 已登录用户点击订阅 → 进入支付流程（待实现）
- 成功订阅后 → 在dashboard显示订阅状态

## 🛠️ 管理订阅

用户可以：
- 查看当前订阅计划
- 升级/降级计划
- 取消订阅（在当前周期结束后生效）
- 查看支付历史

## 📝 注意事项

1. **测试模式**: 当前所有价格仅供展示，未连接真实支付
2. **货币**: 使用马来西亚林吉特 (MYR)
3. **税费**: 价格未包含可能的税费
4. **退款**: 根据业务需求在支付网关中配置

## 🚀 部署到Vercel

1. 确保在Vercel环境变量中设置了Supabase凭据
2. 推送代码到GitHub
3. Vercel会自动部署

## ❓ 常见问题

**Q: 如何修改订阅价格？**
A: 在Supabase的 `subscription_plans` 表中直接修改

**Q: 如何添加新的订阅层级？**
A: 在 `subscription_plans` 表中插入新行，并更新前端代码

**Q: 如何测试订阅功能？**
A: 目前可以手动在 `user_subscriptions` 表中插入测试数据

## 📞 需要帮助？

如有问题，请查看：
- Supabase文档: https://supabase.com/docs
- Stripe文档: https://stripe.com/docs
