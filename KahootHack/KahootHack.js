/*  !Instructions!
  1. Follow instructions on GetAnswers.js then continue with step 2
  2. Run script in console
*/

let AnswerTable = [
  [
      [
          "Question2",
          "none"
      ],
      [
          0,
          1,
          2
      ]
  ],
  [
      [
          "e",
          "https://images-cdn.kahoot.it/4e1d2b0a-b82b-415d-b21d-fd71dbcda746?auto=webp"
      ],
      [
          1
      ]
  ],
  [
      [
          "e",
          "https://images-cdn.kahoot.it/0ab223bc-c5c1-4ba4-9a09-9229ca25ff0b?auto=webp"
      ],
      [
          3
      ]
  ],
  [
      [
          "e",
          "https://images-cdn.kahoot.it/9f2a3e79-03a6-49da-bf01-b8ddf76e190e?auto=webp"
      ],
      [
          2
      ]
  ],
  [
      [
          "Question2",
          "none"
      ],
      [
          3
      ]
  ],
  [
      [
          "Question2",
          "none"
      ],
      [
          2
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

    let QuestionText = document.getElementsByClassName("question-title__TitleWrapper-sc-12qj0yr-0 jNIHOs")[0].children[0].textContent
    let QuestionImageHolder = document.getElementsByClassName("question-media__QuestionMedia-sc-137zdxa-1 biSjoe question-center-content__QuestionMedia-sc-1h0hm23-2")[0]
    let QuestionImage = "none"
    if (QuestionImageHolder.children[0]) {
      QuestionImage = QuestionImageHolder.getElementsByClassName("question-base-image__StyledMediaImage-sc-kc8138-0 kxCyDB")[0].src
    }
    
    let NatrualNextData = AnswerTable[CurrentQuestion]
    let NNDQuestionText = NatrualNextData[0][0]
    let NNDQuestionImage = NatrualNextData[0][1]
    let NNDAnswerIndex = NatrualNextData[1]

    while (true) {
      if (QuestionText == NNDQuestionText && QuestionImage == NNDQuestionImage) {
        CurrentQuestion += 1
        break
      } else {
        CurrentQuestion += 1
        NatrualNextData = AnswerTable[CurrentQuestion]
        NNDQuestionText = NatrualNextData[0][0]
        NNDQuestionImage = NatrualNextData[0][1]
        NNDAnswerIndex = NatrualNextData[1]
      }
    }

    // Answers Question
    const MainHolder = document.getElementsByClassName("unscrollable-wrapper__UnscrollableWrapper-sc-1yr9vot-0 kqQAkl quiz__Wrapper-sc-13pi6nh-0 Osnxh")[0].children
    const QuestionHolder = MainHolder[MainHolder.length - 1]
    const Questions = QuestionHolder.children
    for (let i = 0; i < Questions.length; i++) {
      const UseQuestion = Questions[i]
      let AnswerIndex = parseInt(UseQuestion.getAttribute("data-mapped-index"))

      if (NNDAnswerIndex.indexOf(AnswerIndex) != -1) {
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