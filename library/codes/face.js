importPackage(java.awt);
importPackage(java.awt.geom);

function Face(info){
    this.type = "Face";
    if(info.modelInfo.model==null){
        let faceModel = info.modelInfo.faceDouble? getDoubleFaceModel(): getFaceModel();
        let rawModel = faceModel.copy();
        rawModel.setAllRenderType(info.modelInfo.renderType?info.modelInfo.renderType:"exterior");
        rawModel.sourceLocation = null;
        rawModel.applyScale(info.modelInfo.size.x,info.modelInfo.size.y,1);
        this.dynamicModelHolder = new DynamicModelHolder();
        this.dynamicModelHolder.uploadLater(rawModel);
        this.model = null;
    }else{
        this.model = info.modelInfo.model;
    }
    this.modelPosition = {
        x: info.position ? (info.position.x !== undefined ? info.position.x : 0) : 0,
        y: info.position ? (info.position.y !== undefined ? info.position.y : 0) : 0,
        z: info.position ? (info.position.z !== undefined ? info.position.z : 0) : 0
    };
    this.modelRotation = {
        x: info.rotation ? (info.rotation.x !== undefined ? info.rotation.x : 0) : 0,
        y: info.rotation ? (info.rotation.y !== undefined ? info.rotation.y : 0) : 0,
        z: info.rotation ? (info.rotation.z !== undefined ? info.rotation.z : 0) : 0
    };       
    this.display = info.display?info.display:true;
}

Face.prototype.setupModel = function(){
    if(this.model==null){
        this.model = this.dynamicModelHolder.uploadedModel;
        if(this.graphicsTexture!=null){
            this.model.replaceAllTexture(this.graphicsTexture.identifier)
        }
    }
}

Face.prototype.openGraphics = function(x,y){
    this.graphicsTexture = new GraphicsTexture(x,y);
}

Face.prototype.replaceAllTexture = function(name){
    this.model.replaceAllTexture(Resources.id(name));
}
Face.prototype.graphics = function(){
    return this.graphicsTexture.graphics;
}

Face.prototype.copy = function(){
    let copy = new Face();
    for (let key of Object.keys(obj)) {
        copy[key] = obj[key];
    }
    return  copy;
}

Face.prototype.setupModelMatrix = function(matrices){
    matrices.translate(this.modelPosition.x,this.modelPosition.y,this.modelPosition.z);
    matrices.rotateX(this.modelRotation.x);
    matrices.rotateY(this.modelRotation.y);
    matrices.rotateZ(this.modelRotation.z);
}

Face.prototype.teleportModel = function(position,rotation){
    this.modelPosition.x = position.x||0;
    this.modelPosition.y = position.y||0;
    this.modelPosition.z = position.z||0;
    this.modelRotation.x = rotation.x||0;
    this.modelRotation.y = rotation.y||0;
    this.modelRotation.z = rotation.z||0;
}

Face.prototype.translateModel = function(position,rotation){
    this.modelPosition.x += position.x||0;
    this.modelPosition.y += position.y||0;
    this.modelPosition.z += position.z||0;
    this.modelRotation.x += rotation.x||0;
    this.modelRotation.y += rotation.y||0;
    this.modelRotation.z += rotation.z||0;
}

Face.prototype.draw = function(carriage,ctx,mat){
    if(this.display){
        matrices = mat?mat:new Matrices();
        matrices.pushPose();
        matrices.translate(this.modelPosition.x,this.modelPosition.y,this.modelPosition.z);
        matrices.rotateX(this.modelRotation.x);
        matrices.rotateY(this.modelRotation.y);
        matrices.rotateZ(this.modelRotation.z);
        if(carriage==-1){
            ctx.drawModel(this.model, matrices);
        }else{
            for(let i=0;i<carriage;i++){
                ctx.drawCarModel(this.model, i, matrices);
            }
        }
        matrices.popPose();
    }
}

Face.prototype.debug = function(ctx){
    ctx.setDebugInfo("model",this.model);
    ctx.setDebugInfo("px",this.modelPosition.x);
    ctx.setDebugInfo("py",this.modelPosition.y);
    ctx.setDebugInfo("pz",this.modelPosition.z);
    ctx.setDebugInfo("rx",this.modelRotation.x);
    ctx.setDebugInfo("ry",this.modelRotation.y);
    ctx.setDebugInfo("rz",this.modelRotation.z);
}

Face.prototype.model = function(){
    return this.model;
}

Face.prototype.bufferedImage = function(){
    return this.graphicsTexture.bufferedImage();
}

Face.prototype.close = function(){
    this.graphicsTexture.close();
}

Face.prototype.hide = function(){
    this.display = false;
}

Face.prototype.show = function(){
    this.display = true;    
}

Face.prototype.upload = function(){
    this.graphicsTexture.upload();
}   

Face.prototype.alterRGBA = function(r,g,b,a){
    alterAllRGBA(this.model, r,g,b,a);
}

function alterAllRGBA (modelCluster, r ,g , b, a) {
    let vertarray = modelCluster.uploadedTranslucentParts.meshList;
    let vert = vertarray[0];
    for(let i = 0; i < vertarray.length; i++) {
        vert = vertarray[i];
        vert.materialProp.attrState.setColor(r , g , b , a);
    }
    vertarray = modelCluster.uploadedOpaqueParts.meshList;
    vert = vertarray[0];
    for(let i = 0; i < vertarray.length; i++) {
        vert = vertarray[i];
        vert.materialProp.attrState.setColor(r , g , b , a);
    }
}

function getFaceModel(){
    let rawModelBuilder = new RawMeshBuilder(4, "exterior", Resources.id("mtr:library/textures/empty.png"));

    rawModelBuilder.vertex(0.5, 0.5, 0).normal(0, 0, 0).uv(1, 0).endVertex()
    .vertex(-0.5, 0.5, 0).normal(0, 0, 0).uv(0, 0).endVertex()
    .vertex(-0.5, -0.5, 0).normal(0, 0, 0).uv(0, 1).endVertex()
    .vertex(0.5, -0.5, 0).normal(0, 0, 0).uv(1, 1).endVertex()    

    let rawModel = new RawModel();
    rawModel.append(rawModelBuilder.getMesh());
    rawModel.generateNormals();
    return rawModel;
}

function getDoubleFaceModel(){
    let rawModelBuilder = new RawMeshBuilder(4, "exterior", Resources.id("mtr:library/textures/empty.png"));

    rawModelBuilder.vertex(0.5, 0.5, 0).normal(0, 0, 0).uv(1, 0).endVertex()
    .vertex(-0.5, 0.5, 0).normal(0, 0, 0).uv(0, 0).endVertex()
    .vertex(-0.5, -0.5, 0).normal(0, 0, 0).uv(0, 1).endVertex()
    .vertex(0.5, -0.5, 0).normal(0, 0, 0).uv(1, 1).endVertex()    

    rawModelBuilder.vertex(0.5, 0.5, 0).normal(0, 0, 0).uv(0, 0).endVertex()
    .vertex(0.5, -0.5, 0).normal(0, 0, 0).uv(0, 1).endVertex()
    .vertex(-0.5, -0.5, 0).normal(0, 0, 0).uv(1, 1).endVertex()
    .vertex(-0.5, 0.5, 0).normal(0, 0, 0).uv(1, 0).endVertex()

    let rawModel = new RawModel();
    rawModel.append(rawModelBuilder.getMesh());
    rawModel.generateNormals();
    return rawModel;
}