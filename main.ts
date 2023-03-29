import { App,Plugin, MarkdownView,Notice,PluginSettingTab,Setting } from "obsidian";
import { MarkdownIndex } from "./MarkdownIndex";

interface indexFormattingPluginSettings{
    testSetting1: string;
}

const DEFAULT_SETTINGS: indexFormattingPluginSettings = {
    testSetting1: 'test default setting',
}


export default class indexFormattingPlugin extends Plugin {
    settings:indexFormattingPluginSettings
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SampleSettingTab(this.app, this));
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
        const markdownIndex = new MarkdownIndex();
        const newlines = markdownIndex.addMarkdownIndex(lines);
        editor.setValue(newlines.join("\n"));
        editor.setCursor(cursor);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: indexFormattingPlugin;
    constructor(app: App, plugin: indexFormattingPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();
        containerEl.createEl('h2', {text: 'title index'});
        new Setting(containerEl)
            .setName('a test setting')
            .setDesc('just test')
            .addText(text => text
                .setPlaceholder('enter text')
                .setValue(this.plugin.settings.testSetting1)
                .onChange(async (value) => {
                    console.log('Secret: ' + value);
                    this.plugin.settings.testSetting1 = value;
                    await this.plugin.saveSettings();
                }));
    }
}