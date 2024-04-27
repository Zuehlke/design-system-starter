# Design Tokens

The [design token community group](https://www.w3.org/community/design-tokens/) aims to provide standards for sharing 
stylistic pieces of a design system. In the case of this starter repository we take the design tokens exported from our
Figma project to share those parts. To export those tokens we used 
[this plugin](https://www.figma.com/community/plugin/888356646278934516/design-tokens).

## Why Design Tokens?

The need to share basics of a design system between UX and development tools has been around for a while. But trying to 
share bigger parts like the whole component has proven to work in the beginning before falling apart due to changes on 
both sides. Therefore, we try to share the least common multiple providing the basics of the design system while 
acknowledging the complexity of building components for a vast amount of systems.

## From Design Tokens to CSS Custom Properties

To generate usable CSS Custom Properties we use [Style Dictionary](https://amzn.github.io/style-dictionary/). This tool
lets us define custom transformers to have fine-grained control over how a design token gets transformed into various 
formats.

You can find all transformers under [web-components/tokens/transformers](../web-components/tokens/transformers).

Some of these transformers are necessary due to how the Figma plugin exports the design tokens. Others are opinionated
in how we want to use the tokens. Feel free to adapt this to what fits your needs.