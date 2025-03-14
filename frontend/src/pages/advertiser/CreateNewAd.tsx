import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useCreatePaymentIntentMutation, useCreateAdMutation, useUploadAdImageMutation } from '../../store/slices/adApiSlice';
import PaymentForm from '../../components/adComponents/PaymentForm';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../../components/adComponents/Sidebar';

const stripePromise: Promise<Stripe | null> = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const CreateNewAd = () => {
  const navigate = useNavigate();
  const advertiserToken = localStorage.getItem('advertiserToken');
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [createAd] = useCreateAdMutation();
  const [uploadImage] = useUploadAdImageMutation();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [advertiserId, setAdvertiserId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    placement: 'popup' as 'popup' | 'card',
    imageUrl: '',
    price: 0,
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    imageFile: null as File | null,
    imagePreview: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!advertiserToken) {
      navigate('/advertiser/login');
    } else {
      const decodedToken = jwtDecode<{ advertiserId: string }>(advertiserToken);
      const advertiserId = decodedToken.advertiserId;
      console.log(advertiserId, "Advertiser ID");
      setAdvertiserId(advertiserId);
    }
    try {
      if (!formData.imageFile) throw new Error("Image is required");
  
      // 1. Upload image
      const imageFormData = new FormData();
      imageFormData.append("image", formData.imageFile);
      const { imageUrl } = await uploadImage(imageFormData).unwrap();
  
      // 2. Update formData with imageUrl and price
      const priceMap = { popup: 150, card: 100 };
      const price = priceMap[formData.placement];
      
      const updatedFormData = {
        ...formData,
        imageUrl,
        price
      };
      setFormData(updatedFormData);
  
      // 3. Create payment intent
      const response = await createPaymentIntent({
        amount: price,
        placement: formData.placement,
      }).unwrap();
     
      setClientSecret(response.clientSecret);
      setPaymentIntentId(response.paymentIntentId);
      
      
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handlePaymentSuccess = async () => {
    try {
      if (!paymentIntentId) {
        console.error('Missing payment intent ID');
        return;
      }
  
      const createAdRequest = {
        adData: {
          advertiserId: advertiserId,
          title: formData.title,
          description: formData.description,
          placement: formData.placement,
          imageUrl: formData.imageUrl,
          price: formData.price,
          status: formData.status
        },
        paymentIntentId: paymentIntentId
      };
  
      console.log("Calling createAd with:", createAdRequest); // Debugging log
      const response = await createAd(createAdRequest).unwrap();
      console.log(response, "Ad Created Successfully");
      navigate('/advertiser/my-ads');
    } catch (error) {
      console.error('Error creating ad:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="createad" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">Create New Ad</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Welcome, Advertiser</span>
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
              />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Ad Details</h2>
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Ad Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="placement" className="block text-sm font-medium text-gray-700">Ad Placement</label>
                    <select
                      id="placement"
                      name="placement"
                      value={formData.placement}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="popup">Popup</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Ad Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Ad Creative</label>
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {formData.imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Preview:</p>
                        <img src={formData.imagePreview} alt="Ad preview" className="max-h-40 rounded-md" />
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2 mt-6">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Ad
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateNewAd;