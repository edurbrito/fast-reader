var text;

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
    rate = 180;
    if (index > 0)
        data.before_word = text[index - 1];
    else
        data.before_word = "";
    data.word = text[index];
    if (index < text.length - 1)
        data.after_word = text[index + 1];
    else
        data.after_word = "";
    
    if (text[index].length <= 4){
        rate = 300;
    }

    index++;
    data.index = index;

    postMessage(data);
    if (index < text.length)
        setTimeout(function(){updateWord()},rate);
}
