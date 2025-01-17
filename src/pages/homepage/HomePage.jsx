import React, { useEffect, useState } from 'react';
import { getAllProductsApi, getAverageRatingApi } from "../../apis/Api";
import Navbar from '../../components/navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import Products from '../Products/Products';
import Banner from '../../components/Banner/Banner';
import { ArrowRightIcon, Star } from 'lucide-react';
import Footer from '../../components/footer/Footer';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsRatings, setProductsRatings] = useState({});
  const [randomLink, setRandomLink] = useState('');

  useEffect(() => {
    getAllProductsApi()
      .then((res) => {
        if (res.status === 201) {
          setProducts(res.data.products);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      for (let i = 0; i < products.length; i++) {
        try {
          const res = await getAverageRatingApi(products[i]._id);
          if (res.status === 200) {
            const ratings = res.data.averageRating;
            const id = res.data.productId;

            setProductsRatings((prev) => ({
              ...prev, 
              [id]: ratings
            }));
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    if (products.length > 0) {
      fetchRatings();
    }
  }, [products]);

  useEffect(() => {
    console.log(productsRatings);
  }, [productsRatings]);

  useEffect(() => {
    setRandomLink(generateRandomLink());
  }, []);

  const generateRandomLink = () => {
    const links = ['/sunglasses', '/powerglasses'];
    return links[Math.floor(Math.random() * links.length)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        
        <section className="mt-16 mb-12">
          <h2 className="text-center text-3xl font-bold text-gray-50 mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((singleProduct) => (
              <div 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out" 
                key={singleProduct._id}
              >
                <Products productInformation={singleProduct} color={'red'} />
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Average Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" />
                      <span className="text-sm font-semibold text-gray-800">
                        {productsRatings[singleProduct._id] ? productsRatings[singleProduct._id].toFixed(1) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
          <a 
  href={randomLink} 
  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
>
  View All Products
  <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
</a>
          </div>
        </section>

        <Banner />

        <Footer />
        
      </main>
      
    </div>
  );
};

export default HomePage;
