"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Contact() {
  const params = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files && event.target.files[0]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center text-gray-500 mb-8">
        <Link href={`/${params.countryCode}`} className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">{String.fromCharCode(62)}</span>
        <span className="text-gray-700">Contact us</span>
      </div>
      <h1 className="text-2xl font-bold mb-6">Contact us</h1>

      <div className="max-w-2xl">
        <form className="space-y-6">
          <div>
            <label htmlFor="id_contact" className="block text-gray-700 text-sm font-bold mb-2">Contact with</label>
            <select name="id_contact" id="id_contact" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="3">Corporate gifts &amp; B2B</option>
              <option value="4">Customer service</option>
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email address</label>
            <input type="email" name="email" id="email" placeholder="your@email.com" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div>
            <label htmlFor="attachment" className="block text-gray-700 text-sm font-bold mb-2">Attachment (optional)</label>
            <div className="flex items-center">
              <input type="file" name="attachment" id="attachment" className="hidden" onChange={handleFileChange} />
              <label htmlFor="attachment" className="bg-[#0093D0] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer text-sm">
                Choose file
              </label>
              {selectedFile && (
                <p className="text-gray-600 text-sm ml-4">{selectedFile.name}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea 
              name="message" 
              id="message" 
              rows={5} 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span className="ml-2 text-gray-700 text-sm">I agree to the terms and conditions and the privacy policy</span>
            </label>
          </div>
          <div>
            <button 
              className="bg-[#0093D0] hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline text-sm transition-colors" 
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                const form = e.currentTarget.form;
                const formData = new FormData(form);
                
                try {
                  const response = await axios.post('/api/contact', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  });
                  alert('Message sent successfully!');
                } catch (error) {
                  alert('Failed to send message. Please try again.');
                }
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
