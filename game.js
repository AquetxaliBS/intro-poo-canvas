// Canvas setup 
const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d'); 
 
// Clase Ball (Pelota) 
class Ball { 
    constructor(x, y, radius, speedX, speedY, color) { 
        this.x = x; 
        this.y = y; 
        this.radius = radius; 
        this.speedX = speedX; 
        this.speedY = speedY; 
        this.color = color; 
    } 
 
    draw() { 
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.fillStyle = this.color; 
        ctx.fill(); 
        ctx.closePath(); 
    } 
 
    move() { 
        this.x += this.speedX; 
        this.y += this.speedY; 
 
        // Colisión con la parte superior e inferior 
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) { 
            this.speedY = -this.speedY; 
        } 
    } 
 
    reset() { 
        this.x = canvas.width / 2; 
        this.y = canvas.height / 2; 
        this.speedX = -this.speedX; // Cambia dirección al resetear 
    } 
} 
 
// Clase Paddle (Paleta) 
class Paddle { 
    constructor(x, y, width, height, isPlayerControlled = false) { 
        this.x = x; 
        this.y = y; 
        this.width = width; 
        this.height = height; 
        this.isPlayerControlled = isPlayerControlled; 
        this.speed = 5;
        this.directionY = 1; //Propiedad para la dirección vertical (1 = abajo, -1 = arriba)
    } 
 
    draw() { 
        ctx.fillStyle = 'purple'; 
        ctx.fillRect(this.x, this.y, this.width, this.height); 
    } 
 
    move(direction) { 
        if (direction === 'up' && this.y > 0) { 
            this.y -= this.speed; 
        } else if (direction === 'down' && this.y + this.height < canvas.height) { 
            this.y += this.speed; 
        } 
    } 
 
    // Movimiento de la paleta automática (IA) 
    autoMove(ball) { 
        // Mueve la paleta en la dirección actual
        this.y += this.speed * this.directionY;
        // Si toca el borde superior o inferior, cambia la dirección
        if (this.y <= 0) {
            this.directionY = 1; // Cambia a movimiento hacia abajo
        } else if (this.y + this.height >= canvas.height) {
            this.directionY = -1; // Cambia a movimiento hacia arriba
        }
    } 
}
 
// Clase Game (Controla el juego) 
class Game { 
    constructor() { 
        // Crear múltiples pelotas con diferentes colores y tamaños
        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 10, 1, 1, 'red'),
            new Ball(canvas.width / 2, canvas.height / 2, 15, 1, 2, 'blue'),
            new Ball(canvas.width / 2, canvas.height / 2, 20, 2, 2, 'orange'),
            new Ball(canvas.width / 2, canvas.height / 2, 12, 3, 2, 'yellow'),
            new Ball(canvas.width / 2, canvas.height / 2, 8, 3, 1, 'green')
        ];
        this.paddle1 = new Paddle(0, canvas.height / 2 - 100, 10, 200, true); // Controlado por el jugador 
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100); // Controlado por la computadora 
        this.keys = {}; // Para capturar las teclas 
    } 
 
    draw() { 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        // Dibujar cada pelota
        this.balls.forEach(ball => ball.draw());
        
        this.paddle1.draw(); 
        this.paddle2.draw(); 
    } 
 
    update() { 
        // Mover cada pelota
        this.balls.forEach(ball => ball.move()); 
 
        // Movimiento de la paleta 1 (Jugador) controlado por teclas 
        if (this.keys['ArrowUp']) { 
            this.paddle1.move('up'); 
        } 
        if (this.keys['ArrowDown']) { 
            this.paddle1.move('down'); 
        } 
 
        // Movimiento de la paleta 2 (Controlada por IA) 
        this.paddle2.autoMove(this.balls[0]); // Usamos la primera pelota como referencia para la IA

 
        // Colisiones con las paletas
        this.balls.forEach(ball => {
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width && 
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) { 
                ball.speedX = -ball.speedX; 
            } 
     
            if (ball.x + ball.radius >= this.paddle2.x && 
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) { 
                ball.speedX = -ball.speedX; 
            } 
 
            // Detectar cuando la pelota sale de los bordes (punto marcado) 
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) { 
                ball.reset(); 
            } 
        });
    } 
 
    // Captura de teclas para el control de la paleta
    handleInput() { 
        window.addEventListener('keydown', (event) => { 
            this.keys[event.key] = true; 
        }); 
        window.addEventListener('keyup', (event) => { 
            this.keys[event.key] = false; 
        }); 
    } 
 
    run() { 
        this.handleInput(); 
        const gameLoop = () => { 
            this.update(); 
            this.draw(); 
            requestAnimationFrame(gameLoop); 
        }; 
        gameLoop(); 
    } 
} 
 
// Crear instancia del juego y ejecutarlo 
const game = new Game(); 
game.run();
            