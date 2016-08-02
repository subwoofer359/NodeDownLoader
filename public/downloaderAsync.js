/*global $*/
/*global document*/

function submitUrl() {
	"use strict";
	var url = $('#url').val(),
		formData = 'url=' + url,
		$response = $('#response');
	
	$response.html('');
	
	$.post('./download', formData, function (data) {
		$response.html('<small>' + data + '</small>');
	});
}

$(document).ready(function () {
	"use strict";
	$('#download-btn').click(submitUrl);
});
