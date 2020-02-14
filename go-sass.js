const sass = require('node-sass');

const config = {
    src: './ad-hoc-style.scss',
    dist: './ad-hoc-style.css';
}

sass.render({
    file: config.src
});