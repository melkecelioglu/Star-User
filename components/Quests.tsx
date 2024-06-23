import React, { useEffect, useState } from "react";
import { Roboto, Space_Mono } from "next/font/google";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import axios from "axios";
import { useAccount } from "wagmi";
 import toast from "react-hot-toast";
 import { useRouter } from "next/router";
 import { useSearchParams } from "next/navigation";
import Link from "next/link";

 interface QuestProps {
   quests: {
     description: string;
     buttonTitle: string;
     details: string;
     extras?: string;
     id: number;
     isActive: boolean;
     secondButton?: string;
   }[];
 }

interface QuestStatuses {
  [key: number]: string;
}
const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
});
const roboto3 = Roboto({
  weight: "300",
  subsets: ["latin"],
});
const space = Space_Mono({ weight: "700", subsets: ["latin"] });
const space4 = Space_Mono({ weight: "400", subsets: ["latin"] });
interface Chatbot {
  published_on_hub: boolean;
}
const Quests: React.FC<QuestProps> = ({ quests }) => {
   const [secondButtonText, setSecondButtonText] = useState("Follow VuzzMind on X");
  const address = useAccount();
  const [questStatuses, setQuestStatuses] = useState<QuestStatuses>({});
  const [twitterUserId, setTwitterUserId] = useState<string>("");

  const [isChecked, setIsChecked] = useState(false);

const handleCheckboxChange = (event:any) => {
  setIsChecked(event.target.checked);
};

  useEffect(() => {
    const fetchQuestStatus = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure you have the token
        const response = await axios.get(
          "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/get_quest_status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
           }
         );
         setQuestStatuses(response.data);

       } catch (error) {
         console.error("Error fetching quest statuses:", error);
       }
    };
    fetchQuestStatus();
  }, []); // Dependenc
  const [showPopup, setShowPopup] = useState(false);
  const [showXPopup, setShowXPopup] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const handleShowPopup = () => {
    setShowPopup(true);
    
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const [signInWithXClicked, setSignInWithXClicked] = useState(false);


  const handleShowXPopup = () => {
    window.open('https://twitter.com/VuzzMind' , '_blank')
    setShowXPopup(true);
    
  };

  const handleCloseXPopup = async () => {
    try {
      // Check if userInfo has a twitter_screen_name property and it's not an empty string
      if((userInfo as any)?.twitter_screen_name && (userInfo as any)?.twitter_screen_name !== ""){
        await updateQuestCompletion(2);
        router.reload();
      }
      else{
        toast.error("Try with different X account")
      }
    } catch (error) {
      console.log(error);
      
      setShowXPopup(false);
    } finally {
      setShowXPopup(false);
       // Close the popup regardless of the quest update
    }
  };


  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/get_user_info",
          config
        );
        console.log(response.data);
        setUserInfo(response.data);
        // Open the modal after fetching data
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
  }, []);
  useEffect(() => {
    const fetchQuestStatus = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure you have the token
        const response = await axios.get(
          "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/get_quest_status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestStatuses(response.data);
      } catch (error) {
        console.error("Error fetching quest statuses:", error);
      }
    };
    fetchQuestStatus();
  }, []); // Dependenc
  //want to update quest to "completed" after quest done
  // const handleQuestSubmit = (id: number) => {
  //   if (id === 2) {
  //     claimSepoliaEth();
  //   } else {
  //     console.log(`Submitted quest with ID: ${id}`);
  //     // Handle other quests here
   //   }

   const [searchParams] = useSearchParams();
   const [xName , setXName] = useState("");

   useEffect(() => {
     const searchParams = new URLSearchParams(window.location.search);
     const oauthToken = searchParams.get('oauth_token');
     const oauthVerifier = searchParams.get('oauth_verifier');

     const fetchTwitterUserData = (oauthToken: string | null, oauthVerifier: string | null) => {
      axios.get('https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/twitter-callback', {
        params: {
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier,
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then(response => {
        console.log('User data:', response.data);
        setXName(response.data.screen_name);
        toast.success("Connected to X successfully!");
        // Here you can set state or perform other actions with the response data
      })
      .catch((error) => {
        console.error('Error fetching Twitter user data:', error.message);
        
        // Handle error and inform the user
      });
    };
    
     if (oauthToken && oauthVerifier) {
       fetchTwitterUserData(oauthToken, oauthVerifier);
     }
   }, [xName]); 


   const handleConnectXClick = async () => {
     try {
      const response = await axios.get(
        "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/start-twitter-auth",{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      console.log("Twitter auth started:" + response.data);
      const twitterAuthURL = response.data.url;
      console.log("Twitter auth URL:" + twitterAuthURL);
      window.location.href = twitterAuthURL;
      setSignInWithXClicked(true);
    } catch (error) {
      console.log("Error checking Twitter relationship:", error);
      toast.error("Failed to check Twitter relationship");
    }
  };
  const updateQuestCompletion = async (questId: number) => {
    try {
      // You'll need to ensure you're sending the JWT token in this request for authentication
      const token = localStorage.getItem("token"); // Or however you're storing the token
      await axios.post(
        `https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/complete_quest`,
        { quest_id: questId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Quest ${questId} completed successfully.`);
    } catch (error) {
      console.error(`Error completing quest ${questId}:`, error);
    }
  };
  const router = useRouter();
  const claimSepoliaEth = async () => {
    try {
      const response = await axios.post(
        "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/claim-sepolia-eth",
        {
          to_address: address.address,
        }
      );
      toast.success("Sepolia ETH claimed successfully!");
      console.log("Transaction sent:", response.data);
      await updateQuestCompletion(3);
      return response.data;
    } catch (error) {
      console.error("Error claiming Sepolia ETH:", error);
      toast.error("Failed to claim Sepolia ETH");
    }
  };
  const claimTestVuzz = async () => {
    try {
      const response = await axios.post(
        "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/claim-vuzz-tokens",
        {
          to_address: address.address,
          value: 100000000000,
        }
      );
      console.log("Transaction sent:", response.data);
      toast.success("tSTRK claimed successfully!");
      updateQuestCompletion(4);
      // Optionally, handle the response data here, e.g., showing a success message
      if (response.status === 200) {
        await updateQuestCompletion(3);
        toast.success("Quest completed successfully!");
        return response.data; // or simply return true if you don't need the response data
      } else {
        throw new Error(
          `Failed to claim tVUZZ: status code ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error claiming tVUZZ:", error);
      toast.error("Failed to claim tVUZZ");
      return false;
      // Optionally, handle the error here, e.g., showing an error message
    }
  };
  const [isChatbot, setIsChatbot] = useState(false);
  useEffect(() => {
    const fetchHubChatbots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/my-chatbots",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Filter the chatbots to find if any is published on the hub
        const publishedChatbots = response.data.filter(
          (chatbot: Chatbot) => chatbot.published_on_hub
        );
        if (publishedChatbots.length > 0) {
          setIsChatbot(true);
          // If there are published chatbots, automatically complete Quest 5
          await updateQuestCompletion(6);
          // Assuming Quest 5 ID is 5, adjust accordingly if different
        }
      } catch (error) {
        console.error("Failed to fetch chatbots", error);
        // Optionally, handle error, e.g., showing an error message
      }
    };
    fetchHubChatbots();
  }, []);
  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://vuzz-testnetapi-9e048bbe5549.herokuapp.com/my-chatbots",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.length > 0) {
          setIsChatbot(true);
        }
      } catch (error) {
        console.error("Failed to fetch chatbots", error);
        // Handle error
      }
    };
    fetchChatbots();
  }, []); // Empty depende
  const handleQuestSubmit = async (id: number) => {
     if (id === 1 && address.address === (userInfo as any)?.wallet) {
       toast.success("Wallet Imported");
       await updateQuestCompletion(id);
       router.reload();
     }

     if (id === 2) {
       const loadingToast = toast.loading("Following on X ...", {
         duration: 5000,
       });
       handleConnectXClick();
       setSecondButtonText("Following...");
       

     }

     if (id === 4) {
       const loadingToast = toast.loading("Claiming tSTRK...", {
         duration: 5000,
       });
       try {
        await claimTestVuzz();
        
      } catch (error) {
        // If there's an error in claimTestVuzz, it will be caught here
        console.error("Error claiming tSTRK:", error);
        // Don't call updateQuestCompletion if there's an error
      } finally {
        // You might want to close the loading toast here or do some other cleanup
        toast.dismiss(loadingToast);
      }

     }

     if (isChatbot === true && id === 6) {
      router.push("/chatbots");
    }
    if (isChatbot === true && id === 5) {
      await updateQuestCompletion(id);
      router.reload();
      toast.success("Quest completed successfully!");
    }
    if (id === 5 && isChatbot === false) {
      router.push("/chatbots/add");
    }
    if (id === 3) {
      try {
        // Display a loading toast initially
        const loadingToast = toast.loading("Claiming Sepolia ETH...");
        // Await the claim operation
        await claimSepoliaEth();
        // Update loading toast to success
        toast.success("Sepolia ETH claimed successfully!", {
          id: loadingToast,
         });
         // Now update the quest completion status
         
         router.reload();
         // Optionally, show another toast for successful completion update
         toast.success("Quest completed successfully!");
       } catch (error) {
        // If there's an error, update the loading toast to show the error message
        toast.error("Failed to claim Sepolia ETH");
      }
    }
  };
  const handleNewButton = () => {
    // Define functionality for the new button here
    console.log("New button clicked");
   };
   return (
    <div className={`flex flex-col w-full md:max-w-[60%] h-full border border-[#6c6c6c] p-4 bg-black`}>
      <div className="flex w-full items-center pb-4 justify-between">
        <p className="text-white text-3xl">Quests</p>
         <p className="text-white text-xs"> {(userInfo as any)?.twitter_screen_name}</p> 
        {address.address === (userInfo as any)?.wallet ? (
          <ConnectButton />
        ) : (
          <button
            onClick={handleShowPopup}
            className="px-4 py-2 border w-[150px] mt-4"
            style={{ boxShadow: "2px 2px 0px 0px rgba(255,255,255)" }}
          >
            Get Wallet
          </button>
        )}
        {showPopup && (
          <div className="fixed top-0 z-10 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-black w-full max-w-[800px] shadow-[4px_4px_0px_0px_rgba(250,250,250)] flex flex-col items-center p-12 text-white">
            
              <p className="text-center w-full text-lg pb-12">
                Welcome to StarkUser Testnet{" "}
                {userInfo ? (userInfo as any).email : "Loading..."}. If you want
                to continue please import and connect your StarkUser Wallet.
              </p>
              <p className="text-center w-full break-words text-base pb-12">
                Your $tSTRK wallet address:<br />
                {userInfo ? (userInfo as any).wallet : "Loading..."}
              </p>
              <p className="text-center w-full break-words text-base pb-12">
                Your private key:<br />
                {userInfo ? (userInfo as any).privatekey : "Loading..."}
              </p>
              <Link href="https://support.metamask.io/hc/en-us/articles/360015489331-How-to-import-an-account" target="_blank" className=" pb-12 underline">How to import account to Metamask</Link>

              <ConnectButton />
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 border w-[150px] mt-4"
                style={{ boxShadow: "2px 2px 0px 0px rgba(255,255,255)" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showXPopup && (
          <div className="fixed top-0 z-10 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-black w-full max-w-[800px] shadow-[4px_4px_0px_0px_rgba(250,250,250)] flex flex-col items-center p-12 text-white">
            
              <p className="text-center w-full text-lg pb-12">
              Confirm you followed VuzzMind on x Attention: A snapshot will be taken at an undisclosed date and time before the token launched. Users who do not follow us at that moment will not be eligible for the tesnet reward
              </p>
              <div className="flex w-full  justify-center">
                <input
                  type="checkbox"
                  className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                  onChange={handleCheckboxChange}
                  checked={isChecked}
                />
                <label className=" text-gray-500 ms-3 dark:text-gray-400">
                  I have followed StarkUser on X
                </label>
              </div>
              <button
                onClick={() => handleCloseXPopup()}
                className="px-4 py-2 border w-[150px] mt-4"
                style={{ boxShadow: "2px 2px 0px 0px rgba(255,255,255)" }}
                disabled={!isChecked} 
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {quests.map((quest, index) => {
        const isCompleted = questStatuses[quest.id] === "completed";
        return (
          <React.Fragment key={index}>
            <div className={`flex z-0 flex-col border py-8 px-4 ${
              address.address === (userInfo as any)?.wallet
                ? "opacity-100"
                : "opacity-20"
              } ${
              isCompleted
                ? "opacity-50 shadow-[4px_4px_0px_0px_rgba(74,222,128)]"
                : quest.isActive
                ? "shadow-[4px_4px_0px_0px_rgba(255,255,255)] "
                : "opacity-50 shadow-[4px_4px_0px_0px_rgba(253,224,71)]"
              } `}
            >
              <p className="pb-4">Step #{index + 1}</p>
              <label
                htmlFor={`check-${index}`}
                className={`text-2xl text-white ${space.className}`}
              >
                {quest.description}
              </label>
              <p className={`py-2 ${space4.className}`}>{quest.details}</p>
              <p className={`text-base break-words text-white ${space.className}`}>
                {quest.extras}
              </p>
              <div className="flex space-x-4">
                <button
                  disabled={isCompleted || (address.address !== (userInfo as any)?.wallet)}
                  onClick={() => handleQuestSubmit(quest.id)}
                  className="px-4 py-2 border w-[150px] mt-4"
                  style={{
                    boxShadow: "2px 2px 0px 0px rgba(255,255,255)",
                    backgroundColor: isCompleted ? "black" : "transparent",
                  }}
                >
                  {quest.isActive ? (isCompleted ? "Done !" : quest.buttonTitle) : "Coming Soon"}
                </button>
                {quest.buttonTitle === "Sign In With X" ? (
                  <div className="flex">
                    <button
                      disabled={!(userInfo as any)?.twitter_screen_name|| isCompleted || (address.address !== (userInfo as any)?.wallet) }
                      onClick={() => handleShowXPopup()}
                      className="px-4 py-2 border disabled:opacity-50 w-[150px] mt-4"
                      style={{
                        boxShadow: "2px 2px 0px 0px rgba(255,255,255)",
                        backgroundColor: isCompleted ? "black" : "transparent",
                      }}
                    >
                      {isCompleted ? "Done !" : quest.secondButton}
                    </button>
                   
                  </div>
                ) : null}
              </div>
            </div>
            <br />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Quests;
