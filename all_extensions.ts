/**
 * makecode Four Digit Display (TM1650) Package.
 * From microbit/micropython Chinese community.
 */

/**
 * TM1650 digit Display
 */
//% weight=20 color=#64C800 icon="8" block="TM1650"
namespace TM1650 {

    let COMMAND_I2C_ADDRESS = 0x24
    let DISPLAY_I2C_ADDRESS = 0x34
    let _SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

    let TM1650_CDigits = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x82, 0x21, 0x00, 0x00, 0x00, 0x00, 0x02, 0x39, 0x0F, 0x00, 0x00, 0x00, 0x40, 0x80, 0x00,
        0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7f, 0x6f, 0x00, 0x00, 0x00, 0x48, 0x00, 0x53,
        0x00, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71, 0x6F, 0x76, 0x06, 0x1E, 0x00, 0x38, 0x00, 0x54, 0x3F,
        0x73, 0x67, 0x50, 0x6D, 0x78, 0x3E, 0x00, 0x00, 0x00, 0x6E, 0x00, 0x39, 0x00, 0x0F, 0x00, 0x08,
        0x63, 0x5F, 0x7C, 0x58, 0x5E, 0x7B, 0x71, 0x6F, 0x74, 0x02, 0x1E, 0x00, 0x06, 0x00, 0x54, 0x5C,
        0x73, 0x67, 0x50, 0x6D, 0x78, 0x1C, 0x00, 0x00, 0x00, 0x6E, 0x00, 0x39, 0x30, 0x0F, 0x00, 0x00
    ];

    let _intensity = 3
    let dbuf = [0, 0, 0, 0]
    let iPosition = ""

    /**
     * send command to display
     * @param is command, eg: 0
     */
    function cmd(c: number) {
        pins.i2cWriteNumber(COMMAND_I2C_ADDRESS, c, NumberFormat.Int8BE)
    }

    /**
     * send data to display
     * @param is data, eg: 0
     */
    function dat(bit: number, d: number) {
        pins.i2cWriteNumber(DISPLAY_I2C_ADDRESS + (bit % 4), d, NumberFormat.Int8BE)
    }

    /**
     * turn on display
     */
    //% blockId="TM650_ON" block="turn on display"
    //% weight=50 blockGap=8
    export function on() {
        cmd(_intensity * 16 + 1)
    }

    /**
     * turn off display
     */
    //% blockId="TM650_OFF" block="turn off display"
    //% weight=50 blockGap=8
    export function off() {
        _intensity = 0
        cmd(0)
    }

    /**
     * clear display content
     */
    //% blockId="TM650_CLEAR" block="clear display"
    //% weight=40 blockGap=8
    export function clear() {
        dat(0, 0)
        dat(1, 0)
        dat(2, 0)
        dat(3, 0)
        dbuf = [0, 0, 0, 0]
    }

    /**
     * show a digital in given position
     * @param digit is number (0-15) will be shown, eg: 1
     * @param bit is position, eg: 0
     */
    //% blockId="TM650_DIGIT" block="show digit %num|at %bit"
    //% weight=80 blockGap=8
    //% num.max=15 num.min=0
    export function digit(num: number, bit: number) {
        dbuf[bit % 4] = _SEG[num % 16]
        dat(bit, _SEG[num % 16])
    }

    /**
     * show a number in display
     * @param num is number will be shown, eg: 100
     */
    //% blockId="TM650_SHOW_NUMBER" block="show number %num"
    //% weight=100 blockGap=8
    export function showNumber(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit(Math.idiv(num, 1000) % 10, 0)
        digit(num % 10, 3)
        digit(Math.idiv(num, 10) % 10, 2)
        digit(Math.idiv(num, 100) % 10, 1)
    }


    //% blockId="showSring" block="show string %str"
    //% weight=100 blockGap=8
    export function showSring(str: string) {
        for (let i = 0; i < 4; i++) {
            let a = str.charCodeAt(i) & 0x7F;
            let dot = str.charCodeAt(i) & 0x80;
            dbuf[i] = TM1650_CDigits[a];
            if (a) {
                pins.i2cWriteNumber(DISPLAY_I2C_ADDRESS + i, dbuf[i] | dot, NumberFormat.Int8BE)
            }
            else {
                break;
            }

        }
    }


    function displayRuning(str: string, del: number): number {
        iPosition = str;
        showSring(iPosition);
        basic.pause(del);
        let l = iPosition.length;

        if (l < 4) {
            return 0;
        }
        else {
            return (l - 4);
        }

    }

    function displayRunningShift(): number {

        if (iPosition.length <= 4) {
            return 0;

        }
        else {
            iPosition = iPosition.substr(1, iPosition.length - 1);
            showSring(iPosition);
            return (iPosition.length - 4);
        }

    }

    //% blockId="showRunging" block="scroll display %str | rolling time(ms) %del"
    //% weight=90 blockGap=8
    export function showRunging(str: string, del: number) {
        if (displayRuning(str, del)) {
            while (displayRunningShift()) {
                basic.pause(del);
            }

        }


    }



    /**
     * show a number in hex format
     * @param num is number will be shown, eg: 123
     */
    //% blockId="TM650_SHOW_HEX_NUMBER" block="show hex number %num"
    //% weight=90 blockGap=8
    export function showHex(num: number) {
        if (num < 0) {
            dat(0, 0x40) // '-'
            num = -num
        }
        else
            digit((num >> 12) % 16, 0)
        digit(num % 16, 3)
        digit((num >> 4) % 16, 2)
        digit((num >> 8) % 16, 1)
    }

    /**
     * show Dot Point in given position
     * @param bit is positiion, eg: 0
     * @param show is true/false, eg: true
     */
    //% blockId="TM650_SHOW_DP" block="show dot point %bit|show %num"
    //% weight=80 blockGap=8
    export function showDpAt(bit: number, show: boolean) {
        if (show) dat(bit, dbuf[bit % 4] | 0x80)
        else dat(bit, dbuf[bit % 4] & 0x7F)
    }

    /**
     * set display intensity
     * @param dat is intensity of the display, eg: 3
     */
    //% blockId="TM650_INTENSITY" block="set intensity %dat"
    //% weight=70 blockGap=8
    export function setIntensity(dat: number) {
        if ((dat < 0) || (dat > 8))
            return;
        if (dat == 0)
            off()
        else {
            _intensity = dat
            cmd((dat << 4) | 0x01)
        }
    }

    on();
}

/**
 * Well known colors for a NeoPixel strip
 */
enum NeoPixelColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

/**
 * Different modes for RGB or RGB+W NeoPixel strips
 */
enum NeoPixelMode {
    //% block="RGB (GRB format)"
    RGB = 0,
    //% block="RGB+W"
    RGBW = 1,
    //% block="RGB (RGB format)"
    RGB_RGB = 2
}

/**
 * Functions to operate NeoPixel strips.
 */
//% weight=5 color=#2699BF icon="\uf110"
namespace neopixel {
    //% shim=sendBufferAsm
    function sendBuffer(buf: Buffer, pin: DigitalPin) {
    }

