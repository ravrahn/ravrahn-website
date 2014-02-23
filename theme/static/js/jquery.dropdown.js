$(function(){

    $("ul.dropdown li").hover(function(){
    
        $(this).addClass("hover");
        $(".hover ul").css("visibility", "visible")
    
    }, function(){
    
        $(".hover ul").css("visibility", "hidden");
        $(this).removeClass("hover");
    
    });



    $("#hamburger").click(function(event) {
		event.stopPropagation();

		console.log(!$("#hamburger ul, #hamburger ul *").is(event.target));
		console.log($("#hamburger ul").css("visibility"));

		if (!$("#hamburger ul, #hamburger ul *").is(event.target) &&
				$("#hamburger ul").css("visibility") == "visible") {
			
			$("#hamburger ul").css("visibility", "hidden");
    	} else {
			$("#hamburger ul").css("visibility", "visible");
    	}
    });

    $(":not(#hamburger)").click(function() {
    	if ($("#hamburger ul").css("visibility") == "visible") {
			$("#hamburger ul").css("visibility", "hidden");
    	}
    });

    $(".ham-menu li").click(function() {
    	$(this).addClass("ham-active");
    	$(".ham-submenu").slideUp();
    	if ($(".ham-active .ham-submenu").css("display") == "none") {
    		$(".ham-active .ham-submenu").slideToggle();
    	}
    	$(this).removeClass("ham-active");
    });

});