import { useState } from 'react';
import { useParams } from 'react-router-dom';



const PaymentCard = () => {

    const { id } = useParams();
console.log(id)

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {

      const userID = sessionStorage.getItem('email');
      console.log(userID)

      if (!userID) {
        console.error('User email not found in session');
        return;
      }
      console.log(userID, id)
      const response = await fetch('http://127.0.0.1:5002/api/addPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userID, payment_method: 'Visa Card', subscription: id }),
      });

      if (response.ok) {
     
        console.log(response);
      } else {

        console.error('Error addings payment method:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding payment method:', error.message);
    } 
  };

  return (
    <div className='w-screen h-screen bg-black flex items-center'>
          <div className="max-w-md mx-auto  bg-white rounded-lg overflow-hidden shadow-md">
      <div className="px-6 py-4">
        <div className="mb-6">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter card number"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">Card Holder</label>
          <input
            type="text"
            id="cardHolder"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter card holder's name"
          />
        </div>
        <div className="flex justify-between mb-6">
          <div className="w-1/2 mr-2">
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry</label>
            <input
              type="text"
              id="expiry"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="MM/YY"
            />
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="CVV"
            />
          </div>
        </div>
        <button onClick={handleSubmit} className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Pay Now
        </button>
      </div>
      <div className="bg-gray-200 px-6 py-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png"
          alt="Visa"
          className="h-8 w-auto mx-auto"
        />
      </div>
    </div>
    </div>
  
  );
};

export default PaymentCard;
