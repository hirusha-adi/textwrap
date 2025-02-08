class TextWrapper {
  constructor(options = {}) {
    this.width = options.width || 70;
    this.expandTabs = options.expandTabs !== false;
    this.tabSize = options.tabSize || 8;
    this.replaceWhitespace = options.replaceWhitespace !== false;
    this.dropWhitespace = options.dropWhitespace !== false;
    this.initialIndent = options.initialIndent || "";
    this.subsequentIndent = options.subsequentIndent || "";
    this.fixSentenceEndings = options.fixSentenceEndings || false;
    this.breakLongWords = options.breakLongWords !== false;
    this.breakOnHyphens = options.breakOnHyphens !== false;
    this.maxLines = options.maxLines || null;
    this.placeholder = options.placeholder || " [...]";
  }

  wrap(text) {
    if (this.expandTabs) {
      text = text.replace(/\t/g, " ".repeat(this.tabSize));
    }

    if (this.replaceWhitespace) {
      text = text.replace(/\s+/g, " ");
    }

    let words = text.split(" ");
    let lines = [];
    let currentLine = this.initialIndent;
    let currentLength = currentLine.length;

    for (let word of words) {
      let newLength = currentLength + word.length + (currentLength > 0 ? 1 : 0);

      if (newLength > this.width) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = this.subsequentIndent + word;
        } else {
          lines.push(word);
        }
        currentLength = currentLine.length;
      } else {
        currentLine += (currentLength > 0 ? " " : "") + word;
        currentLength = newLength;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    if (this.maxLines && lines.length > this.maxLines) {
      return lines.slice(0, this.maxLines - 1).concat(this.placeholder);
    }

    return lines;
  }

  fill(text) {
    return this.wrap(text).join("\n");
  }

  shorten(text, width, placeholder = " [...]") {
    text = text.replace(/\s+/g, " ");
    if (text.length <= width) return text;

    let words = text.split(" ");
    let shortened = [];
    let currentLength = 0;

    for (let word of words) {
      let newLength = currentLength + word.length + (currentLength > 0 ? 1 : 0);
      if (newLength + placeholder.length > width) break;

      shortened.push(word);
      currentLength = newLength;
    }

    return shortened.join(" ") + placeholder;
  }

  static dedent(text) {
    let lines = text.split("\n");
    let minIndent = Math.min(
      ...lines.filter(line => line.trim()).map(line => line.match(/^\s*/)[0].length)
    );

    return lines.map(line => line.slice(minIndent)).join("\n");
  }

  static indent(text, prefix, predicate = line => line.trim().length > 0) {
    return text
      .split("\n")
      .map(line => (predicate(line) ? prefix + line : line))
      .join("\n");
  }
}

// Example usage:
const wrapper = new TextWrapper({ width: 40, initialIndent: "* ", subsequentIndent: "  " });

let text = "JavaScript is a powerful and flexible programming language widely used for web development.";
console.log(wrapper.shorten(text, 30));
console.log(TextWrapper.dedent("    hello\n      world"));
console.log(TextWrapper.indent("hello\n\nworld", "+ "));
