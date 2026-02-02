document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const bagImage = new Image();
    const bottleImage = new Image();
    const strawImage = new Image();
    const franklinImage = new Image();
    const shrimpImage = new Image();

    const trashImages = [bagImage, bottleImage, strawImage];
        
    let trash = [];

    function createTrash(id, x, y, speedX=30) {
        return {
            id: id,
            x: x,
            y: y,
            speedX: speedX,
            speedY: 0,
            width: 100,
            height: 100,
            imageIndex: 0
        };
    }

    for (let i = 0; i < 5; i++) {
        const x = Math.random() * (canvas.width/5);
        const y = Math.random() * (canvas.height);
        trash.push(createTrash(i, x, y, 2));
    }

    function drawTrash() {
        if (bagImage.complete && bottleImage.complete && strawImage.complete) {
            trash.forEach(trashItem => {
                ctx.drawImage(trashImages[trashItem.imageIndex % trashImages.length], trashItem.x, trashItem.y, trashItem.width, trashItem.height);
            });
        }
    }

    function createShrimp(x, y) {
        return {
            x: x,
            y: y,
            width: 50,
            height: 50,
        };
    }  

    let shrimps = [];
    for (let i = 0; i < 2; i++) {
        shrimps.push(createShrimp(Math.random() * (canvas.width - 50), Math.random() * (canvas.height - 50)));
    }

    function drawShrimps() {
        if (shrimpImage.complete){
            shrimps.forEach(shrimp => {
                ctx.drawImage(shrimpImage, shrimp.x, shrimp.y, shrimp.width, shrimp.height);
            });
        }
    }

    function createWavePattern(id, x, y, speedX=2) {
        return {
            id: id,
            x: x,
            y: y,
            speedX: speedX,
            speedY: 0,
            width: 100,
            height: canvas.height,
        };
    }

    let waves = [];
    waves.push(createWavePattern(0, 0, 1));
    function drawWaves() {
        ctx.fillStyle = "#ADD8E6";
        waves.forEach(wave => {
            ctx.fillRect(wave.x, wave.y, wave.width, wave.height);
        });
    }


    let franklinX = canvas.width / 2 - 50;
    let franklinY = canvas.height - 120;
    
    const keysPressed = {};
    
    window.addEventListener('keydown', (e) => {
        keysPressed[e.key.toLowerCase()] = true;
    });
    
    window.addEventListener('keyup', (e) => {
        keysPressed[e.key.toLowerCase()] = false;
    });

    let lives = 3;
    const lifeDisplay = document.getElementById("lives");

    let score = 0;
    const scoreDisplay = document.getElementById("score");

    let deltaSpeedX = 2;

    let isInvincible = false;
    let invincibleUntil = 0;

    function main() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (keysPressed['w']) franklinY -= 5;
        if (keysPressed['s']) franklinY += 5;
        if (keysPressed['a']) franklinX -= 5;
        if (keysPressed['d']) franklinX += 5;
        
        // Check if invincibility period is over
        if (isInvincible && Date.now() > invincibleUntil) {
            isInvincible = false;
        }
        
        // Optional: make Franklin blink when invincible
        if (franklinImage.complete) {
            if (!isInvincible || Math.floor(Date.now() / 200) % 2 === 0) {
                ctx.drawImage(franklinImage, franklinX, franklinY, 100, 100);
            }
        }  
    
        trash.forEach(trashItem => {
            trashItem.x += deltaSpeedX;

            if (trashItem.x + trashItem.width >= canvas.width) {
                trashItem.x = 0 - Math.random() * 200;  
                trashItem.y = Math.random() * (canvas.height - trashItem.height);
                trashItem.imageIndex = Math.floor(Math.random() * trashImages.length);
            }
            
            // Only check collision if not invincible
            if (!isInvincible && Math.abs((franklinX + 50) - (trashItem.x + 50)) < 50 && Math.abs((franklinY + 50) - (trashItem.y + 50)) < 50) {
                lives--;
                lifeDisplay.textContent = `Lives: ${lives}`;
                franklinX = canvas.width / 2 - 50;
                franklinY = canvas.height - 120;
                
                // Set invincibility for 2 seconds
                isInvincible = true;
                invincibleUntil = Date.now() + 2000;
                
                if (lives <= 0) {
                    try {
                        const pastScores = JSON.parse(localStorage.getItem("pastScores")) || [];
                        pastScores.push(score);
                        localStorage.setItem("pastScores", JSON.stringify(pastScores));
                    } catch (error) {
                        const pastScores = [];
                        pastScores.push(score);
                        localStorage.setItem("pastScores", JSON.stringify(pastScores));
                    }
                    window.location.href = "gameover.html";
                }
            }
        });

        
        shrimps.forEach((shrimp, index) => {
            shrimp.x += deltaSpeedX;
            if (shrimp.x > canvas.width) {
                shrimp.x = 0 - Math.random() * 200;
                shrimp.y = Math.random() * (canvas.height - shrimp.height);
            }
            if (Math.abs((franklinX + 50) - (shrimp.x + 25)) < 50 && Math.abs((franklinY + 50) - (shrimp.y + 25)) < 50) {
                score+=10;
                deltaSpeedX = Math.min(deltaSpeedX ** 1.05, 10);
                scoreDisplay.textContent = `Score: ${score}`;
                shrimps.splice(index, 1);
                shrimps.push(createShrimp(0, Math.random() * (canvas.height - 50)));
            }
        });
        
        waves.forEach(wave => {
            wave.x += deltaSpeedX;  
            if (wave.x >= canvas.width) {
                wave.x = 0 - wave.width;  
            }
        });

        if (franklinX < 0) franklinX = 0;
        if (franklinX + 100 > canvas.width) franklinX = canvas.width - 100;
        if (franklinY < 0) franklinY = 0;
        if (franklinY + 100 > canvas.height) franklinY = canvas.height - 100;
        
        const waveLeft = waves[0].x;
        const waveRight = waves[0].x + waves[0].width;
        if (franklinX + 100 > waveLeft && franklinX < waveRight) {
            franklinX = waveLeft - 100; 
        }

        drawTrash();
        drawShrimps();
        drawWaves();
        requestAnimationFrame(main);
    }

        // Load images
        let imagesLoaded = 0;
        const allImages = [bagImage, bottleImage, strawImage, franklinImage, shrimpImage];

        allImages.forEach(img => {
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === allImages.length) {
                    main();  // Start animation once required images load
                }
            };
            
            img.onerror = () => {
                console.error("Failed to load image");
            };
        });

    // Load shrimp separately (don't block animation)
    shrimpImage.onerror = () => {
        console.error("Failed to load shrimp image");
    };

    bagImage.src = "images/bag.png";
    bottleImage.src = "images/bottle.png";
    strawImage.src = "images/straw.png";
    franklinImage.src = "images/Franklin.png";
    shrimpImage.src = "images/shrimp.png";
});