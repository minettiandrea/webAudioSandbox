export class Noise{ 

    private noise:AudioBufferSourceNode | null = null;
    private audioContext:AudioContext;

    constructor(audioContext: AudioContext) {
        this.audioContext = audioContext;
    }
    

    play() {
        this.noise = this.audioContext.createBufferSource();
        const bufferSize = this.audioContext.sampleRate * 5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        let data = buffer.getChannelData(0); // get data

        // fill the buffer with noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this.noise.buffer = buffer;
        this.noise.connect(this.audioContext.destination);
        if(this.noise)
        this.noise.start()
    }

    stop() {
        if(this.noise)
        this.noise.stop()
    }

    
}