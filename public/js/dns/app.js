$(document).ready(function ($) {
    var getButton = $('.get');
    var submit = $('.submit');
    var form = $('form');
    
    getButton.click(function (event) {
        event.preventDefault();
        var ip = $(event.target).attr('ip');
        console.log(ip)
        $.get("http://localhost:3000/api/dns?ip="+ip, function (data) {
            console.log(data)
        })
    });
    
    submit.click(function (event) {
        event.preventDefault();
        var formData = $($(this).parent().get(0)).serialize();
        console.log(formData)
  
        $.ajax({
            url : "http://localhost:3000/api/dns",
            type: "POST",
            data : formData,
            success: function (data, textStatus, jqXHR) {
                console.log(data)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus)
            }
        });     
    });
});