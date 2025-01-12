import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  //only runs when the component mounts because empty dependence array parameter []
  useEffect(() => {
    const getConversations = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users'); //sends GET request to /api/users endpoint which leads to getUsersFromSidebar function in user.controller.js
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setConversations(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    getConversations();
  },[]);

  //encapsulation, don't return the updater functions
  //loading will not be true until the await functions pull through (finally will still run even if you get an error)
  return { loading, conversations };
}

export default useGetConversations;