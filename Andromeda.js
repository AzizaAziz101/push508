        function generateGalaxy() {
            const canvas = document.getElementById('galaxyCanvas');
            const ctx = canvas.getContext('2d');
            const stars = [];

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();

            class Star {
                constructor(x, y, speed, radius) {
                    this.x = x;
                    this.y = y;
                    this.speed = speed;
                    this.radius = radius;
                }

                update() {
                    this.y += this.speed;
                    if (this.y > canvas.height) {
                        this.y = 0;
                        this.x = Math.random() * canvas.width;
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                }
            }

            function createStars() {
                for (let i = 0; i < 200; i++) {
                    let radius = Math.random() * 1.5 + 0.5;
                    let x = Math.random() * canvas.width;
                    let y = Math.random() * canvas.height;
                    let speed = Math.random() * 1.5 + 0.5;
                    stars.push(new Star(x, y, speed, radius));
                }
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let star of stars) {
                    star.update();
                    star.draw();
                }
                requestAnimationFrame(animate);
            }

            createStars();
            animate();
        }

        generateGalaxy();