var MalinkyAjaxPaging = function ($) {
    var init = function () {
        function debounce(a, t, n) {
            var o;
            return function () {
                var i = this,
                        e = arguments,
                        p = function () {
                            o = null, n || a.apply(i, e)
                        },
                        m = n && !o;
                clearTimeout(o), o = setTimeout(p, t), m && a.apply(i, e)
            }
        }
        var mymapAjaxLoader = mapAjaxLoader,
                mymapCssLoadMore = mapCssLoadMore,
                mymapCssLoadMoreButton = mapCssLoadMoreButton,
                mymapInfiniteScrollBuffer = mapInfiniteScrollBuffer,
                mymapLoadingTimer = "",
                mymapLoadingMorePostsText = mapLoadingMorePostsText,
                mymapLoadMoreButtonText = mapLoadMoreButtonText,
                mymapPaginationClass = mapPaginationClass,
                mymapPaginationClassPixelsToDocBottom = mapPaginationClassPixelsToDocBottom,
                mymapPagingType = mapPagingType,
                mymapPostsWrapperClass = mapPostsWrapperClass,
                mymapPostClass = mapPostClass,
                mymapNextPageSelector = mapNextPageSelector,
                mymapNextPageUrl = mapNextPageUrl,
                mymapPaginatorCount = mapPaginatorCount,
                mymapUserCallback = mapUserCallback,
                infiniteScrollRunning = !1,
                mapLoadPosts = function () {
                    $.ajax({
                        type: "GET",
                        url: mymapNextPageUrl,
                        dataType: "html",
                        success: function (a) {
                            var t = $.parseHTML(a),
                                    n = ($(t).find(mymapPostsWrapperClass), mapPaginatorTotalCount(t));
                            mapAddPaginatorCount(t, n);
                            var o = $(t).find(mymapPostsWrapperClass + '[data-paginator-count="' + mymapPaginatorCount + '"] ' + mymapPostClass),
                                    i = $(mymapPostsWrapperClass + '[data-paginator-count="' + mymapPaginatorCount + '"] ' + mymapPostClass).last(),
                                    e = $(mymapPostsWrapperClass + '[data-paginator-count="' + mymapPaginatorCount + '"] ' + mymapPostClass);
                            if (i.after(o), "infinite-scroll" != mymapPagingType && "load-more" != mymapPagingType || (1 == n ? mapIsLastPage(t, mymapNextPageSelector) ? mymapNextPageUrl = $(t).find(mymapNextPageSelector).attr("href") : ($('#malinky-ajax-pagination-button[data-paginator-count="' + mymapPaginatorCount + '"]').parent().remove(), window.removeEventListener("scroll", mapInfiniteScroll)) : mapIsLastPage(t, mymapNextPageSelector + '[data-paginator-count="' + mymapPaginatorCount + '"]') ? mymapNextPageUrl = $(t).find(mymapNextPageSelector + '[data-paginator-count="' + mymapPaginatorCount + '"]').attr("href") : ($('#malinky-ajax-pagination-button[data-paginator-count="' + mymapPaginatorCount + '"]').parent().remove(), window.removeEventListener("scroll", mapInfiniteScroll))), "pagination" == mymapPagingType) {
                                e.remove(), history.pushState(null, null, mymapNextPageUrl);
                                var p = $(t).find(mymapPaginationClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').first();
                                $(mymapPaginationClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').replaceWith(p)
                            }
                            mapLoaded()
                        },
                        error: function (a, t) {
                            mapFailed()
                        },
                        complete: function (requestObj) {
                            "pagination" == mymapPagingType && $("body,html").animate({
                                scrollTop: $(mymapPostsWrapperClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').offset().top - 150
                            }, 400), "infinite-scroll" == mymapPagingType && (infiniteScrollRunning = !1), "load-more" == mymapPagingType && $('#malinky-ajax-pagination-button[data-paginator-count="' + mymapPaginatorCount + '"]').removeClass("malinky-load-more__button-disable");
                            var mapResponse = $.parseHTML(requestObj.responseText),
                                    paginatorTotalCountAjax = mapPaginatorTotalCount(mapResponse);
                            mapAddPaginatorCount(mapResponse, paginatorTotalCountAjax);
                            var $mapLoadedPosts = $(mapResponse).find(mymapPostsWrapperClass + '[data-paginator-count="' + mymapPaginatorCount + '"] ' + mymapPostClass);
                            !function (loadedPosts, url) {
                                eval(mymapUserCallback)
                            }($mapLoadedPosts, this.url)
                        }
                    })
                },
                mapPaginatorTotalCount = function (a) {
                    var t = 0;
                    for (var n in malinkySettings)
                        $(a).find(malinkySettings[n].posts_wrapper).length && $(a).find(malinkySettings[n].post_wrapper).length && $(a).find(malinkySettings[n].pagination_wrapper).length && t++;
                    return t
                },
                mapAddPaginatorCount = function (a, t) {
                    var n = 1;
                    for (var o in malinkySettings)
                        $(a).find(malinkySettings[o].posts_wrapper).length && $(a).find(malinkySettings[o].post_wrapper).length && $(a).find(malinkySettings[o].pagination_wrapper).length && (1 == t ? ($(a).find(malinkySettings[o].posts_wrapper).attr("data-paginator-count", n), $(a).find(malinkySettings[o].pagination_wrapper).attr("data-paginator-count", n)) : ($(a).find(malinkySettings[o].posts_wrapper).attr("data-paginator-count", n), $(a).find(malinkySettings[o].posts_wrapper + " " + malinkySettings[o].pagination_wrapper).attr("data-paginator-count", n), $(a).find(malinkySettings[o].posts_wrapper + " " + malinkySettings[o].next_page_selector).attr("data-paginator-count", n), n++))
                },
                mapIsLastPage = function (a, t) {
                    return $(a).find(t).length
                },
                mapAddLoader = function () {
                    $(mymapPaginationClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').last().before('<div class="malinky-ajax-pagination-loading" data-paginator-count="' + mymapPaginatorCount + '">' + mymapAjaxLoader + "</div>")
                },
                mapLoading = function () {
                    $('.malinky-ajax-pagination-loading[data-paginator-count="' + mymapPaginatorCount + '"]').show(), "load-more" != mymapPagingType && "infinite-scroll" != mymapPagingType || $('#malinky-ajax-pagination-button[data-paginator-count="' + mymapPaginatorCount + '"]').text(mymapLoadingMorePostsText)
                },
                mapLoaded = function () {
                    $('.malinky-ajax-pagination-loading[data-paginator-count="' + mymapPaginatorCount + '"]').hide(), "load-more" != mymapPagingType && "infinite-scroll" != mymapPagingType || $('#malinky-ajax-pagination-button[data-paginator-count="' + mymapPaginatorCount + '"]').text(mymapLoadMoreButtonText), clearTimeout(mapLoadingTimer)
                },
                mapFailed = function () {
                    $('.malinky-ajax-pagination-loading[data-paginator-count="' + mymapPaginatorCount + '"]').hide(), clearTimeout(mapLoadingTimer)
                },
                mapInfiniteScroll = debounce(function () {
                    if (!infiniteScrollRunning) {
                        var a = ($(document).height() - $(window).scrollTop() - $(window).height(), $(mymapPostsWrapperClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').offset().top),
                                t = $(mymapPostsWrapperClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').outerHeight();
                        $(window).height() + $(window).scrollTop() + mymapInfiniteScrollBuffer > a + t && (infiniteScrollRunning = !0, mapLoading(), mapLoadPosts())
                    }
                }, 250);
        "infinite-scroll" == mymapPagingType ? $(mymapNextPageSelector + '[data-paginator-count="' + mymapPaginatorCount + '"]').attr("href") && (mapAddLoader(), $(mymapPaginationClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').remove(), window.addEventListener("scroll", mapInfiniteScroll)) : "load-more" == mymapPagingType ? $(mymapNextPageSelector + '[data-paginator-count="' + mymapPaginatorCount + '"]').attr("href") && ($(mymapPaginationClass + '[data-paginator-count="' + mymapPaginatorCount + '"]').last().after('<div class="malinky-load-more"><a href="' + mymapNextPageUrl + '" id="malinky-ajax-pagination-button" class="malinky-load-more__button" data-paginator-count="' + mymapPaginatorCount + '">' + mapLoadMoreButtonText + "</a></div>"), mapAddLoader(), $(mymapPaginationClass + '[data-paginator-count="' + mymapPaginatorCount + '"]:not(:has(>a#malinky-ajax-pagination-button[data-paginator-count="' + mymapPaginatorCount + '"]))').remove(), $('#malinky-ajax-pagination-button[data-paginator-count="' + mymapPaginatorCount + '"]').click(function (a) {
            a.preventDefault(), $(this).addClass("malinky-load-more__button-disable"), mapLoadingTimer = setTimeout(mapLoading, 750), mapLoadPosts()
        })) : "pagination" == mymapPagingType && (mapAddLoader(), $(document).on("click", mymapPaginationClass + '[data-paginator-count="' + mymapPaginatorCount + '"]', function (a) {
            a.preventDefault(), mapLoadingTimer = setTimeout(mapLoading, 750), mymapNextPageUrl = a.target.href, mapLoadPosts()
        }), window.addEventListener("popstate", function (a) {
            mymapNextPageUrl = document.URL, mapLoadPosts()
        }))
    },
            paginatorCount = 0,
            paginatorCountSetUp = 1,
            paginatorTotalCount = 0;
    for (var key in malinkySettings)
        $(malinkySettings[key].posts_wrapper).length && $(malinkySettings[key].post_wrapper).length && $(malinkySettings[key].pagination_wrapper).length && $(malinkySettings[key].next_page_selector).length && paginatorTotalCount++;
    for (var key in malinkySettings)
        if ($(malinkySettings[key].posts_wrapper).length && $(malinkySettings[key].post_wrapper).length && $(malinkySettings[key].pagination_wrapper).length && $(malinkySettings[key].next_page_selector).length) {
            1 == paginatorTotalCount ? ($(malinkySettings[key].posts_wrapper).attr("data-paginator-count", paginatorCountSetUp), $(malinkySettings[key].pagination_wrapper).attr("data-paginator-count", paginatorCountSetUp), $(malinkySettings[key].next_page_selector).attr("data-paginator-count", paginatorCountSetUp)) : ($(malinkySettings[key].posts_wrapper).attr("data-paginator-count", paginatorCountSetUp), $(malinkySettings[key].posts_wrapper + " " + malinkySettings[key].pagination_wrapper).attr("data-paginator-count", paginatorCountSetUp), $(malinkySettings[key].posts_wrapper + " " + malinkySettings[key].next_page_selector).attr("data-paginator-count", paginatorCountSetUp), paginatorCountSetUp++);
            var mapAjaxLoader = malinkySettings[key].ajax_loader,
                    mapCssLoadMore = malinkySettings[key].malinky_load_more,
                    mapCssLoadMoreButton = malinkySettings[key].malinky_load_more_button,
                    mapInfiniteScrollBuffer = parseInt(malinkySettings[key].infinite_scroll_buffer),
                    mapLoadingTimer = "",
                    mapLoadingMorePostsText = malinkySettings[key].loading_more_posts_text,
                    mapLoadMoreButtonText = malinkySettings[key].load_more_button_text,
                    mapPaginationClass = malinkySettings[key].pagination_wrapper,
                    mapPaginationClassPixelsToDocBottom = $(document).height() - $(mapPaginationClass).offset().top,
                    mapPagingType = malinkySettings[key].paging_type,
                    mapPostsWrapperClass = malinkySettings[key].posts_wrapper,
                    mapPostClass = malinkySettings[key].post_wrapper,
                    mapNextPageSelector = malinkySettings[key].next_page_selector,
                    mapPaginatorCount = ++paginatorCount,
                    mapUserCallback = malinkySettings[key].callback_function;
            if (1 == paginatorTotalCount)
                var mapNextPageUrl = $(malinkySettings[key].next_page_selector).attr("href");
            else
                var mapNextPageUrl = $(malinkySettings[key].posts_wrapper + " " + malinkySettings[key].next_page_selector).attr("href");
            init()
        }
}(jQuery);