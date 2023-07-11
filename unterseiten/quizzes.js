let point = 0;
let quizIndex = -1;
let quizCounter = -1;
let scoreSerie = 1;
let scores = new Array();
let topFive = new Array();
let hScore = localStorage.getItem('--Highscore');
if (hScore != null) {
    scores[scores.length] = parseInt(hScore);
    console.log(scores);
}

let questions = new Array();
questions[0] = [new Question('Wo liegt Hollywood?', ['New York City', 'San Francisco Kalifornien', 'Los Angeles', 'Chicago'], 2), new Question('Wie viele Filme aus der "Herr Der Ringe" Welt gibt es?', ['3 Filme', '6 Filme', '3 und halb Filme', 'k.A., Ich kenne nur die Bücher'], 1), new Question('Was haben Batman und Superman zusammen?', ['Martha', 'Gute Filme', 'Planet Herkunft', 'Kräfte'], 0), new Question("Was war Groots erstes Wort?", ["Mama", "Papa", "Hodor", "I'am Groot"], 3)];
questions[1] = [new Question('Was ist/war die erste Serie auf Marvel Universe?', ['Wanda Vision', 'Loki', 'What If...?', "Marvel's Agents of S.H.I.E.L.D"], 3), new Question('Wie lange erzählt Ted Mosby seinen Kinder die Geschichte, wie er ihre Mutter getroffen hat?', ['neun Jahren', 'ein paar stunden', 'zwei Monaten', 'zwei Wochen'], 0), new Question('Wie viele Königreiche regiert der König auf "Iron Throne" in Game of Thrones?', ['nur ein Königreich', '5 Königreiche', '7 Königreiche', '3 Königreiche'], 1)];
questions[2] = [new Question('Welche Sport hat die meiste Fans auf der Welt?', ['Basketball', 'Schwimmen', 'Fußball', 'Ski fahren'], 2), new Question('Wer ist Cristiano Ronaldo?', ['Fußballspieler in Juventus', 'Fußballspieler in Real Madrid', 'Basketballspieler in USA', 'keine'], 0), new Question('Wo findet die nächste Fußball Weltmeisterschaft statt?', ['Österreich', 'Afghanistan', 'England', 'Katar'], 3)];

questions[3] = [new Question('Seit wann gibt es Javascript?', ['1971', '1995', '2003', '2011'], 1),
new Question('How do you write "Hello World" in an alert box?', ['msg("Hello World")', 'msgBox("Hello Wolrd")', 'alert("Hello World")', 'alertBox("Hello World")'], 2),
new Question('How do you create a function in JavaScript?', ['function myFunction()', 'function:myFunction()', 'function = myFunction()', 'let function = myFunction()'], 0),
new Question("How can you detect the client's browser name?", ['browser.name', 'navigator.appName', 'client.navName', 'none'], 1)];

questions[4] = [new Question('Was war der erste Film in MCU?', ['The Avengers', 'Captain America', 'Thor', 'Iron Man'], 3),
new Question('Welche Original Avenger hatte(hat) als letzter ihren/seinen ersten Solo Film?', ['Loki', 'Hawkye', 'Black Widow', 'Cap'], 2),
new Question('Was ist die erste Serie aus MCU?', ['Loki', 'Agents of SCHIELD', 'The Falcon and the Winter Soldier', 'Loki'], 1),
new Question('Wer kriegt als erste seinen 4. Solo Film?', ['Iron Man', 'Thanos', 'Ant-Man', 'Thor'], 3),
new Question('Wie viele Phasen gibt es schon in MCU?', ['4 Phasen', '9 Phasen', 'k.A.', '2 Phasen'], 0),
new Question('Wer ist Kevin Feige?', ['nur ein Mensch', 'Präsident von Marvel Studio', 'Regiseur', 'Schauspieler'], 1),
new Question('Wie viele Original Avengers gibt es?', ['3', '5', '6', '12'], 2),
new Question('Wer gehören zu den Revengers?', ['Thor, Loki, Dr. Strange, Hulk', 'Cap, Sam, Ant-Man, Wanda, Winter Soldier', 'Loki, Thor, Valkyre, Hulk', 'Iron Man, Spider-Man, Vision, Groot'], 2),
new Question('Wie alt ist Thor?', ['Über 40 Jahren', ' Unter 100 Jahren', ' 517 Jahren', 'Über 1500 Jahren'], 3),
new Question('Wer ist Stan Lees Lieblings Superheld?', ['Loki', 'Spider-Man', 'Dr. Strange', 'Thor Odinson'], 1)];

let name = ['Filme', 'Serien', 'Sport', 'Javascript', 'Marvel Cinematic Universe'];

let quiz = new Array();

