// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsContainer = document.querySelector(".bullets");
let spansContainer = document.querySelector(".bullets .spans");
let questionContainer = document.querySelector(".question");
let title = document.querySelector(".question h2");
let answersArea = document.querySelector(".answers");
let submitButton = document.querySelector(".submit");
let resultsDiv = document.querySelector(".results");
let countDownDiv = document.querySelector(".countdown");

// set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let randomIndex = Math.floor(Math.random() * 24);
// make a random number from 0 to 24


getQuestions();

// getQuestions function is used to get question from a specific file 
// remember to make the url dynamic 
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText); // array of objects, each object is a question
            let questionsCount = questions.length;
            let count = 6

            // creating bullets + set questions count
            createBullets(questionsCount);

            // add question data 
            addQuestionData(questions[currentIndex], questionsCount);

            countDown(5, questionsCount);
            // when clicking on submit button
            submitButton.onclick = () => {

                let rightAnswer = questions[currentIndex].right_answer;
                currentIndex++;

                // functio to check the answer
                checkAnswer(rightAnswer, questionsCount);

                // remove previous question
                title.innerHTML = "";
                answersArea.innerHTML = "";

                // add nex question data 
                addQuestionData(questions[currentIndex], questionsCount);

                // handle Bullets class
                handleBullets();

                clearInterval(countDownInterval)
                countDown(5, questionsCount);

                // show results 
                showResults(questionsCount);

            }
        }
    }

    myRequest.open("GET", "questions/html_questions.json", true);
    myRequest.send();
}


// createBullets Function is used to make two things
// 1 - right Questions Count
// 2 - make Bullets depend on questions Count
function createBullets(num) {

    countSpan.innerHTML = num;

    for (let i = 1; i <= num; i++) {

        // create bullet and append it to spansContainer
        let bullet = document.createElement("span");
        spansContainer.appendChild(bullet);

        if (i === 1) {
            bullet.classList = "on";
        }

    }

}

// handleBullets function, add class on to the bullets
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span"); // array of 30 spans
    bulletsSpans.forEach((span, index) => {
        // currentIndex is a random num from 0 to 24;
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}


// addQuestionsData Function is used to make two things
// 1- create the question title 
// 2- creat the question answers
function addQuestionData(question, questionsCount) {

    if (currentIndex < questionsCount) {
        // Question title
        let questionText = document.createTextNode(question.title);
        // append question title to h2
        title.appendChild(questionText);

        // create answers
        for (let i = 1; i <= 4; i++) {

            // create mainDiv with Class answer
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            // create radio input and add the attributes type, name, id and data-answer
            let radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "question";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = question[`answer_${i}`];

            // make first answer checked
            if (i === 1) {
                radioInput.checked = true;
            }

            // create label and add the attribute for, then add the label text to the label
            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(question[`answer_${i}`]);
            label.appendChild(labelText);

            // append the radio input and label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label);

            // append main div to answers div
            answersArea.appendChild(mainDiv);

        }
    }


}


// checkAnswer Function 
function checkAnswer(rightAnswer, questionsCount) {
    let answers = document.getElementsByName("question"); // array of four radio input
    let chosenAnswer = "";

    for (let i = 0; i < 4; i++) {
        if (answers[i].checked) { // answers[i].checked => return true or false
            chosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rightAnswer === chosenAnswer) {
        rightAnswers++;
    }

}


// showResults function
function showResults(questionsCount) {

    let results;
    // if currentIndex reaches the questionsCount this means that the questions ended so show the results.
    if (currentIndex === questionsCount) {
        // submitButton.innerHTML = "Show Results"
        questionContainer.remove();
        answersArea.remove();
        submitButton.remove();
        bulletsContainer.remove();



        if (rightAnswers >= questionsCount / 2 && rightAnswers < questionsCount) { // 15 : 29
            results = `<span class="good">Good</span> Your Score Is ${rightAnswers}/${questionsCount}`;
        } else if (rightAnswers === questionsCount) { // 30 : 30
            results = `<span class="perfect">Perfect</span> You Answered All Questions Right ${rightAnswers}/${questionsCount}`;
        } else if (rightAnswers >= 1 && rightAnswers < questionsCount / 2) { // 1 : 14
            results = `<span class="bad">Bad</span> You Score Is ${rightAnswers}/${questionsCount}`;
        } else { // 
            results = `<span class="bad">Horrible</span> You Didn't Answer Any Question Right ${rightAnswers}/${questionsCount}`;
        }

        resultsDiv.innerHTML = results
    }
}

function countDown(duration, questionsCount) {

    if (currentIndex < questionsCount) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownDiv.innerHTML = `${minutes}:${seconds}`

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();

            }
        }, 1000)
    }
}