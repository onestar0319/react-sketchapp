> **requires [Sketch 43 Beta](https://sketchapp.com/beta/) or higher**
> This project is currently in **alpha and APIs are subject to change**. If you found the repo on npm — the source (& docs, oops) is private for now; it will be announced on <a href="jon.gold/txt">my mailing list</a> and <a href="http://twitter.com/jongold">Twitter</a> very soon :)

<img alt="react-sketchapp" src="https://cloud.githubusercontent.com/assets/591643/22898688/146aea8e-f1dd-11e6-934c-cdbd29b82a0e.png" height="72px" />

A React renderer for [Sketch.app](https://www.sketchapp.com/) :atom_symbol: :gem:

[![npm](https://img.shields.io/npm/v/react-sketchapp.svg)](https://www.npmjs.com/package/react-sketchapp)
[![CircleCI](https://circleci.com/gh/airbnb/react-sketchapp.svg?style=shield&circle-token=6a90e014d72c4b27b87b0fc43ec4590117b466fc)](https://circleci.com/gh/airbnb/react-sketchapp)
![Sketch.app](https://img.shields.io/badge/Sketch.app-43-brightgreen.svg)

## Features

* **Declarative.** All the lessons we've learnt from the React model of programming. A comfortable layer over Sketch’s API.
* **Familiar.** Flexbox layouts. `react-native` components. You already know how to use `react-sketchapp`.
* **Data-based.** Pipe in real data from JSON files, APIs, and databases.
* **Universal.** Start from scratch, or use your existing component libraries

## Documentation

* [Usage](#usage)
* [FAQ](/docs/FAQ.md)
* [API Reference](/docs/API.md)
* [Styling](/docs/styling.md)
* [Universal Rendering](/docs/universal-rendering.md)
* [Troubleshooting](/docs/troubleshooting.md)

## Usage
`react-sketchapp` projects are implemented as [Sketch plugins](http://developer.sketchapp.com/).

There are several ways to build Sketch plugins:

### Using a template
The simplest way to build Sketch plugins with modern JavaScript is [`skpm`](https://github.com/sketch-pm/skpm) 💎📦 with the `react-sketchapp-skpm-example` template. Feel free to remove anything you're not using.

Install `skpm`, if you don't have it already:
```bash
npm install -g skpm
```

create a new project:
```bash
mkdir my-rad-sketch-plugin
cd my-rad-sketch-plugin
# Initialize this plugin with the template
skpm init git+ssh://git@github.com:jongold/react-sketchapp-skpm-example.git
# Install dependencies
npm install
# Setup an alias from the .sketchplugin to the sketch plugins folder
skpm link .
```

Then, to build your plugin (will auto update when you change the code)
```bash
npm run watch
```

And write your plugin in `src/my-command.js`
```js
import React from 'react';
import { render, Text, View } from 'react-sketchapp';

const Document = props =>
  <View>
    <Text>Hello world!</Text>
  </View>;

export default function (context) {
  render(<Document />, context);
}
```

Run your plugin in Sketch via `Plugins → [your plugin name] → my-command`.

Refer to the [skpm docs](https://github.com/sketch-pm/skpm) for more information about skpm.

### The manual way

Feel free to use whatever build process you're comfortable with — just [disable CocoaScript](http://developer.sketchapp.com/introduction/plugin-bundles/#disablecocoascriptpreprocessor) and disabled [Sketch's caching mechanism](http://developer.sketchapp.com/introduction/preferences#always-reload-scripts-before-running)
```
defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool YES
```

You can then use [react-native-packager](https://github.com/facebook/react-native/tree/master/packager), [rollup](http://rollupjs.org/), [webpack](https://webpack.github.io/) etc.

[`react-sketchapp-webpack-example`](http://github.com/jongold/react-sketchapp-webpack-example) is a minimal boilerplace to start developing with Webpack.

### Examples
`react-sketchapp` includes [a folder of examples](example-plugin/) showing how you might use it to work with a JavaScript [design system](example-plugin/designSystem.js).
* [Styleguide](example-plugin/Styleguide.js)
* [Twitter-style profiles](example-plugin/Profiles.js)

Clone & build the repo, and symlink the examples:
```bash
git clone git@github.com:airbnb/react-sketchapp.git && cd react-sketchapp
npm install && npm run build:plugin
./symlink-plugin.sh
```

Open Sketch; examples will be in `Plugins → react-example`.


### Contributing
Contributions are more than welcome. Just submit a PR with a description of your changes. Please attach screenshots and Sketch files (if relevant) to your Pull Requests for review.

### Issues, bugs, or feature requests
File GitHub issues for anything that is unexpectedly broken. If there are issues with generated Sketch files please attach them to the issue. If you have ideas or feature requests you should also file a GitHub issue.
