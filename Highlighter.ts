import * as Truth from "truth-compiler";


const classes = {
	code: "truth-code",
	statement: "truth-statement",
	uri: "truth-syntax-uri",
	pattern: "truth-syntax-pattern",
	comment: "truth-syntax-comment",
	term: "truth-syntax-term",
	type: "truth-syntax-type",
	tag: "truth-syntax-tag",
	operator: "truth-syntax-operator",
	ellipsis: "truth-syntax-ellipsis",
	joint: "truth-syntax-joint",
	combinator: "truth-syntax-combinator",
	tab: "truth-indent-tab"
}


/** */
export class Highlighter
{
	/**
	 * Converts the specified sourceText into an HTML string
	 * 
	 * @param sourceText The Truth source code to convert
	 * @param indent An optional string to use for indentation.
	 * Defaults to an empty string, which results in a minified
	 * response.
	 */
	static toHtml(sourceText: string, indent = "")
	{
		const program = new Truth.Program();
		const doc = program.documents.create(sourceText);
		const divs: HtmlDiv[] = [];
		
		function span(content: string, ...classNames: string[])
		{
			divs[divs.length - 1].children.push(new HtmlSpan(content, classNames));
		}
		
		function nbsp()
		{
			divs[divs.length - 1].children.push(new Space());
		}
		
		for (const statement of doc.eachStatement())
		{
			divs.push(new HtmlDiv());
			
			for (let i = -1; ++i < statement.indent;)
			{
				if (statement.sourceText[i] === Truth.Syntax.tab)
					span("", classes.tab);
				
				else if (statement.sourceText[i] === Truth.Syntax.space)
					nbsp();
			}
			
			if (statement.isComment)
			{
				span(statement.sourceText.slice(statement.indent), classes.comment);
			}
			else if (statement.isWhitespace)
			{
				
			}
			else
			{
				for (let i = -1; ++i < statement.allDeclarations.length;)
				{
					if (i > 0)
					{
						span(Truth.Syntax.combinator, classes.combinator);
						nbsp();
					}
					
					const decl = statement.allDeclarations[i];
					const subject = decl.boundary.subject;
					const cls = [classes.term, classes.type];
					
					if (subject instanceof Truth.Pattern)
						cls.push(classes.pattern);
					
					else if (subject instanceof Truth.Uri)
						cls.push(classes.uri);
					
					span(subject.toString(), ...cls);
				}
				
				if (statement.annotations.length > 0 || 
					statement.isRefresh ||
					statement.isVacuous)
				{
					nbsp();
					span(Truth.Syntax.joint, classes.joint);
				}
				else continue;
				
				if (statement.allAnnotations.length > 0)
					nbsp();
				
				for (let i = -1; ++i < statement.allAnnotations.length;)
				{
					if (i > 0)
					{
						span(Truth.Syntax.combinator, classes.combinator);
						nbsp();
					}
					
					const anno = statement.allAnnotations[i];
					const subject = anno.boundary.subject;
					span(subject.toString(), classes.term, classes.tag);
				}
			}
		}
		
		const newLine = indent ? "\n" : "";
		const units = [`<div class="${classes.code}">`, newLine];
		
		for (let i = -1; ++i < divs.length;)
		{
			if (i > 0)
				units.push("\n");
			
			const div = divs[i];
			units.push(indent, `<div class="${classes.statement}">`);
			
			if (div.children.length === 0)
			{
				units.push("</div>");
				continue;
			}
			
			if (indent !== "")
				if (div.children.length > 0)
					units.push(newLine, indent, indent);
			
			for (const child of div.children)
			{
				if (child instanceof HtmlSpan)
				{
					units.push(
						`<span class="${child.classNames.join(" ")}">` +
						child.content +
						`</span>`);
				}
				else units.push("&nbsp;");
			}
			
			units.push(newLine, indent, "</div>");
		}
		
		units.push(newLine, "</div>");
		return units.join("");
	}
}


/** */
class HtmlDiv
{
	/** */
	constructor() { }
	
	/** */
	readonly children: (HtmlSpan | Space)[] = [];
}


/** */
class HtmlSpan
{
	constructor(
		readonly content: string,
		readonly classNames: string[]) { }
}

/** */
class Space { }
