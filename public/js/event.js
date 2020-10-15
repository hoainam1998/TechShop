$(document).ready(function(){
    $(document).scroll(function () {
        if ($(document).scrollTop() > 100) {
            $('.headerMain').addClass('hideHeaderMain');
            $('.headerMobile').addClass('showHeaderMobile');
        } else {
            $('.headerMain').removeClass('hideHeaderMain');
            $('.headerMobile').removeClass('showHeaderMobile');
        }
    })

    $(document).scroll(function () {
        if ($(document).scrollTop() > 1500) {
            $('.scroll').addClass('showScrollButton');
        } else {
            $('.scroll').removeClass('showScrollButton');
        }
    })

    $('.scroll').click(function () {
        $('html,body').animate({
            scrollTop: $('#top').offset().top
        },900)
    })

    $('.openCategrories').click(function () {
        $('.mobileCategories').toggleClass('showMobileCategories')
    })

    $('.listJob').slideUp();
    $('.job').click(function (evt) {
        evt.preventDefault();
        $(this).next().slideToggle();
    })

    $('.filter span').click(function(){
        $('.listFilter').toggleClass('showFilter');
    })
})