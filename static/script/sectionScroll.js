IsForceScrolling = false;
wheel_event = false;
userScrolled = false;
isNoticed = false;
isScrollAvailable = true;

$(document).ready(() => {
    setTimeout(() => {
        if (!userScrolled) {
            $('.DownMsg p').css({animation: 'textBlink 1.5s linear infinite'});
        };
    }, 5000);
});

function sectionScroll(target_, IsMouseOvered, startNumber, targetLength, fixedObject) {
    if (isMobileDevice()) {
        var scrollValue = parseInt($($(target_).children()[startNumber]).css('height'), 10);
        var startPos = 0;
        var delayTime = 800;
        var endPoint = targetLength;
        var isAnimating = false;
        var isMoving = false;
        var animated = false;

        function motion(targetObject) {
            var touchStartY = 0;
            var touchEndY = 0;

            function onTouchStart(event) {
                touchStartY = event.touches[0].clientY;
            }

            function onTouchMove(event) {
                isMoving = true;
                event.preventDefault();
                touchEndY = event.touches[0].clientY;
            }

            function onTouchEnd() {
                userScrolled = true;
                if (!isAnimating && !IsForceScrolling && isMoving && isScrollAvailable) {
                    isAnimating = true;
                    $('.DownMsg p').css({animation: 'none'});

                    if (touchEndY > touchStartY && startPos != 0) {
                        for (let i = startNumber; i < endPoint; i++) {
                            const targetChild = $($(targetObject).children()[i]);
                            if (!targetChild.hasClass(fixedObject)) {
                                targetChild.stop().animate({
                                    top: parseInt($($('.main_contents').children()[i]).css('top'), 10) + scrollValue
                                });
                            }
                        }
                        startPos--;

                    } else if (touchEndY < touchStartY && startPos < endPoint - 1 - startNumber) {
                        for (let i = startNumber; i < endPoint; i++) {
                            const targetChild = $($(targetObject).children()[i]);
                            if (!targetChild.hasClass(fixedObject)) {
                                targetChild.stop().animate({
                                    top: parseInt($($('.main_contents').children()[i]).css('top'), 10) - scrollValue
                                });
                            }
                        }
                        startPos++;
                    }

                    if (startPos !== 0) {
                        $('.UpAlert').stop().delay(300).animate({opacity: '1'});
                    } else {
                        $('.UpAlert').stop().delay(300).animate({opacity: '0'});
                    }

                    if (startPos == 3) {
                        $('.DownAlert').stop().delay(300).animate({opacity: '0'});
                        setTimeout(() => {
                            if (startPos == 3 && !isNoticed) {
                                $('.UpMsg p').css({animation: 'textBlink 1.5s linear infinite'});
                                isNoticed = true;
                            }
                        }, 5000);
                    } else {
                        $('.UpMsg p').css({animation: 'none'});
                        $('.DownAlert').stop().delay(300).animate({opacity: '1'});
                    }

                    if ( $(window).width() <= 600 ) {
                        if (startPos == 1) {
                            $('.description').animate({ top: '18vh', opacity: 1 }, 1000, function () {
                                $('.description').css({ 'pointer-events': 'all' })
                            })
                            if ($(window).width() <= 400) {
                                $('.top3_container').delay(300).animate({ top: '60%', opacity: 1 }, 1000);
                            } else {
                                $('.top3_container').delay(300).animate({ top: '70%', opacity: 1 }, 1000);
                            }
                        }
    
                        if (startPos == 2) {
                            $('.search_description').animate({ top: '18vh', opacity: 1 }, 1000, function () {
                                $('.search_description').css({ 'pointer-events': 'all' })
                            })
                            if ( $(window).width() <= 400 ) {
                                $('.search_preview').delay(300).animate({ bottom: $('.footer_mobile').height(), opacity: 1 }, 1000)
                            } else {
                                $('.search_preview').delay(300).animate({ bottom: '0', opacity: 1 }, 1000)
                            }
                        }
    
                        if (startPos == 3) {
                            $('.explore_description').animate({ top: '18vh', opacity: 1 }, 1000, function () {
                                $('.explore_description').css({ 'pointer-events': 'all' })
                            })
                            if ( $(window).width() <= 400 ) {
                                var tileVh = PixelToVh($(window).height(), $('.footer_mobile').height())
                                var tilePx = PixelToVh($(window).height(), 20)
                                if ( animated == false ) {
                                    $('.explore_preview_bg').delay(300).animate({ bottom: $('.footer_mobile').height(), opacity: 1 }, 1000);
                                    $('.explore_preview_tile').delay(300).animate({ bottom: $('.footer_mobile').height(), opacity: 1 }, 1000, function () {
                                        $(this).delay(300).animate({ bottom: `${(tileVh + tilePx)}vh` }, 1000);
                                        animated = true;
                                    });
                                } else {
                                    $('.explore_preview_bg').delay(300).animate({ bottom: $('.footer_mobile').height(), opacity: 1 }, 1000);
                                    $('.explore_preview_tile').delay(300).animate({ bottom: `${(tileVh + tilePx)}vh`, opacity: 1 }, 1000);
                                }
                            } else {
                                $('.explore_preview_bg').delay(300).animate({ bottom: '0', opacity: 1 }, 1000);
                                $('.explore_preview_tile').delay(300).animate({ bottom: '0', opacity: 1 }, 1000, function () {
                                    $(this).addClass('bottom_up');
                                });
                            };
                        };
                    } else {
                        if (startPos == 1) {
                            $('.description').animate({ top: '18vh', opacity: 1 }, 1000, function () {
                                $('.description').css({ 'pointer-events': 'all' })
                            })
                            $('.top3_container').delay(300).animate({ top: '70%', opacity: 1 }, 1000)
                        }
    
                        if (startPos == 2) {
                            $('.search_description').animate({ top: '30vh', opacity: 1 }, 1000, function () {
                                $('.search_description').css({ 'pointer-events': 'all' })
                            })
                            $('.search_preview').delay(300).animate({ bottom: '0', opacity: 1 }, 1000)
                        }
    
                        if (startPos == 3) {
                            $('.explore_description').animate({ top: '30vh', opacity: 1 }, 1000, function () {
                                $('.explore_description').css({ 'pointer-events': 'all' })
                            })
                            $('.explore_preview_bg').delay(300).animate({ bottom: '0', opacity: 1 }, 1000)
                            $('.explore_preview_tile').delay(300).animate({ bottom: '0', opacity: 1 }, 1000, function () {
                                $(this).addClass('bottom_up')
                            })
                        }
                    }

                    setTimeout(function () {
                        isAnimating = false;
                        isMoving = false;
                    }, delayTime);
                }
            }

            document.addEventListener('touchstart', onTouchStart, { passive: false });
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd, { passive: false });
        }

        if (IsMouseOvered) {
            $(target_).mouseenter(function () {
                motion(target_);
            });
        } else {
            motion(target_);
        }

        $(window).resize(function () {
            wheel_event = true;
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                $(this).trigger('resizeEnd');
            }, 100);
        });

        $(window).bind('resizeEnd', function () {
            startPos = 0;
            forceTop('.main_contents');
            sectionScroll('.main_contents', false, 1, 5, 'fixed');
            $('.DownAlert').stop().delay(300).animate({opacity: '1'});
            $('.UpAlert').stop().delay(300).animate({opacity: '0'});
        });
    } else {
        var scrollValue = parseInt($($(target_).children()[2]).css('height'), 10);
        var startPos = 0;
        var delayTime = 800;
        var endPoint = targetLength;
        var isAnimating = false;

        function motion(targetObject) {
            document.addEventListener('wheel', function (event) {
                userScrolled = true;
                event.preventDefault();

                if (!isAnimating && !IsForceScrolling && !wheel_event && isScrollAvailable) {
                    isAnimating = true;
                    $('.DownMsg p').css({animation: 'none'});

                    if (event.deltaY > 0) {
                        if (startPos < endPoint - 1 - startNumber) {
                            for (let i = startNumber; i < endPoint; i++) {
                                const targetChild = $($(targetObject).children()[i]);
                                if (!targetChild.hasClass(fixedObject)) {
                                    targetChild.stop().animate({
                                        top: parseInt($($('.main_contents').children()[i]).css('top'), 10) - scrollValue
                                    });
                                } else {

                                }
                            }
                            startPos++;
                        } else {

                        }
                    } else if (event.deltaY < 0) {
                        if (startPos != 0) {
                            for (let i = startNumber; i < endPoint; i++) {
                                const targetChild = $($(targetObject).children()[i]);
                                if (!targetChild.hasClass(fixedObject)) {
                                    targetChild.stop().animate({
                                        top: parseInt($($('.main_contents').children()[i]).css('top'), 10) + scrollValue
                                    });
                                } else {

                                }
                            }
                            startPos--;
                        } else {

                        }
                    }

                    if (startPos !== 0) {
                        $('.UpAlert').stop().delay(300).animate({opacity: '1'});
                    } else {
                        $('.UpAlert').stop().delay(300).animate({opacity: '0'});
                    }

                    if (startPos == 3) {
                        $('.DownAlert').stop().delay(300).animate({opacity: '0'});
                        setTimeout(() => {
                            if (startPos == 3 && !isNoticed) {
                                $('.UpMsg p').css({animation: 'textBlink 1.5s linear infinite'});
                                isNoticed = true;
                            }
                        }, 5000);
                    } else {
                        $('.UpMsg p').css({animation: 'none'});
                        $('.DownAlert').stop().delay(300).animate({opacity: '1'});
                    }

                    if ( $(window).width() <= 600 ) {
                        if (startPos == 1) {
                            $('.description').animate({ top: '18vh', opacity: 1 }, 1000, function () {
                                $('.description').css({ 'pointer-events': 'all' })
                            })
                            if ($(window).width() <= 400) {
                                $('.top3_container').delay(300).animate({ top: '60%', opacity: 1 }, 1000);
                            } else {
                                $('.top3_container').delay(300).animate({ top: '70%', opacity: 1 }, 1000);
                            }
                        }
    
                        if (startPos == 2) {
                            $('.search_description').animate({ top: '18vh', opacity: 1 }, 1000, function () {
                                $('.search_description').css({ 'pointer-events': 'all' })
                            })
                            if ( $(window).width() <= 400 ) {
                                $('.search_preview').delay(300).animate({ bottom: '20vw', opacity: 1 }, 1000)
                            } else {
                                $('.search_preview').delay(300).animate({ bottom: '0', opacity: 1 }, 1000)
                            }
                        }
    
                        if (startPos == 3) {
                            $('.explore_description').animate({ top: '18vh', opacity: 1 }, 1000, function () {
                                $('.explore_description').css({ 'pointer-events': 'all' })
                            })
                            $('.explore_preview_bg').delay(300).animate({ bottom: '0', opacity: 1 }, 1000)
                            $('.explore_preview_tile').delay(300).animate({ bottom: '0', opacity: 1 }, 1000, function () {
                                $(this).addClass('bottom_up')
                            })
                        }
                    } else {
                        if (startPos == 1) {
                            $('.description').animate({ top: '14vh', opacity: 1 }, 1000, function () {
                                $('.description').css({ 'pointer-events': 'all' })
                            })
                            $('.top3_container').delay(300).animate({ top: '67%', opacity: 1 }, 1000)
                        }
    
                        if (startPos == 2) {
                            $('.search_description').animate({ top: '30vh', opacity: 1 }, 1000, function () {
                                $('.search_description').css({ 'pointer-events': 'all' })
                            })
                            $('.search_preview').delay(300).animate({ bottom: '0', opacity: 1 }, 1000)
                        }
    
                        if (startPos == 3) {
                            $('.explore_description').animate({ top: '30vh', opacity: 1 }, 1000, function () {
                                $('.explore_description').css({ 'pointer-events': 'all' })
                            })
                            $('.explore_preview_bg').delay(300).animate({ bottom: '0', opacity: 1 }, 1000)
                            $('.explore_preview_tile').delay(300).animate({ bottom: '0', opacity: 1 }, 1000, function () {
                                $(this).addClass('bottom_up')
                            })
                        }
                    }

                    setTimeout(function () {
                        isAnimating = false;
                    }, delayTime);
                }
            }, { passive: false });
        }

        if (IsMouseOvered) {
            $(target_).mouseenter(function () {
                motion(target_);
            })
        } else {
            motion(target_);
        }

        $(window).resize(function () {
            wheel_event = true;
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                $(this).trigger('resizeEnd');
            }, 100);
        });

        $(window).bind('resizeEnd', function () {
            startPos = 0;
            forceTop('.main_contents')
            sectionScroll('.main_contents', false, 1, 5, 'fixed');
            $('.DownAlert').stop().delay(300).animate({opacity: '1'});
            $('.UpAlert').stop().delay(300).animate({opacity: '0'});
        });
    }
}

function forceTop(target_) {
    IsForceScrolling = true;
    var endPoint = $(target_).children().length;

    for (let i = 0; i < endPoint; i++) {
        $($(target_).children()[i]).stop().animate({ top: 0 });
    }
    IsForceScrolling = false;
    setTimeout(function () {
        wheel_event = false;
    }, 1500)
}