# Truth Syntax Highlighter

This is a syntax highlighting utility for Truth. It uses the Truth compiler to parse Truth code, and emits an HTML representation of the code that can be styled with CSS.

## Installation

```
npm install truth-syntax-highlighter --save
```

If you're using TypeScript, you can add typings for the highlighter by modifying your `tsconfig.json` to look like this:

```
{
	"compilerOptions": {
		...
		"types": ["truth-syntax-highlighter"]
	}
}
```

## Usage

```typescript
import { Highlighter } from "truth-syntax-highlighter";

const sourceText = `
// Truth code goes here
`;

const indentString = "\t";
const truthHtmlText = Highlighter.toHtml(sourceText, indentString);
```

The emitted code contains no CSS styling, only class names that allow you to do so. There is a template CSS file included in this repo that you may use to style the code.
