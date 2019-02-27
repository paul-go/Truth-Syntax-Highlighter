import { Highlighter } from "./Highlighter";


const sourceText = `
// Lorem ipsum
http://www.domain.com/file.truth
./path/to/file.truth.js

Container
	Value
	/[a-z] : Value

String
Email : String

Class
	Property : String
		// Lorem ipsum
		Max : Number
		Min : Number

SubClass : Class
	Property : Email
`;

const truthHtml = Highlighter.toHtml(sourceText, "\t");
console.log("\n\n" + truthHtml);
