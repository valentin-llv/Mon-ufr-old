"use strict";
export default function openShareMenu() {
    if (navigator.share) {
        navigator.share({
            title: 'Mon UFR',
            text: 'Mon UFR la meilleur application pour  acceder à tous les services des UFR.',
            url: 'https://ufr-planning.com/',
        });
    }
}
