"use strict"

/* Function */

function setPreferedColorTheme(themeColor) {
    if(themeColor) {
        let shade = [900, 800, 700, 600, 300, 200, 100];
        for(let i = 0; i < shade.length; i++) {
            document.documentElement.style.setProperty('--color-' + shade[i], getComputedStyle(document.documentElement).getPropertyValue('--color-' + shade[i] + "-" + themeColor));
        }
    }
}

function setPreferedAccentColor(accentColor) {
    if(accentColor) {
        document.documentElement.style.setProperty('--color-accent', accentColor);
    }
}

function setLowPerfMode(lowPerfMode) {
    if(lowPerfMode) {
        let transitionDuration = lowPerfMode == true ? 0 : 300;
        document.documentElement.style.setProperty('--transition-duration', transitionDuration + "ms");
    }
}

/* Calling function */

let data = JSON.parse(localStorage.getItem('user-preference'));
if(data && data.settings) {
    setPreferedColorTheme(data.settings.themeColor);
    setPreferedAccentColor(data.settings.accentColor);
    setLowPerfMode(data.settings.lowPerfMode);
}