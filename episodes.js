let data = {
    episodes: [],
    show_stories: false
};

let app = new Vue({
    el: '#episodes_table',
    data: data
});

$.getJSON('/episodes.json').then(function (json) {
    data.episodes = json.episodes;
}, function (err) {
    console.error(err);
});
