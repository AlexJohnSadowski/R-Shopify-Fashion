import React, { Component } from 'react'
import Client from 'shopify-buy'

const ShopContext = React.createContext()

const client = Client.buildClient({
    storefrontAccessToken: '4fa429e286eadf6c966eb7a7a6938ede',
    domain: 'reactprojectdiv.myshopify.com/'
})

class ShopProvider extends Component {

    state = {
        products:[],
        product:{},
        checkout:{},
        isCartOpen: false,
        test:'test'
    }

    componentDidMount() {
        this.createCheckout()
    }

    createCheckout = async () => {
        const checkout = await client.checkout.create()
        this.setState({ checkout: checkout })
        console.log(checkout)
    }

    addItemToCart = async (variantId, quantity) => {
        const lineItemsToAdd = [{
            variantId,
            quantity: parseInt(quantity, 10)
        }]

        const checkout = await client.checkout.addLineItems(this.checkout.id, lineItemsToAdd)

        this.setState({ checkout: checkout})
    }

    fetchAllProducts = async () => {
        const products = await client.product.fetchAll()
        this.setState( { products: products })
    }

    fetchProductWithId = async (id) => {
        const product =  await client.product.fetch(id)
        this.setState({ product: product })
    }

    closeCart = () => {
        { this.setState({isCartOpen:false}) }
    }

    openCart = () => {
        { this.setState({isCartOpen:true}) }
    }


    render() {
        return (
            <ShopContext.Provider value={{ 
                ...this.state,
                fetchAllProducts:this.fetchAllProducts,
                fetchProductWithId: this.fetchProductWithId,
                closeCart: this.closeCart,
                openCart: this.openCart,
                addItemToCheckout: this.addItemToCheckout
                }}>
                {this.props.children}
            </ShopContext.Provider>
        )
    }
}

const ShopConsumer = ShopContext.Consumer

export { ShopConsumer, ShopContext}

export default ShopProvider