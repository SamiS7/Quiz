let point = 0;
let scoreSerie = 1;
let scores = new Array();
let quizIndex = 0;
let quizCounter = 0;
let questions = new Array();
let quiz = new Array();

let name = document.getElementById('name');
let frage = document.getElementById('cQuestion');
let cOption = document.getElementsByClassName('cOption');
let cTrueOpt = document.getElementById('trueOpt');
let fMeldung = document.getElementsByClassName('fMeldung');
name.focus();

class createQuiz {
    constructor() {
        this.question;
        this.name;
        this.options;
        this.trueOpt;
    }
    loadEvents() {
        document.getElementById('nextQ').addEventListener('click', function () {
            fMeldung[0].style = "display: grid;";
            fMeldung[0].innerHTML = '<p>Die Frage muss mind. 6 Zeichen haben?</p>';
            if (frage.value.length > 5) {
                fMeldung[0].innerHTML = '<p>Einer der Optionen hat zu wenige Zeichen!</p>';
                for (let i = 0; i < 4; i++) {
                    if (cOption[i].value.length < 1) {
                        break;
                    } else if (i == 3) {
                        fMeldung[0].innerHTML = '<p>Richtige Option muss zw. 1 und 4 sein!</p>';
                        let x = parseInt(cTrueOpt.value);
                        if (x >= 1 && x <= 4) {
                            fMeldung[0].style = "display: none;";
                            fMeldung[0].innerHTML = '';
                            cr.createQuestion();
                        }
                    }
                }
            }

        });

        function pruefung() {
            fMeldung[1].innerHTML = '<p>Für ein Quiz braucht man zumindest 2 Fragen!</p>';
            if (questions.length >= 2) {
                fMeldung[1].innerHTML = '<p>Der Name des Quiz darf nicht --Score, --Startseite, --Highscore, --CreateProve, --Counter dabeihaben!</p>';
                if (!name.value.includes('--Score') && !name.value.includes('--Startseite') && !name.value.includes('--Highscore') && !name.value.includes('--TopQuiz') && !name.value.includes('--CreateProve') && !name.value.includes('--Counter')) {
                    fMeldung[1].innerHTML = '<p>Der Name des Quiz muss mind. 2 Zeichensein haben!</p>';
                    if (name.value.length > 1) {
                        cr.createQuiz();

                        fMeldung[1].style = "display: none;";
                        fMeldung[1].innerHTML = '';
                        fMeldung[0].style = "display: none;";
                        fMeldung[0].innerHTML = '';
                    }
                }
            }
        }
        document.getElementById('create').addEventListener('click', function () {
            fMeldung[1].style = "display: grid;";
            if (quiz[0] != null) {
                fMeldung[1].innerHTML = `<div id="verwerfFMeld"><p>Wollen Sie das Quiz "${quiz[0].name}" verwerfen?</p><div><p id="verwerfen">verwerfen</p><p id="behalten">behalten</p></div></div>`;

                document.getElementById('verwerfen').addEventListener('click', function () {
                    document.getElementById('verwerfFMeld').remove();

                    pruefung();
                });

                document.getElementById('behalten').addEventListener('click', function () {
                    document.getElementById('verwerfFMeld').remove();
                    fMeldung[1].style = "display: none;";
                });
            } else {
                pruefung();
            }
        });

    }
    createQuestion() {
        this.question = frage.value + '?';
        this.options = new Array();
        for (let i = 0; i < 4; i++) {
            this.options[i] = cOption[i].value;
        }
        this.trueOpt = cTrueOpt.value - 1;
        this.qCounter++;
        questions[questions.length] = new Question(this.question, this.options, this.trueOpt);

        document.getElementById('cQuestion').value = '';
        for (let i = 0; i < 4; i++) {
            document.getElementsByClassName('cOption')[i].value = '';
        }
        document.getElementById('trueOpt').value = '';
        frage.focus();
    }
    createQuiz() {
        this.name = name.value;
        quiz[0] = new Quiz(cr.name, questions);
        questions = [];
        initQuiz();
        name.value = '';
    }
}
let cr = new createQuiz();
cr.loadEvents();

