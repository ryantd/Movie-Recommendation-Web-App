(function($){
$('#edit').click(function(){
$("#form").removeClass("hidden");

});
$('#cancle').click(function(){
$("#form").addClass("hidden");

});

$('.like').click(function(){
var Id= $(this).attr('movieId');
var config={
	method: "Post",
	url:"",
	data: JSON.stringify({
		imdbId: Id
	})

};
// $.ajax(config).then(function(message){
	
// });

})(jQuery);