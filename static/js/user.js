(function($){
	var like =$('.like');
$('#edit').click(function(){
	$("#form").removeClass("hidden");

});
$('#cancle').click(function(){
	$("#form").addClass("hidden");

});

like.click(function(){
	if(like.hasClass('likeColor'))
		like.removeClass('likeColor');
		else
		like.addClass('likeColor');
		
	var Id= $(this).attr('movieId');
	var config={
		method: "POST",
		url:"/like",
		data: JSON.stringify({
			imdbId: Id
		})

	};

	$.ajax(config).then(function(message){
		if(message.error){
		  like.removeClass('likeColor');
		  alert(message.error);
		}
 	});
});
})(jQuery);