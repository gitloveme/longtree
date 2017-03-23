$(function (){
    var loadType=$("body").attr("loadType") || 0;
    var searchDom=$(".search-list");
    function buildListTree(op){
		var loadUrlArry=['/inf/getTreeFuzhuang','/inf/getTreeFuzhuang','/inf/getTreeYanghu','/inf/getTreeXuncha'];
        /*
        page_index:第几页,
        page_num:每页显示多少条,
        type:0:正常信息 1:复壮 2：养护 3:巡查
         */
        var option=$.extend({page_index:1,page_num:50},op);
        $.ajax({
            type:"get",
            url:loadUrlArry[loadType],
            data:option,
            dataType:"json",
            error:function (error){dialogMessage("加载古树列表","暂时无法加载列表，请您稍后重试！");},
            success:function (data){
                if(data && data.status==200){
                    var arry=data.data;
                    var treelist='';
                    var tableTh='';
                    if(loadType==1){//古树复壮
                        /*
                        古树编号 ；古树树种 ；古树街道 ；修复内容 ；复壮人 ；复壮时间 
                         */
                        tableTh='<tr><th class="choose"></th><th>编号<em class="icon arrow-s"></em></th><th>树种</th><th>地点</th><th>修复内容</th><th>复壮人</th><th>复壮时间</th></tr>' ;
                        
                        for(var i=0;i<arry.length;i++){
                            var coordx=arry[i].X || 0;
                            var coordy=arry[i].Y || 0;
                            var treeNo=arry[i].NO || "-";
                            var treeKind=arry[i].breed || "-";
                            var treeStreet=arry[i].region || "-";
                            var treeRepair=arry[i].repair || "-";
                            var treeWorker=arry[i].header || "-";
                            var treeRepairTime=arry[i].analepsis_time || "-";
                            treelist+='<tr coord="'+coordx+','+coordy+'" treeno="'+treeNo+'"><td class="choose"></td><td>'+treeNo+'</td><td>'+treeKind+'</td><td>'+treeStreet+'</td><td>'+treeRepair+'</td><td>'+treeWorker+'</td><td>'+treeRepairTime+'</td></tr>';
                        }
                     }
                     else if(loadType==2){//古树养护
                        /*
                        古树名木编号 ；树种 ;地点 ;养护季节 ;养护单位 ;养护时间 
                         */
                        tableTh='<tr><th class="choose"></th><th>编号<em class="icon arrow-s"></em></th><th>树种</th><th>地点</th><th>养护季节</th><th>养护单位</th><th>养护时间</th></tr>' ;
                        
                        for(var i=0;i<arry.length;i++){
                            var coordx=arry[i].X || 0;
                            var coordy=arry[i].Y || 0;
                            var treeNo=arry[i].NO || "-";
                            var treeKind=arry[i].breed || "-";
                            var treeStreet=arry[i].region || "-";
                            var treeSeason=arry[i].maintain_season || "-";
                            var treeWorker=arry[i].maintain_corporation || "-";
                            var treeRepairTime=arry[i].analepsis_time || "-";
                            treelist+='<tr coord="'+coordx+','+coordy+'" treeno="'+treeNo+'"><td class="choose"></td><td>'+treeNo+'</td><td>'+treeKind+'</td><td>'+treeStreet+'</td><td>'+treeSeason+'</td><td>'+treeWorker+'</td><td>'+treeRepairTime+'</td></tr>';
                        }
                        
                     }
                     else if(loadType==3){//古树巡查                        
                        /*
                        编号  树种  地点  复壮措施    异常情况描述  应对措施    落实情况    树体状况    巡查时间
                         */
                        tableTh='<tr><th class="choose"></th><th>编号<em class="icon arrow-s"></em></th><th>树种</th><th>地点</th><th>复壮措施</th><th>异常情况描述</th><th>应对措施</th><th>落实情况</th><th>树体状况</th><th>巡查时间</th></tr>' ;
                        
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
                            treelist+='<tr coord="'+coordx+','+coordy+'" treeno="'+treeNo+'"><td class="choose"></td><td>'+treeNo+'</td><td>'+treeKind+'</td><td>'+treeStreet+'</td><td>'+treeMeasure+'</td><td>'+treeDes+'</td><td>'+treeHelp+'</td><td>'+treeIng+'</td><td>'+treeSituation+'</td><td>'+treeRepairTime+'</td></tr>';
                        }

                     }
                     var totalcount=data.records || 100;
                     var pagehtml=returnPagehtml(option.page_index,totalcount,option.page_num);
                     searchDom.find(".copytable").empty().html('<table>'+tableTh+'</table>').siblings(".autoscroll").empty().html('<table>'+treelist+'</table>').siblings(".pagenumber").empty().html(pagehtml);                     
					 searchDom.find(".autoscroll").find("tr").eq(0).find("td").each(function (i,ele){
						searchDom.find(".copytable").find("th").eq(i).width($(ele).width());
					 }); //searchDom.find(".copytable").empty().html('').siblings(".autoscroll").empty().html('<table>'+tableTh+treelist+'</table>').siblings(".pagenumber").empty().html(pagehtml);                     
                }else{
                    var errormsg=data.error || "出现未知错误，请您稍后重试"

					dialogMessage("加载古树列表",errormsg);
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
		var treeNo=$(".autoscroll").find(".active").attr("treeno");
		if(treeNo==null){
			dialogMessage("编辑","请先选中下方一条数据再进行操作");
			return false;
		}
        location.href="/introtree.html?treeno="+treeNo;
    });
});