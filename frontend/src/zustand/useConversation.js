import {create} from 'zustand';

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({selectedConversation}), //hook for selectedConversation
    messages:[],
    setMessages: (messages) => set({messages}), //hook for messages
}));

export default useConversation;