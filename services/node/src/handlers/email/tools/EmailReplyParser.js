/**
 * Parse out email-replies.
 */

var EmailReplyParser = {
	VERSION: "0.4",

  	// Public: Splits an email body into a list of Fragments.
	//
	// text - A String email body.
	//
	// Returns an Email instance.
	read: function(text) {
		var email = new Email();
		return email.read(text);
	},

	// Public: Get the text of the visible portions of the given email body.
	//
	// text - A String email body.
	// [optional, default: false] include_signatures - Whether or not to include signatures in reply
	//
	// Returns a String.
	parse_reply: function (text, include_signatures) {
		if(typeof(include_signatures)==='undefined') include_signatures = false;
		return this.read(text).visible_text(include_signatures);
	}
};

	// Public: Get the text of the visible portions of the given email body.
	//
	// text - A String email body.
	// [optional, default: false] include_signatures - Whether or not to include signatures in reply
	//
	// Returns a String.
	parse_reply: function (text, include_signatures) {
		if(typeof(include_signatures)==='undefined') include_signatures = false;
		
	}
};

String.prototype.trim = function() {
	return this.replace(/^\s*|\s*$/g, "");
}

String.prototype.ltrim = function() {
	return this.replace(/^\s*/g, "");
}

String.prototype.rtrim = function() {
	return this.replace(/\s*$/g, "");
}

String.prototype.reverse = function() {
    var s = "";
    var i = this.length;
    while (i>0) {
        s += this.substring(i-1,i);
        i--;
    }
    return s;
}

//http://flochip.com/2011/09/06/rubys-string-gsub-in-javascript/
String.prototype.gsub = function(source, pattern, replacement) {
	var match, result;
	if (!((pattern != null) && (replacement != null))) {
		return source;
	}
	result = '';
	while (source.length > 0) {
		if ((match = source.match(pattern))) {
			result += source.slice(0, match.index);
			result += replacement;
			source = source.slice(match.index + match[0].length);
		}
		else {
			result += source;
			source = '';
		}
	}
	return result;
};

//http://3dmdesign.com/development/extending-javascript-strings-with-chomp-using-prototypes
String.prototype.chomp = function() {
	return this.replace(/(\n|\r)+$/, '');
};

// An Email instance represents a parsed body String.
var Email = function() {
	this.initialize();
};

