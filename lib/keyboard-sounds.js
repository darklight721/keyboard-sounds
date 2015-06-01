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

function handleKeyDown({ keyCode }) {
  let audio = getAudio(AUDIO_MAP[keyCode] || AUDIO_MAP.DEFAULT);
  audio.currentTime = 0;
  audio.play();
}

export default class {
  constructor() {
    this.subscriptions = new CompositeDisposable();
    this.isActive = false;
  }

  activate() {
    this.subscriptions.add(atom.workspace.observeTextEditors(editor => {
      let view = atom.views.getView(editor);
      view.addEventListener('keydown', handleKeyDown);
    }));

    this.isActive = true;
  }

  deactivate() {
    atom.workspace.getTextEditors().forEach(editor => {
      let view = atom.views.getView(editor);
      view.removeEventListener('keydown', handleKeyDown);
    });

    this.subscriptions.dispose();
    this.isActive = false;
  }
};
