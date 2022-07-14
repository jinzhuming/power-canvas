import { defineStore } from 'pinia';
import { IMessage } from '../components/message';

export const useMessageStore = defineStore('messageList', {
  state: () => {
    return {
      messages: [] as IMessage[]
    };
  },
  getters: {
    messageList(state) {
      return state.messages;
    }
  },
  actions: {
    clear() {
      this.messages = [];
    },
    shift() {
      this.messages.shift();
    },
    set(message: IMessage) {
      this.messages.push(message);
    }
  }
});
