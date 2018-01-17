var game={
    CN:10, //总列数
    CSIZE:26,  //每个格子的大小
    RN:20, //总行数
    OFFSET:15, //黑框距容器边界的padding
    shape:null, //保存正在下落的主角图形
    nextShape:null, //保存备胎图形
    pg:document.querySelector(".playground"),
    timer:null,//保存定时器序号,
    interval:200,  //没下落一次的时间间隔(下落速度)
    wall:null,  //保存方块墙
    lines:0,  //保存消除的行
    score:0,  //保存得分
    SCORES:[0,10,30,60,100],
    //       0, 1, 2 ,3, 4
    status:1,//保存游戏的状态
    GAMEOVER:0,//游戏结束
    RUNNING:1, //游戏进行中
    PAUSE:2,   //游戏暂停

    /**
     * 强调
     * 1. 每个属性/方法之间必须加逗号
     * 2. 只要自己的方法要访问自己的属性,必须加this.
     */
    //启动游戏
    start(){
        this.status=this.RUNNING;
        this.lines=0;
        this.score=0;
        //初始化方块墙为RN*CN个空元素的数据
        this.wall=[];
        for(var r=0;r<this.RN;r++) {
            this.wall[r] = new Array(this.CN);
        };
        // console.log(this.wall.join("/n"));
        // this->game
        //随机生成主角和备胎图形
        this.shape=this.randomShape();
        this.nextShape=this.randomShape();
        this.shape=new T();
        this.paint(); //绘制一切
        // 启动周期性定时器
        this.timer=setInterval(
            this.moveDown.bind(this), //定时器调用this->window
            this.interval
        );
        document.onkeydown=function (e) {
            //this->document->bind->game
            switch(e.keyCode){
                case 37://左
                    if(this.status==this.RUNNING)
                    this.moveLeft();
                    break;
                case 39://右
                    if(this.status==this.RUNNING)
                    this.moveRight();
                    break;
                case 40://下
                    if(this.status==this.RUNNING)
                    this.moveDown();
                    break;
                case 32: //空格->一落到底
                    if(this.status==this.RUNNING)
                    this.hardDrop();
                    break;
                case 38: //上->顺时针旋转
                    if(this.status==this.RUNNING)
                    this.rotateR();
                    break;
                case 90: //Z->逆时针旋转
                    if(this.status==this.RUNNING)
                    this.rotateL();
                    break;
                case 83: //S->重启游戏
                    if(this.status==this.GAMEOVER)
                    this.start();
                    break;
                case 80: //P->暂停游戏
                    if(this.status==this.RUNNING)
                    this.pause();
                    break;
                case 67: //c->暂停状态恢复游戏
                    if(this.status==this.PAUSE)
                    this.myContinue();
                    break;
                case 81: //q->放弃
                    if(this.status!=this.GAMEOVER)
                        this.gameover();
                    break;
            }
        }.bind(this);
    },
    //结束游戏
    gameover(){
        //停止定时器
        clearInterval(this.timer);
        this.timer=null;
        this.status=this.GAMEOVER;
        this.paint();
    },
    //暂停游戏
    pause(){
        clearInterval(this.timer);
        this.timer=null;
        this.status=this.PAUSE;
        this.paint();
    },
    //继续游戏
    myContinue(){
        //启动定时器
        this.timer=setInterval(
            this.moveDown.bind(this),this.interval
        );
        this.status=this.RUNNING;
        this.paint();
    },
    //生成随机图形
    randomShape(){
        var r=parseInt(Math.random()*3);
        switch(r){
            case 0:return new O();
            case 1:return new I();
            case 2:return new T();
        }
    },
    //判断能否旋转
    canRotate(){
        //遍历主角图形的cells中每个cell
        for(var cell of  this.shape.cells){
            //如果cell的r<0或r>=RN
            if(cell.r<0||cell.r>=this.RN
                //或cell的r<0或c>=CN
                ||cell.c<0||cell.c>=this.CN
                //或wall中cell相同位置不是undefined
                ||this.wall[cell.r][cell.c]!==undefined
            ){
                return false;//就返回false
            }
        }//(遍历结束)
        return true;  //就返回true
    },
    //顺时针旋转
    rotateR(){
        //让主角顺时针旋转一次
        this.shape.rotateR();
        //如果不能旋转
        if(!this.canRotate()){
            //再逆时针旋转回来
            this.shape.rotateL();
        }else{
            //重绘一切
            this.paint();
        }
    },
    //逆时针旋转
    rotateL(){
        //让主角逆时针旋转一次
        this.shape.rotateL();
        //如果不能旋转
        if(!this.canRotate()){
            //再顺时针旋转回来
            this.shape.rotateR();
        }else{
            //重绘一切
            this.paint();
        }
    },
    //一落到底
    hardDrop(){
        while(this.canDown()){
            this.shape.moveDown();
        }
        this.paint();
    },
    // 判断能否左移
    canLeft(){
        //遍历主角的cells中每个cell
        for(var cell of this.shape.cells) {
            //如果cell的c==0
            if(cell.c==0
                 //或wall中cell左侧不是undefined
                ||this.wall[cell.r][cell.c-1]!==undefined
            ){
                return false;//就返回false
            }
        }//(遍历结束)
        return true;  //才返回true
    },
    //左移1列
    moveLeft(){
        //如果可以左移
        if (this.canLeft()) {
            //让主角左移一列
            this.shape.moveLeft();
            //重绘一切
            this.paint();
        }
    },
    // 判断能否右移
    canRight(){
        //遍历主角的cells中每个cell
        for(var cell of this.shape.cells) {
            //如果cell的c==CN-1
            if(cell.c==this.CN-1
                //或wall中cell右侧不是undefined
                ||this.wall[cell.r][cell.c+1]!==undefined
            ){
                return false;//就返回false
            }
        }//(遍历结束)
        return true;  //才返回true
    },
    //右移1列
    moveRight(){
        //如果可以右移
        if (this.canRight()) {
            //让主角右移一列
            this.shape.moveRight();
            //重绘一切
            this.paint();
        }
    },
    //判断主角图形是否还可以下落
    canDown(){
        //遍历主角图形中cells数组中每个cell
        for(var cell of this.shape.cells){
            //任意一个触底(r=Rn-1)
            if(cell.r==this.RN-1
                //或任意一格在wall中下方有格
                ||this.wall[cell.r+1][cell.c]!==undefined
            ){
                return false;
            }
        }
        return true;
    },
    //下落
    moveDown(){
        //如果可以下落
        if(this.canDown()){
            // this->game
            //让主角图形下落一行
            this.shape.moveDown();
        }else{
            // 将主角中所有格存入wall中相同位置
            this.landIntoWall();
            //判断并删除满格行
            var ln=this.deleteRows();
            this.lines+=ln;
            this.score+=this.SCORES[ln];
            //如果游戏没有结束
            if(!this.isGAMEOVER()){
                //备胎转正,在生成新备胎
                this.shape=this.nextShape;
                this.nextShape=this.randomShape();
            }else{//否则
                //游戏结束
                // 停止定时器
                clearInterval(this.timer);
                this.timer=null;
                this.status=this.GAMEOVER;
            }
        }
        //重绘一切
        this.paint();
    },
    //判断游戏是否结束
    isGAMEOVER(){
        //遍历备胎图形中每个cell
        for(var  cell of this.nextShape.cells){
            //如果在wall中cell相同位置有格
            if(this.wall[cell.r][cell.c]!=undefined){
                return true;
            }//(遍历结束)
            return false;//返回false
        }
    },
    //删除满格行
    deleteRows(){
        var ln=0;//记录本次删除的行数
        //自底向上遍历wall中每一行
        for(var r=this.RN-1;r>=0;r--){
            //如果当前行是空行,则不再向上遍历
            if(this.wall[r].join("")===""){
                break;
            }
            //如果r是满格行
            if(this.isFullRow(r)){
                //就删除第r行
                this.deleteRow(r);
                ln++;
                if(ln==4){
                    break;
                }
                //r要留在原地
                r++;
            }
        }
        return ln;
    },
    //判断第r行是否满格
    isFullRow(r){
        var reg=/^,|,,|,$/; //三种情况 1 开头逗号2.相邻两个逗号,结尾逗号
        if(reg.test(String(this.wall[r]))){
            return false;
        }else{
            return true;
        }
    },
    //删除第r行
    deleteRow(r){
        //从r开始,反向向上遍历wal中剩余行
        for(;r>=0;r--) {
            //用r-1行赋值给r行
            this.wall[r]=this.wall[r-1];
            //将r-1行置为CN个空元素的数组
            this.wall[r-1]=new Array(this.CN);
            //遍历r中每个格
            for(var cell of this.wall[r]){
                //如果不是undefined
                if(cell!==undefined){
                    //就给当前格的r+1
                    cell.r++;
                }
            }//(遍历结束)
            //如果r-2行是空行
            if(this.wall[r-2].join("")===""){
                break; //就退出循环
            }
        }
    },
    //落入墙中
    landIntoWall(){
        //遍历主角图形中的cells中的没和cell
        for(var cell of this.shape.cells){
            // 将cell保存到wall中相同的位置\
            this.wall[cell.r][cell.c]=cell;
        }

    },
    //绘制得分
    paintScore(){
        var spans=this.pg.getElementsByTagName("span");
        spans[0].innerHTML=this.score;
        spans[1].innerHTML=this.lines;
    },
    //绘制状态
    paintStatus(){
        if(this.status==this.GAMEOVER){
            var img=new Image();
            img.src="img/game-over.png";
            this.pg.appendChild(img);
        }else if(this.status==this.PAUSE){
            var img=new Image();
            img.src="img/pause.png";
            this.pg.appendChild(img);
        }
    },
    //重绘一切
    paint(){
        //清除pg中所有img
        var reg=/<img .*>/ig;    //匹配img
        //因为所有字符串的api不能修改原来的字符串,所以用this.pg.innerHTML接
        this.pg.innerHTML=this.pg.innerHTML.replace(reg,"");
        //再重绘主角
        this.paintShape();
        //再重绘墙
        this.paintWall();
        //得分
        this.paintScore();
        //重绘备胎
        this.paintNext();
        //绘制状态
        this.paintStatus();
    },
    //重绘备胎
    paintNext(){
        //创建frag
        var frag=document.createDocumentFragment();
        //遍历备胎图形中cells数组中每个cell
        for(var cell of  this.nextShape.cells){
            //每遍历一个cell就像页面添加一个img,并设置img的大小,位置和src
            var img=new  Image();
            /*img.style.width=this.CSIZE+"px";
            img.style.left=this.CSIZE*cell.c+this.OFFSET+"px";
            img.style.top=this.CSIZE*cell.r+this.OFFSET+"px";
            img.src=cell.src;*/
            img.style.cssText=`
            width:${this.CSIZE}px;
            left:${this.CSIZE*(cell.c+10)+this.OFFSET}px;
            top:${this.CSIZE*(cell.r+1)+this.OFFSET}px
           `;
            img.src=cell.src;
            //将img追加到frag中
            frag.appendChild(img);
        }
        //将frag整体追加到pg
        this.pg.appendChild(frag);
    },
    //重绘墙Wall
    paintWall(){
        //创建frag
        var frag=document.createDocumentFragment();
        //遍历墙中每个格
        for(var r=this.RN-1;r>=0;r--){
            //如果当前行是空行则退出循环
            if(this.wall[r].join("")===""){
                break;
            };
            for(var c=0;c<this.CN;c++) {
                var cell=this.wall[r][c];
                if(cell!==undefined){
                    // 创建img,设置大小,位置src
                    var img=new  Image();
                    img.style.cssText=`
                    width:${this.CSIZE}px;
                    left:${this.CSIZE*cell.c+this.OFFSET}px;
                    top:${this.CSIZE*cell.r+this.OFFSET}px
               `;
                    img.src=cell.src;
                    //将img追加到frag中
                    frag.appendChild(img);
                }
            }
        }
        //将frag整体追加到pg
        this.pg.appendChild(frag);
    },
    // 绘制主角图形
    paintShape(){
        //创建frag
        var frag=document.createDocumentFragment();

        //遍历主角图形中cells数组中每个cell
        for(var cell of  this.shape.cells){
            //每遍历一个cell就像页面添加一个img,并设置img的大小,位置和src
            var img=new  Image();
            /*img.style.width=this.CSIZE+"px";
            img.style.left=this.CSIZE*cell.c+this.OFFSET+"px";
            img.style.top=this.CSIZE*cell.r+this.OFFSET+"px";
            img.src=cell.src;*/
            img.style.cssText=`
            width:${this.CSIZE}px;
            left:${this.CSIZE*cell.c+this.OFFSET}px;
            top:${this.CSIZE*cell.r+this.OFFSET}px
           `;
            img.src=cell.src;
            //将img追加到frag中
            frag.appendChild(img);
        }
        //将frag整体追加到pg
        this.pg.appendChild(frag);
    }
}
game.start();