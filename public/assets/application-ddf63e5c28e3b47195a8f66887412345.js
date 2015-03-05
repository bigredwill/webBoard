/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */

(function( window, undefined ) {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	indexOf = Array.prototype.indexOf;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					if ( elem ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && /^\w+$/.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
	
	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging object literal values or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || jQuery.isArray(copy) ) ) {
					var clone = src && ( jQuery.isPlainObject(src) || jQuery.isArray(src) ) ? src
						: jQuery.isArray(copy) ? [] : {};

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,
	
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 13 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn, i = 0;
				while ( (fn = readyList[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Reset the list of functions
				readyList = null;
			}

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			return jQuery.ready();
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor
			&& !hasOwnProperty.call(obj, "constructor")
			&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwnProperty.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	trim: function( text ) {
		return (text || "").replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length, j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			if ( !inv !== !callback( elems[ i ], i ) ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
		  	[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch( error ) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}

// Mutifunctional method to get and set values to a collection
// The value/s can be optionally by executed if its a function
function access( elems, key, value, exec, fn, pass ) {
	var length = elems.length;
	
	// Setting many attributes
	if ( typeof key === "object" ) {
		for ( var k in key ) {
			access( elems, k, key[k], exec, fn, value );
		}
		return elems;
	}
	
	// Setting one attribute
	if ( value !== undefined ) {
		// Optionally, function values get executed if exec is true
		exec = !pass && exec && jQuery.isFunction(value);
		
		for ( var i = 0; i < length; i++ ) {
			fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
		}
		
		return elems;
	}
	
	// Getting an attribute
	return length ? fn( elems[0], key ) : undefined;
}

function now() {
	return (new Date).getTime();
}
(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: document.createElement("select").appendChild( document.createElement("option") ).selected,

		parentNode: div.removeChild( div.appendChild( document.createElement("div") ) ).parentNode === null,

		// Will be defined later
		deleteExpando: true,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete script.test;
	
	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';

		div = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) { 
		var el = document.createElement("div"); 
		eventName = "on" + eventName; 

		var isSupported = (eventName in el); 
		if ( !isSupported ) { 
			el.setAttribute(eventName, "return;"); 
			isSupported = typeof el[eventName] === "function"; 
		} 
		el = null; 

		return isSupported; 
	};
	
	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},
	
	expando:expando,

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		"object": true,
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache;

		if ( !id && typeof name === "string" && data === undefined ) {
			return null;
		}

		// Compute a unique ID for the element
		if ( !id ) { 
			id = ++uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			elem[ expando ] = id;
			thisCache = cache[ id ] = jQuery.extend(true, {}, name);

		} else if ( !cache[ id ] ) {
			elem[ expando ] = id;
			cache[ id ] = {};
		}

		thisCache = cache[ id ];

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			}

			// Completely remove the data cache
			delete cache[ id ];
		}
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		if ( typeof key === "undefined" && this.length ) {
			return jQuery.data( this[0] );

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
			}
			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else {
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function() {
				jQuery.data( this, key, value );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});
jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i, elem ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});
var rclass = /[\n\t]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /href|src|style/,
	rtype = /(button|input)/i,
	rfocusable = /(button|input|object|select|textarea)/i,
	rclickable = /^(a|area)$/i,
	rradiocheck = /radio|checkbox/;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspace );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ", setClass = elem.className;
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split(rspace);

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value, isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className, i = 0, self = jQuery(this),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( value === undefined ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Typecast each time if the value is a Function and the appended
			// value is therefore different each time.
			if ( typeof val === "number" ) {
				val += "";
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style
		// Using attr for specific style information is now deprecated. Use style instead.
		return jQuery.style( elem, name, value );
	}
});
var rnamespaces = /\.(.*)$/,
	fcleanup = function( nm ) {
		return nm.replace(/[^\w\s\.\|`]/g, function( ch ) {
			return "\\" + ch;
		});
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events = elemData.events || {},
			eventHandle = elemData.handle, eventHandle;

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			handleObj.guid = handler.guid;

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		var ret, type, fn, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)")
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( var j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( var j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data( elem, "handle" );
		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (e) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var target = event.target, old,
				isClick = jQuery.nodeName(target, "a") && type === "click",
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ type ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + type ];

						if ( old ) {
							target[ "on" + type ] = null;
						}

						jQuery.event.triggered = true;
						target[ type ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (e) {}

				if ( old ) {
					target[ "on" + type ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace, events;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		var events = jQuery.data(this, "events"), handlers = events[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, arguments );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this, handleObj.origType, jQuery.extend({}, handleObj, {handler: liveHandler}) ); 
			},

			remove: function( handleObj ) {
				var remove = true,
					type = handleObj.origType.replace(rnamespaces, "");
				
				jQuery.each( jQuery.data(this, "events").live || [], function() {
					if ( type === this.origType.replace(rnamespaces, "") ) {
						remove = false;
						return false;
					}
				});

				if ( remove ) {
					jQuery.event.remove( this, handleObj.origType, liveHandler );
				}
			}

		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( this.setInterval ) {
					this.onbeforeunload = eventHandle;
				}

				return false;
			},
			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

var removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		elem.removeEventListener( type, handle, false );
	} : 
	function( elem, type, handle ) {
		elem.detachEvent( "on" + type, handle );
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = now();

	// Mark it as fixed
	this[ expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();
		}
		// otherwise set the returnValue property of the original event to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var formElems = /textarea|input|select/i,

	changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !formElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information/focus[in] is not needed anymore
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return formElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return formElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			}, 
			teardown: function() { 
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				context.each(function(){
					jQuery.event.add( this, liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				});

			} else {
				// unbind live handler
				context.unbind( liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	}
});

function liveHandler( event ) {
	var stop, elems = [], selectors = [], args = arguments,
		related, match, handleObj, elem, j, i, l, data,
		events = jQuery.data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861)
	if ( event.liveFired === this || !events || !events.live || event.button && event.type === "click" ) {
		return;
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( match[i].selector === handleObj.selector ) {
				elem = match[i].elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		if ( match.handleObj.origHandler.apply( match.elem, args ) === false ) {
			stop = false;
			break;
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return "live." + (type && type !== "*" ? type + "." : "") + selector.replace(/\./g, "`").replace(/ /g, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
if ( window.attachEvent && !window.addEventListener ) {
	window.attachEvent("onunload", function() {
		for ( var id in jQuery.cache ) {
			if ( jQuery.cache[ id ].handle ) {
				// Try/Catch is to handle iframes being unloaded, see #4280
				try {
					jQuery.event.remove( jQuery.cache[ id ].handle.elem );
				} catch(e) {}
			}
		}
	});
}
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];
		
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filter = Expr.filter[ type ], found, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				Sizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					if ( type === "first" ) { 
						return true; 
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, function(all, num){
		return "\\" + (num - 0 + 1);
	}));
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function(query, context, extra, seed){
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ? function(a, b){
	return !!(a.compareDocumentPosition(b) & 16);
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = getText;
jQuery.isXMLDoc = isXML;
jQuery.contains = contains;

return;

window.Sizzle = Sizzle;

})();
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	slice = Array.prototype.slice;

// Implement the identical functionality for filter and not
var winnow = function( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ), length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},
	
	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		if ( jQuery.isArray( selectors ) ) {
			var ret = [], cur = this[0], match, matches = {}, selector;

			if ( cur && selectors.length ) {
				for ( var i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ? 
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur });
							delete matches[selector];
						}
					}
					cur = cur.parentNode;
				}
			}

			return ret;
		}

		var pos = jQuery.expr.match.POS.test( selectors ) ? 
			jQuery( selectors, context || this.context ) : null;

		return this.map(function( i, cur ) {
			while ( cur && cur.ownerDocument && cur !== context ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selectors) ) {
					return cur;
				}
				cur = cur.parentNode;
			}
			return null;
		});
	},
	
	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context || this.context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );
		
		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call(arguments).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return jQuery.find.matches(expr, elems);
	},
	
	dir: function( elem, dir, until ) {
		var matched = [], cur = elem[dir];
		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});
