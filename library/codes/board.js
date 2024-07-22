function Board(info){
    this.position = {x: info && info.position && info.position.x ? info.position.x : 0,y: info && info.position && info.position.y ? info.position.y : 0,z: info && info.position && info.position.z ? info.position.z : 0};
    this.rotation = {x: info && info.rotation && info.rotation.x ? info.rotation.x : 0,y: info && info.rotation && info.rotation.y ? info.rotation.y : 0,z: info && info.rotation && info.rotation.z ? info.rotation.z : 0};
    this.interval = (info && info.interval) ? info.interval : 0.004;
    this.map = new Map();
    this.display = (info && info.display) ?info.display :true ;
    this.isSetup = false;
}

Board.prototype.addMap = function(name){
    this.map[name] = new Array();
    this.now = name;
}

Board.prototype.removeMap = function(name){
    delete this.map[name];
}

Board.prototype.clearMap = function(){
    this.map = new Map();
}

Board.prototype.setShow = function(name){
    this.now = name;
}

Board.prototype.addItem = function(item){
    this.map[this.now].push(item);
}

Board.prototype.removeItem = function(){
    this.map[this.now].pop();
}

Board.prototype.clearItem = function(){
    this.map[this.now] = new Array();
}

Board.prototype.draw = function(carriage,ctx,mat){
    if(this.display){
        matrices = mat?mat:new Matrices();
        matrices.pushPose();
        matrices.translate(this.position.x,this.position.y,this.position.z);
        matrices.rotateX(this.rotation.x);
        matrices.rotateY(this.rotation.y);
        matrices.rotateZ(this.rotation.z);
        for(let i=0;i<this.map[this.now].length;i++){
            if(this.map[this.now][i].display){
                matrices.pushPose();
                this.map[this.now][i].setupModelMatrix(matrices);
                if(carriage==-1){
                    ctx.drawModel(this.map[this.now][i].model, matrices);
                }else{
                    for(let j=0;j<carriage;j++){
                        ctx.drawCarModel(this.map[this.now][i].model, j, matrices);
                    }
                }
                matrices.popPose();
                matrices.translate(0,0,this.interval)
            }
        }
        matrices.popPose();
    }
}

Board.prototype.debug = function(ctx){
    /*
    ctx.setDebugInfo("bpx",this.position.x);
    ctx.setDebugInfo("bpy",this.position.y);
    ctx.setDebugInfo("bpz",this.position.z);
    ctx.setDebugInfo("brx",this.rotation.x);
    ctx.setDebugInfo("bry",this.rotation.y);
    ctx.setDebugInfo("brz",this.rotation.z);
    ctx.setDebugInfo("bstack",this.map[this.now].length);*/
    for(let i=0;i<this.map[this.now].length;i++){
        ctx.setDebugInfo("model"+i,this.map[this.now][i].model);
        ctx.setDebugInfo("display"+i,this.map[this.now][i].display);
        ctx.setDebugInfo("type"+i,this.map[this.now][i].type);
    }
}

Board.prototype.updateAllVideo = function(time,carriage,ctx){
    for(let i=0;i<this.map[this.now].length;i++){
        if(this.map[this.now][i].type=="Video"){
            this.map[this.now][i].update(time,carriage,ctx);
        }
    }
}

Board.prototype.translate = function(position,rotation){
    this.position.x += position.x||0;
    this.position.y += position.y||0;
    this.position.z += position.z||0;
    this.rotation.x += rotation.x||0;
    this.rotation.y += rotation.y||0;
    this.rotation.z += rotation.z||0;
}

Board.prototype.teleport = function(position,rotation){
    this.position.x = position.x||0;
    this.position.y = position.y||0;
    this.position.z = position.z||0;
    this.rotation.x = rotation.x||0;
    this.rotation.y = rotation.y||0;
    this.rotation.z = rotation.z||0;
}

Board.prototype.setupAllModel = function(){
    if(!this.isSetup){
        for(let i=0;i<this.map[this.now].length;i++){
            this.map[this.now][i].setupModel();
        }
        this.isSetup = true;
    }
}

Board.prototype.hide = function(){
    this.display = false;
}

Board.prototype.show = function(){
    this.display = true;
}