$(document).ready(function ($) {
    var routerItem = $('.routerItem');
    var checkRouter = $('input[type=checkbox]');
    var deleteRouter = $('.delete');
    var selectedRouters = [];
    
    checkRouter.click(function (e) {
        //e.preventDefault();
        var rid = $(e.target).attr('rid');
        var rname = $(e.target).attr('rname');
        var ip = $(e.target).attr('ip');       
        selectedRouters.push({ id: rid, name: rname, ip: ip });
        console.log(selectedRouters)
    });
    
    deleteRouter.click(function (e) {
        e.preventDefault();
        var rid = $(this).attr('rid');
        console.log(rid)
        $.get("http://localhost:3000/api/dns", function (data) {
            console.log(data)
        })
    });

    $('button').click(function (e) {              
        $.post("http://localhost:3000/api/commands", {selectedRouters: JSON.stringify(selectedRouters)}, function (data) {
            console.log(data)
            var win = window.open('http://localhost:3000/dns');
                with (win.document) {
                    open();
                    write(data);
                    close();
                }           
        });        
        return false;
    });        
    
    //submit.click(function () {
    //    formData = form.serialize();
    //    //$.post("http://localhost:3000/api/dns", form.serialize(), function (data) {            
    //    //    console.log(data)
    //    //})   
    //    $.ajax({
    //        url : "http://localhost:3000/api/dns",
    //        type: "POST",
    //        data : formData,
    //        success: function (data, textStatus, jqXHR) {
    //            console.log(data)
    //        },
    //        error: function (jqXHR, textStatus, errorThrown) {
    //            console.log(textStatus)
    //        }
    //    });     
    //});
});
