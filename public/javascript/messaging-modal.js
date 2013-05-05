$(document).ready(function() {
	$("#messaging-button").click(function () {
		$('#messaging-modal').modal('toggle');
		console.log("Messaging button pressed");
	});
});