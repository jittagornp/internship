/**
 * @author jittagorn pitakmetagoon
 * create 24/04/2014
 * source code : http://na5cent.blogspot.com/2014/04/texthighlighter-javascript.html
 */
window.TextHighlighter = window.TextHighlighter || (function() {

    function forEachProperty(obj, callback, ctx_opt) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                var val = callback.call(ctx_opt, obj[prop], prop, obj);
                if (val === false) {
                    return false;
                }
            }
        }

        return true;
    }

    function forEachIndex(array, callback, ctx_opt) {
        var length = array.length;
        for (var i = 0; i < length; i++) {
            var val = callback.call(ctx_opt, array[i], i, array, length);
            if (val === false) {
                return false;
            }
        }

        return true;
    }

    /**
     * @class Strings
     */
    var Strings = {
        
        split: function(text, splitor) {
            var result = [];
            var list = text.split(splitor);
            forEachIndex(list, function(keyword) {
                !!keyword && result.push(keyword);
            });

            return result;
        },
        
        escapse: function(text) {
            return text.replace(/\&/g, '&amp;')
                    .replace(/\>/g, '&gt;')
                    .replace(/\</g, '&lt;');
        }
    };

    function toArray(obj) {
        var array = [];
        forEachProperty(obj, function(value) {
            array.push(value);
        });

        return array;
    }

    function isEquals(a, b) {
        if (a.equals) {
            return a.equals(b);
        }

        return a === b;
    }

    function removeElementInArray(element, array) {
        forEachIndex(array, function(value, index) {
            if (isEquals(element, value)) {
                array.splice(index, 1);
            }
        });
    }

    /**
     * @class Period
     * for keep period information
     */
    var Period = function(start, end) {
        this.start_ = start;
        this.end_ = end;
    };

    Period.prototype.getStart = function() {
        return this.start_;
    };

    Period.prototype.getEnd = function() {
        return this.end_;
    };

    Period.prototype.setStart = function(start) {
        this.start_ = start;
    };

    Period.prototype.setEnd = function(end) {
        this.end_ = end;
    };

    Period.prototype.equals = function(object) {
        if (!(object instanceof Period)) {
            return false;
        }

        if (object.getStart() === this.start_ && object.getEnd() === this.end_) {
            return true;
        }

        return false;
    };

    Period.prototype.toString = function() {
        return 'period {' + this.start_ + ', ' + this.end_ + '}';
    };


    /**
     * @class PeriodIntegrator
     * for integrate period in timeline
     * 
     * document : http://na5cent.blogspot.com/2013/12/integrate-period-algorithm-java.html
     */
    var PeriodIntegrator = function() {

        var periodSet_ = {};
        var periodList_;

        this.addPeriod = function(period) {
            var key = period.toString();
            periodSet_[key] = period;

            return this;
        };

        this.addAllPeriods = function(periodList) {
            forEachIndex(periodList, addPeriod, this);
            return this;
        };

        function sortPeriods() {
            periodList_ = toArray(periodSet_).sort(function(p1, p2) {
                if (p1.getStart() === p2.getStart()) {
                    return p1.getEnd() - p2.getEnd();
                }

                return p1.getStart() - p2.getStart();
            });
        }

        function forEachPeriodIndex(callback) {
            var length = periodList_.length;
            if (length < 2) {
                return;
            }

            for (var i = 1; i < length; i++) {
                callback.call(null, i, length);
            }
        }

        function changeOverlap() {
            forEachPeriodIndex(function(i) {
                var before = periodList_[i - 1];
                var current = periodList_[i];

                if (current.getStart() < before.getEnd()) {
                    current.setStart(before.getEnd());
                }
            });
        }

        function removeIncorrect() {
            forEachPeriodIndex(function(i, length) {
                var periodI = periodList_[i];
                for (var j = i + 1; j < length; j++) {
                    var periodJ = periodList_[j];

                    var isDefined = periodI && periodJ;
                    if (isDefined && (isIncorrect(periodJ) || isSubPeriod(periodJ, periodI))) {
                        removeElementInArray(periodJ, periodList_);
                        length--;
                    }
                }
            });
        }

        function isIncorrect(period) {
            return period.getStart() >= period.getEnd();
        }

        function isSubPeriod(period1, period2) {
            return period1.getStart() >= period2.getStart() && period1.getEnd() <= period2.getEnd();
        }

        function integratePeriods() {
            forEachPeriodIndex(function(i, length) {
                var before = periodList_[i - 1];
                var current = periodList_[i];

                var isDefined = current && before;
                if (isDefined && current.getStart() === before.getEnd()) {
                    current.setStart(before.getStart());
                    removeElementInArray(before, periodList_);
                    i--;
                    length--;
                }
            });
        }

        this.integrate = function() {
            sortPeriods();
            changeOverlap();
            removeIncorrect();
            integratePeriods();

            return periodList_;
        };
    };

    /**
     * @class TextHighlighter
     */
    var TextHighlighter = function(options_opt) {
        options_opt = options_opt || {};

        this.styleClass_ = options_opt.styleClass || 'ns-text-highlighter';
        this.totalHighlight_ = 0;
    };

    /**
     * @private
     */
    TextHighlighter.prototype.wrapKeywordByHighlightBox = function(keyword) {
        return '<span class="' + this.styleClass_ + '">' + keyword + '</span>';
    };

    TextHighlighter.prototype.getTotalHighlight = function() {
        return this.totalHighlight_;
    };

    /**
     * @private
     */
    TextHighlighter.prototype.findPeriodsOfSentenceByKeyword = function(sentence, keyword) {
        var integrator = new PeriodIntegrator();

        forEachIndex(Strings.split(keyword, ' '), function(kword) {
            if (!kword) {
                return;
            }

            var length = kword.length;
            var start = 0;
            var end = 0;
            while (true) {
                var indexOf = sentence.indexOf(kword, end);
                if (indexOf === -1) {
                    break;
                }

                start = indexOf;
                end = indexOf + length;

                integrator.addPeriod(new Period(start, end));
            }
        });

        return integrator.integrate();
    };

    /**
     * @param {String} sentence
     * @param {String} keyword
     * @returns {String} highlighted sentence
     */
    TextHighlighter.prototype.highlight = function(sentence, keyword) {
        sentence = Strings.escapse(sentence);
        var periods = this.findPeriodsOfSentenceByKeyword(sentence, keyword);
        var size = 0;

        forEachIndex(periods, function(period) {
            var start = period.getStart() + size;
            var end = period.getEnd() + size;

            var infront = sentence.substring(0, start);
            //----------------------------------------------------------------
            var word = sentence.substring(start, end);
            var highlighted = this.wrapKeywordByHighlightBox(word);
            //----------------------------------------------------------------
            var behind = sentence.substring(end);

            sentence = infront + highlighted + behind;
            size = size + highlighted.length - word.length;

            this.totalHighlight_++;
        }, this);

        return sentence;
    };

    return TextHighlighter;

})();
