const keys = document.querySelectorAll('.keys');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');
let result = 0;
let t = 3 ;
function factorial(x){
    let ans = 1;
    for (let i = 2 ; i <=x ; i ++){
        ans *= i;
    }
    return ans ;
}
function result_(){
    return result;
}
console.log(keys);
let input = "";

function fraction(x) {
    console.log('x:' , x)
    return 1/x; 
}

for(let key of keys){
    const value = key.dataset.key;

    key.addEventListener('click' , ()=>{
        if (value=="clear"){
            input = ""
            display_input.innerHTML="";
            display_output.innerHTML="";
        }else if(value == "backspace"){
            input = input.slice(0 , -1);

            display_input.innerHTML = CleanInput(input);
            if(display_input.innerHTML == ""){
                display_output.innerHTML= "";
            }
        }else if(value == "="){
            let temp = input;
            temp = temp.replaceAll(/log\(/g, "Math.log10(")
            .replaceAll(/ln\(/g, "Math.log(")
            .replaceAll(/sin\(/g, "Math.sin((Math.PI/180)*")
            .replaceAll(/π/g, "Math.PI")
            .replaceAll(/([0-9.]+)\^-1/g, "Math.pow($1, -1)")
            .replaceAll(/cos\(/g, "Math.cos((Math.PI/180)*")
            .replaceAll(/tan\(/g, "Math.tan((Math.PI/180)*")
            .replaceAll(/!\(/g, "factorial(")
            .replaceAll(/e\^\(/g, "Math.exp(")
            .replaceAll(/√\(/g, "Math.sqrt(")
            .replaceAll(/([0-9.]+)\^([0-9.]+)/g, 'Math.pow($1, $2)')
            .replaceAll(/Ans/g, "result_()")
            .replaceAll(/cos\^-1\(/g, "Math.acos((Math.PI/180)*")
            .replaceAll(/sin\^-1\(/g, "Math.asin((Math.PI/180)*")
            .replaceAll(/tan\^-1\(/g, "Math.atan((Math.PI/180)*");
    
            try{
                result =(eval(temp));
            }
            catch(e){
                result = "Error" ; 
            }
            display_output.innerHTML = CleanOutput(result) ;
        }
        else{
            
            if(ValidateInput(value)){
                    input += value;
                display_input.innerHTML = CleanInput(input) ; 
            }
        }
    })
}
document.addEventListener("keydown", function (e) {
    const key = e.key;

    // Handle numbers
    if (key >= "0" && key <= "9") {
        input += key;
    }
    // Handle operators
    else if (["+", "-" , "*" , "/"].includes(key)) {
        input += key;
    }

    // Handle decimal point
    else if (key === ".") {
        if(ValidateInput(".")){
            input += ".";
        }
    }
    else if(key == "("){
        input += "(";
    }
    else if(key == ")"){
        input += ")";
    }
    // Handle Enter for evaluation
    // Handle Backspace
    else if (key === "Backspace") {
        input = input.slice(0, -1);
        if(display_input.innerHTML == ""){
            display_output.innerHTML= "";
        }
    }
    // Handle Escape for clear
    else if (key === "Escape") {
        input = "";
        display_output.innerHTML = "";
    } else {
        return; // Ignore other keys
    }

    display_input.innerHTML = CleanInput(input);
});
function CleanInput(input) {
    if(input[0] == "."  || input[0] == '+' || input[0] == "⨯" || input[0] == "÷" || input[0] == "%" ){
        input =  "0" + input;
    }
    if(input[0] == "^-1" ){
        input =  "1" + input;
    }
	let input_array = input.split("");
	let input_array_length = input_array.length;

    

	for (let i = 0; i < input_array_length; i++) {
		if (input_array[i] == "*") {
			input_array[i] = `<span class= "operator">⨯</span> `;
		} else if (input_array[i] == "/") {
			input_array[i] = ` <span class="operator">÷</span> `;
		} else if (input_array[i] == "+") {
			input_array[i] = `<span class="operator">+</span> `;
		} else if (input_array[i] == "-") {
			input_array[i] = `<span class="operator">-</span> `;
		} else if (input_array[i] == "(") {
			input_array[i] = `<span class="brackets">(</span>`;
		} else if (input_array[i] == ")") {
			input_array[i] = `<span class="brackets">)</span>`;
		} else if (input_array[i] == "%") {
			input_array[i] = `<span class="operator">%</span>`;
		}
	}

	return input_array.join("");
}
function CleanOutput (output) {
    if(output == "Error" || output == "Undefined" || output == "Infinity"){
        return output ;
    }
	let output_string = output.toString();
	let decimal = output_string.split(".")[1];
	output_string = output_string.split(".")[0];

	let output_array = output_string.split("");
	if (output_array.length > 3) {
		for (let i = output_array.length - t; i > 0; i -= t) {
			output_array.splice(i, 0, ",");
            t = 2 ;
		}
	}
    t = 3 ;

	if (decimal) {
		output_array.push(".");
		output_array.push(decimal);
	}

	return output_array.join("");
}

function ValidateInput (value) {
	let last_input = input.slice(-1);

	let operators = ["+", "-", "*", "/" , "%" , "."];
	if (value == "." && last_input == ".") {
		return false;
	}

	if (operators.includes(value)) {
		if (operators.includes(last_input)) {
			return false;
		} else {
			return true;
		}
	}

	return true;
}
