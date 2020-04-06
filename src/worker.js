class ReaderWorker {
    constructor(script,data){
        this.script = script;
        this.data = data;
        this.w = undefined;
    }

    initWorker = function(restart) {
        if (this.w == undefined){
            this.w = new Worker(this.script);
            this.postMessage();            
            this.onmessage();
        }
        else{
            this.terminate();
            if (restart)
                this.initWorker();
        }
    };

    postMessage = function(){
        this.w.postMessage(this.data);
    };

    onmessage = function(){
        this.w.onmessage = function(event){
            console.log("EVENT");
        }
    };

    terminate = function(){
        if (this.w != undefined)
            this.w.terminate();
        this.w = undefined;  
    }

}

module.exports = {
    ReaderWorker: ReaderWorker
  }