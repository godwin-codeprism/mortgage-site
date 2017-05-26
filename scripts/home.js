$(window).on('load', init);
$(window).resize(function () {
    init('resize');
})
$(window).scroll(function () {
    init('scroll');
})

function init(cmd) {
    if (cmd == "resize" || cmd == "scroll") {
        $('.thumb-slider-container:eq(0)').length > 0 ? setBlurClip() : false;
    } else if (typeof cmd == "object") {
        $('.thumb-slider-container:eq(0)').length > 0 ? setBlurClip() : false;
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
        $('form:eq(0)').submit(submitForm);
    }
}

window.setBlurClip = function () {
    var elm = $('.thumb-slider-container:eq(0)');
    var _that = $('.overlay:eq(0)')
    var _this = $('#blur_clip rect');
    if (navigator.userAgent.match(/Chrome/) != null) {
        _this.attr('x', elm.offset().left + 8);
        _this.attr('y', elm.offset().top - 1);
        _this.attr('width', elm.width() - 14);
        _this.attr('height', elm.height() - 5);
    } else {
        _this.attr('x', elm.offset().left);
        _this.attr('y', elm.offset().top);
        _this.attr('width', elm.width());
        _this.attr('height', elm.height());
    }

}

window.submitForm = function (e) {
    e.preventDefault();
    if (grecaptcha.getResponse().length > 0) {
        $('[type="submit"]').addClass('disabled');
        $('#recaptcha_msg').hide();
        var data = {};
        var rawData = JSON.parse(JSON.stringify($(this).serializeArray()));
        rawData.forEach(function (element) {
            data[element.name] = element.value;
        }, this);
        $.ajax({
            type: "POST",
            url: "./endpoints/send-mail.php",
            dataType: 'text',
            data: {
                myData: JSON.stringify(data)
            },
            complete: function (r) {
                console.log(r);
                if (r.responseText == "ok") {
                    $('.form-hide').show();
                    $('.form-hide').css('display', 'flex');
                } else {
                    $('#recaptcha_msg').html("Some thing went wrong! Please try again.");
                    $('#recaptcha_msg').show();
                    $('[type="submit"]').removeClass('disabled');
                }
            }
        })
    } else {
        $('#recaptcha_msg').show();
    }
}