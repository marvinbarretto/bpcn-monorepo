if (!process.env.npm_config_ci) {
    console.error('\n❌ Please use `npm ci` instead of `npm install`.\n');
    process.exit(1);
} 