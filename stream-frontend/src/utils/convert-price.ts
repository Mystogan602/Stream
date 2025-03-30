export function convertPrice(price: number) {
    return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};
