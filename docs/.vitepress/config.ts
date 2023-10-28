import { defineConfig } from 'vitepress'
import { DefaultTheme } from 'vitepress/theme';
import { readdirSync } from "node:fs"


type SidebarItem = DefaultTheme.SidebarItem;
function generate(): SidebarItem[] {

    const sidebar: SidebarItem[] = [];
    readdirSync("docs/Announcements").forEach((value) => {
        if (!value.includes("index")) {
            sidebar.push({
                text: value.replace(".md", ""),
                link: `/Announcements/${value}`,
            })
        }
    })
    return sidebar
}

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
    title: "编程猫海龟星球群规委员会",
    description: '欢迎来到编程猫海龟星球群规委员会！',
    themeConfig: {
        nav: [
            {
                text: '关于',
                activeMatch: `^/about/`,
                items: [
                    {
                        text: '群规委员会公告',
                        link: '/Announcements/',
                    },
                ],
            },
        ],
        sidebar: [
            {
                text: "主页",
                items: [
                    { text: "概况", link: "/Policy/index" },
                ]
            },
            {
                text: "全局群规",
                items: [
                    { text: "编程猫Python海龟星球群规", link: "/Policy/编程猫Python海龟星球群规" },
                    { text: "Python代码临时管理规定(试行)", link: "/Policy/Python代码临时管理规定(试行)" }
                ]
            },
            {
                text: "条例群规",
                items: [
                    { text: "广告管理条例", "link": "/Policy/广告管理条例.md" },
                    { text: "群规制定条例", link: "/Policy/群规制定条例.md" },
                    { text: "公告栏管理条例", link: "/Policy/公告栏管理条例.md" },
                    { text: "群规委员会弹劾程序条例", link: "/Policy/群规委员会弹劾程序条例" },
                    { text: "群规委员会公投制度", link: "/Policy/群规委员会公投制度" },
                    { text: "成员工作流程", link: "/Policy/成员工作流程" }
                ]
            },
            {
                text: "群规委员会公告",
                items: [
                    { text: "成员移除名单", link: "/Policy/成员移除名单" },
                    { text: "群公告栏", link: "/Announcements/index", items: generate() }
                ]
            }
        ]
    }
})