var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /(<([\w:]+)[^>]*?)\/>/g,
	rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<script|<object|<embed|<option|<style/i,
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,  // checked="checked" or checked (html5)
	fcloseTag = function( all, front, tag ) {
		return rselfClosing.test( tag ) ?
			all :
			front + "></" + tag + ">";
	},
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ), contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},
	
	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					 elem.parentNode.removeChild( elem );
				}
			}
		}
		
		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}
		
		return this;
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function() {
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var html = this.outerHTML, ownerDocument = this.ownerDocument;
				if ( !html ) {
					var div = ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(rinlinejQuery, "")
					// Handle the case in IE 8 where action=/test/> self-closes a tag
					.replace(/=([^="'>\s]+\/)>/g, '="$1">')
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
			} else {
				return this.cloneNode(true);
			}
		});

		// Copy the events from the original to the clone
		if ( events === true ) {
			cloneCopyEvent( this, ret );
			cloneCopyEvent( this.find("*"), ret.find("*") );
		}

		// Return the cloned set
		return ret;
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, fcloseTag);

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery(this), old = self.html();
				self.empty().append(function(){
					return value.call( this, i, old );
				});
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery(value).detach();
			}

			return this.each(function() {
				var next = this.nextSibling, parent = this.parentNode;

				jQuery(this).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, value = args[0], scripts = [], fragment, parent;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = buildFragment( args, this, scripts );
			}
			
			fragment = results.fragment;
			
			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						i > 0 || results.cacheable || this.length > 1  ?
							fragment.cloneNode(true) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;

		function root( elem, cur ) {
			return jQuery.nodeName(elem, "table") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
});

