
import React, { useEffect, useState } from 'react';
import { getAllProductsApi, deleteProduct, getAverageRatingApi, getReviewsApi } from '../../apis/Api';
import { Edit, Trash2, MessageSquare, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UpdateProduct from './UpdateProduct';
import DeleteConfirmationDialog from '../../components/DeleteDialog/DeleteDialog';

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProductReviews, setSelectedProductReviews] = useState([]);
  const [productsRatings, setProductsRatings] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    getAllProductsApi()
      .then((res) => {
        if (res.data.success && res.data.products) {
          setProducts(res.data.products);
        } else {
          console.error('Error Fetching Products');
        }
      })
      .catch((error) => {
        console.error('Error Fetching Products:', error);
      });
  };

  useEffect(() => {
    for (let i = 0; i < products.length; i++) {
      getAverageRatingApi(products[i]._id)
        .then((res) => {
          if (res.status === 200) {
            const ratings = res.data.averageRating;
            const id = res.data.productId;

            setProductsRatings((prev) => {
              return { ...prev, [id]: ratings };
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [products]);

  const handleEdit = (productId) => {
    setEditProductId(productId);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProduct(deleteProductId)
      .then((res) => {
        if (res.status) {
          toast.success(res.data.message);
          fetchProducts();
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 500) {
            toast.warning(error.response.data.message);
          } else {
            toast.error('Something went wrong');
          }
        }
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
      });
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleShowReviews = (productId) => {
    getReviewsApi(productId)
      .then((res) => {
        if (res.status === 200) {
          setSelectedProductReviews(res.data.reviews);
        }
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      });
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">View Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Image</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Average Rating</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-2 border-b">
                  <img
                    src={`https://localhost:5500/products/${product.productImage}`}
                    alt={product.productName}
                    className="h-20 w-20 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 border-b">{product.productName}</td>
                <td className="px-4 py-2 border-b">{product.productCategory}</td>
                <td className="px-4 py-2 border-b">{product.productQuantity}</td>
                <td className="px-4 py-2 border-b">{product.productDescription}</td>
                <td className="px-4 py-2 border-b">${product.productPrice}</td>
                <td className="px-4 py-2 border-b">
                  {productsRatings[product._id] ? productsRatings[product._id].toFixed(1) : 'N/A'}
                  <Star className="inline-block ml-1 text-yellow-400" size={16} fill="currentColor" />
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit className="inline-block" size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700 mr-2"
                  >
                    <Trash2 className="inline-block" size={16} />
                  </button>
                  <button
                    onClick={() => handleShowReviews(product._id)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <MessageSquare className="inline-block" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditModalOpen && (
        <UpdateProduct
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          productId={editProductId}
          onUpdate={fetchProducts}
        />
      )}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
      {isReviewDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Product Reviews</h2>
            <div className="mt-4">
              {selectedProductReviews.map((review) => (
                <div key={review._id} className="mb-4 p-4 bg-gray-100 rounded">
                  <div className="flex items-center mb-2">
                    <span className="font-bold mr-2">Rating:</span>
                    {[...Array(review.rating)].map((_, index) => (
                      <Star key={index} className="text-yellow-400 " size={16} fill='currentColor' />
                    ))}
                  </div>
                  <p><span className="font-bold">Comment:</span> {review.review}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsReviewDialogOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
