$(function(){if($(window).width()>768){var e=$("#content").offset().top,t=parseInt($(".year:first").attr("id").replace("year-",""));$(".year:first, .year .month:first").addClass("selected");$(".month.monthed").click(function(){var e=$(this),t="#"+e.attr("id").replace("mont","arti");if(!e.hasClass("selected")){t=$(t).offset().top-10;$(".month.monthed.selected").removeClass("selected");e.addClass("selected");$("body, html").scrollTop(t)}});$(".year-toogle").click(function(e){e.preventDefault();var t=$(this).parent();if(!t.hasClass("selected")){var s=t.children("ul").children("li").eq(0);$(".year.selected").removeClass("selected");t.addClass("selected");s.click()}});$(window).scroll(function(){var e=$(window).scrollTop();if(e<55)$("#archive-nav").css({top:115-e});else $("#archive-nav").css({top:60});$(".archive-title").each(function(){var s=$(this),a=s.attr("id"),l=parseInt(a.replace(/arti-(\d*)-\d*/,"$1")),r=s.offset().top-40,c=r+s.height();if(r<=e&&e<c){if(l!=t){$("#year-"+t).removeClass("selected");$("#year-"+l).addClass("selected");t=l}a="#"+a.replace("arti","mont");$(".month.monthed.selected").removeClass("selected");$(a).addClass("selected")}})})}});