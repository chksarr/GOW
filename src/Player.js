import { TransformNode,SceneLoader, Vector3, MeshBuilder } from "@babylonjs/core"
import girlModelUrl from "../assets/models/HVGirl.glb";
class Player {
    scene;
    
    //Position dans le monde
    transform;
    //Mesh
    gameObject;
    x = 0.0;
    y = 0.0;
    z = 0.0;
    speedX = 0.0;
    speedY = 0.0;
    speedZ = 0.0;
    //Animations 
    animationsGroup;
    bWalking = false; 
    idleAnim; 
    runAnim;
    

    constructor(x, y, z, scene) {
        this.scene = scene;
        this.x = x || 0.0;
        this.y = y || 0.0;
        this.z = z || 0.0;
        this.transform = new TransformNode("");
        this.transform.position = new Vector3(this.x, this.y, this.z);
    }
    async init() { 
        //On cré le mesh et on l'attache à notre parent 
        const result = await SceneLoader.ImportMeshAsync("", "", girlModelUrl, this.scene);

        this.gameObject = result.meshes[0]; 
        this.gameObject = MeshBuilder.CreateBox("player", { size: 2 });
        this.gameObject.scaling = new Vector3(0.1, 0.1, -0.1); 
        this.gameObject.parent = this.transform; 
        this.animationsGroup = result.animationGroups; 
    }

    //Pour le moment on passe les events clavier ici, on utilisera un InputManager plus tard
    update(inputMap, actions, delta) {
        //Inputs
        if (inputMap["KeyA"])
            this.speedX = -25;
        else if (inputMap["KeyD"])
            this.speedX = 25;
        else {
            //Frottements
            this.speedX += (-10.0 * this.speedX * delta);
        }

        if (inputMap["KeyW"])
            this.speedZ = 25;
        else if (inputMap["KeyS"])
            this.speedZ = -25;
        else {
            //Frottements
            this.speedZ += (-10.0 * this.speedZ * delta);
        }

        if (actions["Space"]) {
            //Pas de delta ici, c'est une impulsion non dépendante du temps (pas d'ajout)
            //On autorise le saut meme si on es pas vraiment sur le sol (presque) a condition d'etre en train de tomber
            if (this.y <= 2.0 && this.speedY < 0)
                this.speedY = 50;
        }
        this.speedY = this.speedY - (100 * delta);
        
        //Move 
        this.x += this.speedX * delta;
        this.y += this.speedY * delta;
        this.z += this.speedZ * delta;
        
        //Check collisions 
        if (this.x > 30)
            this.x = 30;
        else if (this.x < -30)
            this.x = -30;
        if (this.z > 30) this.z = 30;
        else if (this.z < -30)
            this.z = -30;
        if (this.y < 1)
            this.y = 1;

        //Position update 
        this.transform.position.set(this.x, this.y, this.z);
        //Orientation 
        let directionXZ = new Vector3(this.speedX, 0, this.speedZ) ; 
        this.gameObject.lookAt(directionXZ);

        if(directionXZ.length() > 2.5) {
            if(!this.bWalking) {
                 this.runAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
                 this.bWalking = true;
             }
         } 
         else {
             if (this.bWalking) {
                 this.runAnim.stop();
                 this.idleAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
                 this.bWalking = false;
             }
         }
    }

}

export default Player;