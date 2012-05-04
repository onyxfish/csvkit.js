var CSV = {};

CSV.csvreader = function(options) {
    options = options || {};

    this.separator   = options.separator   || ',';
    this.quote_char   = options.quote_char       || '"';
    this.escape_char  = options.escape_char      || '"';
    this.comment_char = options.comment_char     || '';
    this.column_names = options.column_names || [];
    this.columns_from_header = options.columns_from_header || true;
    this.nested_quotes = options.nested_quotes || false;

    this.rows = [];

    this.state = {
        rows:          0,
        open_record:    [],
        open_field:     '',
        last_char:      '',
        in_quoted_field:   false,
        in_commented_line: false
    };
};

CSV.csvreader.prototype.parse = function(data) {
    if (this.state.open_record.length == 0) {
        if (data.charCodeAt(0) === 0xFEFF) {
            data = data.slice(1);
        }
    }

    for (var i = 0; i < data.length; i++) {
        var c = data.charAt(i);
        switch (c) {
            // escape and separator may be the same char, typically '"'
            case this.escape_char:
            case this.quote_char:
                if (this.state.in_commented_line) break;
                var isEscape = false;
                if (c === this.escape_char) {
                    var nextChar = data.charAt(i + 1);

                    if (this._is_escapable(nextChar)) {
                        this._add_character(nextChar);
                        i++;
                        isEscape = true;
                    }
                }
                if (!isEscape && (c === this.quote_char)) {
                    if (this.state.open_field && !this.state.in_quoted_field) {
                        this.state.in_quoted_field = true;
                        break;
                    }
                    if (this.state.in_quoted_field) {
                        // closing quote should be followed by separator unless the nested quotes option is set
                        var nextChar = data.charAt(i + 1);
                        if (nextChar && nextChar != '\r' && nextChar != '\n' && nextChar !== this.separator && this.nested_quotes != true) {
                            throw new Error("separator expected after a closing quote; found " + nextChar);
                        } else {
                            this.state.in_quoted_field = false;
                        }
                    } else if (this.state.open_field === '') {
                        this.state.in_quoted_field = true;
                    }
                }
                break;
            case this.separator:
                if (this.state.in_commented_line) break;
                if (this.state.in_quoted_field) {
                    this._add_character(c);
                } else {
                    this._add_field();
                }
                break;
            case '\n':
                // handle CRLF sequence
                if (!this.state.in_quoted_field && (this.state.last_char === '\r')) {
                    break;
                }
            case '\r':
                if (this.state.in_commented_line) {
                    this.state.in_commented_line = false;
                } else if (this.state.in_quoted_field) {
                    this._add_character(c);
                } else {
                    this._add_field();
                    this._add_record();
                }
                break;
            case this.comment_char:
                if (this.state.in_commented_line) break;
                if (this.state.open_record.length === 0 && this.state.open_field === '' && !this.state.in_quoted_field) {
                    this.state.in_commented_line = true;
                } else {
                    this._add_character(c);
                }
            default:
                if (this.state.in_commented_line) break;
                this._add_character(c);
        }

        this.state.last_char = c;
    }
};

CSV.csvreader.prototype._is_escapable = function(c) {
    if ((c === this.escape_char) || (c === this.quote_char)) {
        return true;
    }
    return false;
};

CSV.csvreader.prototype._add_character = function(c) {
    this.state.open_field += c;
};

CSV.csvreader.prototype._add_field = function() {
    this.state.open_record.push(this.state.open_field);
    this.state.open_field = '';
    this.state.in_quoted_field = false;
};

CSV.csvreader.prototype._add_record = function() {
    if (this.columns_from_header && this.state.rows === 0) {
        this.column_names = this.state.open_record;
    } else if (this.column_names != null && this.column_names.length > 0) {
        var objResult = {};
        for (var i = 0; i < this.column_names.length; i++) {
            objResult[this.column_names[i]] = this.state.open_record[i];
        }

        this.rows.push(objResult);
    } else {
        this.rows.push(this.state.open_record);
    }

    this.state.rows++;
    this.state.open_record = [];
    this.state.open_field = '';
    this.state.in_quoted_field = false;
};

