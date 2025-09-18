let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let sound = new Audio("move.mp3");
let main = document.querySelector(".main");
let s1 = document.querySelector(".s1");
let s2 = document.querySelector(".s2");
let flag = 0 , sign = 0;
let oTrack = [] , xTrack = [] ;
let turnX = true; //playerX, playerO
let count = 0; //To Track Draw

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  sign = 1;
  turnX = true;
  xTrack = [];
  oTrack = [];
  enableBoxes();
  s1.innerText = "O : Turn ";
  s1.classList.add("hide");
  s2.innerText = "X : Turn ";
  s2.classList.remove("hide");
  boxes.forEach((box) => {
    box.classList.remove("color", "red", "blue");
  });
};


for (let box of boxes) {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return; // Don't allow click on already marked box

    sound.play();

    if (turnX) {
      // X's Turn
      if (xTrack.length === 3) {
        let oldBox = xTrack.shift();
        oldBox.innerText = "";
        oldBox.disabled = false;
        oldBox.classList.remove("red");
      }

      box.innerText = "X";
      box.classList.add("red");
      box.disabled = true;
      xTrack.push(box);

      if (flag == 0) {
        if(sign == 1){
          console.log("hello")
          // show O, hide X (next turn is O)
          s1.classList.remove("hide");
          s2.classList.add("hide");
          flag = 1;
        }
        else{
          console.log("hello")
          s1.classList.add("hide");
          s2.classList.remove("hide");
          flag = 1;
        }
      }

      turnX = false;
    } else {
      // O's Turn
      if (oTrack.length === 3) {
        let oldBox = oTrack.shift();
        oldBox.innerText = "";
        oldBox.disabled = false;
        oldBox.classList.remove("blue");
      }

      box.innerText = "O";
      box.classList.add("blue");
      box.disabled = true;
      oTrack.push(box);

      if (flag == 1) {
        if (sign == 1){
            // show X, hide O (next turn is X)
          s1.classList.add("hide");
          s2.classList.remove("hide");
          flag = 0;
        }
        else{
          s1.classList.remove("hide");
          s2.classList.add("hide");
          flag = 0;
        }
      }


      turnX = true;
    }

    checkWinner();
  });
}



const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  flag = 0 ;
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

function winner(p1 , p2 , p3){

    boxes[p1].classList.add("color");
    boxes[p2].classList.add("color");
    boxes[p3].classList.add("color");

}

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {

        setTimeout(function(){
          if(flag == 0){
            boxes[pattern[0]].classList.remove("blue");
            boxes[pattern[1]].classList.remove("blue");
            boxes[pattern[2]].classList.remove("blue");
            winner(pattern[0] , pattern[1] , pattern[2]);
              s1.innerText = `Congratulations, Winner is ${pos1Val}`;
              disableBoxes();
          }
          else{
            boxes[pattern[0]].classList.remove("red");
            boxes[pattern[1]].classList.remove("red");
            boxes[pattern[2]].classList.remove("red");
            winner(pattern[0] , pattern[1] , pattern[2]);
              s2.innerText = `Congratulations, Winner is ${pos1Val}`;
              disableBoxes();
          }

        } , 750);
        return true;
      }
    }
  }
};
resetBtn.addEventListener("click", resetGame);