    /**
     * A NeoPixel strip
     */
    export class Strip {
        buf: Buffer;
        pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number; // start offset in LED strip
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any
        _matrixChain: number; // the connection type of matrix chain
        _matrixRotation: number; // the rotation type of matrix

        /**
         * Shows all LEDs to a given color (range 0-255 for r, g, b). 
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_strip_color" block="%strip|show color %rgb=neopixel_colors" 
        //% weight=85 blockGap=8
        //% parts="neopixel"
        showColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }

        /**
         * Shows a rainbow pattern on all LEDs. 
         * @param startHue the start hue value for the rainbow, eg: 1
         * @param endHue the end hue value for the rainbow, eg: 360
         */
        //% blockId="neopixel_set_strip_rainbow" block="%strip|show rainbow from %startHue|to %endHue" 
        //% weight=85 blockGap=8
        //% parts="neopixel"
        showRainbow(startHue: number = 1, endHue: number = 360) {
            if (this._length <= 0) return;

            startHue = startHue >> 0;
            endHue = endHue >> 0;
            const saturation = 100;
            const luminance = 50;
            const steps = this._length;
            const direction = HueInterpolationDirection.Clockwise;

            //hue
            const h1 = startHue;
            const h2 = endHue;
            const hDistCW = ((h2 + 360) - h1) % 360;
            const hStepCW = Math.idiv((hDistCW * 100), steps);
            const hDistCCW = ((h1 + 360) - h2) % 360;
            const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
            let hStep: number;
            if (direction === HueInterpolationDirection.Clockwise) {
                hStep = hStepCW;
            } else if (direction === HueInterpolationDirection.CounterClockwise) {
                hStep = hStepCCW;
            } else {
                hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW;
            }
            const h1_100 = h1 * 100; //we multiply by 100 so we keep more accurate results while doing interpolation

            //sat
            const s1 = saturation;
            const s2 = saturation;
            const sDist = s2 - s1;
            const sStep = Math.idiv(sDist, steps);
            const s1_100 = s1 * 100;

            //lum
            const l1 = luminance;
            const l2 = luminance;
            const lDist = l2 - l1;
            const lStep = Math.idiv(lDist, steps);
            const l1_100 = l1 * 100

            //interpolate
            if (steps === 1) {
                this.setPixelColor(0, hsl(h1 + hStep, s1 + sStep, l1 + lStep))
            } else {
                this.setPixelColor(0, hsl(startHue, saturation, luminance));
                for (let i = 1; i < steps - 1; i++) {
                    const h = Math.idiv((h1_100 + i * hStep), 100) + 360;
                    const s = Math.idiv((s1_100 + i * sStep), 100);
                    const l = Math.idiv((l1_100 + i * lStep), 100);
                    this.setPixelColor(i, hsl(h, s, l));
                }
                this.setPixelColor(steps - 1, hsl(endHue, saturation, luminance));
            }
            this.show();
        }

        /**
         * Displays a vertical bar graph based on the `value` and `high` value.
         * If `high` is 0, the chart gets adjusted automatically.
         * @param value current value to plot
         * @param high maximum value, eg: 255
         */
        //% weight=84
        //% blockId=neopixel_show_bar_graph block="%strip|show bar graph of %value|up to %high" 
        //% icon="\uf080"
        //% parts="neopixel"
        showBarGraph(value: number, high: number): void {
            if (high <= 0) {
                this.clear();
                this.setPixelColor(0, NeoPixelColors.Yellow);
                this.show();
                return;
            }

            value = Math.abs(value);
            const n = this._length;
            const n1 = n - 1;
            let v = Math.idiv((value * n), high);
            if (v == 0) {
                this.setPixelColor(0, 0x666600);
                for (let i = 1; i < n; ++i)
                    this.setPixelColor(i, 0);
            } else {
                for (let i = 0; i < n; ++i) {
                    if (i <= v) {
                        const b = Math.idiv(i * 255, n1);
                        this.setPixelColor(i, neopixel.rgb(b, 0, 255 - b));
                    }
                    else this.setPixelColor(i, 0);
                }
            }
            this.show();
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b). 
         * You need to call ``show`` to make the changes visible.
         * @param pixeloffset position of the NeoPixel in the strip
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_pixel_color" block="%strip|set pixel color at %pixeloffset|to %rgb=neopixel_colors" 
        //% blockGap=8
        //% weight=80
        //% parts="neopixel" advanced=true
        setPixelColor(pixeloffset: number, rgb: number): void {
            this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
        }

        /**
         * Sets the number of pixels in a matrix shaped strip
         * @param width number of pixels in a row
     * @param rotation type of matrix
     * @param chain type of matrix
         */
        //% blockId=neopixel_set_matrix_width block="%strip|set matrix width %width|rotation %rotation|chain %chain"
        //% blockGap=8
        //% weight=5
        //% parts="neopixel" advanced=true
        setMatrixWidth(width: number, rotation: number, chain: number) {
            this._matrixWidth = Math.min(this._length, width >> 0);
            this._matrixRotation = rotation >> 0;
            this._matrixChain = chain >> 0;
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b) in a matrix shaped strip 
         * You need to call ``show`` to make the changes visible.
         * @param x horizontal position
         * @param y horizontal position
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_matrix_color" block="%strip|set matrix color at x %x|y %y|to %rgb=neopixel_colors" 
        //% weight=4
        //% parts="neopixel" advanced=true
        setMatrixColor(x: number, y: number, rgb: number) {
            if (this._matrixWidth <= 0) return; // not a matrix, ignore
            x = x >> 0;
            y = y >> 0;
            rgb = rgb >> 0;
            const cols = Math.idiv(this._length, this._matrixWidth);

            if (this._matrixRotation == 1) {
                let t = y;
                y = x;
                x = t;
            } else if (this._matrixRotation == 2) {
                x = this._matrixWidth - x - 1;
            }


            // here be the physical mapping
            if (this._matrixChain == 1 && y % 2 == 1) {
                x = this._matrixWidth - x - 1;
            }
            if (x < 0 || x >= this._matrixWidth || y < 0 || y >= cols) return;

            let i = x + y * this._matrixWidth;
            this.setPixelColor(i, rgb);
        }

        /**
         * For NeoPixels with RGB+W LEDs, set the white LED brightness. This only works for RGB+W NeoPixels.
         * @param pixeloffset position of the LED in the strip
         * @param white brightness of the white LED
         */
        //% blockId="neopixel_set_pixel_white" block="%strip|set pixel white LED at %pixeloffset|to %white" 
        //% blockGap=8
        //% weight=80
        //% parts="neopixel" advanced=true
        setPixelWhiteLED(pixeloffset: number, white: number): void {
            if (this._mode === NeoPixelMode.RGBW) {
                this.setPixelW(pixeloffset >> 0, white >> 0);
            }
        }


        /**
         * Send all the changes to the strip.
         */
        //% blockId="neopixel_show" block="%strip|show" blockGap=8
        //% weight=79
        //% parts="neopixel"
        show() {
            sendBuffer(this.buf, this.pin);
        }

        /**
         * Turn off all LEDs.
         * You need to call ``show`` to make the changes visible.
         */
        //% blockId="neopixel_clear" block="%strip|clear"
        //% weight=76
        //% parts="neopixel"
        clear(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }

