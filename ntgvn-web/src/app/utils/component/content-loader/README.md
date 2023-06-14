# Content Loader for Angular 8+ Apps

Facebook content loader loading effect for Angular 14+ apps. It's a fancy way to tell your users that there's something loading.

content-loader is simple and easy to use. It also comes with the two directions

## Table of contents

  * [Features](#features)
  * [Getting started](#getting-started)
  * [API](#api)
  * [Custom Styles](#custom-styles)
  * [Contributing](#contributing)

## Features
- [x] Easy and simple to use.
- [x] Easy to setup.
- [x] No Dependencies.
- [x] Fancy Animations.

## Getting started

### Step 1: Install `content-loader`:

#### NPM
```shell
npm i --save content-loader
```
### Step 2: Import the `ContentLoaderModule` into your module:
```ts
import { ContentLoaderModule } from  'content-loader';
@NgModule({
  ...
  imports: [ ContentLoaderModule ],
  ...
})
export class AppModule {}
```

### Step 3: Use the `content-loader` component:
```html
<content-loader></content-loader>
```
You can customize it with different inputs - check [API](#api) for more details.

Example:
```html
<content-loader [shape]="'square'" [width]="'70px'"></content-loader>
```

## API
### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| shape | `'circle'`  OR  `'square'`  OR  `'rect'` | `rect` | no | Set content loader shape. |
| width | `string` | `'80%'` | no | Set content loader width. In case of shape is `'circle'` or `'square'` use width with `px` unit. |
| height | `string` | `'12px'` | no | Set content loader height. In case of shape is `'circle'` or `'square'` content loader height will `equal` content loader width. |
| borderRadius | `string` | `'5px'` | no | Set content loader border radius. In case of shape is `'circle'` borderRadius equals `'50%'` |
| direction | `'ltr'`  OR  `'rtl'` | `'ltr'` | no | Set content loader direction. |

## Custom Styles
If you are not happy with default styles you can easily override them with your styles like that:
```css
.content-loader .content-loader-shape {
	// Your styles go here...
}
```
Note that: content loader effect animation here depends on css `linear-gradient` property so, if you want to change its color you can edit it or you can unset it and change its `background-color` value if you don't want the content loader effect animation.

## Contributing

Contributions are welcome. You can start by looking at [issues](https://github.com/hoainhaannguyen94/content-loader/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) with label *Help wanted*  or creating new Issue with proposal or bug report.