function cloneCopyEvent(orig, ret) {
	var i = 0;

	ret.each(function() {
		if ( this.nodeName !== (orig[i] && orig[i].nodeName) ) {
			return;
		}

		var oldData = jQuery.data( orig[i++] ), curData = jQuery.data( this, oldData ), events = oldData && oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var handler in events[ type ] ) {
					jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
				}
			}
		}
	});
}

function buildFragment( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		!rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
}

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;
		
		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;
			
		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
				ret = ret.concat( elems );
			}
		
			return this.pushStack( ret, name, insert.selector );
		}
	};
});

jQuery.extend({
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, fcloseTag);

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				
				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},
	
	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;
		
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			id = elem[ jQuery.expando ];
			
			if ( id ) {
				data = cache[ id ];
				
				if ( data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						} else {
							removeEvent( elem, type, data.handle );
						}
					}
				}
				
				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}
				
				delete cache[ id ];
			}
		}
	}
});
// exclude the following css properties to add px
var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rfloat = /float/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display:"block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],

	// cache check for defaultView.getComputedStyle
	getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
	// normalize float css property
	styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	return access( this, name, value, true, function( elem, name, value ) {
		if ( value === undefined ) {
			return jQuery.curCSS( elem, name );
		}
		
		if ( typeof value === "number" && !rexclude.test(name) ) {
			value += "px";
		}

		jQuery.style( elem, name, value );
	});
};

jQuery.extend({
	style: function( elem, name, value ) {
		// don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		// ignore negative width and height values #1599
		if ( (name === "width" || name === "height") && parseFloat(value) < 0 ) {
			value = undefined;
		}

		var style = elem.style || elem, set = value !== undefined;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// Set the alpha filter to set the opacity
				var opacity = parseInt( value, 10 ) + "" === "NaN" ? "" : "alpha(opacity=" + value * 100 + ")";
				var filter = style.filter || jQuery.curCSS( elem, "filter" ) || "";
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
			}

			return style.filter && style.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( ropacity.exec(style.filter)[1] ) / 100) + "":
				"";
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		name = name.replace(rdashAlpha, fcamelCase);

		if ( set ) {
			style[ name ] = value;
		}

		return style[ name ];
	},

	css: function( elem, name, force, extra ) {
		if ( name === "width" || name === "height" ) {
			var val, props = cssShow, which = name === "width" ? cssWidth : cssHeight;

			function getWH() {
				val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" ) {
					return;
				}

				jQuery.each( which, function() {
					if ( !extra ) {
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					}

					if ( extra === "margin" ) {
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					} else {
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
					}
				});
			}

			if ( elem.offsetWidth !== 0 ) {
				getWH();
			} else {
				jQuery.swap( elem, props, getWH );
			}

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style, filter;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" && elem.currentStyle ) {
			ret = ropacity.test(elem.currentStyle.filter || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				"";

			return ret === "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];

		} else if ( getComputedStyle ) {

			// Only "float" is needed here
			if ( rfloat.test( name ) ) {
				name = "float";
			}

			name = name.replace( rupper, "-$1" ).toLowerCase();

			var defaultView = elem.ownerDocument.defaultView;

			if ( !defaultView ) {
				return null;
			}

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle ) {
				ret = computedStyle.getPropertyValue( name );
			}

			// We should always get a number back from opacity
			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(rdashAlpha, fcamelCase);

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth, height = elem.offsetHeight,
			skip = elem.nodeName.toLowerCase() === "tr";

		return width === 0 && height === 0 && !skip ?
			true :
			width > 0 && height > 0 && !skip ?
				false :
				jQuery.curCSS(elem, "display") === "none";
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}
var jsc = now(),
	rscript = /<script(.|\s)*?\/script>/gi,
	rselectTextarea = /select|textarea/i,
	rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
	jsre = /=\?(&|$)/,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,

	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" ) {
			return _load.call( this, url );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div />")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function() {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function() {
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function( i, elem ) {
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function( val, i ) {
						return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
	jQuery.fn[o] = function( f ) {
		return this.bind(o, f);
	};
});

