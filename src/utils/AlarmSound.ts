
// A simple utility to manage alarm sounds
class AlarmSound {
  private static instance: AlarmSound;
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  
  private constructor() {
    // Create audio element with a default alarm sound
    this.audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    this.audio.loop = true;
  }
  
  public static getInstance(): AlarmSound {
    if (!AlarmSound.instance) {
      AlarmSound.instance = new AlarmSound();
    }
    return AlarmSound.instance;
  }
  
  public play(): void {
    if (this.audio && !this.isPlaying) {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          console.log("Alarm started playing");
        })
        .catch(error => {
          console.error("Error playing alarm sound:", error);
        });
    }
  }
  
  public stop(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      console.log("Alarm stopped");
    }
  }
}

export default AlarmSound;
