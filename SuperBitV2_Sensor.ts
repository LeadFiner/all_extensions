/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"SuperBitV2": "file:../pxt-SuperBitV2"
*/

// Updated: LeadFiner.
// https://fontawesome.com/v4/icons/

//% color="#C814B8" weight=25 icon="\uf25a"
namespace SuperBitV2_Sensor {

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

    export enum enObstacle {
        //% blockId="Obstacle" block="Obstacle"
        Obstacle = 0,
        //% blockId="NoObstacle" block="NoObstacle"
        NoObstacle = 1
    }

    export enum enPIR {
        //% blockId="NoPIR" block="NoPIR"
        NoPIR = 0,
        //% blockId="OPIR" block="OPIR"
        OPIR = 1
    }

    export enum enCollision {
        //% blockId="NoCollision" block="NoCollision"
        NoCollision = 0,
        //% blockId="OCollision" block="OCollision"
        OCollision = 1
    }

    export enum enVibration {
        //% blockId="NoVibration" block="NoVibration"
        NoVibration = 0,
        //% blockId="OVibration" block="OVibration"
        OVibration = 1
    }
	
    export enum DHT11Type {
        //% block="temperature(℃)" enumval=0
        DHT11_temperature_C,

        //% block="temperature(℉)" enumval=1
        DHT11_temperature_F,

        //% block="humidity(0~100)" enumval=2
        DHT11_humidity,
    }
    export enum enButton {
        //% blockId="Press" block="Press"
        Press = 0,
        //% blockId="Realse" block="Realse"
        Realse = 1
    }	

	//% blockId=SuperBitV2_Sensor_dht11value block="value of dht11 %dht11type| at pin %value_DNum"
    //% weight=100
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5 
    export function dht11value(dht11type: DHT11Type, value_DNum: mwDigitalNum): number {
		let dht11pin;
		if(value_DNum == 1)	{ dht11pin = DigitalPin.P4; }
		else if(value_DNum == 2)	{ dht11pin = DigitalPin.P1; }
		else if(value_DNum == 3)	{ dht11pin = DigitalPin.P0; }
		else if(value_DNum == 4)	{ dht11pin = DigitalPin.P10; }
		else if(value_DNum == 5)	{ dht11pin = DigitalPin.P7; }
		else if(value_DNum == 6)	{ dht11pin = DigitalPin.P5; }
			
		pins.digitalWritePin(dht11pin, 0)
		basic.pause(18)
		let i = pins.digitalReadPin(dht11pin)
		pins.setPull(dht11pin, PinPullMode.PullUp);
		switch (dht11type) {
			case 0:
				let dhtvalue1 = 0;
				let dhtcounter1 = 0;
				let dhtcounter1d = 0;
				while (pins.digitalReadPin(dht11pin) == 1);
				while (pins.digitalReadPin(dht11pin) == 0);
				while (pins.digitalReadPin(dht11pin) == 1);
				for (let i = 0; i <= 32 - 1; i++) {
					dhtcounter1d = 0
					while (pins.digitalReadPin(dht11pin) == 0) {
						dhtcounter1d += 1;
					}
					dhtcounter1 = 0
					while (pins.digitalReadPin(dht11pin) == 1) {
						dhtcounter1 += 1;
					}
					if (i > 15) {
						if (dhtcounter1 > dhtcounter1d) {
							dhtvalue1 = dhtvalue1 + (1 << (31 - i));
						}
					}
				}
				return ((dhtvalue1 & 0x0000ff00) >> 8);
				break;
			case 1:
				while (pins.digitalReadPin(dht11pin) == 1);
				while (pins.digitalReadPin(dht11pin) == 0);
				while (pins.digitalReadPin(dht11pin) == 1);
				let dhtvalue = 0;
				let dhtcounter = 0;
				let dhtcounterd = 0;
				for (let i = 0; i <= 32 - 1; i++) {
					dhtcounterd = 0
					while (pins.digitalReadPin(dht11pin) == 0) {
						dhtcounterd += 1;
					}
					dhtcounter = 0
					while (pins.digitalReadPin(dht11pin) == 1) {
						dhtcounter += 1;
					}
					if (i > 15) {
						if (dhtcounter > dhtcounterd) {
							dhtvalue = dhtvalue + (1 << (31 - i));
						}
					}
				}
				return Math.round((((dhtvalue & 0x0000ff00) >> 8) * 9 / 5) + 32);
				break;
			case 2:
				while (pins.digitalReadPin(dht11pin) == 1);
				while (pins.digitalReadPin(dht11pin) == 0);
				while (pins.digitalReadPin(dht11pin) == 1);

				let value = 0;
				let counter = 0;
				let counterd = 0;

				for (let i = 0; i <= 8 - 1; i++) {
					counterd = 0
					while (pins.digitalReadPin(dht11pin) == 0) {
						counterd += 1;
					}
					counter = 0
					while (pins.digitalReadPin(dht11pin) == 1) {
						counter += 1;
					}
					if (counter > counterd) {
						value = value + (1 << (7 - i));
					}
				}
				return value;
			default:
				return 0;
		}
    }

