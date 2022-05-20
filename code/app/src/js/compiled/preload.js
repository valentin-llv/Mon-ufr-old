"use strict";
function setPreferedColorTheme(data) {
    if (data.settings.themeColor) {
        let shade = [900, 800, 700, 600, 300, 200, 100];
        for (let i = 0; i < shade.length; i++) {
            document.documentElement.style.setProperty('--color-' + shade[i], getComputedStyle(document.documentElement).getPropertyValue('--color-' + shade[i] + "-" + JSON.parse(localStorage.getItem('user-data')).settings.themeColor));
        }
    }
}
function setPreferedAccentColor(data) {
    if (data.settings.accentColor) {
        document.documentElement.style.setProperty('--color-accent', data.settings.accentColor);
    }
}
let data = JSON.parse(localStorage.getItem('user-data'));
if (data && data.settings) {
    setPreferedColorTheme(data);
    setPreferedAccentColor(data);
}