        /**
         * Gets the number of pixels declared on the strip
         */
        //% blockId="neopixel_length" block="%strip|length" blockGap=8
        //% weight=60 advanced=true
        length() {
            return this._length;
        }

        /**
         * Set the brightness of the strip. This flag only applies to future operation.
         * @param brightness a measure of LED brightness in 0-255. eg: 255
         */
        //% blockId="neopixel_set_brightness" block="%strip|set brightness %brightness" blockGap=8
        //% weight=59
        //% parts="neopixel" advanced=true
        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }

        /**
         * Apply brightness to current colors using a quadratic easing function.
         **/
        //% blockId="neopixel_each_brightness" block="%strip|ease brightness" blockGap=8
        //% weight=58
        //% parts="neopixel" advanced=true
        easeBrightness(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const br = this.brightness;
            const buf = this.buf;
            const end = this.start + this._length;
            const mid = Math.idiv(this._length, 2);
            for (let i = this.start; i < end; ++i) {
                const k = i - this.start;
                const ledoffset = i * stride;
                const br = k > mid
                    ? Math.idiv(255 * (this._length - 1 - k) * (this._length - 1 - k), (mid * mid))
                    : Math.idiv(255 * k * k, (mid * mid));
                serial.writeLine(k + ":" + br);
                const r = (buf[ledoffset + 0] * br) >> 8; buf[ledoffset + 0] = r;
                const g = (buf[ledoffset + 1] * br) >> 8; buf[ledoffset + 1] = g;
                const b = (buf[ledoffset + 2] * br) >> 8; buf[ledoffset + 2] = b;
                if (stride == 4) {
                    const w = (buf[ledoffset + 3] * br) >> 8; buf[ledoffset + 3] = w;
                }
            }
        }

        /** 
         * Create a range of LEDs.
         * @param start offset in the LED strip to start the range
         * @param length number of LEDs in the range. eg: 4
         */
        //% weight=89
        //% blockId="neopixel_range" block="%strip|range from %start|with %length|leds"
        //% parts="neopixel"
        //% blockSetVariable=range
        range(start: number, length: number): Strip {
            start = start >> 0;
            length = length >> 0;
            let strip = new Strip();
            strip.buf = this.buf;
            strip.pin = this.pin;
            strip.brightness = this.brightness;
            strip.start = this.start + Math.clamp(0, this._length - 1, start);
            strip._length = Math.clamp(0, this._length - (strip.start - this.start), length);
            strip._matrixWidth = 0;
            strip._mode = this._mode;
            return strip;
        }

        /**
         * Shift LEDs forward and clear with zeros.
         * You need to call ``show`` to make the changes visible.
         * @param offset number of pixels to shift forward, eg: 1
         */
        //% blockId="neopixel_shift" block="%strip|shift pixels by %offset" blockGap=8
        //% weight=40
        //% parts="neopixel"
        shift(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.shift(-offset * stride, this.start * stride, this._length * stride)
        }

        /**
         * Rotate LEDs forward.
         * You need to call ``show`` to make the changes visible.
         * @param offset number of pixels to rotate forward, eg: 1
         */
        //% blockId="neopixel_rotate" block="%strip|rotate pixels by %offset" blockGap=8
        //% weight=39
        //% parts="neopixel"
        rotate(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.rotate(-offset * stride, this.start * stride, this._length * stride)
        }

        /**
         * Set the pin where the neopixel is connected, defaults to P0.
         */
        //% weight=10
        //% parts="neopixel" advanced=true
        setPin(pin: DigitalPin): void {
            this.pin = pin;
            pins.digitalWritePin(this.pin, 0);
            // don't yield to avoid races on initialization
        }

        /**
         * Estimates the electrical current (mA) consumed by the current light configuration.
         */
        //% weight=9 blockId=neopixel_power block="%strip|power (mA)"
        //% advanced=true
        power(): number {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const end = this.start + this._length;
            let p = 0;
            for (let i = this.start; i < end; ++i) {
                const ledoffset = i * stride;
                for (let j = 0; j < stride; ++j) {
                    p += this.buf[i + j];
                }
            }
            return Math.idiv(this.length(), 2) /* 0.5mA per neopixel */
                + Math.idiv(p * 433, 10000); /* rought approximation */
        }

        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === NeoPixelMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const end = this.start + this._length;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * stride, red, green, blue)
            }
        }
        private setAllW(white: number) {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            let end = this.start + this._length;
            for (let i = this.start; i < end; ++i) {
                let ledoffset = i * 4;
                buf[ledoffset + 3] = white;
            }
        }
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            let stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            pixeloffset = (pixeloffset + this.start) * stride;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            let br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.setBufferRGB(pixeloffset, red, green, blue)
        }
        private setPixelW(pixeloffset: number, white: number): void {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            pixeloffset = (pixeloffset + this.start) * 4;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            buf[pixeloffset + 3] = white;
        }
    }

    /**
     * Create a new NeoPixel driver for `numleds` LEDs.
     * @param pin the pin where the neopixel is connected.
     * @param numleds number of leds in the strip, eg: 24,30,60,64
     */
    //% blockId="neopixel_create" block="NeoPixel at pin %pin|with %numleds|leds as %mode"
    //% weight=90 blockGap=8
    //% parts="neopixel"
    //% trackArgs=0,2
    //% blockSetVariable=strip
    export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): Strip {
        let strip = new Strip();
        let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
        strip.buf = pins.createBuffer(numleds * stride);
        strip.start = 0;
        strip._length = numleds;
        strip._mode = mode;
        strip._matrixWidth = 0;
        strip.setBrightness(255)
        strip.setPin(pin)
        return strip;
    }

    /**
     * Converts red, green, blue channels into a RGB color
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% weight=1
    //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
    //% advanced=true
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% weight=2 blockGap=8
    //% blockId="neopixel_colors" block="%color"
    //% advanced=true
    export function colors(color: NeoPixelColors): number {
        return color;
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converts a hue saturation luminosity value into a RGB color
     * @param h hue from 0 to 360
     * @param s saturation from 0 to 99
     * @param l luminosity from 0 to 99
     */
    //% blockId=neopixelHSL block="hue %h|saturation %s|luminosity %l"
    export function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }
}

/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"SuperBitV2": "file:../pxt-SuperBitV2"
*/

//% color="#ECA40D" weight=30 icon="\uf135"
namespace SuperBitV2 {

    const PCA9685_ADD = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04

    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09

    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const PRESCALE = 0xFE

    const STP_CHA_L = 2047
    const STP_CHA_H = 4095

    const STP_CHB_L = 1
    const STP_CHB_H = 2047

    const STP_CHC_L = 1023
    const STP_CHC_H = 3071

    const STP_CHD_L = 3071
    const STP_CHD_H = 1023

    let initialized = false
    let yahStrip: neopixel.Strip;

   
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
    

    
    export enum enSteppers {
        B1 = 0x1,
        B2 = 0x2
    }
    export enum enPos { 
        //% blockId="forward" block="forward"
        forward = 1,
        //% blockId="reverse" block="reverse"
        reverse = 2,
        //% blockId="stop" block="stop"
        stop = 3
    }

