var Search = {
    popularHashtags: [],
    isInited: false,
    initHashtagSearch: function(popularHashTags) {
        if (this.isInited) return;

        this.popularHashtags = popularHashTags;
        this.isInited = true;

        $("#global-search").on('search-by-tag', function() {
            var suggestionsArray = Search.popularHashtags;
            var quicksearchInput = $(this);

            function obtainer(query, cb, asyncResults) {
                if (!query) {
                    var mapped = $.map(suggestionsArray, function(item) {
                        return { value: item.tagtext } });
                    cb(mapped);
                } else {
                    $.get('/site/tags.html', { query: query }, function(response) {
                        var items = [];
                        for (var i in response) {
                            var item = response[i];
                            items.push({ value: item.tagtext });
                        }
                        asyncResults(items);
                    }, 'json');
                }
            }

            quicksearchInput.typeahead({
                hint: true,
                highlight: true,
                minLength: 0
            }, {
                name: "hashtag",
                displayKey: "value",
                source: obtainer,
                limit: 30
            });

            quicksearchInput.bind('typeahead:select', function(ev, suggestion) {
                quicksearchInput.typeahead('val', '#' + suggestion.value);
                location.href = '/site/search.html?s=' + '%23' + suggestion.value;
            });
        });

        $("#global-search1").on('search-by-tag', function() {
            var suggestionsArray = Search.popularHashtags;
            var quicksearchInput = $(this);

            function obtainer(query, cb, asyncResults) {
                if (!query) {
                    var mapped = $.map(suggestionsArray, function(item) {
                        return { value: item.tagtext } });
                    cb(mapped);
                } else {
                    $.get('/site/tags.html', { query: query }, function(response) {
                        var items = [];
                        for (var i in response) {
                            var item = response[i];
                            items.push({ value: item.tagtext });
                        }
                        asyncResults(items);
                    }, 'json');
                }
            }

            quicksearchInput.typeahead({
                hint: true,
                highlight: true,
                minLength: 0
            }, {
                name: "hashtag",
                displayKey: "value",
                source: obtainer,
                limit: 30
            });

            quicksearchInput.bind('typeahead:select', function(ev, suggestion) {
                quicksearchInput.typeahead('val', '#' + suggestion.value);
                location.href = '/site/search.html?s=' + '%23' + suggestion.value;
            });
        });
    },
    destroy: function() {
        $("#global-search").typeahead('destroy');
         $("#global-search1").typeahead('destroy');
        this.isInited = false;
    }
};
