'use babel';

import KeyboardSounds from './keyboard-sounds.js';
import { CompositeDisposable } from 'atom';

export default {
  keyboardSounds: null,
  subscriptions: null,

  activate(state) {
    this.keyboardSounds = new KeyboardSounds(state);
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'keyboard-sounds:toggle': () => this.toggle(),
      'keyboard-sounds:volume-up': () => this.increaseVolume(),
      'keyboard-sounds:volume-down': () => this.increaseVolume(-0.2)
    }));

    if (state.isActive || state.isActive === undefined)
      this.keyboardSounds.activate();
  },

  deactivate() {
    this.keyboardSounds.deactivate();
    this.subscriptions.dispose();
  },

  serialize() {
    return this.keyboardSounds.serialize();
  },

  toggle() {
    if (this.keyboardSounds.isActive)
      this.keyboardSounds.deactivate();
    else
      this.keyboardSounds.activate();
  },

  increaseVolume(by) {
    this.keyboardSounds.increaseVolume(by);
  }
}