    export enum enTurns {
        //% blockId="T1B4" block="1/4"
        T1B4 = 90,
        //% blockId="T1B2" block="1/2"
        T1B2 = 180,
        //% blockId="T1B0" block="1"
        T1B0 = 360,
        //% blockId="T2B0" block="2"
        T2B0 = 720,
        //% blockId="T3B0" block="3"
        T3B0 = 1080,
        //% blockId="T4B0" block="4"
        T4B0 = 1440,
        //% blockId="T5B0" block="5"
        T5B0 = 1800
    }
    
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
    export enum enMotors {
        M1 = 8,
        M2 = 10,
        M3 = 12,
        M4 = 14
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }

    function setStepper(index: number, dir: boolean): void {
        if (index == enSteppers.B1) {
            if (dir) {
                setPwm(11, STP_CHA_L, STP_CHA_H);
                setPwm(9, STP_CHB_L, STP_CHB_H);
                setPwm(10, STP_CHC_L, STP_CHC_H);
                setPwm(8, STP_CHD_L, STP_CHD_H);
            } else {
                setPwm(8, STP_CHA_L, STP_CHA_H);
                setPwm(10, STP_CHB_L, STP_CHB_H);
                setPwm(9, STP_CHC_L, STP_CHC_H);
                setPwm(11, STP_CHD_L, STP_CHD_H);
            }
        } else {
            if (dir) {
                setPwm(12, STP_CHA_L, STP_CHA_H);
                setPwm(14, STP_CHB_L, STP_CHB_H);
                setPwm(13, STP_CHC_L, STP_CHC_H);
                setPwm(15, STP_CHD_L, STP_CHD_H);
            } else {
                setPwm(15, STP_CHA_L, STP_CHA_H);
                setPwm(13, STP_CHB_L, STP_CHB_H);
                setPwm(14, STP_CHC_L, STP_CHC_H);
                setPwm(12, STP_CHD_L, STP_CHD_H);
            }
        }
    }

    function stopMotor(index: number) {
        setPwm(index, 0, 0);
        setPwm(index + 1, 0, 0);
    }
    /**
     * *****************************************************************
     * @param index
     */   
    //% blockId=SuperBitV2_RGB_Program block="RGB_Program"
    //% weight=99
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Program(): neopixel.Strip {
         
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P12, 4, NeoPixelMode.RGB);
        }
        return yahStrip;  
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
    
    //% blockId=SuperBitV2_Servo block="Servo(180°)|num %num|value %value"
    //% weight=97
    //% blockGap=10
    //% num.min=1 num.max=4 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo(num: enServo, value: number): void {

        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);

    }

    //% blockId=SuperBitV2_Servo2 block="Servo(270°)|num %num|value %value"
    //% weight=96
    //% blockGap=10
    //% num.min=1 num.max=4 value.min=0 value.max=270
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo2(num: enServo, value: number): void {

        // 50hz: 20,000 us
        let newvalue = Math.map(value, 0, 270, 0, 180);
        let us = (newvalue * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);

    }

    //% blockId=SuperBitV2_Servo3 block="Servo(360°)|num %num|pos %pos|value %value"
    //% weight=96
    //% blockGap=10
    //% num.min=1 num.max=4 value.min=0 value.max=90
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo3(num: enServo, pos: enPos, value: number): void {

        // 50hz: 20,000 us
        
        if (pos == enPos.stop) {
            let us = (86 * 1800 / 180 + 600); // 0.6 ~ 2.4 
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if(pos == enPos.forward){ //0-90 -> 90 - 0
            let us = ((90-value) * 1800 / 180 + 600); // 0.6 ~ 2.4 
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if(pos == enPos.reverse){ //0-90 -> 90 -180  
            let us = ((90+value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }

       

    }

    //% blockId=SuperBitV2_Servo4 block="Servo(360°_rotatable)|num %num|pos %pos|value %value"
    //% weight=96
    //% blockGap=10
    //% num.min=1 num.max=4 value.min=0 value.max=90
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function Servo4(num: enServo, pos: enPos, value: number): void {

        // 50hz: 20,000 us
        
        if (pos == enPos.stop) {
            let us = (110 * 1800 / 180 + 600); // 0.6 ~ 2.4 error:86->110
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if(pos == enPos.forward){ //0-90 -> 90 - 0
            let us = ((110-value) * 1800 / 180 + 600); // 0.6 ~ 2.4 error:90->110
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }
        else if(pos == enPos.reverse){ //0-90 -> 90 -180  error:90->110
            let us = ((110+value) * 1800 / 180 + 600); // 0.6 ~ 2.4
            let pwm = us * 4096 / 20000;
            setPwm(num, 0, pwm);
        }

       

    }
    
   
    //% blockId=SuperBitV2_MotorRun block="Motor|%index|speed(-255~255) %speed"
    //% weight=93
    //% speed.min=-255 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorRun(index: enMotors, speed: number): void {
        if (!initialized) {
            initPCA9685()
        }
        speed = speed * 16; // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= -4096) {
            speed = -4095
        }

        let a = index
        let b = index + 1
        
        if (a > 10)
        {
            if (speed >= 0) {
                setPwm(a, 0, speed)
                setPwm(b, 0, 0)
            } else {
                setPwm(a, 0, 0)
                setPwm(b, 0, -speed)
            }
        }
        else { 
            if (speed >= 0) {
                setPwm(b, 0, speed)
                setPwm(a, 0, 0)
            } else {
                setPwm(b, 0, 0)
                setPwm(a, 0, -speed)
            }
        }
        
    }

    //% blockId=SuperBitV2_MotorRunDual block="Motor|%motor1|speed %speed1|%motor2|speed %speed2"
    //% weight=92
    //% blockGap=50
    //% speed1.min=-255 speed1.max=255
    //% speed2.min=-255 speed2.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=2
    export function MotorRunDual(motor1: enMotors, speed1: number, motor2: enMotors, speed2: number): void {
        MotorRun(motor1, speed1);
        MotorRun(motor2, speed2);
    }

    //% blockId=SuperBitV2_MotorStopAll block="Motor Stop All"
    //% weight=91
    //% blockGap=50
    export function MotorStopAll(): void {
        if (!initialized) {
            initPCA9685()
        }
        
        stopMotor(enMotors.M1);
        stopMotor(enMotors.M2);
        stopMotor(enMotors.M3);
        stopMotor(enMotors.M4);
        
    }

}

//% color="#228B22" weight=25 icon="\uf0b2"
namespace SuperBitV2_Digital {
	
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

	//% blockId="readdht11" block="value of dht11 %dht11type| at pin %value_DNum"
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


    //% blockId=SuperBitV2_Digital_Ultrasonic block="Ultrasonic|pin %value_DNum"
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

    //% blockId=SuperBitV2_Digital_IR block="IR|pin %value_DNum|value %value"
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

    //% blockId=SuperBitV2_Digital_PIR block="PIR|pin %value_DNum|value %value"
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
	
    //% blockId=SuperBitV2_Digital_Collision block="Collision|pin %value_DNum|value %value"
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

    //% blockId=SuperBitV2_Digital_Button block="Button|pin %value_DNum|value %value"
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
    //% blockId=SuperBitV2_Digital_Vibration block="Vibration|pin %value_DNum|get "
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


}

//% color="#C814B8" weight=24 icon="\uf080"
namespace SuperBitV2_Analog {

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

    //% blockId=SuperBitV2_Anaglog_Light block="Light|pin %value_ANum"
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
	
    //% blockId=SuperBitV2_Anaglog_Sound block="Sound|pin %value_ANum"
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
	//% blockId=SuperBitV2_Anaglog_Potentiometer block="Potentiometer|pin %value_ANum"
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
	
    //% blockId=SuperBitV2_Anaglog_Rocker block="Rocker|pin %value_ANum|value %value"
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
	

	

}

//% color="#ECA40D" weight=22 icon="\uf085"
namespace SuperBitV2_PWM {

    export enum enColor {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="Red" block="Red"
        Red,
        //% blockId="Green" block="Green"
        Green,
        //% blockId="Blue" block="Blue"
        Blue,
        //% blockId="White" block="White"
        White,
        //% blockId="Cyan" block="Cyan"
        Cyan,
        //% blockId="Pinkish" block="Pinkish"
        Pinkish,
        //% blockId="Yellow" block="Yellow"
        Yellow
    }

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
    //% blockId=SuperBitV2_PWM_VibrationMot block="Vibration Motor|%value_DNum|speed %speed"
    //% weight=80
    //% blockGap=22
    //% speed.min=0 speed.max=1023
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function VibrationMot(value_DNum: mwDigitalNum, speed: number): void {
		
		let pin;
		if(value_DNum == 1)	{ pin = AnalogPin.P4; }
		else if(value_DNum == 2)	{ pin = AnalogPin.P1; }
		else if(value_DNum == 3)	{ pin = AnalogPin.P0; }
		else if(value_DNum == 4)	{ pin = AnalogPin.P10; }
		else if(value_DNum == 5)	{ pin = AnalogPin.P7; }
		else if(value_DNum == 6)	{ pin = AnalogPin.P5; }
		
        pins.analogWritePin(pin, speed);
    }
	
    //% blockId=SuperBitV2_PWM_RGB block="RGB|(P12P13P14)|value1 %value1|value2 %value2|value3 %value3"
    //% weight=2
    //% blockGap=20
    //% value1.min=0 value1.max=255 value2.min=0 value2.max=255 value3.min=0 value3.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB(value1: number, value2: number, value3: number): void {
		
        pins.analogWritePin(AnalogPin.P13, value1 * 1024 / 256);
        pins.analogWritePin(AnalogPin.P14, value2 * 1024 / 256);
        pins.analogWritePin(AnalogPin.P12, value3 * 1024 / 256);
    }
	
    //% blockId=SuperBitV2_PWM_RGB2 block="RGB|(P12P13P14)|value %value"
    //% weight=1
    //% blockGap=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB2(value: enColor): void {
		let pin1=DigitalPin.P13;
		let pin2=DigitalPin.P14;
		let pin3=DigitalPin.P12;

        switch (value) {
            case enColor.OFF: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Red: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Green: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 0);
                break;
            }
            case enColor.Blue: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.White: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Cyan: {
                pins.digitalWritePin(pin1, 0);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Pinkish: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 0);
                pins.digitalWritePin(pin3, 1);
                break;
            }
            case enColor.Yellow: {
                pins.digitalWritePin(pin1, 1);
                pins.digitalWritePin(pin2, 1);
                pins.digitalWritePin(pin3, 0);
                break;
            }
        }
    }
}

