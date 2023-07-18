module.exports = {
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
    require('postcss-import'), // postcss-import needs to be first
    require('tailwindcss'),
    require('postcss-nesting'),
    require('autoprefixer')
  ],
}
