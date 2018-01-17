## 俄罗斯方块游戏

http://suiyuejinghao.top/tetris/tetris.html

区域 10*20

##### T图形  (class T)

    cells:[
        cell(0,3,T.png)
        cell(0,4,T.png)
        cell(0,5,T.png)
        cell(1,4,T.png)
    ]
    moveDown()  //下降
    moveLeft()  //向左
    moveRight() //向右
    rotateR()   //向右旋转
    rotateL()   //向左旋转

##### O图形  (class O)

    cells:[
        cell(0,4,O.png)
        cell(0,5,O.png)
        cell(1,4,O.png)
        cell(1,5,O.png)
    ]
    moveDown()  //下降
    moveLeft()  //向左
    moveRight() //向右
    rotateR()   //向右旋转
    rotateL()   //向左旋转

T图形和O图形都有相同的方法,所以可以定义==抽象父类型==

    定义一个图形需要9个参数
    constructor(r0,c0,r1,c1,r2,c2,r3,c3,src)
    class Shape
        cells:[
            cell(r0,c0,src)
            cell(r1,c1,src)
            cell(r2,c2,src)
            cell(r3,c3,src)
        ]
        moveDown()  //下降
        moveLeft()  //向左
        moveRight() //向右
        rotateR()   //向右旋转
        rotateL()   //向左旋转
    
    class Cell
        r,c,src
    
        
故定义图形(采用继承的方式)

    class T extends Shape //继承
        super(0,3,0,4,0,5,1,4,T.png)
    new T //创建T图形
        
    class O extends Shape
        super(0,4,0,5,1,4,1,5,O.png)
    class i extends Shape
        super(0,3,0,4,1,5,1,6,I.png)
    


## 使用面向对象方法编写内容

消除满格行


### 旋转
    
    T:     r0,c0,r1.c1,r2,c2,r3,c3
     state( 0,-1, 0, 0, 0,+1,+1, 0)
     state(-1, 0, 0, 0,+1, 0, 0,-1)
     state( 0,+1, 0, 0, 0,-1,-1, 0)
     state(+1, 0, 0, 0,-1, 0, 0,+1)
     
     cell1(2,4)
     cell2(2+0,4-1)
     cell3(2+0,4+1)
     cell4(2+1,4+0)
    
     T:     r0,c0,r1.c1,r2,c2,r3,c3
     state( 0,-1, 0, 0, +1,-1,+1,0)
     
     I:     r0,c0,r1.c1,r2,c2,r3,c3
     state( 0,-1, 0, 0, 0,+1, 0,+2)
     state( -1,0, 0, 0,+1, 0,+2, 0)
