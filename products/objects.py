
class Productos():
    id=0
    amount=0
    hours=0
    
    
    def nueva_cotizacion(lista):
        articulos=[]
        for l in lista:
            
            articulo=Productos()
            articulo.id=int(l["product_id"])
            articulo.amount=int(l["amount"])
            articulo.hours=int(l["hours"])
            articulos.append(articulo)
        return articulos
    