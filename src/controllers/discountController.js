const {OK} = require('../core/success.response')
const DiscountService = require('../services/discount.service')
class DiscountController{
    static generateByShop = async (req,res,next) => {
        const {userId} = req.user; 
        new OK({
            message:'Discount created',
            metaData: await DiscountService.generateDiscountByShop({
                ...req.body,shopId:userId
            })
        }).send(res)
    }
    static updateBySop = async (req,res,next) => {
        const {userId} = req.user; 
        const {discountId} = req.params;
        new OK({
            message:'Discount created',
            metaData: await DiscountService.updateDiscountByShop({
                shopId:userId,
                discountId,
                body:req.body
            })
        }).send(res)
    }
    static getAllDiscount = async (req,res,next) => {
        new OK({
            message:'Get all discount succesful',
            metaData: await DiscountService.getAllDiscount(req.query)
        }).send(res)
    }
    static getDiscountByCode = async (req,res,next) => {
        const {codeId} = req.params;
        new OK({
            message:`Get discount by ${codeId}`,
            metaData:await DiscountService.getDiscountByCode({codeId})
        }).send(res)
    }
    static getProductByDiscount = async (req,res,next) => {
        new OK({
            message:`Get products by discount code succesful`,
            metaData:await DiscountService.getAllProductByDiscount(req.query)
        }).send(res)
    }
    static deleteDiscountByCode = async (req,res,next) => {
        const {discountId} = req.params;
        const {userId} = req.user;
        new OK({
            message:`Delete discount successful`,
            metaData:await DiscountService.deleteDiscountByCode({
                shopId:userId,
                discountId
            })
        }).send(res)
    }
    static getAmountByCode  = async (req,res,next) => {
        const {userId} = req.user;
        new OK({
            message:`Get amount discount successful`,
            metaData:await DiscountService.getDiscountAmount({userId,...req.body})
        }).send(res)
    }
    static cancelDiscountByUser = async (req,res,next) => {
        const {userId} = req.user;
        new OK({
            message:`Cancel discount successful`,
            metaData:await DiscountService.cancelDiscountByUser({userId,...req.body})
        }).send(res)
    }
}
module.exports = DiscountController;