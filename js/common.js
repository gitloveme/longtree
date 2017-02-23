$(function (){
    /*loading*/
    var loadDom=document.getElementById("loading");
    loadDom.setAttribute("class","outloading");
    setTimeout(function (){
        document.body.removeChild(loadDom);
    },500);
    //
    var commonDom=$(".commonbox");
    var commonNav=commonDom.find(".nav");
    commonNav.find("li").click(function (){
        location.href=$(this).attr("link");
    });
    

    function setWidnowSize(){
        var windowWidth=$(window).width();
        var windowHeight=$(window).height();
        var larWidth=1600;
        var larHeight=850;
        if(windowWidth >= larWidth && windowHeight>=larHeight){
            commonDom.css({width:larWidth,height:larHeight,"margin-top":-larHeight/2,"margin-left":-larWidth/2,left:"50%",top:"50%"});
        }else{
            var marL=parseInt(commonDom.css("margin-left"));
            var marT=parseInt(commonDom.css("margin-top"));
            var marginL=Math.ceil(marL)*2;
            var marginT=Math.ceil(marT)*2;
            commonDom.css({width:windowWidth-marginL,height:windowHeight-marginT,left:0,top:0});
        }
    }
    function init(){
        setWidnowSize();
    }
    init();
});