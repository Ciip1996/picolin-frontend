export const Endpoints = {
  Cashier: '/cashier',
  Inventory: '/inventory',
  GetInventory: '/getInventory/:idStore',
  InsertInventory: '/insertInventory',
  Sales: '/sales',
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
  Characteristics: 'lists/getCharacteristics',
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
  GetDayIncome: 'lists/getDayIncome'
};
