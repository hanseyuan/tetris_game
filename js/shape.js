// 创建小类型
class Cell{
    constructor(r,c,src){
        this.r=r;
        this.c=c;
        this.src=src;
    }
}
class State{
    constructor(r0,c0,r1,c1,r2,c2,r3,c3){
        this.r0=r0; this.c0=c0;
        this.r1=r1; this.c1=c1;
        this.r2=r2; this.c2=c2;
        this.r3=r3; this.c3=c3;
    }
}
class Shape{
    constructor(r0,c0,r1,c1,r2,c2,r3,c3,src,states,orgi){
        this.cells=[
            new Cell(r0,c0,src),
            new Cell(r1,c1,src),
            new Cell(r2,c2,src),
            new Cell(r3,c3,src)
        ];
        this.states=states;
        this.orgCell=this.cells[orgi];
        this.statei=0;
    }
    //下降
    moveDown(){
        //遍历当前图形的cells中每个cell
        for(var cell of this.cells){
            cell.r++;
        }
    }
    //向左
    moveLeft(){
        //遍历当前图形的cells中每个cell
        for(var cell of this.cells){
            cell.c--;
        }
    }
    //向右
    moveRight(){
        //遍历当前图形的cells中每个cell
        for(var cell of this.cells){
            cell.c++;
        }
    }
    //向右旋转
    rotateR(){
        //将statei+1
        this.statei++;
        //如果statei越界,就返回0
        if(this.statei==this.states.length){
            this.statei=0;
        }
        //旋转
        this.rotate();
    }
    //向左旋转
    rotateL(){
        //将statei-1
        this.statei--;
        //如果statei等于-1,就返回this.states.length-1
        if(this.statei==-1){
            this.statei=this.states.length-1;
        }
        //旋转
        this.rotate();
}
    //旋转
    rotate(){
        //获得statei状态对象
        var state=this.states[this.statei];
        //根据参照格的位置算出其他格
        for(var i=0;i<this.cells.length;i++){
            if(this.cells[i]!=this.orgCell){
                this.cells[i].r=this.orgCell.r+state["r"+i];
                this.cells[i].c=this.orgCell.c+state["c"+i];
            }
        }
        /*
            改为循环
            this.cell[0].r=this.orgCell.r+state.r0;
            this.cell[0].c=this.orgCell.c+state.c0;
            this.cell[1].r=this.orgCell.r+state.r1;
            this.cell[1].c=this.orgCell.c+state.c1;
            this.cell[2].r=this.orgCell.r+state.r2;
            this.cell[2].c=this.orgCell.c+state.c2;
            this.cell[3].r=this.orgCell.r+state.r3;
            this.cell[3].c=this.orgCell.c+state.c3;
        */
    }
}
// 创建T
class T extends  Shape{
    constructor(){
        super(0,3,0,4,0,5,1,4,'img/T.png',
        [
            new State(0,-1, 0, 0, 0,+1,+1, 0),
            new State(-1, 0, 0, 0,+1, 0, 0,-1),
            new State(0,+1, 0, 0, 0,-1,-1, 0),
            new State(+1, 0, 0, 0,-1, 0, 0,+1)
        ],1
        )
    }
}

//创建O
class O extends Shape{
    constructor(){
        super(0,4,0,5,1,4,1,5,'img/O.png',
            [
                new State( 0,-1, 0, 0, +1,-1,+1,0)
            ]
            ,1
        )
    }
}

// 创建I
class I extends Shape{
    constructor(){
        super(0,3,0,4,0,5,0,6,'img/I.png',
            [
                new State( 0,-1, 0, 0, 0,+1, 0,+2),
                new State( -1,0, 0, 0,+1, 0,+2, 0)
            ]
            ,1
        )
    }
}

// var t=new T() ;
// console.dir(t);