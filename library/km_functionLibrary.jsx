/**
 * Kyle Harter function library
 * @author kylenmotion@gmail.com
 */


/**
 * @param {string} mainColor 6-digit hex code
 * @return {Object} RGB values from a hex code input 
 */


function hexToRGB(hexValue) {
    var hexTrim = hexValue.trim();
    var hexString = hexTrim;
    var finalHex = hexString.replace(/[#]/g, "");
    var hexColor = "0x" + finalHex;
    var r = hexColor >> 16;
    var g = (hexColor & 0x00ff00) >> 8;
    var b = hexColor & 0xff;

    return [r / 255, g / 255, b / 255]
} 