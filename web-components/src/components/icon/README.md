# Icons

We are using [neuicons](https://neuicons.com) and put them all under `src/assets/icons` so our bundler can dynamically
import them.

## Handling colors

With neuicons we can style all icons with setting the fill color of all paths:
```css
path {
  fill: currentColor;
}
```

Other icon libraries might come with color settings inside the svg. In these cases you want to remove the css rule 
mentioned above and make sure the svgs react to the `currentColor` setting. We included an svg plugin in the bundling 
process that can be configured to replace color definitions with `currentColor`:
```javascript
svg({
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          convertColors: {
            currentColor: true,
          },
          removeViewBox: false,
        },
      },
    },
    {
      name: 'removeDimensions',
    },
  ],
})
```