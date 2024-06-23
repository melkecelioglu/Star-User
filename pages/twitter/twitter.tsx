import { useEffect } from 'react';
import { useRouter } from 'next/router';


const TwitterRedirectPage = () => {
    const router = useRouter();
  
    useEffect(() => {
      window.location.href = 'https://twitter.com/Berke_genckaya';
    }, []);
  
    return null; 
  };
  
export default TwitterRedirectPage;