jQuery.extend({

	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7 (can't request local files),
		// so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
			function() {
				return new window.XMLHttpRequest();
			} :
			function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {}
			},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajax: function( origSettings ) {
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);
		
		var jsonp, status, data,
			callbackContext = origSettings && origSettings.context || s,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = s.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = window[ jsonp ] || function( tmp ) {
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;

				try {
					delete window[ jsonp ];
				} catch(e) {}

				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && type === "GET" ) {
			var ts = now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts + "$2");

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type === "GET" ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			script.src = s.url;
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						success();
						complete();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data || origSettings && origSettings.contentType ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			trigger("ajaxSend", [xhr, s]);
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before this point
				// so we simulate the call
				if ( !requestDone ) {
					complete();
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = jQuery.noop;
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(err) {
						status = "parsererror";
						errMsg = err;
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
					if ( !jsonp ) {
						success();
					}
				} else {
					jQuery.handleError(s, xhr, status, errMsg);
				}

				// Fire the complete handlers
				complete();

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE doesn't allow it, but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					oldAbort.call( xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch(e) { }

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( type === "POST" || type === "PUT" || type === "DELETE" ? s.data : null );
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
			// Fire the complete handlers
			complete();
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		function success() {
			// If a local callback was specified, fire it and pass it the data
			if ( s.success ) {
				s.success.call( callbackContext, data, status, xhr );
			}

			// Fire the global callback
			if ( s.global ) {
				trigger( "ajaxSuccess", [xhr, s] );
			}
		}

		function complete() {
			// Process result
			if ( s.complete ) {
				s.complete.call( callbackContext, xhr, status);
			}

			// The request was completed
			if ( s.global ) {
				trigger( "ajaxComplete", [xhr, s] );
			}

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
		}
		
		function trigger(type, args) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context || s, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
		}
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				// Opera returns 0 when status is 304
				( xhr.status >= 200 && xhr.status < 300 ) ||
				xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		// Opera returns 0 when status is 304
		return xhr.status === 304 || xhr.status === 0;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [];
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix] );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");

		function buildParams( prefix, obj ) {
			if ( jQuery.isArray(obj) ) {
				// Serialize array item.
				jQuery.each( obj, function( i, v ) {
					if ( traditional || /\[\]$/.test( prefix ) ) {
						// Treat each array item as a scalar.
						add( prefix, v );
					} else {
						// If array item is non-scalar (array or object), encode its
						// numeric index to resolve deserialization ambiguity issues.
						// Note that rack (as of 1.0.0) can't currently deserialize
						// nested arrays properly, and attempting to do so may cause
						// a server error. Possible fixes are to modify rack's
						// deserialization algorithm or to provide an option or flag
						// to force array serialization to be shallow.
						buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v );
					}
				});
					
			} else if ( !traditional && obj != null && typeof obj === "object" ) {
				// Serialize object item.
				jQuery.each( obj, function( k, v ) {
					buildParams( prefix + "[" + k + "]", v );
				});
					
			} else {
				// Serialize scalar item.
				add( prefix, obj );
			}
		}

		function add( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		}
	}
});
var elemdisplay = {},
	rfxtypes = /toggle|show|hide/,
	rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, callback ) {
		if ( speed || speed === 0) {
			return this.animate( genFx("show", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");

				this[i].style.display = old || "";

				if ( jQuery.css(this[i], "display") === "none" ) {
					var nodeName = this[i].nodeName, display;

					if ( elemdisplay[ nodeName ] ) {
						display = elemdisplay[ nodeName ];

					} else {
						var elem = jQuery("<" + nodeName + " />").appendTo("body");

						display = elem.css("display");

						if ( display === "none" ) {
							display = "block";
						}

						elem.remove();

						elemdisplay[ nodeName ] = display;
					}

					jQuery.data(this[i], "olddisplay", display);
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = jQuery.data(this[j], "olddisplay") || "";
			}

			return this;
		}
	},

	hide: function( speed, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" ) {
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2);
		}

		return this;
	},

	fadeTo: function( speed, to, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType === 1 && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = p.replace(rdashAlpha, fcamelCase);

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( ( p === "height" || p === "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit !== "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, callback ) {
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop === "height" || this.prop === "width" ) && this.elem.style ) {
			this.elem.style.display = "block";
		}
	},

	// Get the current size
	cur: function( force ) {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(jQuery.fx.tick, 13);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					var old = jQuery.data(this.elem, "olddisplay");
					this.elem.style.display = old ? old : this.options.display;

					if ( jQuery.css(this.elem, "display") === "none" ) {
						this.elem.style.display = "block";
					}
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style(this.elem, p, this.options.orig[p]);
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},
		
	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},
	
	speeds: {
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style(fx.elem, "opacity", fx.now);
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}
if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.curCSS(body, "marginTop", true) ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop, left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.curCSS(body, "marginTop",  true) ) || 0;
			left += parseFloat( jQuery.curCSS(body, "marginLeft", true) ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options, i ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( jQuery.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = jQuery( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( jQuery.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( jQuery.curCSS( elem, "left", true ), 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		var props = {
			top:  (options.top  - curOffset.top)  + curTop,
			left: (options.left - curOffset.left) + curLeft
		};
		
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = /^body|html$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.curCSS(elem, "marginTop",  true) ) || 0;
		offset.left -= parseFloat( jQuery.curCSS(elem, "marginLeft", true) ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.curCSS(offsetParent[0], "borderTopWidth",  true) ) || 0;
		parentOffset.left += parseFloat( jQuery.curCSS(offsetParent[0], "borderLeftWidth", true) ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!/^body|html$/i.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return ("scrollTo" in elem && elem.document) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			jQuery.css( this[0], type, false, "padding" ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			jQuery.css( this[0], type, false, margin ? "margin" : "border" ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}
		
		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		return ("scrollTo" in elem && elem.document) ? // does it walk and quack like a window?
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
			elem.document.body[ "client" + name ] :

			// Get document width or height
			(elem.nodeType === 9) ? // is it a document
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max(
					elem.documentElement["client" + name],
					elem.body["scroll" + name], elem.documentElement["scroll" + name],
					elem.body["offset" + name], elem.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					jQuery.css( elem, type ) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

})(window);
(function() {
  var canvasHeight, canvasWidth, lineJoin, newImg, painting, strokeColor, strokeWidth;

  canvasWidth = 600;

  canvasHeight = 600;

  painting = false;

  strokeColor = "#bada55";

  strokeWidth = 5;

  lineJoin = "round";

  newImg = "data:image/png;base64,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AAIIIIAAAggggAACCCCAAAJNCRRnyzBnWmW2RcwvQIEFSzZFRzVvzoQCPDoOCQEEEGi5gK+5T/nWckPWRKBQBPg+F8onwXEggEC+BSjf8i3K9hBoPwG+z/mxb8qRGpL5cWYrCCCAAAIIIIAAAggggAACCCCAAAIIIJCDAAHJHJDIggACCCCAAAIIIIAAAggggAACCCCAAAL5ESAgmR9HtoIAAggggAACCCCAAAIIIIAAAggggABTRi7YAABAAElEQVQCOQgQkMwBiSwIIIAAAggggAACCCCAAAIIIIAAAgggkB8BApL5cWQrCCCAAAIIIIAAAggggAACCCCAAAIIIJCDAAHJHJDIggACCCCAAAIIIIAAAggggAACCCCAAAL5ESAgmR9HtoIAAggggAACCCCAAAIIIIAAAggggAACOQgQkMwBiSwIIIAAAggggAACCCCAAAIIIIAAAgggkB8BApL5cWQrCCCAAAIIIIAAAggggAACCCCAAAIIIJCDAAHJHJDIggACCCCAAAIIIIAAAggggAACCCCAAAL5ESAgmR9HtoIAAggggAACCCCAAAIIIIAAAggggAACOQgQkMwBiSwIIIAAAggggAACCCCAAAIIIIAAAgggkB8BApL5cWQrCCCAAAIIIIAAAggggAACCCCAAAIIIJCDAAHJHJDIggACCCCAAAIIIIAAAggggAACCCCAAAL5ESAgmR9HtoIAAggggAACCCCAAAIIIIAAAggggAACOQgQkMwBiSwIIIAAAggggAACCCCAAAIIIIAAAgggkB8BApL5cWQrCCCAAAIIIIAAAggggAACCCCAAAIIIJCDQHEOeZqd5YSt8eq63W7dtip3wv5T6terh5sydqAb2Lcset/S/+2pOuxWbt7v9tqr69bNDbLtTbXtlvUoanSTBw/XueUb97id+w+7EydOuH69S92kyv7R+o2uaAtrjx13VYdqg2wnXEV59vNomN+5AeWlrluwBT9ZXVPrjtYd92/ttfFtBxmZRAABBBBAAAEEEEAAAQQQQAABBBBAoMMJ5D0gedfTq91DCze4Y8frA5FJkeEVvd3fXnWmGz2kPLmo0fdVh466f79rkdu8+2DGfNPHDXKfeutUV9Q9HvbTUfz03lfdCyt3ZFxvWEUv97l3zbQAY2nG5Vr/yz9/Lgpkhhneed4495Zzx4azUtO3PbTM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dwECkrlbkRMBBBBAAAEEEEAAAQQQQAABBBBAAAEEWilAQLKVgKyOAAIIIIAAAggggAACCCCAAAIIIIAAArkLEJDM3YqcCCCAAAIIIIAAAggggAACCCCAAAIIINBKAQKSrQRkdQQQQAABBBBAAAEEEEAAAQQQQAABBBDIXYCAZO5W5EQAAQQQQAABBBBAAAEEEEAAAQQQQACBVgoQkGwlIKsjgAACCCCAAAIIIIAAAggggAACCCCAQO4CBCRztyInAggggAACCCCAAAIIIIAAAggggAACCLRSgIBkKwFZHQEEEEAAAQQQQAABBBBAAAEEEEAAAQRyFyAgmbsVORFAAAEEEEAAAQQQQAABBBBAAAEEEECglQIEJFsJyOoIIIAAAggggAACCCCAAAIIIIAAAgggkLsAAcncrciJAAIIIIAAAggggAACCCCAAAIIIIAAAq0U6HbCUriNJxesCt8yjQACCCCAAAIIIIAAAggggAACCCCAAAII5E2AGpJ5o2RDCCCAAAIIIIAAAggggAACCCCAAAIIINCUQHG2DHOmVWZbxPwCFFiwZFN0VPPmTCjAo+OQEEAAgZYL+Jr7lG8tN2RNBApFgO9zoXwSHAcCCORbgPIt36JsD4H2E+D7nB/7phypIZkfZ7aCAAIIIIAAAggggAACCCCAAAIIIIAAAjkIEJDMAYksCCCAAAIIIIAAAggggAACCCCAAAIIIJAfAQKS+XFkKwgggAACCCCAAAIIIIAAAggggAACCCCQgwAByRyQyIIAAggggAACCCCAAAIIIIAAAggggAAC+REgIJkfR7aCAAIIIIAAAggggAACCCCAAAIIIIAAAjkIEJDMAYksCCCAAAIIIIAAAggggAACCCCAAAIIIJAfAQKS+XFkKwgggAACCCCAAAIIIIAAAggggAACCCCQgwAByRyQyIIAAggggAACCCCAAAIIIIAAAggggAAC+REgIJkfR7aCAAIIIIAAAggggAACCCCAAAIIIIAAAjkIEJDMAYksCCCAAAIIIIAAAggggAACCCCAAAIIIJAfAQKS+XFkKwgggAACCCCAAAIIIIAAAggggAACCCCQgwAByRyQyIIAAggggAACCCCAAAIIIIAAAggggAAC+REgIJkfR7aCAAIIIIAAAggggAACCCCAAAIIIIAAAjkIEJDMAYksCCCAAAIIIIAAAggg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vOUDuftJ63sQjrSQTBrEvaMi/hrXO8aBrSACRCD5CFC/JR9T1kgEegoBPs89hTzvSwSIQFcjQP3W1QizfiJABPoLAoM6lJid0czltL3KzWQe93IEtEXrwdN27eUtZfOIABEgAvEhMG/l0/KfD+6SG7/5YnwFmZsIEIFeh4BeZ3K90uuGhg0iAkSgkwhwvdJJAFmcCPQiBLheSc5gRMMxcMt2cm7PWogAESACRIAIJIaAXtivr16ZWAUsRQSIABEgAkSACBCBLkaA65UuBpjVEwEi0G8RICHZT4f2uYV39dOesVtEgAgMFAQefY8BugbKWLOfAxcBrlcG7tiz50SgvyDA9Up/GUn2gwgQge5GgD4kuxtx3o8IEAEiQASIABEgAkSACBABIkAEiAARIAJEgAgMYARISA7gwWfXiQARIAJEgAgQASJABIgAESACRIAIEAEiQASIQHcjQEKyuxHn/YgAESACRIAIEAEiQASIABEgAkSACBABIkAEiMAARoCE5AAefHadCBABIkAEiAARIAJEgAgQASJABIgAESACRIAIdDcCJCS7G3HejwgQASJABIgAESACRIAIEAEiQASIABEgAkSACAxgBEhIDuDBZ9eJABEgAkSACBABIkAEiAARIAJEgAgQASJABIhAdyNAQrK7Eef9iAARIAJEgAgQASJABIgAESACRIAIEAEiQASIwABGgITkAB58dp0IEAEiQASIABEgAkSACBABIkAEiAARIAJEgAh0NwIkJLsbcd6PCBABIkAEiAARIAJEgAgQASJABIgAESACRIAIDGAE0gZw39l1IpB0BKq3tkpNZZt0qJozMgdJVnaK5BWkqONg7r+psd0qs72+XQahXNYgyclT5fJTJTUNKYlJS0uHtDShJSKDVDXZuZHbEMtd0lR7orWpra1DWtW9tcRSRudN9mddbZtgTJoaOyQ1dZAUFKVKcVmqwiMYV7S/trpNULa1RQTnuWo8Bg9Lj9r3ZLef9REBIkAEiAAR6AoEuF4Jfb9zvdIVs4t1EgEiQASIABGIDQESkrHhxFxEIBCBjo4Oee/1evnnvVultqbNN9/R3yyUmV/Jl+GjMuzreBmY81ytPPVwlZ3mPUCZw44rkNHjMr2Xop7/68FKeenJGitffmGqXH9/uUVyegtuWtciV5+zxpvse/7zO0fIzhOyfK8hEeTqjZeu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BEiABEiABEiABEiABEiABEiABEiABEiABHqHgNlfuHfWwKuSAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAlECAEKkhHyoHmbJEACJEACJEACJEACJEACJEACJEACJEACJNAXCFCQ7AtPgWsgARIgARIgARIgARIgARIgARIgARIgARIggQghQEEyQh40b5MESIAESIAESIAESIAESIAESIAESIAESIAE+gIBCpJ94SlwDSRAAiRAAiRAAiRAAiRAAiRAAiRAAiRAAiQQIQQoSEbIg+ZtkgAJkAAJkAAJkAAJkAAJkAAJkAAJkAAJkEBfIEBBsi88Ba6BBEiABEiABEiABEiABEiABEiABEiABEiABCKEAAXJCHnQvE0SIAESIAESIAESIAESIAESIAESIAESIAES6AsEKEj2hafANZAACZAACZAACZAACZAACZAACZAACZAACZBAhBCgIBkhD5q3SQIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAJ9gQAFyb7wFLgGEiABEiABEiABEiABEiABEiABEiABEiABEogQAhQkI+RB8zZJgARIgARIgARIgARIgARIgARIgARIgARIoC8QoCDZF54C10ACJEACJEACJEACJEACJEACJEACJEACJEACEUKAgmSEPGjeJgmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAn0BQIxfWERXAMJkAAJkAAJBEOgqHK7vPrlo8F0ZR8SIAESIAESIAES6BUC3K/0CnZelARIoJ8RoIVkP3tgXC4JkAAJRDKB/1tNMTKSnz/vnQRIgARIgAT6AwHuV/rDU+IaSYAEepuAXwvJlesKe3ttvH4nCHy2cmsnRnEICZAACfR9ArA2h3jJ+QAAAcJJREFU+GLbor6/UK6QBEigQwLcr3SIiB1IgAT6KQHuV/rpg+OyScCGAPcrNlA6UeWPIy0kOwGTQ0iABEiABHqeAK0Nep45r0gCJEACJEACJBAaAe5XQuPF3iRAApFLIKpNlci9fd45CZAACZAACZAACZAACZAACZAACZAACZAACZBATxKghWRP0ua1SIAESIAESIAESIAESIAESIAESIAESIAESCDCCVCQjPAPAG+fBEiABEiABEiABEiABEiABEiABEiABEiABHqSAAXJnqTNa5EACZAACZAACZAACZAACZAACZAACZAACZBAhBOgIBnhHwDePgmQAAmQAAmQAAmQAAmQAAmQAAmQAAmQAAn0JAEKkj1Jm9ciARIgARIgARIgARIgARIgARIgARIgARIggQgnQEEywj8AvH0SIAESIAESIAESIAESIAESIAESIAESIAES6EkCFCR7kjavRQIkQAIkQAIkQAIkQAIkQAIkQAIkQAIkQAIRToCCZIR/AHj7JEACJEACJEACJEACJEACJEACJEACJEACJNCTBChI9iRtXosESIAESIAESIAESIAESIAESIAESIAESIAEIpzA/wdQCw6Jxgit8gAAAABJRU5ErkJggg==";

  $(document).ready(function() {
    var $canvas, canvas, context, drawLineAt, loadImageToCanvas, resetCanvas, saveCanvasImage;
    $canvas = $('.canvas-container:nth-child(1) canvas:nth-child(1)');
    canvas = $canvas[0];
    context = canvas.getContext("2d");
    $canvas.mousedown((function(_this) {
      return function(e) {
        var mouseX, mouseY, offset;
        painting = true;
        offset = $canvas.offset();
        mouseX = e.pageX - offset.left;
        mouseY = e.pageY - offset.top;
        context.strokeStyle = strokeColor;
        context.lineJoin = lineJoin;
        context.lineWidth = strokeWidth;
        context.beginPath();
        drawLineAt(mouseX, mouseY);
      };
    })(this));
    $canvas.mousemove(function(e) {
      var mouseX, mouseY, offset;
      if (painting) {
        offset = $canvas.offset();
        mouseX = e.pageX - offset.left;
        mouseY = e.pageY - offset.top;
        drawLineAt(mouseX, mouseY);
      }
    });
    $canvas.mouseup(function(e) {
      var mouseX, mouseY, offset;
      painting = false;
      offset = $canvas.offset();
      mouseX = e.pageX - offset.left;
      mouseY = e.pageY - offset.top;
      drawLineAt(mouseX, mouseY);
      context.stroke();
      context.closePath();
    });
    drawLineAt = function(x, y) {
      context.lineTo(x, y);
      context.moveTo(x, y);
      context.stroke();
    };
    resetCanvas = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      loadImageToCanvas();
    };
    $('#clear-button').click(function() {
      resetCanvas();
    });
    $('#color-picker').change(function() {
      strokeColor = $('#color-picker').val();
    });
    $('#size-picker').change(function() {
      strokeWidth = $('#size-picker').val();
    });
    $('#share-button').click(function() {
      saveCanvasImage();
    });
    saveCanvasImage = function() {
      console.log(canvas.toDataURL());
    };
    loadImageToCanvas = function(ctx, src) {
      var imgObj;
      imgObj = new Image();
      imgObj.onload = function() {
        context.drawImage(this, 0, 0);
      };
      imgObj.src = newImg;
    };
  });

}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//



;