/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from chengengyue
*/


//% color="#0000cd" weight=20 icon="\uf002"
namespace Module_World_Color {

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

    //% blockId=ModuleWorld_Sensor_GetRGBValue block="GetRGBValue|value %value"
    //% blockGap=20
    //% weight=98
    //% color="#0000cd"
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

/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"GHBit": "file:../pxt-ghbit"
*/

//% color="#C814B8" weight=20 icon="\uf11b"
namespace GHBit {

    const PCA9685_ADD = 0x41;
    const MODE1 = 0x00;
    const MODE2 = 0x01;
    const SUBADR1 = 0x02;
    const SUBADR2 = 0x03;
    const SUBADR3 = 0x04;

    const LED0_ON_L = 0x06;
    const LED0_ON_H = 0x07;
    const LED0_OFF_L = 0x08;
    const LED0_OFF_H = 0x09;

    const ALL_LED_ON_L = 0xFA;
    const ALL_LED_ON_H = 0xFB;
    const ALL_LED_OFF_L = 0xFC;
    const ALL_LED_OFF_H = 0xFD;

    const PRESCALE = 0xFE;

    let initialized = false;
    let yahStrip: neopixel.Strip;
    
    export enum STepper {
        //% blockId="Stepper" block="foreward"
        Stepper = 0,
        //% blockId="Stepper0" block="reversal"
        Stepper0,
        //% blockId="Stepper1" block="Stop"
        Stepper1
    }
    export enum Angle {
        //% blockId="Angle0" block="first gear"
        Angle0 = 0,
        //% blockId="Angle1" block="second gear"
        Angle1,
        //% blockId="Angle2" block="third gear"
        Angle2,
        //% blockId="Angle3" block="forth gear"
        Angle3,
        //% blockId="Angle4" block="fifth gear"
        Angle4,
        //% blockId="Angle5" block="sixth gear"
        Angle5,
        //% blockId="Angle6" block="seventh gear"
        Angle6,
        //% blockId="Angle7" block="eighth gear"
        Angle7
    }
    export enum Beamstate {
     	//% blockId="bright" block="Bright"
     	bright = 1,
     	//% blockId="dark" block="Dark"
     	dark
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
    
    export enum enServo {
        
        S1 = 1,
        S2,
        S3,
        S4
    }
    
    export enum Motorshock {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="ON" block="ON"
        ON
    }
    
    export enum speed {
        //% blockId="speed1" block="1"
        speed1 = 2000,
        //% blockId="speed2" block="2"
        speed2 = 3000,
        //% blockId="speed3" block="3"
        speed3 = 4000
    }
    
    export enum enRocker {
        //% blockId="Nostate" block="Nostate"
        Nostate = 0,
        //% blockId="Up" block="Up"
        Up,
        //% blockId="Down" block="Down"
        Down,
        //% blockId="Left" block="Left"
        Left,
        //% blockId="Right" block="Right"
        Right,
        //% blockId="Press" block="Press"
        Press
    }
    
    export enum enButtonState {
        //% blockId="Press" block="Press"
        Press = 0,
        //% blockId="Realse" block="Realse"
        Realse = 1
    }
    
    export enum enButton {
        
        B1 = 0,
        B2,
        B3,
        B4
    }
    
