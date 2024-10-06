/*  !Instructions!
  1. Follow instructions on GetAnswers.js then continue with step 2
  2. Run script on start of game (If you miss it just change CurrentQuestion 
  to the current question number and try again)
*/

let AnswerTable = [[], [0, 1, 2], [1, 2], [1], [0]]
let CurrentQuestion = 0
let AddedHumanDelay = 0 // In milliseconds

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
      console.log(Element)
      if (Element) {
        break
      }
    }
    await Wait(250)
  }
}

async function Main() {
  console.log("Script Running!")
  while (true) {

    // Waits For New Question
    console.log("NEW QUESTION")
    await WaitUntilElementPresent(["styles__TopContent-sc-468pf5-0 kicgDn question-top-content__QuestionTopContent-sc-16zbque-0 kCdodc top-bar__TopContent-sc-9qma4q-1 kNHfze", "status-bar__ContentBar-sc-ivth8h-0 status-bar__TopBar-sc-ivth8h-1 gJtoGe gVQKSO content-block-styles__ChallengeStatusBar-sc-zu8u0s-31 gFOVnJ"])

    let Answers = AnswerTable[CurrentQuestion]
    console.log("AHHHHHHHH!")
    console.log(Answers[0])
    if (Answers[0]) { // Runs Only If Question Has Answer(s)
      // Waits For "Human Delay"
      if (AddedHumanDelay > 0) {
        await Wait(AddedHumanDelay)
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
    }

    MAKE IT WAIT UNTIL QUESTION NUMBER # out of #
    // Waits Until Scoreboard Shows Up
    await WaitUntilElementPresent(["styles__TopContent-sc-468pf5-0 kicgDn scoreboard__TopContent-sc-ryzpjh-2 eDIkMC"])

    CurrentQuestion += 1
  }
}
Main()
