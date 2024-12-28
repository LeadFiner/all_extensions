/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"SuperBitV2": "file:../pxt-SuperBitV2"
*/

// Updated: LeadFiner.

//% color="#0DA4EC" weight=30 icon="\uf028"
namespace SuperBitV2_Sound {
    export enum mwDigitalNum {
        //% blockId="P4P6" block="P4P6"
        P4P6 = 1,
        //% blockId="P1P2" block="P1P2"
        P1P2 = 2,
        //% blockId="P0P3" block="P0P3"
        P0P3 = 3,
        //% blockId="P10P9" block="P10P9"
        P10P9 = 4,
        //% blockId="P7P8" block="P7P8"
        P7P8 = 5,
        //% blockId="P5P11" block="P5P11"
        P5P11 = 6
    }
    
    export enum enMusic {

        dadadum = 0,
        entertainer,
        prelude,
        ode,
        nyan,
        ringtone,
        funk,
        blues,

        birthday,
        wedding,
        funereal,
        punchline,
        baddy,
        chase,
        ba_ding,
        wawawawaa,
        jump_up,
        jump_down,
        power_up,
        power_down
    }
    
    //% blockId=SuperBitV2_Music block="Music|%index"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music(index: enMusic): void {
        switch (index) {
            case enMusic.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case enMusic.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case enMusic.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case enMusic.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case enMusic.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case enMusic.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case enMusic.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case enMusic.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case enMusic.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case enMusic.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case enMusic.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case enMusic.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case enMusic.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case enMusic.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case enMusic.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case enMusic.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case enMusic.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case enMusic.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case enMusic.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case enMusic.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }

    //% blockId=SuperBitV2_PWM_BuzzerPin block="Set Buzzer Pin|%value_DNum"
    //% weight=99
    //% blockGap=22
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function BuzzerPin(value_DNum: mwDigitalNum): void {
		let pinb;
		if(value_DNum == 1)	{ pinb = AnalogPin.P4; }
		else if(value_DNum == 2)	{ pinb = AnalogPin.P1; }
		else if(value_DNum == 3)	{ pinb = AnalogPin.P0; }
		else if(value_DNum == 4)	{ pinb = AnalogPin.P10; }
		else if(value_DNum == 5)	{ pinb = AnalogPin.P7; }
		else if(value_DNum == 6)	{ pinb = AnalogPin.P5; }
		
		pins.setAudioPin(pinb);
    }
}
