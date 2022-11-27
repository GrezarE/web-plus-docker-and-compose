require('dotenv').config();

const {
    DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/main', DEPLOY_REPO
} = process.env;

module.exports = {
  deploy: {
    production: {
        user: DEPLOY_USER,
        host: DEPLOY_HOST,
        ref: DEPLOY_REF,
        repo: DEPLOY_REPO,
        path: DEPLOY_PATH,
        'post-deploy': 'docker compose up -d',
    },
},
};
