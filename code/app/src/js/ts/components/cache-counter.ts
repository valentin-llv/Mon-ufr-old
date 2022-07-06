"use strict"

import Utils from "../singleton/utils.js";

export default function CacheCounter(): any {
    return {
        usageInMib: 0,
        quotaInMib: 0,

        async mounted() {
            let result = await Utils.clacCacheStorage();
            this.usageInMib = result.usageInMib;
            this.quotaInMib = result.quotaInMib;
        },
    };
}