Email.prototype = {
	fragments: [],

	initialize: function() {
		this.fragments = [];
		this.fragment = null;
	},

	// Public: Gets the combined text of the visible fragments of the email body.
	//
	// [Optional, default: false] include_signatures - whether or not signatures should be visible
	//
	// Returns a String.
	visible_text: function(include_signatures) {
		var visible_text = [];
		for (var key in this.fragments) {
			if (!this.fragments[key].hidden) {
				visible_text.push(this.fragments[key].to_s());
			}
		}

		return visible_text.join("\n").rtrim();
	},

  // Splits the given text into a list of Fragments.  This is roughly done by
	// reversing the text and parsing from the bottom to the top.  This way we
	// can check for 'On <date>, <author> wrote:' lines above quoted blocks.
	//
	// text - A String email body.
	//
	// Returns this same Email instance.
	read: function(text) {
		// in 1.9 we want to operate on the raw bytes
		// text = text.dup.force_encoding('binary') if text.respond_to?(:force_encoding)

		// Check for multi-line reply headers. Some clients break up
		// the "On DATE, NAME <EMAIL> wrote:" line into multiple lines.
		var patt = /^(On\s(\n|.)*wrote:)$/m;
		var doubleOnPatt = /^(On\s(\n|.)*(^(> )?On\s)((\n|.)*)wrote:)$/m;

		var pattSwe = /^(Den\s(\n|.)*skrev:)$/m;
		var doubleOnPattSwe = /^(Den\s(\n|.)*(^(> )?Den\s)((\n|.)*)skrev:)$/m;

		if(patt.test(text) && !doubleOnPatt.test(text)) {
			var reply_header = (patt.exec(text))[0];
			// Remove all new lines from the reply header.
			text = text.replace(reply_header, reply_header.replace(/\n/g, ' ')); 
		} 

		if(pattSwe.test(text) && !doubleOnPattSwe.test(text)) {
			var reply_header = (patt.exec(text))[0];
			// Remove all new lines from the reply header.
			text = text.replace(reply_header, reply_header.replace(/\n/g, ' '));
		}

		// The text is reversed initially due to the way we check for hidden
		// fragments.
		text = text.reverse();

		// This determines if any 'visible' Fragment has been found.  Once any
		// visible Fragment is found, stop looking for hidden ones.
		this.found_visible = false

		// This instance variable points to the current Fragment.  If the matched
		// line fits, it should be added to this Fragment.  Otherwise, finish it
		// and start a new Fragment.
		this.fragment = null;

		// Use the StringScanner to pull out each line of the email content.
		var lines = text.split('\n');

		for(var i in lines) {
			this.scan_line(lines[i]);
		}

		// Finish up the final fragment.  Finishing a fragment will detect any
		// attributes (hidden, signature, reply), and join each line into a
		// string.
		this.finish_fragment();

		// Now that parsing is done, reverse the order.
		this.fragments.reverse();

		return this;
	},

	// Line-by-Line Parsing

	// Scans the given line of text and figures out which fragment it belongs
	// to.
	//
	// line - A String line of text from the email.
	//
	// Returns nothing.
	scan_line: function(line) {
		var SIG_REGEX = '(--|__|\\w-$)|(^(\\w+\\s*){1,3} ' + ("Sent from my").reverse() +  '$)';

		line = line.chomp('\n');
		if (!(new RegExp(SIG_REGEX)).test(line)) {
			line = line.ltrim();
		}

		// Mark the current Fragment as a signature if the current line is ''
		// and the Fragment starts with a common signature indicator.
		if (this.fragment != null && line == '') {
			if ((new RegExp(SIG_REGEX)).test(this.fragment.lines[this.fragment.lines.length - 1])) {
				this.fragment.signature = true;
				this.finish_fragment();
			}
		}

		// We're looking for leading `>`'s to see if this line is part of a
		// quoted Fragment.
		var is_quoted = (new RegExp('(>+)$').test(line));

		// If the line matches the current fragment, add it.  Note that a common
		// reply header also counts as part of the quoted Fragment, even though
		// it doesn't start with `>`.
		if (this.fragment != null && ((this.fragment.quoted == is_quoted) || (this.fragment.quoted && (this.quote_header(line) || line == '')))) {
			this.fragment.lines.push(line);
		}
		// Otherwise, finish the fragment and start a new one.
		else {
			this.finish_fragment();
			this.fragment = new Fragment(is_quoted, line);
		}
	},

	// Detects if a given line is a header above a quoted area.  It is only
	// checked for lines preceding quoted regions.
	//
	// line - A String line of text from the email.
	//
	// Returns true if the line is a valid header, or false.
	quote_header: function(line) {
		return (new RegExp('^:etorw.*nO$')).test(line);
	},

	// Builds the fragment string and reverses it, after all lines have been
	// added.  It also checks to see if this Fragment is hidden.  The hidden
	// Fragment check reads from the bottom to the top.
	//
	// Any quoted Fragments or signature Fragments are marked hidden if they
	// are below any visible Fragments.  Visible Fragments are expected to
	// contain original content by the author.  If they are below a quoted
	// Fragment, then the Fragment should be visible to give context to the
	// reply.
	//
	//     some original text (visible)
	//
	//     > do you have any two's? (quoted, visible)
	//
	//     Go fish! (visible)
	//
	//     > --
	//     > Player 1 (quoted, hidden)
	//
	//     --
	//     Player 2 (signature, hidden)
	//
	finish_fragment: function() {
		if (this.fragment != null) {
			this.fragment.finish();

			if (!this.found_visible) {
				if (this.fragment.quoted || this.fragment.signature || this.fragment.to_s().trim() == '')
					this.fragment.hidden = true;
				else
			 		this.found_visible = true;
			}

			this.fragments.push(this.fragment);
			this.fragment = null;
		}
	}
}

// Fragments

// Represents a group of paragraphs in the email sharing common attributes.
// Paragraphs should get their own fragment if they are a quoted area or a
// signature.
var Fragment = function(quoted, first_line) {
	this.initialize(quoted, first_line)
};

Fragment.prototype = {
	// This is an Array of String lines of content.  Since the content is
	// reversed, this array is backwards, and contains reversed strings.
	attr_reader: [],

	// This is reserved for the joined String that is build when this Fragment
	// is finished.
	content: null,

	initialize: function(quoted, first_line) {
		this.signature = false;
		this.hidden = false;
		this.quoted = quoted;
		this.lines = [first_line];
		this.content = null;
		this.lines = this.lines.filter(function(){return true});
	},

	// Builds the string content by joining the lines and reversing them.
	//
	// Returns nothing.
	finish: function() {
		this.content = this.lines.join("\n");
		this.lines = [];
		this.content = this.content.reverse();
	},

	to_s: function() {
		return this.content.toString();
	}
};

module.exports = EmailReplyParser;
