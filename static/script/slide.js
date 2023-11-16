function SliderAnimate(ContainerClass, fadeInTime, DelayDuration, fadeOutTime) {
    $(String(ContainerClass)).children().each(function (index) {
        let $element = $(this);
        $element.delay(index * (fadeInTime + DelayDuration + fadeOutTime)).fadeIn(fadeInTime).delay(DelayDuration).fadeOut(fadeOutTime);
    });

    function repeatAnimation() {
        SliderAnimate(ContainerClass, fadeInTime, DelayDuration, fadeOutTime);
    }

    $(String(ContainerClass)).children().promise().done(function() {
        repeatAnimation();
    });
}
