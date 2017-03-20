$(function (){
    var scrollImg=$(".change-box");
    scrollImg.siblings(".arrow-left").click(function (){//上一张
        var that=$(this);
        if(that.data("allow")=="not"){return false;}
        that.data("allow","not");
        var currDom=scrollImg.find(".curr-img");
        var nextDom=scrollImg.find(".next-img");
        var preDom=scrollImg.find(".pre-img");
        var currCss={width:currDom.width(),height:currDom.height(),top:currDom.css("top"),left:currDom.css("left")};
        var nextCss={width:nextDom.width(),height:nextDom.height(),top:nextDom.css("top"),left:nextDom.css("left")};
        var preCss={width:preDom.width(),height:preDom.height(),top:preDom.css("top"),left:preDom.css("left")};
        var hideCss={width:0,height:0,left:scrollImg.width()*1.5,top:scrollImg.height()/2};

        var len=scrollImg.find("img").length;
        var index=scrollImg.find(".curr-img").index();
        var preIndex=scrollImg.find(".pre-img").index();
        var nextIndex=scrollImg.find(".next-img").index();

        //此时上一张变焦点图，焦点图变下一张，下一张隐藏
        var oPre=preIndex-1<0?len-1:preIndex-1;
        // var oCurr=preIndex+1<len-1?preIndex+1:0;
        // var oNext=index+1<len-1?index+1:0;

        currDom.css({"z-index":1,opacity:0.5}).stop().animate(nextCss,1000,function (){
            currDom.attr("class","next-img");
        });
        nextDom.css({"z-index":0,opacity:0.5}).stop().animate(hideCss,1000,function (){
            nextDom.attr("class","");
        });
        preDom.css({"z-index":3,opacity:1}).stop().animate(currCss,1000,function (){
            preDom.attr("class","curr-img");
        });
        scrollImg.find("img").eq(oPre).css({"top":"105px","left":-scrollImg.width()/2,width:0,height:0,"z-index":1}).stop().animate(preCss,1000,function (){
            scrollImg.find("img").eq(oPre).attr("class","pre-img");
            that.data("allow","allow");
        });


    }).siblings(".arrow-right").click(function (){//下一张
        var that=$(this);
        if(that.data("allow")=="not"){return false;}
        that.data("allow","not");
        var currDom=scrollImg.find(".curr-img");
        var nextDom=scrollImg.find(".next-img");
        var preDom=scrollImg.find(".pre-img");
        var currCss={width:currDom.width(),height:currDom.height(),top:currDom.css("top"),left:currDom.css("left")};
        var nextCss={width:nextDom.width(),height:nextDom.height(),top:nextDom.css("top"),left:nextDom.css("left")};
        var preCss={width:preDom.width(),height:preDom.height(),top:preDom.css("top"),left:preDom.css("left")};
        var hideCss={width:0,height:0,left:-scrollImg.width()/2,top:scrollImg.height()/2};

        var len=scrollImg.find("img").length;
        var index=scrollImg.find(".curr-img").index();
        var preIndex=scrollImg.find(".pre-img").index();
        var nextIndex=scrollImg.find(".next-img").index();

        //此时下一张变焦点图，焦点图变上一张，上一张隐藏
        // var oPre=index-1<0?len-1:index-1;
        // var oCurr=nextIndex-1<len-1?nextIndex-1:0;
        var oNext=nextIndex+1<len ? nextIndex+1:0;

        preDom.css({"z-index":1,opacity:0.5}).stop().animate(hideCss,1000,function (){
            preDom.attr("class","");
        });
        currDom.css({"z-index":1,opacity:0.5}).stop().animate(preCss,1000,function (){
            currDom.attr("class","pre-img");
        });        
        nextDom.css({"z-index":3,opacity:1}).stop().animate(currCss,1000,function (){
            nextDom.attr("class","curr-img");
        });
        scrollImg.find("img").eq(oNext).css({"top":"105px","left":scrollImg.width(),width:0,height:0,"z-index":1}).stop().animate(nextCss,1000,function (){
            scrollImg.find("img").eq(oNext).attr("class","next-img");
            that.data("allow","allow");
        });
    });
    scrollImg.find(".curr-img").click(function (){
        var imgSrc=location.origin+"/"+$(this).attr("src");
        /*$("body").append('<a href="'+imgSrc+'" class="openimg"></a>');
        $(".openimg").click();*/
        window.open(imgSrc);
    });
});