    //% blockId=SuperBitV2_SensorDigital_Ultrasonic block="Ultrasonic|pin %value_DNum"
    //% weight=97
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Ultrasonic(value_DNum: mwDigitalNum): number {
        //send pulse
		let Trig,Echo;		
		if(value_DNum == 1)	{ Trig = DigitalPin.P4; Echo = DigitalPin.P6; }
		else if(value_DNum == 2)	{ Trig = DigitalPin.P1; Echo = DigitalPin.P2; }
		else if(value_DNum == 3)	{ Trig = DigitalPin.P0; Echo = DigitalPin.P3; }
		else if(value_DNum == 4)	{ Trig = DigitalPin.P10; Echo = DigitalPin.P9; }
		else if(value_DNum == 5)	{ Trig = DigitalPin.P7; Echo = DigitalPin.P8; }
		else if(value_DNum == 6)	{ Trig = DigitalPin.P5; Echo = DigitalPin.P11; }
		
		
        pins.setPull(Trig, PinPullMode.PullNone);
        pins.digitalWritePin(Trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(Trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(Trig, 0);

        //read pulse, maximum distance=500cm
        const d = pins.pulseIn(Echo, PulseValue.High, 500 * 58);   

        return Math.idiv(d, 58);
    }

    //% blockId=SuperBitV2_Sensor_IR block="IR|pin %value_DNum|value %value"
    //% weight=96
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function IR(value_DNum: mwDigitalNum, value: enObstacle): boolean {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P1; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P7; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P5; }

        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }

    //% blockId=SuperBitV2_Sensor_PIR block="PIR|pin %value_DNum|value %value"
    //% weight=96
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function PIR(value_DNum: mwDigitalNum, value: enPIR): boolean {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P1; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P7; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P5; }

        pins.setPull(pin, PinPullMode.PullDown);
	pins.digitalWritePin(pin, 1);
        return pins.digitalReadPin(pin) == value;
    }
	
