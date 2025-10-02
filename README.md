# Procheson PLC ST测试报告

Procheson PLC结构化文本指令测试报告平台

## 项目简介

本项目是一套完整的PLC指令测试套件，基于IEC 61131-3标准，全面覆盖各类PLC指令，为工业自动化工程师、系统集成商和教育机构提供高质量的测试工具和参考文档。

## 项目特点

- **全面覆盖**：实现对200+个PLC指令的完整测试覆盖
- **标准化**：遵循IEC 61131-3国际标准
- **兼容性**：确保在Beremiz等开源PLC环境中的良好运行
- **易用性**：提供完整的测试程序和详细文档
- **可扩展性**：建立模块化测试框架，便于后续扩展

## 技术栈

- [VitePress](https://vitepress.dev/) - 现代静态站点生成器
- Markdown - 文档编写
- PLC ST (结构化文本) - 测试程序开发

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/wuhanheibao01/procheson-doc.git

# 进入项目目录
cd procheson-doc

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run docs:dev
```

### 构建部署

```bash
# 构建静态站点
pnpm run docs:build

# 预览构建结果
pnpm run docs:preview
```

## 项目结构

```
├── docs/                  # 文档源文件
│   ├── .vitepress/        # VitePress配置
│   ├── LubanTest/         # 测试文档
│   └── index.md           # 首页
├── .github/workflows/     # GitHub Actions工作流
└── package.json           # 项目配置
```

## 部署

项目通过GitHub Actions自动部署到GitHub Pages。每次推送到`main`分支都会触发自动构建和部署。

## 联系方式

- **项目负责人**：汪勇强
- **联系电话**：13971612060
- **QQ**：94114148

---
*本项目将持续维护和更新，欢迎提出宝贵意见和建议。*