function initQuiz() {
    document.getElementById('content').innerHTML += '<div id="uContent"></div>'

    document.getElementById('uContent').innerHTML = '';

    quiz[0].loadEvents = function () {
        document.getElementById('test').addEventListener('click', function () {
            quiz[0].start();
            quiz[0].timer();
            document.getElementById('links').style = "display: none;";
            document.getElementById('inputs').style = "display: none;";
        });
    }


    quiz[0].timer = function () {
        let t = setInterval(() => {
            if (this.counter < this.questions.length - 1) {
                if (this.questions[this.counter].clicked || this.questions[this.counter].time == 0) {
                    this.setCounter(this.counter + 1);
                    setTimeout(() => {
                        this.start();
                    }, 500);
                }
            } else if (this.questions[this.counter].clicked || this.questions[this.counter].time == 0) {
                scores[quizCounter] = point;
                scores.sort(function (a, b) { return b - a });
                setTimeout(() => {
                    document.getElementById('content').innerHTML = `<div id="scoreOutput"><h3>Your Score: ${point}</h3><h4>Your highscore: ${scores[0]}</h4></div><div id="uContent"></div>`;
                    document.getElementById('links').style = "display: grid;";
                    document.getElementById('inputs').style = "display: grid;";
                    point = 0;
                    this.gespielt = true;
                    quizCounter++;
                    initQuiz();
                }, 500);
                clearInterval(t);
            }
        }, 500);
    }

    quiz[0].ovCode = function () {
        return `<div class="overview"><h2>${this.name}</h2><h3>${this.questions[this.counter].question}, ${this.questions[this.counter + 1].question}...</h3><div><h4 id="save">speichern</h4><h4 id="test">Testen</h4></div></div>`;
    }

    quiz[0].counter = 0;
    for (j = 0; j < quiz[0].questions.length; j++) {
        quiz[0].questions[j].clicked = false;
        quiz[0].questions[j].time = 10;
        quiz[0].questions[j].maxScore = 10;
    }

    document.getElementById('uContent').innerHTML += quiz[0].ovCode();
    quiz[0].loadEvents();

    saveEvent();
}

function saveToLocal() {
    let name = quiz[0].name;
    $(function () {
        $('#uContent').html('<h3 id="saveInfo">' + name + ' wurde <a href="./quiz.html">hier</a> gespeichert.</h3>');
        setTimeout(() => {
            $('#saveInfo').remove();
        }, 5000);
    });

    let sq = '';
    console.log(quiz);
    for (let i = 0; i < quiz[0].questions.length; i++) {
        sq += quiz[0].questions[i].question + ';' + quiz[0].questions[i].options[0] + ';' + quiz[0].questions[i].options[1] + ';' + quiz[0].questions[i].options[2] + ';' + quiz[0].questions[i].options[3] + ';' + quiz[0].questions[i].trueOption + '\r\n';
    }
    localStorage.setItem(quiz[0].name, sq);
    quiz.length = 0;
    console.log(quiz);
}

function saveEvent() {
    let save = document.getElementById('save');
    save.addEventListener('click', function () {
        if (document.getElementById('sameName') == null) {
            testName();
        }
    });
}

function testName() {
    function y() {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) == quiz[0].name || (quiz[0].name.length + 13 == localStorage.key(i).length && localStorage.key(i).startsWith(quiz[0].name) && localStorage.key(i).includes('--CreateProve'))) {
                return true;
            }
        }
        return false;
    }

    let x = function () {
        saveToLocal();
        document.getElementsByClassName('overview')[0].remove();
        if (document.getElementById('scoreOutput') != null) {
            document.getElementById('scoreOutput').remove();
        }
    }

    if (y()) {
        $(function () {
            $('#uContent').append('<div id="sameName"><p>In der Seite Quiz gibt es schon ein Quiz mit dem Name ' + quiz[0].name + '!</p><div><p id="ers">Ersetzten</p><p id="umb">Umbenennen und Speichern</p><p id="later">Später speichern</p></div>');
            $('#ers').click(function () {
                $('#sameName').remove();
                localStorage.removeItem(quiz[0].name + '--Score');
                x();
            });
            $('#umb').click(function () {
                $('#sameName').html('<div id="nName"><input type="text" id="uInput" placeholder="Neuer Name für Ihre Quiz"><p id="umSave">Speichern</p><div id="fMeld"></div></div>');
                $('#umSave').click(function () {
                    quiz[0].name = $('#uInput').val();
                    if (quiz[0].name < 2) {
                        $('#fMeld').html('<p>Der Name der Quiz muss mind. 2 Zeichensein haben!</p>');
                    }
                    if (quiz[0].name.includes('--Score') || quiz[0].name.includes('--Startseite') || quiz[0].name.includes('--Highscore') || quiz[0].name.includes('--TopQuiz') || quiz[0].name.includes('--CreateProve') || quiz[0].name.includes('--Counter')) {
                        $('#fMeld').html('<p>Der Name des Quiz darf nicht --Score, --Startseite, --Highscore --TopoQuiz, --CreateProve und --Counter dabeihaben!</p>');
                    } else if (!y()) {
                        $('#nName').remove();
                        $('#sameName').remove();
                        x();

                    } else {
                        $('#fMeld').html('<p>In der Seite Quiz gibt es schon ein Quiz mit dem Name ' + quiz[0].name + '!</p>');
                    }
                });
            });
            $('#later').click(function () {
                $('#sameName').remove();
            });

        });
    } else if (!y()) {
        x();
    }
}