"use strict";!function(a){var b={_month:null,_days:null,_controlBoard:null,_render:function(a){function b(a){return"Y"===a?"signed":"not-signed"}var c=["<ul>"],d=this;if(!Array.isArray(a))return!1;for(var e=0;e<this._days;e++){var f="<li class="+b(a[e]&&a[e].isSigned)+">"+(e+1)+"</li>";c.push(f)}c.push("</ul>"),$(".calender ul").remove(),$(".calender").append(c.join("")),$("li").on("click",function(){var a=$(this);a.hasClass("signed")||(a.addClass("signed"),d._setSignedDay(a.text()))})},_setDay:function(){var a=/1|3|5|7|8|10|12/,b=this._month+"";"2"===b?this._days=28:a.test(b)?this._days=31:this._days=30},_setMonth:function(a){this._month=parseInt(a)},_setControlBoard:function(a,b){this._controlBoard=a,"function"==typeof b&&b.call(a,this)},getSignedDaysWithMonth:function(b){var c=this;$.ajax({url:"/server/"+b+".js",data:{uid:1}}).then(function(b){var d=a.JSON?a.JSON.parse(b):a.alert("Your browser is too old!"),e=d&&d[0].status;e&&c._render(e)}).fail(function(){a.alert("network error")})},_setSignedDay:function(a){$.ajax({url:"/setSignedDay",type:"post",data:{uid:123,month:this._month,day:a}})},init:function(a,b,c){this._setMonth(a),this._setDay(),this._setControlBoard(b,c),this.getSignedDaysWithMonth(a)},update:function(a){this._setMonth(a),this._setDay(),this.getSignedDaysWithMonth(a)}},c={_display:$(".control-board p"),_buttonPre:$(".control-board button:first-child"),_buttonNext:$(".control-board button:last-child"),_data:1,_target:null,_update:function(){this._display.text(this._data+"月"),this._target.update&&this._target.update(this._data)},_bindEvents:function(){var a=this;this._buttonPre.off("click").on("click",function(){--a._data?null:a._data=1,a._update()}),this._buttonNext.off("click").on("click",function(){a._data++<12?null:a._data=12,a._update()})},initWithTarget:function(a){this._target=a,this._bindEvents()}};b.init(1,c,c.initWithTarget)}(window);