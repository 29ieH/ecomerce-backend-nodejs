const { BadRequestError } = require("../core/error.response");
const CartRepository = require("../models/repositories/cart.repository");
const ProductRepository = require("../models/repositories/product.repository");
const DiscountService = require("./discount.service");
const ProductFactory = require("./product.service");

class CheckoutService{
    /*
        {
            carId,
            userId,
            shopOrderIds:[
                {
                    shopId,
                    itemsOrder:[
                        {
                            productId,
                            quantity,
                            price
                        }
                    ],
                    discountShop:[
                        discountCode,
                        discountId,
                        shopId
                    ]
                },
                  {
                    shopId,
                    itemsOrder:[
                        {
                            productId,
                            quantity,
                            price
                        }
                    ],
                    discount:[
                    ]
                }
            ]
        }
    */
    static checkoutReview = async ({
        cartId,userId,shopOrderIds = []
    }) => {
        const foundCart = await CartRepository.checkExistCart({
            _id:cartId,
            cartState:'active',
            cartUserId:userId
        });
        if(!foundCart) throw new BadRequestError({message:'Cart does not exist'})
        const checkoutOrder = {
            totalPrice:0, // Tổng tiền hàng
            feeShip:0, // Phí ship
            totalDiscount:0, // Tổng tiền giảm giá áp dụng mã
            totalCheckout:0   // Tổng tiền cần thanh toán
        },shopOrderIdsNew = []
        for (let index = 0; index < shopOrderIds.length; index++) {
            const {shopId,discountShop=[],itemsOrder = []} = shopOrderIds[index];
            const checkProductServer = await ProductFactory.checkProductByServer(itemsOrder);
            console.log("Check Product Server[1]:: ",checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError({message:'Order wrong !!'})
            if (!checkProductServer || checkProductServer.some(product => !product || !product.price)) {
                    throw new BadRequestError({message:'Product information invalid or not found!'});
            }
            const checkoutPrice = checkProductServer.reduce((acc, currentValue) => {
                return acc + (currentValue.quantity * currentValue.price); // Kiểm tra giá và số lượng có tồn tại
            }, 0);
            checkoutOrder.totalPrice+=checkoutPrice;
            console.log("Checkout price:: ",checkoutPrice)
            const itemCheckout = {
                shopId,
                discountShop,
                priceRaw:checkoutPrice,
                priceApllyDiscount:checkoutPrice,
                item_products:checkProductServer
            }
            if(discountShop.length>0){
                const getAmount = await DiscountService.totalAmountDiscount({
                    userId,shopId,discounts:discountShop,products:checkProductServer
                })
                const {
                    discount,
                    totalPrice
                } = getAmount;
                itemCheckout.priceApllyDiscount = totalPrice;
                checkoutOrder.totalDiscount += discount;
            }
            checkoutOrder.totalCheckout += itemCheckout.priceApllyDiscount
            shopOrderIdsNew.push(itemCheckout)
        }
        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder
        }
    }
    /* 
        cartId:1213,
        userId:!23,
        shopOrderIds = [
        "   {
                shopId:"123",
                items:[{productId:"123"}],
                discount:[]
            }"
        ]
    
    */
}
module.exports = CheckoutService