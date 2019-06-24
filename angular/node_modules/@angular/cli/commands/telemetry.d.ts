/**
 * Configures usage metric gathering for the Angular CLI. See
 * http://angular.io/MORE_INFO_HERE
 */
export interface Schema {
    /**
     * Shows a help message for this command in the console.
     */
    help?: HelpUnion;
    /**
     * .
     */
    projectSetting?: ProjectSetting;
    /**
     * .
     */
    settingOrProject: SettingOrProject;
}
/**
 * Shows a help message for this command in the console.
 */
export declare type HelpUnion = boolean | HelpEnum;
export declare enum HelpEnum {
    HelpJson = "JSON",
    Json = "json"
}
/**
 * .
 */
export declare enum ProjectSetting {
    Off = "off",
    On = "on",
    Prompt = "prompt"
}
/**
 * .
 */
export declare enum SettingOrProject {
    Ci = "ci",
    Off = "off",
    On = "on",
    Project = "project",
    Prompt = "prompt"
}
