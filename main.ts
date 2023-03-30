import { Plugin, MarkdownView,Notice} from "obsidian";
import { MarkdownIndex } from "./indexFormatter";
import { mySettingTab} from "./mySettingTab";

interface mySetting{
    testSetting1: string;
}

const MY_DEFAULT_SETTING: mySetting = {
    testSetting1: 'test default setting',
}

export default class myPlugin extends Plugin {
    settings:mySetting

    async loadSettings() {
        this.settings = Object.assign({}, MY_DEFAULT_SETTING, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onload() {
        await this.loadSettings();
        //添加设置栏
        this.addSettingTab(new mySettingTab(this.app, this));

        //添加侧栏按钮：格式化此文档
        const ribbonIconEl = this.addRibbonIcon('dice', 'Format this note', (evt: MouseEvent) => {
            const markdownView =this.app.workspace.getActiveViewOfType(MarkdownView);
            if(markdownView){
                this.format_a_note(markdownView);
            }
        });

        //添加命令：格式化此文档
        this.addCommand({
            id: "obsidian-index-formatting-format_this_note",
            name: "Format this note",
            checkCallback: (checking: boolean) => {
                const markdownView =this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!markdownView) {
                    return false;
                }
                else{
                    if (!checking) {
                        this.format_a_note(markdownView);
                    }
                    return true;
                }
            },
        });
    }

    //格式化一个文档
    format_a_note(markdownView:MarkdownView){
        new Notice("Index Formatting: This note is formatted.");
        const editor = markdownView.editor;
        const cursor = editor.getCursor();
        const lines = editor.getValue().split("\n");
        const markdownIndex = new MarkdownIndex();
        const newlines = markdownIndex.addMarkdownIndex(lines);
        editor.setValue(newlines.join("\n"));
        editor.setCursor(cursor);
    }
}