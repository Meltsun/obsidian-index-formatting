import { Plugin, MarkdownView,Notice} from "obsidian";
//import { MarkdownIndex } from "./indexFormatter_old";
import { mySettingTab} from "./mySettingTab";
import {IndexFormatter} from "./indexFormatter"

interface mySetting{
    testSetting1: string;
}

const MY_DEFAULT_SETTING: mySetting = {
    testSetting1: 'test default setting',
}

export default class myPlugin extends Plugin {
    settings:mySetting
    indexFormatter:IndexFormatter
    async loadSettings() {
        this.settings = Object.assign({}, MY_DEFAULT_SETTING, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onload() {
        await this.loadSettings();

        this.indexFormatter=new IndexFormatter();

        this.addSettingTab(new mySettingTab(this.app, this));

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
        const markdownIndex = new IndexFormatter();
        this.indexFormatter.format_index(lines);
        editor.setValue(lines.join("\n"));
        editor.setCursor(cursor);
    }
}