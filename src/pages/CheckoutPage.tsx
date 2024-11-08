import { Link } from 'react-router-dom';
import {
  FaUser,
  FaAddressCard,
  FaCity,
  FaMapPin,
  FaGlobe,
  FaCreditCard,
  FaCalendar,
  FaLock,
  FaTruck,
} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const STORAGE_KEY = 'checkoutFormData';

const CheckoutPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const formData = watch();

  useEffect(() => {
    if (!formData) return;
    const savedData = localStorage.getItem(STORAGE_KEY);
    const currentData = { ...JSON.parse(savedData || '{}'), ...formData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  }, [formData]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key: string) => {
        setValue(key, parsedData[key]);
      });
    }
  }, [setValue]);

  const onSubmit = (data: any) => {
    navigate('/checkout/summary', { state: data });
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-gray-100 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('fullName', {
                    required: 'Full Name is required',
                  })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative">
                <FaAddressCard className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <div className="relative">
                <FaCity className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.city.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <div className="relative">
                <FaMapPin className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('zip', { required: 'Zip Code is required' })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.zip && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.zip.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="relative">
                <FaGlobe className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('country', { required: 'Country is required' })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.country.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <div className="relative">
                <FaCreditCard className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('cardNumber', {
                    required: 'Card Number is required',
                  })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cardNumber.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <div className="relative">
                <FaCalendar className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('expiryDate', {
                    required: 'Expiry Date is required',
                  })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.expiryDate.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  {...register('cvv', { required: 'CVV is required' })}
                  className="mt-1 block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cvv.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Delivery Method</h2>
          <div className="relative">
            <FaTruck className="absolute top-3 left-3 text-gray-400" />
            <select
              {...register('deliveryMethod', {
                required: 'Delivery Method is required',
              })}
              className="mt-1 block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
            >
              <option value="Standard">Standard (3-5 days)</option>
              <option value="Express">Express (1-2 days)</option>
            </select>
            {errors.deliveryMethod && (
              <p className="text-red-500 text-xs mt-1">
                {errors.deliveryMethod.message?.toString()}
              </p>
            )}
          </div>
        </section>

        <div className="flex justify-between">
          <Link
            to="/cart"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Back to Cart
          </Link>
          <button
            type="submit"
            className={`bg-pink-700 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isValid}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
