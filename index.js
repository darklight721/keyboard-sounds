'use babel';

import { CompositeDisposable } from 'atom';
import memoize from 'memoizee';
import path from 'path';

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

let getAudio = memoize(name => new Audio(path.join(__dirname, 'audio', name)),
                       { primitive: true });

export default {
  subscriptions: null,

  activate() {
    let disposables = atom.workspace.observeTextEditors(editor => {
      let view = atom.views.getView(editor);
      view.addEventListener('keydown', this.handleKeyDown);
    });

    this.subscriptions = new CompositeDisposable(disposables);
  },

  deactivate() {
    atom.workspace.getTextEditors().forEach(editor => {
      let view = atom.views.getView(editor);
      view.removeEventListener('keydown', this.handleKeyDown);
    });

    this.subscriptions.dispose();
  },

  handleKeyDown({ keyCode }) {
    let audio = getAudio(AUDIO_MAP[keyCode] || AUDIO_MAP.DEFAULT);
    audio.currentTime = 0;
    audio.play();
  }
};
