/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
    branches: ['main'],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits',
                releaseRules: [
                    { release: 'patch' },
                ],
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
            },
        ],
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],
        '@semantic-release/npm',
        '@semantic-release/github',
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'CHANGELOG.md', 'example/package.json'],
            },
        ],
    ],
};