for (let i = 0; i < localStorage.length && localStorage.length > 0; i++) {
    let key = localStorage.key(i);

    if (!key.includes('--Score') && !key.includes('--Startseite') && !key.includes('--Highscore') && !key.includes('--TopQuiz') && !key.includes('--CreateProve') && !key.includes('--Counter')) {
        let q = new Array();

        let lines = localStorage.getItem(key).split('\r\n');

        for (let l = 0; l < lines.length - 1; l++) {
            let x = lines[l].split(';');
            q[q.length] = new Question(x[0], [x[1], x[2], x[3], x[4]], parseInt(x[5]));
        }

        quiz[quiz.length] = new Quiz(key, q);
    }
}

for (let i = 0; i < questions.length; i++) {
    quiz[quiz.length] = new Quiz(name[i], questions[i]);
}

let gespielteQ;
let ende = false;

if (localStorage.getItem('--Startseite') != null) {
    let ind;
    let n = localStorage.getItem('--Startseite');
    for (let i = 0; i < quiz.length; i++) {
        if (n == quiz[i].name) {
            ind = i;
            break;
        }
    }

    quizCounter++;
    quizIndex = ind;
    quiz[ind].start();
    quiz[ind].timer();
    document.getElementById('links').style = "display: none;";
    localStorage.removeItem('--Startseite');
} else {
    initQuiz();
}

if (localStorage.length == 0 || localStorage.getItem('Filme--CreateProve') === null) {
    for (let i = 0; i < name.length; i++) {
        localStorage.setItem(name[i] + '--CreateProve', '');
    }
}



function initQuiz() {
    let counter = 0;
    topFive = [];

    for (let i = 0; i < quiz.length; i++) {
        quiz[i].counter = 0;

        document.getElementById('uContent').innerHTML += quiz[i].ovCode();
        quiz[i].loadEvents();

        if (quizCounter != -1 && quizIndex == i) {

            gespielteQ = i;

            for (j = 0; j < quiz[i].questions.length; j++) {
                quiz[i].questions[j].clicked = false;
                quiz[i].questions[j].time = 10;
                quiz[i].questions[j].maxScore = 10;
            }

            let overview = document.getElementsByClassName('overview');
            overview[gespielteQ].style = "display: none;";
        }

        if (localStorage.getItem(quiz[i].name + '--Score') != null) {
            let ls = localStorage.getItem(quiz[i].name + '--Score');
            let prozent = (parseInt(ls) / quiz[i].questions.length) * 100;
            let bg = 'linear-gradient(to right,  #00ff00 0%,#00ff00 ' + prozent + '%,#ffffff ' + prozent + '%,#ffffff 100%)';
            document.getElementsByClassName('scoreGraf')[counter].style = `background: ${bg};`;
            counter++;
        }

        if (localStorage.getItem(quiz[i].name + '--Counter') != null) {
            topFive[topFive.length] = [quiz[i].name + '--Counter', localStorage.getItem(quiz[i].name + '--Counter')];
        }


    }
    tops();

    $(function () {
        if (quizCounter >= 0) {
            if (counter < quiz.length) {
                $('#uContent').prepend('<h1>Andere Quizze</h1>');
            } else {
                $('#uContent').prepend('<h1>Sie haben alle Quizze durchgespielt!<br> Wollen Sie ihre eigene <a href="./createQuiz.html">Quiz erstellen</a>?</h1>');
            }
        }
    });
}

function tops() {
    topFive.sort(function (a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (parseInt(a[1]) < parseInt(b[1])) ? 1 : -1;
        }
    });

    for (let t of topFive) {
        console.log(t[0] + ' : ' + t[1]);
    }

    for (let i = 0; i < 5 && topFive[i] != null; i++) {
        for (let j = 0; j < quiz.length; j++) {
            if (topFive[i][0] == quiz[j].name + '--Counter') {
                let n = quiz[j].name;
                let q = quiz[j].questions[0].question + '--;' + quiz[j].questions[1].question;
                localStorage.setItem(i + 1 + '--TopQuiz', n + '--;' + q);
                break;
            }
        }
    }

    let len = topFive.length;

    for (let j = 0; j < quiz.length; j++) {
        for (let q = 0; q < topFive.length && len < 5; q++) {
            if (topFive[q][0] == quiz[j].name + '--Counter') {
                break;
            } else if (q == topFive.length - 1) {
                topFive[len] = [quiz[j].name + '--Counter', 0];
                let n = quiz[j].name;
                let qq = quiz[j].questions[0].question + '--;' + quiz[j].questions[1].question;
                localStorage.setItem(len + 1 + '--TopQuiz', n + '--;' + qq);
                len++;
            }
        }
    }
}
