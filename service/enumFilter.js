define(["angularAMD", "angular", "bootbox"], function (angularAMD, angular, bootbox) {
    // class
    var enumEmpty = function (EnumService) {
        return function (value, enumName) {
            var result = "";
            var iEnum = EnumService.enums[enumName];
            if (iEnum && iEnum._info && iEnum._info.hash && iEnum._info.hash[value]) {
                result = iEnum._info.hash[value];
            }
            return result;
        };
    }
    var enumProto = function (EnumService) {
        return function (value, enumName) {
            var result = value;
            var iEnum = EnumService.enums[enumName];
            if (iEnum && iEnum._info && iEnum._info.hash && iEnum._info.hash[value]) {
                result = iEnum._info.hash[value];
            }
            return result;
        };
    }
    var enumDefault = function (EnumService) {
        return function (value, enumName, defaultValue) {
            var result = defaultValue || "--";
            var iEnum = EnumService.enums[enumName];
            if (iEnum && iEnum._info && iEnum._info.hash && iEnum._info.hash[value]) {
                result = iEnum._info.hash[value];
            }
            return result;
        };
    }

    angularAMD.filter("enumEmpty", ["EnumService", enumEmpty]);
    angularAMD.filter("enumProto", ["EnumService", enumProto]);
    angularAMD.filter("enumDefault", ["EnumService", enumDefault]);
});