$(document).ready(function ($) {
    var getButton = $('.get');
    var deleteButton = $('.delete');
    var submit = $('.submit');
    var form = $('form');

//    getButton.click(function (event) {
//        event.preventDefault();
//        var ip = $(event.target).attr('ip');
//        console.log(ip);
//        $.get("http://localhost:3000/ip?ip="+ip, function (data) {
//            console.log(data);
//        });
//    });

    submit.click(function (event) {
        event.preventDefault();
        var rip = $(event.target).attr('ip');
        var formData = $($(this).parent().get(0)).serialize() + "&rip=" + rip;
        console.log(formData);

        $.ajax({
            url: "http://localhost:3000/ip",
            type: "PUT",
            data: formData,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });

    deleteButton.click(function (event) {
        event.preventDefault();
        var rip = $(event.target).attr('ip');
        var formData = $($(this).parent().get(0)).serialize() + "&rip=" + rip;
        console.log(formData);

        $.ajax({
            url: "http://localhost:3000/ip",
            type: "DELETE",
            data: formData,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    });
});