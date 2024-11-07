class Fondo {
function(){
    var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    $.getJSON(flickrAPI,{
        tags: "circuito",
        tagmode: "any",
        format: "json"
    }).done(function(data) {
        $.each(data.items,function(i,item){
            $("<img />").attr("src",item.media.m).appendTo("#imagenes");
        });
    });
}
}

constructor (){
    this.url = dsafasdf

}
getFondo() {
    haceConsulta()
    cojeElBichoYPoneImagen()
}