window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');       //ctx means context
    canvas.width = 800;
    canvas.height = 720;

    class InputHandler {
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', e =>{   //used arrow function 
                if((e.key === 's'  
                || e.key === 'w' 
                || e.key === 'a' 
                || e.key === 'd') 
                && this.keys.indexOf(e.key) === -1) { //if key is pushed it is consolelogged and added to array
                    this.keys.push(e.key);
                }
            });

            window.addEventListener('keyup', e =>{    
                if(e.key === 's'  
                || e.key === 'w' 
                || e.key === 'a' 
                || e.key === 'd') {
                    this.keys.splice(this.keys.indexOf(e.key), 1); //if key is released it is taken away from the array using splice
                }
            });
        }
    }

    class Player {
         constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.frameY = 0;
            this.speed = 0;
            this.vy = 0;
            this.gravity = 2;
        }
         draw(context) {
            context.fillStyle = 'white';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input) {
            this.x += this.speed;
            if(input.keys.indexOf('d') > -1) {
                this.speed = 5;  //finds key in keys array
            } else if (input.keys.indexOf('a') > -1) {
                this.speed = -5;
            } else if (input.keys.indexOf('w') > -1) {  //can't find a way to make this spacebar instead of w
                this.vy -= 5;
            } else {
                this.speed = 0;
            }
            //horizontal movement
            if(this.x < 0) this.x = 0;  //stops player from going off screen on left
            else if(this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width  //stops player from moving right off screen
            //verticle movement
            this.y += this.vy;
            if(!this.ground()) {
                this.vy += this.gravity;
            } else {
                this.vy = 0;
            }
            if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        ground() {
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {

    }
    class Enemy {

    }
    function handleEnemies (){

    }
    function displayStatusText(){

    }

    const input = new InputHandler();  //invokes key event listeners
    const player = new Player(canvas.width, canvas.height);

    function animate(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        player.draw(ctx);
        player.update(input);
        requestAnimationFrame(animate); //endless animation loop
    }
    animate();
});
