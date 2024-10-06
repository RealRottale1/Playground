/*  !Instructions!
  1. Follow instructions on GetAnswers.js then continue with step 2
  2. Run script in console
*/

let AnswerTable = [
  [
      "Question 4",
      [
          0,
          1,
          2
      ]
  ],
  [
      "aeea",
      [
          1,
          2
      ]
  ],
  [
      "Question 1",
      [
          1
      ]
  ],
  [
      "qwertyuiop",
      [
          0
      ]
  ]
]

// Don't ANYTHIN Bellow Unless You Know What You Are Doing!
function Wait(Time) {
  return new Promise(Success => {
    setTimeout(() => {
      Success()
    }, Time)
  })
}

async function WaitUntilElementPresent(ClassNames) {
  let Element = null
  while (!Element) {
    for (let i = 0; i < ClassNames.length; i++) {
      Element = document.getElementsByClassName(ClassNames[i])[0]
      if (Element) {
        break
      }
    }
    await Wait(250)
  }
}

let CurrentQuestion = 0

async function Main() {
  console.log("Script Running!")
  while (true) {

    // Waits For New Question
    await WaitUntilElementPresent(["unscrollable-wrapper__UnscrollableWrapper-sc-1yr9vot-0 kqQAkl quiz__Wrapper-sc-13pi6nh-0 Osnxh"])
    await WaitUntilElementPresent(["question-title__TitleWrapper-sc-12qj0yr-0 jNIHOs"])
    //question-title__Title-sc-12qj0yr-1 fewGjL
    let QuestionText = document.getElementsByClassName("question-title__TitleWrapper-sc-12qj0yr-0 jNIHOs")[0].children[0].textContent
    let NatrualNextData = AnswerTable[CurrentQuestion]
    let Answers = NatrualNextData[1]

    if (QuestionText != NatrualNextData[0]) {
      while (QuestionText != NatrualNextData[0]) {
        CurrentQuestion += 1
        NatrualNextData = AnswerTable[CurrentQuestion]
      }
    } else {
      CurrentQuestion += 1
    }

    // Answers Question
    const MainHolder = document.getElementsByClassName("unscrollable-wrapper__UnscrollableWrapper-sc-1yr9vot-0 kqQAkl quiz__Wrapper-sc-13pi6nh-0 Osnxh")[0].children
    const QuestionHolder = MainHolder[MainHolder.length - 1]
    const Questions = QuestionHolder.children
    for (let i = 0; i < Questions.length; i++) {
      const UseQuestion = Questions[i]
      let AnswerIndex = parseInt(UseQuestion.getAttribute("data-mapped-index"))
      if (Answers.includes(AnswerIndex)) {
        UseQuestion.click()
      }
    }
    const SubmitButton = document.getElementsByClassName("button__Button-sc-c6mvr2-0 hyBcTR quiz__SubmitButton-sc-ndm6ik-0 ithUoL")[0]
    if (SubmitButton) {
      SubmitButton.click()
    }

    // Waits Until Scoreboard Shows Up
    await WaitUntilElementPresent(["styles__TopContent-sc-468pf5-0 kicgDn scoreboard__TopContent-sc-ryzpjh-2 eDIkMC"])
  }
}
Main()
