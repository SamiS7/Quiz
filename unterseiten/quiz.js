class Quiz {
    constructor(name, questions) {
        this.name = name;
        this.questions = questions;
        this.counter = 0;
        this.gespielt = false;
        this.delay = 500;
        this.correctAnswered = 0;
    }

    ovCode() {
        let ls = localStorage.getItem(this.name + '--Score');
        if (ls == null) {
            return `<div class="overview"><h2>${this.name}</h2><h3>${this.questions[this.counter].question}, ${this.questions[this.counter + 1].question}...</h3></div>`;
        } else {
            return `<div class="overview"><h2>${this.name}</h2><h3>${this.questions[this.counter].question}, ${this.questions[this.counter + 1].question}...</h3><p class="scoreGraf">${ls}/${this.questions.length}</p></div>`;
        }
    }

    loadEvents() {
        let classN = document.getElementsByClassName('overview');

        for (let i = 0; i < classN.length; i++) {
            classN[i].addEventListener('click', function () {
                quizCounter++;
                quizIndex = i;
                quiz[i].start();
                quiz[i].timer();
                quiz[i].viewCounter();
                document.getElementById('links').style = "display: none;";
            });
        }
    }

    viewCounter() {
        if (localStorage.getItem(this.name + '--Counter') != null) {
            console.log(parseInt(localStorage.getItem(this.name + '--Counter')));
            localStorage.setItem(this.name + '--Counter', parseInt(localStorage.getItem(this.name + '--Counter')) + 1);
        } else {
            localStorage.setItem(this.name + '--Counter', 1);
        }
    }

    start() {
        this.delay = 500;
        document.getElementById('content').innerHTML = this.questions[this.counter].htmlCode();
        document.getElementById('continue').addEventListener('click', function () {
            quiz[quizIndex].questions[quiz[quizIndex].counter].clicked = true;
            quiz[quizIndex].start();
            quiz[quizIndex].delay = 1;
        });
        this.questions[this.counter].timer();
        if (this.counter >= this.questions.length - 1) {
            document.getElementById('continue').style = "display: none;";
        }
    }

    timer() {
        let t = setInterval(() => {
            if (this.counter < this.questions.length - 1) {
                if (this.questions[this.counter].clicked || this.questions[this.counter].time == 0) {
                    let ls = localStorage.getItem(this.name + '--Score');
                    if (ls == null) {
                        localStorage.setItem(this.name + '--Score', this.correctAnswered);
                    } else if (ls != null && parseInt(ls) < this.correctAnswered) {
                        localStorage.setItem(this.name + '--Score', this.correctAnswered);
                    }

                    console.log(this.delay);
                    this.setCounter(this.counter + 1);
                    setTimeout(() => {
                        this.start();
                    }, this.delay);
                }
            } else if (this.questions[this.counter].clicked || this.questions[this.counter].time == 0) {
                let ls = localStorage.getItem(this.name + '--Score');
                if (ls == null) {
                    localStorage.setItem(this.name + '--Score', this.correctAnswered);
                } else if (ls != null && parseInt(ls) < this.correctAnswered) {
                    localStorage.setItem(this.name + '--Score', this.correctAnswered);
                }

                scores[scores.length] = point;
                console.log(scores);
                scores.sort(function (a, b) { return b - a });
                setTimeout(() => {
                    document.getElementById('content').innerHTML = `<div id="scoreOutput"><h3>Your Score: ${point}</h3><h4>Your highscore: ${scores[0]}</h4></div><div id="uContent"></div>`;
                    document.getElementById('links').style = "display: grid;";
                    localStorage.setItem('--Highscore', scores[0]);
                    point = 0;
                    this.gespielt = true;

                    initQuiz();
                }, this.delay);
                clearInterval(t);
            }
        }, this.delay);
    }

    setCounter(counter) {
        if (this.counter < this.questions.length - 1) {
            this.counter = counter;
        }
    }
}

