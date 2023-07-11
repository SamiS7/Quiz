class Question {
    constructor(question, options, trueOption) {
        this.question = question;
        this.options = options;
        this.trueOption = trueOption;
        this.clicked = false;
        this.maxScore = 10;
        this.time = 10;
    }

    qCode() {
        return `<h1 id="frage">${this.question}</h1>`;
    }

    optCode() {
        let opt = '';
        for (let i = 0; i < this.options.length; i++) {
            opt += `<h2 class="option col-lg-5 mr-1 col-sm-11 bg-dark"  onclick="quiz[${quizIndex}].questions[quiz[${quizIndex}].counter].clkOption(${i}, this)">${this.options[i]}</h2>`;
        }
        return opt;
    }

    htmlCode() {
        return `<div class="question">${this.qCode()}<div id="options">${this.optCode()}</div><h2 id="time">10</h2><i id="continue" class="fas fa-angle-double-right"></i></div>`;
    }

    clkOption(nr, cn) {
        if (!this.clicked) {
            this.clicked = true;
            if (nr == this.trueOption) {
                point += this.maxScore * scoreSerie;
                cn.style = "background-color: rgb(9, 255, 0);";
                scoreSerie++;
                quiz[quizIndex].correctAnswered++;
                console.log(quiz[quizIndex].correctAnswered);
            } else {
                if (point > 5) {
                    point -= 5;
                }
                cn.style = "background-color: red;";
                scoreSerie = 1;
            }
        }
    }

    timer() {
        let time = document.getElementById('time');
        setTimeout(() => {
            let t = setInterval(() => {
                if (this.time <= 0 || this.clicked || time == null) {
                    clearInterval(t);
                } else {
                    this.maxScore--;
                    this.time--;
                    time.innerHTML = `${this.time}`;
                }
            }, 1000);
        }, 1000);

    }
}