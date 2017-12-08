let data = {
    episodes: [],
    show_stories: false,
    default_table: false,
    loaded: false,
    columns: ['story', 'episode', 'id'],
    tableOptions: {
        headings: {
            'story': 'Сторимейз',
            'episode': 'Эпизод',
            'id': 'Ссылка'
        },
        highlightMatches: true,
        perPageValues: [10, 30, 100, 300, 1000, 10000],
        perPage: 300,
        pagination: {
            dropdown: true
        },
        texts: {
            count: "Записи с {from} по {to} из {count}",
            filter: "Поиск:",
            filterPlaceholder: "запрос",
            limit: "Записи на странице:",
            page: "Страница:",
            noResults: "Нет подходящих записей",
            filterBy: "Фильтр по {column}",
            loading: 'Загрузка...',
            defaultOption: 'Выбрать {column}'
        }
    }
};

Vue.use(VueTables.ClientTable);

let app = new Vue({
    el: '#app',
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
    data.loaded = true;
}, function (err) {
    console.error(err);
});
