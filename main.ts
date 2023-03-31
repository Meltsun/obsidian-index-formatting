import { Plugin, MarkdownView,Notice} from "obsidian";
//import { MarkdownIndex } from "./indexFormatter_old";
import {MySetting, MySettingTab} from "./mySettingTab";
import {IndexFormatter} from "./indexFormatter"


const MY_DEFAULT_SETTING: MySetting = {
    testSetting1: 'test default setting',
    listIndex:'Increase from 1.',
    titleIndex:1
}

export default class myPlugin extends Plugin {
    settings:MySetting
    indexFormatter:IndexFormatter
    async loadSettings() {
        this.settings = Object.assign({}, MY_DEFAULT_SETTING, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new MySettingTab(this.app, this));

        const ribbonIconEl = this.addRibbonIcon('dice', 'Format this note', (evt: MouseEvent) => {
            const markdownView =this.app.workspace.getActiveViewOfType(MarkdownView);
            if(markdownView){
                this.format_a_note(markdownView);
            }
        });

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

    format_a_note(markdownView:MarkdownView){
        new Notice("Index Formatting: This note is formatted.");
        const editor = markdownView.editor;
        const cursor = editor.getCursor();
        const lines = editor.getValue().split("\n");
        const markdownIndex = new IndexFormatter(this.settings);
        markdownIndex.format_index(lines);
        editor.setValue(lines.join("\n"));
        editor.setCursor(cursor);
    }
}