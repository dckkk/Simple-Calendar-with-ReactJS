$(document).ready(function() {
    /* Globaly Function */
    var backgroundURL = 'assets/img/mount-bromo.jpg';
    $('body')
        .css('background-image', 'url("' + backgroundURL + '")')
        .niceScroll({
            cursorcolor: "#e8e8e8",
            cursorborder: "#FFFFFF"
        });

    /* Semantic Element */
    $('.ui.checkbox').checkbox();
    $('.item.popup.toggle').popup({
        on: 'click',
        target: $(this).attr('data-target'),
        position: $(this).attr('data-position')
    });
    $('.item.popups').popup({
        inline: false,
        hoverable: true,
        position: 'right center',
        delay: {
            show: 400,
            hide: 400
        }
    });
    $('.button[data-popup="popup"]').popup({
        on: 'click',
        target: $(this).attr('data-target'),
        position: $(this).attr('data-position')
    });
    $('.button[data-popup="modal"]').click(function() {
        $('.ui.modal').modal('show');
    });
    $('.tabular.menu .item').tab();
    $('.ui.segment .dimmer').dimmer({ on: 'hover' });
    $('.ui.progress').progress();
    $('.ui.accordion').accordion();
    $('select.dropdown').dropdown();

    /* Nice Scroll */
    $('.ui.side').niceScroll({
        cursorcolor: "transparent",
        cursorborder: "transparent",
        horizrailenabled: false
    });
    $('.ui.wrapper .ui.menu').niceScroll({
        cursorcolor: "transparent",
        cursorborder: "transparent"
    });

    $('.sides.contents').niceScroll({
        cursorcolor: "#e8e8e8",
        cursorborder: "#FFFFFF"
    });

    /* Responsive content */
    $('.sideOff').click(function(e) {
        e.preventDefault();
        $('.sides.contents').css('display', 'none');
        $('.half.contents').css('width', '100%');
        $('.sideOff').css('display', 'none');
        $('.sideOn').css('display', 'block');
    });
    $('.sideOn').click(function(e) {
        e.preventDefault();
        $('.sides.contents').css({'display':'block', 'width':'auto !important'});
        $('.half.contents').css('width', '50%');
        $('.sideOff').css('display', 'block');
        $('.sideOn').css('display', 'none');
    });
    $('.sidebars').click(function(e) {
        e.preventDefault();
        $('.sides.contents').toggleClass('show');
    });

    /* Global function */
    $(window).scroll(function() {
        var height = $(window).scrollTop();
        if (height > 30) {
            $('.ui.navbar').css('box-shadow','0px 0px 5px #C6C6C6');
        } else {
            $('.ui.navbar').css('box-shadow','none');
        }
    });
    $('#editor').trumbowyg();
});
