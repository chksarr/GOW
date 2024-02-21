/* eslint-disable import/named */

import { Scene, KeyboardEventTypes,  FreeCamera, ShadowGenerator, ActionManager,  Vector3, SpotLight, Texture, HemisphericLight, MeshBuilder, Color3, StandardMaterial } from "@babylonjs/core";
import floorUrl from "../assets/textures/floor.png";
import floorBumpUrl from "../assets/textures/floor_bump.PNG";
import { Inspector} from "@babylonjs/inspector";
import  Player  from './Player';
class Game {
    #canvas;
    #engine;
    #gameScene;
    #sphere;
    #phase = 0.0;
    #vitesseY = 0.0018;
    #zoneA;
    #zoneB;
    #bInspector = false;

    #player;
    constructor(canvas, engine) {
        this.#canvas = canvas;
        this.#engine = engine;
    }

    async start() { 
        await this.initGame(); 
        this.gameLoop(); 
        this.endGame(); }

    createScene() {
        const scene = new Scene(this.#engine);
        Inspector.Show(scene, {});
        const camera = new FreeCamera("camera1",
            new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(this.#canvas, true);

        const light = new HemisphericLight("light",
            new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        const sLight = new SpotLight("spot1", new Vector3(0, 20, 20), new Vector3(0, -1, -1), 1.2, 24, scene);
        const shadowGenerator = new ShadowGenerator(1024, sLight);
        shadowGenerator.useBlurExponentialShadowMap = true;


       




        const ground = MeshBuilder.CreateGround("ground",
            { width: 6, height: 6 }, scene);
        ground.receiveShadows = true;

        const matGround = new StandardMaterial("boue", scene);
        matGround.bumpTexture = new Texture(floorBumpUrl);
        matGround.diffuseTexture = new Texture(floorUrl);
        ground.material = matGround;

        
        this.#zoneA = MeshBuilder.CreateBox("zoneA", { width: 8, height: 0.2, depth: 8 },
            scene);
        let zoneMat = new StandardMaterial("zoneA", scene);
        zoneMat.diffuseColor = Color3.Red();
        zoneMat.alpha = 0.5;
        this.#zoneA.material = zoneMat;
        this.#zoneA.position = new Vector3(12, 0.1, 12);

        this.#zoneB = MeshBuilder.CreateBox("zoneB", { width: 8, height: 0.2, depth: 8 },
            scene);
        let zoneMatB = new StandardMaterial("zoneB", scene);
        zoneMatB.diffuseColor = Color3.Green();
        zoneMatB.alpha = 0.5;
        this.#zoneB.material = zoneMatB;
        this.#zoneB.position = new Vector3(-12, 0.1, -12);

        Player.actionManager = new ActionManager(scene);

        

        // Player.actionManager.registerAction(
        //     new SetValueAction(
        //         { trigger: ActionManager.OnIntersectionExitTrigger, parameter: this.#zoneB },
        //         Player.material,
        //         'diffuseColor',
        //         Player.material.diffuseColor
        //     )
        // );

        // Player.actionManager.registerAction(
        //     new InterpolateValueAction(
        //         ActionManager.OnPickTrigger,
        //         light,
        //         'diffuse',
        //         Color3.Black(),
        //         1000
        //     )
        // );


        return scene;
    }

    inputMap = {};
    actions = {};

    initInput() {
        this.#gameScene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    this.inputMap[kbInfo.event.code] = true;
                    console.log(`KEY DOWN: ${kbInfo.event.code} / 
        ${kbInfo.event.key}`);
                    break;
                case KeyboardEventTypes.KEYUP:
                    this.inputMap[kbInfo.event.code] = false;
                    this.actions[kbInfo.event.code] = true;
                    console.log(`KEY UP: ${kbInfo.event.code} / 
        ${kbInfo.event.key}`);
                    break;
            }
        });
    }




    async initGame() {
        this.#gameScene = this.createScene();
        this.initInput();
        this.#player = new Player(3, 1, 3, this.#gameScene); 
        await this.#player.init();

    }

    endGame() {

    }
    gameLoop() {
        const divFps = document.getElementById("fps");
        this.#engine.runRenderLoop(() => {
            this.updateGame();
            divFps.innerHTML = this.#engine.getFps().toFixed() + " fps";
            this.#gameScene.render();
        });
        this.updateGame();
        this.actions = {};

        //Debug
        if (this.actions["KeyI"]) {
            this.#bInspector = !this.#bInspector;
            if (this.#bInspector)
                Inspector.Show();
            else
                Inspector.Hide();
        }
    }
    updateGame() {
        // let delta = this.#engine.getDeltaTime() / 1000.0;
        // this.#player += this.#vitesseY * delta;
        // //this.#player.position.y = 2 + Math.sin(this.#phase);
        // this.#player.scaling.y = 1 + 0.125 * Math.sin(this.#phase);
        // this.#player.update(this.inputMap, this.actions, delta);

        // //Déplacement en X suivant les touches Q et D
        // if (this.inputMap["KeyA"])
        //     this.#player.position.x -= 0.01 * delta;
        // else if (this.inputMap["KeyD"])
        //     this.#player.position.x += 0.01 * delta;

        // //Déplacement en z suivant les touches S et Z
        // if (this.inputMap["KeyW"])
        //     this.#player.position.z += 0.01 * delta;
        // else if (this.inputMap["KeyS"])
        //     this.#player.position.z -= 0.01 * delta;

        // // la touche espace est appuyée ET relâchée on augmente notre vitesse
        // if (this.actions["Space"])
        //     this.#vitesseY *= 1.25;


        // //Collisions
        // if (this.#player.intersectsMesh(this.#zoneA, false))
        //     this.#player.material.emissiveColor = Color3.Red();
        // else
        //     this.#player.material.emissiveColor = Color3.Black();

    }




}

export default Game;