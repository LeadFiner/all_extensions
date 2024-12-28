// Extend some existing extensions.

namespace ext_GamePad {
    //% blockId=ext_GamePad_RockerX block="RockerX"
    //% weight=96
    //% blockGap=10
    //% color="#0080FF"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function RockerX() {
        return pins.analogReadPin(AnalogPin.P1);
    }
    
    //% blockId=ext_GamePad_RockerY block="RockerY"
    //% weight=96
    //% blockGap=10
    //% color="#0080FF"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function RockerY() {
        return pins.analogReadPin(AnalogPin.P2);
    }
}

namespace ext_SuperBitV2 {
    export enum enServo {
        S1 = 0,
        S2,
        S3,
        S4,
        S5,
        S6,
        S7,
        S8
    }
    
    //% blockId=ext_SuperBitV2_Servo270 block="Servo(270°)|num %num|value %value"
    //% weight=96
    //% blockGap=10
    //% color="#0080FF"
    //% num.min=1 num.max=8 value.min=0 value.max=270
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo270(num: enServo, value: number): void {
        // Freq=50Hz => 20000 us => 4096 steps.
        // GeekServo:
        //   - min (0°)   =>  500 us =>  500*4096/20000 (=102).
        //   - max (270°) => 2500 us => 2500*4096/20000 (=512).
        let pwm = Math.map(value, 0, 270, 102, 512);
        SuperBitV2.setPwm(num, 0, pwm);
    }
}