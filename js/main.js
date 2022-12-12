const answers = {
    2: null,
    3: null,
    4: null,
    5: null,
}

const btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button){
    button.addEventListener("click", function(){
        
        const thisCard = this.closest('[data-card]');
        const thisCardNumber = parseInt(thisCard.dataset.card);

        if(thisCard.dataset.validate == "novalidate"){
           
            navigate("next", thisCard);
            updateProgressBar("next", thisCardNumber);
             
        } else {
            

            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

            if(isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                 navigate("next", thisCard); 
                 updateProgressBar("next", thisCardNumber); 
            } else {
                alert("Сделайте ответ, прежде чем переходить дальше.")
            }

           
        }
             
    })
})

const btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener("click", function(){
        const thisCard = this.closest('[data-card]');
        const thisCardNumber = parseInt(thisCard.dataset.card);
        
        navigate("prev", thisCard);       
        updateProgressBar("prev", thisCardNumber);
    });
});

function navigate(direction, thisCard){
    const thisCardNumber = parseInt(thisCard.dataset.card);
    let nextCard;

    if(direction == "next"){
        nextCard = thisCardNumber + 1;
    } else if(direction == "prev") {
        nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add("hidden");
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}

function gatherCardData(number){
    let question;
    let result = [];
    const currentCard = document.querySelector(`[data-card="${number}"]`);
    

    question = currentCard.querySelector("[data-question]").innerText;
    
    const radioValues = currentCard.querySelectorAll('[type="radio"]');
    
    radioValues.forEach(function(item){
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    const checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item){
        
        if(item.checked){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    const inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
    inputValues.forEach(function(item){
            itemValue = item.value;
        if(itemValue.trim() != ""){
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })
    


    const data = {
        question: question,
        answer: result
    }
    
    return data
}

function saveAnswer(number, data){
    answers[number] = data
}

function isFilled(number){
    if(answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

document.querySelectorAll(".radio-group").forEach(function(item){
    item.addEventListener("click", function(e){
        const label = e.target.closest("label");
        if(label) {
            label.closest(".radio-group").querySelectorAll("label").forEach(function(item){
                item.classList.remove("radio-block--active");
            })

            label.classList.add("radio-block--active");
        }
    })
})

document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener("change", function(){
        if(item.checked){
            item.closest("label").classList.add("checkbox-block--active")
        } else{
            item.closest("label").classList.remove("checkbox-block--active")
        }
    })
})

function updateProgressBar(direction, cardNumber){
    const cardTotalNumber = document.querySelectorAll('[data-card]').length;
    

    if(direction == "next") {
        cardNumber = cardNumber + 1;
    } else if (direction == "prev"){
        cardNumber = cardNumber - 1;
    }

    

    const progress = ((cardNumber * 100) / cardTotalNumber).toFixed();
    


    const progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress");
    if(progressBar) {
        progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;
        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    }
}


function validateEmail(email) {
    const pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}


function checkOnRequired(number){
    const currentCard = document.querySelector(`[data-card="${number}"]`);
    const requiredFields = currentCard.querySelectorAll("[required");
    console.log(requiredFields)

    const isValidArray = [];
    requiredFields.forEach(function(item){
        if( item.type == "checkbox" && item.checked == false){
            isValidArray.push(false);
        }else if (item.type == "email"){
            if (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false)
            }
        }
    });

    if(isValidArray.indexOf(false) == -1){
        return true;
    } else {
        return false;
    }
}