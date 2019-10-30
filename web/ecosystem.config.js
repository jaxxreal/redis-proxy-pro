module.exports = {
    apps: [{
        name: 'app',
        script: './web/index.js',
        instances: 'max',
        autorestart: true,
        max_memory_restart: '1G',
        env: { NODE_ENV: 'development' },
        env_production: { NODE_ENV: 'production' }
    }, {
        name: 'app-watcher',
        script: 'npm start',
        instances: 1,
        autorestart: true,
        watch: './**/*.js',
        env: { NODE_ENV: 'development' },
        env_production: { NODE_ENV: 'production' }
    }]
};