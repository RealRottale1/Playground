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
          [
              0,
              null
          ]
      ]
  ],
  [
      [
          "e",
          "https://images-cdn.kahoot.it/4e1d2b0a-b82b-415d-b21d-fd71dbcda746?auto=webp&width=400"
      ],
      [
          [
              1,
              "https://images-cdn.kahoot.it/fd9bae0f-32ea-4de2-b16e-2f3d38eaac0b?auto=webp&width=1200"
          ]
      ]
  ],
  [
      [
          "e",
          "https://images-cdn.kahoot.it/9f2a3e79-03a6-49da-bf01-b8ddf76e190e?auto=webp&width=400"
      ],
      [
          [
              2,
              "https://images-cdn.kahoot.it/ef482d16-1228-4f56-8bea-c2d21b1bfb23?auto=webp&width=1200"
          ]
      ]
  ],
  [
      [
          "Question2",
          "none"
      ],
      [
          [
              3,
              null
          ]
      ]
  ],
  [
      [
          "Question2",
          "none"
      ],
      [
          [
              2,
              null
          ]
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

    let QuestionImageHolder = document.getElementsByClassName("question-media__QuestionMedia-sc-137zdxa-1 biSjoe question-center-content__QuestionMedia-sc-1h0hm23-2")[0]
    let QuestionImage = null
    if (QuestionImageHolder) {
      let ImageSRC = QuestionImageHolder.getElementsByClassName("question-base-image__StyledMediaImage-sc-kc8138-0 kxCyDB")
      if (ImageSRC) {
        QuestionImage = ImageSRC.src
      }
    }
    
    let QuestionText = document.getElementsByClassName("question-title__TitleWrapper-sc-12qj0yr-0 jNIHOs")[0].children[0].textContent
    let NatrualNextData = AnswerTable[CurrentQuestion]
    let Answers = NatrualNextData[1][0]
    let AnswerImage = NatrualNextData[1][1]

    if (QuestionText != NatrualNextData[0][0] || ((QuestionImage && AnswerImage) && QuestionImage != AnswerImage)) {
      while (true) {
        if (QuestionText == NatrualNextData[0][0]) {
          if (QuestionImage && AnswerImage) {
            if (QuestionImage == AnswerImage) {
              break
            }
          } else {
            break
          }
        }
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
