(function () {
    const TAMX = 600;
    const TAMY = 800;
    const FPS = 60;
    const tiro = new Audio('assets/laser.mp3');
    let PROB_ENEMY_SHIP = 0.9;
    
    let QtdInimigosVariados = 4, AumentaVelocidade = 3;
    let start = true, pause = false;
    let space, ship;
    let enemies = [], balas = [];
    let interval, intervalGame, velocidade;



    function GameStart() {
        start = true;
        space = new Space();
        ship = new Ship();
        points = new PointsAndLife();
        interval = window.setInterval(startAnimation, 1000 / FPS);
    }
    function init() {
        intervalGame = window.setInterval(fun, 1000 / FPS);
        velocidade = window.setInterval(AumentaVelocidadeInimigos, 60000);  //A cada 1 minuto aumenta a velocidade de todos os inimigos   
    }


    window.addEventListener("keydown", (e) => {
        if (e.key === "p") {
            if (pause == false) {
                pause = true;
                clearInterval(intervalGame);
                clearInterval(velocidade);
            }
            else {
                pause = false;
                init();
            }
        };
        if (start == false && pause == false) {
            if (e.key === "ArrowLeft") ship.mudaDirecao(-1);
            else if (e.key === "ArrowRight") ship.mudaDirecao(+1);
            else if (e.key === " ") {
                tiro.play();
                balas.push(new Bala());
            };
        }
        else {
            if (e.key === " ") {
                init();
                clearInterval(interval);
                start = false; // começa o jogo.
            }
        }
    })


    class Space {
        constructor() {
            this.element = document.getElementById("space");
            this.element.style.width = `${TAMX}px`;
            this.element.style.height = `${TAMY}px`;
            this.element.style.backgroundPositionY = "0px";
        }
        move() {
            this.element.style.backgroundPositionY = `${parseInt(this.element.style.backgroundPositionY) + 2}px`
        }
    }

    class Ship {
        constructor() {
            this.element = document.getElementById("ship");
            this.AssetsDirecoes = [
                "assets/playerLeft.png",
                "assets/player.png",
                "assets/playerRight.png"
            ];
            this.direcao = 1;
            this.element.src = this.AssetsDirecoes[this.direcao];
            this.element.style.top = `${TAMY - 95}px`
            this.element.style.left = `${parseInt(TAMX / 2) - 50}px`
            this.enemy = -1;
            this.NaveVelocity = 3;
        }
        mudaDirecao(giro) {
            if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
                this.direcao += giro;
                this.element.src = this.AssetsDirecoes[this.direcao];
            }
        }
        move() {
            let limDir = parseInt(this.element.style.left) + parseInt(this.element.height) + 20;
            let limEsq = parseInt(this.element.style.left);

            if (limDir < TAMX && limEsq > 0) {
                if (this.direcao === 0)
                    this.element.style.left = `${parseInt(this.element.style.left) - this.NaveVelocity}px`;
                else if (this.direcao === 2)
                    this.element.style.left = `${parseInt(this.element.style.left) + this.NaveVelocity}px`;
            }
            else {
                if (this.direcao === 0) {
                    this.element.style.left = `${parseInt(this.element.style.left) + this.NaveVelocity}px`
                    this.direcao += 1;
                    this.element.src = this.AssetsDirecoes[1];
                }
                else if (this.direcao === 2) {
                    this.element.style.left = `${parseInt(this.element.style.left) - this.NaveVelocity}px`;
                    this.direcao -= 1;
                    this.element.src = this.AssetsDirecoes[1];
                }
            }

            space.move();
        }
    }
    class EnemyShip {
        constructor() {
            this.element = document.createElement("img");
            this.Assetsinimigos = [
                "assets/enemyShip.png",
                "assets/enemyUFO.png",
                "assets/meteorBig.png",
                "assets/meteorSmall.png"
            ];
            this.element.className = "enemy-ship";
            this.enemy = Math.floor(Math.random() * QtdInimigosVariados);
            this.element.src = `${this.Assetsinimigos[this.enemy]}`;
            this.element.style.top = "0px"
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`
            this.velocidade = Math.floor(Math.random() * AumentaVelocidade + 4);
            space.element.appendChild(this.element);
        }
        move() {
            this.element.style.top = `${parseInt(this.element.style.top) + this.velocidade}px`;
        }
        remove() {
            space.element.removeChild(this.element);
            enemies.splice(enemies.indexOf(this), 1);
        }
        MaisVelocidade() {
            AumentaVelocidade += 1;
            this.velocidade = Math.floor(Math.random() * AumentaVelocidade + 4);
        }
    }

    class PointsAndLife {
        constructor() {
            this.life = 2;
            this.points = "000000";
            this.element = []
            this.element[0] = document.createElement("img"); this.element[0].src = "assets/life.png"; this.element[0].style.width = "35px";
            this.element[1] = document.createElement("img"); this.element[1].src = "assets/life.png"; this.element[1].style.width = "35px";
            this.element[2] = document.createElement("img"); this.element[2].src = "assets/life.png"; this.element[2].style.width = "35px";

            this.div = document.createElement("div");
            this.div2 = document.createElement("div");
            this.div3 = document.createElement("div");
            this.div.className = "Hp";
            this.div2.id = "text1";
            this.div3.id = "hp";
            this.div2.innerHTML += this.points;

            this.div3.appendChild(this.element[0]);
            this.div3.appendChild(this.element[1]);
            this.div3.appendChild(this.element[2]);
            this.div.appendChild(this.div3);
            this.div.appendChild(this.div2);
            space.element.appendChild(this.div);
        }
        addPontos(pontos) {
            let point = document.getElementById("text1");
            this.points = (parseInt(this.points) + pontos).toString().padStart(6, '0');
            point.innerHTML = this.points;
        }
        removeHp() {
            let image = this.element[this.life];
            image.parentNode.removeChild(image);
            this.life -= 1;
            if (this.life === -1) {
                new gameOver();
                clearInterval(intervalGame);
                clearInterval(velocidade);
                document.getElementsByClassName("button")[0].onclick = function() {restart()};
            }
        }
    }

    class Bala {
        constructor() {
            this.element = document.createElement("img");
            this.element.src = "assets/laserRed.png";
            this.element.className = "Bala";
            this.element.style.top = `${parseInt(ship.element.style.top) - 20}px`;
            this.element.style.left = `${parseInt(ship.element.style.left) + 45}px`;
            space.element.appendChild(this.element);
        }
        move() {
            this.element.style.top = `${parseInt(this.element.style.top) - 2}px`
        }

        remove() {
            space.element.removeChild(this.element);
            balas.splice(balas.indexOf(this), 1);
        }
    }

    class gameOver {
        constructor() {
            this.div = document.createElement("div");
            this.div.id = "gameover";

            this.element = document.createElement("div");
            
            this.element.innerHTML = "GameOver";

            this.div2 = document.createElement("div");

            this.element2 = document.createElement("button");
            this.element2.className = "button button2";
            this.element2.innerHTML = "Restart";        

            this.div.appendChild(this.element);
            this.div2.appendChild(this.element2);
            this.div.appendChild(this.div2)   ;          
            space.element.appendChild(this.div);
        }
 
    }
    function naveDestruida(){
        ship.element.src = "assets/playerDamaged.png";
        ship.NaveVelocity = 1;
        ship.AssetsDirecoes = [
            "assets/playerDamaged.png",
            "assets/playerDamaged.png",
            "assets/playerDamaged.png"
        ];
    }

    function colisao(elem1, nave) {
        MaxEsq = parseInt(elem1.element.style.left);
        MaxDir = MaxEsq + parseInt(elem1.element.width);
        MaxTop = parseInt(elem1.element.style.top);
        MaxBottom = MaxTop + parseInt(elem1.element.height);

        for (let i = 0; i < enemies.length; i++) {
            MaxEsqEnemy = parseInt(enemies[i].element.style.left);
            MaxDirEnemy = MaxEsqEnemy + parseInt(enemies[i].element.width);
            MaxTopEnemy = parseInt(enemies[i].element.style.top);
            MaxBottomEnemy = MaxTopEnemy + parseInt(enemies[i].element.height);
            if ((MaxDir > MaxEsqEnemy && MaxEsq < MaxDirEnemy) && MaxTop < MaxBottomEnemy) { // houve colisão
                if (!nave) {
                    AddPontuação(enemies[i]);
                }
                else{
                    naveDestruida();
                    setTimeout(() => { // volta ao normal.
                        ship.NaveVelocity = 3;
                        ship.AssetsDirecoes = [
                            "assets/playerLeft.png",
                            "assets/player.png",
                            "assets/playerRight.png"
                        ];
                    }, 5000);
                }
                enemies[i].remove();
                return true;
            }
        }
        return false;
    }


    function startAnimation() {
        space.move();
    }
    function fun() {
        const random_enemy_ship = Math.random() * 60;
        PROB_ENEMY_SHIP += 0.0001
        if (random_enemy_ship <= PROB_ENEMY_SHIP) {
            enemies.push(new EnemyShip());
        }

        if (colisao(ship, true)) {
            points.removeHp();
        };

        enemies.forEach((e) => {
            e.move();
            if (parseInt(e.element.style.top) > TAMY) {
                e.remove();
            }
        });

        balas.forEach((e) => {
            e.move();
            if (colisao(e, false)) {
                e.remove();
            }
            else if (parseInt(e.element.style.top) < -50) {
                e.remove();
            };
        });
        ship.move();
    }
    function restart() {
        cleanGame();
        GameStart();
    }

    function cleanGame(){
        clearInterval(intervalGame);
        clearInterval(velocidade);
        clearInterval(interval);
        enemies = [], balas = [];AumentaVelocidade = 3;
        document.body.innerHTML = `<div id="space">
        <img id="ship" src="assets/player.png" alt="nave">
    </div>`
        

    }

    function AddPontuação(e) {
        if (e.enemy == 0) {
            points.addPontos(50);
        }
        else if (e.enemy == 1) {
            points.addPontos(20);
        }
        else if (e.enemy == 2) {
            points.addPontos(10);
        }
        else if (e.enemy == 3) {
            points.addPontos(100);
        }
    }

    function AumentaVelocidadeInimigos() {
        enemies.forEach((e) => {
            e.MaisVelocidade();
        });
    }


    GameStart();
})();