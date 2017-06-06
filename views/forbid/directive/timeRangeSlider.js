define(['angularAMD'], function (angularAMD, factory) {
    angularAMD.directive("timeRangeSlider", ["$q", "UtilService", "$timeout", function ($q, UtilService, $timeout) {
        return {
            restrict: 'AE',
            scope: { tInstance: "=", rangeList: "=", options: "=" ,loaded:"=?"},
            templateUrl: 'views/forbid/directive/timeRangeSlider.html',
            link: function (scope, $element, $attr) {
                window._scope = scope;
                scope._info = {
                    format: "H",
                    subMarkNum: 5,
                    markNum: 25,
                    splitNum: 1,
                    boxLeft: 8,
                    scale: 2,
                    pointAtScale: true
                }
                if (scope.options) {
                    $.extend(scope._info, scope.options);
                }

                

                if (!scope._info.markNum) {
                    scope._info.markNum = 5;
                }
                scope.formatTimeFromTimeSeconds = function (theTimeSeconds, format) {
                    var theFormat = format || scope._info.format || "H";
                    var timeString = new moment({ hour: 0, minute: 0, seconds: 0 }).seconds(theTimeSeconds).format(theFormat);
                    var zeroString = new moment({ hour: 0, minute: 0, seconds: 0 }).seconds(0).format(theFormat);
                    if (timeString == zeroString && theTimeSeconds != 0) {
                        timeString = format ? "24:00" : "24";
                    }
                    return timeString;
                }

                // scope.formatTimeFromTimeSeconds = function (value) {
                //     if (!value) { value = 0; }
                //     if (typeof value == "string") {
                //         value = parseInt(value);
                //     }
                //     if (!isFinite(value)) {
                //         console.error(value)
                //         console.error("value is not a valid number");
                //         return false;
                //     }
                //     var second = value % 60;
                //     var minite = parseInt(value / 60);
                //     return minite + ":" + second;
                // }
                scope._jControl = $element.find(".time-range-slider-bg");
                scope._jBox = $element.find(".time-range-slider-box");
                scope._jSliderLine = $element.find(".works-slider-line");
                var jTimeLabel = $element.find(".works-silder-timeLabel");
                scope._startTimeSeconds = 0;
                scope._endTimeSeconds = 24 * 60 * 60;
                scope._totalSeconds = scope._endTimeSeconds - scope._startTimeSeconds;
                scope._jMask = $element.find(".time-range-slider-mask");
                var sliderWidth, scaleWidth, isEnter;
                scope.markList = [];
                scope.markPosList = [];
                if (!scope.rangeList) {
                    scope.rangeList = []
                }
                if (!scope.tInstance) {
                    scope.tInstance = {};
                }

                scope.createRange = function (startX, endX) {
                    var rangeData = {};
                    var sliderWidth = scope._jControl.outerWidth();
                    var jRangePart = $("<div class='time-range-slider-range'><div class='time-range-slider-end'></div><div class='time-range-slider-end point2'></div><div>");
                    var time0 = -1, time1 = -1;
                    if (startX || startX === 0) {
                        time0 = Math.round(scope._totalSeconds * startX / sliderWidth);
                        jRangePart.css("left", startX);
                        rangeData["startTime"] = scope.formatTimeFromTimeSeconds(time0, "HH:mm");
                        rangeData["startX"] = startX;
                    }
                    if (endX || endX === 0) {
                        time1 = Math.round(scope._totalSeconds * endX / sliderWidth);
                        var delta = Math.abs(endX - startX);
                        jRangePart.css("width", delta);
                        rangeData["endTime"] = scope.formatTimeFromTimeSeconds(time1, "HH:mm");
                        rangeData["endX"] = endX;
                    }
                    scope._jControl.append(jRangePart);
                    rangeData._jControl = jRangePart;
                    rangeData.remove = function () {
                        var index = scope.rangeList.indexOf(rangeData);
                        if (index >= 0) {
                            scope.rangeList.splice(index, 1);
                        }
                        rangeData._jControl.remove();
                    }

                    rangeData.setEnd = function (endX) {
                        // if (endX || endX == 0) {
                        time1 = Math.round(scope._totalSeconds * endX / sliderWidth);
                        var delta = Math.abs(endX - startX);
                        jRangePart.css("width", delta);
                        rangeData["endTime"] = scope.formatTimeFromTimeSeconds(time1);
                        rangeData["endX"] = endX;
                        if (rangeData.endX < rangeData.startX) {
                            // console.log("end:" + rangeData.endX + "time:" + rangeData.endTime);
                            // console.log("start:" + rangeData.startX + "time:" + rangeData.startTime)
                            jRangePart.css("left", rangeData.endX);
                        }

                        // }
                    }
                    rangeData.updateData = function () {
                        if ((rangeData.startX || rangeData.startX === 0) && (rangeData.endX || rangeData.endX === 0)) {
                            if (rangeData.endX < rangeData.startX) {
                                var tempX = rangeData.endX;
                                rangeData.endX = rangeData.startX;
                                rangeData.startX = tempX;
                            }
                            rangeData.startTime = scope.formatTimeFromTimeSeconds(Math.round(scope._totalSeconds * rangeData.startX / sliderWidth), "HH:mm");
                            rangeData.endTime = scope.formatTimeFromTimeSeconds(Math.round(scope._totalSeconds * rangeData.endX / sliderWidth), "HH:mm");
                            jRangePart.css("left", rangeData.startX);
                            jRangePart.css("width", rangeData.endX - rangeData.startX);
                        }
                    }

                    return rangeData;
                }

                scope.tInstance.createRangeByTime = function (startTime, endTime) {
                    if ((!startTime && startTime != 0) || (!endTime && endTime != 0)) {
                        console.error("startTime and endTime can not be null");
                        return false;
                    }
                
                    if (typeof startTime == "string") {
                        // 如果为string，则先格式化成为秒
                        startTime = new moment(startTime, "HH:mm").diff(new moment({ hour: 0, minute: 0, seconds: 0 }), "second");
                        endTime = new moment(endTime, "HH:mm").diff(new moment({ hour: 0, minute: 0, seconds: 0 }), "second");
                    }

                    var sliderWidth = scope._jControl.outerWidth();
                    var startX = startTime / scope._totalSeconds * sliderWidth;
                    var endX = endTime / scope._totalSeconds * sliderWidth;
                    
                    scope.rangeList.push(scope.createRange(startX, endX));

                }

                for (var i = 0; i < scope._info.markNum; i++) {
                    var leftValue = i / (scope._info.markNum - 1);
                    var left = 100.0 * leftValue + "%";
                    var timeString;
                    var offset;
                    var theTimeSeconds = i / (scope._info.markNum - 1) * scope._totalSeconds + scope._startTimeSeconds;
                    timeString = scope.formatTimeFromTimeSeconds(theTimeSeconds);
                    // var jMark = $('<div class="time-range-slider-mark" style="-webkit-user-select: none;left:' + left + ';margin-left:'+timeString.length>1?'-1em':'-0.5em'+'">');
                    var jMark = $('<div class="time-range-slider-mark" style="left:' + left + ';">');
                    scope._jControl.append(jMark);
                    scope.markList.push(jMark);
                    scope.markPosList.push(left);
                    if (scope._info.subMarkNum && (i < scope._info.markNum - 1)) {
                        var total = (scope._info.markNum - 1) * scope._info.subMarkNum;
                        for (var j = 1; j < scope._info.subMarkNum; j++) {
                            var subLeft = 100.0 * (i * scope._info.subMarkNum + j) / total + "%";
                            var jSubMark = $('<div class="time-range-slider-submark" style="left:' + subLeft + ';">');
                            scope._jControl.append(jSubMark);
                        }
                    }
                    if (i % scope._info.splitNum == 0 || i == scope._info.markNum - 1) {
                        var jMarkLabel = $('<span class="time-range-slider-label" style="left:' + left + '">' + timeString + '</span>');
                        var mgleftValue = -(timeString.length * 3);
                        if (timeString.length > 1) {
                            jMarkLabel.css("margin-left", mgleftValue + "px");
                        }
                        else {
                            jMarkLabel.css("margin-left", mgleftValue + "px");
                        }
                        scope._jControl.append(jMarkLabel);
                    }
                }

                var jPointer = scope._jControl.find(".time-range-slider-pointer");
                scope._jPointer = jPointer;
                var jTip = jPointer.find(".time-range-slider-tip");
                scope._jControl.append(jPointer);
                // jPointer.hide();
                var drawing = false;
                function setPointerPos(pos) {

                    pos = pos - scope._info.boxLeft;

                    if (scope._info.pointAtScale) {
                        pos = Math.round(pos / scaleWidth) * scaleWidth;
                        // var markIndex = Math.round(pos / scaleWidth);
                        // if (markIndex < 0) {
                        //     markIndex = 0;
                        // }
                        // else if (markIndex > scope.markList.length) {
                        //     markIndex = scope.markList.length;
                        // }
                        // pos = scope.markPosList[markIndex];

                    }
                    if (pos < 0) {
                        pos = 0;
                    }
                    else if (pos > sliderWidth) {
                        pos = sliderWidth;
                    }
                    jPointer.css("left", pos + "px");
                    jPointer.show();
                    scope.currentTime = scope.formatTimeFromTimeSeconds(Math.round(scope._totalSeconds * pos / sliderWidth), "HH:mm");
                    jTip.text(scope.currentTime);
                    return pos;
                }

                scope._jMask.bind("mousemove", function (event) {
                    sliderWidth = scope._jControl.outerWidth();//必须要重新获取
                    scaleWidth = 1.0 * sliderWidth / (scope._info.markNum - 1) / scope._info.scale;// 必须要重新获取
                    isEnter = true;
                    setPointerPos(event.offsetX);
                    // console.log(event.offsetX)
                    // jPointer.show();
                });

                scope._jMask.bind("mousedown", function (event) {
                    if (typeof scope._info.beginDrag === 'function') {//在滑动区域鼠标点击事件
                        scope._info.beginDrag(event);
                    }


                    if (scope._info.maxRangeNum && scope.rangeList.length >= scope._info.maxRangeNum) {
                        UtilService.toastError("最多只能画" + scope._info.maxRangeNum + "个时间段！");
                        return false;
                    }
                    if (event.stopPropagation) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    var startX = event.offsetX;

                    var endX;
                    if (!startX) {
                        startX = 0;
                    }
                    startX = setPointerPos(startX);

                    var draggingDiv = function (event) {
                        if (event.stopPropagation) {
                            event.stopPropagation();
                            event.preventDefault();
                        }


                        // console.log(scope._jControl)
                        //是否被拖拽
                        // if (event.target == scope._jControl.get(0) || event.target == scope._jMask.get(0) || event.target == scope._jBox.get(0)) {
                        // console.log(event.offsetX)
                        endX = setPointerPos(event.offsetX);
                        // console.log(endX)
                        rangeData.setEnd(endX);
                        // }
                        // console.log(endX);

                        // if (rangeData) {
                        //     rangeData.setEnd(1.0 * stopX / sliderWidth);
                        // }
                    };
                    var droppedDiv = function (event) {
                        $(document).unbind('mousemove', draggingDiv);
                        $(document).unbind('mouseup', droppedDiv);
                        if (rangeData.startX == rangeData.endX || (!rangeData.endX && rangeData.endX != 0)) {
                            //原地
                            rangeData._jControl.remove();

                        }
                        else {

                            rangeData.updateData();
                            var leftIndex = -1;
                            var rightIndex = -1;
                            var isContain = false;
                            var containIndexList = [];

                            for (var i = 0; i < scope.rangeList.length; i++) {
                                if (scope.rangeList[i].startX <= rangeData.startX && scope.rangeList[i].endX >= rangeData.endX) {
                                    //在已有的范围里面，直接中断操作
                                    isContain = true;
                                    break;

                                }

                                if (scope.rangeList[i].startX <= rangeData.startX && scope.rangeList[i].endX >= rangeData.startX) {
                                    scope.rangeList[i].endX = scope.rangeList[i].endX > rangeData.endX ? scope.rangeList[i].endX : rangeData.endX;
                                    scope.rangeList[i].updateData();
                                    leftIndex = i;
                                }
                                if (scope.rangeList[i].startX <= rangeData.endX && scope.rangeList[i].endX >= rangeData.endX) {
                                    scope.rangeList[i].startX = scope.rangeList[i].startX < rangeData.startX ? scope.rangeList[i].startX : rangeData.startX;
                                    scope.rangeList[i].updateData();
                                    rightIndex = i;
                                }
                                if (scope.rangeList[i].startX > rangeData.startX && scope.rangeList[i].endX < rangeData.endX) {
                                    // scope.rangeList[i].startX = rangeData.startX;
                                    // scope.rangeList[i].endX = rangeData.endX;
                                    // scope.rangeList[i].updateData();
                                    containIndexList.push(scope.rangeList[i]);

                                }

                            }
                            console.log(scope.rangeList)
                            if (leftIndex == -1 && rightIndex == -1 && !isContain) {
                                scope.rangeList.push(rangeData);
                            }
                            else {
                                rangeData.remove();
                                if (leftIndex !== -1 && rightIndex !== -1 && leftIndex !== rightIndex) {
                                    if (scope.rangeList[leftIndex].startX <= scope.rangeList[rightIndex].startX && scope.rangeList[leftIndex].endX >= scope.rangeList[rightIndex].startX) {
                                        scope.rangeList[leftIndex].endX = scope.rangeList[leftIndex].endX > scope.rangeList[rightIndex].endX ? scope.rangeList[leftIndex].endX : scope.rangeList[rightIndex].endX;
                                        scope.rangeList[leftIndex].updateData();
                                        scope.rangeList[rightIndex].remove();
                                    }
                                }
                            }

                            for (var i = 0; i < containIndexList.length; i++) {
                                containIndexList[i].remove();
                            }
                        }
                        drawing = false;
                        // isDragged = false;
                        // if (!isEnter) {
                        //     jPointer.hide();
                        //     jTimeLabel.hide();
                        // }
                        // if (rangeData) {
                        //     if (stopX > startX) {
                        //         var range = new works.Range(self._getTime(startX), self._getTime(stopX));
                        //         for (var i = 0; i < self._rangeList.length; i++) {
                        //             var theRangeObj = self._rangeList[i];
                        //             if (self._info.rangeCanIntersects) {//范围是否能有交集
                        //             } else {
                        //                 if (range.joinRange(theRangeObj.range)) {
                        //                 } else if (range.intersectRange(theRangeObj.range)) {
                        //                     alert("当前范围与已有范围冲突！");
                        //                     rangeData.remove();
                        //                     return;
                        //                 }
                        //             }
                        //         }
                        //         self._rangeList.push(rangeData);
                        //         if (self._info.changeRanges) {
                        //             self._info.changeRanges.call(self, self._rangeList);
                        //         }
                        //     } else {
                        //         rangeData.remove();
                        //     }
                        // }
                    };

                    if (!drawing) {
                        drawing = true;
                        var rangeData = scope.createRange(startX);
                        $(document).bind("mousemove", draggingDiv);
                        $(document).bind("mouseup", droppedDiv);
                    }


                });
                
                if(scope.loaded){
                    scope.loaded.resolve();
                }

            },
            controller: function ($scope, $element) {
                $scope.imgClick = function () {
                    console.log("img");

                }
                $scope._option = {
                    "equalScale": true,
                    "urlName": "thumbUrl",
                    "maskTextName": "areaName"
                }

                if ($scope.options) {
                    $.extend($scope._option, $scope.options)
                }
                $scope.controlClick = function () {
                    console.log("control")
                }

            }
        };
    }]);
});