    export enum enColor {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="RED" block="RED"
        RED,
        //% blockId="GREEN" block="GREEN"
        GREEN,
        //% blockId="BLUE" block="BLUE"
        BLUE,
        //% blockId="WHITE" block="WHITE"
        WHITE,
        //% blockId="CYAN" block="CYAN"
        CYAN,
        //% blockId="PINKISH" block="PINKISH"
        PINKISH,
        //% blockId="YELLOW" block="YELLOW"
        YELLOW
    }
    
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1);
        buf[0] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00);
        setFreq(50);
        initialized = true;
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }

    /**
     * *****************************************************************
     * @param index
     */
    
    //% blockId=GHBit_RGB_Program block="RGB_Program"
    //% weight=99
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Program(): neopixel.Strip {
         
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P4, 4, NeoPixelMode.RGB);
        }
        return yahStrip;  
    }  
       
    //% blockId=GHBit_RGB_Program_Close block="RGB_Program_Close"
    //% weight=98
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function RGB_Program_Close(): void {
        pins.digitalWritePin(DigitalPin.P4, 0);
        GHBit.RGB_Program().clear();
        GHBit.RGB_Program().show();
    }
    
    //% blockId=GHBit_Min_Motor_Shake block="Min_Motor_Shake|value %value"
    //% weight=97
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Min_Motor_Shake(value: Motorshock): void {
        switch (value) {
            case Motorshock.ON: {
              setPwm(0, 0, 4095);
              break;
            }
            case Motorshock.OFF: {
              setPwm(0, 0, 0);
              break;
            }
        }               
    }
    
    //% blockId=GHBit_Rocker block="Rocker|value %value"
    //% weight=96
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Rocker(value: enRocker): boolean {

        pins.setPull(DigitalPin.P8, PinPullMode.PullUp);
        let x = pins.analogReadPin(AnalogPin.P1);
        let y = pins.analogReadPin(AnalogPin.P2);
        let z = pins.digitalReadPin(DigitalPin.P8);
        let now_state = enRocker.Nostate;

        if (x < 200) // 上
        {

            now_state = enRocker.Up;

        }
        else if (x > 730) //下 900 -> 730
        {

            now_state = enRocker.Down;
        }
        else  // 左右
        {
            if (y < 200) //右
            {
                now_state = enRocker.Right;
            }
            else if (y > 730) //左 900 -> 730
            {
                now_state = enRocker.Left;
            }
        }
        if (z == 0)
            now_state = enRocker.Press;
        if (now_state == value)
            return true;
        else
            return false;

    }
    
    //% blockId=GHBit_Button block="Button|num %num|value %value"
    //% weight=95
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Button(num: enButton, value: enButtonState): boolean {
         let temp = false;
         switch (num) {
            case enButton.B1: {
              pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P13) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
            case enButton.B2: {
              pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P14) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
            case enButton.B3: {
              pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P15) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
            case enButton.B4: {
              pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P16) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
        }
        return temp;         
    }
    

    
    //% blockId=GHBit_Music_Handle block="Music_Handle|%index"
    //% weight=92
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music_Handle(index: enMusic): void {
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
    
    //% blockId=GHBit_Servo_Handle block="Servo_Handle|num %num|value %value"
    //% weight=91
    //% blockGap=10
    //% color="#C814B8"
    //% num.min=1 num.max=4 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function Servo_Handle(num: enServo, value: number): void {

        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num + 8, 0, pwm);

    }
        
    //% blockId=GHBit_Ultrasonic_Handle block="ultrasonic return distance(cm)"
    //% color="#C814B8"
    //% weight=90
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Handle(): number {

      // send pulse
      pins.setPull(DigitalPin.P12, PinPullMode.PullNone)
      pins.digitalWritePin(DigitalPin.P12, 0)
      control.waitMicros(4)
      pins.digitalWritePin(DigitalPin.P12, 1)
      control.waitMicros(15)
      pins.digitalWritePin(DigitalPin.P12, 0)
      const d = pins.pulseIn(DigitalPin.P11, PulseValue.High, 500 * 40);
      return Math.idiv(d, 40)
    }

    //% blockId=GHBit_Ultrasonic_Handle_V2 block="ultrasonic_V2 return distance(cm)"
    //% color="#C814B8"
    //% weight=90
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Handle_V2(): number {

      // send pulse
      pins.setPull(DigitalPin.P12, PinPullMode.PullNone)
      pins.digitalWritePin(DigitalPin.P12, 0)
      control.waitMicros(4)
      pins.digitalWritePin(DigitalPin.P12, 1)
      control.waitMicros(15)
      pins.digitalWritePin(DigitalPin.P12, 0)
      const d = pins.pulseIn(DigitalPin.P11, PulseValue.High, 500 * 58);
      return Math.idiv(d, 58)
    }

    //% blockId=GHBit_RGB_Colorful block="RGB_Colorful|%value"
    //% weight=89
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Colorful(value: enColor): void {
        switch (value) {
            case enColor.OFF: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 0);
              setPwm(13, 0, 0);
              break;
            }
            case enColor.RED: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 0);
              setPwm(13, 0, 0);
              break;
            }
            case enColor.GREEN: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 0);
              break;
            }
            case enColor.BLUE: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 0);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.WHITE: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.CYAN: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.PINKISH: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 0);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.YELLOW: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 0);
              break;
            }
        }
    }
    
    //% blockId=GHBit_Stepper_Motor block="Stepper_Motor|value %value|value1 %value1"
    //% weight=88
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Stepper_Motor(value: STepper, value1: speed): void {
    	  let a = 64;  
        switch (value) {
            case STepper.Stepper: { 
            	while( a )    
            	{     	             
                setPwm(1, 0, 4095);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 0);
                setPwm(4, 0, 0);
                control.waitMicros(value1);                       
                setPwm(1, 0, 0);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 0);
                control.waitMicros(value1);                         
                setPwm(1, 0, 0);
                setPwm(2, 0, 0);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 4095);
                control.waitMicros(value1);              
                setPwm(1, 0, 4095);
                setPwm(2, 0, 0);
                setPwm(3, 0, 0);
                setPwm(4, 0, 4095);
                control.waitMicros(value1); 
                a--;
              }  
                a = 0;
              break;
            }
            case STepper.Stepper0: {
            	while( a )
            	{ 
                setPwm(1, 0, 0);
                setPwm(2, 0, 0);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 4095);
                control.waitMicros(value1);                       
                setPwm(1, 0, 0);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 0);
                control.waitMicros(value1);                         
                setPwm(1, 0, 4095);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 0);
                setPwm(4, 0, 0);
                control.waitMicros(value1);              
                setPwm(1, 0, 4095);
                setPwm(2, 0, 0);
                setPwm(3, 0, 0);
                setPwm(4, 0, 4095);
                control.waitMicros(value1);  
                 a--;
              }
                a = 0;
              break;
            }
            case STepper.Stepper1: {
              setPwm(1, 0, 0);
              setPwm(2, 0, 0);
              setPwm(3, 0, 0);
              setPwm(4, 0, 0);
              break;
            }               
        } 
    }  
    //% blockId=GHBit_Min_Motor block="Min_Motor|value %value"
    //% weight=87
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Min_Motor(value: Angle): void {
        switch (value) {
            case Angle.Angle0: {
              setPwm(7, 0, 0);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle1: {
              setPwm(7, 0, 600);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle2: {
              setPwm(7, 0, 1200);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle3: {
              setPwm(7, 0, 1800);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle4: {
              setPwm(7, 0, 2400);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle5: {
              setPwm(7, 0, 3000);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle6: {
              setPwm(7, 0, 3600);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle7: {
              setPwm(7, 0, 4095);
              setPwm(8, 0, 0);
              break;
            }
        }               
    }   
    //% blockId=GHBit_Rotate block="Rotate|value %value"
    //% weight=86
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Rotate(value: Angle): boolean {

        let y = pins.analogReadPin(AnalogPin.P3);
        let a = false;
        switch (value) {
        	case Angle.Angle0: {
        		if(y < 128)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle1: {
        		if(y < 254 && y > 127)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle2: {
        		if(y < 381 && y > 253)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle3: {
        		if(y < 508 && y > 381)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle4: {
        		if(y < 635 && y > 508)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle5: {
        		if(y < 762 && y > 634)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle6: {
        		if(y < 889 && y > 761)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle7: {
        		if( y > 888)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
        }
        return a;
    }
    
    //% blockId=GHBit_Beam block="Beam|value %value"
    //% weight=85
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Beam(value: Beamstate): boolean {

        pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
        let x = pins.analogReadPin(AnalogPin.P10);
        if (x < 700) // 亮
        {
            if(value==Beamstate.bright){
            	return true;
            	}
            else{
            	
            	return false;
                }
        }
        else{
        
        	 if(value==Beamstate.dark){
            	return true;
            	}
            else{
            	return false;
            }
        }
    }
    
    
}

/*
Copyright (C): 2010-2019, Shenzhen Yahboom Tech
modified from liusen
load dependency
"GHBit": "file:../pxt-ghbit"
*/

//% color="#C814B8" weight=20 icon="\uf11b"
namespace GHBit {

    const PCA9685_ADD = 0x41;
    const MODE1 = 0x00;
    const MODE2 = 0x01;
    const SUBADR1 = 0x02;
    const SUBADR2 = 0x03;
    const SUBADR3 = 0x04;

    const LED0_ON_L = 0x06;
    const LED0_ON_H = 0x07;
    const LED0_OFF_L = 0x08;
    const LED0_OFF_H = 0x09;

    const ALL_LED_ON_L = 0xFA;
    const ALL_LED_ON_H = 0xFB;
    const ALL_LED_OFF_L = 0xFC;
    const ALL_LED_OFF_H = 0xFD;

    const PRESCALE = 0xFE;

    let initialized = false;
    let yahStrip: neopixel.Strip;
    
    export enum STepper {
        //% blockId="Stepper" block="foreward"
        Stepper = 0,
        //% blockId="Stepper0" block="reversal"
        Stepper0,
        //% blockId="Stepper1" block="Stop"
        Stepper1
    }
    export enum Angle {
        //% blockId="Angle0" block="first gear"
        Angle0 = 0,
        //% blockId="Angle1" block="second gear"
        Angle1,
        //% blockId="Angle2" block="third gear"
        Angle2,
        //% blockId="Angle3" block="forth gear"
        Angle3,
        //% blockId="Angle4" block="fifth gear"
        Angle4,
        //% blockId="Angle5" block="sixth gear"
        Angle5,
        //% blockId="Angle6" block="seventh gear"
        Angle6,
        //% blockId="Angle7" block="eighth gear"
        Angle7
    }
    export enum Beamstate {
     	//% blockId="bright" block="Bright"
     	bright = 1,
     	//% blockId="dark" block="Dark"
     	dark
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
    
    export enum enServo {
        
        S1 = 1,
        S2,
        S3,
        S4
    }
    
    export enum Motorshock {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="ON" block="ON"
        ON
    }
    
    export enum speed {
        //% blockId="speed1" block="1"
        speed1 = 2000,
        //% blockId="speed2" block="2"
        speed2 = 3000,
        //% blockId="speed3" block="3"
        speed3 = 4000
    }
    
    export enum enRocker {
        //% blockId="Nostate" block="Nostate"
        Nostate = 0,
        //% blockId="Up" block="Up"
        Up,
        //% blockId="Down" block="Down"
        Down,
        //% blockId="Left" block="Left"
        Left,
        //% blockId="Right" block="Right"
        Right,
        //% blockId="Press" block="Press"
        Press
    }
    
    export enum enButtonState {
        //% blockId="Press" block="Press"
        Press = 0,
        //% blockId="Realse" block="Realse"
        Realse = 1
    }
    
    export enum enButton {
        
        B1 = 0,
        B2,
        B3,
        B4
    }
    
    export enum enColor {
        //% blockId="OFF" block="OFF"
        OFF = 0,
        //% blockId="RED" block="RED"
        RED,
        //% blockId="GREEN" block="GREEN"
        GREEN,
        //% blockId="BLUE" block="BLUE"
        BLUE,
        //% blockId="WHITE" block="WHITE"
        WHITE,
        //% blockId="CYAN" block="CYAN"
        CYAN,
        //% blockId="PINKISH" block="PINKISH"
        PINKISH,
        //% blockId="YELLOW" block="YELLOW"
        YELLOW
    }
    
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1);
        buf[0] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00);
        setFreq(50);
        initialized = true;
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }

    /**
     * *****************************************************************
     * @param index
     */
    
    //% blockId=GHBit_RGB_Program block="RGB_Program"
    //% weight=99
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Program(): neopixel.Strip {
         
        if (!yahStrip) {
            yahStrip = neopixel.create(DigitalPin.P4, 4, NeoPixelMode.RGB);
        }
        return yahStrip;  
    }  
       
    //% blockId=GHBit_RGB_Program_Close block="RGB_Program_Close"
    //% weight=98
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function RGB_Program_Close(): void {
        pins.digitalWritePin(DigitalPin.P4, 0);
        GHBit.RGB_Program().clear();
        GHBit.RGB_Program().show();
    }
    
    //% blockId=GHBit_Min_Motor_Shake block="Min_Motor_Shake|value %value"
    //% weight=97
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Min_Motor_Shake(value: Motorshock): void {
        switch (value) {
            case Motorshock.ON: {
              setPwm(0, 0, 4095);
              break;
            }
            case Motorshock.OFF: {
              setPwm(0, 0, 0);
              break;
            }
        }               
    }
    
    //% blockId=GHBit_Rocker block="Rocker|value %value"
    //% weight=96
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Rocker(value: enRocker): boolean {

        pins.setPull(DigitalPin.P8, PinPullMode.PullUp);
        let x = pins.analogReadPin(AnalogPin.P1);
        let y = pins.analogReadPin(AnalogPin.P2);
        let z = pins.digitalReadPin(DigitalPin.P8);
        let now_state = enRocker.Nostate;

        if (x < 200) // 上
        {

            now_state = enRocker.Up;

        }
        else if (x > 730) //下 900 -> 730
        {

            now_state = enRocker.Down;
        }
        else  // 左右
        {
            if (y < 200) //右
            {
                now_state = enRocker.Right;
            }
            else if (y > 730) //左 900 -> 730
            {
                now_state = enRocker.Left;
            }
        }
        if (z == 0)
            now_state = enRocker.Press;
        if (now_state == value)
            return true;
        else
            return false;

    }
    
    //% blockId=GHBit_Button block="Button|num %num|value %value"
    //% weight=95
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function Button(num: enButton, value: enButtonState): boolean {
         let temp = false;
         switch (num) {
            case enButton.B1: {
              pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P13) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
            case enButton.B2: {
              pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P14) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
            case enButton.B3: {
              pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P15) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
            case enButton.B4: {
              pins.setPull(DigitalPin.P16, PinPullMode.PullUp);
              if (pins.digitalReadPin(DigitalPin.P16) == value) {
                temp = true;
              }
              else {
                temp = false;
              }
              break;
            }
        }
        return temp;         
    }
    

    
    //% blockId=GHBit_Music_Handle block="Music_Handle|%index"
    //% weight=92
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music_Handle(index: enMusic): void {
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
    
    //% blockId=GHBit_Servo_Handle block="Servo_Handle|num %num|value %value"
    //% weight=91
    //% blockGap=10
    //% color="#C814B8"
    //% num.min=1 num.max=4 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function Servo_Handle(num: enServo, value: number): void {

        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num + 8, 0, pwm);

    }
        
    //% blockId=GHBit_Ultrasonic_Handle block="ultrasonic return distance(cm)"
    //% color="#C814B8"
    //% weight=90
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Handle(): number {

      // send pulse
      pins.setPull(DigitalPin.P12, PinPullMode.PullNone)
      pins.digitalWritePin(DigitalPin.P12, 0)
      control.waitMicros(4)
      pins.digitalWritePin(DigitalPin.P12, 1)
      control.waitMicros(15)
      pins.digitalWritePin(DigitalPin.P12, 0)
      const d = pins.pulseIn(DigitalPin.P11, PulseValue.High, 500 * 40);
      return Math.idiv(d, 40)
    }

    //% blockId=GHBit_Ultrasonic_Handle_V2 block="ultrasonic_V2 return distance(cm)"
    //% color="#C814B8"
    //% weight=90
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Handle_V2(): number {

      // send pulse
      pins.setPull(DigitalPin.P12, PinPullMode.PullNone)
      pins.digitalWritePin(DigitalPin.P12, 0)
      control.waitMicros(4)
      pins.digitalWritePin(DigitalPin.P12, 1)
      control.waitMicros(15)
      pins.digitalWritePin(DigitalPin.P12, 0)
      const d = pins.pulseIn(DigitalPin.P11, PulseValue.High, 500 * 58);
      return Math.idiv(d, 58)
    }

    //% blockId=GHBit_RGB_Colorful block="RGB_Colorful|%value"
    //% weight=89
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Colorful(value: enColor): void {
        switch (value) {
            case enColor.OFF: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 0);
              setPwm(13, 0, 0);
              break;
            }
            case enColor.RED: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 0);
              setPwm(13, 0, 0);
              break;
            }
            case enColor.GREEN: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 0);
              break;
            }
            case enColor.BLUE: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 0);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.WHITE: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.CYAN: {
              setPwm(15, 0, 0);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.PINKISH: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 0);
              setPwm(13, 0, 4095);
              break;
            }
            case enColor.YELLOW: {
              setPwm(15, 0, 4095);
              setPwm(14, 0, 4095);
              setPwm(13, 0, 0);
              break;
            }
        }
    }
    
    //% blockId=GHBit_Stepper_Motor block="Stepper_Motor|value %value|value1 %value1"
    //% weight=88
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Stepper_Motor(value: STepper, value1: speed): void {
    	  let a = 64;  
        switch (value) {
            case STepper.Stepper: { 
            	while( a )    
            	{     	             
                setPwm(1, 0, 4095);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 0);
                setPwm(4, 0, 0);
                control.waitMicros(value1);                       
                setPwm(1, 0, 0);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 0);
                control.waitMicros(value1);                         
                setPwm(1, 0, 0);
                setPwm(2, 0, 0);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 4095);
                control.waitMicros(value1);              
                setPwm(1, 0, 4095);
                setPwm(2, 0, 0);
                setPwm(3, 0, 0);
                setPwm(4, 0, 4095);
                control.waitMicros(value1); 
                a--;
              }  
                a = 0;
              break;
            }
            case STepper.Stepper0: {
            	while( a )
            	{ 
                setPwm(1, 0, 0);
                setPwm(2, 0, 0);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 4095);
                control.waitMicros(value1);                       
                setPwm(1, 0, 0);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 4095);
                setPwm(4, 0, 0);
                control.waitMicros(value1);                         
                setPwm(1, 0, 4095);
                setPwm(2, 0, 4095);
                setPwm(3, 0, 0);
                setPwm(4, 0, 0);
                control.waitMicros(value1);              
                setPwm(1, 0, 4095);
                setPwm(2, 0, 0);
                setPwm(3, 0, 0);
                setPwm(4, 0, 4095);
                control.waitMicros(value1);  
                 a--;
              }
                a = 0;
              break;
            }
            case STepper.Stepper1: {
              setPwm(1, 0, 0);
              setPwm(2, 0, 0);
              setPwm(3, 0, 0);
              setPwm(4, 0, 0);
              break;
            }               
        } 
    }  
    //% blockId=GHBit_Min_Motor block="Min_Motor|value %value"
    //% weight=87
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Min_Motor(value: Angle): void {
        switch (value) {
            case Angle.Angle0: {
              setPwm(7, 0, 0);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle1: {
              setPwm(7, 0, 600);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle2: {
              setPwm(7, 0, 1200);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle3: {
              setPwm(7, 0, 1800);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle4: {
              setPwm(7, 0, 2400);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle5: {
              setPwm(7, 0, 3000);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle6: {
              setPwm(7, 0, 3600);
              setPwm(8, 0, 0);
              break;
            }
            case Angle.Angle7: {
              setPwm(7, 0, 4095);
              setPwm(8, 0, 0);
              break;
            }
        }               
    }   
    //% blockId=GHBit_Rotate block="Rotate|value %value"
    //% weight=86
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Rotate(value: Angle): boolean {

        let y = pins.analogReadPin(AnalogPin.P3);
        let a = false;
        switch (value) {
        	case Angle.Angle0: {
        		if(y < 128)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle1: {
        		if(y < 254 && y > 127)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle2: {
        		if(y < 381 && y > 253)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle3: {
        		if(y < 508 && y > 381)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle4: {
        		if(y < 635 && y > 508)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle5: {
        		if(y < 762 && y > 634)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle6: {
        		if(y < 889 && y > 761)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
          case Angle.Angle7: {
        		if( y > 888)
        	  	a = true;
        		else 
        			a = false;
        		 break;
          }
        }
        return a;
    }
    
    //% blockId=GHBit_Beam block="Beam|value %value"
    //% weight=85
    //% blockGap=10
    //% color="#C814B8"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=6
    export function Beam(value: Beamstate): boolean {

        pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
        let x = pins.analogReadPin(AnalogPin.P10);
        if (x < 700) // 亮
        {
            if(value==Beamstate.bright){
            	return true;
            	}
            else{
            	
            	return false;
                }
        }
        else{
        
        	 if(value==Beamstate.dark){
            	return true;
            	}
            else{
            	return false;
            }
        }
    }
    
    
}
