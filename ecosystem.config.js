module.exports = {
    apps: [
        {
            name: 'jobs',
            script: 'src/jobs/index.js',
            node_args: '--enable-source-maps',
            env: { NODE_ENV: 'production' },
            watch: false
        }
    ]
};