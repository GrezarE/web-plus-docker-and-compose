require('dotenv').config();

const {
    DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master', DEPLOY_REPO
} = process.env;

module.exports = {
    apps: [{
        name: "kupipodariday-backend",
        script: "./dist/main.js",
    }],
    deploy: {
        production: {
            user: DEPLOY_USER,
            host: DEPLOY_HOST,
            ref: DEPLOY_REF,
            repo: DEPLOY_REPO,
            path: DEPLOY_PATH,
            'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/current`,
            'post-deploy': 'docker compose up --build -d',
        },
    },
}
