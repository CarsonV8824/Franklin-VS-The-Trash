document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const bagImage = new Image();
    bagImage.src = "images/bag.png";

    const bottleImage = new Image();
    bottleImage.src = "images/bottle.png";

    const strawImage = new Image();
    strawImage.src = "images/straw.png";

    const trashImages = [bagImage, bottleImage, strawImage];
        
    let squares = [];

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

    squares.push(createTrash(1, 50, 50, 2));
    squares.push(createTrash(2, 150, 100, 2));
    squares.push(createTrash(3, 250, 75, 2));

    function drawTrash() {
        if (bagImage.complete && bottleImage.complete && strawImage.complete) {
            squares.forEach(square => {
                ctx.drawImage(trashImages[square.imageIndex % trashImages.length], square.x, square.y, square.width, square.height);
            });
        }
    }

    const franklinImage = new Image();
    franklinImage.src = "images/franklin.png";
    let franklinX = canvas.width / 2 - 50;
    let franklinY = canvas.height - 120;
    
    // Track which keys are currently pressed
    const keysPressed = {};
    
    window.addEventListener('keydown', (e) => {
        keysPressed[e.key.toLowerCase()] = true;
    });
    
    window.addEventListener('keyup', (e) => {
        keysPressed[e.key.toLowerCase()] = false;
    });

    function main() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (keysPressed['w']) franklinY -= 5;
        if (keysPressed['s']) franklinY += 5;
        if (keysPressed['a']) franklinX -= 5;
        if (keysPressed['d']) franklinX += 5;

        ctx.drawImage(franklinImage, franklinX, franklinY, 100, 100);

        squares.forEach(square => {
            square.x += square.speedX;

            if (square.x <= 0 || square.x + square.width >= canvas.width) {
                square.x = 0;  
                square.imageIndex = Math.floor(Math.random() * trashImages.length);
            }
        });

        drawTrash();
        requestAnimationFrame(main);
    }

    let imagesLoaded = 0;
    const allImages = [bagImage, bottleImage, strawImage, franklinImage];

    allImages.forEach(img => {
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === allImages.length) {
                requestAnimationFrame(main);
            }
        };
    });
});