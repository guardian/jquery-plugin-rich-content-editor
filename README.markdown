# rich content editor jQuery plug-in

Rich content editor is a jQuery plug-in that creates a content editable
area with customisable formatting controls.

## Requirements

* jQuery 1.6+

## Usage

Include jQuery and Rich text editor source files in the HTML:

	<script type="text/javascript" src="jquery.min.js"></script>
    <script type="text/javascript" src="jquery.richeditor.js"></script>

On DOM ready tigger richEditor by calling it against some target element(s):

	<textarea id="comment_form"></textarea>

	<script type="text/javascript">
		$(document).ready(function() {
			$('#comment_form').richEditor();
		});
	</script>

This will replace the <textarea> with a HTML block containing the editor
controls and editable area.

## Methods

*getHTML* Returns the raw HTML of the editable area.

*setHTML* Sets the HTML of the editable area.

*disable* Disables the editable area and hides the controls.

*enable* Enables the editable area and shows the controls.


## Examples

You can specify which formating control buttons to display by passing in
an options object:

	$('#create-block-textarea').richEditor({
		buttons: ['bold', 'undo', 'redo']
	});

## References

For more information about content editable see the following resources:
* https://developer.mozilla.org/en/rich-text_editing_in_mozilla