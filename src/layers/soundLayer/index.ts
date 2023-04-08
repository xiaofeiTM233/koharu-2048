import sound from "pixi-sound";

export const SoundLayer = {
  init(soundList: string[]) {
    soundList.forEach(name => {
      sound.add(
        name,
        `https://yuuka.diyigemt.com/image/ba-all-data/Audio/VoiceJp/Character_voice/JP_Koharu/${name}.mp3`
      );
    });
  },
};
