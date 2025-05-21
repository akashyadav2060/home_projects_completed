let generateBtn = document.querySelector('button');
let inputPrompt = document.querySelector('input');
let output = document.querySelector('.quotes')

generateBtn.addEventListener('click', fetchQuotes);
inputPrompt.addEventListener('keypress', (e)=>{
if (e.key === 'Enter')fetchQuotes();
})

async function fetchQuotes(){
    const inputTerm= inputPrompt.value.trim();
    if(!inputTerm){
        alert('Please enter some text to search');
        return;
    }

    try { output.innerHTML = '<div class="loading> Loading Quotes ...</div>;'
    const response = await fetch(`https://api.quotable.io/search/quotes?query=${inputTerm}`);

    if (!response.ok){
        throw new Error(`HTTP error! status:${response.status}`);
    }
    
        const data = await response.json();
        if (data.results.length === 0){
            output.innerHTML = '<div class= "no-results"> No quotes found matching your search.</div>';
            return;
        }
        output.innerHTML = '';
        data.results.forEach(quote => {
            const quoteElement = document.createElement('div');
            quoteElement.className = 'quote-card';
            quoteElement.innerHTML = `<p class= "quote-text"> "${quote.content}" </p> 
            <p class="quote-author"> - ${quote.author}</p>`;
            output.appendChild(quoteElement);

        });
    } catch(error){
        console.error('Error fetching quotes:', error);
    }


}