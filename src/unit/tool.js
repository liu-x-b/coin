import big from "big.js";
big.NE = -40
big.PE = 40

export function NumSplic(val,len) {
    var f = parseFloat(val);
    if (isNaN(f)) {
        return false;
    }
    var s=val.toString();
    if(s.indexOf(".")>0){
        let f = s.split(".")[1].substring(0,len)
        s=s.split(".")[0]+"."+f
    }
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + len) {
        s += '0';
    }
    return s;
}

export function scale(val) { 
    let name = ""
    let s;
    if(val == 0 || val == null) { 
        name = " K"
        s = 0 + name
    }else if(val >= 1000000000) { // 十亿
        name = " B"
        s = big(NumSplic(big(val).div(1000000000).toString(),6)).times(1000000).div(1000000).toString() + name
    }else if(val >= 1000000){ // 百万
        name = " M"
        s = big(NumSplic(big(val).div(1000000).toString(),6)).times(1000000).div(1000000).toString() + name
    }else { 
        name = " K"
        s = big(NumSplic(big(val).div(1000).toString(),6)).times(1000000).div(1000000).toString() + name
    }
    return s;
}
