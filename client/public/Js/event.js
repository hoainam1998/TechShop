$(document).ready(function () {
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
        }, 900)
    })

    $('.openCategrories').click(function () {
        $('.mobileCategories').toggleClass('showMobileCategories')
    })

    $('.listJob').slideUp();
    $('.job').click(function (evt) {
        evt.preventDefault();
        $(this).next().slideToggle();
    })

    $('.filter span').click(function () {
        $('.listFilter').toggleClass('showFilter');
    })

    $(`.listCategories li a[href$="${location.pathname}"]`).parent().css('background', '#ebebeb');

    $('.listPriceRange a').click(function (evt) {
        $('.styleForLinkPrice').removeClass('styleForLinkPrice');
        $(this).addClass('styleForLinkPrice');
    })

    let categories = location.pathname.slice(1)
    switch (categories) {
        case 'laptop': {
            $('[class^="cpu"]').hide();
            $('[class^="ram"]').hide();
            $(`[class="cpu_laptop"]`).show();
            $(`[class="ram_laptop"]`).show();
            $('.headerOfProductList h1').text('Laptop noi bat');
        }; break;
        case 'pc': {
            $('[class^="cpu"]').hide();
            $('[class^="ram"]').hide();
            $(`[class="cpu_laptop"]`).show();
            $(`[class="ram_laptop"]`).show();
            $('.headerOfProductList h1').text('PC noi bat');
        }; break;
        case 'manhinh': {
            $('.brand').hide();
            $('.priceAndFilter_Sort').hide();
            $('.listPriceRange').hide();
            $('.headerOfProductList h1').text('Man hinh noi bat');
        }; break;
        case 'tainghe': {
            $('.brand').hide();
            $('.priceAndFilter_Sort').hide();
            $('.listPriceRange').hide();
            $('.headerOfProductList h1').text('Tai nghe noi bat');
        }; break;
        case 'tablet': {
            $('.headerOfProductList h1').text('Tablet noi bat');
        }; break;
    }

    $('.hideListSearch').click(function () {
        $('.listSearch').empty().hide(function () {
            $('input[name="search"]').val('');
            $('.hideListSearch').hide()
        });
    })

    $('.buyNow2').click(function () {
        $('html,body').animate({
            scrollTop: $('#top').offset().top
        }, 900);
    })
})