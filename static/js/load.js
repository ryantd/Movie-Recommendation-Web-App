(function ($) {
    $(".filter-group" ).on("click", ".filter-controller", function() {
         var func = $(this).attr('data-func');
         $( ".load-btn-new" ).attr("data-cat", func);
         $( ".load-btn-new" ).attr("data-num", 8);
         $( ".load-btn-old" ).attr("data-cat", func);
         $( ".load-btn-old" ).attr("data-num", 8);
         next($(".load-btn-new"));
    });
    $( ".load-more" ).on("click", ".load-btn-new", function() { 
        next($(this));
    });
    
    $( ".load-more" ).on("click", ".load-btn-old", function() { 
        previous($(this));
    });
    
    function previous(selector) {
        var loadBtn = selector;
        var current = loadBtn.attr('data-num') - 18;
        var now = loadBtn.attr('data-num') - 9;
        var cat = loadBtn.attr('data-cat');
        $.getJSON( "/select/" + cat, function( responseMessage ) {
            var text = '';
            for (var i = 1; i <= 9; i++) {
                var next = "";
                if (i % 3 === 1) {
                    next += '<div class="row">';
                }
                next += '<div class="col-md-4 filter-entry" align="center"><a href="/movie/' + responseMessage[Number(current) + i].imdbId + '"><img src="' + responseMessage[Number(current) + i].json.Poster + '"  alt="' + responseMessage[Number(current) + i].title + '" /></a>'; 
                next += "<p>" + responseMessage[Number(current) + i].title + " / " + responseMessage[Number(current) + i].year + " / " + responseMessage[Number(current) + i].json.imdbRating + "</p>";
                next += '</div>';
                if (i % 3 === 0) {
                    next += '</div>';
                }
                text += next;
            }
            $(".filter-container").html(text);
            loadBtn.attr("data-num", Number(now));
            $( ".load-btn-new" ).attr("data-num", Number(now));
        });
    }
    
    function next(selector) {
        var loadBtn = selector;
        var current = loadBtn.attr('data-num');
        var cat = loadBtn.attr('data-cat');
        $.getJSON( "/select/" + cat, function( responseMessage ) {
            var text = '';
            for (var i = 1; i <= 9; i++) {
                var next = "";
                if (i % 3 === 1) {
                    next += '<div class="row">';
                }
                next += '<div class="col-md-4 filter-entry" align="center"><a href="/movie/' + responseMessage[Number(current) + i].imdbId + '"><img src="' + responseMessage[Number(current) + i].json.Poster + '"  alt="' + responseMessage[Number(current) + i].title + '" /></a>'; 
                next += "<p>" + responseMessage[Number(current) + i].title + " / " + responseMessage[Number(current) + i].year + " / " + responseMessage[Number(current) + i].json.imdbRating + "</p>";
                next += '</div>';
                if (i % 3 === 0) {
                    next += '</div>';
                }
                text += next;
            }
            $(".filter-container").html(text);
            loadBtn.attr("data-num", Number(current) + 9);
            $( ".load-btn-old" ).attr("data-num", Number(current) + 9);
        });
    }
    
})(jQuery);