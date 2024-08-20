export const playRevealSound = () => {
  const audio = new Audio('/path/to/reveal-sound.mp3');
  audio.play().catch(error => console.error('Error playing sound:', error));
};