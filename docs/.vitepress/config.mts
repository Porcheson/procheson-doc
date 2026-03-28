import { defineConfig } from 'vitepress'

import { devDependencies } from '../../package.json'
import markdownItTaskCheckbox from 'markdown-it-task-checkbox'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';

import { usePosts } from './theme/untils/permalink';
const { rewrites } = await usePosts();

// 添加ST语言别名为txt以解决语法高亮问题

export default defineConfig({
  lang: 'zh-CN',
  title: "Procheson PLC测试报告",
  description: "Procheson PLC指令测试报告",
  rewrites,

  // #region fav
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  // #endregion fav

  base: '/', //网站部署到根路径（Netlify）

  // cleanUrls:true, //开启纯净链接无html

  //启用深色模式
  appearance: 'dark',

  //多语言
  locales: {
    root: {
      label: '简体中文',
      lang: 'Zh_CN',
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
    },
    fr: {
      label: 'French',
      lang: 'fr',
      link: '/fr/',
    }
  },

  //markdown配置
  markdown: {
    //行号显示
    lineNumbers: true,

    // toc显示一级标题
    toc: {level: [1,2,3]},

    // 使用 `!!code` 防止转换
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ],

    // 开启图片懒加载
    image: {
      lazyLoading: true
    },

    config: (md) => {
      // 组件插入h1标题下
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`
        return htmlResult
      },

      // 代码组中添加图片
      md.use((md) => {
        const defaultRender = md.render
        md.render = (...args) => {
          const [content, env] = args
          const currentLang = env?.localeIndex || 'root'
          const isHomePage = env?.path === '/' || env?.relativePath === 'index.md'  // 判断是否是首页

          if (isHomePage) {
            return defaultRender.apply(md, args) // 如果是首页，直接渲染内容
          }
          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args)
          // 替换内容
          if (currentLang === 'root') {
            defaultContent = defaultContent.replace(/NOTE/g, '提醒')
              .replace(/TIP/g, '建议')
              .replace(/IMPORTANT/g, '重要')
              .replace(/WARNING/g, '警告')
              .replace(/CAUTION/g, '注意')
          } else if (currentLang === 'ko') {
            // 韩文替换
            defaultContent = defaultContent.replace(/NOTE/g, '알림')
              .replace(/TIP/g, '팁')
              .replace(/IMPORTANT/g, '중요')
              .replace(/WARNING/g, '경고')
              .replace(/CAUTION/g, '주의')
          }
          // 返回渲染的内容
          return defaultContent
        }

        // 获取原始的 fence 渲染规则
        const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) ?? ((...args) => args[0][args[1]].content);

        // 重写 fence 渲染规则
        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          const token = tokens[idx];
          const info = token.info.trim();

          // 将st语言别名为txt以获得基本语法高亮
          if (info === 'st') {
            token.info = 'txt';
          }

          // 判断是否为 md:img 类型的代码块
          if (info.includes('md:img')) {
            // 只渲染图片，不再渲染为代码块
            return `<div class="rendered-md">${md.render(token.content)}</div>`;
          }

          // 其他代码块按默认规则渲染（如 java, js 等）
          return defaultFence(tokens, idx, options, env, self);
        };
      })
      
      md.use(groupIconMdPlugin) //代码组图标
      md.use(markdownItTaskCheckbox) //todo
      md.use(MermaidMarkdown); 

    }

  },

  vite: {
    plugins: [
      [MermaidPlugin()]
    ]as any,
    optimizeDeps: {
      include: ['mermaid'],
    },
    ssr: {
      noExternal: ['mermaid'],
    },
  },

  lastUpdated: true, //此配置不会立即生效，需git提交后爬取时间戳，没有安装git本地报错可以先注释

  ignoreDeadLinks: true, //忽略死链接检查

  //主题配置
  themeConfig: {
    //左上角logo
    logo: '/logo.png',
    //logo: 'https://vitejs.cn/vite3-cn/logo-with-shadow.png', //远程引用
    //siteTitle: false, //标题隐藏

    //设置站点标题 会覆盖title
    //siteTitle: 'Hello World',

    // //编辑本页
    // editLink: {
    //   pattern: 'https://github.com/Yiov/vitepress-doc/edit/main/docs/:path', // 改成自己的仓库
    //   text: '在GitHub编辑本页'
    // },

    //上次更新时间
    lastUpdated: {
      text: '上次更新时间',
      formatOptions: {
        dateStyle: 'short', // 可选값full、long、medium、short
        timeStyle: 'medium' // 可选값full、long、medium、short
      },
    },

    //导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '🧪 测试报告',
        items: [
          {
            // 分组标题1
            text: '基础指令测试',
            items: [
              { text: '位操作指令', link: '/LubanTest/2.1 位操作指令测试说明' },
              { text: '比较指令', link: '/LubanTest/2.2 比较指令测试说明' },
              { text: '算术指令', link: '/LubanTest/2.3 算术指令测试说明' },
              { text: '类型转换指令', link: '/LubanTest/2.4 类型转换指令测试说明' },
            ],
          },
          {
            // 分组标题2
            text: '高级指令测试',
            items: [
              { text: '计数器指令', link: '/LubanTest/3.1 计数器指令测试说明' },
              { text: '定时器指令', link: '/LubanTest/3.2 定时器指令测试说明' },
              { text: '移位寄存器', link: '/LubanTest/3.3 移位寄存器指令测试说明' },
              { text: '字符串操作', link: '/LubanTest/3.5 字符串操作指令测试说明' },
            ],
          },
          {
            // 分组标题3
            text: '扩展指令测试',
            items: [
              { text: '扩展计数器', link: '/LubanTest/4.1 扩展计数器指令测试说明' },
              { text: '扩展类型转换', link: '/LubanTest/4.2 扩展数据类型转换指令测试说明' },
              { text: '数学函数', link: '/LubanTest/4.3 数学函数指令测试说明' },
              { text: '时间算术', link: '/LubanTest/4.4 时间算术指令测试说明' },
            ],
          },
        ],
      },
      {
        text: '📊 统计报告',
        items: [
          { text: 'PLC指令测试统计报告', link: '/LubanTest/5.1 PLC指令测试统计报告' },
          { text: '类型转换指令详细统计表', link: '/LubanTest/5.3 类型转换指令详细统计表' },
          { text: '项目成果汇报总结', link: '/LubanTest/5.4 项目成果汇报总结' },
        ],
      },
      // { text: `VitePress ${devDependencies.vitepress.replace('^', '')}`, link: 'https://vitepress.dev/zh/', noIcon: true },
    ],


    //侧边栏
sidebar: [
  {
    //分组标题1
    text: '介绍',
    collapsed: false,
    items: [
      { text: '📖 前言', link: '/1.1 前言' },
    ],
  },
  {
    text: '🧪 基础指令测试',
    collapsed: false,
    items: [
      { text: '⚙️ 位操作指令', link: '/LubanTest/2.1 位操作指令测试说明' },
      { text: '⚖️ 比较指令', link: '/LubanTest/2.2 比较指令测试说明' },
      { text: '➕ 算术指令', link: '/LubanTest/2.3 算术指令测试说明' },
      { text: '🔄 类型转换指令', link: '/LubanTest/2.4 类型转换指令测试说明' },
      { text: '🔘 选择指令', link: '/LubanTest/2.5 选择指令测试说明' },
    ],
  },
  {
    text: '⚙️ 高级指令测试',
    collapsed: false,
    items: [
      { text: '🔢 计数器指令', link: '/LubanTest/3.1 计数器指令测试说明' },
      { text: '⏱️ 定时器指令', link: '/LubanTest/3.2 定时器指令测试说明' },
      { text: '📦 移位寄存器', link: '/LubanTest/3.3 移位寄存器指令测试说明' },
      { text: '➡️ 移位指令', link: '/LubanTest/3.4 位移指令测试说明' },
      { text: '🔤 字符串操作', link: '/LubanTest/3.5 字符串操作指令测试说明' },
      { text: '🌀 触发器指令', link: '/LubanTest/3.6 触发器指令测试说明' },
    ],
  },
  {
    text: '🔧 扩展指令测试',
    collapsed: false,
    items: [
      { text: '📈 扩展计数器', link: '/LubanTest/4.1 扩展计数器指令测试说明' },
      { text: '🔄 扩展类型转换', link: '/LubanTest/4.2 扩展数据类型转换指令测试说明' },
      { text: '📊 数学函数', link: '/LubanTest/4.3 数学函数指令测试说明' },
      { text: '⏰ 时间算术', link: '/LubanTest/4.4 时间算术指令测试说明' },
    ],
  },
  {
    text: '📊 统计报告',
    collapsed: false,
    items: [
      { text: '📋 PLC指令测试统计报告', link: '/LubanTest/5.1 PLC指令测试统计报告' },
      { text: '📋 PLC指令测试明细表', link: '/LubanTest/5.2 PLC指令测试明细表' },
      { text: '📋 类型转换指令详细统计表', link: '/LubanTest/5.3 类型转换指令详细统计表' },
      { text: '🎯 项目成果汇报总结', link: '/LubanTest/5.4 项目成果汇报总结' },
    ],
  },
],


    //Algolia搜索 - 注释掉以移除搜索功能
    search: {
      provider: 'algolia',
      options: {
        appId: 'QVKQI62L15',
        apiKey: 'bef8783dde57293ce082c531aa7c7e0c',
        indexName: 'doc',
        locales: {
          root: {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除查询条件',
                  resetButtonAriaLabel: '清除查询条件',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '没有搜索历史',
                  saveRecentSearchButtonTitle: '保存至搜索历史',
                  removeRecentSearchButtonTitle: '从搜索历史中移除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                  searchByText: '搜索提供者'
                },
                noResultsScreen: {
                  noResultsText: '无法找到相关结果',
                  suggestedQueryText: '你可以尝试查询',
                  reportMissingResultsText: '你认为该查询应该有结果？',
                  reportMissingResultsLinkText: '点击反馈'
                },
              },
            },
          },
        },
      },
    },



    // //社交链接 - 注释掉以移除社交链接
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/Yiov/vitepress-doc' },
    //   { icon: 'twitter', link: 'https://twitter.com/' },
    //   { icon: 'discord', link: 'https://chat.vitejs.dev/' },
    //   {
    //     icon: {
    //       svg: '<svg t="1703483542872" class="icon" viewBox="0 0 1309 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6274" width="200" height="200"><path d="M1147.26896 912.681417l34.90165 111.318583-127.165111-66.823891a604.787313 604.787313 0 0 1-139.082747 22.263717c-220.607239 0-394.296969-144.615936-394.296969-322.758409s173.526026-322.889372 394.296969-322.889372C1124.219465 333.661082 1309.630388 478.669907 1309.630388 656.550454c0 100.284947-69.344929 189.143369-162.361428 256.130963zM788.070086 511.869037a49.11114 49.11114 0 0 0-46.360916 44.494692 48.783732 48.783732 0 0 0 46.360916 44.494693 52.090549 52.090549 0 0 0 57.983885-44.494693 52.385216 52.385216 0 0 0-57.983885-44.494692z m254.985036 0a48.881954 48.881954 0 0 0-46.09899 44.494692 48.620028 48.620028 0 0 0 46.09899 44.494693 52.385216 52.385216 0 0 0 57.983886-44.494693 52.58166 52.58166 0 0 0-57.951145-44.494692z m-550.568615 150.018161a318.567592 318.567592 0 0 0 14.307712 93.212943c-14.307712 1.080445-28.746387 1.768001-43.283284 1.768001a827.293516 827.293516 0 0 1-162.394168-22.296458l-162.001279 77.955749 46.328175-133.811485C69.410411 600.858422 0 500.507993 0 378.38496 0 166.683208 208.689602 0 463.510935 0c227.908428 0 427.594322 133.18941 467.701752 312.379588a427.463358 427.463358 0 0 0-44.625655-2.619261c-220.24709 0-394.100524 157.74498-394.100525 352.126871zM312.90344 189.143369a64.270111 64.270111 0 0 0-69.803299 55.659291 64.532037 64.532037 0 0 0 69.803299 55.659292 53.694846 53.694846 0 0 0 57.852923-55.659292 53.465661 53.465661 0 0 0-57.852923-55.659291z m324.428188 0a64.040926 64.040926 0 0 0-69.574114 55.659291 64.302852 64.302852 0 0 0 69.574114 55.659292 53.694846 53.694846 0 0 0 57.951145-55.659292 53.465661 53.465661 0 0 0-57.951145-55.659291z" p-id="6275"></path></svg>'
    //     },
    //     link: 'https://weixin.qq.com/',
    //     // You can include a custom label for accessibility too (optional but recommended):
    //     ariaLabel: 'wechat'
    //   }
    // ],

    //手机端深浅模式文字修改
    darkModeSwitchLabel: '深浅模式',




    //页脚
    footer: {
      message: 'QQ:94114148',
      copyright: `Copyright © 2023-${new Date().getFullYear()} 科控物联</a>`,
    },


    //侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    //返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',


    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '当前页大纲'
    },


    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

  },



})