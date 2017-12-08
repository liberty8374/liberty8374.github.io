let data = {
    episodes: [],
    show_stories: false
};

let app = new Vue({
    el: '#episodes_table',
    data: data,
    methods: {
        filtered() {
            return this.episodes.filter(episode => {
                if (!this.show_stories && episode.type === 'story') return false;
                if (episode.story === 'none') return false;
                return true;
            });
        }
    }
});

$.getJSON('/episodes.json').then(function (json) {
    data.episodes = json.episodes;
}, function (err) {
    console.error(err);
});
