module.exports = {
  reactStrictMode: true,
  async rewrites() {
    if (process.env.NODE_ENV !== 'production') {
        return [
            {
                destination: 'http://localhost:3000',
                source: '/',
            },
        ];
    }
},
}
