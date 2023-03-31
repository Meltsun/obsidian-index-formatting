import myPlugin from "./main"
import { App,PluginSettingTab,Setting } from "obsidian";

export interface MySetting{
    testSetting1:string;
    listIndex:string;
    titleIndex:number;
}

export class MySettingTab extends PluginSettingTab {
    plugin: myPlugin;
    constructor(app: App, plugin: myPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display(): void {
        const {containerEl} = this;
        containerEl.empty();
        //containerEl.createEl('h2', {text: 'title index'});
        new Setting(containerEl)
            .setName('name')
            .setDesc('desc')
            //.setTooltip('tooltip')
            .addText(text => text
                .setPlaceholder('place holder')
                .setValue(this.plugin.settings.testSetting1)
                .onChange(async (value) => {
                    console.log('Secret: ' + value);
                    this.plugin.settings.testSetting1 = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Format Ordered List Index')
            .addDropdown(Dropdown => Dropdown
                .addOptions({
                    'Disabled':'Disabled',
                    'Increase from 1.':'Increase from 1.',
                    'Increase from any':'Increase from any',
                    'Always 1.':'Always 1.',
                })
                .setValue(this.plugin.settings.listIndex)
                .onChange(async (value) => {
                    this.plugin.settings.listIndex = value;                    
                    await this.plugin.saveSettings();
                })
            )
                    
        new Setting(containerEl)
            .setName('Add index to titles ')
            .addDropdown(Dropdown => Dropdown
                .addOptions({
                    6:'Disabled',
                    0:'All Levels',
                    1:'Level 2 and below',
                    2:'Level 3 and below',
                    3:'Level 4 and below',
                    4:'Level 5 and below',
                    5:'Level 6',
                })
                .setValue(String(this.plugin.settings.titleIndex))
                .onChange(async (value) => {
                    this.plugin.settings.titleIndex = Number(value)
                    await this.plugin.saveSettings();
                })
            )
        
    }
}