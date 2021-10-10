/**
 * 数字滚动效果组件
 * @Author gafish
 * @Date   17/10/2015 01:22
 */
define(function(require, exports, module) {
    "use strict";

    var Base = require('base');
    var Util = require('util');
    var Node = require('node');
    var JSON = require('json');

    var $ = Node.all;


    //first figure out which CSS3 properties to set..
    var prefixes = ["", "O", "ms", "Webkit", "Moz"];

    //using same idea as jquery transform plugin..
    var testDivStyle = document.createElement('div').style;
    var css3Prefix = null;
    for (var i = 0, len = prefixes.length; i < len; i++) {
        if (prefixes[i] + "Transition" in testDivStyle &&
            prefixes[i] + "Transform" in testDivStyle) {
            css3Prefix = prefixes[i];
            break;
        }
    }
    var animationSupported = css3Prefix !== null;

    //get the transition ended event name for the css3Prefix..
    var transitionEndEvent;
    switch (css3Prefix) {
        case "O":
            transitionEndEvent = "otransitionend";
            break;
        case "ms":
            transitionEndEvent = "msTransitionEnd";
            break;
        case "Webkit":
            transitionEndEvent = "webkitTransitionEnd";
            break;
        default:
            transitionEndEvent = "transitionend";
    }

    //allow the use of hardware accellerated transforms for older webkit browsers, adapted from:
    //http://www.appmobi.com/documentation/content/Articles/Article_UsingBestPractices/index.html?r=8684
    var translateOpen = window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix() ? "translate3d(0, " : "translate(0, ";
    var translateClose = window.WebKitCSSMatrix && 'm11' in new WebKitCSSMatrix() ? "px ,0)" : "px)";

    /**
     * Binds the given function onto the given jQuery array $el on the transitionEndEvent and unbinds it after execution.
     * Also handles the case where the event doesn't fire, in which case a timeout is used to ensure execution, which runs
     * after the given number of milliseconds plus an additional 100ms grace period.
     */
    var bindToTransitionEndForSingleRun = function($el, funcToExec, maxMSTillTransitionEnd) {
        var firedFunc = false;
        var wrappedFunc = function() {
            funcToExec();
            firedFunc = true;
            $el.detach(transitionEndEvent, wrappedFunc);
        };
        $el.on(transitionEndEvent, wrappedFunc);
        setTimeout(function() {
            if (!firedFunc) wrappedFunc();
        }, maxMSTillTransitionEnd + 100);
    };

    //all allowed characters (note: you get a bizzare error in Opera and IE
    //if the non-digit characters are at the end for some reason)..
    var allChars = ', . - + 0 1 2 3 4 5 6 7 8 9';
    var placeholder = '6 7 8 9 0 1 2 3 4 5 6 7 8 9';

    //checks that the given value makes sense to use..
    var checkValue = function(str) {
        if (!str) return;
        console.log('checkValue:str=='+str);
        //check there are no odd chars first..
        for (var i = 0, len = str.length; i < len; i++) {
            if (allChars.indexOf(str.charAt(i)) < 0) {
                $.error("numberAnimate plugin requires that value used " +
                    "only contain character in: \"" + allChars + "\"");
                return false;
            }
        }
        return true;
    };

    //Given a div which holder a character, it shift it to the required character,
    //note, the givenholder div should be attached prior to calling this for the animation
    //to take effect..
    var shiftToChar = function($holderDiv, character, shiftTime) {
        var innerStyle = $holderDiv.children()[0].style;
        innerStyle[css3Prefix + 'Transition'] = "all " + shiftTime + "ms ease-in-out";

        var indexOfChar = allChars.indexOf(character);
        var transformY;
        var currentTransformY = parseInt(innerStyle[css3Prefix + 'Transform'].split(',')[1]);
        if (indexOfChar < 0 || /\s/.test(character)) {
            transformY = $holderDiv.height();
        } else {
            transformY = 0 - (indexOfChar / 2) * $holderDiv.innerHeight();
        }
        var originTransformY = transformY;
        if (transformY > currentTransformY) {
            transformY = 0 - (indexOfChar / 2) * $holderDiv.innerHeight()-$holderDiv.children().children().height();
            bindToTransitionEndForSingleRun($holderDiv.children().item(0), function() {
                innerStyle[css3Prefix + 'Transition'] = "none";
                innerStyle[css3Prefix + 'Transform'] = translateOpen + originTransformY + translateClose;
            }, shiftTime);
        }
        innerStyle[css3Prefix + 'Transform'] = translateOpen + transformY + translateClose;
    };

    //Function to create a new character wrapper div to wrap the given character
    //setting the holding div to have the given dimension and given "position".
    //You should attach the element returned by this function to the DOM straight
    //away in order for the animation to take effect..
    //The animationTimes is an array of milliseconds which defines: creation,
    //shift and remove times..
    var createDivForChar = function(character, height, width, position, animationTimes) {
        var creationTime = animationTimes[0];
        var shiftTime = animationTimes[1];

        var holderDiv = $(document.createElement('div')).css({
            width: (creationTime ? 0 : width) + 'px',
            height: height + 'px',
            overflow: 'hidden',
            display: 'inline-block'
        }).attr("data-numberAnimate-pos", position);

        var innerDiv = $(document.createElement('div'));
        innerDiv.append($(document.createElement('div')).html(allChars));
        innerDiv.append($(document.createElement('div')).html(placeholder));
        //fix annoying flickering for older webkit browsers..
        if (css3Prefix === 'Webkit')
            innerDiv[0].style['-webkit-backface-visibility'] = 'hidden';

        //initially show blank..
        innerDiv[0].style[css3Prefix + 'Transform'] = translateOpen + height + translateClose;
        holderDiv.append(innerDiv);

        //animate to the correct character when finished animating creation if necessary..
        var shiftToCorrectChar = function() {
            shiftToChar(holderDiv, character, shiftTime);
        };

        //shift if after creation and after attachment if animating..
        if (creationTime) {
            //bit of a hack - transition will only work if the element is attached to the DOM
            //so use a timeout to make this possible (no onattached event)..
            setTimeout(function() {
                bindToTransitionEndForSingleRun(holderDiv, shiftToCorrectChar, creationTime);
                var holderStyle = holderDiv[0].style;
                holderStyle[css3Prefix + 'Transition'] = "all " + creationTime + "ms ease-in-out";
                holderStyle.width = width + "px";
            }, 20);
        } else if (shiftTime) {
            setTimeout(shiftToCorrectChar, 20);
        } else {
            shiftToCorrectChar();
        }

        return holderDiv[0];
    };

    //Removes the elements in thegiven jQuery collection using animation..
    var removeDivsForChars = function($divs, animationTimes) {
        var shiftTime = animationTimes[1];
        var removeTime = animationTimes[2];

        $divs.removeAttr("data-numberAnimate-pos");
        $divs.each(function(div, index) {
            var $div = $(div);
            var style = div.style;

            //then remove it..
            var animateRemoval = function() {
                style[css3Prefix + 'Transition'] = "all " + removeTime + "ms ease-in-out";
                style.width = "1px";

                bindToTransitionEndForSingleRun($div, function() {
                    $div.remove();
                }, removeTime);
            };
            if (shiftTime) {
                bindToTransitionEndForSingleRun($div, animateRemoval, shiftTime);
            } else {
                animateRemoval();
            }

            //first move it so that the no break space is showing..
            shiftToChar($div, 'not there', shiftTime);
        });
    };

    var NumberAnimate = Base.extend({
        initializer: function(options) {
            var self = this;

            this.get('el').css('display', 'inline-block').each(function($el, index) {
                var valueStr = $el.text();
                if (!checkValue(valueStr)) return;

                $el.attr('data-numberAnimate-value', valueStr);

                if (!animationSupported) return;

                // 获取单个字符的宽高
                $el.html("1");
                var characterWidth = $el.width();
                var characterHeight = $el.height();
                $el.attr("data-numberAnimate-characterHeight", characterHeight);
                $el.attr("data-numberAnimate-characterWidth", characterWidth);
                $el.html("");

                //required to get things to line up..
                $el.css({
                    "vertical-align": "top",
                    "display": "inline-block",
                    "height": characterHeight + "px"
                });


                $el.attr("data-numberAnimate-animationTimes", "[" + self.get('animationTimes') + "]");

                //we positionthings relative to the dot, so store it's position..
                var indexOfPoint = valueStr.indexOf(".");
                if (indexOfPoint < 0) indexOfPoint = valueStr.length;

                //add divs representing each character..
                var docFrag = document.createDocumentFragment();
                for (var i = 0, len = valueStr.length; i < len; i++) {
                    var character = valueStr.charAt(i);
                    //create the divs with zero animation time..
                    docFrag.appendChild(
                        createDivForChar(character, characterHeight,
                            characterWidth, indexOfPoint - i, [0, 0, 0])
                    );
                }
                $el.append(docFrag); //add in one go.
            });
        },

        /**
         * Obtains the string value that is being animating for the first matched element.
         */
        val: function() {
            return this.get('el').attr("data-numberAnimate-value");
        },

        /**
         * Sets the value to the new given one, using the given animationTimes if provided.
         * If animationTimes are not provided the ones associated with this object are used.
         */
        set: function(newValue, animationTimes) {
            // if (newValue <= this.val()) return; // 临时禁止数字变小
            if (typeof newValue === 'number') //normalize to a string..
                newValue = "" + newValue;
            if (!animationTimes)
                animationTimes = JSON.parse(this.get('el').attr('data-numberAnimate-animationTimes'));

            //get the number value and update the stored value..
            if (!checkValue(newValue)) return;
            this.get('el').attr("data-numberAnimate-value", newValue);

            //if not animating just change the value..
            if (!animationSupported) {
                this.get('el').html(newValue);
                return;
            }

            //work out which characters are required relative to the dot..
            var indexOfPoint = newValue.indexOf(".");
            if (indexOfPoint < 0) indexOfPoint = newValue.length;

            this.get('el').each(function($el, index) {
                var numberHolderDivs = $el.children();
                var characterHeight = $el.attr('data-numberAnimate-characterHeight') * 1;
                var characterWidth = $el.attr('data-numberAnimate-characterWidth') * 1;

                //if new characters are required, this will be set to one of the newly created ones..
                var newlyCreatedHoldingDiv;

                //add/remove those at the start..
                var largestCurrentPos = numberHolderDivs.attr('data-numberAnimate-pos') * 1;
                if (isNaN(largestCurrentPos)) largestCurrentPos = 1;
                var largestRequiredPos = indexOfPoint;
                var docFragment, pos, character, index;
                if (largestCurrentPos < largestRequiredPos) {
                    docFragment = document.createDocumentFragment();
                    for (pos = largestRequiredPos, index = 0; pos >= largestCurrentPos + 1; pos--, index++) {
                        character = newValue.charAt(index);
                        docFragment.appendChild(
                            createDivForChar(character, characterHeight,
                                characterWidth, pos, animationTimes)
                        );
                    }
                    newlyCreatedHoldingDiv = docFragment.firstChild;
                    $el.prepend(docFragment);
                } else if (largestCurrentPos > largestRequiredPos) {
                    removeDivsForChars(
                        numberHolderDivs.filter(function(d) {
                            return $(d).attr('data-numberAnimate-pos') > largestRequiredPos;
                        }),
                        animationTimes
                    );
                }

                //add/remove at the end of the list..
                var smallestCurrentPos = numberHolderDivs.item(numberHolderDivs.length - 1)
                    .attr('data-numberAnimate-pos') * 1;
                if (isNaN(smallestCurrentPos)) smallestCurrentPos = 1;
                var smallestRequiredPos = indexOfPoint - newValue.length + 1;
                if (smallestRequiredPos < smallestCurrentPos) {
                    docFragment = document.createDocumentFragment();
                    for (pos = smallestCurrentPos - 1,
                        index = newValue.length - (smallestCurrentPos - smallestRequiredPos); pos >= smallestRequiredPos; pos--, index++) {
                        character = newValue.charAt(index);
                        docFragment.appendChild(
                            createDivForChar(character, characterHeight,
                                characterWidth, pos, animationTimes)
                        );
                    }
                    newlyCreatedHoldingDiv = docFragment.firstChild;
                    $el.append(docFragment);
                } else if (smallestRequiredPos > smallestCurrentPos) {
                    removeDivsForChars(
                        numberHolderDivs.filter(function(d) {
                            return $(d).attr('data-numberAnimate-pos') < smallestRequiredPos;
                        }),
                        animationTimes
                    );
                }

                //performs the animation of the characters that are already there..
                var shiftPresentCharacters = function() {
                    var shiftTime = animationTimes[1];
                    pos = Math.min(largestRequiredPos, largestCurrentPos);
                    var endPos = Math.max(smallestRequiredPos, smallestCurrentPos);
                    index = indexOfPoint - pos;
                    for (; pos >= endPos; pos--, index++) {
                        character = newValue.charAt(index);
                        var holdingDiv = numberHolderDivs.filter(function(d) {
                            return $(d).attr('data-numberAnimate-pos') == pos;
                        });
                        shiftToChar(holdingDiv, character, shiftTime);
                    }
                };

                //execute above function straight away or once the newly created holding div has finished animating..
                if (newlyCreatedHoldingDiv) {
                    bindToTransitionEndForSingleRun(
                        $(newlyCreatedHoldingDiv), shiftPresentCharacters, animationTimes[0] + 100);
                } else {
                    shiftPresentCharacters();
                }
            });

            return this;
        },

        /**
         * Undoes the changes made by this plugin to the selected elements.
         */
        destroy: function() {
            var self = this;
            this.get('el').each(function($el) {

                var value = this.val();
                if (value === null) return; //continue

                $el.html(value);
                //remove attributes that may have been added - code adapted from:
                //cletus's answer for: http://stackoverflow.com/questions/1870441/remove-all-attributes
                var attributesToRemove = Util.map($el[0].attributes, function(attr) {
                    var name = attr.name;
                    return name.indexOf('data-numberanimate') === 0 ? name : null;
                });
                $el.removeAttr(attributesToRemove.join(' '));
            });

        }
    }, {
        ATTRS: {
            el: {
                value: null
            },
            animationTimes: {
                value: [500, 500, 500]
            }
        }
    });

    module.exports = NumberAnimate;
});