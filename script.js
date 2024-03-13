open = false;

inpSearch = document.getElementById("searchBar");
startingQuote = document.getElementById("startingQuote");
startQuote();

let objList = [];


// displays the starting quote with author
async function startQuote() {
    const val = await fetch("https://usu-quotes-mimic.vercel.app/api/random");
    const json = await val.json();
    document.getElementById("startingQuote").innerText = json.content;
    document.getElementById("anAuthor").innerText = `- ${json.author}`
}


//displays the current quotes that aren't pinned
function displayCurrQuotes(){
    for (quoteObj of objList){
        if (quoteObj.quotePinned === "false"){
        createQuoteDiv(quoteObj);}
    }
}


//validates the user input and creates an error message if wrong, makes fetch call
async function displayQuotes() {
    pinnedContainer = document.getElementById("pinnedContainer");
    theName = document.getElementById("searchBar").value;
    //validating that the input is nonempty and not numbers
    if (theName === "" || containsNumbers(theName)) {
        errorDiv = document.createElement("p");
        errorDiv.setAttribute("class", "quoteDiv");
        errorDiv.setAttribute("id", "error");
        errorDiv.innerText = `Please enter a name. The name must not contain any numbers.`;
        errorDiv.addEventListener("click", () => {
            errorDiv.remove();
        })
        pinnedContainer.appendChild(errorDiv);
    }

    const val = await fetch(`https://usu-quotes-mimic.vercel.app/api/search?query=${theName}`)
    const json = await val.json();
    removeOldQuotes();

    //adding the new search results to the objList
    for (quote of json.results) {
        objList.push(
            {
                quoteText: quote.content,
                quoteAuthor: quote.author,
                quotePinned: "false",
            }
        );
    }
    displayCurrQuotes();
}


//Creates a html div from the quote object and adds it to the quotesContainer and gives it an event listener
function createQuoteDiv(quoteObj) {
    quotesContainer = document.getElementById("quotesContainer");
    newDiv = document.createElement("div");
    newDiv.innerText = `${quoteObj.quoteText}`;

    authorSpan = document.createElement("span");
    authorSpan.setAttribute("class", "authorSpan");
    authorSpan.innerText = ` -${quoteObj.quoteAuthor}`;
    newDiv.appendChild(authorSpan);

    newDiv.setAttribute("class", "quoteDiv");
    newDiv.setAttribute("data-pinned", "false");
    quotesContainer.appendChild(newDiv);

    newDiv.addEventListener("click", (e) => {
        addRightListener(e.target);
    })
}


//just a function for validating the input if it has a number in it
function containsNumbers(str) {
    return /\d/.test(str);
}


//called when a div is clicked, updates the objList and moves the divs
function togglePin(e){
    if (e.dataset.pinned === "true"){
        e.dataset.pinned = "false";
        newNode = e.cloneNode(true);
        newNode.addEventListener("click", (e) => {
            addRightListener(e.target);})
        quotesContainer = document.getElementById("quotesContainer");
        quotesContainer.prepend(newNode);
        e.remove();
        updateList(e.firstChild.data, "false");
    }

    else if (e.dataset.pinned === "false"){
        e.dataset.pinned = "true";
        newNode = e.cloneNode(true);
        newNode.addEventListener("click", (e) => {
            addRightListener(e.target);})
        pinnedContainer = document.getElementById("pinnedContainer");
        pinnedContainer.prepend(newNode);
        e.remove();        
        updateList(e.firstChild.data, "true");
    }
}


//I needed this to deal with when a user clicks on the child author div, the pin wouldn't work
function addRightListener(theTarget){
    if (theTarget.className === "authorSpan"){
        togglePin(theTarget.parentElement);
    }
    else{
        togglePin(theTarget);
    }
}


//finds the object in objList that matches the text, changes it's quotePinned to be the bool
function updateList(theText, bool){
    for (index in objList){
        if (objList[index].quoteText === theText){
            objList[index].quotePinned = bool;
        }
    }
}


//self explanatory
function removeOldQuotes() {
    quotesContainer = document.getElementById("quotesContainer");
    lastKid = quotesContainer.lastElementChild;
    while (lastKid){
        quotesContainer.removeChild(lastKid);
        lastKid = quotesContainer.lastElementChild;
    }
    objList = objList.filter(obj => obj.quotePinned === "true");
}


//changes the page based on whether it was a press in the beginning or the page was already displaying quotes
inpSearch.addEventListener("keypress", (e) => {
    if (document.getElementById("error")) {
        document.getElementById("error").remove();
    }
    if (e.key === "Enter" && !open) {
        open = !open;
        e.target.parentElement.parentElement.parentElement.dataset.open = `${open}`;
        e.target.parentElement.parentElement.childNodes[5].style.display = "none";
        e.target.parentElement.parentElement.childNodes[7].style.display = "none";
        displayQuotes();
    }
    else if (e.key === "Enter") {
        displayQuotes();
    }

})