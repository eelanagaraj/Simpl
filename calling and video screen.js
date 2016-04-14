window.onload = callClock();

function callClock() {
        var secs = 0;
	    builtInClock = setInterval(function() {
	    secs ++;
	    document.getElementById("secs").innerText = secs % 60;
        document.getElementById("mins").innerText = parseInt(secs / 60);
        }, 1000);
}


window.onload = callClock1();

function callClock1() {
        var secs1 = 0;
	    builtInClock1 = setInterval(function() {
	    secs1 ++;
	    document.getElementById("secs1").innerText = secs1 % 60;
        document.getElementById("mins1").innerText = parseInt(secs1 / 60);
        }, 1000);
}

    $(document).ready(function(){
      $('#myInput').click(function(){
          $('#n_keypad').fadeToggle('fast');
      });
      $('.done').click(function(){
          $('#n_keypad').hide('fast');
      });
      $('.numero').click(function(){
        if (!isNaN($('#myInput').val())) {
           if (parseInt($('#myInput').val()) == 0) {
             $('#myInput').val($(this).text());
           } else {
             $('#myInput').val($('#myInput').val() + $(this).text());
           }
        }
      });
      $('.neg').click(function(){
          if (!isNaN($('#myInput').val()) && $('#myInput').val().length > 0) {
            if (parseInt($('#myInput').val()) > 0) {
              $('#myInput').val(parseInt($('#myInput').val()) - 1);
            }
          }
      });
      $('.pos').click(function(){
          if (!isNaN($('#myInput').val()) && $('#myInput').val().length > 0) {
            $('#myInput').val(parseInt($('#myInput').val()) + 1);
          }
      });
      $('.del').click(function(){
          $('#myInput').val($('#myInput').val().substring(0,$('#myInput').val().length - 1));
      });
      $('.clear').click(function(){
          $('#myInput').val('');
      });
      $('.zero').click(function(){
        if (!isNaN($('#myInput').val())) {
          if (parseInt($('#myInput').val()) != 0) {
            $('#myInput').val($('#myInput').val() + $(this).text());
          }
        }
      });
    });