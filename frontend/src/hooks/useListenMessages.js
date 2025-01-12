import { useSocketContext } from '../context/SocketContext'
import useConversation from '../zustand/useConversation'
import { useEffect } from 'react'
import notificationSound from '../assets/sounds/notification.mp3'

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { messages, setMessages } = useConversation();

    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();
            setMessages([...messages, newMessage])
        })

        //this line is important so we don't stack calls (this will stack notification sounds)
        return () => socket?.off('newMessage')
    }, [socket, setMessages, messages])
}

export default useListenMessages;