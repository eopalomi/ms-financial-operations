module.exports = {
    apps: [
      {
        name: 'FinancialOperations',
        script: 'dist/app.js',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  