    //% blockId=SuperBitV2_Sensor_Collision block="Collision|pin %value_DNum|value %value"
    //% weight=3
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Collision(value_DNum: mwDigitalNum, value: enCollision): boolean {
		
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P1; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P7; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P5; }
		
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }

    //% blockId=SuperBitV2_Sensor_Button block="Button|pin %value_DNum|value %value"
    //% weight=3
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Button(value_DNum: mwDigitalNum, value: enButton): boolean {
		
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P1; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P7; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P5; }
		
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == value;
    }
    
    //% blockId=SuperBitV2_Sensor_Vibration block="Vibration|pin %value_DNum|get "
    //% weight=1
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Vibration(value_DNum: mwDigitalNum, handle: () => void): void {
		let pin;
		if(value_DNum == 1)	{ pin = DigitalPin.P4; }
		else if(value_DNum == 2)	{ pin = DigitalPin.P1; }
		else if(value_DNum == 3)	{ pin = DigitalPin.P0; }
		else if(value_DNum == 4)	{ pin = DigitalPin.P10; }
		else if(value_DNum == 5)	{ pin = DigitalPin.P7; }
		else if(value_DNum == 6)	{ pin = DigitalPin.P5; }
		
        pins.setPull(pin, PinPullMode.PullUp);
		pins.setEvents(pin, PinEventType.Edge);
		control.onEvent(pin, DAL.MICROBIT_PIN_EVT_FALL, handle);
    }

    export enum enRocker {
        //% blockId="NoState" block="NoState"
        NoState = 0,
        //% blockId="Up" block="Up"
        Up,
        //% blockId="Down" block="Down"
        Down,
        //% blockId="Left" block="Left"
        Left,
        //% blockId="Right" block="Right"
        Right
    }

    export enum mwAnalogNum {
        //% blockId="P4P6" block="P4P6"
        AP4P6 = 1,
        //% blockId="P1P2" block="P1P2"
        AP1P2 = 2,
        //% blockId="P0P3" block="P0P3"
        AP0P3 = 3,
        //% blockId="P10P9" block="P10P9"
        AP10P9 = 4
    }	
	
    export enum mwAnalogNum2 {
        //% blockId="P1P2" block="P1P2"
        AP1P2 = 1,
        //% blockId="P0P3" block="P0P3"
        AP0P3 = 2
    }	

    //% blockId=SuperBitV2_Sensor_Light block="Light|pin %value_ANum"
    //% weight=100
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5 
    export function Light(value_ANum: mwAnalogNum): number {
		let lightpin;
		let value: number;
		if(value_ANum == 1)	{ lightpin = AnalogPin.P4; }
		else if(value_ANum == 2)	{ lightpin = AnalogPin.P1; }
		else if(value_ANum == 3)	{ lightpin = AnalogPin.P0; }
		else if(value_ANum == 4)	{ lightpin = AnalogPin.P10; }
		
        value = 1024-pins.analogReadPin(lightpin);
        return value;
        //return 0;
    }
	
    //% blockId=SuperBitV2_Sensor_Sound block="Sound|pin %value_ANum"
    //% weight=99
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Sound(value_ANum: mwAnalogNum): number {
		let soundpin;
		let value: number;
		if(value_ANum == 1)	{ soundpin = AnalogPin.P4; }
		else if(value_ANum == 2)	{ soundpin = AnalogPin.P1; }
		else if(value_ANum == 3)	{ soundpin = AnalogPin.P0; }
		else if(value_ANum == 4)	{ soundpin = AnalogPin.P10; }
		
        value = pins.analogReadPin(soundpin);
        return value;
        //return 0;
    }
    
	//% blockId=SuperBitV2_Sensor_Potentiometer block="Potentiometer|pin %value_ANum"
    //% weight=2
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOption.columns=5
    export function Potentiometer(value_ANum: mwAnalogNum): number {
		let pin;
		let value: number;
		if(value_ANum == 1)	{ pin = AnalogPin.P4; }
		else if(value_ANum == 2)	{ pin = AnalogPin.P1; }
		else if(value_ANum == 3)	{ pin = AnalogPin.P0; }
		else if(value_ANum == 4)	{ pin = AnalogPin.P10; }
		
        value = pins.analogReadPin(pin);
        return value;
    }
	
    //% blockId=SuperBitV2_Sensor_Rocker block="Rocker|pin %value_ANum|value %value"
    //% weight=1
    //% blockGap=20
    export function Rocker(value_ANum: mwAnalogNum2, value: enRocker): boolean {
		
		let pin1;
		let pin2;

		if(value_ANum == 1)	{ pin1 = AnalogPin.P1; pin2 = AnalogPin.P2; }
		else if(value_ANum == 2)	{ pin1 = AnalogPin.P0; pin2 = AnalogPin.P3; }
		
        let x = pins.analogReadPin(pin1);
        let y = pins.analogReadPin(pin2);
		
        let now_state = enRocker.NoState;

        if (x < 100) // 左
        {
            now_state = enRocker.Left;
        }
        else if (x > 700) //右
        {
            now_state = enRocker.Right;
        }
        else  // 上下
        {
            if (y < 100) //下
            {
                now_state = enRocker.Down;
            }
            else if (y > 700) //上
            {
                now_state = enRocker.Up;
            }
        }
        return now_state == value;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // For color detection.
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const COLOR_ADD = 0X53;
    const COLOR_REG = 0x00;
    const COLOR_R = 0X10;
    const COLOR_G = 0X0D;
    const COLOR_B = 0x13;

    let initialized = false;
    let val_red = 0;
    let val_green = 0;
    let val_blue = 0;
	
    export enum enGetRGB {
        //% blockId="GetValueR" block="GetValueR"
        GetValueR = 0,
        //% blockId="GetValueG" block="GetValueG"
        GetValueG = 1,
        //% blockId="GetValueB" block="GetValueB"
        GetValueB = 2
    }
	
    function i2cWriteData(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function setRegConfig(): void {
        i2cWriteData(COLOR_ADD, COLOR_REG, 0X06);
        i2cWriteData(COLOR_ADD, 0X04, 0X41);
        i2cWriteData(COLOR_ADD, 0x05, 0x01);
    }

    function initColorI2C(): void {
        setRegConfig();
        initialized = true;
    }

    function GetRGB(): void {
        let buff_R = pins.createBuffer(2);
        let buff_G = pins.createBuffer(2);
        let buff_B = pins.createBuffer(2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_R, NumberFormat.UInt8BE);
        buff_R = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_G, NumberFormat.UInt8BE);
        buff_G = pins.i2cReadBuffer(COLOR_ADD, 2);

        pins.i2cWriteNumber(COLOR_ADD, COLOR_B, NumberFormat.UInt8BE);
        buff_B = pins.i2cReadBuffer(COLOR_ADD, 2);

        let Red = (buff_R[1] & 0xff) << 8 | (buff_R[0] & 0xff);
        let Green = (buff_G[1] & 0xff) << 8 | (buff_G[0] & 0xff);
        let Blue = (buff_B[1] & 0xff) << 8 | (buff_B[0] & 0xff);

        if (Red > 4500) Red = 2300;
        if (Green > 7600) Green = 4600;
        if (Blue > 4600) Blue = 2700;

        val_red = Math.map(Red, 0, 2300, 0, 255);
        val_green = Math.map(Green, 0, 4600, 0, 255);
        val_blue = Math.map(Blue, 0, 2700, 0, 255);

        //化成整数
        val_red = Math.floor(val_red)
        val_green = Math.floor(val_green)
        val_blue = Math.floor(val_blue)

        if (val_red > 255) val_red = 255;
        if (val_green > 255) val_green = 255;
        if (val_blue > 255) val_blue = 255;

        if (val_red == val_green && val_red == val_blue) {
            val_red = 255;
            val_green = 255;
            val_blue == 255;
        }//3值相等，当成白色处理
        else if (val_red > val_green && val_red > val_blue) {
            if(val_red > 55) //当R值大于此值，说明检测红色
            {
                val_red = 255;
                val_green /= 2;
                val_blue /= 2;
            }//否则值不处理
        }
        else if (val_green > val_red && val_green > val_blue) {
            val_green = 255;
            val_red /= 2;
            val_blue /= 2;
        }
        else if (val_blue > val_red && val_blue > val_green) {
            val_blue = 255;
            val_red /= 2;
            val_green /= 2;
        }
    }

    //% blockId=SuperBitV2_Sensor_GetRGBValue block="GetRGBValue|value %value"
    //% blockGap=20
    //% weight=98
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function GetRGBValue(value: enGetRGB): number {
        if (!initialized) {
            initColorI2C();
        }
        GetRGB();
        switch (value) {
            case enGetRGB.GetValueR:
                return val_red;
            case enGetRGB.GetValueG:
                return val_green;
            case enGetRGB.GetValueB:
                return val_blue;
            default:
                break;
        }
        return 0;
    }
}
