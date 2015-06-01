'use babel';

import { CompositeDisposable } from 'atom';
import { join } from 'path';
import memoize from 'memoizee';

const KEYS = {
  DELETE: 8,
  ENTER : 13,
  SPACE : 32
};

const AUDIO_MAP = {
  [KEYS.DELETE]: 'delete_press.mp3',
  [KEYS.ENTER] : 'spacebar_press.mp3',
  [KEYS.SPACE] : 'spacebar_press.mp3',
  DEFAULT      : 'key_press.mp3'
};

let getAudio = memoize(name => new Audio(join(__dirname, '../audio', name)),
                       { primitive: true });

function playAudio(name, volume) {
  let audio = getAudio(name);

  audio.currentTime = 0;
  audio.volume = volume;
  audio.play();
}

export default class {
  constructor({ isActive=false, volume=1 }) {
    this.subscriptions = new CompositeDisposable();
    this.isActive = isActive;
    this.volume = volume;

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  activate() {
    this.subscriptions.add(atom.workspace.observeTextEditors(editor => {
      let view = atom.views.getView(editor);
      view.addEventListener('keydown', this.handleKeyDown);
    }));

    this.isActive = true;
  }

  deactivate() {
    atom.workspace.getTextEditors().forEach(editor => {
      let view = atom.views.getView(editor);
      view.removeEventListener('keydown', this.handleKeyDown);
    });

    this.subscriptions.dispose();
    this.isActive = false;
  }

  serialize() {
    return { isActive: this.isActive, volume: this.volume };
  }

  increaseVolume(by=0.1) {
    this.volume = Math.min(Math.max(this.volume + by, 0), 1);
  }

  handleKeyDown({ keyCode }) {
    playAudio(AUDIO_MAP[keyCode] || AUDIO_MAP.DEFAULT, this.volume);
  }
};
