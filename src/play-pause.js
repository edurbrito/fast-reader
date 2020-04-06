var text;
var index;

if (text == undefined){
    self.addEventListener('message' , function(e){
        text = e.data.text;
        index = e.data.index;
        updateWord();
    });
}
else{
    updateWord();
}

var data = {};

function updateWord(){
    var rate = 180;
    var word = text[index.i];

    if (index.i > 0)
        data.before_word = text[index.i - 1];
    else
        data.before_word = "";
    
    data.word = word;
    
    if (index.i < text.length - 1)
        data.after_word = text[index.i + 1];
    else
        data.after_word = "";
    
    if (word != undefined && (word.length <= 5 || word[word.length - 1] == '.')){
        rate = 400;
    }

    index.i++;
    data.index = index;

    postMessage(data);
    if (index.i < text.length)
        setTimeout(function(){updateWord()},rate);
}
