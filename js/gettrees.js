$(function (){
    var loadType=$("body").attr("loadType") || 0;
    var searchDom=$(".search-list");
    function buildListTree(op){
        /*
        page_index:第几页,
        page_num:每页显示多少条,
        type:0:正常信息 1:复壮 2：养护 3:巡查
         */
        var option=$.extend({page_index:1,page_num:20,type:loadType},op);
        $.ajax({
            type:"get",
            url:"/inf/getLocation",
            data:option,
            dataType:"json",
            error:function (error){console.error(error);},
            success:function (data){
                 /*data={"status":"200","error":null,"data":[{"NO":"11011400001","X":"116.24218470898","Y":"40.226302719135"},{"NO":"11011400002","X":"116.2421917322","Y":"40.226306608809"}],"records":null,"objectNode":{},"arrayNode":[]};*/
                  /*
                    {
                    "X":"X坐标",
                    "Y":"Y坐标",
                    "NO":"古树编号","region":"地区",
                    "breed":"树种",
                    "repair":"修复内容",                    "header":"负责人",
                    "analepsis_time":"复壮时间",
                    "maintain_season":"养护季节",
                    "maintain_corporation":"养护单位",
                    "maintain_time":"养护时间",
                    "analepsis_measure":"复壮措施",                 "exception_desc":"异常情况概述",
                    "exception_measure":"应对措施",
                    "practicable_desc":"落实情况",
                    "tree_desc":"树体情况",
                    "around_time":"巡查时间"
                    }
                     */
                if(data && data.status==200){
                    
                    var arry=data.data;
                    var treelist='';
                    var tableTh='';
                    if(loadType==1){//古树复壮
                        /*
                        古树编号 ；古树树种 ；古树街道 ；修复内容 ；复壮人 ；复壮时间 
                         */
                        tableTh='<tr><th class="padleft">编号<em class="icon arrow-s"></em></th><th>树种</th><th>地点</th><th>修复内容</th><th>复壮人</th><th class="padright">复壮时间</th></tr>' ;
                        
                        for(var i=0;i<arry.length;i++){
                            var coordx=arry[i].X || 0;
                            var coordy=arry[i].Y || 0;
                            var treeNo=arry[i].NO || "-";
                            var treeKind=arry[i].breed || "-";
                            var treeStreet=arry[i].region || "-";
                            var treeRepair=arry[i].repair || "-";
                            var treeWorker=arry[i].header || "-";
                            var treeRepairTime=arry[i].analepsis_time || "-";
                            treelist+='<tr coord="'+coordx+','+coordy+'"><td class="padleft">'+treeNo+'</td><td>'+treeKind+'</td><td>'+treeStreet+'</td><td>'+treeRepair+'</td><td>'+treeWorker+'</td><td class="padright">'+treeRepairTime+'</td></tr>';
                        }
                     }
                     else if(loadType==2){//古树养护
                        /*
                        古树名木编号 ；树种 ;地点 ;养护季节 ;养护单位 ;养护时间 
                         */
                        tableTh='<tr><th class="padleft">编号<em class="icon arrow-s"></em></th><th>树种</th><th>地点</th><th>养护季节</th><th>养护单位</th><th class="padright">养护时间</th></tr>' ;
                        
                        for(var i=0;i<arry.length;i++){
                            var coordx=arry[i].X || 0;
                            var coordy=arry[i].Y || 0;
                            var treeNo=arry[i].NO || "-";
                            var treeKind=arry[i].breed || "-";
                            var treeStreet=arry[i].region || "-";
                            var treeSeason=arry[i].maintain_season || "-";
                            var treeWorker=arry[i].maintain_corporation || "-";
                            var treeRepairTime=arry[i].analepsis_time || "-";
                            treelist+='<tr coord="'+coordx+','+coordy+'"><td class="padleft">'+treeNo+'</td><td>'+treeKind+'</td><td>'+treeStreet+'</td><td>'+treeSeason+'</td><td>'+treeWorker+'</td><td class="padright">'+treeRepairTime+'</td></tr>';
                        }
                        
                     }
                     else if(loadType==3){//古树巡查                        
                        /*
                        编号  树种  地点  复壮措施    异常情况描述  应对措施    落实情况    树体状况    巡查时间
                         */
                        tableTh='<tr><th class="padleft">编号<em class="icon arrow-s"></em></th><th>树种</th><th>地点</th><th>复壮措施</th><th>异常情况描述</th><th>应对措施</th><th>落实情况</th><th>树体状况</th><th class="padright">巡查时间</th></tr>' ;
                        
                        for(var i=0;i<arry.length;i++){
                            var coordx=arry[i].X || 0;
                            var coordy=arry[i].Y || 0;
                            var treeNo=arry[i].NO || "-";
                            var treeKind=arry[i].breed || "-";
                            var treeStreet=arry[i].region || "-";

                            var treeMeasure=arry[i].analepsis_measure || "-";
                            var treeDes=arry[i].exception_desc || "-";
                            var treeHelp=arry[i].exception_measure || "-";
                            var treeIng=arry[i].practicable_desc || "-";
                            var treeSituation=arry[i].tree_desc || "-";
                            var treeRepairTime=arry[i].around_time || "-";
                            treelist+='<tr coord="'+coordx+','+coordy+'"><td class="padleft">'+treeNo+'</td><td>'+treeKind+'</td><td>'+treeStreet+'</td><td>'+treeMeasure+'</td><td>'+treeDes+'</td><td>'+treeHelp+'</td><td>'+treeIng+'</td><td>'+treeSituation+'</td><td class="padright">'+treeRepairTime+'</td></tr>';
                        }

                     }
                     var totalcount=data.records || 100;
                     var pagehtml=returnPagehtml(option.page_index,totalcount,option.page_num);
                     //searchDom.find(".copytable").empty().html('<table>'+tableTh+treelist+'</table>').siblings(".autoscroll").empty().html('<table>'+tableTh+treelist+'</table>').siblings(".pagenumber").empty().html(pagehtml);                     
                     searchDom.find(".copytable").empty().html('').siblings(".autoscroll").empty().html('<table>'+tableTh+treelist+'</table>').siblings(".pagenumber").empty().html(pagehtml);                     
                }else{
                    var errormsg=data.error || "出现未知错误，请您稍后重试"
                    alert(errormsg)
                   // window.location.href="http://"+window.location.host;
                }
            }
        });
    }
    buildListTree();
    
    
    searchDom.find(".pagenumber").delegate("a","click",function (){
        var t=$(this);
        if(t.hasClass("now")||t.hasClass("last")) return false;
        var number=t.attr("page");
        buildListTree({page_index:number});
    }).delegate(".submit","click",function (){
        var t=$(this);
        var now=parseInt(t.siblings(".now").text());
        var number=parseInt($.trim(t.siblings(".jumpvalue").val()));
        var totalPage=parseInt(t.attr("totalpage"));
        if(number>0&&number!=now&&number<=totalPage){
            buildListTree({page_index:number});
        }
        else{
            t.siblings(".jumpvalue").select();
        }
    });
    $(".manage-btn-edit").click(function (){
        location.href="/introtree.html"
    });
});