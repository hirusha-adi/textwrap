const _whitespace = "\t\n\x0b\x0c\r ";
const unicode_whitespace_trans = Array.from(_whitespace)
  .reduce((acc, char) => {
    acc[char.charCodeAt(0)] = ' '.charCodeAt(0);
    return acc;
  }, {});

const word_punct = '[\\w!"\'&.,?]';
const letter = '[^\\d\\W]';
const whitespace = `[${_whitespace.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`;
const nowhitespace = `[^${whitespace.slice(1)}`;

const wordsep_re = new RegExp(
  `(
    ${whitespace}+ 
  |
    (?<=${word_punct}) -{2,} (?=\\w)
  |
    ${nowhitespace}+? (?:
        -(?: (?<=${letter}{2}-) | (?<=${letter}-${letter}-))
        (?= ${letter} -? ${letter})
      |
        (?=${whitespace}|\\Z)
      |
        (?<=${word_punct}) (?=-{2,}\\w)
    )
  )`, 'x'
);

// Clean-up
delete word_punct;
delete letter;
delete nowhitespace;


class TextWrapper {

  constructor(options) {
    this.width = options.width || 80;
    this.initial_indent = options.initial_indent || '';
    this.subsequent_indent = options.subsequent_indent || '';
    this.expand_tabs = options.expand_tabs || false;
    this.replace_whitespace = options.replace_whitespace || false;
    this.fix_sentence_endings = options.fix_sentence_endings || false;
    this.break_long_words = options.break_long_words || true;
    this.drop_whitespace = options.drop_whitespace || false;
    this.break_on_hyphens = options.break_on_hyphens || false;
    this.tabsize = options.tabsize || 8;
    this.max_lines = options.max_lines || null;
    this.placeholder = options.placeholder || '';
  }
}