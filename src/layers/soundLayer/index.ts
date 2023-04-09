import sound from "pixi-sound";
import { Spine } from "pixi-spine";

export const SoundLayer = {
  init(spine: Spine) {
    spine.spineData.events
      .map(event => {
        if (event.name.startsWith("Talk")) {
          return "";
        }
        return event.name.replace("sound/", "").replace(".wav", "");
      })
      .filter(it => it)
      .forEach(name => {
        sound.add(
          name,
          `https://yuuka.diyigemt.com/image/ba-all-data/Audio/VoiceJp/Character_voice/JP_Koharu/${name}.mp3`
        );
      });
  },
};
