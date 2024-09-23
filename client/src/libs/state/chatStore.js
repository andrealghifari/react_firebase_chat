import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    //cleanupchat is used to erased the the current user chat activity
    cleanUpChat: (state) => {
      (state.chatId = null), (state.user = null);
    },
    changeChat: (state, action) => {
      const { chatId, user, currentUser } = action.payload;

      //check if the user (receiver ) blocked the currentUser
      if (user.blocked.includes(currentUser.id)) {
        (state.chatId = chatId),
          (state.user = null),
          (state.isCurrentUserBlocked = true),
          (state.isReceiverBlocked = false);
      }
      //check if the currentUser has blocked receiver
      else if (currentUser.blocked.includes(user.id)) {
        (state.chatId = chatId),
          (state.user = user),
          (state.isCurrentUserBlocked = false),
          (state.isReceiverBlocked = true);
      } else {
        //set the blocked false, and remain chatid and user
        (state.chatId = chatId),
          (state.user = user),
          (state.isCurrentUserBlocked = false),
          (state.isReceiverBlocked = false);
      }
    },

    changeBlock: (state, action) => {
      // state.isReceiverBlocked = !state.isReceiverBlocked;
      state.isReceiverBlocked = action.payload.isReceiverBlocked;
    },

    resetChat: (state) => {
      (state.chatId = null),
        (state.user = null),
        (state.isCurrentUserBlocked = false),
        (state.isReceiverBlocked = false);
    },
  },
});

export default chatSlice.reducer;
export const { changeChat, changeBlock, resetChat, cleanUpChat } =
  chatSlice.actions;
