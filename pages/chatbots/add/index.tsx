import React from 'react';
import { useFormik, FormikHelpers } from "formik";
import Navbar from '../../../components/Navbar';

import axios from "axios";
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

interface FormValues {
    name: string;
    personality: string;
    tone: string;
    model: string;
    accessibility: string;
    description: string;
    role: string;
    creator: string;
}
export default function Dashboard() {
  const router = useRouter();
  const account = useAccount();

  const formik = useFormik({
      initialValues: {
          name: "",
          personality: "",
          tone: "",
          model: "",
          accessibility: "",
          description: "",
          role: "",
          creator: account.address
      },
      onSubmit: async (values) => {
          await sendAssistantData({
              assistant: JSON.stringify({
                  personality: values.personality,
                  tone: values.tone,
                  model: values.model,
                  accessibility: values.accessibility,
                  name: values.name,
                  description: values.description,
                  role: values.role,
                  creator: values.creator
              }),
          });
          
      },
  });

  async function sendAssistantData(queryParams: any) {
      const queryString = new URLSearchParams(queryParams).toString();
      const apiUrl = `https://vuzzai-api-kwc645oxbq-ew.a.run.app/assistants?${queryString}`;

      try {
          const response = await axios.post(apiUrl, {}, {
              headers: {
                  'Authorization': `Bearer `
              }
          });
          console.log(response.data);
          router.push("/chatbots");
      } catch (error) {
          console.error("Error:", error);
      }
  }

  return (
      <main className="flex md:flex-row flex-col px-8 justify-center md:space-y-0 min-h-screen w-full bg-[#0f0f0f] text-white ">

      </main>
  );
}
