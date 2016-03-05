'use strict';

(function(w) {

    var calender = {
        // current month
        _month: null,

        // the total counts of day for current month
        _days: null,

        // the control board to choose month
        _controlBoard: null,

        // render the calender
        _render: function(statusList) {
            var tpl = ['<ul>'],
                self = this;

            /* jshint expr: true */
            if (!Array.isArray(statusList)) {return false;}

            function isSinged(st) {
                return st === 'Y' ? 'signed' : 'not-signed';
            }

            for (var i = 0; i < this._days; i++) {
                var cell = '<li class=' + isSinged(statusList[i]&&statusList[i].isSigned)  + '>' + ( i + 1) + '</li>';

                tpl.push(cell);
            }
            tpl.push('</ul>');

            $('.calender ul').remove();
            $('.calender').append(tpl.join(''));

            $('li').on('click', function() {
                var $this = $(this);

                if (!$this.hasClass('signed')) {
                    $this.addClass('signed');
                    self._setSignedDay($this.text());
                }
            });
        },
        _setDay: function() {
            var bigMonth = /1|3|5|7|8|10|12/,
                m = this._month + '';

            /* jshint expr: true */
            m === '2' ?
            this._days = 28 : bigMonth.test(m) ?
                              this._days = 31 : this._days = 30;
        },
        _setMonth: function(m) {
            this._month = parseInt(m);
        },
        _setControlBoard: function(c, bindTargetForControlBoard) {
            this._controlBoard = c;

            /* jshint expr: true */
            typeof bindTargetForControlBoard === 'function' && bindTargetForControlBoard.call(c, this);
        },

        getSignedDaysWithMonth: function(m) {
            var self = this;

            $.ajax({
                url: '/server/' + m + '.js',
                data: {uid: 1},
            }).then(function(res) {
                var data = w.JSON ? w.JSON.parse(res) : w.alert('Your browser is too old!');
                var status = data && (data[0].status);

                /* jshint expr: true */
                status && self._render(status);
            }).fail(function() {
                w.alert('network error');
            });
        },

        // post current user(uid) new signed day to server side(which is not developped)
        _setSignedDay: function(d) {
            $.ajax({
                url: '/setSignedDay',
                type: 'post',
                data: {
                    uid: 123,
                    month: this._month,
                    day: d
                }
            });
        },

        // m: month, c: controlBoard, bind: bind calendar to control board
        init: function(m, c, bind) {
           this._setMonth(m);
           this._setDay();
           this._setControlBoard(c, bind);
           this.getSignedDaysWithMonth(m);
        },
        update: function(m) {
            this._setMonth(m);
            this._setDay();
            this.getSignedDaysWithMonth(m);
        }
    };

    var controlBoard = {
        _display: $('.control-board p'),
        _buttonPre: $('.control-board button:first-child'),
        _buttonNext: $('.control-board button:last-child'),
        _data: 1,
        _target: null,
        _update: function() {
            this._display.text(this._data + '月');
            /* jshint expr: true */
            this._target.update && this._target.update(this._data);
        },
        _bindEvents: function() {
            var self = this;
            this._buttonPre.off('click').on('click', function() {
                /* jshint expr: true */
                --self._data ? null: self._data = 1;
                self._update();
            });
            this._buttonNext.off('click').on('click', function() {
                /* jshint expr: true */
                self._data++ < 12 ? null: self._data = 12;
                self._update();
            });
        },
        initWithTarget: function(o) {
            this._target = o;
            this._bindEvents();
        }
    };

    calender.init(1, controlBoard, controlBoard.initWithTarget);
})(window);
