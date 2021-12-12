export const Endpoints = {
  Cashier: '/cashier',
  CloseCashier: '/closeCashier',
  Inventory: '/inventory',
  GetInventory: '/getInventory/:idStore',
  InsertInventory: '/insertInventory',
  Sales: '/sales',
  ProductNames: '/names',
  GetSales: '/getSales/:idStore',
  GetSaleDetails: '/getSaleDetail/:id',
  GetSaleDetailsByIdSale: '/getSaleDetailsByIdSale/:id',
  NewSale: '/insertSale',
  Transfers: '/transfers',
  GetTransfers: '/getTransfer/:idStore',
  InsertTransfer: '/insertTransfer',
  Roles: 'lists/roles',
  Colors: 'lists/getColors',
  Stores: 'lists/getStore',
  GetTypes: 'lists/getTypes',
  Materials: 'lists/getMaterials',
  Provider: 'lists/getProviders',
  Sizes: 'lists/getSizes',
  Genders: 'lists/getGenders',
  Users: 'lists/getUsers',
  StorePayments: '/getStorePayments/:idStore',
  StorePaymentCategories: '/lists/getStorePaymentCategories',
  RegisterStorePayment: '/registerStorePayment',
  PaymentMethods: 'lists/getPaymentMethods',
  Login: '/login',
  RegisterUser: '/registerUser',
  GetRoles: 'lists/getRoles',
  GetDayIncome: 'lists/getDayIncome',
  GetNames: 'lists/getNames',
  GetProductNames: '/getNames',
  GetProductNameDetailsByIdName: '/getNameById/:id',
  InsertProductNames: '/insertProductName',
  Products: '/products', // TODO: add on backend
  GetProducts: '/getProducts/:idStore' // TODO: add on backend
};
