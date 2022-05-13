module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,css,js,html}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};