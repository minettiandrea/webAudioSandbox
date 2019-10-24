export class Synth{
    private audioContext:AudioContext
    private square:OscillatorNode | null = null;
    private saw:OscillatorNode | null = null;
    private gainSquare:GainNode | null = null;
    private gainSaw:GainNode | null = null;
    private lfo: OscillatorNode;

    constructor(ctx: AudioContext) {
        this.audioContext  = ctx;
        this.lfo = ctx.createOscillator()
        let real = new Float32Array(2);
        let imag = new Float32Array(2);

        real[0] = 0;
        imag[0] = 0;
        real[1] = 0.5;
        imag[1] = 0;

        var wave = ctx.createPeriodicWave(real, imag);

        this.lfo.setPeriodicWave(wave);
        this.lfo.frequency.value = 10;
        this.lfo.start();



    }

    play(freq:number, duration:number) {
        this.square = this.audioContext.createOscillator();
        this.gainSquare = this.createAndConnect(this.square,freq,duration,"square");
        this.saw = this.audioContext.createOscillator();
        this.gainSaw = this.createAndConnect(this.saw,freq,duration,"sine");
    }

    createAndConnect(o:OscillatorNode,freq:number, duration:number,type:OscillatorType):GainNode {
        o.frequency.value = freq;
        o.type = type;
        o.start();
        const g = this.audioContext.createGain();
        this.lfo.connect(g.gain)
        o.connect(g);
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(0.5,this.audioContext.currentTime + 0.5*duration);
        g.gain.linearRampToValueAtTime(0.5,this.audioContext.currentTime + 1*duration);
        g.connect(this.audioContext.destination);
        return g
    }

    modulateX(amount:number) {
        if(this.saw && this.square) {
            this.saw.frequency.value = amount;
            this.square.frequency.value = amount*Math.pow(2,5/12);
        }
    }

    modulateY(amount:number) { //number between 0 and 1
        if(this.gainSquare && this.gainSaw) {
            this.gainSaw.gain.setValueAtTime(amount,this.audioContext.currentTime);
            this.gainSquare.gain.setValueAtTime(1 - amount,this.audioContext.currentTime);
        }    
        this.lfoAmount(amount)    
    }

    lfoAmount(amount:number) {
        if(this.lfo) {
            this.lfo.frequency.value = amount * 20;
        } 
    }



    stop() {
        if(this.saw && this.square) {
            this.saw.stop();
            this.square.stop();
        }
    }
}