document.addEventListener("DOMContentLoaded" , ()=>{
    const searchButton = document.querySelector("#user_search");
    const resetButton = document.querySelector("#user_reset");
    const user__input = document.querySelector(".Id_input");
    const statsContainer = document.querySelector(".stats-container");
    const easy_progress = document.querySelector(".easy-progress");
    const medium_progress = document.querySelector(".medium-progress");
    const hard_progress = document.querySelector(".hard-progress");
    const easyLabel = document.querySelector("#easy-label");
    const mediumLabel = document.querySelector("#medium-label");
    const hardLabel = document.querySelector("#hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");
    let flag = 0 ;
    function validateUsername(user_input) {
        if(user_input.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(user_input);
        if(!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }
    async function fetchUserDetails(user_input) {

        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            //statsContainer.classList.add("hidden");

            // const response = await fetch(url);
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
            const targetUrl = 'https://leetcode.com/graphql/';
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${user_input}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);
            if(!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData) ;

            displayUserData(parsedData);
        }
        catch(error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            searchButton.textContent = "Search";
        }
    }

    function updateProgress(solved, total, label, circle , flag) {
        if(flag==1){
            const progressDegree = (solved/total)*100;
            easy_progress.style.setProperty("--progress-degree", `${progressDegree}%`);
            // circle.style.setProperty("--progress-degree", `${progressDegree}%`);
            label.textContent = `${solved}/${total}`;
        }
        else if(flag == 2){
            const progressDegree = (solved/total)*100;
            medium_progress.style.setProperty("--progress-degree", `${progressDegree}%`);
            // circle.style.setProperty("--progress-degree", `${progressDegree}%`);
            label.textContent = `${solved}/${total}`;
        }
        else{
            const progressDegree = (solved/total)*100;
            hard_progress.style.setProperty("--progress-degree", `${progressDegree}%`);
            // circle.style.setProperty("--progress-degree", `${progressDegree}%`);
            label.textContent = `${solved}/${total}`;
        }
    }


    function displayUserData(parsedData) {
        // const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        // const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easy_progress ,1);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, medium_progress , 2);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hard_progress , 3);

        const cardsData = [
            {label: "Overall Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
            {label: "Overall Easy Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
            {label: "Overall Medium Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
            {label: "Overall Hard Submissions", value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
        ];

        console.log("card ka data: " , cardsData);

        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("")
    }

    searchButton.addEventListener('click', function() {
        const user_input = user__input.value;
        console.log("logggin username: ", user_input);
        if(validateUsername(user_input)) {
            fetchUserDetails(user_input);
            if(flag == 1){
                flag = 0 ;
            }
        }
    })
    resetButton.addEventListener('click' , function(){
        searchButton.disabled = false;
        if(flag == 0){
            user__input.value = "" ;
            easy_progress.style.setProperty("--progress-degree", `${flag}%`);
            medium_progress.style.setProperty("--progress-degree", `${flag}%`);
            hard_progress.style.setProperty("--progress-degree", `${flag}%`);
            easyLabel.textContent = "";
            mediumLabel.textContent = "";
            hardLabel.textContent = "";
            cardStatsContainer.innerHTML = "<div></div>";
            flag = 1;
        }

    })

})