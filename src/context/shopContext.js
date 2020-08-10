import React, { Component } from "react";
import Client from "shopify-buy";
require('dotenv').config()

const ShopContext = React.createContext();

const client = Client.buildClient({
  storefrontAccessToken: '4fa429e286eadf6c966eb7a7a6938ede',
  domain: "reactprojectdiv.myshopify.com/",
});

class ShopProvider extends Component {
    state = {
      products: [],
      product: {},
      checkout: {},
      isCartOpen: false,
    };
  
    componentDidMount() {
      // this.createCheckout();
  
      //Check if localStorage has a checkout_id saved
      if (localStorage.checkout) {
        this.fetchCheckout(localStorage.checkout);
      } else {
        this.createCheckout();
      }
      //if there is no checkout_id in localStorage then we will create a new checkout
  
      //else fetch the checkout from shopify
    }
  
    createCheckout = async () => {
      const checkout = await client.checkout.create();
      localStorage.setItem("checkout", checkout.id);
      await this.setState({ checkout: checkout });
    };
  
    fetchCheckout = async (checkoutId) => {
      client.checkout
        .fetch(checkoutId)
        .then((checkout) => {
          this.setState({ checkout: checkout });
        })
        .catch((err) => console.log(err));
    };
  
    addItemToCheckout = async (variantId, quantity) => {
      const lineItemsToAdd = [
        {
          variantId,
          quantity: parseInt(quantity, 10),
        },
      ];
      const checkout = await client.checkout.addLineItems(
        this.state.checkout.id,
        lineItemsToAdd
      );
      this.setState({ checkout: checkout });
      console.log(checkout);
  
      this.openCart();
    };

    removeItemFromCheckout = async (variantId) => {
      const lineItemsToRemove = [
       variantId
      ];
      const checkout = await client.checkout.removeLineItems(
        this.state.checkout.id,
        lineItemsToRemove
      );
      this.setState({ checkout: checkout });
      console.log(checkout);
  
      this.openCart();
    };

    fetchAllProducts = async () => {
      const products = await client.product.fetchAll();
      this.setState({ products: products });
    };
  
    fetchProductWithId = async (id) => {
      const product = await client.product.fetch(id);
      this.setState({ product: product });
      // console.log(JSON.stringify(product));
  
      return product;
    };
  
    closeCart = () => {
      this.setState({ isCartOpen: false });
    };
    openCart = () => {
      this.setState({ isCartOpen: true });
    };
  
    render() {
      return (
        <ShopContext.Provider
          value={{
            ...this.state,
            fetchAllProducts: this.fetchAllProducts,
            fetchProductWithId: this.fetchProductWithId,
            closeCart: this.closeCart,
            openCart: this.openCart,
            addItemToCheckout: this.addItemToCheckout,
            removeItemFromCheckout: this.removeItemFromCheckout
          }}
        >
          {this.props.children}
        </ShopContext.Provider>
      );
    }
  }
  
  const ShopConsumer = ShopContext.Consumer;
  
  export { ShopConsumer, ShopContext };
  
  export default ShopProvider;