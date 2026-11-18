// ===== MENU DATA — edit prices/items here =====
// Item: {id,name,desc,price,img}  OR with sizes: {id,name,desc,sizes:{Small:499,...}}
// Category image: put a file named <category id>.jpg in assets/images/categories/ (e.g. burgers.jpg).
// To use a different file name/path for one category, add  img:"assets/images/categories/my-photo.png"  to that category.
const MENU = [
 {id:"deals",title:"Deals & Combos",items:[
  {id:"d1",name:"Deal 1",desc:"Nuggets, fries & 345 ml drink (please confirm full contents)",price:649},
  {id:"d2",name:"Deal 2",desc:"1 Zingister burger, 1 fries, 345 ml drink",price:549},
  {id:"d3",name:"Deal 3",desc:"2 small pizzas, 1 litre drink",price:1100},
  {id:"d4",name:"Deal 4",desc:"2 medium pizzas, 1.5 litre drink",price:1950},
  {id:"d5",name:"Deal 5",desc:"2 large pizzas, 1.5 litre drink",price:2900},
  {id:"d6",name:"Deal 6",desc:"4 Zingister burgers, 1 large fries, 1.5 litre drink",price:2100}]},
 {id:"burgers",title:"Burgers",items:[
  {id:"b1",name:"Zingister Burger",desc:"",price:450},
  {id:"b2",name:"Crispo Burger",desc:"",price:500},
  {id:"b3",name:"Grill Burger",desc:"",price:550},
  {id:"b4",name:"Double Decker Burger",desc:"",price:700},
  {id:"b5",name:"Tikka Patty Burger",desc:"",price:350},
  {id:"b6",name:"Pizza Burger",desc:"",price:350}]},
 {id:"broast",title:"Crispy Broast",items:[
  {id:"br1",name:"Quarter Broast",desc:"Thigh + chest + fries + garlic sauce + dinner roll + 345 ml drink",price:750},
  {id:"br2",name:"Half Broast",desc:"Thigh + chest + wing + fries + garlic sauce + dinner roll + 1 litre Coke",price:1200},
  {id:"br3",name:"Full Broast",desc:"2 thigh, 2 chest, 2 leg, 2 wing, fries, 2 garlic sauces, 2 dinner rolls, 1.5 litre drink",price:2300}]},
 {id:"pizza",title:"Pizza",items:[
  {id:"p1",name:"Tikka Pizza",desc:"",sizes:{Small:499,Medium:899,Large:1399}},
  {id:"p2",name:"Fajita Pizza",desc:"",sizes:{Small:499,Medium:899,Large:1399}},
  {id:"p3",name:"Cheese Lover Pizza",desc:"",sizes:{Small:499,Medium:899,Large:1399}}]},
 {id:"special",title:"Special Pizza",note:"Special pizza is not included in deals.",items:[
  {id:"sp1",name:"Creamy Pizza",desc:"Meer's Special",sizes:{Medium:1199,Large:1699}},
  {id:"sp2",name:"Beef Pepperoni Pizza",desc:"Meer's Special",sizes:{Medium:1199,Large:1699}},
  {id:"sp3",name:"Lasagna Pizza",desc:"Meer's Special",sizes:{Medium:1199,Large:1699}},
  {id:"sp4",name:"Kabab Stuff Pizza",desc:"Meer's Special",sizes:{Medium:1199,Large:1699}},
  {id:"sp5",name:"Crave Crown Pizza",desc:"Meer's Special",sizes:{Medium:1199,Large:1699}}]},
 {id:"wraps",title:"Wraps & Shawarmas",items:[
  {id:"w1",name:"Chicken Shawarma",desc:"",price:300},
  {id:"w2",name:"Arabian Shawarma",desc:"",price:450},
  {id:"w3",name:"Malai Botti Shawarma",desc:"",price:450},
  {id:"w4",name:"Hot Grill Shawarma",desc:"",price:350},
  {id:"w5",name:"Meer's Special Platter",desc:"",price:850},
  {id:"w6",name:"Zingister Wrap",desc:"",price:350},
  {id:"w7",name:"Tortilla Wrap",desc:"",price:650},
  {id:"w8",name:"Grill Wrap",desc:"",price:650},
  {id:"w9",name:"Zinger Shawarma",desc:"",price:450}]},
 {id:"rolls",title:"Rolls",items:[
  {id:"r1",name:"Chicken Bihari Roll",desc:"",price:650},
  {id:"r2",name:"Chicken Kabab Roll",desc:"",price:350},
  {id:"r3",name:"Chicken Malai Botti Roll",desc:"",price:450},
  {id:"r4",name:"Zingister Roll",desc:"",price:450},
  {id:"r5",name:"Meer's Special Roll",desc:"",price:580},
  {id:"r6",name:"Chicken Grill Roll",desc:"",price:450}]},
 {id:"fries",title:"Fries",items:[
  {id:"f1",name:"Simple Fries",desc:"",price:200},
  {id:"f2",name:"Loaded Fries",desc:"",price:550},
  {id:"f3",name:"Pizza Fries",desc:"",price:750}]},
 {id:"appetizers",title:"Appetizers",items:[
  {id:"a1",name:"Hot Wings",desc:"",price:450},
  {id:"a2",name:"Nuggets",desc:"",price:350},
  {id:"a3",name:"Pizza Fries",desc:"",price:750},
  {id:"a4",name:"Cheese Pasta",desc:"",price:850},
  {id:"a5",name:"Chicken Sandwich",desc:"",price:550},
  {id:"a6",name:"Grill Sandwich",desc:"",price:650}]},
 {id:"dips",title:"Dips",items:[
  {id:"dp1",name:"Cold Garlic",desc:"",price:80},{id:"dp2",name:"Chipotle",desc:"",price:80},
  {id:"dp3",name:"Mint Sauce",desc:"",price:80},{id:"dp4",name:"Honey Mustard",desc:"",price:80},
  {id:"dp5",name:"BBQ Sauce",desc:"",price:80},{id:"dp6",name:"Shawarma Sauce",desc:"",price:80}]},
 {id:"tea",title:"Tea & Coffee",items:[
  {id:"t1",name:"Tea",desc:"",price:70},{id:"t2",name:"Special Tea",desc:"",price:120},{id:"t3",name:"Hot Coffee",desc:"",price:200}]}
];
