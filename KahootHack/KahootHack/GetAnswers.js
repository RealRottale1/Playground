/*  !Instructions!
    1. Go to the quizlet page
    2. Open up ALL questions(the answer choices must be visible) (MAKE SURE WINDOW IS FULL SCREEN)
    3. Open inspect element and open up console
    4. Enable pasting by typing "enable pasting"
    5. Copy and paste code into console and hit enter
    6. Right click on the outputed array and click "copy object"
    7. In KahootHacks.js paste the array so that it equals AnswerTable
    8. Finished (If you get an error refresh the page and redo instructions) 
*/

let AnswerTable = []

const QuestionList = document.getElementsByClassName("styles__QuestionBlock-sc-19vxqaz-0 cfqmkk")

Array.from(QuestionList).forEach(QuestionHolder => {
    const Question = QuestionHolder.children[0].getElementsByClassName("styles__Question-sc-19vxqaz-6 ejwdwI")[0]
    const AnswerHolder = QuestionHolder.children[1]
    let CorrectAnswers = []
    if (AnswerHolder) {
        for (let i = 0; i < AnswerHolder.children.length; i++) {
            const AnswerChoice = AnswerHolder.children[i]
            const Text = AnswerChoice.getAttribute("aria-label")
            if (!Text) {
                break
            }
            const IsCorrect = (Text.slice(Text.length-9,Text.length)=="- correct")
            if (IsCorrect) {
                CorrectAnswers.push(i)
            }
        }
        // Gets Question Image
        const QuestionImageHolder = QuestionHolder.getElementsByClassName("styles__MediaContainer-sc-19vxqaz-5 fkxzco")[0]
        let QuestionImage = String(window.getComputedStyle(QuestionImageHolder.children[0]).backgroundImage)
        QuestionImage = QuestionImage.replace('url(\"',"")
        QuestionImage = QuestionImage.replace('")',"")
        QuestionImage = QuestionImage.replace("&width=400","")

        // Adds Data To Table
        if (CorrectAnswers.length > 0) {
            AnswerTable.push([[Question.textContent,QuestionImage],CorrectAnswers])
        }
    }
})

console.log(AnswerTable)