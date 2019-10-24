import { Noise } from "./noise";
import { Synth } from "./synth";



(window as any).play = play;

function play() {
    if(playing) { 
        synth.stop();
        //noise.stop();
    } else {
        synth.play(440,1);
        //noise.play();
    }
    playing = !playing;

}

let audioCtx = new AudioContext();
let noise = new Noise(audioCtx);
let synth = new Synth(audioCtx);



let body = document.getElementsByTagName("body")[0];
body.style.cssText = "height: 100vh";

body.innerHTML = "<div style='position: absolute; top: 50%; width: 100%; background-color: red; height: 1px;'></div>";



body.onmousemove = (e:MouseEvent) => {
    synth.modulateX(e.screenX)
    synth.modulateY(e.clientY/window.innerHeight)
  
}

body.onclick = (e:MouseEvent) => {
    play()
}

body.onkeydown = (e:Event) => {
    noise.play();
   
}

body.onkeyup = (e:Event) => {
    noise.stop();
} 


let playing = false;







