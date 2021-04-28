const validata = {
    checkBankCard:function(data){
        let regex = /^(\d{16}|\d{19})$/;
        return regex.test(data);
    },
    checkMobile:function(data){
        let regex = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
        return regex.test(data);
    },
    checkNumFix2:function(data){
        let regex = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/;
        return regex.test(data);
    },
    checkNum:function(data){
        let regex = new RegExp("^[0-9]$"); 
        return regex.test(data);
    },
    checkYouBian:function(data){  //验证邮编
        let regex = new RegExp("[1-9]d{5}(?!d)");
        return regex.test(data);
    },
    checkIdCardField:function(data){  //验证身份证号码
        let reg = /^\d{15}(\d{2}[0-9X])?$/i;
        if (!reg.test(data)) {
            return false;
        }
        if (data.length == 15) {
            var n = new Date();
            var y = n.getFullYear();
            if (parseInt("19" + data.substr(6, 2)) < 1900 || parseInt("19" + data.substr(6, 2)) > y) {
                return false;
            }
            var birth = "19" + data.substr(6, 2) + "-" + data.substr(8, 2) + "-" + data.substr(10, 2);
            if (!isDate(birth)) {
                return false;
            }
        }
        if (data.length == 18) {
            var n = new Date();
            var y = n.getFullYear();
            if (parseInt(data.substr(6, 4)) < 1900 || parseInt(data.substr(6, 4)) > y) {
                return false;
            }
            var birth = data.substr(6, 4) + "-" + data.substr(10, 2) + "-" + data.substr(12, 2);
            if (!isDate(birth)) {
                return false;
            }
            iW = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
            iSum = 0;
            for (i = 0; i < 17; i++) {
                iC = data.charAt(i);
                iVal = parseInt(iC);
                iSum += iVal * iW[i];
            }
            iJYM = iSum % 11;
            if (iJYM == 0) sJYM = "1";
            else if (iJYM == 1) sJYM = "0";
            else if (iJYM == 2) sJYM = "x";
            else if (iJYM == 3) sJYM = "9";
            else if (iJYM == 4) sJYM = "8";
            else if (iJYM == 5) sJYM = "7";
            else if (iJYM == 6) sJYM = "6";
            else if (iJYM == 7) sJYM = "5";
            else if (iJYM == 8) sJYM = "4";
            else if (iJYM == 9) sJYM = "3";
            else if (iJYM == 10) sJYM = "2";
            var cCheck = data.charAt(17).toLowerCase();
            if (cCheck != sJYM) {
                return false;
            }
        }
        return true;
    },
    isDate:function(data){
        let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
        let result = data.match(reg);
        if (result == null) { return false };
        let dt = new Date(result[1], result[3] - 1, result[4]);
        if (Number(dt.getFullYear()) != Number(result[1])) { return false; }
        if (Number(dt.getMonth()) + 1 != Number(result[3])) { return false; }
        if (Number(dt.getDate()) != Number(result[4])) { return false; }
        return true;
    },
    checkNum6To12:function(data){
        let regex = new RegExp("^[0-9]{6}$");
        return regex.test(data);
    },
    checkPwdMin4:function(data){  //至少4位数字字母混合
        if (data.length < 4) {
            return false;
        }
        let reg = /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i;
        return regex.test(data);
    },
    checkWord:function(data){  //过滤非法字符
        let regArray = new Array('*', '|', '/', "@", "\/", "delete", "update", "\\", "\"", "'");
        for (let i = 0; i < regArray.length; i++) {
            if (data.toLowerCase().indexOf(regArray[i].toLowerCase())>-1) {
                return false;
            }
        }
        return true;
    },
    checkEmail:function(data){ // 验证邮箱
        if (data.search(/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/) != -1) {
            return true;
        }
        return false;
    }
}

export default validata;
