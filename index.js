
// *Some code and code ideas from Franks laboratory Youtube channel https://www.youtube.com/c/Frankslaboratory
// *Also ideas from https://www.youtube.com/c/ChrisCourses

//Canvas setup
window.addEventListener('load', function(){  //'load' event is fired once page has finished loading resources unlike 'ContentLoaded' which fires as soon as page DOM has loaded
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');       //ctx means context. getContext('2d') gains access to the canvas tags 2d drawing functions
    canvas.width = 950;
    canvas.height = 740;
    let enemies = [];
    let score = 0;
    let hello = 'Sewer Rat'; //name of game
    //let sideMsg = 'make sure to jump out of sewer before the cat eats you'
    //let coins = 0; 
    let gameOver = false;

    class InputHandler {  //InputHandler class converts user keystrokes into concrete actions, takes care of action repitition as well
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', e =>{   //used arrow function 
                if((e.key === 's'  || e.key === 'w' || e.key === 'a' || e.key === 'd') // || (OR) used with booleans 
                && this.keys.indexOf(e.key) === -1) { //if key is pushed it is added to array
                    this.keys.push(e.key); //push() adds elements to array and returns the new length of the array .keys
                }
            }); //indexOf() returns the position of the first specified character in the array 

            window.addEventListener('keyup', e =>{    
                if(e.key === 's'  || e.key === 'w' || e.key === 'a' || e.key === 'd') {
                    this.keys.splice(this.keys.indexOf(e.key), 1); //if key is released it is taken away from the array using splice
                }
            });
        }
    }

    class Player {
         constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 145;
            this.height = 145;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0; //sprite sheet frames
            this.frameY = 0; //sprite sheet frames
            this.maxFrame = 8
            this.speed = 0;
            this.vy = 0; //velocity y
            this.gravity = 0.41;
            this.frameTimer = 0;
            this.fps = 20;
            this.frameInterval = 1000/this.fps;

        }

        update(input, deltaTime, enemies) {      //pass deltaTime in update method at bottom do they read each other
            // *Collison Detection
            enemies.forEach(enemy => {  //comparing radius of circle one 'player' to radius of circle 2 'enemy'
                const distanceX = enemy.x - this.x;   // *finding the hypotenuse of right triangle created by distanceX and distanceY
                const distanceY = enemy.y - this.y;   // if distance is less than both radai added together then player is colliding
                const distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY); //sqrt is square root //dx^2 + dy^2
                if(distance < enemy.width/2 + this.width/2) {
                    gameOver = true;  
                } // *if distance between centerpoint of player circle and centerpoint of enemy circle is less than radius of player circle plus radius of enemy circle then there is a collision and game reset 
            });
            // *Sprite Animatiion
            if(this.frameTimer > this.frameInterval) {
                if(this.frameX >= this.maxFrame) this.frameX = 0;  //resets frames for sprite animation once maxFrame is reached
                else this.frameX++; //adds frames
                this.frameTimer = 0; //after timer goes back to 0
            } else {
                this.frameTimer += deltaTime;  
            }
            // *Keys
            this.x += this.speed;
            if(input.keys.indexOf('d') > -1) {
                this.speed = 5;  //finds key in keys array
            } else if (input.keys.indexOf('a') > -1) {
                this.speed = -5;
            } else if (input.keys.indexOf('w') > -1 && this.ground()) {  //can't find a way to make this spacebar instead of w
                this.vy -= 17;
            } else {
                this.speed = 0;
            }
            // *Horizontal Movement
            if(this.x < 0) this.x = 0;  //stops player from going off screen on left
            else if(this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width  //stops player from moving right off screen
            // *Verticle movement
            this.y += this.vy;
            if(!this.ground()) {
                this.vy += this.gravity; //player can't go below ground
                this.maxFrame = 5;
                this.frameY = 1; //sprite animation for jump
            } else {
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0; //sprite animation for when player lands
            }
            if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }

        ground() {
            return this.y >= this.gameHeight - this.height -88; // where player is at once he jumps out of the sewer and lands on platform
        }

        //drawn collision detection for player created with circles
        draw(context) { //refer to enemy class draw method for explanation on circle hitbox
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke();
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }

    class Background {
        constructor() {
            this.gameWidth 
            this.gameHeight
            this.width = 2400; //image width
            this.height = 820; //image height
            this.image = document.getElementById('backgroundImage'); 
            this.x = 0;
            this.y = 0;
            this.speed = 2;
        }
        draw(context) {   //draw method has context as an argument
            context.drawImage(this.image, this.x, this.y, this.width, this.height); //draw same image twice
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update() {
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x = 0;  //if background scrolls ofscreen set its x back to 0
        }
    }
    class Enemy {   //can't figure out how to make a spite sheet for the cat
        constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 160;
        this.height = 119;
        this.image = document.getElementById('enemyImage');  //this loads image so we can draw it later with .drawImage method
        this.x = this.gameWidth
        this.y = this.gameHeight - this.height -80;
        this.speed = 2;
        this.toBeDeleted = false;
        }
        draw(context) { //draw method has context as an argument
            //drawn collision detection for cat created with circles
            context.beginPath(); //resets current path so line is only drawn once and not lagging page
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke(); //invokes previous and draws hitbox
            context.drawImage(this.image, this.x, this.y, this.width, this.height)  //context.drawImage is built into javascript to draw and load images or videos onto canvas
        } 
        update() {
            this.x -= this.speed;
            if(this.x < 0 - this.width) { 
                this.toBeDeleted = true; //once cat goes off screen to the left it can be deleted
                score++;    //increase score every time enemy moves off screen if player avoid enemy
            }
        }
    }
 
    function handleEnemies(deltaTime){
        if(enemyTimer > enemyInterval + randomInterval) {    //if enemyTimer is greater than enemyInterval + random push new enemy into the enemy array
        enemies.push(new Enemy(canvas.width, canvas.height));
        randomInterval = Math.random() * 3000 + 500;
        enemyTimer = 0;  //reset timer back to zero after push
        } else {
            enemyTimer += deltaTime; //keeps adding deltaTime to enemyTimer untill limit is reached
        }
        enemies.forEach(enemy => {  //forEach calls function for each element in array
            enemy.draw(ctx);
            enemy.update();
        })
        enemies = enemies.filter(enemy => !enemy.toBeDeleted); {  //filter creates a new array for all elements that pass the test created by the function
        }
    }

    // *On screen Text 
    function displayScoreText(context) {  //used to display score defined in line 12
        context.font = '35px Helvetica' //TODO: change font if possible
        context.fillStyle = 'black'; //shadow
        context.fillText('Score: ' + score, 10, 43);
        context.fillStyle = 'white'; //score
        context.fillText('Score: ' + score, 13, 46);
        //Name of Game
        context.font = '45px Helvetica' 
        context.fillStyle = 'black'; //shadow
        context.fillText(hello,  388, 50);
        context.fillStyle = 'lightgreen'; //score
        context.fillText(hello,  385, 52);
        //Side Message
        // context.font = '15px Helvetica' 
        // context.fillStyle = 'white'; //score
        // context.fillText(sideMsg,  0, 70);
    }

    function getCoin() {  //TODO: try to make player able to pick up coins and track amount of coins collected.

    }

    // function displayCoinText(context) {
    //     context.font = '40px Helvetica'
    //     context.fillStyle = 'black'; //shadow
    //     context.fillText('Coins: ' +  777, 50); //find a way to add coins
    //     context.fillStyle = 'yellow'; //coins
    //     context.fillText('Coins: ' +  780, 53);
    // }

    const input = new InputHandler();  //invokes key event listeners            
    const player = new Player(canvas.width, canvas.height);  //const are in order from top to bottom
    const background = new Background(canvas.width, canvas.height);

    let lastTime = 0;  //holds timestamp from previous animation frame
    let enemyTimer = 0;  //counts miliseconds from 0 to a certain limit then triggers itself and resets back to zero
    let enemyInterval = 1000;  //value for time limit in enemyTimer, adds new enemy every 1000 miliseconds
    let randomInterval = Math.random() * 3000 + 500; //random milisecond that enemy will come instead of predictable timing

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;  //difference in miliseconds between timeStamp loop and lastTime loop
        lastTime = timeStamp; // gets value of timeStamp from previous loop so it can loop again 
        ctx.clearRect(0,0,canvas.width, canvas.height);
        background.draw(ctx); //draws background before player
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, enemies);  
        handleEnemies(deltaTime);
        displayScoreText(ctx);
        if(!gameOver) //keep running game untill gameOver is equal to true on line 63
        requestAnimationFrame(animate); //endless animation loop, requestAnimationFrame automatically generates a timeStamp and passes it as an argument to the function it calls
    }
    animate(0);  //passed 0 because it doesnt have requestAnimationFrame to generate timeStamp automatically
});
