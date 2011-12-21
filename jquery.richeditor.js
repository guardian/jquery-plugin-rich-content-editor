/*
    rich-content-editor jQuery plugin
    Version: 0.1
*/
(function($) {
    var buttonConfigs = {
        bold: {
            text: 'B',
            className: 'rich-button-bold',
            execCommand: 'bold'
        },
        underline: {
            text: 'U',
            className: 'rich-button-underline',
            execCommand: 'underline'
        },
        italic: {
            text: 'i',
            className: 'rich-button-italic',
            execCommand: 'italic'
        },
        link: {
            text: 'URL',
            className: 'rich-button-link',
            execCommand: 'createLink',
            action:  function() {
                    // TODO: validate URL
                    var link = window.prompt('Enter a URL.');
                    link = link.replace(/\n|\r|\s/ig, '');
                    return link;
                }
        },
        removeLink: {
            text: 'Remove URL',
            className: 'rich-button-removelink',
            execCommand: 'unlink'
        },
        undo: {
            text: 'Undo',
            className: 'rich-button-undo',
            execCommand: 'undo'
        },
        redo: {
            text: 'Redo',
            className: 'rich-button-redo',
            execCommand: 'redo'
        }
    };

    var config = {
        buttons: ['bold', 'italic', 'link', 'removeLink']
    };

    /**
     *  Create DOM buttons and attach click event
     *
     *  @param Array buttonList List of object keys (buttons) to build
     */
    function buildControls(buttonList) {
        var controls = $('<div/>').addClass('controls');
        
        $.each(buttonList, function(index, value) {
            var btn = buttonConfigs[value];
            var btnElm = $('<a/>').text(btn.text);

            btnElm.addClass(btn.className + ' btn');
            btnElm.bind('mousedown', function(e) {
                e.preventDefault();
                var param = (btn.action) ? btn.action() : false;
                document.execCommand(btn.execCommand, false, param);
            });

            controls.append(btnElm);
        });

        return controls;
    }

    /**
     *  Snippet taken from http://stackoverflow.com/q/6690752
     */
    function pasteHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

    function pasteClipboard(event) {
        event.preventDefault();
        var text;
        // Access clipboard or use fallback
        if (event.originalEvent.clipboardData) {
            text = event.originalEvent.clipboardData.getData('text');
        } else if (window.clipboardData) {
            text = window.clipboardData.getData('text');
        } else {
            text = window.prompt('Paste in here');
        }

        pasteHtmlAtCaret(text);
    }

    var methods = {
        init: function() {
            var editorContainer = $('<div/>').addClass('rich-editor');
            var editorPane = $('<div><p>Hello</p></div>').addClass('editor-pane');
            var controls = buildControls(config.buttons);

            editorContainer.append(controls);
            editorContainer.attr('id', this.attr('id'))
            ;
            editorPane.attr('contenteditable', 'true');
            editorPane.bind('paste', pasteClipboard);

            editorContainer.append(editorPane);
            this.replaceWith(editorContainer);

            return editorContainer;
        },
        getHTML: function() {
            return $('.editor-pane', this).html();
        },
        setHTML: function(html) {
             $('.editor-pane', this).html(html);
             return this;
        },
        enable: function() {
            controls.show();
            editorPane.attr('contenteditable', 'true');
            return this;
        },
        disable: function() {
            controls.hide();
            editorPane.attr('contenteditable', 'false');
            return this;
        }
    };

    $.fn.richEditor = function(method) {
        var result;
        var methodParam = Array.prototype.slice.call(arguments, 1);

        this.each(function() {
            var $this = $(this);
            if (methods[method]) {
                result = methods[method].apply($this, methodParam);
            } else if (typeof method === 'object' || !method) {
                $.extend(config, method);
                result = methods['init'].apply($this, arguments);
            } else {
                $.error('Method ' +  method + ' does not exist on jQuery.richcontenteditor');
            }
        });

        return result;
    };
})(jQuery);
