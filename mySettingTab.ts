import myPlugin from "./main"
import { App,PluginSettingTab,Setting } from "obsidian";

export class mySettingTab extends PluginSettingTab {
    plugin: myPlugin;
    constructor(app: App, plugin: myPlugin) {
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