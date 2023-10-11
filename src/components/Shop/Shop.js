import React, { useEffect, useState } from 'react';
import './Shop.css';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDb, getShoppingCart } from '../../utilities/fakedb';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);


    useEffect(() => {
        // console.log('Products loading started before fetch')
        fetch('products.json')
            .then(res => res.json())
            .then(data => {
                setProducts(data)
                // console.log('Products loading finished');
            })
    }, []);

    useEffect(() => {
        // console.log('Shopping cart loading started', products)
        const shoppingCart = getShoppingCart();
        // console.log(shoppingCart);
        const savedCart = [];

        for (const id in shoppingCart) {

            const addedProduct = products.find(product => product.id === id);
            if (addedProduct) {
                const quantity = shoppingCart[id];
                addedProduct.quantity = quantity;
                savedCart.push(addedProduct);
            }

        }

        setCart(savedCart);
        // console.log('Shopping cart loading finished');

    }, [products]);

    const handleAddToCart = (selectedProduct) => {
        // console.log(selectedProduct);
        let newCart = [];
        const exists = cart.find(product => product.id === selectedProduct.id);
        if (!exists) {
            selectedProduct.quantity = 1;
            newCart = [...cart, selectedProduct];
        }
        else {
            const rest = cart.filter(product => product.id !== selectedProduct.id);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, exists];
        }

        setCart(newCart);
        addToDb(selectedProduct.id);
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product.id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Shop;