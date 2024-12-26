// Extend some existing extensions.

namespace GHBit {
    //% blockId=GHBit_RockerX block="RockerX"
    //% weight=96
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function RockerX() {
        return pins.analogReadPin(AnalogPin.P1);
    }
    
    //% blockId=GHBit_RockerY block="RockerY"
    //% weight=96
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function RockerY() {
        return pins.analogReadPin(AnalogPin.P2);
    }
}