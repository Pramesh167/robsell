import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { updateProduct, getSingleProductApi } from '../../apis/Api';
import { toast } from 'react-hot-toast';

Modal.setAppElement('#root');

const UpdateProduct = ({ isOpen, onRequestClose, productId, onUpdate }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productNewImage, setProductNewImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);
  const [oldImage, setOldImage] = useState('');

  useEffect(() => {
    if (productId) {
      getSingleProductApi(productId)
        .then((res) => {
          setProductName(res.data.product.productName);
          setProductPrice(res.data.product.productPrice);
          setProductCategory(res.data.product.productCategory);
          setProductQuantity(res.data.product.productQuantity);
          setProductDescription(res.data.product.productDescription);
          setOldImage(res.data.product.productImage);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [productId]);

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductNewImage(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productCategory', productCategory);
    formData.append('productQuantity', productQuantity);
    formData.append('productDescription', productDescription);
    if (productNewImage) {
      formData.append('productImage', productNewImage);
    }
    updateProduct(productId, formData)
      .then((res) => {
        if (res.data.success ) {
          toast.success(res.data.message);
          onUpdate();
          onRequestClose();
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        }
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Product"
      className="max-w-2xl mx-auto my-16 p-6 bg-white rounded shadow-lg overflow-auto max-h-[80vh]"
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="Standard Bot">Standard</option>
              <option value="Wedge Bot">Wedgebot</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
          <input
            type="number"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Current Image</label>
          <div className="flex justify-center items-center mb-2">
            {oldImage ? (
              <img
                src={`http://localhost:5500/products/${oldImage}`}
                alt="Current Product"
                className="h-40 w-40 object-cover rounded"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-2">New Image</label>
          <input
            type="file"
            onChange={handleImage}
            className="w-full px-3 py-2 border rounded"
          />
          {previewNewImage && (
            <div className="flex justify-center items-center mt-2">
              <img
                src={previewNewImage}
                alt="New Product"
                className="h-40 w-40 object-cover rounded"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onRequestClose}
            className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
          >
            Update Product
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProduct;
