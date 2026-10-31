const product = require("../src/product.js");
const ShoppingCart = require('../src/shoppingCart');



test('Добавление в корзину товаров', ()=>{
    const data = [
    new product("123", "Iphone 16", 60000, 200),
    new product("124", "Sumsung Galaxy S8", 55000, 300),
    new product("125", "Coffee mashine", 20000, 150),
    new product("126", "disk R18", 8000, 1000)
]
    const cart = new ShoppingCart();
    cart.add("123", 100, data);
    cart.add("124", 100, data);
    cart.add("124", 50, data);

    expect(cart.array).toEqual( {"123" : 100, "124" : 150});
    expect(data[0].getStock()).toEqual( 100);
    expect(data[1].getStock()).toEqual( 150);

    expect(() => {
        cart.add("125", 200, data)
    }).toThrow("Количество добавляемых товаров больше, чем есть на складе.");

    expect(() => {
        cart.add("125", 0, data)
    }).toThrow("Некорректное количество товара.");

    expect(() => {
        cart.add("125", -100, data)
    }).toThrow("Некорректное количество товара.");

    expect(() => {
        cart.add("127", 100, data)
    }).toThrow("Данный товар отсутствует на складе.");
});

test('Уменьшение количества товара', ()=> {
    const data = [
    new product("123", "Iphone 16", 60000, 200),
    new product("124", "Sumsung Galaxy S8", 55000, 300),
    new product("125", "Coffee mashine", 20000, 150),
    new product("126", "disk R18", 8000, 1000)
]
    const cart = new ShoppingCart();
    //добавляем товары
    cart.add("123", 100, data); cart.add("126", 300, data);
    //уменьшаем их количество
    cart.lessCount("123", 50, data); cart.lessCount("126", 100, data);

    expect(cart.array).toEqual({"123": 50, "126":200});
    expect(data[0].getStock()).toEqual(150);
    expect(data[3].getStock()).toEqual(800);

    expect(() => {
        cart.lessCount("123", 100, data)
    }).toThrow("Некорректно введенное количество товара.");

    expect(() => {
        cart.lessCount("123", -100, data)
    }).toThrow("Некорректно введенное количество товара.");

    expect(() => {
        cart.lessCount("127", 100, data)
    }).toThrow("Данного товара нет в корзине.");

    cart.lessCount("123", 50, data);
    expect(cart.array).toEqual({"126" : 200});


});


test('Удаление товара из корзины', ()=> {
    const data = [
    new product("123", "Iphone 16", 60000, 200),
    new product("124", "Sumsung Galaxy S8", 55000, 300),
    new product("125", "Coffee mashine", 20000, 150),
    new product("126", "disk R18", 8000, 1000)
]
    const cart = new ShoppingCart();

    cart.add("123", 100, data); cart.add("126", 300, data);

    cart.delProduct("123", data);
    cart.delProduct("126", data);

    expect(cart.array).toEqual({});
    //проверяем количество товара на складе
    expect(data[0].getStock()).toEqual(200);
    expect(data[3].getStock()).toEqual(1000);


    //удаляем несуществующий товар
    expect(()=> {
        cart.delProduct("123", data);
    }).toThrow("Данного товара нет в корзине.");
});


//проверяем работу метода расчета полной стоимости
test('Полная стоимость', ()=>{
    const data = [
    new product("123", "Iphone 16", 60000, 200),
    new product("124", "Sumsung Galaxy S8", 55000, 300),
    new product("125", "Coffee mashine", 20000, 150),
    new product("126", "disk R18", 8000, 1000)
]
    const cart = new ShoppingCart();

    //случай когда корзина пуста
    expect(()=> {
        cart.allCost(data);
    }).toThrow("Корзина пуста!");


    //добавляем товары в корзину(неважно каким способом)
    for (let i = 3; i < 7; i++){
        let del = 1;
        if (i%2 == 0)
            del = 2;
        cart.add("12" + i, 100*del, data);
    }

    //проверка общей стоимости
    expect(cart.allCost(data)).toEqual(20600000);
});

//проверяем общую стоимость со скидкой
test('Использование промокода', ()=>{

    const data = [
    new product("123", "Iphone 16", 60000, 200),
    new product("124", "Sumsung Galaxy S8", 55000, 300),
    new product("125", "Coffee mashine", 20000, 150),
    new product("126", "disk R18", 8000, 1000)
]
    const cart = new ShoppingCart();

    //неверный промокод
    expect(()=>{
        cart.promoDis("DISCOUNT14");
    }).toThrow("Неверный промокод!");

    //поле скидка не должно меняться
    expect(cart.discount).toEqual(0.0);

    //снова добавляем товары в корзину 
    for (let i = 3; i < 7; i++){
        let del = 1;
        if (i%2 == 0)
            del = 2;
        cart.add("12" + i, 100*del, data);
    }

    //расчитываем общую стоимость с использованием скидок
    cart.promoDis("DISCOUNT10");

    expect(cart.allCost(data)).toEqual(18540000);

    cart.promoDis("DISCOUNT50");

    expect(cart.allCost(data)).toEqual(10300000);

});