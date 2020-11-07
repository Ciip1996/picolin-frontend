SELECT x.productCode, x.stock as stockBodega, x.store as bodega, s.Store as tienda FROM (
SELECT inv.productCode, inv.stock, inv.idStore, s.store
FROM inventory inv, store s
WHERE inv.stock = 0
AND inv.idStore = s.idStore
AND s.store <> 'Bodega'
UNION ALL
SELECT inv.productCode, inv.stock, inv.idStore, s.store
FROM inventory inv, store s
WHERE  inv.stock <> 0
AND inv.idStore = s.idStore
AND s.store = 'Bodega'
) x ,inventory inv, store s
WHERE x.stock > 0
AND inv.idStore = s.idStore
AND s.store <> 'Bodega'
AND inv.stock = 0 
AND inv.productCode = x.productCode;