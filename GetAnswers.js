let AnswerTable = []

const QuestionList = document.getElementsByClassName("styles__QuestionBlock-sc-19vxqaz-0 cfqmkk")

Array.from(QuestionList).forEach(QuestionHolder => {
    let AnswerHolder = QuestionHolder.children[1]
    for (let i = 0; i < AnswerHolder.children.length; i++) {
        const AnswerChoice = AnswerHolder.children[i]
        const Text = AnswerChoice.getAttribute("aria-label")
        const IsCorrect = (Text.slice(Text.length-9,Text.length)=="- correct")
        if (IsCorrect) {
            // Add Question Number And Answer Number To ANswerTable
        }
    }
})

console.log(AnswerTable)

/*
https://create.kahoot.it/details/6f767839-bb95-492b-ae03-cd2a895eb57e
*/
