// Extend some existing extensions.
/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"GHBit": "file:../pxt-ghbit"
*/

// Updated: LeadFiner.
// https://fontawesome.com/v4/icons/

//% color="#C814B8" weight=20 icon="\uf11b"
namespace LeadFiner_ext {
    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    function pause(ms: number): void {
        if (isNaN(ms)) ms = 20
        basic.pause(ms);
    }
}