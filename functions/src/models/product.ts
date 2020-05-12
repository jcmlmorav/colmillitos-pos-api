function Product(description: string, code = '', quantity = 0, price = 0, active = true) {
  return {
    description,
    code,
    quantity,
    price,
    active
  }
}

export default Product;
