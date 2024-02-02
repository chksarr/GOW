class Game {

    #canvas;
    #engine;
    #gameScene;

    constructor(canvas, engine) {
        this.#canvas = canvas;
        this.#engine = engine;
    }

    start() {
        this.initGame()
        this.gameLoop();
        this.endGame();
    }

    initGame() {
    }

    initInput() {
    }

    endGame() {

    }

    gameLoop() {
    }

    updateGame() {
    }

}

export default Game;





