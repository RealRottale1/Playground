const MainHolder = document.getElementsByClassName("unscrollable-wrapper__UnscrollableWrapper-sc-1yr9vot-0 kqQAkl quiz__Wrapper-sc-13pi6nh-0 Osnxh")[0].children
const QuestionHolder = MainHolder[MainHolder.length-1]
const Questions = QuestionHolder.children


for (let i = 0; i < Questions.length; i++) {
  const UseQuestion = Questions[i]
  let AnswerIndex = UseQuestion.getAttribute("data-mapped-index")
  console.log(AnswerIndex)
}