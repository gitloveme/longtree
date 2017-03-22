function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
/*公共弹窗提示*/
var dialogState=true;
function dialogMessage(title,message,showbtn,callback){
    var dialoghtml='<div class="dialog" style="display:block">'+
                    '<div class="dialog-con">'+
                            '<div class="dialog-tit">'+title+'</div>'+
                            '<div class="dialog-close">×</div>'+
                            '<div class="dialog-msg">'+message+'</div>'+
                            '<div class="dialog-btns">'+
                                '<a href="javascript:;" class="btn-cancel">取消</a><a href="javascript:;" class="btn-sure">确定</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
    
    if($(".dialog").length==0){
        $("body").append(dialoghtml);
    }
    var Dialog=$(".dialog");
    if(!dialogState) return false;
    dialogState=false;
    

    Dialog.show().find(".dialog-tit").text(title).siblings(".dialog-msg").html(message).siblings(".dialog-close").unbind("click").click(function (){
        Dialog.hide().find(".dialog-btns").hide();
        dialogState=true;
    });
    if(showbtn){
        Dialog.find(".dialog-btns").show().find(".btn-cancel").unbind("click").click(function (){
            Dialog.hide().find(".dialog-btns").hide();
            dialogState=true;
        }).siblings(".btn-sure").unbind("click").click(function (){
            Dialog.hide().find(".dialog-btns").hide();
            callback && callback();
            dialogState=true;
        });
    }
}
/*分页代码*/
function returnPagehtml(num,totalcount,pagesize){
    var totalPage=Math.ceil(totalcount/pagesize);
    var isFirstpage= num==1;
    var isLastpage= num==totalPage;
    var prevnum=parseInt(num)-1;
    var nextnum=parseInt(num)+1;
    var pagehtml="";
    isFirstpage ? pagehtml+='<a href="javascript:;" class="page_prev last">上一页</a>':pagehtml+='<a href="javascript:;" title="上一页" class="page_prev" page="'+prevnum+'">上一页</a>';
    var larPage=7;//最多显示的页码数
    if(totalPage <= larPage){
        for(var i=0;i<totalPage;i++){
            var n=i+1;
            n==num ? pagehtml+='<a href="javascript:;" class="now">'+n+'</a>':pagehtml+='<a href="javascript:;" page="'+n+'">'+n+'</a>';
        }
    }
    else{
        var beforenum=num-3;
        var afternum=num+3;
        if(beforenum<0){
            afternum=afternum+Math.abs(beforenum);
            beforenum=1;
        }
        else if(afternum>totalPage){
            beforenum=beforenum-Math.abs(afternum-totalPage);
            afternum=totalPage;
        }
        for(var i=0;i<totalPage;i++){
            var n=i+1;
            if(n>=beforenum&&n<=afternum){
                if(num-3>0){
                    if(n==num) {pagehtml+='<a href="javascript:;" class="now">'+n+'</a>'}
                    else if(n==beforenum){pagehtml+='<a href="javascript:;" page="1">1</a> ··· ';}
                    else{
                        if(afternum<totalPage){
                            if(n!=afternum){
                                pagehtml+='<a href="javascript:;" page="'+n+'">'+n+'</a>';
                            }
                        }
                        else{
                            pagehtml+='<a href="javascript:;" page="'+n+'">'+n+'</a>';
                        }
                    }
                }
                else{
                    if(n==num) {pagehtml+='<a href="javascript:;" class="now">'+n+'</a>'}
                    else{
                        pagehtml+='<a href="javascript:;" page="'+n+'">'+n+'</a>';
                    }
                }
            }
        }
        if(num+3<totalPage){
            pagehtml+=' ··· <a href="javascript:;" page="'+totalPage+'">'+totalPage+'</a>';
        }
    }
    isLastpage ? pagehtml+='<a href="javascript:;" class="page_next last">下一页</a>':pagehtml+='<a href="javascript:;" title="下一页" class="page_next" page="'+nextnum+'">下一页</a>';
    var jumpNum=num<=totalPage?num:totalPage;
    var phtml='每页'+pagesize+'总计'+totalcount+'记录'+pagehtml+'至第<input class="jumpvalue" value="'+jumpNum+'" type="text">页 <input class="submit" value="跳转" type="button" totalpage="'+totalPage+'">';
    //var phtml='<div class="pagenumber">总计'+totalcount+'记录'+pagehtml+'至第<input class="jumpvalue" value="'+jumpNum+'" type="text">页 <input class="submit" value="跳转" type="button" totalpage="'+totalPage+'"></div>';
    return phtml;
}
$(function (){
    /*判断用户是否登录/inf/isUserLogin*/
	$.ajax({
		type:"get",
		url:"/inf/isUserLogin",
		data:{},
		dataType:"json",
		error:function (error){/*location.href="/index.html";*/},
		success:function (data){
			data.data={"username":"用户名称","rights":"用户权限代码" };//001：管理员 ;002：添加，删除，编辑、查看;003:查看 

			if(data.status==200){
				window.user=data.data;
			}else{
				//location.href="/index.html";
			}
		}
	});
    var commonDom=$(".commonbox");
    var commonNav=commonDom.find(".nav");
    commonNav.find("li").click(function (){
        location.href=$(this).attr("link");
    });
    
	/*倒序*/
	$(".copytable").delegate(".arrow-s","click",function (){
		$(".autoscroll").find("tr").each(function (){
			$(this).prependTo($(this).parents(".autoscroll").find("table"));
		});
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
            var marginT=Math.ceil(marT)*1.5;
            commonDom.css({width:windowWidth-marginL,height:windowHeight-marginT,left:0,top:0});
            var type=$("body").attr("resizeType");
            switch(type){
                case "tongji"://统计
                    //$("#tjmap").height()
                    var w=commonDom.find(".showbox").width()*0.832/4;
                    commonDom.find(".tongji-navs").css({"margin-top":-w/2,width:5*w}).find("li").css({width:w,height:0.8*w});
                break;
                case "manage"://管理
                    var w=commonDom.find(".showbox").width()*0.832/5;
                    commonDom.find(".manage-navs").css({"margin-top":-w/2,width:6*w}).find("li").css({width:w,height:w});
                break;
                case "managelist"://
                    var maxh=commonDom.find(".showbox").height()*(1-0.07)-235-20;
                    //commonDom.find(".autoscroll").css("max-height",maxh)
                    commonDom.find(".autoscroll").css("height",maxh)
                break;
                case "search":
                    var maxh=commonDom.find(".showbox").height()*0.7;
                    commonDom.find(".autoscroll").css("max-height",maxh);
                    var maxs=commonDom.find(".showbox").height()*(1-0.06)-320;
                    $(".tree-intro").css("max-height",maxs);
                break;
                case "tjdetail":
                    var maxh=commonDom.find(".showbox").height()-235-$(".mapimage").css("margin-top");
                    $(".mapimage").css({"height":maxh,"width":$(".mapimage").parents(".allmapimgs").width()});
                break;
            }
        }        
    }
    function hideLoading(){
        /*loading*/
        var loadDom=document.getElementById("loading");
        loadDom.setAttribute("class","outloading");
        setTimeout(function (){
            document.body.removeChild(loadDom);
        },500);
    }
    window.onresize= setWidnowSize;
    function init(){
        setWidnowSize();
        hideLoading();
    }
    init();
});