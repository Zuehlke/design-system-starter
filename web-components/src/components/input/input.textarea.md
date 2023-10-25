A textarea input field allows the user to enter a large amount of text. It can be used in forms and dialogs. 
The counter underneath the field displays the current and the max amount of characters that are allowed.

In some instances where no input event is triggered (e.g. when the text is added programmatically) the counter will not be updated.
In this case the counter can be updated manually by triggering the custom event `dss-input-update-count` on the textarea.