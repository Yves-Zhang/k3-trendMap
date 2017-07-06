/**
 * Created by zhyf on 2017/5/11.
 */
$(function(){
    var data; //所有数据
    var init;
    var numDis=[[],[],[],[],[],[]];//储存快3形态分布
    var misNub=[];
    $(document).ready(function(){
        $.getJSON("http://10.13.0.178:9099/openApi/getWinnum?gameId=7&startIndex=0&size=50",function(datas,status,xhr){
            var datas = $.parseJSON(datas);
            data=datas.items;
            //新构造遗漏数据并追加到data中
            function cretArry(){
                for(var j=0;j<data.length;j++){
                    var newArr=[];
                    for(var i=0;i<6;i++){
                        var newNum=numDis[i][j];
                        newArr.push(newNum)
                    }
                    misNub.push(newArr)
                }
                for(var i=0;i<data.length;i++){
                    createJson(data[i],"misNumb",misNub[i]);
                }
            }
            //新构造遗漏数据并追加到data中结束


            //快三形态数据
            init=0;
            for(var i=1;i<=6;i++){
                init=0;
                for (var k=data.length-1;k>=0;k--)
                {
                    if(data[k].prizeBallsArray[0]==i||data[k].prizeBallsArray[1]==i||data[k].prizeBallsArray[2]==i)
                    {
                        init=i;
                        numDis[i-1].push(init);
                        init=0;
                    }else{
                        init+=1;
                        numDis[i-1].push(init);
                    }
                }
            };
            for(var i=0;i<numDis.length;i++){
                numDis[i].reverse();
            }
            //快三形态数据结束
            cretArry();
            data.reverse();//控制数据的显示顺序
            templ();
            misFcn(16,50,'.sumNumb');
            misFcn(6,50,'.distanceNumb');
            getCanvas();
        }).error(function(data,status){
            console.log(data);
            console.log(status)
        })
    });


    //加载模板函数
    function templ(){
        var t=_.template($("#tpl").text());
        $(".view").html(t(data));
    };
    //加载模板结束

//添加json对象函数
// 参数：prop = 属性，val = 值
    function createJson(str,prop, val) {
        // 如果 val 被忽略
        if(typeof val === "undefined") {
            // 删除属性
            delete str[prop];
        }
        else {
            // 添加 或 修改
            str[prop] = val;
        }
    }
    //添加json对象方法结束

    //画折线
    function getCanvas(){
        var canvas="<canvas class='cont' style='position: absolute;z-index: 0;' id='cont'></canvas>";
        $('body').append(canvas);
        document.getElementById('cont').width=$('#table').width();
        document.getElementById('cont').height=$('#table').height();
        $('.cont').css('top',0).css('left',0)
        var ctx = $('.cont')[0].getContext('2d');
        var sums=$('.sum');
        var distance=$('.distance');
        function draw(obj,color){
            for(var i=0;i<obj.length;i++){
                if(i>=obj.length-1){
                    i=i+1
                }else{
                    var beginX=obj.eq(i).offset().left+25/2;
                    var beginY=obj.eq(i).offset().top+25/2;
                    var endX=obj.eq(i+1).offset().left+25/2;
                    var endY=obj.eq(i+1).offset().top+25/2;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'square';
                    ctx.beginPath();
                    ctx.moveTo(beginX, beginY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
        draw(sums,'green');
        draw(distance,'orange')
    }
    //画折线结束
    window.onresize=function(){
        getCanvas();
    };

    //构造遗漏函数
    function misFcn(horLength,verLength,obj){
        for(var i=0;i<horLength;i++){
            var init=1;
            for(var j=0;j<verLength;j++){
                var num=$('.num').eq(j).find(obj).eq(i).find('span').eq(0).text();
                if(parseInt(num)-0>=0){
                    init=1;
                }else{
                    $('.num').eq(j).find(obj).eq(i).find('span').eq(0).text(init);
                    init++;
                }
            }
        }
    }
    //构造遗漏函数结束

    //中奖类型
    function winType(){
        _.each(data.data,function(ev,i){
            var type=0;
            for (var j=0;j<ev.prizeBallsArray.length;j++)
            {
                if(ev.prizeBallsArray[j+1]==ev.prizeBallsArray[j]){
                    type++
                }
            };
        });
    }
    //中奖类型结束

});